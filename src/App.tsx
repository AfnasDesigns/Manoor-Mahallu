import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  PhoneCall,
  Search,
  LogIn,
  LayoutDashboard,
  ShieldCheck,
  CreditCard,
  FileCheck,
  Coins,
  ChevronRight,
  Bell,
  Calendar,
  HeartHandshake,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';

import {
  User,
  DashboardStats,
  Family,
  Member,
  MadrasaStudent,
  Payment,
  Programme,
  Announcement,
  Registration,
  CommunityService,
  ProblemCase,
  AuditLog
} from './types/index.ts';

import { api, getStoredSession, clearStoredSession } from './lib/api.ts';
import { Navbar } from './components/Navbar.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { CommunityStrip } from './components/CommunityStrip.tsx';
import { TodayAtMahall } from './components/TodayAtMahall.tsx';
import { FeatureCards } from './components/FeatureCards.tsx';
import { CompactPrayerTimes } from './components/CompactPrayerTimes.tsx';
import { ProgrammesSection } from './components/ProgrammesSection.tsx';
import { ServicesSection } from './components/ServicesSection.tsx';
import { DigitalMahallShowcase } from './components/DigitalMahallShowcase.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { Footer } from './components/Footer.tsx';
import { AuthPage } from './components/AuthPage.tsx';

// Modals
import { AuthModal } from './components/AuthModal.tsx';
import { RegistrationTrackerModal } from './components/RegistrationTrackerModal.tsx';
import { ZakatCalculatorModal } from './components/ZakatCalculatorModal.tsx';
import { CertificateVerificationModal } from './components/CertificateVerificationModal.tsx';
import { EmergencyHelpModal } from './components/EmergencyHelpModal.tsx';
import { ManoorAIChatModal } from './components/ManoorAIChatModal.tsx';
import { ReceiptModal } from './components/ReceiptModal.tsx';
import { GlobalSearchModal } from './components/GlobalSearchModal.tsx';

// Dashboard Views
import { DashboardLayout } from './components/dashboard/DashboardLayout.tsx';
import { OverviewView } from './components/dashboard/OverviewView.tsx';
import { FamiliesView } from './components/dashboard/FamiliesView.tsx';
import { MembersView } from './components/dashboard/MembersView.tsx';
import { MadrasaView } from './components/dashboard/MadrasaView.tsx';
import { FinanceView } from './components/dashboard/FinanceView.tsx';
import { AnnouncementsCMSView } from './components/dashboard/AnnouncementsCMSView.tsx';
import { RegistrationsAdminView } from './components/dashboard/RegistrationsAdminView.tsx';
import { ProblemSolvingView } from './components/dashboard/ProblemSolvingView.tsx';
import { AuditLogsView } from './components/dashboard/AuditLogsView.tsx';
import { MemberPortalView } from './components/dashboard/MemberPortalView.tsx';
import { ProgrammesAdminView } from './components/dashboard/ProgrammesAdminView.tsx';
import { MessagesHelpdeskAdminView } from './components/dashboard/MessagesHelpdeskAdminView.tsx';

