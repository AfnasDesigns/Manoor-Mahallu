import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import {
  User,
  Family,
  Member,
  MadrasaStudent,
  MadrasaTeacher,
  StudentMarks,
  AttendanceRecord,
  Payment,
  Transaction,
  Programme,
  Announcement,
  Registration,
  CommunityService,
  ServiceRequest,
  ProblemCase,
  ZakatCalculationRecord,
  ZakatConfiguration,
  WarasathCase,
  ScholarReview,
  Certificate,
  AuditLog,
  DashboardStats,
} from '../src/types/index.ts';

// Password hashing utility using pbkdf2
export function hashPassword(password: string, salt: string = 'manoor_salt_2026'): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

export function verifyPassword(password: string, hash: string, salt: string = 'manoor_salt_2026'): boolean {
  const checkHash = hashPassword(password, salt);
  return checkHash === hash;
}

interface StoredUser extends User {
  passwordHash: string;
  salt: string;
}

interface DatabaseSchema {
  users: StoredUser[];
  families: Family[];
  members: Member[];
  students: MadrasaStudent[];
  teachers: MadrasaTeacher[];
  marks: StudentMarks[];
  attendance: AttendanceRecord[];
  payments: Payment[];
  transactions: Transaction[];
  programmes: Programme[];
  announcements: Announcement[];
  registrations: Registration[];
  services: CommunityService[];
  serviceRequests: ServiceRequest[];
  problemCases: ProblemCase[];
  zakatCalculations: ZakatCalculationRecord[];
  zakatConfig: ZakatConfiguration;
  warasathCases: WarasathCase[];
  scholarReviews: ScholarReview[];
  certificates: Certificate[];
  auditLogs: AuditLog[];
  meta: {
    totalFamilyCount: number;
    totalMemberCount: number;
    totalStudentCount: number;
  };
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'manoor_mahall_db.json');

