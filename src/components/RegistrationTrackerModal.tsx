import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  ChevronRight,
  ShieldCheck,
  Send,
  Calendar,
  UserCheck
} from 'lucide-react';
import { Registration } from '../types/index.ts';
import { api } from '../lib/api.ts';

interface RegistrationTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: string;
}

export const RegistrationTrackerModal: React.FC<RegistrationTrackerModalProps> = ({
  isOpen,
  onClose,
  initialType,
}) => {
  const [activeTab, setActiveTab] = useState<'TRACK' | 'NEW'>('TRACK');
  const [trackingId, setTrackingId] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [searching, setSearching] = useState(false);
  const [foundRegistrations, setFoundRegistrations] = useState<Registration[]>([]);
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);
  const [searchError, setSearchError] = useState('');

  // Form for New Application
  const [formType, setFormType] = useState<Registration['type']>(
    (initialType as any) || 'Marriage'
  );
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [houseName, setHouseName] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [ward, setWard] = useState('Ward 4');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [createdReg, setCreatedReg] = useState<Registration | null>(null);

  if (!isOpen) return null;

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    setSelectedReg(null);
    setFoundRegistrations([]);

    if (!trackingId && !searchPhone) {
      setSearchError('Please provide either an Application ID (e.g. MH-REG-2026-000125) or your Phone Number.');
      return;
    }

    setSearching(true);
    try {
      const all = await api.getRegistrations(searchPhone || undefined);
      if (trackingId) {
        const match = all.filter(r => r.id.toLowerCase().includes(trackingId.trim().toLowerCase()));
        if (match.length > 0) {
          setFoundRegistrations(match);
          setSelectedReg(match[0]);
        } else {
          setSearchError(`No active record found matching "${trackingId}". Please check your receipt.`);
        }
      } else {
        if (all.length > 0) {
          setFoundRegistrations(all);
          setSelectedReg(all[0]);
        } else {
          setSearchError(`No registrations found for phone number "${searchPhone}".`);
        }
      }
    } catch (err: any) {
      setSearchError(err.message || 'Tracking failed');
    } finally {
      setSearching(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantPhone) {
      alert('Please fill in applicant name and phone number.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await api.createRegistration({
        type: formType,
        applicantName,
        applicantPhone,
        details: {
          houseName,
          houseNumber,
          ward,
          notes,
          submittedVia: 'Online Public Portal',
        },
      });
      setCreatedReg(result);
      setSelectedReg(result);
    } catch (err: any) {
      alert(err.message || 'Registration submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-6">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Registrations & Applications Hub
            </span>
            <h2 className="font-display text-2xl font-black text-gray-950 mt-1">
              {activeTab === 'TRACK' ? 'Track Application Status' : 'New Registration'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-2xl">
          <button
            onClick={() => setActiveTab('TRACK')}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'TRACK'
                ? 'bg-white text-emerald-950 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Track Existing Application
          </button>
          <button
            onClick={() => setActiveTab('NEW')}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'NEW'
                ? 'bg-white text-emerald-950 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Submit New Application
          </button>
        </div>

        {activeTab === 'TRACK' ? (
          <div className="space-y-6">
            
            {/* Search Input Box */}
            <form onSubmit={handleTrack} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Application ID
                  </label>
                  <input
                    type="text"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="e.g. MH-REG-2026-000125"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Or Registered Phone Number
                  </label>
                  <input
                    type="tel"
                    value={searchPhone}
                    onChange={(e) => setSearchPhone(e.target.value)}
                    placeholder="+91 94470 00000"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={searching}
                  className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-900/10 flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>{searching ? 'Verifying...' : 'Search Record'}</span>
                </button>
              </div>
            </form>

            {searchError && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <span>{searchError}</span>
              </div>
            )}

            {/* If multiple records found */}
            {foundRegistrations.length > 1 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-700">Found {foundRegistrations.length} applications:</span>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {foundRegistrations.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setSelectedReg(r)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border ${
                        selectedReg?.id === r.id
                          ? 'bg-emerald-800 text-white border-emerald-800'
                          : 'bg-gray-50 text-gray-700 border-gray-200'
                      }`}
                    >
                      {r.type} ({r.id.split('-').pop()})
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Result Timeline Display */}
            {selectedReg && (
              <div className="p-6 rounded-3xl bg-gray-50 border border-gray-200 space-y-6">
                
                {/* Status Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-200">
                  <div>
                    <div className="font-mono text-xs font-bold text-emerald-800">
                      {selectedReg.id}
                    </div>
                    <div className="font-display text-lg font-bold text-gray-900 mt-0.5">
                      {selectedReg.type} Application
                    </div>
                    <div className="text-xs text-gray-600 mt-0.5">
                      Applicant: <span className="font-semibold text-gray-900">{selectedReg.applicantName}</span> ({selectedReg.applicantPhone})
                    </div>
                  </div>

                  <span
                    className={`self-start sm:self-auto px-3.5 py-1.5 rounded-xl text-xs font-black tracking-wide uppercase ${
                      selectedReg.status === 'APPROVED' || selectedReg.status === 'COMPLETED'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : selectedReg.status === 'REJECTED'
                        ? 'bg-red-100 text-red-800 border border-red-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {selectedReg.status}
                  </span>
                </div>

                {/* Progress Visual Tracker */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-3 rounded-2xl bg-white border border-gray-200 shadow-2xl">
                    <div className="font-bold text-emerald-800 mb-1">1. Submitted</div>
                    <div className="text-[10px] text-gray-500">
                      {selectedReg.submittedAt.split('T')[0]}
                    </div>
                  </div>
                  <div className={`p-3 rounded-2xl border ${
                    selectedReg.status !== 'SUBMITTED' ? 'bg-white border-emerald-300' : 'bg-gray-100 text-gray-400 border-gray-200'
                  }`}>
                    <div className="font-bold text-gray-900 mb-1">2. Under Review</div>
                    <div className="text-[10px] text-gray-500">
                      {selectedReg.reviewedBy ? `By ${selectedReg.reviewedBy}` : 'In queue'}
                    </div>
                  </div>
                  <div className={`p-3 rounded-2xl border ${
                    selectedReg.status === 'APPROVED' || selectedReg.status === 'COMPLETED'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                      : 'bg-gray-100 text-gray-400 border-gray-200'
                  }`}>
                    <div className="font-bold mb-1">3. Decision</div>
                    <div className="text-[10px] text-gray-500">
                      {selectedReg.status === 'APPROVED' ? 'Approved & Issued' : 'Pending'}
                    </div>
                  </div>
                </div>

                {/* Reviewer notes */}
                {selectedReg.reviewNotes && (
                  <div className="p-4 rounded-2xl bg-white border border-emerald-100 text-xs">
                    <div className="font-bold text-emerald-900 mb-1">
                      Official Mahallu Secretariat Remark:
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedReg.reviewNotes}
                    </p>
                  </div>
                )}

              </div>
            )}

          </div>
        ) : (
          /* New Registration Form */
          createdReg ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-gray-900">
                  Application Successfully Registered!
                </h3>
                <p className="text-xs text-gray-600 mt-1 max-w-md mx-auto">
                  Your registration reference number is generated below. Save this tracking number to check review status.
                </p>
                <div className="inline-block mt-4 px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-300 font-mono text-base font-extrabold text-emerald-900">
                  {createdReg.id}
                </div>
              </div>
              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => {
                    setCreatedReg(null);
                    setActiveTab('TRACK');
                    setTrackingId(createdReg.id);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-bold"
                >
                  View Application Timeline
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Application Category *
                </label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                >
                  <option value="Marriage">Marriage (Nikah NOC & Registration)</option>
                  <option value="Madrasa Admission">Madrasa Darul Uloom Admission</option>
                  <option value="Certificate">Residence / Membership Certificate</option>
                  <option value="Family Registration">New Family Registration</option>
                  <option value="Member Addition">Add Family Member</option>
                  <option value="Death / Janaza">Death Record & Burial</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Applicant / Head Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="Full name"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Mobile Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value)}
                    placeholder="+91 94470 00000"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    House Name
                  </label>
                  <input
                    type="text"
                    value={houseName}
                    onChange={(e) => setHouseName(e.target.value)}
                    placeholder="e.g. Kalluvila House"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    House Number
                  </label>
                  <input
                    type="text"
                    value={houseNumber}
                    onChange={(e) => setHouseNumber(e.target.value)}
                    placeholder="14/232"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Ward
                  </label>
                  <select
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="Ward 1">Ward 1 - School Road</option>
                    <option value="Ward 2">Ward 2 - Market Road</option>
                    <option value="Ward 3">Ward 3 - River View</option>
                    <option value="Ward 4">Ward 4 - Juma Masjid Road</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Application Details & Notes
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Provide additional details (e.g. student standard, bride & groom names, or certificate purpose)..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                ></textarea>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-900/10 flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Submitting...' : 'Submit Official Registration'}</span>
                </button>
              </div>

            </form>
          )
        )}

      </div>
    </div>
  );
};
