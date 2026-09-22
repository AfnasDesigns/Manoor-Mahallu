import { GoogleGenAI } from '@google/genai';
import { db } from './db.ts';
import { User } from '../src/types/index.ts';
import { calculateZakat } from './zakat-engine.ts';
import { calculateIslamicInheritance } from './inheritance-engine.ts';

let genAIInstance: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!genAIInstance) {
    genAIInstance = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIInstance;
}

// Authorized Server-Side Tool Execution
export function executeAuthorizedTool(
  toolName: string,
  args: Record<string, any>,
  currentUser: User | null
): { success: boolean; data?: any; error?: string } {
  const isAdmin = currentUser && [
    'SUPER ADMIN', 'SECRETARY', 'TREASURER', 'MADRASA ADMIN', 'EVENT ADMIN', 'WELFARE ADMIN', 'COMMITTEE'
  ].includes(currentUser.role);

  switch (toolName) {
    case 'getUpcomingProgrammes': {
      const programmes = db.getProgrammes().filter(p => p.status === 'UPCOMING' || p.status === 'LIVE');
      return { success: true, data: programmes };
    }

    case 'getTodayEvents': {
      const today = db.getTodayProgrammes();
      return { success: true, data: today };
    }

    case 'getAnnouncements': {
      const notices = db.getAnnouncements();
      return { success: true, data: notices };
    }

    case 'getServices': {
      const services = db.getServices();
      return { success: true, data: services };
    }

    case 'getMemberPayments': {
      if (!currentUser) {
        return { success: false, error: 'Authentication required to view member payments.' };
      }
      const familyId = currentUser.familyId;
      if (!familyId && !isAdmin) {
        return { success: false, error: 'No associated family profile found.' };
      }
      const payments = db.getPayments(isAdmin && args.familyId ? args.familyId : familyId);
      return { success: true, data: payments };
    }

    case 'getFamilyMembers': {
      if (!currentUser) {
        return { success: false, error: 'Authentication required to view family members.' };
      }
      const familyId = args.familyId && isAdmin ? args.familyId : currentUser.familyId;
      if (!familyId) {
        return { success: false, error: 'No family record attached to this user.' };
      }
      const famData = db.getFamilyById(familyId);
      return { success: true, data: famData };
    }

    case 'getRegistrationStatus': {
      const trackingId = args.trackingId || args.id;
      if (!trackingId) {
        return { success: false, error: 'Tracking ID is required.' };
      }
      const allRegs = db.getRegistrations();
      const match = allRegs.find(r => r.id.toLowerCase() === trackingId.toLowerCase());
      if (!match) {
        return { success: false, error: `No registration found with reference ${trackingId}.` };
      }
      // If member, check permission
      if (!isAdmin && currentUser && match.familyId && match.familyId !== currentUser.familyId) {
        return { success: false, error: 'Unauthorized to view details of another family registration.' };
      }
      return {
        success: true,
        data: {
          id: match.id,
          type: match.type,
          applicantName: match.applicantName,
          status: match.status,
          submittedAt: match.submittedAt,
          reviewNotes: match.reviewNotes || 'Under active administrative review.',
        }
      };
    }

    case 'getFinanceSummary': {
      if (!isAdmin) {
        return { success: false, error: 'Admin permission required to view financial balance and records.' };
      }
      const stats = db.getDashboardStats();
      return { success: true, data: stats };
    }

    case 'getPendingPayments': {
      if (!isAdmin) {
        return { success: false, error: 'Admin permission required.' };
      }
      const families = db.getFamilies().filter(f => f.pendingBalance > 0);
      return { success: true, data: families.slice(0, 10) };
    }

    case 'getStudentStatistics': {
      if (!isAdmin && currentUser?.role !== 'TEACHER') {
        return { success: false, error: 'Madrasa permission required.' };
      }
      const students = db.getMadrasaStudents();
      const toppers = db.getMadrasaToppers();
      return {
        success: true,
        data: {
          totalStudents: students.length,
          toppers: toppers.slice(0, 5),
        }
      };
    }

    case 'calculateZakat': {
      const config = db.getZakatConfig();
      const calcResult = calculateZakat(args, config);
      return { success: true, data: calcResult };
    }

    case 'getMyZakatCalculations': {
      if (!currentUser) {
        return { success: false, error: 'Sign in to access your saved Zakat calculations.' };
      }
      const records = db.getZakatCalculations(currentUser.id);
      return { success: true, data: records };
    }

    case 'calculateWarasath': {
      const calcResult = calculateIslamicInheritance(args as any);
      return { success: true, data: calcResult };
    }

    case 'getMyWarasathCases': {
      const cases = db.getWarasathCases(currentUser?.id, Boolean(isAdmin));
      return { success: true, data: cases };
    }

    case 'submitWarasathReview': {
      if (!args.caseId) {
        return { success: false, error: 'Inheritance Case ID is required.' };
      }
      try {
        const updated = db.submitWarasathForReview(args.caseId, args.notes || 'Submitted via Manoor AI assistant');
        return { success: true, data: updated };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }

    default:
      return { success: false, error: `Unknown tool: ${toolName}` };
  }
}

// Generate Response using Gemini API or Local Knowledge Engine
export async function processManoorAIChat(
  userMessage: string,
  currentUser: User | null,
  conversationHistory: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<string> {
  const normalizedMsg = userMessage.toLowerCase();

  // 1. Gather context from authorized server tools
  let contextInfo = '';

  if (normalizedMsg.includes('programme') || normalizedMsg.includes('event') || normalizedMsg.includes('പരിപാടി') || normalizedMsg.includes('നബിദിനം') || normalizedMsg.includes('today')) {
    const todayRes = executeAuthorizedTool('getTodayEvents', {}, currentUser);
    const progRes = executeAuthorizedTool('getUpcomingProgrammes', {}, currentUser);
    contextInfo += `\n[TODAY'S SCHEDULE]: ${JSON.stringify(todayRes.data)}`;
    contextInfo += `\n[UPCOMING PROGRAMMES]: ${JSON.stringify(progRes.data?.slice(0, 4))}`;
  }

  if (normalizedMsg.includes('payment') || normalizedMsg.includes('pending') || normalizedMsg.includes('fee') || normalizedMsg.includes('പണം') || normalizedMsg.includes('ഫീസ്')) {
    const payRes = executeAuthorizedTool('getMemberPayments', {}, currentUser);
    if (payRes.success) {
      contextInfo += `\n[MEMBER PAYMENTS]: ${JSON.stringify(payRes.data)}`;
    } else {
      contextInfo += `\n[PAYMENT NOTE]: ${payRes.error}`;
    }
  }

  if (normalizedMsg.includes('service') || normalizedMsg.includes('ambulance') || normalizedMsg.includes('blood') || normalizedMsg.includes('സേവനം') || normalizedMsg.includes('ആംബുലൻസ്')) {
    const srvRes = executeAuthorizedTool('getServices', {}, currentUser);
    contextInfo += `\n[AVAILABLE SERVICES]: ${JSON.stringify(srvRes.data)}`;
  }

  if (normalizedMsg.includes('notice') || normalizedMsg.includes('announcement') || normalizedMsg.includes('അറിയിപ്പ്')) {
    const annRes = executeAuthorizedTool('getAnnouncements', {}, currentUser);
    contextInfo += `\n[ANNOUNCEMENTS]: ${JSON.stringify(annRes.data)}`;
  }

  if (normalizedMsg.includes('mh-reg') || normalizedMsg.includes('registration status') || normalizedMsg.includes('അപേക്ഷ')) {
    const regMatch = userMessage.match(/MH-REG-[\w-]+/i);
    if (regMatch) {
      const regRes = executeAuthorizedTool('getRegistrationStatus', { trackingId: regMatch[0] }, currentUser);
      contextInfo += `\n[REGISTRATION STATUS]: ${JSON.stringify(regRes)}`;
    }
  }

  if (currentUser && (normalizedMsg.includes('family') || normalizedMsg.includes('കുടുംബം') || normalizedMsg.includes('members'))) {
    const famRes = executeAuthorizedTool('getFamilyMembers', {}, currentUser);
    if (famRes.success) {
      contextInfo += `\n[USER FAMILY DATA]: ${JSON.stringify(famRes.data)}`;
    }
  }

  // Zakat Tool Execution and Context Gathering
  if (normalizedMsg.includes('zakat') || normalizedMsg.includes('സകാത്ത്')) {
    const zktConfig = db.getZakatConfig();
    contextInfo += `\n[ACTIVE ZAKAT CONFIGURATION & NISAB]: ${JSON.stringify(zktConfig)}`;
    if (currentUser) {
      const savedRes = executeAuthorizedTool('getMyZakatCalculations', {}, currentUser);
      if (savedRes.success && savedRes.data?.length > 0) {
        contextInfo += `\n[MEMBER'S SAVED ZAKAT CALCULATIONS]: ${JSON.stringify(savedRes.data)}`;
      }
    }
    // Check if user provided numbers to calculate directly
    const goldMatch = normalizedMsg.match(/(\d+)\s*(?:g|gram|grams|പവൻ|pavan)/i);
    const cashMatch = normalizedMsg.match(/(?:rs|inr|₹|\b)\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:lakh|lakhs|rupees|cash|balance)?/i);
    if (goldMatch || cashMatch) {
      const gGrams = goldMatch ? Number(goldMatch[1]) : 0;
      const calcResult = executeAuthorizedTool('calculateZakat', { goldGrams: gGrams }, currentUser);
      if (calcResult.success) {
        contextInfo += `\n[REAL-TIME SYSTEM ZAKAT CALCULATION]: ${JSON.stringify(calcResult.data)}`;
      }
    }
  }

  // Warasath / Inheritance Tool Execution and Context Gathering
  if (normalizedMsg.includes('warasath') || normalizedMsg.includes('inheritance') || normalizedMsg.includes('അനന്തരാവകാശം') || normalizedMsg.includes('വാറസത്ത്') || normalizedMsg.includes('faraid')) {
    const casesRes = executeAuthorizedTool('getMyWarasathCases', {}, currentUser);
    if (casesRes.success && casesRes.data?.length > 0) {
      contextInfo += `\n[MEMBER'S SAVED WARASATH CASES]: ${JSON.stringify(casesRes.data)}`;
    }

    // Check for submission request: e.g. "submit this inheritance case for scholar review" or "submit WAR-2026-001"
    if (normalizedMsg.includes('submit') && (normalizedMsg.includes('review') || normalizedMsg.includes('scholar'))) {
      const caseMatch = userMessage.match(/WAR-[\w-]+/i);
      const caseIdToSubmit = caseMatch ? caseMatch[0] : (casesRes.data?.[0]?.id || null);
      if (caseIdToSubmit) {
        const subRes = executeAuthorizedTool('submitWarasathReview', { caseId: caseIdToSubmit }, currentUser);
        contextInfo += `\n[WARASATH SUBMISSION TO SCHOLAR RESULT]: ${JSON.stringify(subRes)}`;
      }
    }
  }

  // Check if admin asking for stats
  if (currentUser && ['SUPER ADMIN', 'SECRETARY', 'TREASURER'].includes(currentUser.role) && (normalizedMsg.includes('stats') || normalizedMsg.includes('finance') || normalizedMsg.includes('income') || normalizedMsg.includes('expense'))) {
    const finRes = executeAuthorizedTool('getFinanceSummary', {}, currentUser);
    contextInfo += `\n[ADMIN FINANCIAL STATS]: ${JSON.stringify(finRes.data)}`;
  }

  const ai = getAIClient();

  if (ai) {
    try {
      const systemInstruction = `You are MANOOR AI, the intelligent, warm, courteous, and respectful digital assistant for Manoor Mahall ("One Mahallu. One Digital System.", manoormahall.com).
You serve members, elderly community members, and administrators.
You understand English, Malayalam, Arabic, and Manglish (Malayalam written in English letters).
Respond in the language the user asked in. When speaking English, keep it elegant, clear, and reassuring. When speaking Malayalam or Arabic, maintain proper Islamic etiquette and respect (Assalamu Alaikum, Marhaba, etc.).

CRITICAL CONSTRAINTS:
1. NEVER hallucinate or invent financial or registration data.
2. Only reference real facts provided in the [CONTEXT] below.
3. If information is not available in the context, politely say: "I couldn't find that specific information in the Manoor Mahall system. Please check with the Mahall Office or Secretary."
4. For Zakat or Inheritance inquiries, always state that calculations are preliminary and should be verified with a qualified scholar or the Mahallu committee.
5. Keep your answer concise, helpful, and beautifully formatted with bullet points where appropriate.

CURRENT LOGGED-IN USER: ${currentUser ? `${currentUser.fullName} (${currentUser.role}, Family: ${currentUser.familyId || 'None'})` : 'Guest / Visitor'}
${contextInfo ? `CONTEXT DATA FROM MANOOR DATABASE:\n${contextInfo}` : ''}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userMessage,
        config: {
          systemInstruction,
          temperature: 0.3,
        },
      });

      if (response && response.text) {
        return response.text.trim();
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to rule engine:', err);
    }
  }

  // Graceful Local Fallback Engine
  return generateLocalFallbackResponse(userMessage, currentUser, contextInfo);
}

function generateLocalFallbackResponse(msg: string, user: User | null, context: string): string {
  const lower = msg.toLowerCase();

  if (lower.includes('programme') || lower.includes('event') || lower.includes('പരിപാടി')) {
    const progs = db.getProgrammes().filter(p => p.status === 'UPCOMING');
    const today = db.getTodayProgrammes();
    let reply = `Assalamu Alaikum!\n\n`;
    if (today.length > 0) {
      reply += `**Today at Manoor Mahall:**\n• **${today[0].englishTitle}** (${today[0].malayalamTitle}) at ${today[0].venue}, ${today[0].time}\n\n`;
    }
    reply += `**Upcoming Programmes:**\n`;
    progs.slice(0, 3).forEach(p => {
      reply += `• **${p.englishTitle}** (${p.malayalamTitle})\n  📅 ${p.date} at ${p.time} | 📍 ${p.venue}\n`;
    });
    reply += `\nYou can view full details or register directly under the **Programmes** section.`;
    return reply;
  }

  if (lower.includes('payment') || lower.includes('pending') || lower.includes('ഫീസ്')) {
    if (!user) {
      return `To view your specific family payment history or pending balance, please **Sign In** to your member account. You can also make payments directly via UPI or Bank Transfer at the Mahall Office.`;
    }
    const payments = db.getPayments(user.familyId);
    const fam = user.familyId ? db.getFamilyById(user.familyId) : null;
    const pending = fam ? fam.family.pendingBalance : 0;
    return `Assalamu Alaikum ${user.fullName},\n\nHere is your family account summary (${user.familyId || 'Manoor Member'}):\n• **Pending Balance:** ₹${pending.toLocaleString('en-IN')}\n• **Total Recorded Contributions:** ₹${fam?.family.totalContribution.toLocaleString('en-IN') || 0}\n• **Last Payments:** ${payments.length} transaction(s) recorded.\n\nYou can click **Pay Now** or download official PDF receipts in the **My Payments** tab!`;
  }

  if (lower.includes('service') || lower.includes('ambulance') || lower.includes('blood') || lower.includes('സേവനം')) {
    return `Manoor Mahall provides 24/7 community services:\n\n• 🚑 **24/7 Community Ambulance:** Call K. Basheer at +91 98470 99881\n• 🩸 **Emergency Blood Wing:** Navas K. at +91 94476 11223 (350+ registered donors)\n• 🕊️ **Janaza & Burial Support:** Usthad Zainul Abid at +91 98473 45678\n• 🏥 **Medical & Dialysis Aid:** Secretary P.K. Abdul Majeed at +91 94471 23456\n\nYou can also click the **"Need Help?"** button on the bottom left for instant one-tap contact!`;
  }

  if (lower.includes('madrasa') || lower.includes('admission') || lower.includes('മദ്റസ')) {
    return `**Manoor Darul Uloom Madrasa (Class 1 to 10):**\n\n• **Admissions:** Open for Class 1 (Children born before Dec 2020) and transfer students.\n• **Subjects:** Holy Quran, Tajweed, Fiqh, Aqeedah, Hadith, Akhlaq, Arabic Language.\n• **Faculty:** Headed by Chief Usthad Zainul Abid Musliyar.\n\nTo enroll your child, navigate to **Registrations -> Madrasa Admission** or speak with Usthad at the Madrasa Office (7:00 AM - 9:00 AM).`;
  }

  if (lower.includes('saved zakat') || lower.includes('my saved zakat calculation')) {
    if (!user) {
      return `Please **Sign In** to view your saved Zakat calculations. Once signed in, you can view, print, or download official PDF records of your calculations at any time.`;
    }
    const calcs = db.getZakatCalculations(user.id);
    if (calcs.length === 0) {
      return `Assalamu Alaikum ${user.fullName},\n\nYou currently have no saved Zakat calculations on file. You can calculate your Zakat using the **Zakat Calculator** and click **Save Calculation** to securely store it in your member profile.`;
    }
    const latest = calcs[0];
    return `Assalamu Alaikum ${user.fullName},\n\nHere is your latest saved Zakat record:\n• **Title / Year:** ${latest.title || 'Annual Zakat Calculation'}\n• **Date:** ${new Date(latest.date).toLocaleDateString('en-IN')}\n• **Total Zakatable Wealth:** ₹${latest.netZakatableWealth.toLocaleString('en-IN')}\n• **Nisab Standard:** ${latest.nisabStandard} (₹${latest.nisabValue.toLocaleString('en-IN')})\n• **Zakat Payable (2.5%):** ₹${latest.zakatPayable.toLocaleString('en-IN')}\n• **Methodology:** ${latest.methodologyVersion}\n\n*PRELIMINARY CALCULATION — REVIEW WITH A QUALIFIED SCHOLAR WHERE APPROPRIATE.*\nYou can open the **Zakat Calculator** page to view full asset breakdowns, print, or download your calculation PDF.`;
  }

  if (lower.includes('calculate my zakat') || lower.includes('calculate zakat') || lower.includes('സകാത്ത്')) {
    const cfg = db.getZakatConfig();
    const goldNisab = cfg.goldNisabGrams * cfg.goldPricePerGram;
    const silverNisab = cfg.silverNisabGrams * cfg.silverPricePerGram;
    return `**Manoor Mahall Islamic Zakat Calculation Service:**\n\nAccording to active Mahallu methodology:\n• **Gold Nisab:** 85g 24k @ ₹${cfg.goldPricePerGram.toLocaleString('en-IN')}/g = **₹${goldNisab.toLocaleString('en-IN')}**\n• **Silver Nisab:** 595g @ ₹${cfg.silverPricePerGram.toLocaleString('en-IN')}/g = **₹${silverNisab.toLocaleString('en-IN')}**\n• **Standard Wealth Rate:** 2.5% per Hawl (lunar year)\n• **Agricultural Produce (Ushr):** 10% (rainfed) or 5% (irrigated)\n\n**Included Asset Categories in our Step-by-Step Calculator:**\n1. 🟡 Gold & Silver (grams & purity)\n2. 💵 Cash in Hand & Bank Balances\n3. 🏢 Business Merchandise & Tradable Inventory\n4. 🌾 Agricultural Produce (Ushr)\n5. 🐪 Livestock & Animals\n6. 📑 Trade Receivables & Good Debts\n7. 📈 Other Investments, Gold Bonds & Cryptocurrencies\n8. 🔻 Deductions (immediate debts, employee wages, due bills)\n\n*PRELIMINARY CALCULATION — REVIEW WITH A QUALIFIED SCHOLAR WHERE APPROPRIATE.*\n\nOpen the **Zakat Calculator** tab or page to perform your complete multi-asset calculation, save to your account, or export to PDF!`;
  }

  if (lower.includes('submit this inheritance case') || lower.includes('submit inheritance case for scholar review') || lower.includes('submit warasath')) {
    if (!user) {
      return `Please **Sign In** to submit an inheritance case for scholar review. Authenticated members can track the status of their Fara'id case as it is evaluated by the Chief Qazi and Shariah Board.`;
    }
    const cases = db.getWarasathCases(user.id);
    if (cases.length === 0) {
      return `You have not created any inheritance cases yet. Please navigate to the **Warasath Calculator**, enter the Deceased, Heirs, Estate Assets, and Deductions, calculate, and click **"Submit for Scholar Review"**.`;
    }
    const targetCase = cases[0];
    db.submitWarasathForReview(targetCase.id, 'Submitted via Manoor AI assistant');
    return `Assalamu Alaikum ${user.fullName},\n\nYour Warasath case **${targetCase.id}** (${targetCase.deceasedName}) has been successfully submitted to the **Manoor Mahall Scholars Council** for review.\n\n• **Deceased:** ${targetCase.deceasedName} (${targetCase.deceasedGender})\n• **Net Distributable Estate:** ₹${targetCase.netEstate.toLocaleString('en-IN')}\n• **Status:** SUBMITTED_FOR_REVIEW\n• **Next Step:** Chief Qazi / Mahall Mufti will verify the legal heirs, Quranic shares, and issue official certification.\n\n*PRELIMINARY — SCHOLAR VERIFICATION REQUIRED.*`;
  }

  if (lower.includes('help me calculate warasath') || lower.includes('calculate warasath') || lower.includes('inheritance') || lower.includes('വാറസത്ത്') || lower.includes('അനന്തരാവകാശം') || lower.includes('faraid')) {
    return `**Manoor Mahall Warasath (Islamic Inheritance / Fara'id) Calculator:**\n\nOur system uses a structured Islamic inheritance calculation engine adhering to orthodox Sunni (Shafi'i & Hanafi) jurisprudence based on Surah An-Nisa (Verses 11, 12 & 176).\n\n**Information collected:**\n1. **Deceased:** Gender (Male/Female) and Marital Status\n2. **Heirs:** Father, Mother, Husband/Wife, Sons, Daughters, Grandparents, and Siblings\n3. **Estate Assets:** Cash, Bank Balances, Gold, Land, House/Property, Business, Investments, Vehicles\n4. **Obligatory Deductions (prior to distribution):**\n   • Funeral & burial expenses (Tajheez & Takfeen)\n   • Debts owed to individuals, institutions, or Zakat arrears\n   • Valid Bequests (Wasiyyah - max 1/3 of net remaining)\n\n**Outputs provided:**\n• Gross Estate, Total Deductions & Net Distributable Estate\n• Detailed heir table with Quranic share fractions (1/8, 1/4, 1/6, 1/3, 2/3, 1/2, Asabah 2:1)\n• Exact allocated amounts in ₹\n• Step-by-step legal & scriptural explanation\n\n*PRELIMINARY — SCHOLAR VERIFICATION REQUIRED.*\n\nOpen the **Warasath Calculator** tab or page to enter your case and submit it for official scholar certification!`;
  }

  if (lower.includes('contact') || lower.includes('office') || lower.includes('ഫോൺ')) {
    return `**Manoor Mahall Administrative Office:**\n\n• **Address:** Near Juma Masjid, Manoor, Malappuram, Kerala 676505\n• **Phone:** +91 94471 23456 (General Secretary) / +91 98470 12345 (Office)\n• **Email:** office@manoormahall.com\n• **Office Hours:** Saturday to Thursday: 08:30 AM - 12:30 PM & 04:30 PM - 07:30 PM`;
  }

  return `Assalamu Alaikum wa Rahmatullahi wa Barakatuh! I am **Manoor AI**, your digital assistant for Manoor Mahall.\n\nI can help you with:\n• 📅 Today's and upcoming programmes\n• 💳 Checking pending payments and receipts\n• 📜 Registration tracking (Marriage, Birth, Madrasa)\n• 🚑 Emergency ambulance & blood donor helpline\n• ⚖️ Zakat calculations & Warasath information\n\nHow may I assist you today?`;
}

// AI Admin Writing Assistant for CMS
export async function generateAdminDraft(
  action: 'IMPROVE_MALAYALAM' | 'GENERATE_NOTICE' | 'FORMAL' | 'FRIENDLY' | 'POSTER_TEXT' | 'TRANSLATE_EN' | 'TRANSLATE_AR',
  inputPrompt: string
): Promise<string> {
  const ai = getAIClient();

  if (ai) {
    try {
      const instructions = `You are the executive drafting assistant for Manoor Mahall Islamic Committee.
Action: ${action}
Generate an impeccable, high-caliber text draft suitable for official Mahall notice board, WhatsApp community broadcast, or event poster.
Return ONLY the drafted text without preamble or commentary.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `${instructions}\n\nUSER INPUT / NOTES:\n${inputPrompt}`,
      });

      if (response && response.text) {
        return response.text.trim();
      }
    } catch (e) {
      console.warn('AI Admin Draft API error:', e);
    }
  }

  // Fallback template
  if (action === 'GENERATE_NOTICE' || action === 'IMPROVE_MALAYALAM') {
    return `മനൂർ മഹല്ല് ജമാഅത്ത് കമ്മിറ്റി അറിയിപ്പ്\n\nമാന്യ മഹല്ല് നിവാസികളുടെ ശ്രദ്ധയ്ക്ക്,\n\n${inputPrompt}\n\nഎല്ലാ മഹല്ല് അംഗങ്ങളുടെയും ആത്മാർത്ഥമായ സഹകരണവും പ്രാർത്ഥനയും പ്രതീക്ഷിക്കുന്നു.\n\nസെക്രട്ടറി,\nമനൂർ മഹല്ല് ജമാഅത്ത് കമ്മിറ്റി`;
  }

  return `Manoor Mahall Community Notice\n\nDear Respected Members,\n\n${inputPrompt}\n\nWith best regards,\nGeneral Secretary, Manoor Mahall Committee`;
}
