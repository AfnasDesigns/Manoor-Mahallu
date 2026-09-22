import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  UserCheck,
  Plus,
  Edit2,
  Trash2,
  Search,
  Sparkles,
  Users,
  CheckCircle2,
  X,
  AlertCircle,
  Eye,
  Globe
} from 'lucide-react';
import { Programme } from '../../types/index.ts';
import { api } from '../../lib/api.ts';

interface ProgrammesAdminViewProps {
  programmes: Programme[];
  onRefreshProgrammes: () => void;
}

export const ProgrammesAdminView: React.FC<ProgrammesAdminViewProps> = ({
  programmes,
  onRefreshProgrammes,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProg, setEditingProg] = useState<Programme | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [englishTitle, setEnglishTitle] = useState('');
  const [malayalamTitle, setMalayalamTitle] = useState('');
  const [category, setCategory] = useState<Programme['category']>('RELIGIOUS');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('07:30 PM');
  const [venue, setVenue] = useState('Manoor Juma Masjid Main Hall');
  const [speaker, setSpeaker] = useState('');
  const [organizer, setOrganizer] = useState('Manoor Mahall Committee');
  const [description, setDescription] = useState('');
  const [registrationRequired, setRegistrationRequired] = useState(false);

  const resetForm = () => {
    setEditingProg(null);
    setEnglishTitle('');
    setMalayalamTitle('');
    setCategory('RELIGIOUS');
    setDate(new Date().toISOString().split('T')[0]);
    setTime('07:30 PM');
    setVenue('Manoor Juma Masjid Main Hall');
    setSpeaker('');
    setOrganizer('Manoor Mahall Committee');
    setDescription('');
    setRegistrationRequired(false);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prog: Programme) => {
    setEditingProg(prog);
    setEnglishTitle(prog.englishTitle || prog.title || '');
    setMalayalamTitle(prog.malayalamTitle || '');
    setCategory(prog.category);
    setDate(prog.date);
    setTime(prog.time);
    setVenue(prog.venue);
    setSpeaker(prog.speaker || '');
    setOrganizer(prog.organizer);
    setDescription(prog.description);
    setRegistrationRequired(prog.registrationRequired);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!englishTitle || !date || !time || !venue) {
      alert('Please fill in title, date, time, and venue.');
      return;
    }

    setSaving(true);
    try {
      if (editingProg) {
        // Update existing event
        await api.updateProgramme(editingProg.id, {
          title: englishTitle,
          englishTitle,
          malayalamTitle,
          category,
          date,
          time,
          venue,
          speaker,
          organizer,
          description,
          registrationRequired,
        });
      } else {
        // Create new event
        await api.createProgramme({
          title: englishTitle,
          englishTitle,
          malayalamTitle,
          category,
          date,
          time,
          venue,
          speaker,
          organizer,
          description,
          status: 'UPCOMING',
          registrationRequired,
        });
      }
      setIsModalOpen(false);
      resetForm();
      onRefreshProgrammes();
    } catch (err: any) {
      alert(err.message || 'Failed to save programme');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to remove the event "${title}"? This change will immediately be visible to all members.`)) {
      return;
    }
    setDeletingId(id);
    try {
      await api.deleteProgramme(id);
      onRefreshProgrammes();
    } catch (err: any) {
      alert(err.message || 'Failed to delete event');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProgrammes = programmes.filter((p) => {
    const matchesSearch =
      (p.englishTitle || p.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.malayalamTitle || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.speaker || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.venue || '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
            ADMIN OS • EVENTS & DA'WAH CONTROL
          </span>
          <h1 className="font-display text-2xl font-black text-gray-950 mt-1">
            Dates, Programs, Events & Da'wah Sessions
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Create, update, and manage community gatherings, spiritual classes, and youth events. All changes are instantly synced to members.
          </p>
        </div>

        {/* Big Add Event Button */}
        <button
          id="btn-add-programme"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Event / Da'wah Session</span>
        </button>
      </div>

      {/* Member Sync Banner */}
      <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-blue-900">
          <Globe className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong className="font-bold">Real-time Member Synchronization:</strong> Any event added or edited here is published immediately to the public portal and visible to all registered members.
          </span>
        </div>
        <span className="hidden sm:inline-block font-mono text-[11px] font-semibold text-blue-700 bg-white px-2.5 py-0.5 rounded-lg border border-blue-200 shrink-0">
          {programmes.length} Events Total
        </span>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, scholar, or venue..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 text-xs">
          {['ALL', 'RELIGIOUS', 'MADRASA', 'YOUTH', 'COMMUNITY', 'MEETING'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat === 'ALL' ? 'All Types' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Table / Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProgrammes.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white rounded-3xl border border-gray-200">
            <Calendar className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 text-sm">No events found</h3>
            <p className="text-xs text-gray-500 mt-1">
              Click the button above to add your first event or Da'wah session.
            </p>
          </div>
        ) : (
          filteredProgrammes.map((prog) => {
            const isToday = prog.date === new Date().toISOString().split('T')[0];

            return (
              <div
                key={prog.id}
                className="bg-white rounded-2xl border border-gray-200/90 hover:border-blue-300 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div>
                  {/* Category & Status */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                      {prog.category}
                    </span>
                    {isToday ? (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        Today
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-gray-500">
                        {prog.status}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-bold text-base text-gray-950 group-hover:text-blue-600 transition-colors leading-snug">
                    {prog.englishTitle || prog.title}
                  </h3>
                  {prog.malayalamTitle && (
                    <div className="font-malayalam text-xs text-gray-500 mt-0.5">
                      {prog.malayalamTitle}
                    </div>
                  )}

                  {/* Date, Time, Venue, Speaker */}
                  <div className="mt-3 space-y-1.5 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{new Date(prog.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{prog.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">{prog.venue}</span>
                    </div>
                    {prog.speaker && (
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span className="truncate font-semibold text-gray-900">{prog.speaker}</span>
                      </div>
                    )}
                  </div>

                  {/* Registration count */}
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-gray-500">Registered Attendees:</span>
                    <span className="font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-full">
                      {prog.registeredCount} members
                    </span>
                  </div>
                </div>

                {/* Action Buttons for Admin */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(prog)}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-gray-100 hover:bg-blue-50 hover:text-blue-700 text-gray-700 text-xs font-bold border border-gray-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Event</span>
                  </button>
                  <button
                    onClick={() => handleDelete(prog.id, prog.englishTitle || prog.title || '')}
                    disabled={deletingId === prog.id}
                    className="py-1.5 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold border border-red-200 transition-colors flex items-center justify-center"
                    title="Delete event"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 my-8 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  {editingProg ? 'Edit Event' : 'New Program'}
                </span>
                <h3 className="font-display text-lg font-black text-gray-950 mt-1">
                  {editingProg ? 'Update Event & Da\'wah Details' : 'Add Dates, Program or Da\'wah Session'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Program Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={englishTitle}
                  onChange={(e) => setEnglishTitle(e.target.value)}
                  placeholder="e.g. Weekly Quran Tafseer & Da'wah Halqa"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Malayalam Title (Optional)
                </label>
                <input
                  type="text"
                  value={malayalamTitle}
                  onChange={(e) => setMalayalamTitle(e.target.value)}
                  placeholder="e.g. പ്രതിവാര തഫ്സീർ ക്ലാസ്"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none font-malayalam"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  >
                    <option value="RELIGIOUS">Religious / Da'wah Session</option>
                    <option value="MADRASA">Madrasa Program</option>
                    <option value="YOUTH">Youth Workshop</option>
                    <option value="COMMUNITY">Community Gathering</option>
                    <option value="MEETING">Mahallu Committee Meeting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Time *
                  </label>
                  <input
                    type="text"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. After Maghrib (07:15 PM)"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Venue *
                  </label>
                  <input
                    type="text"
                    required
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="e.g. Manoor Juma Masjid Main Hall"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Scholar / Speaker (Usthad)
                  </label>
                  <input
                    type="text"
                    value={speaker}
                    onChange={(e) => setSpeaker(e.target.value)}
                    placeholder="e.g. Usthad Zainul Abid Saquafi"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Organizer
                  </label>
                  <input
                    type="text"
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                    placeholder="e.g. Manoor Mahall Da'wah Wing"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Brief Description & Objectives
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Key topics to be covered, benefits for members, or instructions..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="regReq"
                  checked={registrationRequired}
                  onChange={(e) => setRegistrationRequired(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="regReq" className="text-xs text-gray-700 select-none">
                  Enable Member RSVP / Online Seat Registration
                </label>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
                >
                  {saving ? 'Publishing Changes...' : editingProg ? 'Save Changes' : 'Publish Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
