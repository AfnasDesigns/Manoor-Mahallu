export type UserRole = 
  | 'SUPER ADMIN'
  | 'SECRETARY'
  | 'TREASURER'
  | 'MADRASA ADMIN'
  | 'EVENT ADMIN'
  | 'WELFARE ADMIN'
  | 'TEACHER'
  | 'SCHOLAR'
  | 'STAFF'
  | 'COMMITTEE'
  | 'MEMBER';

export interface User {
  id: string;
  username: string;
  fullName: string;
  email?: string;
  phone: string;
  role: UserRole;
  memberId?: string;
  familyId?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Family {
  id: string; // e.g. "MH-FAM-042"
  houseName: string;
  houseNumber: string;
  ward: string;
  address: string;
  headName: string;
  phone: string;
  memberCount: number;
  totalContribution: number;
  pendingBalance: number;
  lastPaymentDate?: string;
  createdAt: string;
  timeline?: FamilyTimelineEvent[];
}

export interface FamilyTimelineEvent {
  id: string;
  type: 'PAYMENT' | 'MADRASA' | 'CERTIFICATE' | 'SERVICE' | 'REGISTRATION' | 'GENERAL';
  title: string;
  description: string;
  date: string;
  actor: string;
}

export interface Member {
  id: string; // e.g. "MH-MEM-00125"
  familyId: string;
  fullName: string;
  fatherName: string;
  motherName: string;
  dob: string;
  gender: 'MALE' | 'FEMALE';
  phone: string;
  whatsapp?: string;
  email?: string;
  houseName: string;
  houseNumber: string;
  ward: string;
  occupation: string;
  relationshipToHead: string; // "Head", "Spouse", "Son", "Daughter", "Parent", etc.
  status: 'ACTIVE' | 'INACTIVE';
  bloodGroup?: string;
  digitalIdQr?: string;
  createdAt: string;
}

export interface MadrasaStudent {
  id: string;
  admissionNo: string; // e.g. "MAD-2026-089"
  name: string;
  familyId: string;
  memberId?: string;
  guardianName: string;
  guardianPhone: string;
  standard: string; // "Class 1", "Class 2", ... "Class 10"
  division: string; // "A", "B"
  dob: string;
  admissionDate: string;
  feeStatus: 'PAID' | 'PENDING' | 'OVERDUE';
  monthlyFee: number;
  photoUrl?: string;
  attendanceRate: number; // percentage
  rank?: number;
}

export interface MadrasaTeacher {
  id: string;
  name: string;
  qualification: string;
  phone: string;
  subjects: string[];
  classes: string[];
  experience: string;
  bio: string;
}

export interface StudentMarks {
  id: string;
  studentId: string;
  studentName: string;
  standard: string;
  exam: string; // "Half Yearly Exam 2026", "Annual Exam 2026"
  subjects: {
    quran: number;
    tajweed: number;
    fiqh: number;
    aqeedah: number;
    hadith: number;
    akhlaq: number;
    arabic: number;
  };
  totalMarks: number;
  percentage: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
  rank: number;
  remarks: string;
  date: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  standard: string;
  division: string;
  records: {
    studentId: string;
    studentName: string;
    status: 'PRESENT' | 'ABSENT' | 'LATE' | 'LEAVE';
  }[];
}

export type PaymentCategory = 
  | 'Madrasa Fee'
  | 'Palli Contribution'
  | 'Mahallu Subscription'
  | 'Land Rent'
  | 'Property Rent'
  | 'Donation'
  | 'Zakat'
  | 'Sadaqah'
  | 'Other';

export interface Payment {
  id: string;
  receiptNumber: string; // e.g. "RCP-2026-0045"
  memberId?: string;
  memberName: string;
  familyId: string;
  houseName: string;
  amount: number;
  category: PaymentCategory;
  paymentMethod: 'CASH' | 'UPI / ONLINE' | 'BANK TRANSFER' | 'CHEQUE';
  transactionId?: string;
  date: string;
  status: 'Paid' | 'Partial' | 'Pending' | 'Overdue';
  authorizedPerson: string;
  remarks?: string;
}

export interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: number;
  date: string;
  description: string;
  party: string; // Person / Vendor
  paymentMethod: string;
  receiptNumber?: string;
  createdBy: string;
  approvedBy?: string;
}