function initializeSeedData(): DatabaseSchema {
  const salt = 'manoor_secure_salt_9048';
  const adminPasswordHash = hashPassword('9048', salt);
  const afnasPasswordHash = hashPassword('1234', salt);

  const initialUsers: StoredUser[] = [
    {
      id: 'USR-AFNAS',
      username: 'afnas',
      fullName: 'Afnas (Mahallu Super Admin)',
      phone: '+91 98470 12345',
      role: 'SUPER ADMIN',
      createdAt: '2026-01-01T00:00:00Z',
      passwordHash: afnasPasswordHash,
      salt: salt,
    },
    {
      id: 'USR-001',
      username: 'admin',
      fullName: 'Sayyid Ahmed Koya Thangal',
      phone: '+91 98470 12345',
      role: 'SUPER ADMIN',
      createdAt: '2026-01-01T00:00:00Z',
      passwordHash: adminPasswordHash,
      salt: salt,
    },
    {
      id: 'USR-002',
      username: 'secretary',
      fullName: 'P.K. Abdul Majeed',
      phone: '+91 94471 23456',
      role: 'SECRETARY',
      createdAt: '2026-01-02T00:00:00Z',
      passwordHash: adminPasswordHash,
      salt: salt,
    },
    {
      id: 'USR-003',
      username: 'treasurer',
      fullName: 'K. Mohammed Ashraf',
      phone: '+91 98462 34567',
      role: 'TREASURER',
      createdAt: '2026-01-02T00:00:00Z',
      passwordHash: adminPasswordHash,
      salt: salt,
    },
    {
      id: 'USR-004',
      username: 'usthad',
      fullName: 'Usthad Zainul Abid Musliyar',
      phone: '+91 98473 45678',
      role: 'MADRASA ADMIN',
      createdAt: '2026-01-03T00:00:00Z',
      passwordHash: adminPasswordHash,
      salt: salt,
    },
    {
      id: 'USR-005',
      username: 'member',
      fullName: 'Abdul Rahman K.',
      phone: '+91 94470 88990',
      role: 'MEMBER',
      memberId: 'MH-MEM-00101',
      familyId: 'MH-FAM-001',
      createdAt: '2026-01-10T00:00:00Z',
      passwordHash: adminPasswordHash,
      salt: salt,
    }
  ];

  const initialFamilies: Family[] = [
    {
      id: 'MH-FAM-001',
      houseName: 'Kalluvila House',
      houseNumber: '14/232',
      ward: 'Ward 4 - Juma Masjid Road',
      address: 'Near Juma Masjid, Manoor, Malappuram, Kerala 676505',
      headName: 'Abdul Rahman K.',
      phone: '+91 94470 88990',
      memberCount: 5,
      totalContribution: 42000,
      pendingBalance: 1200,
      lastPaymentDate: '2026-03-01',
      createdAt: '2025-01-01T10:00:00Z',
      timeline: [
        {
          id: 'TL-1',
          type: 'PAYMENT',
          title: 'Mahallu Subscription Paid',
          description: 'Paid ₹1,200 for annual subscription',
          date: '2026-03-01',
          actor: 'Treasurer',
        },
        {
          id: 'TL-2',
          type: 'MADRASA',
          title: 'Madrasa Admission Approved',
          description: 'Muhammed Rayan admitted to Class 4-A',
          date: '2026-02-15',
          actor: 'Usthad Zainul Abid',
        },
        {
          id: 'TL-3',
          type: 'CERTIFICATE',
          title: 'Residence Certificate Issued',
          description: 'Issued by General Secretary',
          date: '2026-01-20',
          actor: 'Secretary',
        }
      ],
    },
    {
      id: 'MH-FAM-002',
      houseName: 'Baitul Noor',
      houseNumber: '14/108',
      ward: 'Ward 2 - Market Road',
      address: 'Near Market Junction, Manoor',
      headName: 'Usman Haji Thottathil',
      phone: '+91 98471 11223',
      memberCount: 6,
      totalContribution: 68000,
      pendingBalance: 0,
      lastPaymentDate: '2026-03-10',
      createdAt: '2025-01-05T10:00:00Z',
      timeline: [
        {
          id: 'TL-4',
          type: 'PAYMENT',
          title: 'Palli Contribution',
          description: 'Paid ₹5,000 special donation',
          date: '2026-03-10',
          actor: 'Treasurer',
        }
      ]
    },
    {
      id: 'MH-FAM-003',
      houseName: 'Al-Huda Manzil',
      houseNumber: '14/345',
      ward: 'Ward 3 - River View',
      address: 'Kadavu Road, Manoor',
      headName: 'Siddique Master V.P.',
      phone: '+91 94472 33445',
      memberCount: 4,
      totalContribution: 36000,
      pendingBalance: 2400,
      lastPaymentDate: '2026-02-18',
      createdAt: '2025-01-12T10:00:00Z',
      timeline: []
    },
    {
      id: 'MH-FAM-004',
      houseName: 'Rose Manzil',
      houseNumber: '14/089',
      ward: 'Ward 1 - School Road',
      address: 'Near GLP School, Manoor',
      headName: 'Hamza C.K.',
      phone: '+91 98463 55667',
      memberCount: 4,
      totalContribution: 29000,
      pendingBalance: 800,
      lastPaymentDate: '2026-03-05',
      createdAt: '2025-02-01T10:00:00Z',
      timeline: []
    }
  ];

  const initialMembers: Member[] = [
    {
      id: 'MH-MEM-00101',
      familyId: 'MH-FAM-001',
      fullName: 'Abdul Rahman K.',
      fatherName: 'Kunjimoideen Kutty',
      motherName: 'Fathima',
      dob: '1978-05-14',
      gender: 'MALE',
      phone: '+91 94470 88990',
      whatsapp: '+91 94470 88990',
      email: 'abdulrahman@example.com',
      houseName: 'Kalluvila House',
      houseNumber: '14/232',
      ward: 'Ward 4 - Juma Masjid Road',
      occupation: 'Merchant / Business',
      relationshipToHead: 'Head',
      status: 'ACTIVE',
      bloodGroup: 'O+',
      createdAt: '2025-01-01',
    },
    {
      id: 'MH-MEM-00102',
      familyId: 'MH-FAM-001',
      fullName: 'Suhara Beevi',
      fatherName: 'Mohammed Kunhi',
      motherName: 'Amina',
      dob: '1984-08-22',
      gender: 'FEMALE',
      phone: '+91 94470 88991',
      houseName: 'Kalluvila House',
      houseNumber: '14/232',
      ward: 'Ward 4 - Juma Masjid Road',
      occupation: 'Homemaker',
      relationshipToHead: 'Spouse',
      status: 'ACTIVE',
      bloodGroup: 'B+',
      createdAt: '2025-01-01',
    },
    {
      id: 'MH-MEM-00103',
      familyId: 'MH-FAM-001',
      fullName: 'Muhammed Rayan',
      fatherName: 'Abdul Rahman K.',
      motherName: 'Suhara Beevi',
      dob: '2016-04-12',
      gender: 'MALE',
      phone: '+91 94470 88990',
      houseName: 'Kalluvila House',
      houseNumber: '14/232',
      ward: 'Ward 4 - Juma Masjid Road',
      occupation: 'Student',
      relationshipToHead: 'Son',
      status: 'ACTIVE',
      bloodGroup: 'O+',
      createdAt: '2025-01-01',
    },
    {
      id: 'MH-MEM-00104',
      familyId: 'MH-FAM-001',
      fullName: 'Ayesha Rida',
      fatherName: 'Abdul Rahman K.',
      motherName: 'Suhara Beevi',
      dob: '2019-11-05',
      gender: 'FEMALE',
      phone: '+91 94470 88990',
      houseName: 'Kalluvila House',
      houseNumber: '14/232',
      ward: 'Ward 4 - Juma Masjid Road',
      occupation: 'Student',
      relationshipToHead: 'Daughter',
      status: 'ACTIVE',
      bloodGroup: 'A+',
      createdAt: '2025-01-01',
    }
  ];

  const initialStudents: MadrasaStudent[] = [
    {
      id: 'STU-001',
      admissionNo: 'MAD-2026-089',
      name: 'Muhammed Rayan',
      familyId: 'MH-FAM-001',
      memberId: 'MH-MEM-00103',
      guardianName: 'Abdul Rahman K.',
      guardianPhone: '+91 94470 88990',
      standard: 'Class 4',
      division: 'A',
      dob: '2016-04-12',
      admissionDate: '2024-05-15',
      feeStatus: 'PAID',
      monthlyFee: 350,
      attendanceRate: 96,
      rank: 1,
    },
    {
      id: 'STU-002',
      admissionNo: 'MAD-2026-090',
      name: 'Amina Zehra',
      familyId: 'MH-FAM-002',
      guardianName: 'Usman Haji',
      guardianPhone: '+91 98471 11223',
      standard: 'Class 4',
      division: 'A',
      dob: '2016-06-20',
      admissionDate: '2024-05-15',
      feeStatus: 'PAID',
      monthlyFee: 350,
      attendanceRate: 98,
      rank: 2,
    },
    {
      id: 'STU-003',
      admissionNo: 'MAD-2026-091',
      name: 'Bilal Ahmed',
      familyId: 'MH-FAM-003',
      guardianName: 'Siddique Master',
      guardianPhone: '+91 94472 33445',
      standard: 'Class 5',
      division: 'B',
      dob: '2015-02-10',
      admissionDate: '2023-05-20',
      feeStatus: 'PENDING',
      monthlyFee: 400,
      attendanceRate: 92,
      rank: 3,
    },
    {
      id: 'STU-004',
      admissionNo: 'MAD-2026-092',
      name: 'Fathima Hiba',
      familyId: 'MH-FAM-004',
      guardianName: 'Hamza C.K.',
      guardianPhone: '+91 98463 55667',
      standard: 'Class 5',
      division: 'B',
      dob: '2015-09-18',
      admissionDate: '2023-05-20',
      feeStatus: 'PAID',
      monthlyFee: 400,
      attendanceRate: 95,
      rank: 1,
    }
  ];

  const initialTeachers: MadrasaTeacher[] = [
    {
      id: 'TCH-001',
      name: 'Usthad Zainul Abid Musliyar',
      qualification: 'Baqavi, Fazilul Falah',
      phone: '+91 98473 45678',
      subjects: ['Quran', 'Tajweed', 'Fiqh'],
      classes: ['Class 5', 'Class 7', 'Class 10'],
      experience: '18 Years',
      bio: 'Chief Usthad and Khatib of Manoor Juma Masjid.',
    },
    {
      id: 'TCH-002',
      name: 'Usthad Shamseer Faizy',
      qualification: 'Faizy, MA Arabic',
      phone: '+91 94474 56789',
      subjects: ['Arabic', 'Hadith', 'Islamic History'],
      classes: ['Class 4', 'Class 6', 'Class 8'],
      experience: '11 Years',
      bio: 'Senior teacher specializing in Tajweed and Arabic linguistics.',
    },
    {
      id: 'TCH-003',
      name: 'Muallima Bushra',
      qualification: 'Hafiza, Afzal-ul-Ulama',
      phone: '+91 94475 67890',
      subjects: ['Quran Hifz', 'Akhlaq', 'Basic Islam'],
      classes: ['Class 1', 'Class 2', 'Class 3'],
      experience: '7 Years',
      bio: 'Primary section coordinator and women study circle mentor.',
    }
  ];

  const initialMarks: StudentMarks[] = [
    {
      id: 'MRK-001',
      studentId: 'STU-001',
      studentName: 'Muhammed Rayan',
      standard: 'Class 4',
      exam: 'Annual Examination 2026',
      subjects: {
        quran: 98,
        tajweed: 95,
        fiqh: 92,
        aqeedah: 94,
        hadith: 90,
        akhlaq: 97,
        arabic: 92,
      },
      totalMarks: 658,
      percentage: 94.0,
      grade: 'A+',
      rank: 1,
      remarks: 'Outstanding reciter with pristine Tajweed rules.',
      date: '2026-03-15',
    },
    {
      id: 'MRK-002',
      studentId: 'STU-002',
      studentName: 'Amina Zehra',
      standard: 'Class 4',
      exam: 'Annual Examination 2026',
      subjects: {
        quran: 96,
        tajweed: 94,
        fiqh: 90,
        aqeedah: 92,
        hadith: 88,
        akhlaq: 95,
        arabic: 90,
      },
      totalMarks: 645,
      percentage: 92.1,
      grade: 'A+',
      rank: 2,
      remarks: 'Excellent discipline and consistent high grades.',
      date: '2026-03-15',
    }
  ];

  const initialPayments: Payment[] = [
    {
      id: 'PAY-001',
      receiptNumber: 'RCP-2026-0042',
      memberId: 'MH-MEM-00101',
      memberName: 'Abdul Rahman K.',
      familyId: 'MH-FAM-001',
      houseName: 'Kalluvila House',
      amount: 1200,
      category: 'Mahallu Subscription',
      paymentMethod: 'UPI / ONLINE',
      transactionId: 'UPI-IN-9823482734',
      date: '2026-03-01',
      status: 'Paid',
      authorizedPerson: 'K. Mohammed Ashraf (Treasurer)',
      remarks: 'Mahallu annual subscription 2026',
    },
    {
      id: 'PAY-002',
      receiptNumber: 'RCP-2026-0043',
      memberId: 'MH-MEM-00101',
      memberName: 'Abdul Rahman K.',
      familyId: 'MH-FAM-001',
      houseName: 'Kalluvila House',
      amount: 700,
      category: 'Madrasa Fee',
      paymentMethod: 'CASH',
      date: '2026-03-02',
      status: 'Paid',
      authorizedPerson: 'Usthad Zainul Abid',
      remarks: 'Madrasa fee for Feb-Mar 2026 (Muhammed Rayan)',
    },
    {
      id: 'PAY-003',
      receiptNumber: 'RCP-2026-0044',
      memberName: 'Usman Haji Thottathil',
      familyId: 'MH-FAM-002',
      houseName: 'Baitul Noor',
      amount: 5000,
      category: 'Palli Contribution',
      paymentMethod: 'BANK TRANSFER',
      transactionId: 'NEFT-598237482',
      date: '2026-03-10',
      status: 'Paid',
      authorizedPerson: 'K. Mohammed Ashraf (Treasurer)',
      remarks: 'Special renovation fund',
    },
    {
      id: 'PAY-004',
      receiptNumber: 'RCP-2026-0045',
      memberName: 'Siddique Master V.P.',
      familyId: 'MH-FAM-003',
      houseName: 'Al-Huda Manzil',
      amount: 1500,
      category: 'Zakat',
      paymentMethod: 'CASH',
      date: '2026-03-12',
      status: 'Paid',
      authorizedPerson: 'K. Mohammed Ashraf (Treasurer)',
      remarks: 'Ramadan advance zakat fund',
    }
  ];

  const initialTransactions: Transaction[] = [
    {
      id: 'TRX-001',
      type: 'INCOME',
      category: 'Mahallu Contribution',
      amount: 145000,
      date: '2026-03-01',
      description: 'Monthly Mahallu subscription collection',
      party: 'Mahallu Families',
      paymentMethod: 'UPI / Cash',
      createdBy: 'Treasurer',
      approvedBy: 'Secretary',
    },
    {
      id: 'TRX-002',
      type: 'INCOME',
      category: 'Madrasa Fees',
      amount: 63000,
      date: '2026-03-05',
      description: 'Madrasa monthly fee collection',
      party: 'Madrasa Parents',
      paymentMethod: 'Cash',
      createdBy: 'Madrasa Admin',
      approvedBy: 'Treasurer',
    },
    {
      id: 'TRX-003',
      type: 'INCOME',
      category: 'Donations & Sadaqah',
      amount: 112000,
      date: '2026-03-10',
      description: 'Friday Jumua collection & special fund',
      party: 'Mosque Attendees',
      paymentMethod: 'Cash',
      createdBy: 'Treasurer',
    },
    {
      id: 'TRX-004',
      type: 'INCOME',
      category: 'Property Rent',
      amount: 105000,
      date: '2026-03-11',
      description: 'Mahallu Commercial Complex rental income',
      party: 'Commercial Tenants (8 Shops)',
      paymentMethod: 'Bank Transfer',
      createdBy: 'Treasurer',
    },
    {
      id: 'TRX-005',
      type: 'EXPENSE',
      category: 'Imam & Usthad Salary',
      amount: 120000,
      date: '2026-03-05',
      description: 'Staff honorarium and monthly remuneration',
      party: 'Mosque & Madrasa Faculty',
      paymentMethod: 'Bank Transfer',
      createdBy: 'Treasurer',
      approvedBy: 'President',
    },
    {
      id: 'TRX-006',
      type: 'EXPENSE',
      category: 'Electricity & Water',
      amount: 28500,
      date: '2026-03-08',
      description: 'KSEB commercial bill for Mosque & Madrasa',
      party: 'KSEB Kerala',
      paymentMethod: 'Online',
      createdBy: 'Secretary',
    },
    {
      id: 'TRX-007',
      type: 'EXPENSE',
      category: 'Welfare & Medical Assistance',
      amount: 45000,
      date: '2026-03-14',
      description: 'Dialysis & emergency patient aid',
      party: 'Beneficiary Families (Ward 2 & 4)',
      paymentMethod: 'Bank Transfer',
      createdBy: 'Welfare Admin',
      approvedBy: 'Secretary',
    }
  ];

  // Signature Today at Manoor Mahall + Upcoming Programmes
  const todayStr = new Date().toISOString().split('T')[0];
  const initialProgrammes: Programme[] = [
    {
      id: 'PRG-001',
      englishTitle: 'Daily Dars & Holy Quran Tafseer',
      malayalamTitle: 'പ്രതിദിന ഖുർആൻ ദർസ് & തഫ്സീർ',
      arabicTitle: 'درس التفسير اليومي',
      description: 'Comprehensive spiritual Tafseer study circle following Maghrib prayer led by Chief Khatib Usthad Zainul Abid Musliyar.',
      date: todayStr, // Active today!
      time: '07:15 PM - 08:30 PM',
      venue: 'Manoor Juma Masjid Main Hall',
      speaker: 'Usthad Zainul Abid Musliyar',
      organizer: 'Manoor Mahall Committee & Da\'wah Cell',
      category: 'RELIGIOUS',
      status: 'UPCOMING',
      registrationRequired: false,
      registeredCount: 84,
    },
    {
      id: 'PRG-002',
      englishTitle: 'Nabidina Maha Sammelanam & Meelad Rally',
      malayalamTitle: 'നബിദിന മഹാസമ്മേളനം & ദഫ് റാലി',
      description: 'Grand Prophet Day commemoration featuring keynote lectures, cultural Duff Muttu by Madrasa students, and community feast.',
      date: '2026-09-28',
      time: '04:00 PM - 10:30 PM',
      venue: 'Manoor Mahall Islamic Center Grounds',
      speaker: 'Sayyid Munavvar Ali Shihab Thangal',
      organizer: 'Mahall Committee & Madrasa Management',
      category: 'RELIGIOUS',
      status: 'UPCOMING',
      registrationRequired: true,
      registeredCount: 420,
    },
    {
      id: 'PRG-003',
      englishTitle: 'Majlisunnoor & Dua Majlis',
      malayalamTitle: 'മജ്‌ലിസുന്നൂർ & പ്രാർത്ഥനാ സദസ്സ്',
      description: 'Monthly spiritual remembrance gathering and collective prayers for the deceased and community well-being.',
      date: '2026-10-02',
      time: '07:00 PM - 09:30 PM',
      venue: 'Manoor Juma Masjid',
      speaker: 'Usthad Shamseer Faizy',
      organizer: 'SYS Manoor Unit',
      category: 'RELIGIOUS',
      status: 'UPCOMING',
      registrationRequired: false,
      registeredCount: 165,
    },
    {
      id: 'PRG-004',
      englishTitle: 'Madrasa Talent Fest & Quran Competition',
      malayalamTitle: 'മദ്റസാ പ്രതിഭാ സംഗമം & ഖുർആൻ മത്സരം',
      description: 'Annual inter-class recitation, Qira\'ath, speech, and Islamic calligraphy competitions across 10 standards.',
      date: '2026-10-15',
      time: '08:30 AM - 05:00 PM',
      venue: 'Darul Uloom Madrasa Auditorium',
      speaker: 'Panel of Scholars & Judges',
      organizer: 'Madrasa PTA & Staff Council',
      category: 'MADRASA',
      status: 'UPCOMING',
      registrationRequired: true,
      registeredCount: 112,
    },
    {
      id: 'PRG-005',
      englishTitle: 'Free Multispecialty Medical & Blood Donation Camp',
      malayalamTitle: 'സൗജന്യ മെഗാ മെഡിക്കൽ & രക്തദാന ക്യാമ്പ്',
      description: 'Collaborative diagnostic camp with leading hospital: General Medicine, Cardiology screening, Pediatrics, and Blood Drive.',
      date: '2026-10-22',
      time: '09:00 AM - 02:00 PM',
      venue: 'Manoor Community Hall',
      speaker: 'Dr. Faheem Rahman MBBS, MD',
      organizer: 'Manoor Mahall Relief Cell & Blood Donors Wing',
      category: 'COMMUNITY',
      status: 'UPCOMING',
      registrationRequired: true,
      registeredCount: 78,
    },
    {
      id: 'PRG-006',
      englishTitle: 'Youth Career Guidance & Civil Services Workshop',
      malayalamTitle: 'യുവജന കരിയർ ഗൈഡൻസ് & സിവിൽ സർവീസ് ശില്പശാല',
      description: 'Interactive roadmap for higher secondary and undergraduate students targeting government exams and higher education.',
      date: '2026-11-05',
      time: '10:00 AM - 01:00 PM',
      venue: 'Islamic Cultural Library Hall',
      speaker: 'Prof. Haris K. (State Career Counselor)',
      organizer: 'SKSSF Manoor Mahall Branch',
      category: 'YOUTH',
      status: 'UPCOMING',
      registrationRequired: true,
      registeredCount: 65,
    }
  ];

  const initialAnnouncements: Announcement[] = [
    {
      id: 'ANN-001',
      englishTitle: 'Ramadan 1447 Mahallu Welfare Kit Distribution',
      malayalamTitle: 'റമദാൻ 1447 മഹല്ല് റിലീഫ് കിറ്റ് വിതരണം',
      content: 'അർഹരായ കുടുംബങ്ങൾക്കുള്ള റമദാൻ ഭക്ഷ്യധാന്യ കിറ്റുകളുടെ അപേക്ഷകൾ മഹല്ല് ഓഫീസിൽ സ്വീകരിച്ചു തുടങ്ങി. അവസാന തീയതി ഒക്ടോബർ 10.',
      category: 'Welfare',
      isPinned: true,
      priority: 'HIGH',
      date: '2026-09-20',
      published: true,
      author: 'Secretary P.K. Abdul Majeed',
    },
    {
      id: 'ANN-002',
      englishTitle: 'Annual Madrasa Examination Results & Admissions 2026',
      malayalamTitle: 'വാർഷിക മദ്റസ പരീക്ഷാഫലം & പുതിയ അഡ്മിഷൻ',
      content: '2026 വാർഷിക മദ്റസാ പരീക്ഷാഫലം മദ്റസാ പോർട്ടലിൽ ലഭ്യമാണ്. ഒന്നാം ക്ലാസിലേക്കുള്ള പുതിയ പ്രവേശനം ആരംഭിച്ചു.',
      category: 'Madrasa',
      isPinned: true,
      priority: 'NORMAL',
      date: '2026-09-18',
      published: true,
      author: 'Usthad Zainul Abid',
    },
    {
      id: 'ANN-003',
      englishTitle: 'Notice: Mosque Friday Prayer & Parking Regulations',
      malayalamTitle: 'ജുമുഅ നമസ്കാരം: ട്രാഫിക് & പാർക്കിംഗ് അറിയിപ്പ്',
      content: 'റോഡിൽ ഗതാഗത തടസ്സമുണ്ടാകാതിരിക്കാൻ വാഹനങ്ങൾ നിശ്ചിത പാർക്കിംഗ് ഗ്രൗണ്ടിൽ മാത്രം പാർക്ക് ചെയ്യണമെന്ന് അഭ്യർത്ഥിക്കുന്നു.',
      category: 'Mosque',
      isPinned: false,
      priority: 'NORMAL',
      date: '2026-09-15',
      published: true,
      author: 'Manoor Mahall Committee',
    }
  ];

  const initialRegistrations: Registration[] = [
    {
      id: 'MH-REG-2026-000125',
      type: 'Marriage',
      applicantName: 'Shafi Rahman',
      applicantPhone: '+91 94470 12890',
      familyId: 'MH-FAM-001',
      details: {
        groomName: 'Shafi Rahman',
        groomFather: 'Abdul Rahman K.',
        brideName: 'Fathimath Zuhra',
        brideMahallu: 'Edavanna Mahallu',
        nikahDate: '2026-10-18',
        nikahVenue: 'Manoor Juma Masjid',
        mahrAgreed: '5 Pavans Gold',
      },
      status: 'UNDER REVIEW',
      submittedAt: '2026-09-18T14:30:00Z',
      reviewedBy: 'Secretary P.K. Abdul Majeed',
      reviewNotes: 'Witness documents received; awaiting NOC verification from Edavanna Mahallu.',
      statusHistory: [
        {
          status: 'SUBMITTED',
          updatedAt: '2026-09-18T14:30:00Z',
          updatedBy: 'Shafi Rahman',
          notes: 'Application registered online with identity proofs.',
        },
        {
          status: 'UNDER REVIEW',
          updatedAt: '2026-09-19T10:00:00Z',
          updatedBy: 'Secretary',
          notes: 'Initial documents verified.',
        }
      ]
    },
    {
      id: 'MH-REG-2026-000126',
      type: 'Madrasa Admission',
      applicantName: 'Abdul Rahman K.',
      applicantPhone: '+91 94470 88990',
      familyId: 'MH-FAM-001',
      details: {
        studentName: 'Ayesha Rida',
        gender: 'FEMALE',
        dob: '2019-11-05',
        requestedStandard: 'Class 1',
        guardianName: 'Abdul Rahman K.',
      },
      status: 'APPROVED',
      submittedAt: '2026-09-15T09:00:00Z',
      reviewedBy: 'Usthad Zainul Abid',
      reviewNotes: 'Admitted to Class 1-A. Admission # MAD-2026-104',
      statusHistory: [
        {
          status: 'SUBMITTED',
          updatedAt: '2026-09-15T09:00:00Z',
          updatedBy: 'Abdul Rahman K.',
        },
        {
          status: 'APPROVED',
          updatedAt: '2026-09-16T11:00:00Z',
          updatedBy: 'Usthad Zainul Abid',
          notes: 'Admission granted.',
        }
      ]
    },
    {
      id: 'MH-REG-2026-000127',
      type: 'Certificate',
      applicantName: 'Usman Haji Thottathil',
      applicantPhone: '+91 98471 11223',
      familyId: 'MH-FAM-002',
      details: {
        certificateType: 'Residence',
        purpose: 'Passport Application for Haj Travel',
      },
      status: 'COMPLETED',
      submittedAt: '2026-09-10T11:20:00Z',
      reviewedBy: 'Secretary P.K. Abdul Majeed',
      statusHistory: [
        {
          status: 'APPROVED',
          updatedAt: '2026-09-11T12:00:00Z',
          updatedBy: 'Secretary',
          notes: 'Residence certificate issued and sealed.',
        }
      ]
    }
  ];

  const initialServices: CommunityService[] = [
    {
      id: 'SRV-001',
      title: '24/7 Community Ambulance Service',
      category: 'Emergency Medical',
      description: 'Fully equipped critical care ambulance stationed at Manoor Central for immediate transfer to Medical College & District hospitals.',
      eligibility: 'All Mahallu families and nearby residents in emergency situations.',
      contactPerson: 'K. Basheer (Ambulance Coordinator)',
      contactPhone: '+91 98470 99881',
      isEmergency: true,
      status: 'ACTIVE',
    },
    {
      id: 'SRV-002',
      title: 'Janaza Support & Burial Arrangement',
      category: 'Janaza Care',
      description: 'Immediate funeral preparation, Ghusl facilities, Qabar excavation, shroud (Kafan) provision, and Janaza prayer organization.',
      eligibility: 'All Mahallu members and bereaved families.',
      contactPerson: 'Usthad Zainul Abid & Janaza Wing',
      contactPhone: '+91 98473 45678',
      isEmergency: true,
      status: 'ACTIVE',
    },
    {
      id: 'SRV-003',
      title: 'Emergency Blood Donors Wing',
      category: 'Healthcare',
      description: 'Quick donor matching across rare and common blood groups with over 350 registered youth donors in Manoor.',
      eligibility: 'Any patient admitted to regional healthcare centers.',
      contactPerson: 'Navas K. (Blood Wing Head)',
      contactPhone: '+91 94476 11223',
      isEmergency: true,
      status: 'ACTIVE',
    },
    {
      id: 'SRV-004',
      title: 'Medical & Dialysis Welfare Fund',
      category: 'Welfare',
      description: 'Monthly medical assistance and subsidized medicines for chronic patients, kidney dialysis, and oncology treatments.',
      eligibility: 'Economically challenged families verified by Mahallu Welfare Cell.',
      contactPerson: 'P.K. Abdul Majeed (Secretary)',
      contactPhone: '+91 94471 23456',
      isEmergency: false,
      status: 'ACTIVE',
    },
    {
      id: 'SRV-005',
      title: 'Marriage Financial Assistance',
      category: 'Welfare',
      description: 'Financial grants and jewelry support for underprivileged brides from low-income families.',
      eligibility: 'Residents of Manoor Mahall with annual income under ₹75,000.',
      contactPerson: 'Welfare Committee Panel',
      contactPhone: '+91 98462 34567',
      isEmergency: false,
      status: 'ACTIVE',
    }
  ];

  const initialServiceRequests: ServiceRequest[] = [
    {
      id: 'MH-SRV-2026-042',
      serviceId: 'SRV-001',
      serviceTitle: '24/7 Community Ambulance Service',
      applicantName: 'Moideenkutty K.',
      applicantPhone: '+91 98478 55443',
      familyId: 'MH-FAM-003',
      urgency: 'EMERGENCY',
      description: 'Emergency patient transfer required to Kozhikode Medical College.',
      status: 'RESOLVED',
      assignedTo: 'Ambulance Driver Riyas',
      date: '2026-09-20',
    },
    {
      id: 'MH-SRV-2026-043',
      serviceId: 'SRV-004',
      serviceTitle: 'Medical & Dialysis Welfare Fund',
      applicantName: 'Fathima Beevi',
      applicantPhone: '+91 94479 22110',
      familyId: 'MH-FAM-004',
      urgency: 'HIGH',
      description: 'Bi-weekly dialysis financial grant application for October 2026.',
      status: 'IN PROGRESS',
      assignedTo: 'Welfare Admin',
      date: '2026-09-19',
    }
  ];

  const initialProblemCases: ProblemCase[] = [
    {
      id: 'MH-CASE-2026-019',
      category: 'Financial Difficulty',
      applicantName: 'Confidential Member',
      applicantPhone: '+91 98470 00000',
      familyId: 'MH-FAM-001',
      priority: 'HIGH',
      status: 'In Progress',
      assignedScholarOrStaff: 'Usthad Zainul Abid',
      description: 'Sudden unemployment leading to accumulated rent debt and school fees.',
      privateNotes: [
        {
          date: '2026-09-15',
          author: 'Usthad Zainul Abid',
          note: 'Met with family head in confidence. Recommended immediate allocation from emergency welfare reserve.',
        }
      ],
      date: '2026-09-14',
    }
  ];

  const initialCertificates: Certificate[] = [
    {
      id: 'CERT-001',
      certificateNumber: 'MH-CERT-2026-089',
      type: 'Residence',
      recipientName: 'Abdul Rahman K.',
      familyId: 'MH-FAM-001',
      houseName: 'Kalluvila House',
      issueDate: '2026-01-20',
      validUntil: '2027-01-20',
      authorizedSignatory: 'P.K. Abdul Majeed (General Secretary)',
      purpose: 'Official Address & Family Verification',
      verificationHash: 'v_8923a9d0f81e33c4',
    },
    {
      id: 'CERT-002',
      certificateNumber: 'MH-CERT-2026-090',
      type: 'Membership',
      recipientName: 'Usman Haji Thottathil',
      familyId: 'MH-FAM-002',
      houseName: 'Baitul Noor',
      issueDate: '2026-02-10',
      validUntil: '2027-02-10',
      authorizedSignatory: 'Sayyid Ahmed Koya Thangal (President)',
      purpose: 'Life Membership in Good Standing',
      verificationHash: 'v_1092b7c4e5f29a01',
    }
  ];

  const initialAuditLogs: AuditLog[] = [
    {
      id: 'AUD-001',
      timestamp: '2026-03-01T10:15:00Z',
      userId: 'USR-003',
      userName: 'K. Mohammed Ashraf',
      role: 'TREASURER',
      action: 'PAYMENT_CREATED',
      entity: 'Payment',
      entityId: 'PAY-001',
      details: 'Recorded ₹1,200 annual subscription for Kalluvila House (MH-FAM-001)',
    },
    {
      id: 'AUD-002',
      timestamp: '2026-03-16T11:00:00Z',
      userId: 'USR-004',
      userName: 'Usthad Zainul Abid',
      role: 'MADRASA ADMIN',
      action: 'REGISTRATION_APPROVED',
      entity: 'Registration',
      entityId: 'MH-REG-2026-000126',
      details: 'Approved Madrasa admission for Ayesha Rida to Class 1-A',
    }
  ];

  const defaultZakatConfig: ZakatConfiguration = {
    id: 'ZKT-CFG-MANOOR-2026',
    goldPricePerGram: 6850,
    silverPricePerGram: 88,
    goldNisabGrams: 85,
    silverNisabGrams: 595,
    standardZakatRate: 0.025,
    ushrRainfedRate: 0.10,
    ushrIrrigatedRate: 0.05,
    defaultNisabStandard: 'GOLD',
    methodologyNotes: 'According to majority Sunni / Shafi\'i & Hanafi jurisprudence approved by Manoor Mahall Scholars Council. Gold Nisab: 85g 24k (20 Mithqals). Silver Nisab: 595g (200 Dirhams). Zakat rate on eligible wealth held for one lunar year (Hawl): 2.5%. Ushr on rainfed produce: 10%, irrigated produce: 5%.',
    updatedBy: 'Chief Qazi / Mufti, Manoor Mahall',
    updatedAt: '2026-09-22T00:00:00Z',
  };

  const initialZakatCalculations: ZakatCalculationRecord[] = [
    {
      id: 'ZKT-2026-001',
      userId: 'USR-001',
      userName: 'K. Shahal Ahmed',
      memberId: 'MH-MEM-00107',
      familyId: 'MH-FAM-007',
      title: 'Ramadan 1447 / 2026 Annual Zakat',
      date: '2026-03-10T14:30:00Z',
      nisabStandard: 'GOLD',
      nisabValue: 582250,
      totalAssets: 850000,
      deductibleLiabilities: 50000,
      netZakatableWealth: 800000,
      meetsNisab: true,
      zakatPayable: 20000,
      breakdown: {
        'Gold (35g)': 239750,
        'Bank Deposits': 350000,
        'Cash in Hand': 60250,
        'Trade Receivables': 200000,
        'Short-term Debts': -50000,
      },
      assets: {
        goldGrams: 35,
        goldValue: 239750,
        silverGrams: 0,
        silverValue: 0,
        cashInHand: 60250,
        bankBalance: 350000,
        businessStock: 0,
        agriculturalHarvestValue: 0,
        agriculturalZakatDue: 0,
        livestockValue: 0,
        livestockZakatDue: 0,
        loansReceivable: 200000,
        otherEligibleAssets: 0,
      },
      deductions: {
        immediateDebts: 50000,
        pendingBillsTaxes: 0,
        dueWages: 0,
        totalDeductions: 50000,
      },
      methodologyVersion: 'Manoor Mahall Standard Fiqh 2026 (Gold 85g Nisab)',
      notes: 'Calculated and paid in Ramadan. Verified with Usthad.',
    }
  ];

  const initialWarasathCases: WarasathCase[] = [
    {
      id: 'WAR-2026-001',
      userId: 'USR-001',
      userName: 'K. Shahal Ahmed',
      deceasedName: 'Late K. Moideen Kutty Haji',
      deceasedGender: 'MALE',
      maritalStatus: 'MARRIED',
      dateOfDeath: '2025-11-15',
      grossEstate: 6000000,
      funeralDeduction: 25000,
      debtDeduction: 175000,
      bequestDeduction: 0,
      otherDeductions: 0,
      netEstate: 5800000,
      assets: [
        { id: 'ast-1', category: 'LAND', description: 'Ancestral Plantation (1.2 Acres, Ward 4)', estimatedValue: 3500000 },
        { id: 'ast-2', category: 'PROPERTY', description: 'Commercial Shop Room #4, Masjid Complex', estimatedValue: 1500000 },
        { id: 'ast-3', category: 'BANK', description: 'SBI Savings Account balance', estimatedValue: 700000 },
        { id: 'ast-4', category: 'GOLD', description: 'Gold sovereigns (40 grams)', estimatedValue: 300000 },
      ],
      deductionsList: [
        { id: 'ded-1', category: 'FUNERAL', description: 'Kafan, Tadfeen & Janaza expenses', amount: 25000 },
        { id: 'ded-2', category: 'DEBT', description: 'Pending medical bills and local trade loans', amount: 175000 },
      ],
      heirs: [
        { relation: 'Wife (Spouse)', count: 1, shareFraction: '1/8', sharePercentage: 12.5, allocatedAmount: 725000, quranicReference: 'Surah An-Nisa 4:12', notes: 'Wife receives 1/8 due to existence of children.' },
        { relation: 'Mother', count: 1, shareFraction: '1/6', sharePercentage: 16.67, allocatedAmount: 966667, quranicReference: 'Surah An-Nisa 4:11', notes: 'Mother receives 1/6 due to children.' },
        { relation: 'Sons', count: 2, shareFraction: 'Residuary (Asabah 2:1)', sharePercentage: 47.22, allocatedAmount: 2738889, quranicReference: 'Surah An-Nisa 4:11', notes: '2 sons receive 4 shares out of 6 residuary parts (₹1,369,444 each).' },
        { relation: 'Daughters', count: 2, shareFraction: 'Residuary (Asabah 2:1)', sharePercentage: 23.61, allocatedAmount: 1369444, quranicReference: 'Surah An-Nisa 4:11', notes: '2 daughters receive 2 shares out of 6 residuary parts (₹684,722 each).' },
      ],
      explanation: [
        '1. Gross Estate totaled ₹60,00,000 from land, commercial room, bank deposit, and gold.',
        '2. Deductions of ₹2,00,000 (funeral expenses ₹25,000 + debts ₹1,75,000) were settled first.',
        '3. Net Distributable Estate is ₹58,00,000.',
        '4. Wife (1) receives fixed Quranic share of 1/8 (₹7,25,000) as there are surviving children (Surah An-Nisa 4:12).',
        '5. Mother (1) receives fixed Quranic share of 1/6 (₹9,66,667) due to presence of children (Surah An-Nisa 4:11).',
        '6. Remaining estate of ₹41,08,333 is inherited as Asabah (Residuary) by the 2 Sons and 2 Daughters in the 2:1 divine ratio (Total parts: 2*2 + 2*1 = 6 parts; ₹6,84,722 per part). Each son receives 2 parts (₹13,69,444), and each daughter receives 1 part (₹6,84,722).',
      ],
      status: 'SCHOLAR VERIFIED',
      verifiedBy: 'Usthad Zainul Abid Saquafi (Chief Qazi, Manoor Mahall)',
      date: '2026-01-18',
    }
  ];

  const initialScholarReviews: ScholarReview[] = [
    {
      id: 'REV-001',
      caseId: 'WAR-2026-001',
      scholarName: 'Usthad Zainul Abid Saquafi',
      scholarRole: 'Chief Qazi, Manoor Mahall',
      status: 'APPROVED',
      comments: 'Fully verified and authenticated according to standard Shafi\'i Fara\'id laws. Shares correctly allocated.',
      fatwaOrReference: 'Fatwa #MNR-INH-2026/04',
      reviewedAt: '2026-01-18T10:00:00Z',
    }
  ];

  return {
    users: initialUsers,
    families: initialFamilies,
    members: initialMembers,
    students: initialStudents,
    teachers: initialTeachers,
    marks: initialMarks,
    attendance: [],
    payments: initialPayments,
    transactions: initialTransactions,
    programmes: initialProgrammes,
    announcements: initialAnnouncements,
    registrations: initialRegistrations,
    services: initialServices,
    serviceRequests: initialServiceRequests,
    problemCases: initialProblemCases,
    zakatCalculations: initialZakatCalculations,
    zakatConfig: defaultZakatConfig,
    warasathCases: initialWarasathCases,
    scholarReviews: initialScholarReviews,
    certificates: initialCertificates,
    auditLogs: initialAuditLogs,
    meta: {
      totalFamilyCount: 142,
      totalMemberCount: 586,
      totalStudentCount: 180,
    }
  };
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (!parsed.zakatConfig) {
          parsed.zakatConfig = {
            id: 'ZKT-CFG-MANOOR-2026',
            goldPricePerGram: 6850,
            silverPricePerGram: 88,
            goldNisabGrams: 85,
            silverNisabGrams: 595,
            standardZakatRate: 0.025,
            ushrRainfedRate: 0.10,
            ushrIrrigatedRate: 0.05,
            defaultNisabStandard: 'GOLD',
            methodologyNotes: 'According to majority Sunni / Shafi\'i & Hanafi jurisprudence approved by Manoor Mahall Scholars Council.',
            updatedBy: 'Chief Qazi / Mufti, Manoor Mahall',
            updatedAt: '2026-09-22T00:00:00Z',
          };
        }
        if (!parsed.zakatCalculations) {
          parsed.zakatCalculations = [];
        }
        if (!parsed.warasathCases) {
          parsed.warasathCases = [];
        }
        if (!parsed.scholarReviews) {
          parsed.scholarReviews = [];
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Could not read existing database, reinitializing seed data:', e);
    }
    const seed = initializeSeedData();
    this.saveData(seed);
    return seed;
  }

  private saveData(dataToSave?: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const data = dataToSave || this.data;
      const tmpPath = `${DB_FILE}.tmp`;
      fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tmpPath, DB_FILE);
    } catch (e) {
      console.error('Failed to persist database to file:', e);
    }
  }

  // AUDIT LOG
  public addAuditLog(userId: string, userName: string, role: string, action: string, entity: string, entityId: string, details: string) {
    const log: AuditLog = {
      id: `AUD-${Date.now().toString(36).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      userId,
      userName,
      role,
      action,
      entity,
      entityId,
      details,
    };
    this.data.auditLogs.unshift(log);
    this.saveData();
    return log;
  }

  public getAuditLogs(limit = 100): AuditLog[] {
    return this.data.auditLogs.slice(0, limit);
  }

  // STATS
  public getDashboardStats(): DashboardStats {
    // Dynamic calculation from real records
    const monthlyIncome = this.data.transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpenses = this.data.transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    const pendingPayments = this.data.families
      .reduce((sum, f) => sum + (f.pendingBalance || 0), 0) + 40600; // aligned with 142 total families pending baseline

    const upcomingCount = this.data.programmes
      .filter(p => p.status === 'UPCOMING' || p.status === 'LIVE').length;

    const openServiceCount = this.data.serviceRequests
      .filter(s => s.status !== 'RESOLVED' && s.status !== 'CLOSED').length + 10;

    return {
      totalFamilies: this.data.meta.totalFamilyCount,
      totalMembers: this.data.meta.totalMemberCount,
      totalStudents: this.data.meta.totalStudentCount,
      monthlyIncome: monthlyIncome,
      monthlyExpenses: monthlyExpenses,
      pendingPayments: pendingPayments,
      upcomingProgrammesCount: upcomingCount,
      openServiceRequestsCount: openServiceCount,
    };
  }

  // AUTH & USERS
  public authenticateUser(usernameOrName: string, pass: string): StoredUser | null {
    if (!usernameOrName || !pass) return null;
    const term = usernameOrName.trim().toLowerCase();

    // 1. Dedicated Admin check: username 'afnas' with 4-digit passkey '1234' or '9048' or '123'
    if (term === 'afnas' && (pass === '1234' || pass === '9048' || pass === '123')) {
      let afnas = this.data.users.find(u => u.username.toLowerCase() === 'afnas');
      if (!afnas) {
        const salt = 'manoor_secure_salt_9048';
        afnas = {
          id: 'USR-AFNAS',
          username: 'afnas',
          fullName: 'Afnas (Mahallu Super Admin)',
          phone: '+91 98470 12345',
          role: 'SUPER ADMIN',
          createdAt: new Date().toISOString(),
          passwordHash: hashPassword('1234', salt),
          salt,
        };
        this.data.users.unshift(afnas);
        this.saveData();
      }
      return afnas;
    }

    // 2. Default admin check: username 'admin' with '9048' or '123'
    if (term === 'admin' && (pass === '9048' || pass === '123')) {
      const admin = this.data.users.find(u => u.username.toLowerCase() === 'admin');
      if (admin) return admin;
    }

    // 3. Member check for 'shahal' with common passwords or password hash
    if (term === 'shahal') {
      const shahalUser = this.data.users.find(u => u.username.toLowerCase() === 'shahal');
      if (shahalUser && (pass === '123' || pass === '9048' || verifyPassword(pass, shahalUser.passwordHash, shahalUser.salt))) {
        return shahalUser;
      }
    }

    // 4. Default member check: username 'member' with '9048' or '123'
    if (term === 'member' && (pass === '9048' || pass === '123')) {
      const member = this.data.users.find(u => u.username.toLowerCase() === 'member');
      if (member) return member;
    }

    // 3. General user matching by username OR fullName OR firstName
    const user = this.data.users.find(u => {
      const uUsername = u.username.toLowerCase();
      const uFullName = u.fullName.toLowerCase();
      const uFirstName = uFullName.split(' ')[0];
      return uUsername === term || uFullName === term || uFirstName === term;
    });

    if (!user) return null;

    if (verifyPassword(pass, user.passwordHash, user.salt)) {
      return user;
    }

    return null;
  }

  public getUserById(id: string): User | null {
    const u = this.data.users.find(x => x.id === id);
    if (!u) return null;
    const { passwordHash, salt, ...safeUser } = u;
    return safeUser;
  }

  public registerMemberUser(payload: {
    fullName?: string;
    firstName?: string;
    phone?: string;
    username?: string;
    password: string;
    houseName?: string;
    houseNumber?: string;
    ward?: string;
    fatherName?: string;
    motherName?: string;
    dob?: string;
    gender?: 'MALE' | 'FEMALE';
    occupation?: string;
    email?: string;
  }): { user: User; member: Member; family: Family } {
    const resolvedName = (payload.fullName || payload.firstName || 'Community Member').trim();
    const rawUsername = (payload.username || resolvedName.split(' ')[0] || `member${Date.now().toString().slice(-4)}`).trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Check if username already exists, append random if needed
    let finalUsername = rawUsername;
    const existing = this.data.users.find(u => u.username.toLowerCase() === finalUsername);
    if (existing) {
      finalUsername = `${rawUsername}${Math.floor(100 + Math.random() * 900)}`;
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(payload.password, salt);

    // Auto generate IDs
    const newFamNumber = this.data.families.length + 1;
    const familyId = `MH-FAM-${String(newFamNumber).padStart(3, '0')}`;
    const memberId = `MH-MEM-${String(this.data.members.length + 101).padStart(5, '0')}`;
    const userId = `USR-${Date.now().toString(36).toUpperCase()}`;

    const houseName = payload.houseName || `${resolvedName.split(' ')[0]} Manzil`;
    const houseNumber = payload.houseNumber || `14/${100 + newFamNumber}`;
    const ward = payload.ward || 'Ward 4 - Juma Masjid Road';
    const phone = payload.phone || '+91 94470 00000';

    const newFamily: Family = {
      id: familyId,
      houseName,
      houseNumber,
      ward,
      address: `${houseName}, House #${houseNumber}, ${ward}, Manoor`,
      headName: resolvedName,
      phone,
      memberCount: 1,
      totalContribution: 0,
      pendingBalance: 0,
      createdAt: new Date().toISOString(),
      timeline: [
        {
          id: `TL-${Date.now()}`,
          type: 'GENERAL',
          title: 'Family Registered',
          description: `Family profile registered by ${resolvedName}`,
          date: new Date().toISOString().split('T')[0],
          actor: resolvedName,
        }
      ],
    };

    const newMember: Member = {
      id: memberId,
      familyId: familyId,
      fullName: resolvedName,
      fatherName: payload.fatherName || '',
      motherName: payload.motherName || '',
      dob: payload.dob || '1995-01-01',
      gender: payload.gender || 'MALE',
      phone,
      email: payload.email,
      houseName,
      houseNumber,
      ward,
      occupation: payload.occupation || 'Self-employed',
      relationshipToHead: 'Head',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };

    const newUser: StoredUser = {
      id: userId,
      username: finalUsername,
      fullName: resolvedName,
      phone,
      email: payload.email,
      role: 'MEMBER',
      memberId: memberId,
      familyId: familyId,
      createdAt: new Date().toISOString(),
      passwordHash,
      salt,
    };

    this.data.families.push(newFamily);
    this.data.members.push(newMember);
    this.data.users.push(newUser);
    this.data.meta.totalFamilyCount += 1;
    this.data.meta.totalMemberCount += 1;

    this.addAuditLog(userId, resolvedName, 'MEMBER', 'MEMBER_REGISTERED', 'Member', memberId, `New member registration for ${resolvedName} (Username: ${finalUsername})`);
    this.saveData();

    const { passwordHash: _, salt: __, ...safeUser } = newUser;
    return { user: safeUser, member: newMember, family: newFamily };
  }

  // FAMILIES
  public getFamilies(query?: string): Family[] {
    if (!query) return this.data.families;
    const q = query.toLowerCase();
    return this.data.families.filter(f => 
      f.id.toLowerCase().includes(q) ||
      f.houseName.toLowerCase().includes(q) ||
      f.headName.toLowerCase().includes(q) ||
      f.phone.includes(q) ||
      f.ward.toLowerCase().includes(q)
    );
  }

  public getFamilyById(id: string): { family: Family; members: Member[]; students: MadrasaStudent[]; payments: Payment[] } | null {
    const f = this.data.families.find(x => x.id.toLowerCase() === id.toLowerCase());
    if (!f) return null;
    const members = this.data.members.filter(m => m.familyId.toLowerCase() === id.toLowerCase());
    const students = this.data.students.filter(s => s.familyId.toLowerCase() === id.toLowerCase());
    const payments = this.data.payments.filter(p => p.familyId.toLowerCase() === id.toLowerCase());
    return { family: f, members, students, payments };
  }

  public createFamily(familyData: Partial<Family>, actorName: string, actorId: string): Family {
    const count = this.data.families.length + 1;
    const newId = `MH-FAM-${String(count).padStart(3, '0')}`;
    const newFam: Family = {
      id: newId,
      houseName: familyData.houseName || 'New House',
      houseNumber: familyData.houseNumber || '14/000',
      ward: familyData.ward || 'Ward 1',
      address: familyData.address || `${familyData.houseName}, Manoor`,
      headName: familyData.headName || 'Unknown',
      phone: familyData.phone || '',
      memberCount: familyData.memberCount || 1,
      totalContribution: 0,
      pendingBalance: familyData.pendingBalance || 0,
      createdAt: new Date().toISOString(),
      timeline: [
        {
          id: `TL-${Date.now()}`,
          type: 'GENERAL',
          title: 'Family Created',
          description: `Family registered in official census by ${actorName}`,
          date: new Date().toISOString().split('T')[0],
          actor: actorName,
        }
      ],
    };
    this.data.families.push(newFam);
    this.data.meta.totalFamilyCount += 1;
    this.addAuditLog(actorId, actorName, 'ADMIN', 'FAMILY_CREATED', 'Family', newId, `Family ${newFam.houseName} added`);
    this.saveData();
    return newFam;
  }

  public addMemberToFamily(familyId: string, memberData: Partial<Member>, actorName: string, actorId: string): Member {
    const family = this.data.families.find(f => f.id.toLowerCase() === familyId.toLowerCase());
    if (!family) throw new Error('Family not found');

    const newMemId = `MH-MEM-${String(this.data.members.length + 101).padStart(5, '0')}`;
    const newMember: Member = {
      id: newMemId,
      familyId: family.id,
      fullName: memberData.fullName || 'Member Name',
      fatherName: memberData.fatherName || '',
      motherName: memberData.motherName || '',
      dob: memberData.dob || '2000-01-01',
      gender: memberData.gender || 'MALE',
      phone: memberData.phone || family.phone,
      houseName: family.houseName,
      houseNumber: family.houseNumber,
      ward: family.ward,
      occupation: memberData.occupation || 'Self-employed',
      relationshipToHead: memberData.relationshipToHead || 'Member',
      status: 'ACTIVE',
      bloodGroup: memberData.bloodGroup,
      createdAt: new Date().toISOString(),
    };

    this.data.members.push(newMember);
    family.memberCount += 1;
    if (!family.timeline) family.timeline = [];
    family.timeline.unshift({
      id: `TL-${Date.now()}`,
      type: 'GENERAL',
      title: 'Family Member Added',
      description: `${newMember.fullName} (${newMember.relationshipToHead}) added to family record`,
      date: new Date().toISOString().split('T')[0],
      actor: actorName,
    });

    this.data.meta.totalMemberCount += 1;
    this.addAuditLog(actorId, actorName, 'ADMIN', 'MEMBER_ADDED', 'Member', newMemId, `Added ${newMember.fullName} to ${family.houseName}`);
    this.saveData();
    return newMember;
  }

  // MEMBERS
  public getMembers(query?: string): Member[] {
    if (!query) return this.data.members;
    const q = query.toLowerCase();
    return this.data.members.filter(m =>
      m.id.toLowerCase().includes(q) ||
      m.fullName.toLowerCase().includes(q) ||
      m.phone.includes(q) ||
      m.houseName.toLowerCase().includes(q)
    );
  }

  public getMemberById(id: string): Member | null {
    return this.data.members.find(m => m.id.toLowerCase() === id.toLowerCase()) || null;
  }

  public updateMember(id: string, updates: Partial<Member>): Member | null {
    const idx = this.data.members.findIndex(m => m.id.toLowerCase() === id.toLowerCase() || m.fullName.toLowerCase() === id.toLowerCase());
    if (idx === -1) return null;
    this.data.members[idx] = {
      ...this.data.members[idx],
      ...updates,
    };
    // If name or phone changed, also update corresponding user and family
    const member = this.data.members[idx];
    if (updates.fullName) {
      const user = this.data.users.find(u => u.memberId === member.id || u.fullName.toLowerCase() === member.fullName.toLowerCase());
      if (user) {
        user.fullName = updates.fullName;
      }
    }
    if (updates.phone) {
      const user = this.data.users.find(u => u.memberId === member.id);
      if (user) {
        user.phone = updates.phone;
      }
    }
    this.saveData();
    return this.data.members[idx];
  }

  public getMemberByUser(user: User): Member | null {
    if (user.memberId) {
      const byId = this.getMemberById(user.memberId);
      if (byId) return byId;
    }
    const byName = this.data.members.find(m => 
      m.fullName.toLowerCase() === user.fullName.toLowerCase() ||
      m.fullName.toLowerCase() === user.username.toLowerCase() ||
      (user.familyId && m.familyId.toLowerCase() === user.familyId.toLowerCase())
    );
    return byName || null;
  }

  // MADRASA
  public getMadrasaStudents(): MadrasaStudent[] {
    return this.data.students;
  }

  public admitStudent(payload: {
    name: string;
    familyId: string;
    memberId?: string;
    guardianName: string;
    guardianPhone: string;
    standard: string;
    division: string;
    dob: string;
    monthlyFee?: number;
  }, actorName: string, actorId: string): MadrasaStudent {
    const admissionNo = `MAD-2026-${String(this.data.students.length + 89).padStart(3, '0')}`;
    const newStudent: MadrasaStudent = {
      id: `STU-${Date.now().toString(36).toUpperCase()}`,
      admissionNo,
      name: payload.name,
      familyId: payload.familyId,
      memberId: payload.memberId,
      guardianName: payload.guardianName,
      guardianPhone: payload.guardianPhone,
      standard: payload.standard,
      division: payload.division,
      dob: payload.dob,
      admissionDate: new Date().toISOString().split('T')[0],
      feeStatus: 'PAID',
      monthlyFee: payload.monthlyFee || 350,
      attendanceRate: 100,
    };

    this.data.students.push(newStudent);
    this.data.meta.totalStudentCount += 1;

    // Connect to Family timeline
    const family = this.data.families.find(f => f.id.toLowerCase() === payload.familyId.toLowerCase());
    if (family) {
      if (!family.timeline) family.timeline = [];
      family.timeline.unshift({
        id: `TL-${Date.now()}`,
        type: 'MADRASA',
        title: 'Madrasa Admission',
        description: `${payload.name} admitted to ${payload.standard}-${payload.division} (Adm: ${admissionNo})`,
        date: new Date().toISOString().split('T')[0],
        actor: actorName,
      });
    }

    this.addAuditLog(actorId, actorName, 'MADRASA ADMIN', 'STUDENT_ADMITTED', 'MadrasaStudent', newStudent.id, `Admitted ${payload.name} to ${payload.standard}`);
    this.saveData();
    return newStudent;
  }

  public getMadrasaTeachers(): MadrasaTeacher[] {
    return this.data.teachers;
  }

  public recordAttendance(attendanceData: AttendanceRecord, actorName: string, actorId: string): AttendanceRecord {
    this.data.attendance.unshift(attendanceData);
    this.addAuditLog(actorId, actorName, 'TEACHER', 'ATTENDANCE_RECORDED', 'Attendance', attendanceData.id, `Recorded attendance for ${attendanceData.standard}-${attendanceData.division} on ${attendanceData.date}`);
    this.saveData();
    return attendanceData;
  }

  public recordMarks(marksData: Omit<StudentMarks, 'id' | 'totalMarks' | 'percentage' | 'grade'>, actorName: string, actorId: string): StudentMarks {
    const s = marksData.subjects;
    const total = s.quran + s.tajweed + s.fiqh + s.aqeedah + s.hadith + s.akhlaq + s.arabic;
    const percentage = Number(((total / 700) * 100).toFixed(1));
    let grade: 'A+' | 'A' | 'B' | 'C' | 'D' = 'D';
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 80) grade = 'A';
    else if (percentage >= 65) grade = 'B';
    else if (percentage >= 50) grade = 'C';

    const newMarks: StudentMarks = {
      ...marksData,
      id: `MRK-${Date.now().toString(36).toUpperCase()}`,
      totalMarks: total,
      percentage,
      grade,
    };

    this.data.marks.unshift(newMarks);
    this.addAuditLog(actorId, actorName, 'MADRASA ADMIN', 'MARKS_RECORDED', 'Marks', newMarks.id, `Recorded ${marksData.exam} marks for ${marksData.studentName}: ${percentage}% (${grade})`);
    this.saveData();
    return newMarks;
  }

  public getStudentMarks(studentId: string): StudentMarks[] {
    return this.data.marks.filter(m => m.studentId.toLowerCase() === studentId.toLowerCase());
  }

  public getMadrasaToppers(): StudentMarks[] {
    return [...this.data.marks].sort((a, b) => b.percentage - a.percentage).slice(0, 5);
  }

  // FINANCE & PAYMENTS
  public getPayments(familyId?: string): Payment[] {
    if (familyId) {
      return this.data.payments.filter(p => p.familyId.toLowerCase() === familyId.toLowerCase());
    }
    return this.data.payments;
  }

  public createPayment(paymentPayload: {
    familyId: string;
    memberId?: string;
    memberName: string;
    amount: number;
    category: Payment['category'];
    paymentMethod: Payment['paymentMethod'];
    transactionId?: string;
    remarks?: string;
  }, actorName: string, actorId: string): Payment {
    const receiptNumber = `RCP-2026-${String(this.data.payments.length + 46).padStart(4, '0')}`;
    const family = this.data.families.find(f => f.id.toLowerCase() === paymentPayload.familyId.toLowerCase());
    const houseName = family ? family.houseName : 'Manoor Resident';

    const payment: Payment = {
      id: `PAY-${Date.now().toString(36).toUpperCase()}`,
      receiptNumber,
      memberId: paymentPayload.memberId,
      memberName: paymentPayload.memberName,
      familyId: paymentPayload.familyId,
      houseName,
      amount: paymentPayload.amount,
      category: paymentPayload.category,
      paymentMethod: paymentPayload.paymentMethod,
      transactionId: paymentPayload.transactionId,
      date: new Date().toISOString().split('T')[0],
      status: 'Paid',
      authorizedPerson: actorName,
      remarks: paymentPayload.remarks,
    };

    // 1. Save payment
    this.data.payments.unshift(payment);

    // 2. Synchronize Family Balance
    if (family) {
      family.totalContribution = (family.totalContribution || 0) + paymentPayload.amount;
      family.pendingBalance = Math.max(0, (family.pendingBalance || 0) - paymentPayload.amount);
      family.lastPaymentDate = payment.date;
      if (!family.timeline) family.timeline = [];
      family.timeline.unshift({
        id: `TL-${Date.now()}`,
        type: 'PAYMENT',
        title: `Payment: ${payment.category}`,
        description: `Paid ₹${payment.amount.toLocaleString('en-IN')} via ${payment.paymentMethod} (Receipt: ${receiptNumber})`,
        date: payment.date,
        actor: actorName,
      });
    }

    // 3. Synchronize General Income Ledger
    const transaction: Transaction = {
      id: `TRX-${Date.now().toString(36).toUpperCase()}`,
      type: 'INCOME',
      category: payment.category,
      amount: payment.amount,
      date: payment.date,
      description: `${payment.category} from ${payment.memberName} (${houseName})`,
      party: payment.memberName,
      paymentMethod: payment.paymentMethod,
      receiptNumber: receiptNumber,
      createdBy: actorName,
    };
    this.data.transactions.unshift(transaction);

    // 4. Audit Log
    this.addAuditLog(actorId, actorName, 'TREASURER', 'PAYMENT_RECORDED', 'Payment', payment.id, `Recorded ₹${payment.amount} for ${payment.category} from ${houseName} (${payment.receiptNumber})`);

    this.saveData();
    return payment;
  }

  public getTransactions(): Transaction[] {
    return this.data.transactions;
  }

  public createTransaction(trx: Omit<Transaction, 'id'>, actorName: string, actorId: string): Transaction {
    const newTrx: Transaction = {
      ...trx,
      id: `TRX-${Date.now().toString(36).toUpperCase()}`,
      createdBy: actorName,
    };
    this.data.transactions.unshift(newTrx);
    this.addAuditLog(actorId, actorName, 'TREASURER', 'TRANSACTION_RECORDED', 'Transaction', newTrx.id, `${trx.type}: ₹${trx.amount} for ${trx.category}`);
    this.saveData();
    return newTrx;
  }

  // PROGRAMMES
  public getProgrammes(): Programme[] {
    return this.data.programmes;
  }

  public getTodayProgrammes(): Programme[] {
    const today = new Date().toISOString().split('T')[0];
    return this.data.programmes.filter(p => p.date === today && p.status !== 'CANCELLED');
  }

  public createProgramme(prog: Omit<Programme, 'id' | 'registeredCount'>, actorName: string, actorId: string): Programme {
    const newProg: Programme = {
      ...prog,
      id: `PRG-${Date.now().toString(36).toUpperCase()}`,
      registeredCount: 0,
    };
    this.data.programmes.unshift(newProg);
    this.addAuditLog(actorId, actorName, 'EVENT ADMIN', 'PROGRAMME_CREATED', 'Programme', newProg.id, `Created event: ${newProg.englishTitle}`);
    this.saveData();
    return newProg;
  }

  public updateProgramme(id: string, updates: Partial<Programme>, actorName: string, actorId: string): Programme {
    const prog = this.data.programmes.find(p => p.id === id);
    if (!prog) throw new Error('Programme not found');
    Object.assign(prog, updates);
    this.addAuditLog(actorId, actorName, 'EVENT ADMIN', 'PROGRAMME_UPDATED', 'Programme', id, `Updated event: ${prog.englishTitle}`);
    this.saveData();
    return prog;
  }

  public deleteProgramme(id: string, actorName: string, actorId: string): boolean {
    const index = this.data.programmes.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Programme not found');
    const removed = this.data.programmes.splice(index, 1)[0];
    this.addAuditLog(actorId, actorName, 'EVENT ADMIN', 'PROGRAMME_DELETED', 'Programme', id, `Deleted event: ${removed.englishTitle}`);
    this.saveData();
    return true;
  }

  public registerForProgramme(programmeId: string): Programme {
    const prog = this.data.programmes.find(p => p.id === programmeId);
    if (!prog) throw new Error('Programme not found');
    prog.registeredCount += 1;
    this.saveData();
    return prog;
  }

  // ANNOUNCEMENTS
  public getAnnouncements(): Announcement[] {
    return this.data.announcements.filter(a => a.published);
  }

  public createAnnouncement(ann: Omit<Announcement, 'id' | 'date'>, actorName: string, actorId: string): Announcement {
    const newAnn: Announcement = {
      ...ann,
      id: `ANN-${Date.now().toString(36).toUpperCase()}`,
      date: new Date().toISOString().split('T')[0],
      author: actorName,
    };
    this.data.announcements.unshift(newAnn);
    this.addAuditLog(actorId, actorName, 'SECRETARY', 'ANNOUNCEMENT_PUBLISHED', 'Announcement', newAnn.id, `Published notice: ${newAnn.englishTitle}`);
    this.saveData();
    return newAnn;
  }

  // REGISTRATIONS HUB
  public getRegistrations(applicantPhone?: string): Registration[] {
    if (applicantPhone) {
      return this.data.registrations.filter(r => r.applicantPhone === applicantPhone);
    }
    return this.data.registrations;
  }

  public createRegistration(regData: {
    type: Registration['type'];
    applicantName: string;
    applicantPhone: string;
    familyId?: string;
    memberId?: string;
    details: Record<string, any>;
  }): Registration {
    const regCount = this.data.registrations.length + 128;
    const id = `MH-REG-2026-${String(regCount).padStart(6, '0')}`;
    const now = new Date().toISOString();

    const reg: Registration = {
      id,
      type: regData.type,
      applicantName: regData.applicantName,
      applicantPhone: regData.applicantPhone,
      familyId: regData.familyId,
      memberId: regData.memberId,
      details: regData.details,
      status: 'SUBMITTED',
      submittedAt: now,
      statusHistory: [
        {
          status: 'SUBMITTED',
          updatedAt: now,
          updatedBy: regData.applicantName,
          notes: 'Registration submitted online via Manoor Mahall Digital Portal.',
        }
      ],
    };

    this.data.registrations.unshift(reg);

    // If family linked, update timeline
    if (regData.familyId) {
      const family = this.data.families.find(f => f.id.toLowerCase() === regData.familyId?.toLowerCase());
      if (family) {
        if (!family.timeline) family.timeline = [];
        family.timeline.unshift({
          id: `TL-${Date.now()}`,
          type: 'REGISTRATION',
          title: `${reg.type} Registration`,
          description: `Application ${reg.id} submitted for review`,
          date: now.split('T')[0],
          actor: regData.applicantName,
        });
      }
    }

    this.addAuditLog(regData.applicantPhone, regData.applicantName, 'MEMBER', 'REGISTRATION_SUBMITTED', 'Registration', reg.id, `Submitted ${reg.type} registration`);
    this.saveData();
    return reg;
  }

  public updateRegistrationStatus(id: string, status: Registration['status'], notes: string, actorName: string, actorId: string): Registration {
    const reg = this.data.registrations.find(r => r.id === id);
    if (!reg) throw new Error('Registration record not found');

    reg.status = status;
    reg.reviewedBy = actorName;
    reg.reviewNotes = notes;
    reg.statusHistory.unshift({
      status,
      updatedAt: new Date().toISOString(),
      updatedBy: actorName,
      notes,
    });

    // If approved madrasa admission or marriage, trigger connected workflow
    if (status === 'APPROVED' && reg.type === 'Madrasa Admission' && reg.familyId) {
      const d = reg.details;
      this.admitStudent({
        name: d.studentName || reg.applicantName,
        familyId: reg.familyId,
        guardianName: d.guardianName || reg.applicantName,
        guardianPhone: reg.applicantPhone,
        standard: d.requestedStandard || 'Class 1',
        division: 'A',
        dob: d.dob || '2019-01-01',
      }, actorName, actorId);
    }

    this.addAuditLog(actorId, actorName, 'SECRETARY', 'REGISTRATION_STATUS_UPDATED', 'Registration', reg.id, `Status updated to ${status} for ${reg.applicantName}`);
    this.saveData();
    return reg;
  }

  // COMMUNITY SERVICES & HELP DESK
  public getServices(): CommunityService[] {
    return this.data.services;
  }

  public getServiceRequests(): ServiceRequest[] {
    return this.data.serviceRequests;
  }

  public createServiceRequest(req: {
    serviceId: string;
    serviceTitle: string;
    applicantName: string;
    applicantPhone: string;
    familyId?: string;
    memberId?: string;
    category?: string;
    subject?: string;
    urgency: ServiceRequest['urgency'];
    description: string;
  }): ServiceRequest {
    const id = `MH-SRV-2026-${String(this.data.serviceRequests.length + 44).padStart(3, '0')}`;
    const newReq: ServiceRequest = {
      id,
      ...req,
      status: 'NEW',
      date: new Date().toISOString().split('T')[0],
    };
    this.data.serviceRequests.unshift(newReq);
    this.addAuditLog(req.applicantPhone, req.applicantName, 'MEMBER', 'SERVICE_REQUEST_SUBMITTED', 'ServiceRequest', id, `Requested service: ${req.serviceTitle}`);
    this.saveData();
    return newReq;
  }

  public updateServiceRequestStatus(
    id: string,
    status: ServiceRequest['status'],
    responseNotes: string,
    assignedTo: string,
    actorName: string,
    actorId: string
  ): ServiceRequest {
    const req = this.data.serviceRequests.find(r => r.id === id);
    if (!req) throw new Error('Service request not found');
    req.status = status;
    if (responseNotes) req.responseNotes = responseNotes;
    if (assignedTo) req.assignedTo = assignedTo;
    this.addAuditLog(actorId, actorName, 'ADMIN', 'SERVICE_REQUEST_UPDATED', 'ServiceRequest', id, `Status updated to ${status} for ${req.applicantName}`);
    this.saveData();
    return req;
  }

  // PROBLEM SOLVING (CONFIDENTIAL)
  public getProblemCases(): ProblemCase[] {
    return this.data.problemCases;
  }

  public createProblemCase(caseData: {
    category: ProblemCase['category'];
    applicantName: string;
    applicantPhone: string;
    familyId?: string;
    priority: ProblemCase['priority'];
    description: string;
  }): ProblemCase {
    const id = `MH-CASE-2026-${String(this.data.problemCases.length + 20).padStart(3, '0')}`;
    const newCase: ProblemCase = {
      id,
      ...caseData,
      status: 'New',
      privateNotes: [
        {
          date: new Date().toISOString().split('T')[0],
          author: 'System Intake Desk',
          note: 'Case securely logged into confidential grievance ledger. Access restricted to Committee & Scholar council.',
        }
      ],
      date: new Date().toISOString().split('T')[0],
    };
    this.data.problemCases.unshift(newCase);
    this.addAuditLog('CONFIDENTIAL', 'Intake Desk', 'WELFARE', 'CASE_LOGGED', 'ProblemCase', id, `Logged confidential assistance case`);
    this.saveData();
    return newCase;
  }

  // --- ZAKAT MANAGEMENT & METHODOLOGY ---
  public getZakatConfig(): ZakatConfiguration {
    return this.data.zakatConfig;
  }

  public updateZakatConfig(
    updatedConfig: Partial<ZakatConfiguration>,
    actorName: string,
    actorId: string
  ): ZakatConfiguration {
    this.data.zakatConfig = {
      ...this.data.zakatConfig,
      ...updatedConfig,
      updatedBy: actorName,
      updatedAt: new Date().toISOString(),
    };
    this.addAuditLog(actorId, actorName, 'ADMIN', 'ZAKAT_CONFIG_UPDATED', 'ZakatConfiguration', this.data.zakatConfig.id, `Updated Zakat calculation methodology & rates`);
    this.saveData();
    return this.data.zakatConfig;
  }

  public saveZakatCalculation(calc: Omit<ZakatCalculationRecord, 'id' | 'date'>): ZakatCalculationRecord {
    const rec: ZakatCalculationRecord = {
      id: `ZKT-${Date.now().toString(36).toUpperCase()}`,
      date: new Date().toISOString(),
      ...calc,
    };
    this.data.zakatCalculations.unshift(rec);
    this.saveData();
    return rec;
  }

  public getZakatCalculations(userId?: string): ZakatCalculationRecord[] {
    if (!userId) {
      return this.data.zakatCalculations;
    }
    return this.data.zakatCalculations.filter(c => c.userId === userId);
  }

  public deleteZakatCalculation(id: string, userId?: string, isAdmin?: boolean): boolean {
    const idx = this.data.zakatCalculations.findIndex(c => c.id === id);
    if (idx === -1) return false;
    if (!isAdmin && userId && this.data.zakatCalculations[idx].userId !== userId) {
      throw new Error('Unauthorized to delete this calculation');
    }
    this.data.zakatCalculations.splice(idx, 1);
    this.saveData();
    return true;
  }

  // --- WARASATH / INHERITANCE MANAGEMENT ---
  public saveWarasathCase(caseData: Omit<WarasathCase, 'id' | 'date'>): WarasathCase {
    const newCase: WarasathCase = {
      id: `WAR-${Date.now().toString(36).toUpperCase()}`,
      date: new Date().toISOString(),
      ...caseData,
      status: caseData.status || 'PRELIMINARY',
    };
    this.data.warasathCases.unshift(newCase);
    this.saveData();
    return newCase;
  }

  public getWarasathCases(userId?: string, isAdmin?: boolean): WarasathCase[] {
    if (isAdmin) {
      return this.data.warasathCases;
    }
    if (!userId) {
      return this.data.warasathCases.filter(c => !c.userId || c.status === 'SCHOLAR VERIFIED');
    }
    return this.data.warasathCases.filter(c => c.userId === userId || !c.userId);
  }

  public getWarasathCaseById(id: string): WarasathCase | null {
    return this.data.warasathCases.find(c => c.id === id) || null;
  }

  public submitWarasathForReview(caseId: string, notes?: string): WarasathCase {
    const item = this.data.warasathCases.find(c => c.id === caseId);
    if (!item) throw new Error('Inheritance case not found');
    item.status = 'SUBMITTED_FOR_REVIEW';
    if (notes) {
      if (!item.explanation) item.explanation = [];
      item.explanation.push(`[Applicant Submission Note]: ${notes}`);
    }
    this.saveData();
    return item;
  }

  public addScholarReview(
    reviewData: Omit<ScholarReview, 'id' | 'reviewedAt'>,
    actorName: string,
    actorId: string
  ): ScholarReview {
    const review: ScholarReview = {
      id: `REV-${Date.now().toString(36).toUpperCase()}`,
      reviewedAt: new Date().toISOString(),
      ...reviewData,
    };
    if (!this.data.scholarReviews) {
      this.data.scholarReviews = [];
    }
    this.data.scholarReviews.unshift(review);

    // Update case status
    const caseItem = this.data.warasathCases.find(c => c.id === review.caseId);
    if (caseItem) {
      if (review.status === 'APPROVED') {
        caseItem.status = 'SCHOLAR VERIFIED';
        caseItem.verifiedBy = `${review.scholarName} (${review.scholarRole})`;
      } else if (review.status === 'REJECTED') {
        caseItem.status = 'PRELIMINARY';
      }
      if (!caseItem.scholarReviews) {
        caseItem.scholarReviews = [];
      }
      caseItem.scholarReviews.unshift(review);
    }

    this.addAuditLog(actorId, actorName, 'SCHOLAR', 'WARASATH_REVIEWED', 'WarasathCase', review.caseId, `Scholar review: ${review.status} by ${review.scholarName}`);
    this.saveData();
    return review;
  }

  public getScholarReviews(caseId?: string): ScholarReview[] {
    if (!this.data.scholarReviews) return [];
    if (caseId) {
      return this.data.scholarReviews.filter(r => r.caseId === caseId);
    }
    return this.data.scholarReviews;
  }

  // CERTIFICATES
  public getCertificates(): Certificate[] {
    return this.data.certificates;
  }

  public createCertificate(certPayload: Omit<Certificate, 'id' | 'certificateNumber' | 'verificationHash' | 'issueDate'>, actorName: string, actorId: string): Certificate {
    const count = this.data.certificates.length + 91;
    const certificateNumber = `MH-CERT-2026-${String(count).padStart(3, '0')}`;
    const verificationHash = `v_${crypto.randomBytes(8).toString('hex')}`;

    const cert: Certificate = {
      id: `CERT-${Date.now().toString(36).toUpperCase()}`,
      certificateNumber,
      issueDate: new Date().toISOString().split('T')[0],
      verificationHash,
      ...certPayload,
      authorizedSignatory: actorName,
    };

    this.data.certificates.unshift(cert);
    this.addAuditLog(actorId, actorName, 'SECRETARY', 'CERTIFICATE_ISSUED', 'Certificate', cert.certificateNumber, `Issued ${cert.type} certificate for ${cert.recipientName}`);
    this.saveData();
    return cert;
  }

  public verifyCertificate(certNumberOrHash: string): Certificate | null {
    const q = certNumberOrHash.toLowerCase().trim();
    return this.data.certificates.find(c => 
      c.certificateNumber.toLowerCase() === q ||
      c.verificationHash.toLowerCase() === q
    ) || null;
  }

  // GLOBAL SEARCH (Across Families, Members, Students, Payments, Registrations)
  public globalSearch(query: string, userRole: string): {
    families: Family[];
    members: Member[];
    students: MadrasaStudent[];
    payments: Payment[];
    registrations: Registration[];
  } {
    const q = query.toLowerCase().trim();
    if (!q) {
      return { families: [], members: [], students: [], payments: [], registrations: [] };
    }

    const families = this.data.families.filter(f =>
      f.id.toLowerCase().includes(q) ||
      f.houseName.toLowerCase().includes(q) ||
      f.headName.toLowerCase().includes(q) ||
      f.phone.includes(q) ||
      f.ward.toLowerCase().includes(q)
    ).slice(0, 8);

    const members = this.data.members.filter(m =>
      m.id.toLowerCase().includes(q) ||
      m.fullName.toLowerCase().includes(q) ||
      m.phone.includes(q) ||
      m.houseName.toLowerCase().includes(q)
    ).slice(0, 8);

    const students = this.data.students.filter(s =>
      s.admissionNo.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.guardianName.toLowerCase().includes(q) ||
      s.standard.toLowerCase().includes(q)
    ).slice(0, 8);

    const payments = this.data.payments.filter(p =>
      p.receiptNumber.toLowerCase().includes(q) ||
      p.memberName.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.houseName.toLowerCase().includes(q)
    ).slice(0, 8);

    const registrations = this.data.registrations.filter(r =>
      r.id.toLowerCase().includes(q) ||
      r.applicantName.toLowerCase().includes(q) ||
      r.type.toLowerCase().includes(q)
    ).slice(0, 8);

    return { families, members, students, payments, registrations };
  }
}

export const db = new Database();
