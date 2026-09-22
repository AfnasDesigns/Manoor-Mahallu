import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  FileCheck,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  ArrowRight,
  ShieldCheck,
  PhoneCall
} from 'lucide-react';
import { User } from '../types/index.ts';

interface NavbarProps {
  currentUser: User | null;
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenSearch: () => void;
  onOpenEmergency: () => void;
  onOpenAI: () => void;
  onOpenVerifyCert: () => void;
  onOpenTrack?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentView,
  onNavigate,
  onOpenAuth,
  onLogout,
  onOpenSearch,
  onOpenEmergency,
  onOpenVerifyCert,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainLinks = [
    { id: 'public-home', label: 'Home' },
    { id: 'zakat', label: 'Zakat Calculator' },
    { id: 'warasath', label: 'Warasath' },
    { id: 'programmes', label: 'Programmes' },
    { id: 'services', label: 'Services' },
    { id: 'about', label: 'About' },
  ];

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          
          {/* LEFT: Minimal Manoor Mahall Logo */}
          <div 
            id="brand-logo"
            onClick={() => handleNavClick('public-home')} 
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-display font-extrabold text-lg shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              M
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-lg tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  MANOOR MAHALL
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                  PORTAL
                </span>
              </div>
              <span className="text-xs text-slate-500 font-normal hidden sm:block">
                One Mahallu. One simple digital system.
              </span>
            </div>
          </div>

          {/* CENTER: Clean destinations (Home, Programmes, Services, About) */}
          <nav className="hidden md:flex items-center gap-1">
            {mainLinks.map((link) => {
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'text-blue-600 font-bold bg-blue-50/70'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* RIGHT: Verify, Search, Sign In, Get Started */}
          <div className="hidden md:flex items-center gap-2">

            <button
              id="btn-verify-nav"
              onClick={onOpenVerifyCert}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-colors flex items-center gap-1"
              title="Verify Official Certificate"
            >
              <FileCheck className="w-3.5 h-3.5 text-blue-500" />
              <span>Verify</span>
            </button>

            {/* Search Icon */}
            <button
              id="btn-search-nav"
              onClick={onOpenSearch}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Search directory (Ctrl+K)"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Logged in vs Logged out */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <button
                  id="btn-nav-portal-dash"
                  onClick={() => onNavigate('dashboard')}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition-all"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>{currentUser.role === 'MEMBER' ? 'My Portal' : 'Admin OS'}</span>
                </button>

                <button
                  id="btn-nav-logout-header"
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-1">
                <button
                  id="btn-nav-signin"
                  onClick={onOpenAuth}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </button>

                <button
                  id="btn-nav-getstarted"
                  onClick={onOpenAuth}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-600/20 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

          </div>

          {/* Mobile Actions: Search, Menu Toggle */}
          <div className="flex md:hidden items-center gap-1">
            <button
              onClick={onOpenSearch}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 space-y-3 shadow-xl animate-fade-in">
          <div className="grid grid-cols-2 gap-2">
            {mainLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-left px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                  currentView === link.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenVerifyCert(); }}
              className="w-full px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 rounded-xl flex items-center justify-center gap-1.5"
            >
              <FileCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Verify Official Certificate</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100">
            {currentUser ? (
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">{currentUser.fullName}</div>
                  <div className="text-[10px] text-slate-500">{currentUser.role}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setMobileMenuOpen(false); onNavigate('dashboard'); }}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white"
                  >
                    Open Portal
                  </button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); onLogout(); }}
                    className="p-1.5 text-slate-400 hover:text-slate-700"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 text-center"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold text-center shadow-sm"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
