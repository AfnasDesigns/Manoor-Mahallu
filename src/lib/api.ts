import {
  User,
  Family,
  Member,
  MadrasaStudent,
  MadrasaTeacher,
  StudentMarks,
  Payment,
  Transaction,
  Programme,
  Announcement,
  Registration,
  CommunityService,
  ServiceRequest,
  ProblemCase,
  DashboardStats,
  Certificate,
  AuditLog,
} from '../types/index.ts';

const TOKEN_KEY = 'manoor_auth_token';
const USER_KEY = 'manoor_auth_user';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  const data = localStorage.getItem(USER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function setStoredSession(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredSession(): { token: string | null; user: User | null } {
  return {
    token: getStoredToken(),
    user: getStoredUser(),
  };
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Network request failed');
  }

  return data as T;
}

export const api = {
  // Auth
  login: (username: string, password: string) =>
    request<{ user: User; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  register: (payload: any) =>
    request<{ user: User; member: Member; family: Family; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getMe: () => request<{ user: User }>('/api/auth/me'),

  logout: () => {
    clearStoredSession();
    return request<{ success: boolean }>('/api/auth/logout', { method: 'POST' });
  },

  // Dashboard
  getStats: () => request<DashboardStats>('/api/dashboard/stats'),
  getCharts: () => request<any[]>('/api/dashboard/charts'),

  // Families
  getFamilies: (query?: string) =>
    request<Family[]>(`/api/families${query ? `?q=${encodeURIComponent(query)}` : ''}`),
  getFamilyById: (id: string) =>
    request<{ family: Family; members: Member[]; students: MadrasaStudent[]; payments: Payment[] }>(
      `/api/families/${id}`
    ),
  createFamily: (familyData: Partial<Family>) =>
    request<Family>('/api/families', {
      method: 'POST',
      body: JSON.stringify(familyData),
    }),
  addMemberToFamily: (familyId: string, memberData: Partial<Member>) =>
    request<Member>(`/api/families/${familyId}/members`, {
      method: 'POST',
      body: JSON.stringify(memberData),
    }),

  // Members
  getMembers: (query?: string) =>
    request<Member[]>(`/api/members${query ? `?q=${encodeURIComponent(query)}` : ''}`),
  getMemberById: (id: string) => request<Member>(`/api/members/${id}`),
  updateMember: (id: string, updates: Partial<Member>) =>
    request<Member>(`/api/members/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  getCurrentMemberProfile: () =>
    request<{ user: User; member: Member; family: Family | null; payments: Payment[] }>(
      '/api/member-profile/current'
    ),

  // Madrasa
  getMadrasaStudents: () => request<MadrasaStudent[]>('/api/madrasa/students'),
  getStudents: () => request<MadrasaStudent[]>('/api/madrasa/students'),
  admitStudent: (payload: any) =>
    request<MadrasaStudent>('/api/madrasa/students', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getMadrasaTeachers: () => request<MadrasaTeacher[]>('/api/madrasa/teachers'),
  recordAttendance: (payload: any) =>
    request<any>('/api/madrasa/attendance', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getStudentMarks: (studentId: string) =>
    request<StudentMarks[]>(`/api/madrasa/marks/${studentId}`),
  recordMarks: (payload: any) =>
    request<StudentMarks>('/api/madrasa/marks', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getMadrasaToppers: () => request<StudentMarks[]>('/api/madrasa/toppers'),

  // Finance
  getPayments: (familyId?: string) =>
    request<Payment[]>(`/api/finance/payments${familyId ? `?familyId=${familyId}` : ''}`),
  createPayment: (payload: any) =>
    request<Payment>('/api/finance/payments', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getTransactions: () => request<Transaction[]>('/api/finance/transactions'),
  createTransaction: (payload: any) =>
    request<Transaction>('/api/finance/transactions', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Programmes
  getProgrammes: () => request<Programme[]>('/api/programmes'),
  getTodayProgrammes: () => request<Programme[]>('/api/programmes/today'),
  createProgramme: (payload: any) =>
    request<Programme>('/api/programmes', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateProgramme: (id: string, payload: any) =>
    request<Programme>(`/api/programmes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteProgramme: (id: string) =>
    request<{ success: boolean }>(`/api/programmes/${id}`, {
      method: 'DELETE',
    }),
  registerForProgramme: (id: string) =>
    request<{ success: boolean; registeredCount: number }>(`/api/programmes/${id}/register`, {
      method: 'POST',
    }),

  // Announcements
  getAnnouncements: () => request<Announcement[]>('/api/announcements'),
  createAnnouncement: (payload: any) =>
    request<Announcement>('/api/announcements', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Registrations Hub
  getRegistrations: (phone?: string) =>
    request<Registration[]>(`/api/registrations${phone ? `?phone=${phone}` : ''}`),
  createRegistration: (payload: any) =>
    request<Registration>('/api/registrations', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateRegistrationStatus: (id: string, status: string, notes?: string) =>
    request<Registration>(`/api/registrations/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    }),

  // Community Services
  getServices: () => request<CommunityService[]>('/api/services'),
  getServiceRequests: () => request<ServiceRequest[]>('/api/services/requests'),
  createServiceRequest: (payload: any) =>
    request<ServiceRequest>('/api/services/requests', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateServiceRequestStatus: (id: string, status: string, responseNotes?: string, assignedTo?: string) =>
    request<ServiceRequest>(`/api/services/requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status, responseNotes, assignedTo }),
    }),

  // Confidential Grievance Desk
  getProblemCases: () => request<ProblemCase[]>('/api/problem-solving'),
  createProblemCase: (payload: any) =>
    request<ProblemCase>('/api/problem-solving', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Zakat & Warasath
  getZakatConfig: () => request<any>('/api/zakat/config'),
  updateZakatConfig: (payload: any) =>
    request<any>('/api/zakat/config', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  calculateZakat: (payload: any) =>
    request<any>('/api/zakat/calculate', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  saveZakatCalculation: (payload: any) =>
    request<any>('/api/zakat/save', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getMyZakatCalculations: () => request<any[]>('/api/zakat/my-calculations'),
  deleteZakatCalculation: (id: string) =>
    request<any>(`/api/zakat/calculations/${id}`, {
      method: 'DELETE',
    }),
  calculateWarasath: (payload: any) =>
    request<any>('/api/warasath/calculate', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  saveWarasathCase: (payload: any) =>
    request<any>('/api/warasath/save', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getMyWarasathCases: () => request<any[]>('/api/warasath/my-cases'),
  getWarasathCaseById: (id: string) => request<any>(`/api/warasath/cases/${id}`),
  submitWarasathReview: (caseId: string, notes?: string) =>
    request<any>('/api/warasath/submit-review', {
      method: 'POST',
      body: JSON.stringify({ caseId, notes }),
    }),
  recordScholarReview: (payload: any) =>
    request<any>('/api/warasath/scholar-review', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Certificates
  getCertificates: () => request<Certificate[]>('/api/certificates'),
  createCertificate: (payload: any) =>
    request<Certificate>('/api/certificates', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  verifyCertificate: (query: string) =>
    request<{
      verified: boolean;
      certificateNumber?: string;
      type?: string;
      recipientName?: string;
      houseName?: string;
      issueDate?: string;
      authorizedSignatory?: string;
      purpose?: string;
      message?: string;
    }>(`/api/certificates/verify/${encodeURIComponent(query)}`),

  // Audit Logs
  getAuditLogs: () => request<AuditLog[]>('/api/audit-logs'),

  // Global Search
  search: (query: string) => request<any>(`/api/search?q=${encodeURIComponent(query)}`),

  // AI Assistant
  askManoorAI: (message: string, history?: any[]) =>
    request<{ reply: string }>('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, history }),
    }),

  generateAdminDraft: (action: string, prompt: string) =>
    request<{ draft: string }>('/api/ai/admin-draft', {
      method: 'POST',
      body: JSON.stringify({ action, prompt }),
    }),
};