export interface Programme {
  id: string;
  title?: string;
  englishTitle: string;
  malayalamTitle: string;
  arabicTitle?: string;
  description: string;
  date: string; // YYYY-MM-DD
  time: string;
  venue: string;
  speaker?: string;
  organizer: string;
  category: 'RELIGIOUS' | 'MADRASA' | 'YOUTH' | 'COMMUNITY' | 'MEETING';
  status: 'UPCOMING' | 'LIVE' | 'COMPLETED' | 'CANCELLED';
  posterUrl?: string;
  registrationRequired: boolean;
  registeredCount: number;
}

export interface Announcement {
  id: string;
  englishTitle: string;
  malayalamTitle: string;
  content: string;
  category: 'Important' | 'Urgent' | 'General' | 'Madrasa' | 'Event' | 'Welfare' | 'Mosque';
  isPinned: boolean;
  priority: 'NORMAL' | 'HIGH' | 'URGENT';
  date: string;
  expiryDate?: string;
  published: boolean;
  author: string;
}

export type RegistrationType = 
  | 'Marriage'
  | 'Birth'
  | 'Death'
  | 'Course'
  | 'Madrasa Admission'
  | 'Mahallu Membership'
  | 'Member Message'
  | 'Help Request'
  | 'Food Booking'
  | 'Friday Kuthuba'
  | 'Janaza'
  | 'Certificate'
  | 'Event'
  | 'Volunteer'
  | 'Welfare'
  | 'Property/Rent'
  | 'Other';

export interface Registration {
  id: string; // MH-REG-2026-000125
  type: RegistrationType;
  applicantName: string;
  applicantPhone: string;
  familyId?: string;
  memberId?: string;
  details: Record<string, any>;
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER REVIEW' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';
  submittedAt: string;
  reviewedBy?: string;
  reviewNotes?: string;
  statusHistory: {
    status: string;
    updatedAt: string;
    updatedBy: string;
    notes?: string;
  }[];
}

export interface CommunityService {
  id: string;
  title: string;
  category: string;
  description: string;
  eligibility: string;
  contactPerson: string;
  contactPhone: string;
  isEmergency: boolean;
  status: 'ACTIVE' | 'PAUSED';
}

export interface ServiceRequest {
  id: string; // MH-SRV-2026-042
  serviceId: string;
  serviceTitle: string;
  applicantName: string;
  applicantPhone: string;
  familyId?: string;
  memberId?: string;
  category?: string;
  subject?: string;
  urgency: 'NORMAL' | 'HIGH' | 'EMERGENCY';
  description: string;
  status: 'NEW' | 'ASSIGNED' | 'IN PROGRESS' | 'RESOLVED' | 'CLOSED';
  assignedTo?: string;
  responseNotes?: string;
  date: string;
}

export interface ProblemCase {
  id: string; // MH-CASE-2026-019 (Confidential)
  category: 'Family Problems' | 'Marriage Issues' | 'Addiction Support' | 'Financial Difficulty' | 'Education' | 'Youth' | 'Domestic Conflict' | 'Welfare' | 'Elderly Support' | 'Social Support' | 'Other';
  applicantName: string;
  applicantPhone: string;
  familyId?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'New' | 'Assigned' | 'In Progress' | 'Awaiting Member' | 'Resolved' | 'Closed';
  assignedScholarOrStaff?: string;
  description: string;
  privateNotes: {
    date: string;
    author: string;
    note: string;
  }[];
  date: string;
}

