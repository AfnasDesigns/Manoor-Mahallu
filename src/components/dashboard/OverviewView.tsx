import React from 'react';
import {
  Users,
  Home,
  GraduationCap,
  CreditCard,
  AlertCircle,
  Calendar,
  PlusCircle,
  FileCheck,
  TrendingUp,
  ArrowUpRight,
  Clock,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { DashboardStats, User, Programme, Payment } from '../../types/index.ts';

interface OverviewViewProps {
  stats: DashboardStats;
  currentUser: User;
  onNavigateTab: (tab: string) => void;
  onOpenRecordPayment: () => void;
  onOpenAddFamily: () => void;
  onOpenCreateNotice: () => void;
  onSelectReceipt: (p: Payment) => void;
  recentPayments: Payment[];
  upcomingProgrammes: Programme[];
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  stats,
  currentUser,
  onNavigateTab,
  onOpenRecordPayment,
  onOpenAddFamily,
  onOpenCreateNotice,
  onSelectReceipt,
  recentPayments,
  upcomingProgrammes,
}) => {
  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
            Administrative Command Center
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Welcome back, {currentUser.fullName}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 font-normal">
            Real-time status overview of Manoor Mahall Digital Operating System.
          </p>
        </div>

        {/* Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenRecordPayment}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-blue-500/20 active:scale-95 transition-all"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Record Payment</span>
          </button>
          
          <button
            onClick={onOpenAddFamily}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Add Family</span>
          </button>

          <button
            onClick={() => onOpenCreateNotice()}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Notice Draft</span>
          </button>

          <button
            onClick={() => onNavigateTab('member-preview')}
            className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Member Profile View</span>
          </button>
        </div>
      </div>

      {/* 6 Key Executive Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* Total Families */}
        <div
          onClick={() => onNavigateTab('families')}
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Families</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Home className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="font-mono text-2xl font-black text-slate-900">
            {stats.totalFamilies}
          </div>
          <div className="text-[10px] text-blue-600 font-semibold mt-1">
            Across 4 Wards
          </div>
        </div>

        {/* Total Members */}
        <div
          onClick={() => onNavigateTab('members')}
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Members</span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="font-mono text-2xl font-black text-slate-900">
            {stats.totalMembers}
          </div>
          <div className="text-[10px] text-sky-600 font-semibold mt-1">
            Registered Census
          </div>
        </div>

        {/* Madrasa Students */}
        <div
          onClick={() => onNavigateTab('madrasa')}
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Madrasa</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="font-mono text-2xl font-black text-slate-900">
            {stats.totalStudents}
          </div>
          <div className="text-[10px] text-amber-600 font-semibold mt-1">
            Class 1 to 10
          </div>
        </div>

        {/* Monthly Income */}
        <div
          onClick={() => onNavigateTab('finance')}
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Monthly Inflow</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="font-mono text-2xl font-black text-emerald-600">
            ₹{(stats.monthlyIncome / 1000).toFixed(0)}k
          </div>
          <div className="text-[10px] text-slate-500 font-semibold mt-1">
            ₹{stats.monthlyIncome.toLocaleString('en-IN')}
          </div>
        </div>

        {/* Pending Payments */}
        <div
          onClick={() => onNavigateTab('finance')}
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-red-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Pending Dues</span>
            <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="font-mono text-2xl font-black text-red-600">
            ₹{(stats.pendingPayments / 1000).toFixed(0)}k
          </div>
          <div className="text-[10px] text-red-600 font-semibold mt-1">
            Collection Pending
          </div>
        </div>

        {/* Upcoming Programmes */}
        <div
          onClick={() => onNavigateTab('programmes-admin')}
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Programmes</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="font-mono text-2xl font-black text-slate-900">
            {stats.upcomingProgrammesCount}
          </div>
          <div className="text-[10px] text-indigo-600 font-semibold mt-1">
            Scheduled Events
          </div>
        </div>

      </div>

      {/* Main Grid: Treasury Trend & Recent Receipts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Treasury Performance & Monthly Breakdown (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-bold text-slate-900">
                Treasury Cash Flow & Collections
              </h3>
              <p className="text-xs text-slate-500 font-normal">
                Monthly subscription and donation collections vs operating expenses
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('finance')}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>Ledger Details</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Visual bar comparisons for past 6 months */}
          <div className="space-y-3 pt-2">
            {[
              { month: 'Mar 2026', income: 425000, expense: 193500, target: 450000 },
              { month: 'Feb 2026', income: 415000, expense: 215000, target: 450000 },
              { month: 'Jan 2026', income: 430000, expense: 220000, target: 450000 },
              { month: 'Dec 2025', income: 395000, expense: 205000, target: 450000 },
            ].map((bar, idx) => {
              const incomePct = Math.min(100, Math.round((bar.income / 500000) * 100));
              const expensePct = Math.min(100, Math.round((bar.expense / 500000) * 100));
              return (
                <div key={idx} className="space-y-1.5 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-900 font-bold">{bar.month}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-blue-700 font-mono">In: ₹{bar.income.toLocaleString('en-IN')}</span>
                      <span className="text-slate-500 font-mono">Out: ₹{bar.expense.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  
                  {/* Visual stacked progress bar */}
                  <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden flex gap-0.5">
                    <div
                      style={{ width: `${incomePct}%` }}
                      className="h-full bg-blue-600 rounded-l-full"
                      title={`Income: ₹${bar.income}`}
                    ></div>
                    <div
                      style={{ width: `${expensePct}%` }}
                      className="h-full bg-slate-400 rounded-r-full"
                      title={`Expense: ₹${bar.expense}`}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-blue-600"></span>
                <span>Income Collections</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-slate-400"></span>
                <span>Operating Expenses</span>
              </span>
            </div>
            <span className="font-bold text-blue-700">Net Reserve: +₹2,31,500</span>
          </div>
        </div>

        {/* Recent Payment Receipts Feed (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-base font-bold text-slate-900">
                Recent Treasury Receipts
              </h3>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                LIVE
              </span>
            </div>

            <div className="space-y-2">
              {recentPayments.slice(0, 4).map((pay) => (
                <div
                  key={pay.id}
                  onClick={() => onSelectReceipt(pay)}
                  className="p-3 rounded-xl bg-slate-50/70 hover:bg-blue-50/60 border border-slate-100 hover:border-blue-200 transition-colors cursor-pointer flex items-center justify-between group"
                >
                  <div>
                    <div className="font-bold text-xs text-slate-900 group-hover:text-blue-900">
                      {pay.memberName}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {pay.houseName} • {pay.category}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-xs font-bold text-blue-700">
                      ₹{pay.amount.toLocaleString('en-IN')}
                    </div>
                    <div className="font-mono text-[9px] text-slate-400">
                      {pay.receiptNumber}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('finance')}
            className="w-full py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
          >
            View Complete Treasury Ledger
          </button>
        </div>

      </div>

    </div>
  );
};
