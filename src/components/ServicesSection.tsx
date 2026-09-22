import React, { useState } from 'react';
import {
  HeartPulse,
  Gift,
  ShieldAlert,
  GraduationCap,
  PhoneCall,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  ChevronRight,
  X
} from 'lucide-react';
import { CommunityService } from '../types/index.ts';
import { api } from '../lib/api.ts';

interface ServicesSectionProps {
  services: CommunityService[];
  onOpenEmergency: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onOpenEmergency,
}) => {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedService, setSelectedService] = useState<CommunityService | null>(null);
  const [showAllServicesModal, setShowAllServicesModal] = useState(false);

  // Form state
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [urgency, setUrgency] = useState<'NORMAL' | 'HIGH' | 'EMERGENCY'>('HIGH');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleOpenForm = (srv: CommunityService) => {
    setSelectedService(srv);
    setShowRequestModal(true);
    setSubmittedId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantPhone || !description) {
      alert('Please fill in your name, phone number, and brief requirement details.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await api.createServiceRequest({
        serviceId: selectedService?.id || 'SRV-GEN',
        serviceTitle: selectedService?.title || 'General Community Assistance',
        applicantName,
        applicantPhone,
        urgency,
        description,
      });
      setSubmittedId(result.id);
      setApplicantName('');
      setApplicantPhone('');
      setDescription('');
    } catch (err: any) {
      alert(err.message || 'Failed to submit service request');
    } finally {
      setSubmitting(false);
    }
  };

  // Compact Categories specified in prompt
  const serviceCategories = [
    {
      id: 'medical',
      title: 'Medical',
      description: 'Ambulance transit, medical subsidy & prescription aid.',
      icon: HeartPulse,
      serviceRef: services.find((s) => s.category.toUpperCase().includes('MEDIC') || s.isEmergency) || services[0],
    },
    {
      id: 'welfare',
      title: 'Welfare',
      description: 'Monthly ration support, orphan care & elderly pension.',
      icon: Gift,
      serviceRef: services.find((s) => s.category.toUpperCase().includes('WELF') || s.category.toUpperCase().includes('RELIEF')) || services[1],
    },
    {
      id: 'janaza',
      title: 'Janaza',
      description: 'Dignified burial assistance, Ghusl & bereavement care.',
      icon: ShieldAlert,
      serviceRef: services.find((s) => s.title.toLowerCase().includes('janaza') || s.description.toLowerCase().includes('janaza')) || services[2] || services[0],
    },
    {
      id: 'education',
      title: 'Education',
      description: 'Madrasa fee exemptions, book grants & higher guidance.',
      icon: GraduationCap,
      serviceRef: services.find((s) => s.category.toUpperCase().includes('EDU') || s.category.toUpperCase().includes('MADR')) || services[3] || services[0],
    },
    {
      id: 'emergency',
      title: 'Emergency',
      description: '24/7 ambulance dispatch & on-call blood donor network.',
      icon: PhoneCall,
      serviceRef: services.find((s) => s.isEmergency) || services[0],
    },
    {
      id: 'more',
      title: 'More Services',
      description: 'Nikah NOC, family mediation & residence endorsements.',
      icon: Sparkles,
      serviceRef: services[4] || services[0],
    },
  ];

  return (
    <section id="services-section" className="py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              COMMUNITY SERVICES
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Support when you need it
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              From emergency healthcare transit to welfare support, every family is protected by our collective network.
            </p>
          </div>

          <button
            onClick={() => setShowAllServicesModal(true)}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group self-start md:self-auto"
          >
            <span>View all services</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Compact Grid of 6 Services */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {serviceCategories.map((item) => {
            const Icon = item.icon;
            const targetService = item.serviceRef || services[0];

            return (
              <div
                key={item.id}
                className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
                  {targetService ? (
                    <button
                      onClick={() => handleOpenForm(targetService)}
                      className="text-xs font-bold text-slate-700 hover:text-blue-600 flex items-center gap-1 group-hover:text-blue-600 transition-colors"
                    >
                      <span>Request Assistance</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={onOpenEmergency}
                      className="text-xs font-bold text-blue-600 flex items-center gap-1"
                    >
                      <span>Contact Desk</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {item.id === 'emergency' && (
                    <button
                      onClick={onOpenEmergency}
                      className="text-[11px] font-bold text-red-600 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg border border-red-100 transition-colors"
                    >
                      Call SOS
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Online Request Modal */}
      {showRequestModal && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                  COMMUNITY SERVICE REQUEST
                </span>
                <h3 className="font-display text-xl font-bold text-slate-900 mt-1">
                  {selectedService.title}
                </h3>
              </div>
              <button
                onClick={() => setShowRequestModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submittedId ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-display text-lg font-bold text-slate-900">
                    Request Lodged Successfully
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Your reference ticket ID is{' '}
                    <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {submittedId}
                    </span>
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    Coordinator <span className="font-semibold text-slate-700">{selectedService.contactPerson}</span> ({selectedService.contactPhone}) has been notified.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => setShowRequestModal(false)}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs hover:bg-blue-700"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Applicant Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="e.g. K. Basheer Haji"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      placeholder="+91 98470 XXXXX"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Urgency Level
                    </label>
                    <select
                      value={urgency}
                      onChange={(e: any) => setUrgency(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-xs bg-white"
                    >
                      <option value="NORMAL">Standard Assistance</option>
                      <option value="HIGH">High Priority (Urgent)</option>
                      <option value="EMERGENCY">Emergency (Immediate)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Describe Requirement *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Please specify patient name, hospital, medicine requirement, or family situation..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-xs"
                  ></textarea>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
                  <div>
                    <span className="font-bold text-slate-700">Service Coordinator: </span>
                    {selectedService.contactPerson}
                  </div>
                  <div>
                    <span className="font-bold text-slate-700">Direct Helpline: </span>
                    <span className="font-mono font-bold text-blue-700">{selectedService.contactPhone}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowRequestModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* View All Services Modal */}
      {showAllServicesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                  DIRECTORY
                </span>
                <h3 className="font-display text-2xl font-bold text-slate-900 mt-1">
                  All Mahallu Welfare Services
                </h3>
              </div>
              <button
                onClick={() => setShowAllServicesModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((srv) => (
                <div key={srv.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded">
                      {srv.category}
                    </span>
                    {srv.isEmergency && (
                      <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                        24/7 ACTIVE
                      </span>
                    )}
                  </div>
                  <h4 className="font-display text-sm font-bold text-slate-900">{srv.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2">{srv.description}</p>
                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-mono text-[11px]">{srv.contactPhone}</span>
                    <button
                      onClick={() => {
                        setShowAllServicesModal(false);
                        handleOpenForm(srv);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-[11px]"
                    >
                      Request
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
