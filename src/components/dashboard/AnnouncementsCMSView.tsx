import React, { useState } from 'react';
import {
  Bell,
  Sparkles,
  PlusCircle,
  Pin,
  Trash2,
  Calendar,
  Send,
  CheckCircle2,
  AlertCircle,
  Wand2
} from 'lucide-react';
import { Announcement } from '../../types/index.ts';
import { api } from '../../lib/api.ts';

interface AnnouncementsCMSViewProps {
  announcements: Announcement[];
  onRefreshAnnouncements: () => void;
}

export const AnnouncementsCMSView: React.FC<AnnouncementsCMSViewProps> = ({
  announcements,
  onRefreshAnnouncements,
}) => {
  const [showDraftModal, setShowDraftModal] = useState(false);
  
  // AI Draft State
  const [aiTopic, setAiTopic] = useState('Ramadan Iftar & Taraweeh timings for 1447H');
  const [aiTone, setAiTone] = useState<'URGENT' | 'INVITATION' | 'FORMAL_ANNOUNCEMENT' | 'CONDOLENCE'>('FORMAL_ANNOUNCEMENT');
  const [aiLanguage, setAiLanguage] = useState<'ENGLISH' | 'MALAYALAM' | 'BOTH'>('BOTH');
  const [generatingAi, setGeneratingAi] = useState(false);

  // Notice Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Announcement['category']>('General');
  const [priority, setPriority] = useState<Announcement['priority']>('NORMAL');
  const [isPinned, setIsPinned] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const handleGenerateWithAI = async () => {
    if (!aiTopic.trim()) {
      alert('Please enter a topic or rough points.');
      return;
    }

    setGeneratingAi(true);
    try {
      const res = await api.generateAdminDraft(
        `Draft Mahallu Notice (${aiTone}, language: ${aiLanguage})`,
        aiTopic
      );
      setTitle(aiTopic);
      setContent(res.draft || '');
    } catch (err: any) {
      alert(err.message || 'AI Drafting failed');
    } finally {
      setGeneratingAi(false);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      alert('Please provide title and announcement text.');
      return;
    }

    setPublishing(true);
    try {
      await api.createAnnouncement({
        englishTitle: title,
        malayalamTitle: title,
        content,
        category: category as any,
        priority,
        isPinned,
        date: new Date().toISOString().split('T')[0],
        published: true,
        author: 'Secretariat',
      });
      setShowDraftModal(false);
      setTitle('');
      setContent('');
      onRefreshAnnouncements();
    } catch (err: any) {
      alert(err.message || 'Publishing notice failed');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Publishing & Communications Desk
          </span>
          <h1 className="font-display text-2xl font-black text-gray-950 mt-1">
            Official Mahallu Notice Board CMS
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Draft, translate, and broadcast verified circulars, Janaza notifications, and general announcements.
          </p>
        </div>

        <button
          onClick={() => setShowDraftModal(true)}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
        >
          <Sparkles className="w-4 h-4 text-emerald-300" />
          <span>Create Notice with AI</span>
        </button>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {announcements.map((item) => (
          <div
            key={item.id}
            className={`p-5 rounded-3xl border transition-all ${
              item.isPinned
                ? 'bg-amber-50/40 border-amber-200 shadow-xs'
                : 'bg-white border-gray-200/80 shadow-xs'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700">
                  {item.category}
                </span>
                {item.isPinned && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                    <Pin className="w-3 h-3 fill-amber-700 text-amber-700" />
                    PINNED
                  </span>
                )}
                {item.priority === 'HIGH' || item.priority === 'URGENT' ? (
                  <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
                    {item.priority}
                  </span>
                ) : null}
              </div>

              <div className="text-[11px] text-gray-400 font-mono">
                Published {item.date} • ID: {item.id}
              </div>
            </div>

            <div className="pt-3 space-y-2">
              <h3 className="font-display text-base font-bold text-gray-950">
                {item.englishTitle || item.malayalamTitle}
              </h3>
              <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">
                {item.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Draft / AI Notice Modal */}
      {showDraftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-gray-950">
                    Create Mahallu Notice
                  </h3>
                  <div className="text-[11px] text-gray-500">Manoor AI Assistant Integrated</div>
                </div>
              </div>
              <button
                onClick={() => setShowDraftModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold"
              >
                ✕
              </button>
            </div>

            {/* AI Prompt Strip */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>AI Drafting Engine (Gemini 2.5 Flash)</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                  Smart Secretary
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                    placeholder="Enter rough key points (e.g. Cleanliness drive Sunday 8am)..."
                    className="w-full px-3 py-2 rounded-xl bg-white border border-emerald-300 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
                <div>
                  <select
                    value={aiLanguage}
                    onChange={(e) => setAiLanguage(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-emerald-300 text-xs font-semibold focus:outline-none"
                  >
                    <option value="BOTH">Bilingual (Mal + Eng)</option>
                    <option value="MALAYALAM">Malayalam Only</option>
                    <option value="ENGLISH">English Only</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleGenerateWithAI}
                  disabled={generatingAi}
                  className="px-4 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{generatingAi ? 'Generating Draft...' : 'Draft with AI'}</span>
                </button>
              </div>
            </div>

            {/* Final Form to Publish */}
            <form onSubmit={handlePublish} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Notice Headline *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Official Notice Title"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                  >
                    <option value="General">General Notice</option>
                    <option value="Emergency">Emergency Alert</option>
                    <option value="Janaza">Janaza / Condolence</option>
                    <option value="Madrasa">Madrasa Circular</option>
                    <option value="Meeting">Committee Meeting</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High Priority</option>
                    <option value="URGENT">Urgent Alert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Announcement Body (Markdown & Multi-line supported) *</label>
                <textarea
                  rows={6}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Full text of notice..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs leading-relaxed"
                ></textarea>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded text-emerald-800"
                />
                <span className="font-semibold text-gray-800 text-xs">
                  Pin this circular to top of Mahallu Public Notice Board
                </span>
              </label>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDraftModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={publishing}
                  className="px-5 py-2 rounded-xl bg-emerald-800 text-white font-bold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{publishing ? 'Publishing...' : 'Broadcast Notice'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