export default function App() {
  // Navigation & View Mode: Supports Public Home, Dashboard OS, and dedicated Auth Page
  const [viewMode, setViewMode] = useState<'PUBLIC' | 'DASHBOARD' | 'AUTH'>('PUBLIC');
  const [authInitialRole, setAuthInitialRole] = useState<'MEMBER' | 'ADMIN'>('MEMBER');
  const [dashboardTab, setDashboardTab] = useState<string>('overview');

  const handleOpenAuth = (initialRole: 'MEMBER' | 'ADMIN' = 'MEMBER') => {
    setAuthInitialRole(initialRole);
    setViewMode('AUTH');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Core Data
  const [stats, setStats] = useState<DashboardStats>({
    totalFamilies: 142,
    totalMembers: 586,
    totalStudents: 180,
    monthlyIncome: 425000,
    monthlyExpenses: 120000,
    pendingPayments: 45000,
    upcomingProgrammesCount: 6,
    openServiceRequestsCount: 4,
  });
  const [families, setFamilies] = useState<Family[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [students, setStudents] = useState<MadrasaStudent[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [services, setServices] = useState<CommunityService[]>([]);
  const [problemCases, setProblemCases] = useState<ProblemCase[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Modals Visibility
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showTrackerModal, setShowTrackerModal] = useState(false);
  const [trackerInitialType, setTrackerInitialType] = useState<string>('Marriage');
  const [showZakatModal, setShowZakatModal] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);

  // Quick Action triggered from TodayWidget
  const handleQuickAction = (actionId: string) => {
    if (actionId === 'marriage_noc') {
      setTrackerInitialType('Marriage');
      setShowTrackerModal(true);
    } else if (actionId === 'track_reg') {
      setShowTrackerModal(true);
    } else if (actionId === 'pay_dues') {
      if (currentUser) {
        setViewMode('DASHBOARD');
        setDashboardTab('finance');
      } else {
        handleOpenAuth('MEMBER');
      }
    } else if (actionId === 'emergency_sos') {
      setShowEmergencyModal(true);
    } else if (actionId === 'zakat_calc') {
      setShowZakatModal(true);
    } else if (actionId === 'verify_cert') {
      setShowCertModal(true);
    }
  };

  // Initial Data Load
  const fetchAllData = async () => {
    try {
      const [
        statsRes,
        progRes,
        srvRes,
        annRes,
        famRes,
        memRes,
        stuRes,
        payRes,
        regRes,
        probRes,
        auditRes,
      ] = await Promise.all([
        api.getStats().catch(() => stats),
        api.getProgrammes().catch(() => []),
        api.getServices().catch(() => []),
        api.getAnnouncements().catch(() => []),
        api.getFamilies().catch(() => []),
        api.getMembers().catch(() => []),
        api.getStudents().catch(() => []),
        api.getPayments().catch(() => []),
        api.getRegistrations().catch(() => []),
        api.getProblemCases().catch(() => []),
        api.getAuditLogs().catch(() => []),
      ]);

      if (statsRes) setStats(statsRes);
      if (progRes) setProgrammes(progRes);
      if (srvRes) setServices(srvRes);
      if (annRes) setAnnouncements(annRes);
      if (famRes) setFamilies(famRes);
      if (memRes) setMembers(memRes);
      if (stuRes) setStudents(stuRes);
      if (payRes) setPayments(payRes);
      if (regRes) setRegistrations(regRes);
      if (probRes) setProblemCases(probRes);
      if (auditRes) setAuditLogs(auditRes);
    } catch (e) {
      console.error('Initial data fetch error:', e);
    }
  };

  useEffect(() => {
    // Check local session
    const sess = getStoredSession();
    if (sess) {
      setCurrentUser(sess.user);
    }
    fetchAllData();

    // Listen for Ctrl+K shortcut
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchModal(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    clearStoredSession();
    setCurrentUser(null);
    setViewMode('PUBLIC');
  };

  return (
    <div className="min-h-screen bg-[#F7F9F8] text-gray-900 font-sans selection:bg-emerald-200 selection:text-emerald-950">
      
      {/* If in Dashboard View, render the complete Dashboard workspace */}
      {viewMode === 'DASHBOARD' && currentUser ? (
        <DashboardLayout
          currentUser={currentUser}
          currentTab={dashboardTab}
          onSelectTab={(tab) => setDashboardTab(tab)}
          onBackToPublic={() => setViewMode('PUBLIC')}
          onLogout={handleLogout}
        >
          {currentUser.role === 'MEMBER' ? (
            /* Members strictly and only see their personalized 8-Box Mahallu Profile */
            <MemberPortalView
              currentUser={currentUser}
              onSelectReceipt={(p) => setSelectedReceipt(p)}
              onUpdateUser={(u) => setCurrentUser(u)}
              onNavigateTab={(tab) => setDashboardTab(tab)}
            />
          ) : (
            /* Administrator Command Center and Management Views */
            <>
              {dashboardTab === 'overview' && (
                <OverviewView
                  stats={stats}
                  currentUser={currentUser}
                  onNavigateTab={(tab) => setDashboardTab(tab)}
                  onOpenRecordPayment={() => {
                    setDashboardTab('finance');
                  }}
                  onOpenAddFamily={() => {
                    setDashboardTab('families');
                  }}
                  onOpenCreateNotice={() => {
                    setDashboardTab('announcements-admin');
                  }}
                  onSelectReceipt={(p) => setSelectedReceipt(p)}
                  recentPayments={payments}
                  upcomingProgrammes={programmes}
                />
              )}

              {dashboardTab === 'families' && (
                <FamiliesView
                  families={families}
                  onSelectReceipt={(p) => setSelectedReceipt(p)}
                  onRefreshFamilies={fetchAllData}
                />
              )}

              {dashboardTab === 'members' && (
                <MembersView members={members} />
              )}

              {dashboardTab === 'madrasa' && (
                <MadrasaView
                  students={students}
                  onRefreshStudents={fetchAllData}
                />
              )}

              {dashboardTab === 'finance' && (
                <FinanceView
                  payments={payments}
                  families={families}
                  onSelectReceipt={(p) => setSelectedReceipt(p)}
                  onRefreshPayments={fetchAllData}
                />
              )}

              {dashboardTab === 'programmes-admin' && (
                <ProgrammesAdminView
                  programmes={programmes}
                  onRefreshProgrammes={fetchAllData}
                />
              )}

              {dashboardTab === 'messages-helpdesk' && (
                <MessagesHelpdeskAdminView
                  onRefreshData={fetchAllData}
                />
              )}

              {dashboardTab === 'announcements-admin' && (
                <AnnouncementsCMSView
                  announcements={announcements}
                  onRefreshAnnouncements={fetchAllData}
                />
              )}

              {dashboardTab === 'registrations-admin' && (
                <RegistrationsAdminView
                  registrations={registrations}
                  onRefreshRegistrations={fetchAllData}
                />
              )}

              {dashboardTab === 'problem-solving' && (
                <ProblemSolvingView
                  cases={problemCases}
                  onRefreshCases={fetchAllData}
                />
              )}

              {dashboardTab === 'audit-logs' && (
                <AuditLogsView logs={auditLogs} />
              )}

              {dashboardTab === 'member-preview' && (
                <MemberPortalView
                  currentUser={currentUser}
                  onSelectReceipt={(p) => setSelectedReceipt(p)}
                  onUpdateUser={(u) => setCurrentUser(u)}
                  onNavigateTab={(tab) => setDashboardTab(tab)}
                />
              )}
            </>
          )}
        </DashboardLayout>
      ) : viewMode === 'AUTH' ? (
        /* Dedicated Sign In & Sign Up Page strictly for Members and Admin */
        <AuthPage
          initialRole={authInitialRole}
          onBackToHome={() => setViewMode('PUBLIC')}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setViewMode('DASHBOARD');
            setDashboardTab('overview');
          }}
        />
      ) : (
        /* Public Minimal, Modern, Light Homepage */
        <div className="relative bg-white min-h-screen text-slate-800">
          
          {/* 1. Top Clean Navbar */}
          <Navbar
            currentUser={currentUser}
            currentView={viewMode === 'DASHBOARD' ? 'dashboard' : 'public-home'}
            onNavigate={(v) => {
              if (v === 'dashboard') {
                if (currentUser) {
                  setViewMode('DASHBOARD');
                } else {
                  handleOpenAuth('MEMBER');
                }
              } else if (v === 'madrasa') {
                if (currentUser) {
                  setViewMode('DASHBOARD');
                  setDashboardTab('madrasa');
                } else {
                  handleOpenAuth('MEMBER');
                }
              } else {
                setViewMode('PUBLIC');
                const el = document.getElementById(`${v}-section`);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            onOpenAuth={() => handleOpenAuth('MEMBER')}
            onLogout={handleLogout}
            onOpenSearch={() => setShowSearchModal(true)}
            onOpenEmergency={() => setShowEmergencyModal(true)}
            onOpenAI={() => setShowAiModal(true)}
            onOpenVerifyCert={() => setShowCertModal(true)}
          />

          {/* 2. White-Background Hero with Floating Digital Mahallu Ecosystem */}
          <HeroSection
            onExplore={() => {
              const el = document.getElementById('today-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenAuth={() => handleOpenAuth('MEMBER')}
            todayProgrammes={programmes}
          />

          {/* 3. Live Community Stats Boxes (142 Families, 586 Members, 180 Students, 24/7 Community Care) */}
          <CommunityStrip
            stats={stats}
            onExploreFamilies={() => {
              if (currentUser) {
                setViewMode('DASHBOARD');
                setDashboardTab('families');
              } else {
                handleOpenAuth('MEMBER');
              }
            }}
            onExploreStudents={() => {
              if (currentUser) {
                setViewMode('DASHBOARD');
                setDashboardTab('madrasa');
              } else {
                handleOpenAuth('MEMBER');
              }
            }}
            onOpenEmergency={() => setShowEmergencyModal(true)}
          />

          {/* 4. Today at Manoor Mahall (Clean Signature Section) */}
          <TodayAtMahall
            programmes={programmes}
            announcements={announcements}
            onViewProgramme={(p) => {
              const el = document.getElementById('programmes-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onViewNotice={(a) => {
              setShowSearchModal(true);
            }}
          />

          {/* 5. 4 Minimal Feature Cards */}
          <FeatureCards
            onSelectFeature={(featureId) => {
              if (featureId === 'families') {
                if (currentUser) {
                  setViewMode('DASHBOARD');
                  setDashboardTab('families');
                } else {
                  setShowAuthModal(true);
                }
              } else if (featureId === 'madrasa') {
                setTrackerInitialType('MADRASA_ADMISSION');
                setShowTrackerModal(true);
              } else if (featureId === 'services') {
                const el = document.getElementById('services-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              } else if (featureId === 'programmes') {
                const el = document.getElementById('programmes-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          />

          {/* 6. Today's Prayer Times (Compact Supporting Strip) */}
          <CompactPrayerTimes />

          {/* 7. Community Services (Compact 6-Card Grid) */}
          <ServicesSection
            services={services}
            onOpenEmergency={() => setShowEmergencyModal(true)}
          />

          {/* 8. Programmes (Modern Horizontal Layout) */}
          <ProgrammesSection
            programmes={programmes}
            onProgrammeUpdated={fetchAllData}
            isAdmin={currentUser ? currentUser.role !== 'MEMBER' : false}
            onOpenAddEvent={currentUser && currentUser.role !== 'MEMBER' ? () => {
              setViewMode('DASHBOARD');
              setDashboardTab('programmes-admin');
            } : undefined}
          />

          {/* 9. Digital Mahall Visual ("Your Mahallu, in your pocket.") */}
          <DigitalMahallShowcase
            onOpenPortal={() => {
              if (currentUser) {
                setViewMode('DASHBOARD');
              } else {
                setShowAuthModal(true);
              }
            }}
          />

          {/* 9b. About Mahallu & Committee Members & Location Map */}
          <AboutSection />

          {/* 10. Final Call to Action */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
            <div className="max-w-5xl mx-auto rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-blue-50/70 via-sky-50/60 to-blue-50/70 border border-blue-100 text-center space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-white px-3 py-1 rounded-full shadow-2xs border border-blue-100">
                JOIN THE COMMUNITY
              </span>
              <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Ready to connect with your Mahallu?
              </h3>
              <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
                Access verified family records, student progress, fee receipts, and community welfare services in one unified platform.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => handleOpenAuth('MEMBER')}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wide shadow-md shadow-blue-500/20 active:scale-95 transition-all"
                >
                  Portal Login
                </button>
                <button
                  onClick={() => setShowCertModal(true)}
                  className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-xs tracking-wide shadow-2xs active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <FileCheck className="w-4 h-4 text-blue-600" />
                  <span>Verify Certificate</span>
                </button>
              </div>
            </div>
          </section>

          {/* 11. Minimal 4-Column Footer */}
          <Footer
            onOpenAuth={() => handleOpenAuth('MEMBER')}
            onOpenAdmin={() => handleOpenAuth('ADMIN')}
            onOpenVerifyCert={() => setShowCertModal(true)}
            onOpenEmergency={() => setShowEmergencyModal(true)}
            onNavigate={(v) => {
              if (v === 'madrasa') {
                if (currentUser) {
                  setViewMode('DASHBOARD');
                  setDashboardTab('madrasa');
                } else {
                  handleOpenAuth('MEMBER');
                }
              }
            }}
          />

        </div>
      )}

      {/* Floating Action Cluster: Need Help? & Manoor AI */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5">
        {/* One-Tap Help Button */}
        <button
          id="btn-floating-help"
          onClick={() => setShowEmergencyModal(true)}
          className="px-3.5 py-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-lg shadow-slate-900/10 border border-slate-200 flex items-center gap-1.5 active:scale-95 transition-all"
        >
          <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
          <span>Need Help?</span>
        </button>

        {/* Manoor AI Button */}
        <button
          id="manoor-ai-fab"
          onClick={() => setShowAiModal(true)}
          className="w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 active:scale-95 transition-all group relative"
          title="Open Manoor AI Assistant"
        >
          <Sparkles className="w-5 h-5 text-blue-100 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white animate-pulse"></span>
        </button>
      </div>

      {/* Global Interactive Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setViewMode('DASHBOARD');
          setDashboardTab('overview');
        }}
      />

      <RegistrationTrackerModal
        isOpen={showTrackerModal}
        onClose={() => setShowTrackerModal(false)}
        initialType={trackerInitialType}
      />

      <ZakatCalculatorModal
        isOpen={showZakatModal}
        onClose={() => setShowZakatModal(false)}
      />

      <CertificateVerificationModal
        isOpen={showCertModal}
        onClose={() => setShowCertModal(false)}
      />

      <EmergencyHelpModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
      />

      <ManoorAIChatModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        currentUser={currentUser}
      />

      <ReceiptModal
        payment={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />

      <GlobalSearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSelectFamily={(famId) => {
          setViewMode('DASHBOARD');
          setDashboardTab('families');
        }}
        onSelectReceipt={(pay) => {
          setSelectedReceipt(pay);
        }}
        onSelectRegistration={(reg) => {
          setShowTrackerModal(true);
        }}
      />

    </div>
  );
}
