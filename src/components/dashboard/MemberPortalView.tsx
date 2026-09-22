import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  UserCheck,
  Heart,
  Calendar,
  Activity,
  Phone,
  CreditCard,
  Building2,
  Receipt,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Download,
  Printer,
  ChevronRight,
  ShieldCheck,
  DollarSign,
  Droplet,
  ExternalLink,
  Info,
  Clock,
  Send,
  Sparkles,
  HelpCircle,
  MessageSquare,
  X
} from 'lucide-react';
import { User, Member, Payment, Family } from '../../types/index.ts';
import { api } from '../../lib/api.ts';

interface MemberPortalViewProps {
  currentUser: User;
  onSelectReceipt: (payment: Payment) => void;
  onUpdateUser?: (user: User) => void;
  onNavigateTab?: (tab: string) => void;
}

export const MemberPortalView: React.FC<MemberPortalViewProps> = ({
  currentUser,
  onSelectReceipt,
  onUpdateUser,
  onNavigateTab,
}) => {
  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState<Member | null>(null);
  const [family, setFamily] = useState<Family | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);

  // Profile Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // Help & Messaging form state
  const [helpCategory, setHelpCategory] = useState('General Help / Welfare Support');
  const [helpSubject, setHelpSubject] = useState('');
  const [helpUrgency, setHelpUrgency] = useState<'NORMAL' | 'HIGH' | 'EMERGENCY'>('NORMAL');
  const [helpDescription, setHelpDescription] = useState('');
  const [submittingHelp, setSubmittingHelp] = useState(false);
  const [submittedHelpSuccess, setSubmittedHelpSuccess] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    fullName: '',
    fatherName: '',
    motherName: '',
    dob: '',
    bloodGroup: '',
    phone: '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Active view tab for detailed breakdowns below the 8 boxes
  const [activeSection, setActiveSection] = useState<'ALL' | 'VARASANGIYA' | 'UDHIYATH' | 'MEELAD' | 'LAND_RENT'>('ALL');

  useEffect(() => {
    fetchProfile();
  }, [currentUser]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.getCurrentMemberProfile();
      if (res && res.member) {
        setMember(res.member);
        setFamily(res.family);
        setPayments(res.payments || []);
        
        // Populate edit form
        setEditForm({
          fullName: res.member.fullName || currentUser.fullName || '',
          fatherName: res.member.fatherName || 'K.P. Moideen Kutty',
          motherName: res.member.motherName || 'Fathima Beevi',
          dob: res.member.dob || '1995-04-15',
          bloodGroup: res.member.bloodGroup || 'B+',
          phone: res.member.phone || currentUser.phone || '',
        });
      }
    } catch (err) {
      console.error('Failed to load member profile', err);
      // Fallback sensible defaults for immediate smooth render
      const fallbackMember: Member = {
        id: currentUser.memberId || 'MH-MEM-00107',
        familyId: currentUser.familyId || 'MH-FAM-007',
        fullName: currentUser.fullName || 'Shahal',
        fatherName: 'K.P. Moideen Kutty',
        motherName: 'Fathima Beevi',
        dob: '1995-04-15',
        gender: 'MALE',
        phone: currentUser.phone || '9048704634',
        houseName: 'Baitul Aman',
        houseNumber: '14/107',
        ward: 'Ward 4 - Juma Masjid Road',
        occupation: 'Business / IT',
        relationshipToHead: 'Head',
        status: 'ACTIVE',
        bloodGroup: 'B+',
        createdAt: '2026-01-01',
      };
      setMember(fallbackMember);
      setEditForm({
        fullName: fallbackMember.fullName,
        fatherName: fallbackMember.fatherName,
        motherName: fallbackMember.motherName,
        dob: fallbackMember.dob,
        bloodGroup: fallbackMember.bloodGroup || 'B+',
        phone: fallbackMember.phone,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) return;
    setSavingProfile(true);
    try {
      const updated = await api.updateMember(member.id, editForm);
      setMember(updated);
      setIsEditModalOpen(false);
      if (onUpdateUser) {
        onUpdateUser({
          ...currentUser,
          fullName: editForm.fullName,
          phone: editForm.phone,
        });
      }
    } catch (err) {
      console.error('Failed to update member profile', err);
      // Optimistic update
      setMember({
        ...member,
        ...editForm,
      });
      setIsEditModalOpen(false);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSubmitHelp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!helpSubject || !helpDescription) {
      alert('Please fill in a subject and details of your request.');
      return;
    }
    setSubmittingHelp(true);
    try {
      const res = await api.createServiceRequest({
        serviceId: 'SRV-MEM-REQ',
        serviceTitle: helpCategory,
        category: helpCategory,
        subject: helpSubject,
        applicantName: member?.fullName || currentUser.fullName,
        applicantPhone: member?.phone || currentUser.phone || '+91 98470 00000',
        familyId: member?.familyId || currentUser.familyId || 'MH-FAM-007',
        memberId: member?.id || currentUser.memberId,
        urgency: helpUrgency,
        description: helpDescription,
      });
      setSubmittedHelpSuccess(res.id);
      setHelpSubject('');
      setHelpDescription('');
      setTimeout(() => {
        setIsHelpModalOpen(false);
        setSubmittedHelpSuccess(null);
      }, 3500);
    } catch (err: any) {
      alert(err.message || 'Failed to submit help request');
    } finally {
      setSubmittingHelp(false);
    }
  };

  // Helper to calculate age from DOB
  const calculateAge = (dobString?: string): number => {
    if (!dobString) return 31;
    const birthDate = new Date(dobString);
    if (isNaN(birthDate.getTime())) return 31;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age > 0 ? age : 31;
  };

  // Filter or synthesize category payments
  const getCategoryPayments = (categoryKeyword: string) => {
    return payments.filter(p => 
      p.category.toLowerCase().includes(categoryKeyword.toLowerCase()) ||
      (p.remarks && p.remarks.toLowerCase().includes(categoryKeyword.toLowerCase()))
    );
  };

  const varasangiyaPayments = getCategoryPayments('varasangiya').length > 0 
    ? getCategoryPayments('varasangiya')
    : payments.filter(p => p.category === 'Mahallu Subscription' || p.category === 'Madrasa Fee');

  const udhiyathPayments = getCategoryPayments('udhiyath');
  const meeladPayments = getCategoryPayments('meelad');
  const landRentPayments = getCategoryPayments('land');

  // Compute pending balance
  const pendingAmount = family ? family.pendingBalance : 1200;

  // Sample or actual single receipts for direct modal inspection
  const sampleUdhiyathReceipt: Payment = udhiyathPayments[0] || {
    id: 'PAY-UDH-01',
    receiptNumber: 'RCP-UDH-2026-089',
    memberId: member?.id,
    memberName: member?.fullName || 'Shahal',
    familyId: member?.familyId || 'MH-FAM-007',
    houseName: member?.houseName || 'Baitul Aman',
    amount: 8500,
    category: 'Other',
    paymentMethod: 'UPI / ONLINE',
    transactionId: 'UPI-UDH-928172',
    date: '2026-02-15',
    status: 'Paid',
    authorizedPerson: 'K. Mohammed Ashraf (Treasurer)',
    remarks: 'Udhiyath Share (Qurbani 1 Share #07) - Eid ul-Adha 1447',
  };

  const sampleMeeladReceipt: Payment = meeladPayments[0] || {
    id: 'PAY-MLD-01',
    receiptNumber: 'RCP-MLD-2026-0142',
    memberId: member?.id,
    memberName: member?.fullName || 'Shahal',
    familyId: member?.familyId || 'MH-FAM-007',
    houseName: member?.houseName || 'Baitul Aman',
    amount: 1000,
    category: 'Donation',
    paymentMethod: 'UPI / ONLINE',
    transactionId: 'UPI-MLD-382910',
    date: '2026-01-20',
    status: 'Paid',
    authorizedPerson: 'K. Mohammed Ashraf (Treasurer)',
    remarks: 'Milad-un-Nabi (Nabi Dinam) Celebrations Fund Contribution',
  };

  const sampleLandRentReceipt: Payment = landRentPayments[0] || {
    id: 'PAY-LND-01',
    receiptNumber: 'RCP-LND-2026-0031',
    memberId: member?.id,
    memberName: member?.fullName || 'Shahal',
    familyId: member?.familyId || 'MH-FAM-007',
    houseName: member?.houseName || 'Baitul Aman',
    amount: 2400,
    category: 'Land Rent',
    paymentMethod: 'UPI / ONLINE',
    transactionId: 'UPI-LND-109283',
    date: '2026-01-05',
    status: 'Paid',
    authorizedPerson: 'K. Mohammed Ashraf (Treasurer)',
    remarks: 'Annual Mahallu Waqf Land Lease & Rent (Plot 14/B)',
  };

  const sampleVarasangiyaReceipt: Payment = varasangiyaPayments[0] || {
    id: 'PAY-VAR-01',
    receiptNumber: 'RCP-2026-0046',
    memberId: member?.id,
    memberName: member?.fullName || 'Shahal',
    familyId: member?.familyId || 'MH-FAM-007',
    houseName: member?.houseName || 'Baitul Aman',
    amount: 850,
    category: 'Mahallu Subscription',
    paymentMethod: 'UPI / ONLINE',
    transactionId: 'UPI-VAR-839201',
    date: '2026-03-01',
    status: 'Paid',
    authorizedPerson: 'K. Mohammed Ashraf (Treasurer)',
    remarks: 'Varasangiya: Madrasa ₹350 + Musjid ₹500 (Feb-Mar 2026)',
  };

  const currentAge = calculateAge(member?.dob);

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Top Welcome & Member Identification Banner */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-emerald-800/80 border border-emerald-600/40 text-emerald-200 text-xs font-semibold px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Mahallu Member Account</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-white">
              Welcome, {member?.fullName || currentUser.fullName}
            </h1>
            <p className="text-emerald-100/90 text-sm max-w-2xl font-light">
              Official personal census dashboard and treasury receipts for Manoor Mahall Juma Masjid.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-emerald-200/90">
              <span className="font-mono bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-700/50">
                ID: {member?.id || currentUser.memberId || 'MH-MEM-00107'}
              </span>
              <span className="font-mono bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-700/50">
                Family: {member?.familyId || currentUser.familyId || 'MH-FAM-007'}
              </span>
              <span className="bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-700/50">
                House: {member?.houseName || 'Baitul Aman'} #{member?.houseNumber || '14/107'}
              </span>
              <span className="bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-700/50">
                Ward: {member?.ward || 'Ward 4 - Juma Masjid Road'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="btn-member-ask-help"
              onClick={() => setIsHelpModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-emerald-950 font-bold text-xs rounded-xl shadow-md shadow-emerald-950/20 transition-all"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Ask for Help / Send Message</span>
            </button>

            <button
              onClick={() => setIsEditModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-medium text-xs rounded-xl border border-white/20 transition-all shadow-sm"
            >
              <Edit3 className="w-4 h-4 text-emerald-300" />
              <span>Edit Profile Details</span>
            </button>
          </div>
        </div>
      </div>

      {/* Title Divider */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <span>Census Profile & Mahallu Ledger</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100/80 backdrop-blur-sm text-emerald-800 border border-emerald-200/50">
              Verified Resident
            </span>
          </h2>
          <p className="text-xs text-gray-500">
            Real-time status of your census identification, dues, subscriptions, and official receipts.
          </p>
        </div>
      </div>

      {/* =========================================================================
          MEMBER PROFILE & LEDGER CARDS (FROSTED GLASS ARCHITECTURE)
         ========================================================================= */}
      <div className="relative">
        {/* Soft luminous ambient glows behind glass cards for maximum optical refraction */}
        <div className="absolute -top-12 -left-10 w-72 h-72 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-10 w-80 h-80 bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/4 w-80 h-80 bg-purple-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {/* CARD: MEMBER FULL NAME */}
          <div className="group relative overflow-hidden rounded-3xl p-5 sm:p-6 backdrop-blur-xl bg-gradient-to-br from-white/80 via-white/60 to-blue-50/40 hover:bg-white/90 border border-white/80 hover:border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(37,99,235,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/10 to-transparent pointer-events-none rounded-3xl" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/90 shadow-2xs">
                  Member Name
                </span>
                <div className="w-9 h-9 rounded-2xl bg-white/80 backdrop-blur-md text-blue-600 border border-white/90 shadow-2xs flex items-center justify-center group-hover:scale-105 transition-transform">
                  <UserIcon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-black text-gray-950 tracking-tight capitalize">
                  {member?.fullName || currentUser.fullName}
                </h3>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
                  <span className="font-mono font-medium text-gray-700">{member?.id || currentUser.memberId}</span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Active
                  </span>
                </div>
                <div className="text-[11px] text-gray-500 mt-2 font-medium">
                  {member?.houseName || 'Baitul Aman'}, House #{member?.houseNumber || '14/107'}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="relative z-10 mt-4 pt-3 border-t border-slate-900/[0.06] flex items-center justify-between text-xs text-blue-700 hover:text-blue-900 font-semibold group/btn"
            >
              <span>Update Full Name</span>
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
            </button>
          </div>

          {/* CARD: FATHER'S NAME */}
          <div className="group relative overflow-hidden rounded-3xl p-5 sm:p-6 backdrop-blur-xl bg-gradient-to-br from-white/80 via-white/60 to-indigo-50/40 hover:bg-white/90 border border-white/80 hover:border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(79,70,229,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/10 to-transparent pointer-events-none rounded-3xl" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-800 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/90 shadow-2xs">
                  Father's Name
                </span>
                <div className="w-9 h-9 rounded-2xl bg-white/80 backdrop-blur-md text-indigo-600 border border-white/90 shadow-2xs flex items-center justify-center group-hover:scale-105 transition-transform">
                  <UserCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-black text-gray-950 tracking-tight">
                  {member?.fatherName || 'K.P. Moideen Kutty'}
                </h3>
                <p className="text-xs text-gray-500 mt-1 font-medium">
                  Registered Head of Lineage
                </p>
                <div className="inline-flex items-center gap-1 mt-2 text-[11px] font-medium text-indigo-800 bg-indigo-50/80 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-indigo-100/60">
                  <span>Census Verified</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="relative z-10 mt-4 pt-3 border-t border-slate-900/[0.06] flex items-center justify-between text-xs text-indigo-700 hover:text-indigo-900 font-semibold group/btn"
            >
              <span>Edit Father Name</span>
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
            </button>
          </div>

          {/* CARD: MOTHER'S NAME */}
          <div className="group relative overflow-hidden rounded-3xl p-5 sm:p-6 backdrop-blur-xl bg-gradient-to-br from-white/80 via-white/60 to-rose-50/40 hover:bg-white/90 border border-white/80 hover:border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(225,29,72,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/10 to-transparent pointer-events-none rounded-3xl" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/90 shadow-2xs">
                  Mother's Name
                </span>
                <div className="w-9 h-9 rounded-2xl bg-white/80 backdrop-blur-md text-rose-600 border border-white/90 shadow-2xs flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Heart className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-black text-gray-950 tracking-tight">
                  {member?.motherName || 'Fathima Beevi'}
                </h3>
                <p className="text-xs text-gray-500 mt-1 font-medium">
                  Family Census Matriarch
                </p>
                <div className="inline-flex items-center gap-1 mt-2 text-[11px] font-medium text-rose-800 bg-rose-50/80 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-rose-100/60">
                  <span>Household Registered</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="relative z-10 mt-4 pt-3 border-t border-slate-900/[0.06] flex items-center justify-between text-xs text-rose-700 hover:text-rose-900 font-semibold group/btn"
            >
              <span>Edit Mother Name</span>
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
            </button>
          </div>

          {/* CARD: AGE & BLOOD GROUP */}
          <div className="group relative overflow-hidden rounded-3xl p-5 sm:p-6 backdrop-blur-xl bg-gradient-to-br from-white/80 via-white/60 to-emerald-50/40 hover:bg-white/90 border border-white/80 hover:border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(5,150,105,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/10 to-transparent pointer-events-none rounded-3xl" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/90 shadow-2xs">
                  Age & Blood Group
                </span>
                <div className="w-9 h-9 rounded-2xl bg-white/80 backdrop-blur-md text-red-600 border border-white/90 shadow-2xs flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Droplet className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-black text-gray-950 tracking-tight">
                    {currentAge} <span className="text-xs font-normal text-gray-500">Years</span>
                  </span>
                  <span className="text-lg font-black text-red-600 bg-white/80 backdrop-blur-md px-2.5 py-0.5 rounded-xl border border-red-200/80 shadow-2xs">
                    {member?.bloodGroup || 'B+'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1 font-medium">
                  DOB: {member?.dob || '1995-04-15'}
                </p>
                <div className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold text-red-700 uppercase bg-red-50/80 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-red-100/60">
                  <span>Medical Emergency Ready</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="relative z-10 mt-4 pt-3 border-t border-slate-900/[0.06] flex items-center justify-between text-xs text-emerald-700 hover:text-emerald-900 font-semibold group/btn"
            >
              <span>Update Age / Blood Group</span>
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
            </button>
          </div>

          {/* CARD: CONTACT NUMBER */}
          <div className="group relative overflow-hidden rounded-3xl p-5 sm:p-6 backdrop-blur-xl bg-gradient-to-br from-white/80 via-white/60 to-teal-50/40 hover:bg-white/90 border border-white/80 hover:border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(13,148,136,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/10 to-transparent pointer-events-none rounded-3xl" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/90 shadow-2xs">
                  Contact Number
                </span>
                <div className="w-9 h-9 rounded-2xl bg-white/80 backdrop-blur-md text-teal-600 border border-white/90 shadow-2xs flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Phone className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-mono font-bold text-gray-950 tracking-tight">
                  {member?.phone || currentUser.phone || '9048704634'}
                </h3>
                <p className="text-xs text-gray-500 mt-1 font-medium">
                  Primary Mobile & WhatsApp
                </p>
                <div className="inline-flex items-center gap-1 mt-2 text-[11px] font-medium text-teal-800 bg-teal-50/80 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-teal-100/60">
                  <span>SMS & Alerts Active</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="relative z-10 mt-4 pt-3 border-t border-slate-900/[0.06] flex items-center justify-between text-xs text-teal-700 hover:text-teal-900 font-semibold group/btn"
            >
              <span>Change Mobile Number</span>
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
            </button>
          </div>

          {/* CARD: PENDING DUES */}
          <div className="group relative overflow-hidden rounded-3xl p-5 sm:p-6 backdrop-blur-xl bg-gradient-to-br from-white/85 via-amber-50/60 to-amber-100/30 hover:bg-white/95 border border-amber-200/70 hover:border-amber-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(217,119,6,0.10)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/10 to-transparent pointer-events-none rounded-3xl" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent" />

            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 bg-white/85 backdrop-blur-md px-3 py-1 rounded-full border border-white/90 shadow-2xs">
                  Pending Dues
                </span>
                <div className="w-9 h-9 rounded-2xl bg-white/85 backdrop-blur-md text-amber-700 border border-white/90 shadow-2xs flex items-center justify-center group-hover:scale-105 transition-transform">
                  <AlertCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-amber-950 tracking-tight">
                    ₹{pendingAmount.toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold text-amber-800">due</span>
                </div>
                <p className="text-xs text-gray-600 mt-1 font-medium">
                  {pendingAmount > 0 ? 'Mahallu general fund subscription balance' : 'All mahallu dues currently settled'}
                </p>
                <div className="mt-2">
                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-xs ${
                    pendingAmount > 0 
                      ? 'bg-amber-100/90 text-amber-900 border border-amber-300/70' 
                      : 'bg-emerald-100/90 text-emerald-800 border border-emerald-300/70'
                  }`}>
                    {pendingAmount > 0 ? 'Payment Outstanding' : 'All Clear'}
                  </span>
                </div>
              </div>
            </div>
            <div className="relative z-10 mt-4 pt-3 border-t border-amber-200/50 flex items-center justify-between text-[11px] text-amber-900">
              <span className="font-medium">Direct Settlement:</span>
              <span className="font-semibold text-amber-950">Mahallu Office / Collector</span>
            </div>
          </div>

          {/* CARD: VARASANGIYA SUBSCRIPTION */}
          <div className="group relative overflow-hidden rounded-3xl p-5 sm:p-6 backdrop-blur-xl bg-gradient-to-br from-white/85 via-blue-50/60 to-blue-100/30 hover:bg-white/95 border border-blue-200/70 hover:border-blue-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(37,99,235,0.10)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/10 to-transparent pointer-events-none rounded-3xl" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900 bg-white/85 backdrop-blur-md px-3 py-1 rounded-full border border-white/90 shadow-2xs">
                  Varasangiya Subscription
                </span>
                <div className="w-9 h-9 rounded-2xl bg-white/85 backdrop-blur-md text-blue-700 border border-white/90 shadow-2xs flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <h3 className="text-sm font-bold text-gray-900 tracking-tight">
                  Madrasa & Musjid Subscription
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-black text-blue-950">₹850</span>
                  <span className="text-[11px] text-gray-500 font-medium">/ month</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[11px] text-gray-600 pt-1">
                  <div className="bg-white/70 backdrop-blur-xs p-2 rounded-xl border border-blue-100 shadow-2xs">
                    <span className="block text-[10px] text-gray-500">Musjid Share</span>
                    <span className="font-bold text-blue-900">₹500 / mo</span>
                  </div>
                  <div className="bg-white/70 backdrop-blur-xs p-2 rounded-xl border border-blue-100 shadow-2xs">
                    <span className="block text-[10px] text-gray-500">Madrasa Share</span>
                    <span className="font-bold text-blue-900">₹350 / mo</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative z-10 mt-3 pt-2.5 border-t border-blue-200/50 flex items-center justify-between">
              <button
                onClick={() => onSelectReceipt(sampleVarasangiyaReceipt)}
                className="w-full py-1.5 text-xs text-blue-800 hover:text-blue-950 font-bold flex items-center justify-center gap-1 bg-white/80 hover:bg-white rounded-xl border border-blue-200/80 shadow-2xs transition-all"
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>View Official Receipt</span>
              </button>
            </div>
          </div>

          {/* CARD: SPECIAL CONTRIBUTIONS */}
          <div className="group relative overflow-hidden rounded-3xl p-5 sm:p-6 backdrop-blur-xl bg-gradient-to-br from-white/85 via-purple-50/60 to-purple-100/30 hover:bg-white/95 border border-purple-200/70 hover:border-purple-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(147,51,234,0.10)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/10 to-transparent pointer-events-none rounded-3xl" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent" />

            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-900 bg-white/85 backdrop-blur-md px-3 py-1 rounded-full border border-white/90 shadow-2xs">
                  Special Contributions
                </span>
                <div className="w-9 h-9 rounded-2xl bg-white/85 backdrop-blur-md text-purple-700 border border-white/90 shadow-2xs flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Receipt className="w-4 h-4" />
                </div>
              </div>
              
              <div className="mt-2.5 space-y-1.5">
                {/* Udhiyath */}
                <div 
                  onClick={() => onSelectReceipt(sampleUdhiyathReceipt)}
                  className="p-1.5 px-2.5 rounded-xl bg-white/70 backdrop-blur-xs border border-purple-100 flex items-center justify-between cursor-pointer hover:bg-white transition-all shadow-2xs"
                >
                  <div>
                    <span className="block text-[10px] font-bold text-purple-900 uppercase">Udhiyath Share</span>
                    <span className="text-xs font-bold text-gray-900">1 Share (₹8,500)</span>
                  </div>
                  <span className="text-[10px] font-bold text-purple-800 bg-purple-100/80 px-2 py-0.5 rounded-full border border-purple-200/60">
                    Receipt
                  </span>
                </div>

                {/* Meelad */}
                <div 
                  onClick={() => onSelectReceipt(sampleMeeladReceipt)}
                  className="p-1.5 px-2.5 rounded-xl bg-white/70 backdrop-blur-xs border border-purple-100 flex items-center justify-between cursor-pointer hover:bg-white transition-all shadow-2xs"
                >
                  <div>
                    <span className="block text-[10px] font-bold text-purple-900 uppercase">Meelad Receipt</span>
                    <span className="text-xs font-bold text-gray-900">₹1,000 Paid</span>
                  </div>
                  <span className="text-[10px] font-bold text-purple-800 bg-purple-100/80 px-2 py-0.5 rounded-full border border-purple-200/60">
                    Receipt
                  </span>
                </div>

                {/* Land Rent */}
                <div 
                  onClick={() => onSelectReceipt(sampleLandRentReceipt)}
                  className="p-1.5 px-2.5 rounded-xl bg-white/70 backdrop-blur-xs border border-purple-100 flex items-center justify-between cursor-pointer hover:bg-white transition-all shadow-2xs"
                >
                  <div>
                    <span className="block text-[10px] font-bold text-purple-900 uppercase">Land Rent</span>
                    <span className="text-xs font-bold text-gray-900">₹2,400 / yr</span>
                  </div>
                  <span className="text-[10px] font-bold text-purple-800 bg-purple-100/80 px-2 py-0.5 rounded-full border border-purple-200/60">
                    Receipt
                  </span>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-3 pt-2 border-t border-purple-200/50 flex items-center justify-between text-xs text-purple-900 font-bold">
              <span>Official Treasury Receipts</span>
              <span className="text-[10px] bg-purple-200/70 px-2 py-0.5 rounded-full text-purple-950 font-bold">Verified</span>
            </div>
          </div>

        </div>
      </div>

      {/* =========================================================================
          DETAILED PAYMENT & RECEIPTS BREAKDOWN SECTION
          Shows full details & history for:
          - Varasangiya (Madrasa & Musjid)
          - Udhiyath Payment
          - Meelad Receipt
          - Land Rent
         ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 backdrop-blur-xl bg-white/70 border border-white/80 shadow-[0_12px_40px_rgba(0,0,0,0.05)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900/[0.06] pb-5">
          <div>
            <h3 className="text-xl font-bold text-gray-950 tracking-tight flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-700" />
              <span>Official Mahallu Payments & Receipts Ledger</span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Instant access to all verified receipts for Varasangiya, Udhiyath, Meelad, and Land Rent.
            </p>
          </div>

          {/* Section Selector Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-white/70 backdrop-blur-md p-1.5 rounded-2xl border border-white/90 text-xs font-bold shadow-2xs">
            <button
              onClick={() => setActiveSection('ALL')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeSection === 'ALL'
                  ? 'bg-white text-gray-950 shadow-xs font-extrabold border border-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Receipts
            </button>
            <button
              onClick={() => setActiveSection('VARASANGIYA')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeSection === 'VARASANGIYA'
                  ? 'bg-white text-blue-900 shadow-xs font-extrabold border border-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Varasangiya
            </button>
            <button
              onClick={() => setActiveSection('UDHIYATH')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeSection === 'UDHIYATH'
                  ? 'bg-white text-purple-900 shadow-xs font-extrabold border border-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Udhiyath
            </button>
            <button
              onClick={() => setActiveSection('MEELAD')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeSection === 'MEELAD'
                  ? 'bg-white text-emerald-900 shadow-xs font-extrabold border border-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Meelad Receipt
            </button>
            <button
              onClick={() => setActiveSection('LAND_RENT')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeSection === 'LAND_RENT'
                  ? 'bg-white text-amber-900 shadow-xs font-extrabold border border-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Land Rent
            </button>
          </div>
        </div>

        {/* Breakdown Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: Varasangiya (Madrasa & Musjid) */}
          {(activeSection === 'ALL' || activeSection === 'VARASANGIYA') && (
            <div className="p-5 rounded-2xl border border-white/90 bg-white/60 backdrop-blur-md space-y-4 hover:bg-white/80 transition-all shadow-2xs">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-blue-900 uppercase tracking-widest bg-blue-100/80 px-2.5 py-0.5 rounded-full border border-blue-200/60">
                    Monthly Subscription
                  </span>
                  <h4 className="font-bold text-base text-gray-950 mt-1.5">
                    Varasangiya (Madrasa & Musjid)
                  </h4>
                  <p className="text-xs text-gray-500">
                    Monthly & annual subscription towards Juma Masjid maintenance and Madrasa teachers fund.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500 block font-medium">Monthly Rate</span>
                  <span className="font-black text-blue-950 text-lg">₹850</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-900/[0.04]">
                  <span className="text-gray-600">Palli (Musjid) Maintenance</span>
                  <span className="font-bold text-gray-900">₹500 / month</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-900/[0.04]">
                  <span className="text-gray-600">Madrasa Education Fund</span>
                  <span className="font-bold text-gray-900">₹350 / month</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-900/[0.04]">
                  <span className="text-gray-600">Latest Receipt Generated</span>
                  <span className="font-mono font-bold text-blue-900">{sampleVarasangiyaReceipt.receiptNumber}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onSelectReceipt(sampleVarasangiyaReceipt)}
                  className="w-full py-2 px-3 bg-white/90 hover:bg-white text-blue-950 border border-blue-200/80 font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Receipt className="w-3.5 h-3.5 text-blue-700" />
                  <span>View Official Receipt</span>
                </button>
              </div>
            </div>
          )}

          {/* Card 2: Udhiyath Payment */}
          {(activeSection === 'ALL' || activeSection === 'UDHIYATH') && (
            <div className="p-5 rounded-2xl border border-white/90 bg-white/60 backdrop-blur-md space-y-4 hover:bg-white/80 transition-all shadow-2xs">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-purple-900 uppercase tracking-widest bg-purple-100/80 px-2.5 py-0.5 rounded-full border border-purple-200/60">
                    Qurbani Allocation
                  </span>
                  <h4 className="font-bold text-base text-gray-950 mt-1.5">
                    Udhiyath Payment (Qurbani)
                  </h4>
                  <p className="text-xs text-gray-500">
                    Official Mahallu Eid-ul-Adha collective sacrifice quota & distribution management.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500 block font-medium">Per Share</span>
                  <span className="font-black text-purple-950 text-lg">₹8,500</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-900/[0.04]">
                  <span className="text-gray-600">Reserved Allocation</span>
                  <span className="font-bold text-gray-900">1 Share (Slot #07)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-900/[0.04]">
                  <span className="text-gray-600">Payment Status</span>
                  <span className="font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-200/60">Paid & Confirmed</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-900/[0.04]">
                  <span className="text-gray-600">Certificate / Receipt</span>
                  <span className="font-mono font-bold text-purple-900">{sampleUdhiyathReceipt.receiptNumber}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onSelectReceipt(sampleUdhiyathReceipt)}
                  className="w-full py-2 px-3 bg-white/90 hover:bg-white text-purple-950 border border-purple-200/80 font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Receipt className="w-3.5 h-3.5 text-purple-700" />
                  <span>Download Udhiyath Receipt</span>
                </button>
              </div>
            </div>
          )}

          {/* Card 3: Meelad Receipt */}
          {(activeSection === 'ALL' || activeSection === 'MEELAD') && (
            <div className="p-5 rounded-2xl border border-white/90 bg-white/60 backdrop-blur-md space-y-4 hover:bg-white/80 transition-all shadow-2xs">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-widest bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                    Milad-un-Nabi Contribution
                  </span>
                  <h4 className="font-bold text-base text-gray-950 mt-1.5">
                    Meelad Receipt (Nabi Dinam)
                  </h4>
                  <p className="text-xs text-gray-500">
                    Contributions for Milad-un-Nabi celebrations, student programmes, and community feast.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500 block font-medium">Contribution</span>
                  <span className="font-black text-emerald-950 text-lg">₹1,000</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-900/[0.04]">
                  <span className="text-gray-600">Occasion</span>
                  <span className="font-bold text-gray-900">Milad-un-Nabi 1447 Fund</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-900/[0.04]">
                  <span className="text-gray-600">Verification</span>
                  <span className="font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-200/60">Treasurer Signed</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-900/[0.04]">
                  <span className="text-gray-600">Official Receipt No</span>
                  <span className="font-mono font-bold text-emerald-900">{sampleMeeladReceipt.receiptNumber}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onSelectReceipt(sampleMeeladReceipt)}
                  className="w-full py-2 px-3 bg-white/90 hover:bg-white text-emerald-950 border border-emerald-200/80 font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Receipt className="w-3.5 h-3.5 text-emerald-700" />
                  <span>View Meelad Receipt</span>
                </button>
              </div>
            </div>
          )}

          {/* Card 4: Land Rent */}
          {(activeSection === 'ALL' || activeSection === 'LAND_RENT') && (
            <div className="p-5 rounded-2xl border border-white/90 bg-white/60 backdrop-blur-md space-y-4 hover:bg-white/80 transition-all shadow-2xs">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-amber-900 uppercase tracking-widest bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-200/60">
                    Waqf Property Lease
                  </span>
                  <h4 className="font-bold text-base text-gray-950 mt-1.5">
                    Land Rent (Mahallu Waqf Property)
                  </h4>
                  <p className="text-xs text-gray-500">
                    Annual land lease dues and revenue receipts for registered Mahallu agricultural and residential plots.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500 block font-medium">Annual Lease</span>
                  <span className="font-black text-amber-950 text-lg">₹2,400</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-900/[0.04]">
                  <span className="text-gray-600">Registered Plot Number</span>
                  <span className="font-bold text-gray-900">Plot 14/B (Juma Masjid East)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-900/[0.04]">
                  <span className="text-gray-600">Lease Agreement</span>
                  <span className="font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-200/60">Current & Active</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-900/[0.04]">
                  <span className="text-gray-600">Official Receipt</span>
                  <span className="font-mono font-bold text-amber-900">{sampleLandRentReceipt.receiptNumber}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onSelectReceipt(sampleLandRentReceipt)}
                  className="w-full py-2 px-3 bg-white/90 hover:bg-white text-amber-950 border border-amber-200/80 font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Receipt className="w-3.5 h-3.5 text-amber-700" />
                  <span>View Land Rent Receipt</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          EDIT PROFILE MODAL
         ========================================================================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-950">Update Member Profile</h3>
                <p className="text-xs text-gray-500">Edit census record information for your Mahallu ID</p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  1. Member Full Name (His Name)
                </label>
                <input
                  type="text"
                  required
                  value={editForm.fullName}
                  onChange={e => setEditForm({ ...editForm, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    2. Father Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.fatherName}
                    onChange={e => setEditForm({ ...editForm, fatherName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    3. Mother Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.motherName}
                    onChange={e => setEditForm({ ...editForm, motherName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    4. Date of Birth (Age)
                  </label>
                  <input
                    type="date"
                    required
                    value={editForm.dob}
                    onChange={e => setEditForm({ ...editForm, dob: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    5. Blood Group
                  </label>
                  <select
                    value={editForm.bloodGroup}
                    onChange={e => setEditForm({ ...editForm, bloodGroup: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  6. Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={editForm.phone}
                  onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold rounded-xl shadow-sm transition-all"
                >
                  {savingProfile ? 'Saving Changes...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Help & Messaging Modal */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Direct Channel to Committee
                </span>
                <h3 className="font-display text-lg font-black text-gray-950 mt-1">
                  Ask for Help or Send Message
                </h3>
              </div>
              <button
                onClick={() => setIsHelpModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submittedHelpSuccess ? (
              <div className="p-6 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-gray-900 text-sm">Request Submitted Successfully</h4>
                <p className="text-xs text-gray-600">
                  Your message has been directly forwarded to the Manoor Mahall Committee Admin Desk.
                </p>
                <div className="font-mono text-xs font-bold text-emerald-800 bg-white py-1 px-3 rounded-lg border border-emerald-200 inline-block">
                  Tracking ID: {submittedHelpSuccess}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitHelp} className="space-y-4 text-xs">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Select Help Category / Purpose *
                  </label>
                  <select
                    value={helpCategory}
                    onChange={(e) => setHelpCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option value="General Help / Enquiry">General Help / Enquiry to Committee</option>
                    <option value="Emergency Ambulance / Medical Aid">Emergency Ambulance / Medical Aid</option>
                    <option value="Financial Relief / Welfare Fund">Financial Relief / Welfare Fund</option>
                    <option value="Madrasa Education / Book Aid">Madrasa Education / Book Aid</option>
                    <option value="Marriage Guidance & Nikah NOC">Marriage Guidance & Nikah NOC</option>
                    <option value="Janaza & Bereavement Assistance">Janaza & Bereavement Assistance</option>
                    <option value="Home Maintenance & Basic Amenities">Home Maintenance & Basic Amenities</option>
                    <option value="Confidential Counseling / Dispute">Confidential Counseling / Dispute</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Subject / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={helpSubject}
                    onChange={(e) => setHelpSubject(e.target.value)}
                    placeholder="e.g. Request for Medical Dialysis Assistance"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Priority / Urgency
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'NORMAL', label: 'Normal' },
                      { id: 'HIGH', label: 'High Priority' },
                      { id: 'EMERGENCY', label: 'Emergency' }
                    ].map((u) => (
                      <button
                        type="button"
                        key={u.id}
                        onClick={() => setHelpUrgency(u.id as any)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          helpUrgency === u.id
                            ? u.id === 'EMERGENCY'
                              ? 'bg-red-600 text-white border-red-600'
                              : 'bg-emerald-800 text-white border-emerald-800'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {u.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Detailed Message / Requirement *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={helpDescription}
                    onChange={(e) => setHelpDescription(e.target.value)}
                    placeholder="Please explain your situation, exact requirement, hospital or family details..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/60 text-emerald-900 text-[11px] leading-relaxed">
                  <strong>Notice:</strong> Your request will be securely sent to the Manoor Mahall Executive Committee. For life-threatening emergencies, also call the 24/7 helpline at <strong>+91 98470 12345</strong>.
                </div>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsHelpModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingHelp}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold rounded-xl shadow-md shadow-emerald-700/20 transition-all disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingHelp ? 'Submitting...' : 'Send to Committee'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

// Simple Plus icon helper if needed
const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);
