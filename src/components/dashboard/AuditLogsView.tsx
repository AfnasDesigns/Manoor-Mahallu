import React, { useState } from 'react';
import {
  History,
  ShieldCheck,
  Search,
  Clock,
  User,
  Activity
} from 'lucide-react';
import { AuditLog } from '../../types/index.ts';

interface AuditLogsViewProps {
  logs: AuditLog[];
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ logs }) => {
  const [search, setSearch] = useState('');

  const filtered = logs.filter((l) => {
    return (
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.userName.toLowerCase().includes(search.toLowerCase()) ||
      l.entity.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Compliance & Security
          </span>
          <h1 className="font-display text-2xl font-black text-gray-950 mt-1">
            System Audit Trail & Access Logs
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Immutable cryptographic activity trail of census updates, payment vouchers, status approvals, and administrative actions.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter audit logs by action, username, or record..."
          className="flex-1 text-xs focus:outline-none placeholder-gray-400 font-medium"
        />
      </div>

      {/* Logs Table */}
      <div className="rounded-3xl border border-gray-200/80 overflow-hidden bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">User & Role</th>
                <th className="p-4">Action</th>
                <th className="p-4">Entity</th>
                <th className="p-4">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-sans">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="p-4 font-mono text-[11px] text-gray-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="font-bold text-gray-900">{log.userName}</div>
                    <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 uppercase">
                      {log.role}
                    </span>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span className="font-mono text-xs font-semibold text-gray-800">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-gray-100 text-gray-700">
                      {log.entity}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600 text-xs">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
