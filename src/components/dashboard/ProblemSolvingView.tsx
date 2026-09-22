import React, { useState } from 'react';
import {
  ShieldAlert,
  Lock,
  PlusCircle,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  HeartHandshake
} from 'lucide-react';
import { ProblemCase } from '../../types/index.ts';
import { api } from '../../lib/api.ts';

interface ProblemSolvingViewProps {
  cases: ProblemCase[];
  onRefreshCases: () => void;
}

export const ProblemSolvingView: React.FC<ProblemSolvingViewProps> = ({
  cases,
  onRefreshCases,
}) => {
  const [showNewModal, setShowNewModal] = useState(false);
  const [caseTitle, setCaseTitle] = useState('');
  const [category, setCategory] = useState<ProblemCase['category']>('Family Problems');
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !description) {
      alert('Please fill in applicant and description details.');
      return;
    }

    setSubmitting(true);
    try {
      await api.createProblemCase({
        category,
        applicantName,
        applicantPhone,
        description: caseTitle ? `${caseTitle}: ${description}` : description,
        priority: 'MEDIUM',
        status: 'New',
        assignedScholarOrStaff: 'Mahallu Reconciliation Board',
        date: new Date().toISOString().split('T')[0],
      });
      setShowNewModal(false);
      setCaseTitle('');
      setApplicantName('');
      setApplicantPhone('');
      setDescription('');
      onRefreshCases();
    } catch (err: any) {
      alert(err.message || 'Failed to file case');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-800 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
              Strictly Confidential (Khitman Desk)
            </span>
          </div>
          <h1 className="font-display text-2xl font-black text-gray-950 mt-1">
            Reconciliation & Family Counseling Bureau
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Restricted access portal for Mahallu Qazi and Arbitration Committee to resolve marital, boundary, and financial disputes amicably.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-gray-950 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
        >
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>Lodge Confidential Case</span>
        </button>
      </div>

      {/* Warning Notice */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
        <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Privacy Safeguard:</strong> All records in this chamber are strictly protected by Islamic confidentiality rules (Amanah). Case notes and family identity details are visible only to the Mahal Qazi, President, and designated reconcilers.
        </p>
      </div>

      {/* Cases List */}
      <div className="space-y-4">
        {cases.map((c) => (
          <div
            key={c.id}
            className="p-5 rounded-3xl bg-white border border-gray-200/80 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded">
                  {c.id}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-900 border border-purple-200 px-2.5 py-0.5 rounded-full">
                  {c.category}
                </span>
              </div>

              <span
                className={`self-start sm:self-auto px-3 py-1 rounded-xl text-[10px] font-black uppercase ${
                  c.status === 'Resolved' || c.status === 'Closed'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}
              >
                {c.status}
              </span>
            </div>

            <div>
              <p className="text-xs text-gray-800 font-medium leading-relaxed mt-1">
                {c.description}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-400 block text-[10px]">Applicant Details:</span>
                <span className="font-bold text-gray-900">{c.applicantName}</span>
                {c.applicantPhone && <span className="text-gray-600"> • {c.applicantPhone}</span>}
              </div>
              <div className="sm:text-right">
                <span className="text-gray-400 block text-[10px]">Assigned Mediators:</span>
                <span className="font-semibold text-gray-800">{c.assignedScholarOrStaff || 'Reconciliation Board'}</span>
              </div>
            </div>

            {/* Private Notes */}
            {c.privateNotes && c.privateNotes.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-gray-100 text-xs">
                <span className="font-bold text-gray-700 text-[11px]">Mediation Sessions:</span>
                {c.privateNotes.map((noteItem, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-emerald-50/40 border border-emerald-100 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-gray-900">{noteItem.date} ({noteItem.author}): </span>
                      <span className="text-gray-700">{noteItem.note}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lodge Case Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-display text-lg font-bold text-gray-950 flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-500" />
                <span>File Confidential Grievance</span>
              </h3>
              <button
                onClick={() => setShowNewModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Case Title *</label>
                <input
                  type="text"
                  required
                  value={caseTitle}
                  onChange={(e) => setCaseTitle(e.target.value)}
                  placeholder="e.g. Marital Reconciliation - House #14/232"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Dispute Classification</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                >
                  <option value="Family Dispute">Family / Marital Dispute</option>
                  <option value="Financial Relief">Debt Relief / Financial Insolvency</option>
                  <option value="Counseling">Youth & Addiction Counseling</option>
                  <option value="Neighbor Boundary">Neighbor & Land Boundary Dispute</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Applicant Name *</label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Applicant Contact Phone</label>
                  <input
                    type="text"
                    value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value)}
                    placeholder="+91 98470 XXXXX"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Confidential Facts & Description *</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary of matter, family context, previous reconciliations, and assistance requested..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-gray-950 text-white font-bold"
                >
                  {submitting ? 'Registering...' : 'Lodge Secure Case'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
