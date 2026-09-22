import React from 'react';
import { Users, GraduationCap, HeartHandshake, Calendar, ArrowRight } from 'lucide-react';

interface FeatureCardsProps {
  onSelectFeature: (featureId: string) => void;
}

export const FeatureCards: React.FC<FeatureCardsProps> = ({ onSelectFeature }) => {
  const features = [
    {
      number: '01',
      id: 'families',
      title: 'Families',
      description: 'Stay connected with your Mahallu family.',
      icon: Users,
    },
    {
      number: '02',
      id: 'madrasa',
      title: 'Madrasa',
      description: 'Classes, admissions and exam results.',
      icon: GraduationCap,
    },
    {
      number: '03',
      id: 'services',
      title: 'Services',
      description: 'Get community support when you need it.',
      icon: HeartHandshake,
    },
    {
      number: '04',
      id: 'programmes',
      title: 'Programmes',
      description: 'Discover what\'s happening around you.',
      icon: Calendar,
    },
  ];

  return (
    <section className="py-16 bg-slate-50/40 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                id={`feature-card-${item.id}`}
                onClick={() => onSelectFeature(item.id)}
                className="group relative p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                      {item.number}
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white group-hover:scale-105 transition-all duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-display text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-600 mt-2 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
