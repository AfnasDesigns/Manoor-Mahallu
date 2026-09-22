import React, { useState, useEffect } from 'react';
import {
  Search,
  Users,
  Home,
  GraduationCap,
  CreditCard,
  FileText,
  ArrowRight,
  X
} from 'lucide-react';
import { api } from '../lib/api.ts';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFamily: (id: string) => void;
  onSelectReceipt: (payment: any) => void;
  onSelectRegistration: (reg: any) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectFamily,
  onSelectReceipt,
  onSelectRegistration,
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    families: any[];
    members: any[];
    students: any[];
    payments: any[];
    registrations: any[];
  }>({
    families: [],
    members: [],
    students: [],
    payments: [],
    registrations: [],
  });

  useEffect(() => {
    if (!query.trim()) {
      setResults({ families: [], members: [], students: [], payments: [], registrations: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await api.search(query.trim());
        setResults(data);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const totalResults =
    results.families.length +
    results.members.length +
    results.students.length +
    results.payments.length +
    results.registrations.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-20 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Search Bar Input */}
        <div className="p-4 border-b border-gray-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search families, members, students, receipts, or registrations..."
            className="flex-1 text-sm font-medium focus:outline-none placeholder-gray-400"
          />
          {loading && <span className="text-xs text-gray-400 animate-pulse">Searching...</span>}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold"
          >
            ✕
          </button>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {query.trim() === '' ? (
            <div className="py-12 text-center text-xs text-gray-400">
              Type family name, member phone, student admission number, or receipt ID...
            </div>
          ) : totalResults === 0 && !loading ? (
            <div className="py-12 text-center text-xs text-gray-400">
              No matching records found for "{query}".
            </div>
          ) : (
            <div className="space-y-5">
              
              {/* Families */}
              {results.families.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Families ({results.families.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.families.map((fam) => (
                      <div
                        key={fam.id}
                        onClick={() => {
                          onSelectFamily(fam.id);
                          onClose();
                        }}
                        className="p-3 rounded-2xl bg-gray-50 hover:bg-emerald-50 border border-gray-100 hover:border-emerald-200 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="font-bold text-xs text-gray-900">
                            {fam.houseName} <span className="font-mono text-gray-500 font-normal">({fam.id})</span>
                          </div>
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            Head: {fam.headName} • {fam.ward}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Members */}
              {results.members.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-700" />
                    <span>Members ({results.members.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.members.map((mem) => (
                      <div
                        key={mem.id}
                        onClick={() => {
                          if (mem.familyId) onSelectFamily(mem.familyId);
                          onClose();
                        }}
                        className="p-3 rounded-2xl bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="font-bold text-xs text-gray-900">
                            {mem.fullName} <span className="font-mono text-gray-500 font-normal">({mem.id})</span>
                          </div>
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            {mem.houseName} • {mem.phone} {mem.bloodGroup ? `• Blood: ${mem.bloodGroup}` : ''}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Madrasa Students */}
              {results.students.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-amber-700" />
                    <span>Madrasa Students ({results.students.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.students.map((stu) => (
                      <div
                        key={stu.id}
                        onClick={() => {
                          if (stu.familyId) onSelectFamily(stu.familyId);
                          onClose();
                        }}
                        className="p-3 rounded-2xl bg-gray-50 hover:bg-amber-50 border border-gray-100 hover:border-amber-200 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="font-bold text-xs text-gray-900">
                            {stu.name} <span className="font-mono text-gray-500 font-normal">({stu.admissionNo})</span>
                          </div>
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            {stu.standard}-{stu.division} • Guardian: {stu.guardianName} ({stu.guardianPhone})
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payments */}
              {results.payments.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Treasury Receipts ({results.payments.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.payments.map((pay) => (
                      <div
                        key={pay.id}
                        onClick={() => {
                          onSelectReceipt(pay);
                          onClose();
                        }}
                        className="p-3 rounded-2xl bg-gray-50 hover:bg-emerald-50 border border-gray-100 hover:border-emerald-200 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="font-bold text-xs text-gray-900">
                            {pay.receiptNumber} - ₹{pay.amount.toLocaleString('en-IN')}
                          </div>
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            {pay.category} • {pay.memberName} ({pay.houseName}) • {pay.date}
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          View Receipt
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Registrations */}
              {results.registrations.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-purple-700" />
                    <span>Registrations ({results.registrations.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.registrations.map((reg) => (
                      <div
                        key={reg.id}
                        onClick={() => {
                          onSelectRegistration(reg);
                          onClose();
                        }}
                        className="p-3 rounded-2xl bg-gray-50 hover:bg-purple-50 border border-gray-100 hover:border-purple-200 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="font-bold text-xs text-gray-900">
                            {reg.type} <span className="font-mono text-gray-500 font-normal">({reg.id})</span>
                          </div>
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            {reg.applicantName} • Status: {reg.status}
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                          View
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
