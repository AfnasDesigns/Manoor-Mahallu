import React, { useState } from 'react';
import {
  ShieldCheck,
  UserCheck,
  ArrowLeft,
  Lock,
  User,
  Phone,
  Home,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { User as UserType } from '../types/index.ts';
import { api, setStoredSession } from '../lib/api.ts';

interface AuthPageProps {
  onLoginSuccess: (user: UserType) => void;
  onBackToHome: () => void;
  initialRole?: 'MEMBER' | 'ADMIN';
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onLoginSuccess,
  onBackToHome,
  initialRole = 'MEMBER',
}) => {
  // Primary role tab: strictly 'MEMBER' or 'ADMIN'
  const [role, setRole] = useState<'MEMBER' | 'ADMIN'>(initialRole);
  
  // For Member: toggle between 'SIGN_IN' and 'SIGN_UP'
  const [memberMode, setMemberMode] = useState<'SIGN_IN' | 'SIGN_UP'>('SIGN_IN');

  // Member Sign In credentials
  const [memberUsername, setMemberUsername] = useState('');
  const [memberPassword, setMemberPassword] = useState('');

  // Admin Sign In credentials
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Member Sign Up form
  const [regFirstName, setRegFirstName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regHouseName, setRegHouseName] = useState('');
  const [regWard, setRegWard] = useState(1);
  const [regPassword, setRegPassword] = useState('');

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Quick 1-click login handler
  const handleQuickLogin = async (u: string, p: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.login(u, p);
      setStoredSession(res.token, res.user);
      onLoginSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Member Login submit
  const handleMemberLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberUsername.trim() || !memberPassword) {
      setError('Please enter your Member Name/Username and Password.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.login(memberUsername.trim(), memberPassword);
      setStoredSession(res.token, res.user);
      onLoginSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'Invalid member credentials. Please check your username or register a new account.');
    } finally {
      setLoading(false);
    }
  };

  // Admin Login submit
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUsername.trim() || !adminPassword) {
      setError('Please enter Admin username and password.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.login(adminUsername.trim(), adminPassword);
      setStoredSession(res.token, res.user);
      onLoginSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'Admin authentication failed. Tip: Use "afnas" and "123".');
    } finally {
      setLoading(false);
    }
  };

  // Member Registration submit
  const handleMemberRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFirstName.trim()) {
      setError('Please enter your First Name.');
      return;
    }
    if (!regPassword || regPassword.length < 1) {
      setError('Please create a password for your member account.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const name = regFirstName.trim();
      const loginName = name.toLowerCase().replace(/[^a-z0-9]/g, '');

      const res = await api.register({
        fullName: name,
        firstName: name,
        username: loginName,
        password: regPassword,
        phone: regPhone.trim() || '+91 94470 00000',
        houseName: regHouseName.trim() || `${name} Manzil`,
        ward: regWard,
      });

      setStoredSession(res.token, res.user);
      onLoginSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative flex flex-col justify-between overflow-x-hidden font-sans">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-100/50 rounded-full blur-3xl opacity-70"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-100/40 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 opacity-[0.025] bg-[radial-gradient(#1e40af_1px,transparent_1px)] [background-size:28px_28px]"></div>
      </div>

      {/* Top Navbar Header */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 font-semibold text-xs shadow-xs transition-all active:scale-95 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Manoor Mahall Website</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span className="hidden sm:inline">256-Bit Encrypted Portal</span>
        </div>
      </header>

      {/* Central Login & Sign Up Container */}
      <main className="relative z-20 flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 sm:p-8 space-y-6">
          
          {/* Official Emblem & Portal Title */}
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-600/25 mb-3">
              <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              OFFICIAL ACCESS PORTAL
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
              Manoor Digital Mahallu
            </h1>
            <p className="text-xs text-slate-500 font-normal">
              Sign in or register to access services, family records, and community management.
            </p>
          </div>

          {/* MAIN ROLE TOGGLE: Only Members and Admin */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-2xl">
            <button
              type="button"
              id="tab-role-member"
              onClick={() => {
                setRole('MEMBER');
                setError(null);
              }}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                role === 'MEMBER'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Member Portal</span>
            </button>

            <button
              type="button"
              id="tab-role-admin"
              onClick={() => {
                setRole('ADMIN');
                setError(null);
              }}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                role === 'ADMIN'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Access</span>
            </button>
          </div>

          {/* Error Message Display */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {/* ======================= MEMBER PORTAL ======================= */}
          {role === 'MEMBER' && (
            <div className="space-y-5">
              
              {/* Member Sub-Mode Switcher: Sign In vs Sign Up */}
              <div className="flex border-b border-slate-200">
                <button
                  type="button"
                  id="tab-member-signin"
                  onClick={() => {
                    setMemberMode('SIGN_IN');
                    setError(null);
                  }}
                  className={`flex-1 pb-2.5 text-xs font-bold border-b-2 transition-all ${
                    memberMode === 'SIGN_IN'
                      ? 'border-blue-600 text-blue-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Member Sign In
                </button>
                <button
                  type="button"
                  id="tab-member-signup"
                  onClick={() => {
                    setMemberMode('SIGN_UP');
                    setError(null);
                  }}
                  className={`flex-1 pb-2.5 text-xs font-bold border-b-2 transition-all ${
                    memberMode === 'SIGN_UP'
                      ? 'border-blue-600 text-blue-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  New Member Sign Up
                </button>
              </div>

              {/* MEMBER SIGN IN */}
              {memberMode === 'SIGN_IN' && (
                <form onSubmit={handleMemberLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      First Name or Username
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        id="input-member-username"
                        type="text"
                        required
                        value={memberUsername}
                        onChange={(e) => setMemberUsername(e.target.value)}
                        placeholder="e.g. Afnas, Rashid, or member"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-700">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{showPassword ? 'Hide' : 'Show'}</span>
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        id="input-member-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={memberPassword}
                        onChange={(e) => setMemberPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    id="btn-member-submit-login"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs shadow-md shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span>Verifying Credentials...</span>
                    ) : (
                      <>
                        <span>Sign In to Member Portal</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setMemberMode('SIGN_UP')}
                      className="text-xs font-medium text-slate-600 hover:text-blue-600 transition-colors"
                    >
                      Not registered yet? <strong className="text-blue-600 font-bold underline">Sign up here</strong>
                    </button>
                  </div>
                </form>
              )}

              {/* MEMBER SIGN UP */}
              {memberMode === 'SIGN_UP' && (
                <form onSubmit={handleMemberRegister} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      First Name <span className="text-blue-600">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        id="input-reg-firstname"
                        type="text"
                        required
                        value={regFirstName}
                        onChange={(e) => setRegFirstName(e.target.value)}
                        placeholder="e.g. Afnas"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        id="input-reg-phone"
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="+91 94470 12345"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        House / Address
                      </label>
                      <input
                        id="input-reg-house"
                        type="text"
                        value={regHouseName}
                        onChange={(e) => setRegHouseName(e.target.value)}
                        placeholder="House Name"
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Ward
                      </label>
                      <select
                        id="select-reg-ward"
                        value={regWard}
                        onChange={(e) => setRegWard(Number(e.target.value))}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 transition-all"
                      >
                        <option value={1}>Ward 1 - North</option>
                        <option value={2}>Ward 2 - South</option>
                        <option value={3}>Ward 3 - East</option>
                        <option value={4}>Ward 4 - West</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Create Password <span className="text-blue-600">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        id="input-reg-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Create a strong password"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    id="btn-member-submit-register"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs shadow-md shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    {loading ? (
                      <span>Creating Account...</span>
                    ) : (
                      <>
                        <span>Complete Sign Up & Sign In</span>
                        <CheckCircle2 className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => setMemberMode('SIGN_IN')}
                      className="text-xs font-medium text-slate-600 hover:text-blue-600 transition-colors"
                    >
                      Already have an account? <strong className="text-blue-600 font-bold underline">Sign in here</strong>
                    </button>
                  </div>
                </form>
              )}

            </div>
          )}

          {/* ======================= ADMIN ACCESS ======================= */}
          {role === 'ADMIN' && (
            <div className="space-y-5">
              
              {/* One-Tap Admin Quick Login Card (afnas / 1234) */}
              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Admin Command Credentials</span>
                  </div>
                  <div className="text-xs text-blue-700 font-medium mt-0.5">
                    Username: <strong>afnas</strong> • Passkey: <strong>1234</strong> (4-digit)
                  </div>
                </div>
                <button
                  type="button"
                  id="btn-quick-admin-fill"
                  onClick={() => handleQuickLogin('afnas', '1234')}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  Quick Sign In
                </button>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Admin Username
                  </label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="input-admin-username"
                      type="text"
                      required
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      placeholder="e.g. afnas"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Admin Master Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showPassword ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="input-admin-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Enter 4-digit passkey (1234)"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  id="btn-admin-submit-login"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs shadow-md shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span>Verifying Admin Access...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Access Admin Command Center</span>
                    </>
                  )}
                </button>
              </form>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 space-y-1">
                <div className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Admin Privileges</span>
                </div>
                <div>Full authority over Census, Madrasa, Finance, Circulars, and Approvals.</div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Footer info */}
      <footer className="relative z-20 text-center py-4 text-xs text-slate-400 font-medium">
        Kerala WAKF Board Reg. #104/2012 • Manoor Mahall Digital Operating System
      </footer>

    </div>
  );
};
