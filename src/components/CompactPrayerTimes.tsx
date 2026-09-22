import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { getManoorPrayerTimes, PrayerTimeItem } from '../lib/prayer-times.ts';

export const CompactPrayerTimes: React.FC = () => {
  const [prayerData, setPrayerData] = useState(getManoorPrayerTimes());
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTimes = () => {
      setPrayerData(getManoorPrayerTimes());
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
    };
    updateTimes();
    const timer = setInterval(updateTimes, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-12 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              COMMUNITY CONGREGATIONS
            </span>
            <h2 className="font-display text-2xl font-bold text-slate-900 mt-1">
              Today’s Prayer Times
            </h2>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
            <span className="text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md font-semibold border border-blue-100">
              Next: {prayerData.nextPrayer.name} in ~{Math.max(1, prayerData.nextPrayer.remainingMinutes)}m
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="hidden sm:inline font-mono">{prayerData.hijriDate}</span>
          </div>
        </div>

        {/* Compact Horizontal Scrollable Cards */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {prayerData.prayers.map((prayer) => {
            const isNext = prayer.isNext;
            return (
              <div
                key={prayer.name}
                className={`shrink-0 flex-1 min-w-[130px] sm:min-w-[140px] p-4 rounded-2xl border transition-all ${
                  isNext
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                    : 'bg-slate-50/70 hover:bg-white text-slate-900 border-slate-200/80 hover:border-blue-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className={`font-semibold ${isNext ? 'text-blue-100' : 'text-slate-600'}`}>
                    {prayer.name}
                  </span>
                  <span className={`font-arabic text-xs ${isNext ? 'text-blue-200' : 'text-slate-500'}`}>
                    {prayer.arabic}
                  </span>
                </div>

                <div className={`font-mono text-base font-bold ${isNext ? 'text-white' : 'text-slate-900'}`}>
                  {prayer.time}
                </div>

                <div className={`text-xs font-malayalam mt-1 ${isNext ? 'text-blue-100' : 'text-slate-500'}`}>
                  {prayer.malayalam}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
