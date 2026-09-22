import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  UserCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Plus,
  X
} from 'lucide-react';
import { Programme } from '../types/index.ts';
import { api } from '../lib/api.ts';

interface ProgrammesSectionProps {
  programmes: Programme[];
  onProgrammeUpdated: () => void;
  isAdmin?: boolean;
  onOpenAddEvent?: () => void;
}

export const ProgrammesSection: React.FC<ProgrammesSectionProps> = ({
  programmes,
  onProgrammeUpdated,
  isAdmin,
  onOpenAddEvent,
}) => {
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const [registeredSuccessId, setRegisteredSuccessId] = useState<string | null>(null);
  const [showAllModal, setShowAllModal] = useState(false);

  // Show only 3-4 upcoming programmes as requested
  const visibleProgrammes = programmes.slice(0, 4);

  const handleRegister = async (prog: Programme) => {
    setRegisteringId(prog.id);
    try {
      await api.registerForProgramme(prog.id);
      setRegisteredSuccessId(prog.id);
      onProgrammeUpdated();
      setTimeout(() => {
        setRegisteredSuccessId(null);
      }, 3000);
    } catch (e: any) {
      alert(e.message || 'Registration failed');
    } finally {
      setRegisteringId(null);
    }
  };

  return (
    <section id="programmes-section" className="py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              DATES & PROGRAMS
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Dates, Programs, Events & Da'wah Sessions
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              Spiritual circles, youth symposiums, and community gatherings at Manoor Mahall.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
            {onOpenAddEvent && (
              <button
                onClick={onOpenAddEvent}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-500/20 transition-all hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Event / Program</span>
              </button>
            )}

            <button
              onClick={() => setShowAllModal(true)}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group py-2 px-1"
            >
              <span>View all programmes</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Modern Horizontal Programmes Layout */}
        <div className="space-y-3.5">
          {visibleProgrammes.map((prog) => {
            const isRegistered = registeredSuccessId === prog.id;
            const isToday = prog.date === new Date().toISOString().split('T')[0];

            return (
              <div
                key={prog.id}
                className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6 group"
              >
                {/* Left: Thumbnail poster preview + Title & Venue */}
                <div className="flex items-start gap-4">
                  {/* Modern Poster Thumbnail Badge */}
                  <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-50 border border-blue-100 flex flex-col items-center justify-center text-center group-hover:bg-blue-600 group-hover:border-blue-600 transition-colors duration-300">
                    <span className="text-xs font-semibold uppercase text-blue-600 group-hover:text-blue-100 transition-colors">
                      {new Date(prog.date).toLocaleDateString('en-US', { month: 'short' }) || 'EVENT'}
                    </span>
                    <span className="font-display font-bold text-base sm:text-lg text-slate-900 group-hover:text-white transition-colors">
                      {new Date(prog.date).getDate() || '24'}
                    </span>
                  </div>

                  {/* Title and Metadata */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                        {prog.category}
                      </span>
                      {isToday && (
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                          TODAY
                        </span>
                      )}
                    </div>

                    <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {prog.englishTitle || prog.title}
                    </h3>

                    {prog.malayalamTitle && (
                      <div className="font-malayalam text-xs text-slate-500">
                        {prog.malayalamTitle}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{prog.time}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{prog.venue}</span>
                      </div>
                      {prog.speaker && (
                        <>
                          <span>•</span>
                          <span className="text-slate-700 font-medium">By {prog.speaker}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Registration status & Action button */}
                <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <UserCheck className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-slate-900">{prog.registeredCount || 45}</span>
                    <span>joined</span>
                  </div>

                  {prog.registrationRequired ? (
                    isRegistered ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4" />
                        Registered
                      </span>
                    ) : (
                      <button
                        onClick={() => handleRegister(prog)}
                        disabled={registeringId === prog.id}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all shadow-xs"
                      >
                        {registeringId === prog.id ? 'Registering...' : 'Register Free'}
                      </button>
                    )
                  ) : (
                    <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                      Open to All
                    </span>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* View All Modal */}
      {showAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                  CALENDAR
                </span>
                <h3 className="font-display text-2xl font-bold text-slate-900 mt-1">
                  All Mahallu Programmes
                </h3>
              </div>
              <button
                onClick={() => setShowAllModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {programmes.map((p) => (
                <div key={p.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded">
                        {p.category}
                      </span>
                      <span className="text-xs font-mono text-slate-400">{p.date} • {p.time}</span>
                    </div>
                    <div className="font-display text-sm font-bold text-slate-900 mt-1">
                      {p.englishTitle || p.title}
                    </div>
                    <div className="text-xs text-slate-500">{p.venue}</div>
                  </div>

                  <button
                    onClick={() => handleRegister(p)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white shrink-0"
                  >
                    Register
                  </button>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
