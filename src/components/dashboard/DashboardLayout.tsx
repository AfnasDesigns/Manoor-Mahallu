import React from 'react';
import {
  LayoutDashboard,
  Home,
  Users,
  GraduationCap,
  CreditCard,
  Calendar,
  MessageSquareQuote,
  Bell,
  FileCheck,
  HeartHandshake,
  ShieldAlert,
  History,
  LogOut,
  ChevronRight,
  ShieldCheck,
  ArrowLeft,
  Coins,
  Scale
} from 'lucide-react';
import { User } from '../../types/index.ts';

interface DashboardLayoutProps {
  currentUser: User;
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onBackToPublic: () => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentUser,
  currentTab,
  onSelectTab,
  onBackToPublic,
  onLogout,
  children,
}) => {
  const isMember = currentUser.role === 'MEMBER';

  // Navigation Items tailored by role
  const adminNav = [
    { id: 'overview', label: 'Command Center', icon: LayoutDashboard },
    { id: 'families', label: 'Families Census (142)', icon: Home },
    { id: 'members', label: 'Members (586)', icon: Users },
    { id: 'madrasa', label: 'Madrasa Darul Uloom', icon: GraduationCap },
    { id: 'finance', label: 'Finance & Treasury', icon: CreditCard },
    { id: 'programmes-admin', label: 'Dates, Programs & Events', icon: Calendar },
    { id: 'messages-helpdesk', label: 'Member Messages & Help', icon: MessageSquareQuote },
    { id: 'announcements-admin', label: 'Notice Board (CMS)', icon: Bell },
    { id: 'registrations-admin', label: 'Applications Hub', icon: FileCheck },
    { id: 'problem-solving', label: 'Confidential Desk', icon: ShieldAlert },
    { id: 'audit-logs', label: 'Audit Trail', icon: History },
  ];

  const memberNav = [
    { id: 'overview', label: 'My Mahallu Profile', icon: Home },
  ];

  const navItems = isMember ? memberNav : adminNav;

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col md:flex-row font-sans">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 lg:w-72 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0">
        <div>
          
          {/* Logo & Return Link */}
          <div className="p-5 border-b border-slate-100 space-y-3">
            <button
              onClick={onBackToPublic}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Website</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-display text-lg font-extrabold shadow-sm shadow-blue-500/20">
                M
              </div>
              <div>
                <div className="font-display font-bold text-sm text-slate-900 tracking-tight">
                  MANOOR MAHALL
                </div>
                <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                  {currentUser.role} PORTAL
                </div>
              </div>
            </div>
          </div>

          {/* User Badge */}
          <div className="p-4 mx-3 my-3 rounded-2xl bg-blue-50/60 border border-blue-100/80 flex items-center justify-between">
            <div>
              <div className="font-bold text-xs text-slate-900 truncate max-w-[170px]">
                {currentUser.fullName}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                {currentUser.username} {currentUser.familyId ? `• ${currentUser.familyId}` : ''}
              </div>
            </div>
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`side-nav-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20 font-bold'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-200" />}
                </button>
              );
            })}
          </nav>

        </div>

        {/* Footer Sign Out */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 text-xs font-bold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Session</span>
          </button>
        </div>

      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 overflow-y-auto min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
};