export interface ZakatConfiguration {
  id: string;
  goldPricePerGram: number; // e.g. 6850
  silverPricePerGram: number; // e.g. 88
  goldNisabGrams: number; // 85g
  silverNisabGrams: number; // 595g
  standardZakatRate: number; // 0.025 (2.5%)
  ushrRainfedRate: number; // 0.10 (10%)
  ushrIrrigatedRate: number; // 0.05 (5%)
  defaultNisabStandard: 'GOLD' | 'SILVER';
  methodologyNotes: string;
  updatedBy?: string;
  updatedAt: string;
}

export interface ZakatAssetBreakdown {
  goldGrams: number;
  goldValue: number;
  silverGrams: number;
  silverValue: number;
  cashInHand: number;
  bankBalance: number;
  businessStock: number;
  agriculturalHarvestValue: number;
  agriculturalZakatDue: number;
  livestockValue: number;
  livestockZakatDue: number;
  loansReceivable: number;
  otherEligibleAssets: number;
}

export interface ZakatDeductions {
  immediateDebts: number;
  pendingBillsTaxes: number;
  dueWages: number;
  totalDeductions: number;
}

export interface ZakatCalculationRecord {
  id: string;
  userId?: string;
  userName?: string;
  memberId?: string;
  familyId?: string;
  title?: string;
  date: string;
  nisabStandard: 'GOLD' | 'SILVER';
  nisabValue: number;
  totalAssets: number;
  deductibleLiabilities: number;
  netZakatableWealth: number;
  meetsNisab: boolean;
  zakatPayable: number;
  breakdown: Record<string, number>;
  assets?: ZakatAssetBreakdown;
  deductions?: ZakatDeductions;
  methodologyVersion: string;
  notes?: string;
}

export interface InheritanceAsset {
  id: string;
  category: 'CASH' | 'BANK' | 'GOLD' | 'LAND' | 'PROPERTY' | 'BUSINESS' | 'INVESTMENT' | 'VEHICLE' | 'OTHER';
  description: string;
  estimatedValue: number;
}

export interface InheritanceDeduction {
  id: string;
  category: 'FUNERAL' | 'DEBT' | 'BEQUEST' | 'OTHER';
  description: string;
  amount: number;
}

export interface InheritanceHeir {
  relation: string;
  count: number;
  shareFraction: string;
  sharePercentage: number;
  allocatedAmount: number;
  quranicReference?: string;
  notes?: string;
}

export interface ScholarReview {
  id: string;
  caseId: string;
  scholarName: string;
  scholarRole: string;
  status: 'PENDING' | 'APPROVED' | 'MODIFIED' | 'REJECTED';
  comments: string;
  fatwaOrReference?: string;
  reviewedAt: string;
}

export interface WarasathCase {
  id: string;
  userId?: string;
  userName?: string;
  deceasedName: string;
  deceasedGender: 'MALE' | 'FEMALE';
  maritalStatus?: 'MARRIED' | 'SINGLE' | 'WIDOWED' | 'DIVORCED';
  dateOfDeath?: string;
  assets?: InheritanceAsset[];
  deductionsList?: InheritanceDeduction[];
  grossEstate: number;
  funeralDeduction: number;
  debtDeduction: number;
  bequestDeduction: number;
  otherDeductions?: number;
  netEstate: number;
  heirs: InheritanceHeir[];
  explanation?: string[];
  status: 'PRELIMINARY' | 'SUBMITTED_FOR_REVIEW' | 'SCHOLAR VERIFIED';
  scholarReviews?: ScholarReview[];
  verifiedBy?: string;
  date: string;
}

export interface Certificate {
  id: string;
  certificateNumber: string; // MH-CERT-2026-089
  type: 'Membership' | 'Residence' | 'Marriage-related' | 'NOC' | 'Madrasa' | 'Donation' | 'Payment';
  recipientName: string;
  familyId: string;
  houseName: string;
  issueDate: string;
  validUntil?: string;
  authorizedSignatory: string;
  purpose: string;
  verificationHash: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
}

export interface DashboardStats {
  totalFamilies: number;
  totalMembers: number;
  totalStudents: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  pendingPayments: number;
  upcomingProgrammesCount: number;
  openServiceRequestsCount: number;
}
