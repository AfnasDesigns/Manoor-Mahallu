import React from 'react';
import { Calendar, Clock, MapPin, ArrowRight, Bell, ChevronRight } from 'lucide-react';
import { Programme, Announcement } from '../types/index.ts';

interface TodayAtMahallProps {
  programmes: Programme[];
  announcements: Announcement[];
  onViewProgramme: (programme: Programme) => void;
  onViewNotice: (announcement: Announcement) => void;
}

export const TodayAtMahall: React.FC<TodayAtMahallProps> = ({
  programmes,
  announcements,
  onViewProgramme,
  onViewNotice,
}) => {
  // Use today's programme or earliest upcoming programme
  const mainEvent = programmes[0];
  const pinnedNotice = announcements.find((a) => a.isPinned) || announcements[0];

  return (
    <section id="today-section" className="py-14 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            TODAY AT MANOOR MAHALL
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Today’s Happenings & Announcements
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Main Signature Event Card (8 cols) */}
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-blue-50/40 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-all">
            {mainEvent ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    FEATURED TODAY
                  </span>
                  <span className="text-xs font-semibold text-blue-700 bg-blue-100/70 px-2.5 py-1 rounded-lg">
                    {mainEvent.category}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
                    {mainEvent.englishTitle || mainEvent.title}
                  </h3>
                  {mainEvent.description && (
                    <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed font-normal">
                      {mainEvent.description}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-600 pt-2">
                  <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>{mainEvent.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span>{mainEvent.venue}</span>
                  </div>
                  {mainEvent.speaker && (
                    <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                      <span>Led by: <strong className="text-slate-900 font-semibold">{mainEvent.speaker}</strong></span>
                    </div>
                  )}
                </div>

                <div className="pt-3 flex items-center gap-3">
                  <button
                    onClick={() => onViewProgramme(mainEvent)}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <span>View Full Schedule</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 font-medium text-sm">
                No special programmes scheduled for today.
              </div>
            )}
          </div>

          {/* Compact Notice Card (4 cols) */}
          <div className="lg:col-span-4 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-all">
            {pinnedNotice ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-blue-600 flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-blue-600" />
                    OFFICIAL NOTICE
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    {pinnedNotice.date}
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="font-display text-lg font-bold text-slate-900 leading-snug">
                    {pinnedNotice.englishTitle || pinnedNotice.malayalamTitle}
                  </h4>
                  {pinnedNotice.malayalamTitle && pinnedNotice.englishTitle && (
                    <div className="font-malayalam text-xs text-slate-600">
                      {pinnedNotice.malayalamTitle}
                    </div>
                  )}
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-normal">
                    {pinnedNotice.content}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => onViewNotice(pinnedNotice)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
                  >
                    <span>Read circular document</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs">
                No active notices.
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
