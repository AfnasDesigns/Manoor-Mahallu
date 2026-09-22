import React, { useState } from 'react';
import {
  Users,
  Search,
  Droplet,
  Phone,
  Briefcase,
  Home,
  HeartHandshake
} from 'lucide-react';
import { Member } from '../../types/index.ts';

interface MembersViewProps {
  members: Member[];
}

export const MembersView: React.FC<MembersViewProps> = ({ members }) => {
  const [search, setSearch] = useState('');
  const [bloodFilter, setBloodFilter] = useState<string>('ALL');

  const bloodGroups = ['ALL', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  const filtered = members.filter((m) => {
    const matchesSearch =
      m.fullName.toLowerCase().includes(search.toLowerCase()) ||
      m.phone.toLowerCase().includes(search.toLowerCase()) ||
      m.houseName.toLowerCase().includes(search.toLowerCase()) ||
      m.id.toLowerCase().includes(search.toLowerCase());
    const matchesBlood =
      bloodFilter === 'ALL' || m.bloodGroup === bloodFilter;
    return matchesSearch && matchesBlood;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Citizen Census Directory
          </span>
          <h1 className="font-display text-2xl font-black text-gray-950 mt-1">
            Registered Members ({members.length})
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Individual member directory, contact numbers, blood donor directory, and household affiliations.
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
            placeholder="Search member, phone, or house name..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-gray-500 mr-1 flex items-center gap-1">
            <Droplet className="w-3.5 h-3.5 text-rose-600" />
            <span>Blood Group:</span>
          </span>
          {bloodGroups.map((bg) => (
            <button
              key={bg}
              onClick={() => setBloodFilter(bg)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all shrink-0 ${
                bloodFilter === bg
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {bg}
            </button>
          ))}
        </div>
      </div>

      {/* Members Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((mem) => (
          <div
            key={mem.id}
            className="p-5 rounded-3xl bg-white border border-gray-200/80 shadow-xs flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] font-bold text-gray-400">
                  {mem.id}
                </span>
                {mem.bloodGroup && (
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    Blood: {mem.bloodGroup}
                  </span>
                )}
              </div>

              <h3 className="font-display text-sm font-bold text-gray-950">
                {mem.fullName}
              </h3>

              <div className="space-y-1 text-xs text-gray-600 mt-2">
                <div className="flex items-center gap-1.5">
                  <Home className="w-3 h-3 text-gray-400" />
                  <span>{mem.houseName} ({mem.relationshipToHead})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-gray-400" />
                  <a href={`tel:${mem.phone}`} className="text-emerald-800 font-mono font-semibold hover:underline">
                    {mem.phone}
                  </a>
                </div>
                {mem.occupation && (
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Briefcase className="w-3 h-3 text-gray-400" />
                    <span>{mem.occupation}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
              <span>Born: {mem.dob}</span>
              <span className="font-semibold text-gray-600">{mem.gender}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
