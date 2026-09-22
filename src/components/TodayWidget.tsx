import React, { useState, useEffect } from 'react';
import {
  Clock,
  MapPin,
  Calendar,
  Sparkles,
  PhoneCall,
  CreditCard,
  GraduationCap,
  HeartHandshake,
  Search,
  Bell,
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Programme, Announcement } from '../types/index.ts';
import { getManoorPrayerTimes, PrayerTimeItem } from '../lib/prayer-times.ts';

interface TodayWidgetProps {
  todayProgrammes: Programme[];
  announcements: Announcement[];
  onOpenPay: () => void;
  onOpenEmergency: () => void;
  onOpenRegister: (type: string) => void;
  onOpenTrack: () => void;
  onOpenZakat: () => void;
  onOpenAI: () => void;
}

export const TodayWidget: React.FC<TodayWidgetProps> = ({
  todayProgrammes,
  announcements,
  onOpenPay,
  onOpenEmergency,
  onOpenRegister,
  onOpenTrack,
  onOpenZakat,
  onOpenAI,
}) => {
  const [prayerData, setPrayerData] = useState(getManoorPrayerTimes());
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setPrayerData(getManoorPrayerTimes());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const pinnedNotice = announcements.find(a => a.isPinned) || announcements[0];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-white py-12 md:py-16 px-4 sm:px-6 lg:px-8 border-b border-emerald-800/60 shadow-xl">
      {/* Subtle geometric backdrop pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        
        {/* Top Header: Badge, Date, Live Prayer Countdown */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-emerald-800/80">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-800/80 text-emerald-200 border border-emerald-700/60 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Today at Manoor Mahall
              </span>
              <span className="text-xs font-medium text-emerald-300/80">
                {prayerData.hijriDate}
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
              One Mahallu. <span className="text-emerald-300 font-serif italic">One Digital System.</span>
            </h1>
            <p className="mt-2 text-sm sm:text-base text-emerald-100/90 max-w-2xl leading-relaxed">
              Official centralized operating system connecting 142 families, Madrasa Darul Uloom, community care, and treasury services.
            </p>
          </div>

          {/* Real-time Clock & Next Prayer Chip */}
          <div className="flex items-center gap-3 bg-emerald-900/90 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-emerald-700/60 shadow-lg">
            <Clock className="w-5 h-5 text-emerald-300 animate-spin-slow" />
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
                Next Prayer: <span className="text-white font-bold">{prayerData.nextPrayer.name}</span> in ~{Math.max(1, prayerData.nextPrayer.remainingMinutes)}m
              </div>
              <div className="font-mono text-xl font-bold tracking-tight text-white">
                {timeString || 'Live Clock'}
              </div>
            </div>
          </div>
        </div>

        {/* Prayer Times Grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              Prayer Schedule (Manoor Juma Masjid)
            </span>
            <span className="text-[11px] text-emerald-300/80">
              Jama'at timings verified daily
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {prayerData.prayers.map((p) => {
              const isCurrent = p.isActive;
              const isNext = p.isNext;
              return (
                <div
                  key={p.name}
                  className={`p-3.5 rounded-2xl transition-all border ${
                    isNext
                      ? 'bg-emerald-400/20 border-emerald-300 text-white shadow-md shadow-emerald-950/40 ring-2 ring-emerald-300/40'
                      : isCurrent
                      ? 'bg-emerald-800/90 border-emerald-600 text-white'
                      : 'bg-emerald-950/60 border-emerald-800/70 text-emerald-100 hover:bg-emerald-900/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold tracking-wide text-emerald-200">
                      {p.name}
                    </span>
                    <span className="text-xs font-serif text-emerald-300">
                      {p.arabic}
                    </span>
                  </div>
                  <div className="font-mono text-base font-extrabold tracking-tight text-white">
                    {p.time}
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-emerald-300/80">
                    <span>{p.malayalam}</span>
                    {isNext && <span className="font-bold text-emerald-300">UPCOMING</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Today Events & Important Announcement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Today's Active Schedule (7 cols) */}
          <div className="lg:col-span-7 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-200">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Live Event Today
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  CONFIRMED
                </span>
              </div>

              {todayProgrammes.length > 0 ? (
                todayProgrammes.slice(0, 1).map((prog) => (
                  <div key={prog.id} className="space-y-2">
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-white leading-snug">
                      {prog.englishTitle}
                    </h3>
                    <p className="font-malayalam text-emerald-200 text-sm">
                      {prog.malayalamTitle}
                    </p>
                    <p className="text-xs text-emerald-100/90 leading-relaxed pt-1">
                      {prog.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-3 text-xs text-emerald-200">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-4 h-4 text-emerald-400" />
                        <span>{prog.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium">
                        <MapPin className="w-4 h-4 text-emerald-400" />
                        <span>{prog.venue}</span>
                      </div>
                      {prog.speaker && (
                        <div className="flex items-center gap-1.5 font-medium">
                          <span>Lead: {prog.speaker}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-sm text-emerald-200">
                  Daily congregational prayers and routine Madrasa sessions are active today at Manoor Juma Masjid.
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-emerald-200">
                Organizer: Manoor Mahall Da'wah Wing
              </span>
              <button
                onClick={onOpenAI}
                className="text-xs font-semibold text-emerald-300 hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>Ask Manoor AI about this event</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Official Pinned Notice / Marquee (5 cols) */}
          <div className="lg:col-span-5 bg-emerald-950/70 backdrop-blur-md rounded-2xl p-5 border border-emerald-800/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <Bell className="w-4 h-4 text-amber-400" />
                <span>Executive Mahallu Notice</span>
              </div>

              {pinnedNotice && (
                <div className="space-y-2">
                  <h4 className="font-display text-base font-bold text-white">
                    {pinnedNotice.englishTitle}
                  </h4>
                  <p className="font-malayalam text-xs text-emerald-200 leading-relaxed line-clamp-3">
                    {pinnedNotice.content}
                  </p>
                  <div className="text-[11px] text-emerald-300/80 pt-1">
                    Issued by: {pinnedNotice.author} | Date: {pinnedNotice.date}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-emerald-800/80 flex items-center justify-between mt-3">
              <span className="text-[11px] text-emerald-300">
                Official Notice Board
              </span>
              <button
                onClick={onOpenTrack}
                className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-xs font-semibold text-white transition-colors"
              >
                Track Applications
              </button>
            </div>
          </div>

        </div>

        {/* 6 Essential Action Buttons: Clean glassmorphism cards */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-200 mb-3">
            Quick Actions & Member Workflows
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            
            {/* Pay Due */}
            <button
              id="btn-quick-pay"
              onClick={onOpenPay}
              className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-left transition-all group hover:-translate-y-0.5 shadow-sm"
            >
              <CreditCard className="w-5 h-5 text-emerald-300 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">Pay Mahallu Due</div>
              <div className="text-[10px] text-emerald-200/80 mt-0.5">UPI, Cards, Cash</div>
            </button>

            {/* 24/7 Ambulance */}
            <button
              id="btn-quick-ambulance"
              onClick={onOpenEmergency}
              className="p-4 rounded-2xl bg-red-900/30 hover:bg-red-900/50 border border-red-500/40 text-left transition-all group hover:-translate-y-0.5 shadow-sm"
            >
              <PhoneCall className="w-5 h-5 text-red-400 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-red-100">Ambulance 24/7</div>
              <div className="text-[10px] text-red-200/80 mt-0.5">Emergency SOS Helpline</div>
            </button>

            {/* Marriage Registration */}
            <button
              id="btn-quick-marriage-reg"
              onClick={() => onOpenRegister('Marriage')}
              className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-left transition-all group hover:-translate-y-0.5 shadow-sm"
            >
              <HeartHandshake className="w-5 h-5 text-pink-300 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">Marriage / Nikah</div>
              <div className="text-[10px] text-emerald-200/80 mt-0.5">Application & NOC</div>
            </button>

            {/* Madrasa Admission */}
            <button
              id="btn-quick-madrasa-admission"
              onClick={() => onOpenRegister('Madrasa Admission')}
              className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-left transition-all group hover:-translate-y-0.5 shadow-sm"
            >
              <GraduationCap className="w-5 h-5 text-amber-300 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">Madrasa Enrolment</div>
              <div className="text-[10px] text-emerald-200/80 mt-0.5">Class 1 to 10</div>
            </button>

            {/* Zakat Calculator */}
            <button
              id="btn-quick-zakat"
              onClick={onOpenZakat}
              className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-left transition-all group hover:-translate-y-0.5 shadow-sm"
            >
              <ShieldCheck className="w-5 h-5 text-teal-300 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">Zakat Calculator</div>
              <div className="text-[10px] text-emerald-200/80 mt-0.5">2026 Kerala Nisab</div>
            </button>

            {/* Track Application */}
            <button
              id="btn-quick-track"
              onClick={onOpenTrack}
              className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-left transition-all group hover:-translate-y-0.5 shadow-sm"
            >
              <Search className="w-5 h-5 text-blue-300 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">Track Application</div>
              <div className="text-[10px] text-emerald-200/80 mt-0.5">Live status & receipt</div>
            </button>

          </div>
        </div>

      </div>
    </section>
  );
};
