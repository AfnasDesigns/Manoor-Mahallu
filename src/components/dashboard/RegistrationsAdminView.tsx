import React, { useState } from 'react';
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  User,
  Phone,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Registration } from '../../types/index.ts';
import { api } from '../../lib/api.ts';

interface RegistrationsAdminViewProps {
  registrations: Registration[];
  onRefreshRegistrations: () => void;
}

export const RegistrationsAdminView: React.FC<RegistrationsAdminViewProps> = ({
  registrations,
  onRefreshRegistrations,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  
  // Selected review item
  const [reviewingReg, setReviewingReg] = useState<Registration | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  const filtered = registrations.filter((r) => {
    const matchesSearch =
      r.applicantName.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (newStatus: Registration['status']) => {
    if (!reviewingReg) return;
    setProcessing(true);
    try {
      await api.updateRegistrationStatus(reviewingReg.id, newStatus, reviewNotes);
      setReviewingReg(null);
      setReviewNotes('');
      onRefreshRegistrations();
    } catch (err: any) {
      alert(err.message || 'Failed to update registration status');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Citizen Services Desk
          </span>
          <h1 className="font-display text-2xl font-black text-gray-950 mt-1">
            Application Approvals & NOC Registry
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Review incoming public requests for Nikah NOCs, Madrasa enrolments, and official membership certificates.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tracking ID, applicant, or category..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'SUBMITTED', 'UNDER REVIEW', 'APPROVED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                statusFilter === st
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Registrations List */}
      <div className="rounded-3xl border border-gray-200/80 overflow-hidden bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">App ID</th>
                <th className="p-4">Category</th>
                <th className="p-4">Applicant</th>
                <th className="p-4">Submission Date</th>
                <th className="p-4">Current Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="p-4 font-mono font-bold text-emerald-800">
                    {r.id}
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-gray-900">{r.type}</span>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-gray-900">{r.applicantName}</div>
                    <div className="text-[10px] text-gray-500">{r.applicantPhone}</div>
                  </td>
                  <td className="p-4 font-mono text-gray-500">
                    {r.submittedAt.split('T')[0]}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase ${
                        r.status === 'APPROVED' || r.status === 'COMPLETED'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : r.status === 'REJECTED'
                          ? 'bg-red-50 text-red-800 border border-red-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => {
                        setReviewingReg(r);
                        setReviewNotes(r.reviewNotes || '');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-all"
                    >
                      Review & Issue
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review & Decision Modal */}
      {reviewingReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="font-mono text-xs font-bold text-emerald-800">
                  {reviewingReg.id}
                </span>
                <h3 className="font-display text-lg font-bold text-gray-950 mt-0.5">
                  Review: {reviewingReg.type} Application
                </h3>
              </div>
              <button
                onClick={() => setReviewingReg(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Applicant Details */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2 text-xs">
              <div>
                <span className="text-gray-500">Applicant Name: </span>
                <span className="font-bold text-gray-900">{reviewingReg.applicantName}</span>
              </div>
              <div>
                <span className="text-gray-500">Contact Number: </span>
                <span className="font-mono font-bold text-gray-900">{reviewingReg.applicantPhone}</span>
              </div>
              {reviewingReg.details && (
                <div className="pt-2 border-t border-gray-200 text-gray-700">
                  <span className="font-bold block text-[11px] text-gray-500 mb-1">Application Details:</span>
                  <div className="whitespace-pre-wrap">{JSON.stringify(reviewingReg.details, null, 2)}</div>
                </div>
              )}
            </div>

            {/* Decision Notes */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">
                Official Mahallu Review Remarks *
              </label>
              <textarea
                rows={3}
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Enter verification notes or certificate issuance details..."
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              ></textarea>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleUpdateStatus('REJECTED')}
                disabled={processing}
                className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject Application</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('UNDER REVIEW')}
                  disabled={processing}
                  className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold"
                >
                  Mark In Review
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdateStatus('APPROVED')}
                  disabled={processing}
                  className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Issue</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
