import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Bell, 
  Clock, 
  Award, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Send, 
  Trash2, 
  Check, 
  ExternalLink, 
  CornerDownRight,
  Filter,
  RefreshCw
} from 'lucide-react';
import { useLiveNotifications } from '../context/NotificationContext';
import type { LiveNotificationItem, LiveNotificationType } from '../types';

interface LiveNotificationsDrawerProps {
  onNavigateToCourse?: (courseId: string) => void;
  onNavigateToProgress?: () => void;
  onNavigateToDashboard?: () => void;
  onNavigateToExplore?: () => void;
}

export default function LiveNotificationsDrawer({
  onNavigateToCourse,
  onNavigateToProgress,
  onNavigateToDashboard,
  onNavigateToExplore
}: LiveNotificationsDrawerProps) {
  const {
    notifications,
    unreadCount,
    urgentDeadlinesCount,
    peerMentionsCount,
    completionsCount,
    isOpen,
    closeDrawer,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    dismissNotification,
    submitAssignment,
    replyToPeer,
    simulateIncoming,
    soundEnabled,
    toggleSound,
    filter,
    setFilter,
    unreadOnly,
    setUnreadOnly,
    searchQuery,
    setSearchQuery,
    resetNotifications
  } = useLiveNotifications();

  // State for active inline peer reply boxes
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyInputText, setReplyInputText] = useState<string>('');
  const [simMenuOpen, setSimMenuOpen] = useState(false);

  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeDrawer]);

  // Filtered notifications
  const filteredNotifications = notifications.filter(item => {
    // Type filter
    if (filter !== 'all' && item.type !== filter) return false;
    // Unread only filter
    if (unreadOnly && item.read) return false;
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchPeer = item.peerInfo?.peerName.toLowerCase().includes(q) || item.peerInfo?.targetTopic.toLowerCase().includes(q);
      const matchDeadline = item.deadlineInfo?.assignmentTitle.toLowerCase().includes(q) || item.deadlineInfo?.courseTitle.toLowerCase().includes(q);
      const matchComp = item.completionInfo?.courseTitle.toLowerCase().includes(q) || item.completionInfo?.learnerName.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchPeer && !matchDeadline && !matchComp) {
        return false;
      }
    }
    return true;
  });

  const handleActionClick = (item: LiveNotificationItem) => {
    markAsRead(item.id);

    if (item.type === 'deadline') {
      if (item.deadlineInfo?.courseId && onNavigateToCourse) {
        onNavigateToCourse(item.deadlineInfo.courseId);
        closeDrawer();
      } else if (onNavigateToDashboard) {
        onNavigateToDashboard();
        closeDrawer();
      }
    } else if (item.type === 'completion') {
      if (item.completionInfo?.isSelf && onNavigateToProgress) {
        onNavigateToProgress();
        closeDrawer();
      } else if (onNavigateToExplore) {
        onNavigateToExplore();
        closeDrawer();
      }
    } else if (item.type === 'peer') {
      // Toggle reply box
      setActiveReplyId(prev => (prev === item.id ? null : item.id));
      setReplyInputText('');
    }
  };

  const handleSendReply = (id: string) => {
    if (!replyInputText.trim()) return;
    replyToPeer(id, replyInputText);
    setReplyInputText('');
    setActiveReplyId(null);
  };

  const formatRelativeTime = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diff / (1000 * 60));
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
          />

          {/* Drawer Body */}
          <motion.div
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            className="relative w-full max-w-md sm:max-w-lg bg-[#0c0e14]/98 border-l border-zinc-800/80 shadow-2xl z-50 flex flex-col h-full text-zinc-100 backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-zinc-800/80 bg-zinc-950/60 sticky top-0 z-10">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="relative p-2 rounded-xl bg-[#40e3bd]/15 border border-[#40e3bd]/30 text-[#40e3bd]">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#40e3bd] shadow-[0_0_8px_#40e3bd] animate-pulse" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-zinc-100 font-['Space_Grotesk'] tracking-wide">
                        Live Notifications
                      </h2>
                      {unreadCount > 0 ? (
                        <span className="px-2 py-0.5 rounded-full bg-[#40e3bd]/20 border border-[#40e3bd]/40 text-[#40e3bd] text-[11px] font-mono font-bold">
                          {unreadCount} new
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 text-[11px] font-mono">
                          All caught up
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#40e3bd] animate-ping" />
                      <p className="text-xs text-zinc-400">Real-time MoSPI & iGOT sync active</p>
                    </div>
                  </div>
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={toggleSound}
                    title={soundEnabled ? 'Mute notification sound' : 'Unmute notification sound'}
                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                      soundEnabled 
                        ? 'bg-zinc-900 border-zinc-700 text-[#40e3bd] hover:bg-zinc-800' 
                        : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={closeDrawer}
                    className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                    title="Close drawer (Esc)"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status Summary Banner */}
              <div className="mt-3.5 grid grid-cols-3 gap-2">
                <button
                  onClick={() => setFilter('deadline')}
                  className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                    filter === 'deadline'
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                      : 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono text-[11px] text-zinc-400">Deadlines</span>
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="text-sm font-bold font-['Space_Grotesk'] text-zinc-100 flex items-center gap-1.5">
                    <span>{urgentDeadlinesCount} pending</span>
                  </div>
                </button>

                <button
                  onClick={() => setFilter('completion')}
                  className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                    filter === 'completion'
                      ? 'bg-[#40e3bd]/15 border-[#40e3bd]/40 text-[#40e3bd]'
                      : 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono text-[11px] text-zinc-400">Completions</span>
                    <Award className="w-3.5 h-3.5 text-[#40e3bd]" />
                  </div>
                  <div className="text-sm font-bold font-['Space_Grotesk'] text-zinc-100">
                    <span>{completionsCount} tracks</span>
                  </div>
                </button>

                <button
                  onClick={() => setFilter('peer')}
                  className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                    filter === 'peer'
                      ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300'
                      : 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono text-[11px] text-zinc-400">Peer Pings</span>
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                  <div className="text-sm font-bold font-['Space_Grotesk'] text-zinc-100">
                    <span>{peerMentionsCount} new</span>
                  </div>
                </button>
              </div>

              {/* Search and Secondary Controls */}
              <div className="mt-3.5 flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search deadlines, peers, credentials..."
                    className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#40e3bd]/50"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Mark All Read Button */}
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    title="Mark all notifications as read"
                    className="px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-[#40e3bd]/15 border border-zinc-800 hover:border-[#40e3bd]/40 text-xs text-zinc-300 hover:text-[#40e3bd] transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Mark read</span>
                  </button>
                )}
              </div>

              {/* Filter Tabs & Unread Toggle */}
              <div className="mt-3 flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
                <div className="flex items-center gap-1">
                  {(['all', 'deadline', 'completion', 'peer'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setFilter(tab)}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap capitalize ${
                        filter === tab
                          ? 'bg-[#40e3bd]/20 border border-[#40e3bd]/50 text-[#40e3bd]'
                          : 'bg-zinc-900/40 border border-zinc-800/60 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {tab === 'all' ? 'All' : tab === 'deadline' ? 'Deadlines' : tab === 'completion' ? 'Completions' : 'Peer Activity'}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setUnreadOnly(prev => !prev)}
                  className={`px-2 py-1 rounded-lg border text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    unreadOnly
                      ? 'bg-[#40e3bd]/20 border-[#40e3bd]/50 text-[#40e3bd]'
                      : 'bg-zinc-900/30 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${unreadOnly ? 'bg-[#40e3bd]' : 'bg-zinc-600'}`} />
                  <span>Unread</span>
                </button>
              </div>
            </div>

            {/* Notification List Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 divide-y-0">
              {filteredNotifications.length === 0 ? (
                <div className="py-16 flex flex-col items-center justify-center text-center px-4">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-3">
                    <CheckCircle2 className="w-6 h-6 text-[#40e3bd]" />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-200">No notifications found</h3>
                  <p className="text-xs text-zinc-400 max-w-xs mt-1 leading-relaxed">
                    {unreadOnly 
                      ? 'You have read all updates in this category.' 
                      : searchQuery 
                      ? 'No items matched your search query.' 
                      : 'No updates currently available in this channel.'}
                  </p>
                  {(unreadOnly || searchQuery || filter !== 'all') && (
                    <button
                      onClick={() => {
                        setFilter('all');
                        setUnreadOnly(false);
                        setSearchQuery('');
                      }}
                      className="mt-4 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 transition-all cursor-pointer"
                    >
                      Reset filters
                    </button>
                  )}
                </div>
              ) : (
                filteredNotifications.map(item => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`p-3.5 sm:p-4 rounded-2xl border transition-all relative group ${
                      !item.read
                        ? 'bg-zinc-900/70 border-[#40e3bd]/30 shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
                        : 'bg-zinc-950/40 border-zinc-800/80 hover:border-zinc-700/80 text-zinc-300'
                    }`}
                  >
                    {/* Unread dot indicator */}
                    {!item.read && (
                      <span className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-[#40e3bd] shadow-[0_0_6px_#40e3bd]" />
                    )}

                    {/* Top Row: Type Badge + Priority + Timestamp */}
                    <div className="flex items-center justify-between gap-2 pr-4 mb-2">
                      <div className="flex items-center gap-1.5">
                        {item.type === 'deadline' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold uppercase">
                            <Clock className="w-3 h-3" />
                            <span>Deadline</span>
                          </span>
                        ) : item.type === 'completion' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#40e3bd]/15 border border-[#40e3bd]/30 text-[#40e3bd] text-[10px] font-mono font-bold uppercase">
                            <Award className="w-3 h-3" />
                            <span>Completion</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-[10px] font-mono font-bold uppercase">
                            <MessageSquare className="w-3 h-3" />
                            <span>Peer Interaction</span>
                          </span>
                        )}

                        {item.priority === 'urgent' && (
                          <span className="px-1.5 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] font-mono font-bold uppercase">
                            Urgent
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] text-zinc-500 font-mono">
                        {formatRelativeTime(item.timestamp)}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="text-xs sm:text-sm font-semibold text-zinc-100 leading-snug">
                      {item.title}
                    </h4>

                    {/* Description */}
                    <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                      {item.description}
                    </p>

                    {/* TYPE-SPECIFIC RICH DATA */}
                    
                    {/* 1. DEADLINE METADATA CARD */}
                    {item.type === 'deadline' && item.deadlineInfo && (
                      <div className="mt-2.5 p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-zinc-400">Course:</span>
                          <span className="text-zinc-200 font-medium truncate max-w-[200px]">
                            {item.deadlineInfo.courseTitle}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-zinc-400">Due Schedule:</span>
                          <span className="text-amber-300 font-mono font-bold">
                            {item.deadlineInfo.dueDate} ({item.deadlineInfo.dueInHours}h left)
                          </span>
                        </div>
                        {item.deadlineInfo.weightage && (
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-zinc-400">Weightage:</span>
                            <span className="text-zinc-300 font-mono">
                              {item.deadlineInfo.weightage}
                            </span>
                          </div>
                        )}

                        {item.deadlineInfo.submitted ? (
                          <div className="mt-2 pt-2 border-t border-amber-500/20 flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#40e3bd]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Submitted to Evaluation Cluster</span>
                            </span>
                          </div>
                        ) : (
                          <div className="mt-2 pt-2 border-t border-amber-500/20 flex items-center justify-between gap-2">
                            <span className="text-[10px] text-zinc-400">Format: {item.deadlineInfo.submissionFormat}</span>
                            <button
                              onClick={() => submitAssignment(item.id)}
                              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-semibold transition-all cursor-pointer hover:scale-102"
                            >
                              Quick Submit
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 2. COMPLETION METADATA CARD */}
                    {item.type === 'completion' && item.completionInfo && (
                      <div className="mt-2.5 p-2.5 rounded-xl bg-[#40e3bd]/5 border border-[#40e3bd]/20 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-zinc-400">Learner:</span>
                          <span className="text-zinc-200 font-medium">
                            {item.completionInfo.learnerName}
                          </span>
                        </div>
                        {item.completionInfo.grade && (
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-zinc-400">Standing:</span>
                            <span className="text-[#40e3bd] font-mono font-bold">
                              {item.completionInfo.grade}
                            </span>
                          </div>
                        )}
                        {item.completionInfo.certificateId && (
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-zinc-400">Certificate ID:</span>
                            <span className="text-zinc-300 font-mono text-[10px]">
                              {item.completionInfo.certificateId}
                            </span>
                          </div>
                        )}
                        {item.completionInfo.accreditedHours && (
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-zinc-400">Accredited Hours:</span>
                            <span className="text-[#40e3bd] font-mono">
                              +{item.completionInfo.accreditedHours} hrs on iGOT
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 3. PEER INTERACTION METADATA CARD */}
                    {item.type === 'peer' && item.peerInfo && (
                      <div className="mt-2.5 p-2.5 rounded-xl bg-indigo-500/5 border border-indigo-500/20 space-y-2">
                        <div className="flex items-center gap-2">
                          <img
                            src={item.peerInfo.peerAvatar}
                            alt={item.peerInfo.peerName}
                            referrerPolicy="no-referrer"
                            className="w-6 h-6 rounded-full object-cover border border-indigo-500/40"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-zinc-200 truncate">
                              {item.peerInfo.peerName}
                            </div>
                            <div className="text-[10px] text-zinc-400 truncate">
                              {item.peerInfo.peerRole}
                            </div>
                          </div>
                        </div>

                        {item.peerInfo.targetTopic && (
                          <div className="text-[11px] text-indigo-300/80 font-mono">
                            Thread: {item.peerInfo.targetTopic}
                          </div>
                        )}

                        {item.peerInfo.lastReply && (
                          <div className="p-2 rounded-lg bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-300 flex items-start gap-2">
                            <CornerDownRight className="w-3.5 h-3.5 text-[#40e3bd] shrink-0 mt-0.5" />
                            <div className="space-y-0.5">
                              <span className="text-[10px] font-mono text-zinc-400">Your reply:</span>
                              <p>{item.peerInfo.lastReply}</p>
                            </div>
                          </div>
                        )}

                        {/* Inline Reply Form */}
                        {activeReplyId === item.id && (
                          <div className="mt-2 pt-2 border-t border-indigo-500/20 space-y-2">
                            <textarea
                              value={replyInputText}
                              onChange={e => setReplyInputText(e.target.value)}
                              placeholder={`Reply directly to ${item.peerInfo.peerName.split(' ')[0]}...`}
                              rows={2}
                              className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl p-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-400"
                              autoFocus
                            />
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setActiveReplyId(null);
                                  setReplyInputText('');
                                }}
                                className="px-2.5 py-1 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSendReply(item.id)}
                                disabled={!replyInputText.trim()}
                                className="px-3 py-1 rounded-lg bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Send className="w-3 h-3" />
                                <span>Send Reply</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Bottom Actions Bar */}
                    <div className="mt-3 pt-2.5 border-t border-zinc-800/60 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleActionClick(item)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#40e3bd] hover:text-[#7ef7d8] transition-colors cursor-pointer"
                      >
                        <span>{item.actionText || (item.type === 'peer' ? 'Reply' : 'View Details')}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>

                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => item.read ? markAsUnread(item.id) : markAsRead(item.id)}
                          className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs transition-colors cursor-pointer"
                          title={item.read ? 'Mark as unread' : 'Mark as read'}
                        >
                          <Check className={`w-3.5 h-3.5 ${item.read ? 'text-zinc-500' : 'text-[#40e3bd]'}`} />
                        </button>
                        <button
                          onClick={() => dismissNotification(item.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-500/20 text-zinc-500 hover:text-rose-400 text-xs transition-colors cursor-pointer"
                          title="Dismiss notification"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Sticky Drawer Footer: Real-Time Event Simulator */}
            <div className="p-3 sm:p-4 border-t border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
              <div className="flex items-center justify-between gap-2">
                <div className="relative">
                  <button
                    onClick={() => setSimMenuOpen(prev => !prev)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-xs font-medium text-zinc-200 hover:text-[#40e3bd] transition-all cursor-pointer"
                    title="Simulate incoming real-time notifications to test live panel"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#40e3bd]" />
                    <span>Simulate Live Event</span>
                  </button>

                  {/* Simulator Dropdown */}
                  {simMenuOpen && (
                    <div className="absolute bottom-full left-0 mb-2 w-56 rounded-xl bg-[#141720] border border-zinc-700 shadow-2xl p-1.5 z-30 space-y-1 text-xs">
                      <div className="px-2 py-1 text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                        Generate Live Event
                      </div>
                      <button
                        onClick={() => {
                          simulateIncoming('deadline');
                          setSimMenuOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-amber-500/20 hover:text-amber-300 text-zinc-300 flex items-center gap-2 cursor-pointer"
                      >
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Assignment Deadline</span>
                      </button>
                      <button
                        onClick={() => {
                          simulateIncoming('completion');
                          setSimMenuOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#40e3bd]/20 hover:text-[#40e3bd] text-zinc-300 flex items-center gap-2 cursor-pointer"
                      >
                        <Award className="w-3.5 h-3.5 text-[#40e3bd]" />
                        <span>Course Completion</span>
                      </button>
                      <button
                        onClick={() => {
                          simulateIncoming('peer');
                          setSimMenuOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-indigo-500/20 hover:text-indigo-300 text-zinc-300 flex items-center gap-2 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Peer Interaction</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={resetNotifications}
                    className="text-[11px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1 cursor-pointer"
                    title="Restore default seed notifications"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span className="hidden sm:inline">Reset</span>
                  </button>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
