import React from 'react';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Calendar,
  Users,
  CreditCard,
  GraduationCap,
  Clock,
  QrCode,
  Wifi,
  ChevronRight
} from 'lucide-react';
import { Programme } from '../types/index.ts';

interface HeroSectionProps {
  onExplore: () => void;
  onOpenAuth: () => void;
  todayProgrammes: Programme[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExplore,
  onOpenAuth,
  todayProgrammes,
}) => {
  const highlightProgramme = todayProgrammes[0] || {
    title: 'Daily Dars & Holy Quran Tafseer',
    time: '07:15 PM',
    venue: 'Manoor Juma Masjid',
  };

  return (
    <section className="relative overflow-hidden bg-white pt-10 pb-16 md:pt-16 md:pb-24">
      {/* Subtle modern background grid & gradient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-100/50 rounded-full blur-3xl opacity-70"></div>
        <div className="absolute top-1/3 -right-24 w-80 h-80 bg-sky-100/40 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 opacity-[0.025] bg-[radial-gradient(#1e40af_1px,transparent_1px)] [background-size:28px_28px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: Headline & Quick Actions */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Pill Label */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span>DIGITAL MAHALL PLATFORM</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              One Mahallu. <br />
              <span className="text-blue-600">One simple digital system.</span>
            </h1>

            {/* Short Supporting Copy */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl font-normal">
              Connect families, programmes, Madrasa, services and community life in one unified, modern platform.
            </p>

            {/* Call to Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="btn-hero-explore"
                onClick={onExplore}
                className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm tracking-wide shadow-md shadow-blue-600/20 active:scale-95 transition-all flex items-center gap-2"
              >
                <span>Explore Mahall</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="btn-hero-login"
                onClick={onOpenAuth}
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-semibold text-sm tracking-wide shadow-xs active:scale-95 transition-all flex items-center gap-2"
              >
                <span>Portal Login</span>
              </button>
            </div>

            {/* Minimal Trust Indicator with normal text */}
            <div className="flex flex-wrap items-center gap-4 pt-4 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5 text-slate-700">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Encrypted & Verified</span>
              </div>
              <span className="text-slate-300">•</span>
              <div>142 Registered Families</div>
              <span className="text-slate-300">•</span>
              <div>Kerala WAKF Board Reg. #104/2012</div>
            </div>

          </div>

          {/* RIGHT COLUMN: Animated Islamic Vector in Better Position */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[460px] sm:min-h-[520px]">
            
            {/* Luminous radial glow behind Islamic vector */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-blue-200/50 via-sky-100/40 to-amber-100/30 blur-3xl animate-pulse-glow"></div>
            </div>

            {/* Central Animated Islamic Vector (Architectural Dome, Crescent, & Geometric Arabesque Mandala) */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-[420px] animate-float-slow">
              
              {/* Rotating Outer Islamic Arabesque Mandala Ring */}
              <div className="relative w-72 h-72 sm:w-88 sm:h-88 flex items-center justify-center">
                
                {/* Outermost rotating Islamic 8-point geometric star ring */}
                <svg
                  className="absolute inset-0 w-full h-full text-blue-500/25 animate-spin-slow pointer-events-none"
                  viewBox="0 0 200 200"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                >
                  {/* Concentric 8-point Star Polygons (Rub el Hizb) */}
                  <rect x="35" y="35" width="130" height="130" rx="12" />
                  <rect x="35" y="35" width="130" height="130" rx="12" transform="rotate(45 100 100)" />
                  <circle cx="100" cy="100" r="88" strokeDasharray="3 4" strokeWidth="1" />
                  <circle cx="100" cy="100" r="74" strokeWidth="0.8" />
                  {/* Decorative corner stars */}
                  <polygon points="100,16 103,24 111,24 105,29 107,37 100,32 93,37 95,29 89,24 97,24" fill="currentColor" opacity="0.6" />
                  <polygon points="100,184 103,176 111,176 105,171 107,163 100,168 93,163 95,171 89,176 97,176" fill="currentColor" opacity="0.6" />
                  <polygon points="16,100 24,103 24,111 29,105 37,107 32,100 37,93 29,95 24,89 24,97" fill="currentColor" opacity="0.6" />
                  <polygon points="184,100 176,103 176,111 171,105 163,107 168,100 163,93 171,95 176,89 176,97" fill="currentColor" opacity="0.6" />
                </svg>

                {/* Inner Counter-Rotating Arabesque Rosette */}
                <svg
                  className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] text-blue-600/30 animate-spin-reverse-slow pointer-events-none"
                  viewBox="0 0 160 160"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                >
                  <circle cx="80" cy="80" r="56" strokeDasharray="4 4" />
                  <circle cx="80" cy="80" r="42" strokeWidth="0.8" />
                  <path d="M 80 24 Q 92 52 80 80 Q 68 52 80 24 Z" />
                  <path d="M 80 136 Q 92 108 80 80 Q 68 108 80 136 Z" />
                  <path d="M 24 80 Q 52 92 80 80 Q 52 68 24 80 Z" />
                  <path d="M 136 80 Q 108 92 80 80 Q 108 68 136 80 Z" />
                  <path d="M 40 40 Q 68 68 80 80 Q 52 52 40 40 Z" />
                  <path d="M 120 120 Q 92 92 80 80 Q 108 108 120 120 Z" />
                  <path d="M 40 120 Q 68 92 80 80 Q 52 108 40 120 Z" />
                  <path d="M 120 40 Q 92 68 80 80 Q 108 52 120 40 Z" />
                </svg>

                {/* Center Foreground: Iconic Mosque Mihrab Arch & Illuminated Crescent */}
                <div className="relative z-20 w-52 h-52 sm:w-60 sm:h-60 rounded-full bg-white/90 backdrop-blur-md border border-blue-200/90 shadow-xl shadow-blue-600/10 flex items-center justify-center p-4">
                  <svg
                    className="w-full h-full text-blue-600"
                    viewBox="0 0 120 120"
                    fill="none"
                    stroke="currentColor"
                  >
                    {/* Mihrab Islamic Horseshoe Arch */}
                    <path
                      d="M 28 102 L 28 66 C 28 44 42 32 60 22 C 78 32 92 44 92 66 L 92 102"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 36 102 L 36 68 C 36 50 48 39 60 30 C 72 39 84 50 84 68 L 84 102"
                      strokeWidth="1.2"
                      strokeDasharray="2 3"
                      className="text-blue-400"
                    />

                    {/* Central Mosque Dome Contour */}
                    <path
                      d="M 44 76 C 44 58 52 48 60 42 C 68 48 76 58 76 76 Z"
                      fill="currentColor"
                      fillOpacity="0.08"
                      strokeWidth="1.8"
                    />

                    {/* Left & Right Flanking Minarets with Crescents */}
                    <path d="M 22 102 L 22 46 L 25 40 L 25 102" strokeWidth="1.5" />
                    <path d="M 98 102 L 98 46 L 95 40 L 95 102" strokeWidth="1.5" />
                    <circle cx="23.5" cy="38" r="2" fill="currentColor" />
                    <circle cx="96.5" cy="38" r="2" fill="currentColor" />

                    {/* Grand Crescent (Hilal) atop the dome */}
                    <path
                      d="M 60 14 C 64 14 67 17 67 21 C 67 25 63 28 59 28 C 62 27 64 24 64 21 C 64 18 62 15 60 14 Z"
                      fill="#D97706"
                      stroke="#D97706"
                      strokeWidth="0.8"
                    />
                    {/* Small star next to crescent */}
                    <circle cx="67" cy="18" r="1" fill="#D97706" />

                    {/* Hanging Ornate Islamic Lantern (Fanoos) */}
                    <line x1="60" y1="42" x2="60" y2="54" strokeWidth="1" strokeDasharray="1 1.5" />
                    <path
                      d="M 57 54 L 63 54 L 64 61 L 60 65 L 56 61 Z"
                      fill="#2563EB"
                      fillOpacity="0.25"
                      strokeWidth="1.2"
                    />
                    <circle cx="60" cy="59" r="1.5" fill="#F59E0B" />

                    {/* Base Steps */}
                    <line x1="20" y1="102" x2="100" y2="102" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="16" y1="107" x2="104" y2="107" strokeWidth="1.5" strokeLinecap="round" className="text-slate-300" />
                  </svg>
                </div>

              </div>

              {/* Verified Mahallu Seal Banner directly anchored below vector */}
              <div className="mt-3 px-4 py-2 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-md flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  ✓
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Manoor Juma Masjid & Islamic Centre
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    Official Digital Mahall System • Ward 4
                  </div>
                </div>
              </div>

            </div>

            {/* FLOATING SATELLITE CARD 1 (Top-Right): "Today's" Programme */}
            <div className="absolute -top-2 right-0 sm:right-4 z-30 w-56 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg shadow-blue-600/5 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                  TODAY
                </span>
                <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-blue-600" />
                  {highlightProgramme.time}
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-900 truncate">
                {highlightProgramme.englishTitle || highlightProgramme.title || 'Community Gathering'}
              </div>
              <div className="text-xs text-slate-500 mt-0.5 truncate">
                {highlightProgramme.venue}
              </div>
            </div>

            {/* FLOATING SATELLITE CARD 2 (Top-Left): Next Prayer */}
            <div className="absolute top-4 left-0 sm:left-2 z-30 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg shadow-blue-600/5 hover:-translate-y-1 transition-all duration-300 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900">Next: Asr</span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    4:32 PM
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-medium">In 48 minutes</div>
              </div>
            </div>

            {/* FLOATING SATELLITE CARD 3 (Bottom-Left): Verified Family Census */}
            <div className="absolute -bottom-4 left-0 sm:left-4 z-30 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg shadow-blue-600/5 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">142 Families</div>
                <div className="text-xs text-slate-500">100% Digital Census</div>
              </div>
            </div>

            {/* FLOATING SATELLITE CARD 4 (Bottom-Right): Madrasa Scholars */}
            <div className="absolute -bottom-6 right-0 sm:right-6 z-30 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg shadow-blue-600/5 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Darul Uloom Madrasa</div>
                <div className="text-xs text-slate-500">312 Students Enrolled</div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
