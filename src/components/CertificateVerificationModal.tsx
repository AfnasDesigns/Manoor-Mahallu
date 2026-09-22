import React, { useState } from 'react';
import {
  FileCheck,
  Search,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Printer,
  Calendar,
  User,
  Home
} from 'lucide-react';
import { api } from '../lib/api.ts';

interface CertificateVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateVerificationModal: React.FC<CertificateVerificationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [certQuery, setCertQuery] = useState('MH-CERT-2026-089');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certQuery.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await api.verifyCertificate(certQuery.trim());
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Certificate record not found. Please double-check the certificate number.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Official Document Registry
            </span>
            <h2 className="font-display text-2xl font-black text-gray-950 mt-1">
              Verify Mahallu Certificate
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold"
          >
            ✕
          </button>
        </div>

        {/* Search input */}
        <form onSubmit={handleVerify} className="space-y-3">
          <label className="block text-xs font-bold text-gray-700">
            Certificate Number or Security Verification Hash
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              required
              value={certQuery}
              onChange={(e) => setCertQuery(e.target.value)}
              placeholder="e.g. MH-CERT-2026-089"
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-900/10 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'Searching...' : 'Verify Now'}</span>
            </button>
          </div>
        </form>

        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Certificate Display Card */}
        {result && (
          <div className="p-6 sm:p-8 rounded-3xl bg-emerald-50/40 border-2 border-emerald-600/40 relative overflow-hidden space-y-6 shadow-md print:border-black print:m-0 print:p-8">
            
            {/* Watermark Logo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-900/5 font-serif font-black text-9xl pointer-events-none select-none">
              M
            </div>

            {/* Official Header */}
            <div className="text-center space-y-1 pb-4 border-b border-emerald-200/80">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px] uppercase tracking-widest border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                Officially Verified Document
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-black text-gray-950 tracking-tight pt-1">
                MANOOR MAHALL ISLAMIC COMMITTEE
              </h3>
              <p className="text-[11px] text-gray-600">
                Registered under Kerala State Wakf Board & Samastha Mahallu Federation
              </p>
              <div className="font-mono text-xs font-bold text-emerald-900 pt-1">
                {result.certificateNumber}
              </div>
            </div>

            {/* Certificate Body */}
            <div className="space-y-4 text-xs leading-relaxed text-gray-800">
              <div className="text-center font-serif text-lg font-bold text-gray-950 uppercase tracking-wide">
                Certificate of {result.type}
              </div>

              <p className="text-justify leading-loose">
                This is to officially certify that <span className="font-bold underline decoration-emerald-600 decoration-2">{result.recipientName}</span> residing at <span className="font-bold">{result.houseName}</span>, Manoor Mahall jurisdiction, is a bona fide registered member in good standing under the official census records of this Mahallu.
              </p>

              <div className="grid grid-cols-2 gap-4 py-3 border-y border-emerald-200/60 text-xs">
                <div>
                  <span className="text-gray-500 block text-[10px]">Purpose of Issuance:</span>
                  <span className="font-semibold text-gray-900">{result.purpose}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">Date of Issue:</span>
                  <span className="font-mono font-semibold text-gray-900">{result.issueDate}</span>
                </div>
              </div>

              {/* Signatures */}
              <div className="pt-6 flex items-end justify-between">
                <div className="text-center">
                  <div className="w-20 h-10 border-b border-gray-400 mx-auto mb-1"></div>
                  <div className="text-[10px] font-bold text-gray-700">Official Seal</div>
                  <div className="text-[9px] text-emerald-800">Manoor Mahall</div>
                </div>

                <div className="text-right">
                  <div className="font-serif italic text-emerald-950 font-bold text-sm">
                    {result.authorizedSignatory}
                  </div>
                  <div className="text-[10px] font-bold text-gray-700">
                    Authorized Signatory
                  </div>
                  <div className="text-[9px] text-gray-500">
                    Manoor Mahall Secretariat
                  </div>
                </div>
              </div>

            </div>

            {/* Print Action */}
            <div className="pt-4 border-t border-emerald-200/80 flex items-center justify-between print:hidden">
              <span className="text-[11px] text-emerald-800 font-semibold">
                Tamper-evident verification hash confirmed in ledger.
              </span>
              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Copy</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
