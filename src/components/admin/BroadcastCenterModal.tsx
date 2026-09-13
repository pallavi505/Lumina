import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Send, 
  Sparkles, 
  Bell, 
  Megaphone, 
  Layers, 
  Volume2, 
  VolumeX, 
  Pin, 
  Check, 
  Clock, 
  Eye, 
  ShieldAlert, 
  ExternalLink,
  Tag,
  Users,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { useLiveNotifications } from '../../context/NotificationContext';
import { SEED_BROADCASTS, type BroadcastItem } from '../../data/adminData';

interface BroadcastCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublishSuccess?: (broadcast: BroadcastItem) => void;
  broadcasts?: BroadcastItem[];
  onPublishBroadcast?: (broadcast: Omit<BroadcastItem, 'id' | 'publishedAt' | 'sentCount' | 'openRate'>) => Promise<string>;
  isLoading?: boolean;
}

export default function BroadcastCenterModal({
  isOpen,
  onClose,
  onPublishSuccess,
  broadcasts: propBroadcasts,
  onPublishBroadcast,
  isLoading = false
}: BroadcastCenterModalProps) {
  const { addNotification } = useLiveNotifications();

  // Form State
  const [broadcastType, setBroadcastType] = useState<'both' | 'notification' | 'homepage'>('both');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<BroadcastItem['category']>('Policy Update');
  const [priority, setPriority] = useState<BroadcastItem['priority']>('urgent');
  const [targetAudience, setTargetAudience] = useState('All Cadres (ISS, SSS, State DES)');
  const [actionText, setActionText] = useState('Review Guidelines');
  const [targetView, setTargetView] = useState('explore');
  const [badgeText, setBadgeText] = useState('Priority Mandate');
  const [badgeColor, setBadgeColor] = useState('rose');
  const [pinned, setPinned] = useState(true);
  const [playAudioChime, setPlayAudioChime] = useState(true);

  // Active broadcasts archive
  const [broadcastsList, setBroadcastsList] = useState<BroadcastItem[]>(propBroadcasts || SEED_BROADCASTS);

  React.useEffect(() => {
    if (propBroadcasts && propBroadcasts.length > 0) {
      setBroadcastsList(propBroadcasts);
    }
  }, [propBroadcasts]);

  const [activeTab, setActiveTab] = useState<'create' | 'active_broadcasts'>('create');
  const [previewMode, setPreviewMode] = useState<'notification' | 'homepage'>('notification');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        targetAudience,
        broadcastType,
        badgeText: badgeText.trim() || undefined,
        badgeColor,
        actionText: actionText.trim() || 'View Details',
        targetView,
        author: 'Marcus Sterling (MoSPI Admin)',
        pinned,
        active: true
      };

      let generatedId = `bc-${Date.now()}`;
      if (onPublishBroadcast) {
        generatedId = await onPublishBroadcast(payload);
      }

      const newBroadcast: BroadcastItem = {
        ...payload,
        id: generatedId,
        publishedAt: 'Just now',
        sentCount: targetAudience.includes('All') ? 48250 : 3840,
        openRate: 100,
      };

      // Dispatch real-time live notification if target is notification or both
      if (broadcastType === 'notification' || broadcastType === 'both') {
        addNotification({
          type: 'deadline',
          title: `📢 ${title.trim()}`,
          description: description.trim(),
          priority: priority === 'urgent' ? 'high' : priority === 'high' ? 'high' : 'normal',
          pinned,
          actionText: actionText.trim() || 'Acknowledge Notice',
          targetView: targetView as any,
          deadlineInfo: {
            assignmentTitle: title.trim(),
            courseTitle: 'National Academy Policy Directive',
            dueDate: 'Immediate Action Required',
            dueInHours: 24,
            isUrgent: priority === 'urgent'
          } as any
        });
      }

      setBroadcastsList([newBroadcast, ...broadcastsList]);

      if (onPublishSuccess) {
        onPublishSuccess(newBroadcast);
      }

      setFeedbackNotice('Broadcast published and persisted to Firestore successfully!');
      setTimeout(() => {
        setFeedbackNotice(null);
        // Reset form
        setTitle('');
        setDescription('');
        onClose();
      }, 1600);
    } catch (err) {
      setFeedbackNotice(`Error publishing broadcast: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleArchive = (id: string) => {
    setBroadcastsList(broadcastsList.map(b => 
      b.id === id ? { ...b, active: !b.active } : b
    ));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          className="relative w-full max-w-4xl bg-[#091512] border border-[#40e3bd]/30 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden my-6 flex flex-col max-h-[90vh]"
        >
          {/* Modal Header */}
          <div className="p-5 bg-gradient-to-r from-[#0d231c] via-[#091a15] to-[#0d231c] border-b border-[#40e3bd]/20 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#40e3bd]/15 text-[#40e3bd] border border-[#40e3bd]/30">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
                  Lumina Broadcast Center
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#40e3bd]/10 text-[#40e3bd] border border-[#40e3bd]/30 font-normal">
                    Admin Dispatch
                  </span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Publish platform-wide official notifications, urgent mandates, and homepage banners.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab('create')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'create' ? 'bg-[#40e3bd] text-[#052219]' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Create Notice
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('active_broadcasts')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'active_broadcasts' ? 'bg-[#40e3bd] text-[#052219]' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <span>History</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-zinc-800 text-zinc-300 font-mono">
                    {broadcastsList.length}
                  </span>
                </button>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700/50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Feedback message */}
          {feedbackNotice && (
            <div className="p-3 bg-emerald-500/20 border-b border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{feedbackNotice}</span>
            </div>
          )}

          {/* Content Area */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {activeTab === 'create' ? (
              <form onSubmit={handlePublish} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Form Fields */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Broadcast Channel Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold font-['Space_Grotesk'] text-zinc-300 uppercase tracking-wider block">
                      Dispatch Channel Destination
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'both', label: 'All Channels (Mandate)', icon: Megaphone },
                        { id: 'notification', label: 'Live Notification Drawer', icon: Bell },
                        { id: 'homepage', label: 'Homepage Banner Only', icon: Tag }
                      ].map((item) => {
                        const Icon = item.icon;
                        const isSelected = broadcastType === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setBroadcastType(item.id as any)}
                            className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer flex flex-col gap-1 ${
                              isSelected
                                ? 'bg-[#40e3bd]/15 border-[#40e3bd] text-[#40e3bd] shadow-[0_0_12px_rgba(64,227,189,0.15)]'
                                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            <span className="text-[11px] leading-tight">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Title */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold font-['Space_Grotesk'] text-zinc-300 uppercase tracking-wider block">
                      Broadcast Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. National Data Governance & Statistical AI Framework 2026 Mandate"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-zinc-900/90 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#40e3bd]"
                    />
                  </div>

                  {/* Category & Priority */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold font-['Space_Grotesk'] text-zinc-300 uppercase tracking-wider block">
                        Category Classification
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full px-3 py-2.5 bg-zinc-900/90 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-[#40e3bd]"
                      >
                        <option value="Policy Update">Policy Update</option>
                        <option value="iGOT Integration">iGOT Integration</option>
                        <option value="Curriculum Alert">Curriculum Alert</option>
                        <option value="Urgent Maintenance">Urgent Maintenance</option>
                        <option value="Competition">Competition</option>
                        <option value="Security & Standards">Security & Standards</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold font-['Space_Grotesk'] text-zinc-300 uppercase tracking-wider block">
                        Broadcast Urgency Priority
                      </label>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as any)}
                        className="w-full px-3 py-2.5 bg-zinc-900/90 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-[#40e3bd]"
                      >
                        <option value="urgent">Critical / Urgent (Red Alert)</option>
                        <option value="high">High Priority (Amber Alert)</option>
                        <option value="standard">Standard Information (Cyan)</option>
                        <option value="info">General Advisory</option>
                      </select>
                    </div>
                  </div>

                  {/* Target Audience & Target Route */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold font-['Space_Grotesk'] text-zinc-300 uppercase tracking-wider block">
                        Target Cadre / Audience
                      </label>
                      <select
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        className="w-full px-3 py-2.5 bg-zinc-900/90 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-[#40e3bd]"
                      >
                        <option value="All Cadres (ISS, SSS, State DES)">All Cadres (ISS, SSS, State DES)</option>
                        <option value="Indian Statistical Service (ISS)">Indian Statistical Service (ISS Only)</option>
                        <option value="Subordinate Statistical Service (SSS)">Subordinate Statistical Service (SSS)</option>
                        <option value="Field Operations Directorate (FOD)">Field Operations Directorate (FOD)</option>
                        <option value="Faculty & Master Trainers">Faculty & Master Trainers</option>
                        <option value="State DES Directorates">State DES Directorates</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold font-['Space_Grotesk'] text-zinc-300 uppercase tracking-wider block">
                        Action Link Target View
                      </label>
                      <select
                        value={targetView}
                        onChange={(e) => setTargetView(e.target.value)}
                        className="w-full px-3 py-2.5 bg-zinc-900/90 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-[#40e3bd]"
                      >
                        <option value="explore">Explore Course Catalog</option>
                        <option value="progress">My Learning Progress</option>
                        <option value="dashboard">Learning Dashboard</option>
                        <option value="profile">Officer Profile Badges</option>
                      </select>
                    </div>
                  </div>

                  {/* Message Description */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold font-['Space_Grotesk'] text-zinc-300 uppercase tracking-wider block">
                      Announcement Text / Directive Summary *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Enter official directive, compliance guidelines, or milestone briefing..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-zinc-900/90 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#40e3bd]"
                    />
                  </div>

                  {/* Action Button Label & Badge Text */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold font-['Space_Grotesk'] text-zinc-300 uppercase tracking-wider block">
                        Action Button Label
                      </label>
                      <input
                        type="text"
                        value={actionText}
                        onChange={(e) => setActionText(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-900/90 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-[#40e3bd]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold font-['Space_Grotesk'] text-zinc-300 uppercase tracking-wider block">
                        Badge Pill Label
                      </label>
                      <input
                        type="text"
                        value={badgeText}
                        onChange={(e) => setBadgeText(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-900/90 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-[#40e3bd]"
                      />
                    </div>
                  </div>

                  {/* Toggle Options */}
                  <div className="flex items-center gap-4 pt-1 flex-wrap">
                    <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pinned}
                        onChange={(e) => setPinned(e.target.checked)}
                        className="rounded border-zinc-700 bg-zinc-800 text-[#40e3bd] focus:ring-0"
                      />
                      <Pin className="w-3.5 h-3.5 text-[#40e3bd]" />
                      <span>Pin to Top of Learner Drawers</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={playAudioChime}
                        onChange={(e) => setPlayAudioChime(e.target.checked)}
                        className="rounded border-zinc-700 bg-zinc-800 text-[#40e3bd] focus:ring-0"
                      />
                      <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Trigger Audio Chime on Screens</span>
                    </label>
                  </div>
                </div>

                {/* Right Column: Live WYSIWYG Preview */}
                <div className="lg:col-span-5 space-y-4 flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-['Space_Grotesk'] text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-[#40e3bd]" />
                      Real-Time WYSIWYG Preview
                    </span>

                    <div className="flex items-center bg-zinc-900 p-0.5 rounded-lg border border-zinc-800 text-[10px]">
                      <button
                        type="button"
                        onClick={() => setPreviewMode('notification')}
                        className={`px-2 py-0.5 rounded transition-colors ${
                          previewMode === 'notification' ? 'bg-[#40e3bd] text-[#052219] font-bold' : 'text-zinc-400'
                        }`}
                      >
                        Drawer Card
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewMode('homepage')}
                        className={`px-2 py-0.5 rounded transition-colors ${
                          previewMode === 'homepage' ? 'bg-[#40e3bd] text-[#052219] font-bold' : 'text-zinc-400'
                        }`}
                      >
                        Home Board
                      </button>
                    </div>
                  </div>

                  {/* Preview Container */}
                  <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex-1 flex flex-col justify-center min-h-[300px]">
                    {previewMode === 'notification' ? (
                      /* Live Notification Drawer Card Preview */
                      <div className="p-4 rounded-xl bg-zinc-900/90 border border-[#40e3bd]/40 space-y-3 shadow-lg shadow-black/50">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
                              <Bell className="w-4 h-4" />
                            </span>
                            <div>
                              <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider">
                                {priority.toUpperCase()} DISPATCH
                              </span>
                              <div className="text-[10px] text-zinc-500">Just now • Broadcast Alert</div>
                            </div>
                          </div>
                          {pinned && (
                            <span className="p-1 rounded bg-[#40e3bd]/10 text-[#40e3bd]" title="Pinned Alert">
                              <Pin className="w-3 h-3" />
                            </span>
                          )}
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-white font-['Space_Grotesk'] leading-snug">
                            {title.trim() || 'Mandatory Statistical Protocol Update Notice'}
                          </h4>
                          <p className="text-[11px] text-zinc-300 mt-1 font-sans line-clamp-3 leading-relaxed">
                            {description.trim() || 'MoSPI mandates all state statistical directorates to complete foundational modern survey sampling, geospatial telemetry, and automated data validation modules.'}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                          <span className="text-[10px] text-zinc-500 font-mono">
                            Target: {targetAudience.split(' ')[0]}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-[#40e3bd] text-[#052219] text-[10px] font-bold font-['Space_Grotesk']">
                            {actionText || 'Review Guidelines'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      /* Homepage Announcement Board Preview */
                      <div className="p-4 rounded-xl bg-gradient-to-r from-[#0a1a15] to-[#091512] border border-[#40e3bd]/30 space-y-3 shadow-lg">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">
                            {badgeText || 'Priority'}
                          </span>
                          <span className="text-[10px] text-zinc-400">Sep 13, 2026</span>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-white font-['Space_Grotesk']">
                            {title.trim() || 'National Data Governance Framework'}
                          </h4>
                          <p className="text-[11px] text-zinc-300 mt-1 font-sans line-clamp-3">
                            {description.trim() || 'Official announcement text rendered on the public explore catalog and institutional landing board.'}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-zinc-800 text-[10px] text-zinc-400 flex items-center justify-between">
                          <span>Ministry of Statistics & Programme Implementation</span>
                          <span className="text-[#40e3bd] flex items-center gap-1 font-semibold">
                            <span>{actionText}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="mt-4 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-[11px] text-zinc-400 space-y-1">
                      <div className="flex justify-between">
                        <span>Recipient Officers:</span>
                        <strong className="text-white font-mono">48,250 Registered</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Active Terminals:</span>
                        <strong className="text-[#40e3bd] font-mono">36 States/UTs</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery SLA:</span>
                        <strong className="text-white font-mono">&lt; 250ms Push</strong>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !title.trim() || !description.trim()}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#40e3bd] to-[#20b892] hover:from-[#5ef8d5] disabled:opacity-50 text-[#052219] font-bold text-xs font-['Space_Grotesk'] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(64,227,189,0.3)] transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Transmitting Network Payload...' : 'Authorize & Broadcast Notice'}</span>
                  </button>
                </div>
              </form>
            ) : (
              /* History & Active Broadcasts Tab */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white font-['Space_Grotesk']">
                    Platform Broadcast Archive & Telemetry ({broadcastsList.length})
                  </h4>
                  <span className="text-xs text-zinc-400">Real-time open rates across state directorates</span>
                </div>

                <div className="space-y-3">
                  {broadcastsList.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-[#40e3bd]/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
                            item.priority === 'urgent'
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                              : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                          }`}>
                            {item.category}
                          </span>
                          <h5 className="text-xs font-bold text-white font-['Space_Grotesk']">
                            {item.title}
                          </h5>
                          {item.pinned && (
                            <span className="p-0.5 rounded bg-[#40e3bd]/15 text-[#40e3bd]" title="Pinned">
                              <Pin className="w-3 h-3" />
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-zinc-400 line-clamp-2">
                          {item.description}
                        </p>

                        <div className="flex items-center gap-3 text-[11px] text-zinc-500 pt-1 flex-wrap">
                          <span>Sent to: <strong className="text-zinc-300">{item.targetAudience}</strong></span>
                          <span>•</span>
                          <span>Delivered: <strong className="text-white font-mono">{item.sentCount.toLocaleString()}</strong></span>
                          <span>•</span>
                          <span>Open Rate: <strong className="text-emerald-400 font-mono">{item.openRate}%</strong></span>
                          <span>•</span>
                          <span>{item.publishedAt}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => handleToggleArchive(item.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                            item.active
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                              : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700'
                          }`}
                        >
                          {item.active ? 'Active' : 'Archived'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
