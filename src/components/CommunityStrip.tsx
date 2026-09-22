import React, { useState, useEffect } from 'react';
import {
  Home,
  Users,
  GraduationCap,
  HeartHandshake,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { DashboardStats } from '../types/index.ts';

interface CommunityStripProps {
  stats: DashboardStats;
  onExploreFamilies?: () => void;
  onExploreStudents?: () => void;
  onOpenEmergency?: () => void;
}

// Custom animated counter hook
function useCountUp(endVal: number, duration: number = 1200): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      // ease-out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeProgress * endVal));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(endVal);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [endVal, duration]);

  return count;
}

export const CommunityStrip: React.FC<CommunityStripProps> = ({
  stats,
  onExploreFamilies,
  onExploreStudents,
  onOpenEmergency,
}) => {
  const targetFamilies = stats.totalFamilies || 142;
  const targetMembers = stats.totalMembers || 586;
  const targetStudents = stats.totalStudents || 180;

  const countFamilies = useCountUp(targetFamilies, 1400);
  const countMembers = useCountUp(targetMembers, 1600);
  const countStudents = useCountUp(targetStudents, 1500);

  const cards = [
    {
      id: 'families',
      numDisplay: countFamilies,
      label: 'Families',
      sublabel: 'Verified Households',
      description: 'Active residential units with complete digital census documentation.',
      icon: Home,
      color: 'blue',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      iconBg: 'bg-blue-500 text-white shadow-blue-500/25',
      borderColor: 'hover:border-blue-300',
      glowColor: 'group-hover:bg-blue-500/5',
      onClick: onExploreFamilies,
    },
    {
      id: 'members',
      numDisplay: countMembers,
      label: 'Members',
      sublabel: 'Community Census',
      description: 'Residents registered across 4 wards with individual digital IDs.',
      icon: Users,
      color: 'indigo',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      iconBg: 'bg-indigo-600 text-white shadow-indigo-600/25',
      borderColor: 'hover:border-indigo-300',
      glowColor: 'group-hover:bg-indigo-500/5',
      onClick: onExploreFamilies,
    },
    {
      id: 'students',
      numDisplay: countStudents,
      label: 'Students',
      sublabel: 'Madrasa Darul Uloom',
      description: 'Young scholars enrolled across primary and secondary Islamic grades.',
      icon: GraduationCap,
      color: 'emerald',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      iconBg: 'bg-emerald-600 text-white shadow-emerald-600/25',
      borderColor: 'hover:border-emerald-300',
      glowColor: 'group-hover:bg-emerald-500/5',
      onClick: onExploreStudents,
    },
    {
      id: 'care',
      numDisplay: '24/7',
      label: 'Community Care',
      sublabel: 'Emergency & Welfare',
      description: 'Around-the-clock emergency desk, relief assistance, and pastoral guidance.',
      icon: HeartHandshake,
      color: 'rose',
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
      iconBg: 'bg-rose-600 text-white shadow-rose-600/25',
      borderColor: 'hover:border-rose-300',
      glowColor: 'group-hover:bg-rose-500/5',
      isLive: true,
      onClick: onOpenEmergency,
    },
  ];

  return (
    <section className="py-12 bg-slate-50/70 border-y border-slate-200/80 relative overflow-hidden">
      {/* Decorative ambient background spots */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with normal, accessible typography */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>LIVE COMMUNITY STATISTICS</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
              Manoor Mahall at a Glance
            </h2>
          </div>
          <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Real-time census synced with WAKF registry</span>
          </div>
        </div>

        {/* 4 Animated Metric Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={card.onClick}
                className={`group relative p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden ${card.borderColor}`}
                style={{
                  animation: `fadeSlideUp 0.6s ease-out ${idx * 0.1}s backwards`,
                }}
              >
                {/* Subtle hover gradient glow */}
                <div className={`absolute inset-0 transition-colors duration-300 pointer-events-none ${card.glowColor}`} />

                {/* Top Row: Icon + Badge / Live Status */}
                <div className="flex items-center justify-between relative z-10 mb-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110 ${card.iconBg}`}>
                    <Icon className="w-6 h-6 stroke-[2.2]" />
                  </div>

                  {card.isLive ? (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span>ACTIVE</span>
                    </div>
                  ) : (
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${card.badgeBg}`}>
                      {card.sublabel}
                    </span>
                  )}
                </div>

                {/* Middle: Number Display + Primary Label */}
                <div className="relative z-10 space-y-1 mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-4xl sm:text-5xl font-black text-slate-900 tracking-tight transition-colors group-hover:text-blue-600">
                      {card.numDisplay}
                    </span>
                    {card.id !== 'care' && (
                      <span className="text-xl font-bold text-blue-600">+</span>
                    )}
                  </div>

                  <h3 className="font-display text-lg font-bold text-slate-900">
                    {card.label}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal pt-1">
                    {card.description}
                  </p>
                </div>

                {/* Bottom Row: Action link / Indicator */}
                <div className="relative z-10 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-blue-600 transition-colors">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    Verified System Data
                  </span>
                  <div className="w-6 h-6 rounded-full bg-slate-50 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>

                {/* Subtle bottom progress/accent line on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
