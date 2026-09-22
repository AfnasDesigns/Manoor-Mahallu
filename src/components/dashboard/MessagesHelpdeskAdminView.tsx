import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  HelpCircle,
  UserPlus,
  AlertCircle,
  Clock,
  CheckCircle2,
  Search,
  Filter,
  Phone,
  User,
  Home,
  ArrowRight,
  Send,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  ChevronRight,
  Eye,
  RefreshCw,
  X
} from 'lucide-react';
import { ServiceRequest, Registration } from '../../types/index.ts';
import { api } from '../../lib/api.ts';

interface MessagesHelpdeskAdminViewProps {
  onRefreshData?: () => void;
}

export const MessagesHelpdeskAdminView: React.FC<MessagesHelpdeskAdminViewProps> = ({
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'MESSAGES' | 'HELP' | 'JOINS'>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  // Selected item for modal
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);
  const [responseNotes, setResponseNotes] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [srvData, regData] = await Promise.all([
        api.getServiceRequests(),
        api.getRegistrations(),
      ]);
      setServiceRequests(srvData);
      setRegistrations(regData);
    } catch (err) {
      console.error('Failed to load messages & helpdesk data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Format combined items
  interface FeedItem {
    id: string;
    type: 'MESSAGE' | 'HELP' | 'JOIN';
    categoryTitle: string;
    applicantName: string;
    applicantPhone: string;
    familyId?: string;
    memberId?: string;
    subject?: string;
    description: string;
    date: string;
    status: string;
    urgency?: 'NORMAL' | 'HIGH' | 'EMERGENCY';
    rawService?: ServiceRequest;
    rawRegistration?: Registration;
  }

  const items: FeedItem[] = [
    // Service Requests & Help
    ...serviceRequests.map((s) => {
      const isMessage =
        s.serviceTitle.toLowerCase().includes('message') ||
        s.category?.toLowerCase().includes('message') ||
        s.subject?.toLowerCase().includes('message');

      return {
        id: s.id,
        type: (isMessage ? 'MESSAGE' : 'HELP') as 'MESSAGE' | 'HELP',
        categoryTitle: s.serviceTitle || (isMessage ? 'Member Message' : 'Help Assistance'),
        applicantName: s.applicantName,
        applicantPhone: s.applicantPhone,
        familyId: s.familyId,
        memberId: s.memberId,
        subject: s.subject || s.serviceTitle,
        description: s.description,
        date: s.date,
        status: s.status,
        urgency: s.urgency,
        rawService: s,
      };
    }),
    // Registrations & New Joins
    ...registrations.map((r) => ({
      id: r.id,
      type: 'JOIN' as 'JOIN',
      categoryTitle: `${r.type} Application`,
      applicantName: r.applicantName,
      applicantPhone: r.applicantPhone,
      familyId: r.familyId,
      memberId: r.memberId,
      subject: `New Application: ${r.type}`,
      description: r.details?.notes || r.details?.address || `New member application submitted for Mahallu verification.`,
      date: r.submittedAt ? r.submittedAt.split('T')[0] : '2026-09-20',
      status: r.status,
      rawRegistration: r,
    })),
  ];

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesTab =
      activeTab === 'ALL' ||
      (activeTab === 'MESSAGES' && item.type === 'MESSAGE') ||
      (activeTab === 'HELP' && item.type === 'HELP') ||
      (activeTab === 'JOINS' && item.type === 'JOIN');

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'NEW' && (item.status === 'NEW' || item.status === 'SUBMITTED')) ||
      (statusFilter === 'IN_PROGRESS' && (item.status === 'IN PROGRESS' || item.status === 'UNDER REVIEW')) ||
      (statusFilter === 'RESOLVED' && (item.status === 'RESOLVED' || item.status === 'APPROVED' || item.status === 'COMPLETED'));

    const matchesSearch =
      item.applicantName.toLowerCase().includes(search.toLowerCase()) ||
      item.applicantPhone.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.categoryTitle.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase());

    return matchesTab && matchesStatus && matchesSearch;
  });

  // Stats
  const totalNew = items.filter(i => i.status === 'NEW' || i.status === 'SUBMITTED').length;
  const totalHelp = items.filter(i => i.type === 'HELP').length;
  const totalJoins = items.filter(i => i.type === 'JOIN').length;
  const totalMessages = items.filter(i => i.type === 'MESSAGE').length;

  const handleUpdateServiceStatus = async (newStatus: ServiceRequest['status']) => {
    if (!selectedRequest) return;
    setUpdating(true);
    try {
      await api.updateServiceRequestStatus(
        selectedRequest.id,
        newStatus,
        responseNotes,
        assignedTo || 'Committee Desk'
      );
      setSelectedRequest(null);
      setResponseNotes('');
      setAssignedTo('');
      await fetchData();
      if (onRefreshData) onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed to update request status');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateRegStatus = async (newStatus: Registration['status']) => {
    if (!selectedReg) return;
    setUpdating(true);
    try {
      await api.updateRegistrationStatus(selectedReg.id, newStatus, responseNotes);
      setSelectedReg(null);
      setResponseNotes('');
      await fetchData();
      if (onRefreshData) onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed to update registration status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            ADMIN INBOX & HELPDESK
          </span>
          <h1 className="font-display text-2xl font-black text-gray-950 mt-1">
            Member Messages, Help Requests & New Joins
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time feed of all messages sent by members, community emergency/welfare requests, and new membership join applications.
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700 shadow-2xs transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Inbox</span>
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-gray-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="font-medium">Unread / New</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-gray-950">{totalNew}</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">Awaiting Review</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="font-medium">Help Requests</span>
            <HelpCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-gray-950">{totalHelp}</div>
          <div className="text-[11px] text-amber-700 font-semibold mt-0.5">Assistance & Welfare</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="font-medium">New Joins</span>
            <UserPlus className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-gray-950">{totalJoins}</div>
          <div className="text-[11px] text-blue-700 font-semibold mt-0.5">Membership & NOCs</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="font-medium">Member Messages</span>
            <MessageSquare className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-gray-950">{totalMessages}</div>
          <div className="text-[11px] text-purple-700 font-semibold mt-0.5">Direct Enquiries</div>
        </div>
      </div>

      {/* Tabs and Search */}
      <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Main category tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeTab === 'ALL'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Inquiries ({items.length})
            </button>

            <button
              onClick={() => setActiveTab('HELP')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'HELP'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Ask for Help ({totalHelp})</span>
            </button>

            <button
              onClick={() => setActiveTab('MESSAGES')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'MESSAGES'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Messages ({totalMessages})</span>
            </button>

            <button
              onClick={() => setActiveTab('JOINS')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'JOINS'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>New Joins ({totalJoins})</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search member, phone, or text..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Secondary Status Filters */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100 text-xs">
          <span className="text-gray-400 font-medium">Status:</span>
          {['ALL', 'NEW', 'IN_PROGRESS', 'RESOLVED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {st === 'ALL' ? 'All Status' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* List of Messages and Inquiries */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-gray-200">
            <MessageSquare className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 text-sm">No messages or requests found</h3>
            <p className="text-xs text-gray-500 mt-1">
              New inquiries submitted by members will automatically appear in this inbox.
            </p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isNew = item.status === 'NEW' || item.status === 'SUBMITTED';
            const isEmergency = item.urgency === 'EMERGENCY';

            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl bg-white border transition-all hover:shadow-md ${
                  isEmergency
                    ? 'border-red-300 bg-red-50/20'
                    : isNew
                    ? 'border-emerald-300/80 shadow-2xs'
                    : 'border-gray-200/90'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    {/* Header tags */}
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      {/* Type Badge */}
                      {item.type === 'HELP' && (
                        <span className="px-2 py-0.5 rounded-full font-bold text-[10px] uppercase bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                          <HelpCircle className="w-3 h-3" />
                          Help Request
                        </span>
                      )}
                      {item.type === 'MESSAGE' && (
                        <span className="px-2 py-0.5 rounded-full font-bold text-[10px] uppercase bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          Member Message
                        </span>
                      )}
                      {item.type === 'JOIN' && (
                        <span className="px-2 py-0.5 rounded-full font-bold text-[10px] uppercase bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
                          <UserPlus className="w-3 h-3" />
                          New Join / Admission
                        </span>
                      )}

                      {/* Urgency */}
                      {item.urgency === 'EMERGENCY' && (
                        <span className="px-2 py-0.5 rounded-full font-bold text-[10px] uppercase bg-red-600 text-white animate-pulse">
                          EMERGENCY
                        </span>
                      )}
                      {item.urgency === 'HIGH' && (
                        <span className="px-2 py-0.5 rounded-full font-bold text-[10px] uppercase bg-orange-100 text-orange-800">
                          High Priority
                        </span>
                      )}

                      {/* Status */}
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                          isNew
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : item.status === 'RESOLVED' || item.status === 'APPROVED'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {item.status}
                      </span>

                      <span className="text-gray-400 font-mono text-[11px] ml-auto">
                        {item.id} • {item.date}
                      </span>
                    </div>

                    {/* Member Details */}
                    <div className="flex items-center gap-3 text-xs text-gray-800 pt-0.5">
                      <div className="flex items-center gap-1 font-bold text-gray-950">
                        <User className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{item.applicantName}</span>
                      </div>

                      <a
                        href={`tel:${item.applicantPhone}`}
                        className="flex items-center gap-1 text-gray-600 hover:text-emerald-700 font-medium"
                      >
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span>{item.applicantPhone}</span>
                      </a>

                      {item.familyId && (
                        <div className="flex items-center gap-1 text-gray-500">
                          <Home className="w-3 h-3 text-gray-400" />
                          <span>{item.familyId}</span>
                        </div>
                      )}
                    </div>

                    {/* Subject & Message Content */}
                    <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-100 text-xs text-gray-700">
                      <div className="font-bold text-gray-900 mb-1">
                        {item.categoryTitle}
                      </div>
                      <p className="whitespace-pre-line leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Response notes if already handled */}
                    {item.rawService?.responseNotes && (
                      <div className="text-xs text-emerald-800 bg-emerald-50 rounded-xl p-2.5 border border-emerald-100">
                        <strong className="font-bold">Admin Response:</strong> {item.rawService.responseNotes}
                      </div>
                    )}
                    {item.rawRegistration?.reviewNotes && (
                      <div className="text-xs text-blue-800 bg-blue-50 rounded-xl p-2.5 border border-blue-100">
                        <strong className="font-bold">Review Notes:</strong> {item.rawRegistration.reviewNotes}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col gap-2 shrink-0 pt-2 sm:pt-0">
                    <a
                      href={`https://wa.me/${item.applicantPhone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>

                    {item.rawService && (
                      <button
                        onClick={() => {
                          setSelectedRequest(item.rawService!);
                          setResponseNotes(item.rawService?.responseNotes || '');
                          setAssignedTo(item.rawService?.assignedTo || '');
                        }}
                        className="px-3 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Take Action</span>
                      </button>
                    )}

                    {item.rawRegistration && (
                      <button
                        onClick={() => {
                          setSelectedReg(item.rawRegistration!);
                          setResponseNotes(item.rawRegistration?.reviewNotes || '');
                        }}
                        className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Review Join</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Action Modal for Service / Help Request */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Action Desk
                </span>
                <h3 className="font-display text-lg font-black text-gray-950 mt-1">
                  Respond to Help Request
                </h3>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200/80">
                <div className="font-bold text-gray-900">{selectedRequest.applicantName} ({selectedRequest.applicantPhone})</div>
                <div className="text-gray-500 mt-0.5 font-medium">{selectedRequest.serviceTitle}</div>
                <p className="mt-2 text-gray-700">{selectedRequest.description}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Assign Officer / Volunteer
                </label>
                <input
                  type="text"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  placeholder="e.g. Welfare Secretary / Ambulance Desk"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Resolution / Reply Note to Member
                </label>
                <textarea
                  rows={3}
                  value={responseNotes}
                  onChange={(e) => setResponseNotes(e.target.value)}
                  placeholder="Enter notes on relief disbursed, ambulance dispatched, or message reply..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={updating}
                onClick={() => handleUpdateServiceStatus('IN PROGRESS')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
              >
                Mark In Progress
              </button>
              <button
                type="button"
                disabled={updating}
                onClick={() => handleUpdateServiceStatus('RESOLVED')}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-700/20"
              >
                Resolve & Complete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Modal for New Join Registration */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md">
                  Membership Approval
                </span>
                <h3 className="font-display text-lg font-black text-gray-950 mt-1">
                  Review {selectedReg.type} Application
                </h3>
              </div>
              <button
                onClick={() => setSelectedReg(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200/80">
                <div className="font-bold text-gray-900">{selectedReg.applicantName} ({selectedReg.applicantPhone})</div>
                <div className="text-gray-500 mt-0.5 font-medium">Tracking ID: {selectedReg.id}</div>
                {selectedReg.details && (
                  <pre className="mt-2 text-gray-700 text-[11px] whitespace-pre-wrap font-sans">
                    {JSON.stringify(selectedReg.details, null, 2)}
                  </pre>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Committee Review Notes
                </label>
                <textarea
                  rows={3}
                  value={responseNotes}
                  onChange={(e) => setResponseNotes(e.target.value)}
                  placeholder="Record verification notes, membership number assigned, or NOC conditions..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedReg(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={updating}
                onClick={() => handleUpdateRegStatus('REJECTED')}
                className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold border border-red-200"
              >
                Decline
              </button>
              <button
                type="button"
                disabled={updating}
                onClick={() => handleUpdateRegStatus('APPROVED')}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-700/20"
              >
                Approve & Register Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
