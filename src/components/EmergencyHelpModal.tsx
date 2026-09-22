import React from 'react';
import {
  PhoneCall,
  MessageSquare,
  HeartHandshake,
  ShieldAlert,
  Clock,
  MapPin,
  ExternalLink,
  X
} from 'lucide-react';

interface EmergencyHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestService?: () => void;
}

export const EmergencyHelpModal: React.FC<EmergencyHelpModalProps> = ({
  isOpen,
  onClose,
  onRequestService,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-slate-900">
                How can we help you?
              </h3>
              <p className="text-xs text-slate-500">
                Official Mahallu Desk & Community Care Hotline
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Core Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <a
            href="tel:+919447123456"
            className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-200 transition-colors flex flex-col items-center text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
              <PhoneCall className="w-4 h-4" />
            </div>
            <span className="font-display text-xs font-bold text-slate-900">Call Mahall</span>
            <span className="text-[10px] text-slate-500 mt-0.5">+91 94471 23456</span>
          </a>

          <a
            href="https://wa.me/919447123456?text=Assalamu%20Alaikum,%20I%20need%20assistance%20from%20Manoor%20Mahall%20Desk."
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-200 transition-colors flex flex-col items-center text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
              <MessageSquare className="w-4 h-4" />
            </div>
            <span className="font-display text-xs font-bold text-slate-900">Message</span>
            <span className="text-[10px] text-slate-500 mt-0.5">WhatsApp Chat</span>
          </a>

          <button
            onClick={() => {
              onClose();
              if (onRequestService) onRequestService();
              const el = document.getElementById('services-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="p-4 rounded-2xl bg-slate-50 hover:bg-sky-50 border border-slate-200/80 hover:border-sky-200 transition-colors flex flex-col items-center text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <span className="font-display text-xs font-bold text-slate-900">Request Service</span>
            <span className="text-[10px] text-slate-500 mt-0.5">Medical & Welfare</span>
          </button>

          <a
            href="tel:+919847099881"
            className="p-4 rounded-2xl bg-red-50 hover:bg-red-100/80 border border-red-200/80 transition-colors flex flex-col items-center text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <span className="font-display text-xs font-bold text-red-900">Emergency</span>
            <span className="text-[10px] text-red-700 font-bold mt-0.5">24/7 Ambulance</span>
          </a>
        </div>

        {/* Detailed Contacts */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Key Office Bearers
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-slate-900">24/7 Community Ambulance</div>
              <div className="text-[11px] text-slate-500">Coordinator: K. Basheer</div>
            </div>
            <a href="tel:+919847099881" className="font-mono font-bold text-red-600 text-xs hover:underline">
              +91 98470 99881
            </a>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-slate-900">Janaza & Condolence Support</div>
              <div className="text-[11px] text-slate-500">Lead: Usthad Zainul Abid Musliyar</div>
            </div>
            <a href="tel:+919847345678" className="font-mono font-bold text-blue-600 text-xs hover:underline">
              +91 98473 45678
            </a>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-slate-900">Mahallu General Secretary</div>
              <div className="text-[11px] text-slate-500">P.K. Abdul Majeed</div>
            </div>
            <a href="tel:+919447123456" className="font-mono font-bold text-blue-600 text-xs hover:underline">
              +91 94471 23456
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
