import React from 'react';
import {
  ShieldCheck,
  MapPin,
  PhoneCall,
  Lock,
  FileCheck,
  HelpCircle,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

interface FooterProps {
  onOpenAuth: () => void;
  onOpenAdmin?: () => void;
  onOpenVerifyCert: () => void;
  onOpenEmergency: () => void;
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAuth,
  onOpenAdmin,
  onOpenVerifyCert,
  onOpenEmergency,
  onNavigate,
}) => {
  return (
    <footer id="footer-section" className="bg-slate-950 text-white border-t border-slate-800/80 pt-16 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle architectural ambient gradient at top border */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
      
      <div className="max-w-7xl mx-auto">
        {/* 4 Clean Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-14">
          
          {/* Col 1: Brand & Vision */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-display font-black flex items-center justify-center text-base shadow-lg shadow-emerald-950 border border-emerald-400/30">
                M
              </div>
              <div>
                <span className="font-display font-extrabold text-lg text-white tracking-tight block">
                  MANOOR MAHALL
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">
                  Digital Operating System
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              One simple digital system for our community. Serving families, students and mosque activities with complete transparency.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                manoormahall.com
              </span>
            </div>
          </div>

          {/* Col 2: Explore */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300 font-normal">
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('programmes-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white hover:translate-x-0.5 transition-all flex items-center gap-1.5 text-slate-300"
                >
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                  <span>Programmes</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('services-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white hover:translate-x-0.5 transition-all flex items-center gap-1.5 text-slate-300"
                >
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                  <span>Services & Applications</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('madrasa')}
                  className="hover:text-white hover:translate-x-0.5 transition-all flex items-center gap-1.5 text-slate-300"
                >
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                  <span>Madrasa Darul Uloom</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('today-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white hover:translate-x-0.5 transition-all flex items-center gap-1.5 text-slate-300"
                >
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                  <span>About Mahallu</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Portals */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              Portals & Verification
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300 font-normal">
              <li>
                <button
                  onClick={onOpenAuth}
                  className="hover:text-white hover:translate-x-0.5 transition-all flex items-center gap-2 text-slate-300"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="font-medium">Member Portal</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Verified ID
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin || onOpenAuth}
                  className="hover:text-white hover:translate-x-0.5 transition-all flex items-center gap-2 text-slate-300"
                >
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>Admin OS</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAuth}
                  className="hover:text-white hover:translate-x-0.5 transition-all flex items-center gap-2 text-slate-300"
                >
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                  <span>Student Results</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenVerifyCert}
                  className="hover:text-white hover:translate-x-0.5 transition-all flex items-center gap-2 text-slate-300"
                >
                  <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verify Certificate</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Need Help */}
          <div className="space-y-3.5 text-xs">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Contact
            </h4>
            
            <div className="flex items-start gap-2.5 text-slate-300">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="leading-snug">Manoor Juma Masjid, Malappuram, Kerala 676505</span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <span className="text-slate-400 text-xs">Phone:</span>
              <a
                href="tel:+919447123456"
                className="font-bold text-white hover:text-emerald-400 font-mono transition-colors"
              >
                +91 94471 23456
              </a>
            </div>

            {/* 24/7 Emergency Ambulance */}
            <div className="pt-1">
              <button
                onClick={onOpenEmergency}
                className="w-full px-3.5 py-2.5 rounded-xl bg-red-950/60 hover:bg-red-900/60 text-red-200 border border-red-800/60 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
              >
                <PhoneCall className="w-3.5 h-3.5 text-red-400 animate-bounce" />
                <span>24/7 Emergency Ambulance</span>
              </button>
            </div>

            {/* Need Help? Quick Assistance */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                Need Help?
              </span>
              <a
                href="https://wa.me/919447123456"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1 font-semibold"
              >
                WhatsApp Desk
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/90 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-slate-400 font-medium">
            © 2026 Manoor Mahall. All rights reserved.
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Official Kerala WAKF Board
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">Tamper-evident verification</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">Privacy Protected</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

