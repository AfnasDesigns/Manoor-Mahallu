import React, { useState } from 'react';
import {
  Home,
  Users,
  Search,
  PlusCircle,
  Filter,
  Phone,
  Calendar,
  CreditCard,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  GraduationCap
} from 'lucide-react';
import { Family, Member, Payment, MadrasaStudent } from '../../types/index.ts';
import { api } from '../../lib/api.ts';

interface FamiliesViewProps {
  families: Family[];
  onSelectReceipt: (p: Payment) => void;
  onRefreshFamilies: () => void;
}

export const FamiliesView: React.FC<FamiliesViewProps> = ({
  families,
  onSelectReceipt,
  onRefreshFamilies,
}) => {
  const [search, setSearch] = useState('');
  const [selectedWard, setSelectedWard] = useState<string>('ALL');
  
  // Selected Family Drawer/Modal
  const [selectedFamilyId, setSelectedFamilyId] = useState<string | null>(null);
  const [familyDetails, setFamilyDetails] = useState<any | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Add Family Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHeadName, setNewHeadName] = useState('');
  const [newHouseName, setNewHouseName] = useState('');
  const [newHouseNo, setNewHouseNo] = useState('');
  const [newWard, setNewWard] = useState('Ward 4 - Juma Masjid Road');
  const [newPhone, setNewPhone] = useState('');
  const [newEconomicStatus, setNewEconomicStatus] = useState<'A' | 'B' | 'C' | 'D'>('B');
  const [addingFamily, setAddingFamily] = useState(false);

  // Add Member to Family Modal
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [memFullName, setMemFullName] = useState('');
  const [memRelation, setMemRelation] = useState<'HEAD' | 'SPOUSE' | 'SON' | 'DAUGHTER' | 'PARENT' | 'OTHER'>('SON');
  const [memGender, setMemGender] = useState<'MALE' | 'FEMALE'>('MALE');
  const [memDob, setMemDob] = useState('2000-01-01');
  const [memPhone, setMemPhone] = useState('');
  const [memBlood, setMemBlood] = useState('O+');
  const [memOccupation, setMemOccupation] = useState('');
  const [addingMember, setAddingMember] = useState(false);

  const filteredFamilies = families.filter((f) => {
    const matchesSearch =
      f.houseName.toLowerCase().includes(search.toLowerCase()) ||
      f.headName.toLowerCase().includes(search.toLowerCase()) ||
      f.id.toLowerCase().includes(search.toLowerCase()) ||
      f.houseNumber.toLowerCase().includes(search.toLowerCase());
    const matchesWard = selectedWard === 'ALL' || f.ward.includes(selectedWard);
    return matchesSearch && matchesWard;
  });

  const handleOpenFamily = async (famId: string) => {
    setSelectedFamilyId(famId);
    setLoadingDetails(true);
    try {
      const data = await api.getFamilyById(famId);
      setFamilyDetails(data);
    } catch (err: any) {
      alert(err.message || 'Failed to load family record');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCreateFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHeadName || !newHouseName || !newPhone) {
      alert('Please fill in head name, house name and phone.');
      return;
    }

    setAddingFamily(true);
    try {
      await api.createFamily({
        headName: newHeadName,
        houseName: newHouseName,
        houseNumber: newHouseNo,
        ward: newWard,
        phone: newPhone,
      });
      setShowAddModal(false);
      setNewHeadName('');
      setNewHouseName('');
      setNewHouseNo('');
      setNewPhone('');
      onRefreshFamilies();
    } catch (err: any) {
      alert(err.message || 'Failed to create family');
    } finally {
      setAddingFamily(false);
    }
  };

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFamilyId || !memFullName) return;

    setAddingMember(true);
    try {
      await api.addMemberToFamily(selectedFamilyId, {
        familyId: selectedFamilyId,
        fullName: memFullName,
        relationshipToHead: memRelation,
        gender: memGender,
        dob: memDob,
        phone: memPhone,
        bloodGroup: memBlood,
        occupation: memOccupation,
      });
      setShowAddMemberModal(false);
      setMemFullName('');
      setMemPhone('');
      // refresh details
      handleOpenFamily(selectedFamilyId);
      onRefreshFamilies();
    } catch (err: any) {
      alert(err.message || 'Failed to add family member');
    } finally {
      setAddingMember(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Census & Population Ledger
          </span>
          <h1 className="font-display text-2xl font-black text-gray-950 mt-1">
            Registered Families ({families.length})
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Complete household records, member rosters, and balance statuses across 4 wards.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register New Family</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search house name, head name, or ID..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'Ward 1', 'Ward 2', 'Ward 3', 'Ward 4'].map((w) => (
            <button
              key={w}
              onClick={() => setSelectedWard(w)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedWard === w
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* Families List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFamilies.map((fam) => (
          <div
            key={fam.id}
            onClick={() => handleOpenFamily(fam.id)}
            className="p-5 rounded-3xl bg-white border border-gray-200/80 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {fam.id}
                </span>
                <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  {fam.ward}
                </span>
              </div>

              <h3 className="font-display text-base font-bold text-gray-900 group-hover:text-emerald-950">
                {fam.houseName}
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                Head: <span className="font-semibold text-gray-900">{fam.headName}</span>
              </p>
              <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-gray-400" />
                <span>{fam.phone}</span>
                <span className="text-gray-300">•</span>
                <span>House #{fam.houseNumber}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-gray-600">
                <Users className="w-3.5 h-3.5 text-gray-400" />
                <span>{fam.memberCount} members</span>
              </div>

              <div className="text-right">
                {fam.pendingBalance > 0 ? (
                  <span className="font-mono font-bold text-red-600">
                    Due: ₹{fam.pendingBalance.toLocaleString('en-IN')}
                  </span>
                ) : (
                  <span className="font-mono font-bold text-emerald-700">
                    No Dues
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comprehensive Family Details Drawer / Modal */}
      {selectedFamilyId && familyDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {familyDetails.id}
                  </span>
                  <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    {familyDetails.ward}
                  </span>
                </div>
                <h2 className="font-display text-2xl font-black text-gray-950 mt-1">
                  {familyDetails.houseName}
                </h2>
                <div className="text-xs text-gray-600 mt-0.5">
                  Head of House: <span className="font-bold text-gray-900">{familyDetails.headName}</span> • Phone: {familyDetails.phone}
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedFamilyId(null);
                  setFamilyDetails(null);
                }}
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Financial Summary Strip */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold text-gray-500">
                  Current Mahallu Account Status
                </div>
                <div className="font-mono text-lg font-black mt-0.5">
                  {familyDetails.pendingBalance > 0 ? (
                    <span className="text-red-700">₹{familyDetails.pendingBalance.toLocaleString('en-IN')} Pending</span>
                  ) : (
                    <span className="text-emerald-700">All Subscriptions Paid (Clear)</span>
                  )}
                </div>
              </div>

              <div className="text-right text-xs">
                <span className="text-gray-500">Economic Category: </span>
                <span className="font-bold px-2 py-0.5 rounded bg-white border border-gray-200">
                  Category {familyDetails.economicStatus || 'B'}
                </span>
              </div>
            </div>

            {/* Family Members Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-700" />
                  <span>Enrolled Members ({familyDetails.members?.length || 0})</span>
                </h3>
                <button
                  onClick={() => setShowAddMemberModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1 shadow-xs"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add Member</span>
                </button>
              </div>

              <div className="divide-y divide-gray-100 rounded-2xl border border-gray-200 overflow-hidden bg-white">
                {familyDetails.members?.map((mem: Member) => (
                  <div key={mem.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-gray-50">
                    <div>
                      <div className="font-bold text-gray-900">
                        {mem.fullName}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">
                        {mem.relationshipToHead} • {mem.gender} • Born {mem.dob} {mem.occupation ? `• ${mem.occupation}` : ''}
                      </div>
                    </div>

                    <div className="text-right">
                      {mem.bloodGroup && (
                        <span className="font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[10px]">
                          {mem.bloodGroup}
                        </span>
                      )}
                      <div className="text-[10px] text-gray-400 font-mono mt-0.5">{mem.id}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Madrasa Enrolled Children */}
            {familyDetails.madrasaStudents?.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-display text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-amber-700" />
                  <span>Madrasa Darul Uloom Students</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {familyDetails.madrasaStudents.map((stu: MadrasaStudent) => (
                    <div key={stu.id} className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200 text-xs">
                      <div className="font-bold text-gray-950">{stu.name}</div>
                      <div className="text-gray-600 text-[11px] mt-0.5">
                        {stu.standard} - Div {stu.division} • Adm #{stu.admissionNo}
                      </div>
                      <div className="mt-2 text-[10px] text-amber-900 font-semibold">
                        Fee Status: {stu.feeStatus}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payment History */}
            <div className="space-y-3">
              <h3 className="font-display text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-emerald-700" />
                <span>Treasury Payment Receipts</span>
              </h3>

              <div className="space-y-2">
                {familyDetails.payments?.map((pay: Payment) => (
                  <div
                    key={pay.id}
                    onClick={() => onSelectReceipt(pay)}
                    className="p-3 rounded-2xl bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-200 cursor-pointer flex items-center justify-between text-xs transition-colors"
                  >
                    <div>
                      <div className="font-bold text-gray-900">
                        {pay.receiptNumber} - {pay.category}
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        Paid on {pay.date} via {pay.paymentMethod}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-bold text-emerald-900">
                        ₹{pay.amount.toLocaleString('en-IN')}
                      </div>
                      <span className="text-[9px] font-bold text-emerald-800 underline">
                        View Receipt
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Add New Family Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-display text-xl font-bold text-gray-950">
                Register New Mahallu Household
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateFamily} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Head of Family *</label>
                <input
                  type="text"
                  required
                  value={newHeadName}
                  onChange={(e) => setNewHeadName(e.target.value)}
                  placeholder="e.g. K. Abdul Majeed"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">House Name *</label>
                  <input
                    type="text"
                    required
                    value={newHouseName}
                    onChange={(e) => setNewHouseName(e.target.value)}
                    placeholder="e.g. Rose Villa"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">House Number</label>
                  <input
                    type="text"
                    value={newHouseNo}
                    onChange={(e) => setNewHouseNo(e.target.value)}
                    placeholder="14/235"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Ward</label>
                  <select
                    value={newWard}
                    onChange={(e) => setNewWard(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                  >
                    <option value="Ward 1 - School Road">Ward 1 - School Road</option>
                    <option value="Ward 2 - Market Road">Ward 2 - Market Road</option>
                    <option value="Ward 3 - River View">Ward 3 - River View</option>
                    <option value="Ward 4 - Juma Masjid Road">Ward 4 - Juma Masjid Road</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+91 94470 00000"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Economic Category</label>
                <select
                  value={newEconomicStatus}
                  onChange={(e) => setNewEconomicStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                >
                  <option value="A">Category A - Highly Affluent / Patron</option>
                  <option value="B">Category B - Standard Household</option>
                  <option value="C">Category C - Subsidy Eligible</option>
                  <option value="D">Category D - Full Welfare / Zakat Beneficiary</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingFamily}
                  className="px-6 py-2 rounded-xl bg-emerald-800 text-white font-bold"
                >
                  {addingFamily ? 'Saving...' : 'Add Family Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Member to Family Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-display text-lg font-bold text-gray-950">
                Add Member to {familyDetails?.houseName}
              </h3>
              <button
                onClick={() => setShowAddMemberModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMember} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={memFullName}
                  onChange={(e) => setMemFullName(e.target.value)}
                  placeholder="Full name"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Relation to Head</label>
                  <select
                    value={memRelation}
                    onChange={(e) => setMemRelation(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                  >
                    <option value="SPOUSE">Spouse</option>
                    <option value="SON">Son</option>
                    <option value="DAUGHTER">Daughter</option>
                    <option value="PARENT">Parent</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Gender</label>
                  <select
                    value={memGender}
                    onChange={(e) => setMemGender(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={memDob}
                    onChange={(e) => setMemDob(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Blood Group</label>
                  <select
                    value={memBlood}
                    onChange={(e) => setMemBlood(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Occupation</label>
                <input
                  type="text"
                  value={memOccupation}
                  onChange={(e) => setMemOccupation(e.target.value)}
                  placeholder="e.g. Teacher, Engineer, Business"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingMember}
                  className="px-5 py-2 rounded-xl bg-emerald-800 text-white font-bold"
                >
                  {addingMember ? 'Saving...' : 'Save Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
