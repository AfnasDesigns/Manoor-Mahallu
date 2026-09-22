import React, { useState } from 'react';
import {
  GraduationCap,
  Search,
  PlusCircle,
  Edit3,
  BookOpen,
  Calendar,
  CheckCircle2,
  Users,
  Star
} from 'lucide-react';
import { MadrasaStudent } from '../../types/index.ts';
import { api } from '../../lib/api.ts';

interface MadrasaViewProps {
  students: MadrasaStudent[];
  onRefreshStudents: () => void;
}

export const MadrasaView: React.FC<MadrasaViewProps> = ({
  students,
  onRefreshStudents,
}) => {
  const [selectedStandard, setSelectedStandard] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  // Marks Entry Modal
  const [editingStudent, setEditingStudent] = useState<MadrasaStudent | null>(null);
  const [examName, setExamName] = useState('Annual Exam 2026');
  const [quranMarks, setQuranMarks] = useState<number>(90);
  const [tajweedMarks, setTajweedMarks] = useState<number>(85);
  const [fiqhMarks, setFiqhMarks] = useState<number>(88);
  const [aqeedahMarks, setAqeedahMarks] = useState<number>(92);
  const [savingMarks, setSavingMarks] = useState(false);

  // New Student Admission Modal
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStandard, setNewStandard] = useState('Class 5');
  const [newDivision, setNewDivision] = useState('A');
  const [newGuardianName, setNewGuardianName] = useState('');
  const [newGuardianPhone, setNewGuardianPhone] = useState('');
  const [newHouseName, setNewHouseName] = useState('');
  const [enrolling, setEnrolling] = useState(false);

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(search.toLowerCase()) ||
      s.guardianName.toLowerCase().includes(search.toLowerCase());
    const matchesStd =
      selectedStandard === 'ALL' || s.standard.toLowerCase() === selectedStandard.toLowerCase();
    return matchesSearch && matchesStd;
  });

  const standards = ['ALL', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];

  const handleOpenMarksModal = async (stu: MadrasaStudent) => {
    setEditingStudent(stu);
    try {
      const marksList = await api.getStudentMarks(stu.id);
      if (marksList && marksList.length > 0) {
        const existing = marksList[0];
        setExamName(existing.exam);
        setQuranMarks(existing.subjects?.quran || 85);
        setTajweedMarks(existing.subjects?.tajweed || 85);
        setFiqhMarks(existing.subjects?.fiqh || 85);
        setAqeedahMarks(existing.subjects?.aqeedah || 85);
      } else {
        setQuranMarks(85);
        setTajweedMarks(85);
        setFiqhMarks(85);
        setAqeedahMarks(85);
      }
    } catch {
      setQuranMarks(85);
      setTajweedMarks(85);
      setFiqhMarks(85);
      setAqeedahMarks(85);
    }
  };

  const handleSaveMarks = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    setSavingMarks(true);
    try {
      const total = Math.round(Number(quranMarks) + Number(tajweedMarks) + Number(fiqhMarks) + Number(aqeedahMarks));
      const pct = Math.round(total / 4);
      const grade = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 65 ? 'B' : 'C';

      await api.recordMarks({
        studentId: editingStudent.id,
        studentName: editingStudent.name,
        standard: editingStudent.standard,
        exam: examName,
        subjects: {
          quran: Number(quranMarks),
          tajweed: Number(tajweedMarks),
          fiqh: Number(fiqhMarks),
          aqeedah: Number(aqeedahMarks),
          hadith: 85,
          akhlaq: 90,
          arabic: 85,
        },
        totalMarks: total,
        percentage: pct,
        grade,
        rank: 1,
        remarks: 'Annual Exam Assessment',
      });
      setEditingStudent(null);
      onRefreshStudents();
    } catch (err: any) {
      alert(err.message || 'Failed to save marks');
    } finally {
      setSavingMarks(false);
    }
  };

  const handleEnrollStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName || !newGuardianName || !newGuardianPhone) {
      alert('Please fill student name and guardian contact details.');
      return;
    }

    setEnrolling(true);
    try {
      await api.admitStudent({
        name: newStudentName,
        standard: newStandard,
        division: newDivision,
        guardianName: newGuardianName,
        guardianPhone: newGuardianPhone,
        dob: '2015-05-10',
      });
      setShowEnrollModal(false);
      setNewStudentName('');
      setNewGuardianName('');
      setNewGuardianPhone('');
      onRefreshStudents();
    } catch (err: any) {
      alert(err.message || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Islamic Education Portal
          </span>
          <h1 className="font-display text-2xl font-black text-gray-950 mt-1">
            Madrasa Darul Uloom ({students.length} Students)
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Student roster, examination grade cards, and academic records.
          </p>
        </div>

        <button
          onClick={() => setShowEnrollModal(true)}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Admission</span>
        </button>
      </div>

      {/* Search and Class Filter Strip */}
      <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student, admission #, or parent..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {standards.map((std) => (
            <button
              key={std}
              onClick={() => setSelectedStandard(std)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedStandard === std
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {std}
            </button>
          ))}
        </div>
      </div>

      {/* Students Table */}
      <div className="rounded-3xl border border-gray-200/80 overflow-hidden bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Adm #</th>
                <th className="p-4">Student Name</th>
                <th className="p-4">Class</th>
                <th className="p-4">Guardian Details</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.map((stu) => (
                <tr key={stu.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="p-4 font-mono font-bold text-emerald-800">
                    {stu.admissionNo}
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-gray-900">{stu.name}</div>
                    <div className="text-[10px] text-gray-500 font-mono">ID: {stu.id}</div>
                  </td>
                  <td className="p-4 font-semibold text-gray-800">
                    {stu.standard} - Div {stu.division}
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-gray-900">{stu.guardianName}</div>
                    <div className="text-[10px] text-gray-500">{stu.guardianPhone}</div>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleOpenMarksModal(stu)}
                      className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-emerald-50 hover:text-emerald-800 text-gray-700 font-bold text-xs inline-flex items-center gap-1 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Enter Marks</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enter Marks Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  Examination Assessment
                </span>
                <h3 className="font-display text-lg font-bold text-gray-950 mt-1">
                  Grade Entry: {editingStudent.name}
                </h3>
                <div className="text-xs text-gray-500">{editingStudent.standard} - {editingStudent.admissionNo}</div>
              </div>
              <button
                onClick={() => setEditingStudent(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMarks} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Examination Title</label>
                <input
                  type="text"
                  required
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Quran Recitation (100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={quranMarks}
                    onChange={(e) => setQuranMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Tajweed Rules (100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={tajweedMarks}
                    onChange={(e) => setTajweedMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Fiqh & Shariah (100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={fiqhMarks}
                    onChange={(e) => setFiqhMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Aqeedah & Tawheed (100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={aqeedahMarks}
                    onChange={(e) => setAqeedahMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-900">Computed Average:</span>
                <span className="font-mono font-bold text-emerald-950 text-sm">
                  {Math.round((Number(quranMarks) + Number(tajweedMarks) + Number(fiqhMarks) + Number(aqeedahMarks)) / 4)}%
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingMarks}
                  className="px-5 py-2 rounded-xl bg-emerald-800 text-white font-bold"
                >
                  {savingMarks ? 'Saving...' : 'Save Assessment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enroll Student Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-display text-lg font-bold text-gray-950">
                New Madrasa Student Admission
              </h3>
              <button
                onClick={() => setShowEnrollModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEnrollStudent} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="e.g. Mohammed Rayan"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Class</label>
                  <select
                    value={newStandard}
                    onChange={(e) => setNewStandard(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                  >
                    {standards.filter(s => s !== 'ALL').map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Division</label>
                  <select
                    value={newDivision}
                    onChange={(e) => setNewDivision(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                  >
                    <option value="A">Division A</option>
                    <option value="B">Division B</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Guardian / Father Name *</label>
                <input
                  type="text"
                  required
                  value={newGuardianName}
                  onChange={(e) => setNewGuardianName(e.target.value)}
                  placeholder="Guardian's name"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Guardian Mobile Phone *</label>
                <input
                  type="tel"
                  required
                  value={newGuardianPhone}
                  onChange={(e) => setNewGuardianPhone(e.target.value)}
                  placeholder="+91 94470 00000"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEnrollModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={enrolling}
                  className="px-5 py-2 rounded-xl bg-emerald-800 text-white font-bold"
                >
                  {enrolling ? 'Enrolling...' : 'Confirm Admission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
