import React from 'react';
import { MapPin, Users, Award, ShieldCheck, Phone, Mail, Building, Landmark } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const committeeMembers = [
    { name: 'Al-Haj T. Muhammed Haji', role: 'President', phone: '+91 98470 11001' },
    { name: 'K. Basheer Master', role: 'General Secretary', phone: '+91 94472 22334' },
    { name: 'A. P. Usman Haji', role: 'Treasurer', phone: '+91 98951 33445' },
    { name: 'Maulavi Abdul Rahman Baqavi', role: 'Chief Qazi & Imam', phone: '+91 97465 55667' },
    { name: 'P. K. Zubair', role: 'Vice President', phone: '+91 99476 77889' },
    { name: 'V. K. Shereef', role: 'Joint Secretary', phone: '+91 96561 99001' },
  ];

  return (
    <section id="about-section" className="py-24 bg-white border-b border-slate-100 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200">
            HERITAGE & GOVERNANCE
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            About <span className="text-blue-600">Manoor Mahallu</span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed font-normal">
            Rooted in spiritual devotion, community welfare, and educational excellence under the Kerala WAKF Board (Reg. #104/2012).
          </p>
        </div>

        {/* About Paragraph Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 bg-slate-50 p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
              <Landmark className="w-6 h-6" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              A Century of Faith, Unity & Welfare
            </h3>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
              Manoor Mahallu Juma Masjid and its surrounding jurisdiction (Ward 01 to 08) represent a vibrant, cohesive Islamic community dedicated to spiritual growth, moral guidance, and mutual social support. Established over decades of community sacrifice, Manoor Mahallu oversees religious services, the esteemed Darul Uloom Madrasa, zakat and welfare distribution, family registry management, and peaceful matrimonial/dispute resolutions under traditional Islamic jurisprudence and Kerala WAKF regulations.
            </p>
            <div className="pt-2 grid grid-cols-2 gap-4 text-sm font-semibold text-slate-900">
              <div className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-600" />
                <span>142 Registered Families</span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center gap-3">
                <Award className="w-5 h-5 text-emerald-600" />
                <span>180 Madrasa Students</span>
              </div>
            </div>
          </div>

          {/* Location Map Simulation Card */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-600" />
                <span>Mahallu Jurisdiction & Location Map</span>
              </h3>
              <span className="text-xs font-mono bg-slate-100 px-2.5 py-1 rounded-lg text-slate-600">
                GPS: 11.2588° N, 75.7804° E
              </span>
            </div>

            <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900 h-80 sm:h-96 flex flex-col justify-end p-6 text-white group">
              {/* Simulated Map Background with Grid & Vector Roads */}
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-blue-950 opacity-95">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
                {/* Simulated Roads & River */}
                <div className="absolute top-1/3 left-0 right-0 h-3 bg-blue-600/30 transform -rotate-12 blur-xs"></div>
                <div className="absolute top-0 bottom-0 left-1/2 w-4 bg-slate-700/50 transform rotate-6"></div>
              </div>

              {/* Pin Center */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-bounce">
                <div className="px-3 py-1 bg-blue-600 text-white font-bold text-xs rounded-full shadow-lg border border-blue-400 whitespace-nowrap mb-1">
                  Manoor Juma Masjid & Office
                </div>
                <div className="w-6 h-6 rounded-full bg-blue-500 border-4 border-white shadow-2xl flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
              </div>

              {/* Overlay Footer Info */}
              <div className="relative z-10 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white text-sm">Manoor Mahallu Headquarters</div>
                  <div className="text-slate-400">Manoor P.O., Via Kondotty, Kerala - 673638</div>
                </div>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors shadow-sm"
                >
                  Open Maps
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Committee Members Grid */}
        <div className="space-y-8 pt-8 border-t border-slate-100">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Executive Committee Members (2025–2028)
            </h3>
            <p className="text-base text-slate-600">
              Serving the Mahallu community with dedication, transparency, and Shariah compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {committeeMembers.map((member, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-slate-50/80 hover:bg-blue-50/40 border border-slate-200/80 hover:border-blue-200 transition-all shadow-2xs group space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                    {member.name.split(' ').pop()?.[0] || 'M'}
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-white text-blue-700 border border-blue-100 shadow-2xs">
                    {member.role}
                  </span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {member.name}
                  </h4>
                  <p className="text-sm text-slate-500 font-mono flex items-center gap-1.5 mt-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{member.phone}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
