import React from 'react';
import {
  Smartphone,
  QrCode,
  CreditCard,
  Users,
  GraduationCap,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Bell
} from 'lucide-react';

interface DigitalMahallShowcaseProps {
  onOpenPortal: () => void;
}

export const DigitalMahallShowcase: React.FC<DigitalMahallShowcaseProps> = ({
  onOpenPortal,
}) => {
  return (
    <section className="py-20 bg-slate-50/60 border-b border-slate-100 overflow-hidden relative">
      {/* Background soft ambient vector glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            MOBILE-READY PLATFORM
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Your Mahallu, <br className="hidden sm:block" />
            <span className="text-blue-600">in your pocket.</span>
          </h2>
          <p className="text-sm text-slate-600 mt-2 font-normal">
            Instant digital ID cards, fee receipts, student progress, and community services right on your phone.
          </p>
        </div>

        {/* Floating Mobile/App UI Composition */}
        <div className="relative max-w-4xl mx-auto flex items-center justify-center min-h-[460px] sm:min-h-[520px]">
          
          {/* Subtle Decorative Rings behind composition */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[500px] h-[500px] rounded-full border border-blue-100"></div>
            <div className="w-[680px] h-[680px] rounded-full border border-dashed border-slate-200"></div>
          </div>

          {/* Central Phone Mockup Surface */}
          <div className="relative z-20 w-72 sm:w-80 rounded-[38px] p-3.5 bg-slate-900 shadow-2xl shadow-slate-900/20 border-4 border-slate-800">
            {/* Screen Content */}
            <div className="rounded-[30px] bg-white overflow-hidden p-4 space-y-3.5 text-xs">
              
              {/* Status Bar */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                <span>09:41</span>
                <div className="w-12 h-3.5 rounded-full bg-slate-100 mx-auto"></div>
                <span>5G 100%</span>
              </div>

              {/* In-app Header */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Good morning</div>
                  <div className="text-sm font-bold text-slate-900">Basheer Haji</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  B
                </div>
              </div>

              {/* Digital ID Card Mini */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md shadow-blue-500/20 space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold tracking-wider">MANOOR MAHALL ID</span>
                  <span className="font-mono bg-blue-800/60 px-1.5 py-0.5 rounded">FAM-0142</span>
                </div>
                <div>
                  <div className="text-xs font-bold">K. Basheer & Family</div>
                  <div className="text-[10px] text-blue-100">Ward 04 • House #104</div>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-blue-500/50 text-[9px]">
                  <span>Member Status: Active</span>
                  <QrCode className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* In-app Quick Actions */}
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-semibold">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <CreditCard className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                  <span>Pay</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <GraduationCap className="w-4 h-4 text-sky-600 mx-auto mb-1" />
                  <span>Madrasa</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <Calendar className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                  <span>Events</span>
                </div>
              </div>

              {/* Next Programme Snippet */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-[11px]">
                <div>
                  <div className="font-bold text-slate-900">Tafseer Dars</div>
                  <div className="text-[10px] text-slate-500">7:15 PM • Juma Masjid</div>
                </div>
                <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  TODAY
                </span>
              </div>

            </div>
          </div>

          {/* LEFT FLOATING GLASS CARD: Family & Payments */}
          <div className="hidden md:block absolute -left-6 lg:left-4 top-16 z-30 w-64 p-4 rounded-3xl bg-white/85 backdrop-blur-2xl border border-white/90 shadow-xl shadow-slate-900/5 hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Instant Receipts</div>
                <div className="text-[10px] text-slate-500">All monthly dues cleared</div>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-mono flex items-center justify-between">
              <span className="text-slate-500">Receipt #0391</span>
              <span className="font-bold text-emerald-700">₹1,200 Paid</span>
            </div>
          </div>

          {/* RIGHT FLOATING GLASS CARD: Madrasa Result & Attendance */}
          <div className="hidden md:block absolute -right-6 lg:right-4 bottom-16 z-30 w-64 p-4 rounded-3xl bg-white/85 backdrop-blur-2xl border border-white/90 shadow-xl shadow-slate-900/5 hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Darul Uloom App</div>
                <div className="text-[10px] text-slate-500">Class 5 • Annual Assessment</div>
              </div>
            </div>
            <div className="p-2 rounded-xl bg-blue-50/60 border border-blue-100 text-[11px] text-blue-700 font-semibold text-center">
              Term Exam Marks Available
            </div>
          </div>

        </div>

        {/* CTA Bar */}
        <div className="mt-12 text-center">
          <button
            onClick={onOpenPortal}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 active:scale-95 transition-all inline-flex items-center gap-2"
          >
            <span>Access Member Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
