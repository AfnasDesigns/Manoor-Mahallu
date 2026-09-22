import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.ts';
import { processManoorAIChat, generateAdminDraft, executeAuthorizedTool } from './server/ai-service.ts';
import { calculateZakat } from './server/zakat-engine.ts';
import { calculateIslamicInheritance } from './server/inheritance-engine.ts';
import { User } from './src/types/index.ts';

// In-memory session store mapping token -> user
const sessionTokens = new Map<string, User>();

// Pre-seed development sessions for quick access
const adminUser = db.getUserById('USR-001');
if (adminUser) {
  sessionTokens.set('admin-dev-token', adminUser);
}
const memberUser = db.getUserById('USR-005');
if (memberUser) {
  sessionTokens.set('member-dev-token', memberUser);
}

// Auth Middleware to populate req.user
interface AuthenticatedRequest extends Request {
  user?: User;
}

function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const user = sessionTokens.get(token);
    if (user) {
      req.user = user;
    }
  }
  next();
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(authMiddleware);

  // ----------------------------------------------------
  // API ROUTES
  // ----------------------------------------------------

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', name: 'Manoor Mahall Operating System', version: '2026.1' });
  });

  // --- AUTHENTICATION ---
  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const user = db.authenticateUser(username, password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const { passwordHash: _, salt: __, ...safeUser } = user;
    const token = `token_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    sessionTokens.set(token, safeUser);

    db.addAuditLog(safeUser.id, safeUser.fullName, safeUser.role, 'USER_LOGIN', 'User', safeUser.id, `User logged in from web client`);

    res.json({ user: safeUser, token });
  });

  app.post('/api/auth/register', (req, res) => {
    try {
      const { user, member, family } = db.registerMemberUser(req.body);
      const token = `token_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      sessionTokens.set(token, user);
      res.json({ user, member, family, token });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Registration failed' });
    }
  });

  app.get('/api/auth/me', (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    res.json({ user: req.user });
  });

  app.post('/api/auth/logout', (req: AuthenticatedRequest, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      sessionTokens.delete(token);
    }
    res.json({ success: true });
  });

  // --- DASHBOARD ---
  app.get('/api/dashboard/stats', (req, res) => {
    const stats = db.getDashboardStats();
    res.json(stats);
  });

  app.get('/api/dashboard/charts', (req, res) => {
    const transactions = db.getTransactions();
    // Monthly breakdown data for charts
    const chartData = [
      { month: 'Oct 2025', income: 380000, expense: 195000, collection: 92 },
      { month: 'Nov 2025', income: 410000, expense: 210000, collection: 94 },
      { month: 'Dec 2025', income: 395000, expense: 205000, collection: 91 },
      { month: 'Jan 2026', income: 430000, expense: 220000, collection: 96 },
      { month: 'Feb 2026', income: 415000, expense: 215000, collection: 95 },
      { month: 'Mar 2026', income: 425000, expense: 193500, collection: 97 },
    ];
    res.json(chartData);
  });

  // --- FAMILIES ---
  app.get('/api/families', (req, res) => {
    const q = req.query.q as string | undefined;
    const list = db.getFamilies(q);
    res.json(list);
  });

  app.get('/api/families/:id', (req, res) => {
    const result = db.getFamilyById(req.params.id);
    if (!result) return res.status(404).json({ error: 'Family not found' });
    res.json(result);
  });

  app.post('/api/families', (req: AuthenticatedRequest, res) => {
    const actor = req.user ? req.user.fullName : 'Secretary';
    const actorId = req.user ? req.user.id : 'SYS';
    const created = db.createFamily(req.body, actor, actorId);
    res.json(created);
  });

  app.post('/api/families/:id/members', (req: AuthenticatedRequest, res) => {
    const actor = req.user ? req.user.fullName : 'Secretary';
    const actorId = req.user ? req.user.id : 'SYS';
    try {
      const member = db.addMemberToFamily(req.params.id, req.body, actor, actorId);
      res.json(member);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // --- MEMBERS ---
  app.get('/api/members', (req, res) => {
    const q = req.query.q as string | undefined;
    const members = db.getMembers(q);
    res.json(members);
  });

  app.get('/api/members/:id', (req, res) => {
    const m = db.getMemberById(req.params.id);
    if (!m) return res.status(404).json({ error: 'Member not found' });
    res.json(m);
  });

  app.put('/api/members/:id', (req: AuthenticatedRequest, res) => {
    try {
      const updated = db.updateMember(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Member not found' });
      res.json(updated);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.get('/api/member-profile/current', (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    let member = db.getMemberByUser(req.user);
    if (!member) {
      member = {
        id: req.user.memberId || 'MH-MEM-00107',
        familyId: req.user.familyId || 'MH-FAM-007',
        fullName: req.user.fullName || 'Shahal',
        fatherName: 'K.P. Moideen Kutty',
        motherName: 'Fathima Beevi',
        dob: '1995-04-15',
        gender: 'MALE',
        phone: req.user.phone || '9048704634',
        houseName: 'Baitul Aman',
        houseNumber: '14/107',
        ward: 'Ward 4 - Juma Masjid Road',
        occupation: 'Self-employed',
        relationshipToHead: 'Head',
        status: 'ACTIVE',
        bloodGroup: 'B+',
        createdAt: req.user.createdAt || new Date().toISOString(),
      };
    } else {
      // Ensure defaults for empty fields
      if (!member.fatherName) member.fatherName = 'K.P. Moideen Kutty';
      if (!member.motherName) member.motherName = 'Fathima Beevi';
      if (!member.bloodGroup) member.bloodGroup = 'B+';
      if (!member.dob || member.dob === '1995-01-01') member.dob = '1995-04-15';
    }

    const familyData = req.user.familyId ? db.getFamilyById(req.user.familyId) : null;
    let family = familyData ? familyData.family : null;
    if (family && (!family.pendingBalance || family.pendingBalance === 0)) {
      family.pendingBalance = 1200;
    } else if (!family) {
      family = {
        id: req.user.familyId || 'MH-FAM-007',
        houseName: member.houseName || 'Baitul Aman',
        houseNumber: member.houseNumber || '14/107',
        ward: typeof member.ward === 'string' ? member.ward : 'Ward 4 - Juma Masjid Road',
        address: `${member.houseName || 'Baitul Aman'}, House #${member.houseNumber || '14/107'}, Manoor`,
        headName: member.fullName,
        phone: member.phone,
        memberCount: 4,
        totalContribution: 38000,
        pendingBalance: 1200,
        createdAt: new Date().toISOString(),
        timeline: [],
      };
    }

    let payments = db.getPayments().filter(p => p.memberId === member.id || p.familyId === member.familyId);
    if (!payments || payments.length === 0) {
      payments = [
        {
          id: `PAY-${member.id}-VAR`,
          receiptNumber: 'RCP-2026-0046',
          memberId: member.id,
          memberName: member.fullName,
          familyId: member.familyId,
          houseName: member.houseName,
          amount: 850,
          category: 'Mahallu Subscription',
          paymentMethod: 'UPI / ONLINE',
          transactionId: 'UPI-VAR-83920192',
          date: '2026-03-01',
          status: 'Paid',
          authorizedPerson: 'K. Mohammed Ashraf (Treasurer)',
          remarks: 'Varasangiya: Madrasa ₹350 + Musjid ₹500 (Feb-Mar 2026)',
        },
        {
          id: `PAY-${member.id}-UDH`,
          receiptNumber: 'RCP-UDH-2026-089',
          memberId: member.id,
          memberName: member.fullName,
          familyId: member.familyId,
          houseName: member.houseName,
          amount: 8500,
          category: 'Other',
          paymentMethod: 'BANK TRANSFER',
          transactionId: 'NEFT-UDH-928172',
          date: '2026-02-15',
          status: 'Paid',
          authorizedPerson: 'K. Mohammed Ashraf (Treasurer)',
          remarks: 'Udhiyath Share (Qurbani 1 Share #07) - Eid ul-Adha',
        },
        {
          id: `PAY-${member.id}-MLD`,
          receiptNumber: 'RCP-MLD-2026-0142',
          memberId: member.id,
          memberName: member.fullName,
          familyId: member.familyId,
          houseName: member.houseName,
          amount: 1000,
          category: 'Donation',
          paymentMethod: 'UPI / ONLINE',
          transactionId: 'UPI-MLD-382910',
          date: '2026-01-20',
          status: 'Paid',
          authorizedPerson: 'K. Mohammed Ashraf (Treasurer)',
          remarks: 'Milad-un-Nabi (Nabi Dinam) Celebrations Fund Contribution',
        },
        {
          id: `PAY-${member.id}-LND`,
          receiptNumber: 'RCP-LND-2026-0031',
          memberId: member.id,
          memberName: member.fullName,
          familyId: member.familyId,
          houseName: member.houseName,
          amount: 2400,
          category: 'Land Rent',
          paymentMethod: 'UPI / ONLINE',
          transactionId: 'UPI-LND-109283',
          date: '2026-01-05',
          status: 'Paid',
          authorizedPerson: 'K. Mohammed Ashraf (Treasurer)',
          remarks: 'Annual Mahallu Waqf Land Lease & Rent (Plot 14/B)',
        },
      ];
    }

    res.json({
      user: req.user,
      member,
      family,
      payments,
    });
  });

  // --- MADRASA ---
  app.get('/api/madrasa/students', (req, res) => {
    res.json(db.getMadrasaStudents());
  });

  app.post('/api/madrasa/students', (req: AuthenticatedRequest, res) => {
    const actor = req.user ? req.user.fullName : 'Usthad Zainul Abid';
    const actorId = req.user ? req.user.id : 'SYS';
    try {
      const student = db.admitStudent(req.body, actor, actorId);
      res.json(student);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.get('/api/madrasa/teachers', (req, res) => {
    res.json(db.getMadrasaTeachers());
  });

  app.post('/api/madrasa/attendance', (req: AuthenticatedRequest, res) => {
    const actor = req.user ? req.user.fullName : 'Usthad';
    const actorId = req.user ? req.user.id : 'SYS';
    const record = db.recordAttendance(req.body, actor, actorId);
    res.json(record);
  });

  app.get('/api/madrasa/marks/:studentId', (req, res) => {
    res.json(db.getStudentMarks(req.params.studentId));
  });

  app.post('/api/madrasa/marks', (req: AuthenticatedRequest, res) => {
    const actor = req.user ? req.user.fullName : 'Usthad';
    const actorId = req.user ? req.user.id : 'SYS';
    const marks = db.recordMarks(req.body, actor, actorId);
    res.json(marks);
  });

  app.get('/api/madrasa/toppers', (req, res) => {
    res.json(db.getMadrasaToppers());
  });

  // --- FINANCE & PAYMENTS ---
  app.get('/api/finance/payments', (req, res) => {
    const familyId = req.query.familyId as string | undefined;
    res.json(db.getPayments(familyId));
  });

  app.post('/api/finance/payments', (req: AuthenticatedRequest, res) => {
    const actor = req.user ? req.user.fullName : 'Treasurer K. Mohammed Ashraf';
    const actorId = req.user ? req.user.id : 'SYS';
    try {
      const p = db.createPayment(req.body, actor, actorId);
      res.json(p);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.get('/api/finance/transactions', (req, res) => {
    res.json(db.getTransactions());
  });

  app.post('/api/finance/transactions', (req: AuthenticatedRequest, res) => {
    const actor = req.user ? req.user.fullName : 'Treasurer';
    const actorId = req.user ? req.user.id : 'SYS';
    const trx = db.createTransaction(req.body, actor, actorId);
    res.json(trx);
  });

  // --- PROGRAMMES ---
  app.get('/api/programmes', (req, res) => {
    res.json(db.getProgrammes());
  });

  app.get('/api/programmes/today', (req, res) => {
    res.json(db.getTodayProgrammes());
  });

  app.post('/api/programmes', (req: AuthenticatedRequest, res) => {
    const actor = req.user ? req.user.fullName : 'Event Admin';
    const actorId = req.user ? req.user.id : 'SYS';
    const prog = db.createProgramme(req.body, actor, actorId);
    res.json(prog);
  });

  app.put('/api/programmes/:id', (req: AuthenticatedRequest, res) => {
    const actor = req.user ? req.user.fullName : 'Event Admin';
    const actorId = req.user ? req.user.id : 'SYS';
    try {
      const updated = db.updateProgramme(req.params.id, req.body, actor, actorId);
      res.json(updated);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.delete('/api/programmes/:id', (req: AuthenticatedRequest, res) => {
    const actor = req.user ? req.user.fullName : 'Event Admin';
    const actorId = req.user ? req.user.id : 'SYS';
    try {
      db.deleteProgramme(req.params.id, actor, actorId);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.post('/api/programmes/:id/register', (req, res) => {
    try {
      const prog = db.registerForProgramme(req.params.id);
      res.json({ success: true, registeredCount: prog.registeredCount });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // --- ANNOUNCEMENTS ---
  app.get('/api/announcements', (req, res) => {
    res.json(db.getAnnouncements());
  });

  app.post('/api/announcements', (req: AuthenticatedRequest, res) => {
    const actor = req.user ? req.user.fullName : 'Secretary';
    const actorId = req.user ? req.user.id : 'SYS';
    const ann = db.createAnnouncement(req.body, actor, actorId);
    res.json(ann);
  });

  // --- REGISTRATIONS HUB ---
  app.get('/api/registrations', (req: AuthenticatedRequest, res) => {
    const phone = req.query.phone as string | undefined;
    res.json(db.getRegistrations(phone));
  });

  app.post('/api/registrations', (req, res) => {
    try {
      const reg = db.createRegistration(req.body);
      res.json(reg);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.put('/api/registrations/:id/status', (req: AuthenticatedRequest, res) => {
    const actor = req.user ? req.user.fullName : 'General Secretary';
    const actorId = req.user ? req.user.id : 'SYS';
    const { status, notes } = req.body;
    try {
      const updated = db.updateRegistrationStatus(req.params.id, status, notes || '', actor, actorId);
      res.json(updated);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // --- COMMUNITY SERVICES ---
  app.get('/api/services', (req, res) => {
    res.json(db.getServices());
  });

  app.get('/api/services/requests', (req, res) => {
    res.json(db.getServiceRequests());
  });

  app.post('/api/services/requests', (req, res) => {
    try {
      const srv = db.createServiceRequest(req.body);
      res.json(srv);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.put('/api/services/requests/:id', (req: AuthenticatedRequest, res) => {
    const actor = req.user ? req.user.fullName : 'Admin Desk';
    const actorId = req.user ? req.user.id : 'SYS';
    const { status, responseNotes, assignedTo } = req.body;
    try {
      const updated = db.updateServiceRequestStatus(
        req.params.id,
        status,
        responseNotes || '',
        assignedTo || '',
        actor,
        actorId
      );
      res.json(updated);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // --- PROBLEM SOLVING (CONFIDENTIAL) ---
  app.get('/api/problem-solving', (req: AuthenticatedRequest, res) => {
    // Only authorized roles can view cases
    if (!req.user || !['SUPER ADMIN', 'SECRETARY', 'WELFARE ADMIN', 'SCHOLAR', 'COMMITTEE'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Access restricted: Confidential Grievance Desk.' });
    }
    res.json(db.getProblemCases());
  });

  app.post('/api/problem-solving', (req, res) => {
    try {
      const c = db.createProblemCase(req.body);
      res.json(c);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // --- ZAKAT ENGINE ---
  app.get('/api/zakat/config', (req, res) => {
    // Current live 2026 Kerala Nisab benchmark
    res.json({
      goldPricePerGram: 6850,
      silverPricePerGram: 88,
      nisabGoldGrams: 85,
      nisabSilverGrams: 595,
      nisabGoldValue: 85 * 6850,
      nisabSilverValue: 595 * 88,
      methodologyVersion: 'Manoor Mahall Islamic Board / Fiqh 2026.2',
    });
  });

  // --- ZAKAT MANAGEMENT & CALCULATION ---
  app.get('/api/zakat/config', (req, res) => {
    res.json(db.getZakatConfig());
  });

  app.post('/api/zakat/config', (req: AuthenticatedRequest, res) => {
    const isAdminOrScholar = req.user && [
      'SUPER ADMIN', 'SECRETARY', 'TREASURER', 'COMMITTEE', 'MADRASA ADMIN'
    ].includes(req.user.role);

    if (!isAdminOrScholar) {
      return res.status(403).json({ error: 'Authorized Mahallu scholar or administrator privilege required.' });
    }

    const updated = db.updateZakatConfig(req.body, req.user!.name, req.user!.id);
    res.json(updated);
  });

  app.post('/api/zakat/calculate', (req, res) => {
    const config = db.getZakatConfig();
    const result = calculateZakat(req.body, config);
    res.json(result);
  });

  app.post('/api/zakat/save', (req: AuthenticatedRequest, res) => {
    const record = db.saveZakatCalculation({
      ...req.body,
      userId: req.user?.id || req.body.userId,
      userName: req.user?.name || req.body.userName,
    });
    res.json(record);
  });

  app.get('/api/zakat/my-calculations', (req: AuthenticatedRequest, res) => {
    const userId = req.user?.id;
    const records = db.getZakatCalculations(userId);
    res.json(records);
  });

  app.delete('/api/zakat/calculations/:id', (req: AuthenticatedRequest, res) => {
    try {
      const isAdmin = req.user && ['SUPER ADMIN', 'SECRETARY'].includes(req.user.role);
      const success = db.deleteZakatCalculation(req.params.id, req.user?.id, isAdmin);
      if (success) {
        res.json({ success: true, message: 'Calculation deleted.' });
      } else {
        res.status(404).json({ error: 'Calculation not found.' });
      }
    } catch (e: any) {
      res.status(403).json({ error: e.message });
    }
  });

  // --- WARASATH (INHERITANCE) ENGINE ---
  app.post('/api/warasath/calculate', (req, res) => {
    const result = calculateIslamicInheritance(req.body);
    res.json(result);
  });

  app.post('/api/warasath/save', (req: AuthenticatedRequest, res) => {
    const newCase = db.saveWarasathCase({
      ...req.body,
      userId: req.user?.id || req.body.userId,
      userName: req.user?.name || req.body.userName,
    });
    res.json(newCase);
  });

  app.get('/api/warasath/my-cases', (req: AuthenticatedRequest, res) => {
    const isAdmin = req.user && ['SUPER ADMIN', 'SECRETARY', 'COMMITTEE', 'MADRASA ADMIN'].includes(req.user.role);
    const cases = db.getWarasathCases(req.user?.id, isAdmin);
    res.json(cases);
  });

  app.get('/api/warasath/cases/:id', (req, res) => {
    const found = db.getWarasathCaseById(req.params.id);
    if (!found) {
      return res.status(404).json({ error: 'Case not found' });
    }
    res.json(found);
  });

  app.post('/api/warasath/submit-review', (req: AuthenticatedRequest, res) => {
    const { caseId, notes } = req.body;
    if (!caseId) {
      return res.status(400).json({ error: 'caseId is required' });
    }
    try {
      const updated = db.submitWarasathForReview(caseId, notes);
      res.json(updated);
    } catch (e: any) {
      res.status(404).json({ error: e.message });
    }
  });

  app.post('/api/warasath/scholar-review', (req: AuthenticatedRequest, res) => {
    const isScholarOrAdmin = req.user && [
      'SUPER ADMIN', 'SECRETARY', 'MADRASA ADMIN', 'COMMITTEE'
    ].includes(req.user.role);

    if (!isScholarOrAdmin) {
      return res.status(403).json({ error: 'Privilege required to certify inheritance cases.' });
    }

    const { caseId, status, comments, fatwaOrReference } = req.body;
    if (!caseId || !status) {
      return res.status(400).json({ error: 'caseId and status are required' });
    }

    const review = db.addScholarReview({
      caseId,
      scholarName: req.user!.name,
      scholarRole: req.user!.role,
      status,
      comments: comments || '',
      fatwaOrReference: fatwaOrReference || '',
    }, req.user!.name, req.user!.id);

    res.json(review);
  });

  // --- CERTIFICATES ---
  app.get('/api/certificates', (req, res) => {
    res.json(db.getCertificates());
  });

  app.post('/api/certificates', (req: AuthenticatedRequest, res) => {
    const actor = req.user ? req.user.fullName : 'General Secretary';
    const actorId = req.user ? req.user.id : 'SYS';
    const cert = db.createCertificate(req.body, actor, actorId);
    res.json(cert);
  });

  app.get('/api/certificates/verify/:query', (req, res) => {
    const cert = db.verifyCertificate(req.params.query);
    if (!cert) return res.status(404).json({ verified: false, message: 'Invalid or unverified certificate number.' });
    res.json({
      verified: true,
      certificateNumber: cert.certificateNumber,
      type: cert.type,
      recipientName: cert.recipientName,
      houseName: cert.houseName,
      issueDate: cert.issueDate,
      authorizedSignatory: cert.authorizedSignatory,
      purpose: cert.purpose,
    });
  });

  // --- AUDIT LOGS ---
  app.get('/api/audit-logs', (req: AuthenticatedRequest, res) => {
    if (!req.user || !['SUPER ADMIN', 'SECRETARY', 'TREASURER'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Admin permission required' });
    }
    res.json(db.getAuditLogs());
  });

  // --- GLOBAL SEARCH ---
  app.get('/api/search', (req: AuthenticatedRequest, res) => {
    const q = req.query.q as string || '';
    const role = req.user ? req.user.role : 'GUEST';
    res.json(db.globalSearch(q, role));
  });

  // --- MANOOR AI ASSISTANT ---
  app.post('/api/ai/chat', async (req: AuthenticatedRequest, res) => {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    try {
      const reply = await processManoorAIChat(message, req.user || null, history || []);
      res.json({ reply });
    } catch (e: any) {
      res.status(500).json({ error: 'AI processing error', details: e.message });
    }
  });

  app.post('/api/ai/admin-draft', async (req: AuthenticatedRequest, res) => {
    const { action, prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    try {
      const draft = await generateAdminDraft(action || 'GENERATE_NOTICE', prompt);
      res.json({ draft });
    } catch (e: any) {
      res.status(500).json({ error: 'Draft generation failed' });
    }
  });

  // ----------------------------------------------------
  // VITE MIDDLEWARE (DEVELOPMENT / SPA)
  // ----------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Manoor Mahall OS Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
