import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Clock, 
  AlertCircle, 
  MessageSquare, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  Sparkles,
  ExternalLink,
  Send,
  Zap,
  ChevronRight
} from 'lucide-react';
import { useLiveNotifications } from '../context/NotificationContext';
import type { LiveNotificationItem, AICourse } from '../types';

interface TraineeLiveFeedWidgetProps {
  courses: AICourse[];
  onContinueCourse: (course: AICourse) => void;
  onLaunchQuiz: () => void;
}

export default function TraineeLiveFeedWidget({
  courses,
  onContinueCourse,
  onLaunchQuiz
}: TraineeLiveFeedWidgetProps) {
  const { 
    notifications, 
    unreadCount, 
    urgentDeadlinesCount, 
    openDrawer, 
    markAsRead, 
    submitAssignment,
    simulateIncoming,
    soundEnabled, 
    toggleSound 
  } = useLiveNotifications();

  const [activeSubTab, setActiveSubTab] = useState<'deadlines' | 'peers' | 'completions'>('deadlines');

  // Filter specific feeds
  const deadlineNotifs = notifications.filter(n => n.type === 'deadline');
  const peerNotifs = notifications.filter(n => n.type === 'peer');
  const completionNotifs = notifications.filter(n => n.type === 'completion');

  const displayedList = activeSubTab === 'deadlines' 
    ? deadlineNotifs 
    : activeSubTab === 'peers' 
    ? peerNotifs 
    : completionNotifs;

  const handleAction = (item: LiveNotificationItem) => {
    markAsRead(item.id);
    const targetCourseId = item.targetCourseId || item.deadlineInfo?.courseId || item.completionInfo?.courseId;
    if (targetCourseId) {
      const match = courses.find(c => c.id === targetCourseId);
      if (match) {
        onContinueCourse(match);
        return;
      }
    }
    if (item.type === 'deadline' && !item.deadlineInfo?.submitted) {
      submitAssignment(item.id);
    } else if (item.title.toLowerCase().includes('quiz') || item.description.toLowerCase().includes('quiz')) {
      onLaunchQuiz();
    } else {
      openDrawer();
    }
  };

  return (
    <div 
      id="trainee-live-feed-widget"
      className="rounded-3xl border border-zinc-800/90 bg-gradient-to-br from-zinc-900/90 via-zinc-900/60 to-zinc-950 p-6 shadow-xl backdrop-blur-xl space-y-5"
    >
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#40e3bd]/15 border border-[#40e3bd]/30 flex items-center justify-center text-[#40e3bd] shadow-[0_0_15px_rgba(64,227,189,0.2)]">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
                Live Cohort Feed & Urgent Deadlines
              </h3>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#40e3bd] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#40e3bd]" />
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Real-time assignment cutoffs, peer interactions, and MoSPI batch telemetry
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {urgentDeadlinesCount > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-[11px] font-mono font-bold flex items-center gap-1.5 animate-pulse">
              <Clock className="w-3 h-3" />
              <span>{urgentDeadlinesCount} Urgent Cutoff{urgentDeadlinesCount > 1 ? 's' : ''}</span>
            </span>
          )}

          <button
            onClick={toggleSound}
            aria-label={soundEnabled ? 'Mute notification chimes' : 'Enable notification chimes'}
            title={soundEnabled ? 'Chime sound enabled' : 'Chime sound muted'}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#40e3bd]" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
          </button>

          <button
            onClick={openDrawer}
            className="px-3.5 py-2 rounded-xl bg-[#40e3bd]/15 hover:bg-[#40e3bd]/25 border border-[#40e3bd]/40 text-xs font-bold font-['Space_Grotesk'] text-[#40e3bd] hover:text-[#5ef8d5] flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <span>Open Panel</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Sub-Tabs: Deadlines | Peer Discussions | Completions */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => setActiveSubTab('deadlines')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-['Space_Grotesk'] transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'deadlines'
                ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Assignment Deadlines ({deadlineNotifs.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('peers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-['Space_Grotesk'] transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'peers'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Peer Mentions ({peerNotifs.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('completions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-['Space_Grotesk'] transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'completions'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Completions ({completionNotifs.length})</span>
          </button>
        </div>

        {/* Simulator button */}
        <button
          onClick={() => simulateIncoming()}
          className="text-[11px] font-mono text-zinc-400 hover:text-[#40e3bd] flex items-center gap-1 cursor-pointer transition-colors"
          title="Simulate a new incoming real-time alert"
        >
          <Zap className="w-3 h-3 text-[#40e3bd]" />
          <span>Simulate Live Alert</span>
        </button>
      </div>

      {/* Notification items list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <AnimatePresence mode="popLayout">
          {displayedList.slice(0, 4).map((item) => {
            const isDeadline = item.type === 'deadline';
            const isPeer = item.type === 'peer';
            const isCompletion = item.type === 'completion';

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`rounded-2xl p-4 border transition-all flex flex-col justify-between space-y-3 ${
                  !item.read
                    ? 'bg-zinc-900/90 border-zinc-700/80 hover:border-[#40e3bd]/50 shadow-md'
                    : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase ${
                        isDeadline
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : isPeer
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {item.type}
                      </span>
                      {!item.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#40e3bd]" />
                      )}
                    </div>

                    {item.deadlineInfo && !item.deadlineInfo.submitted && (
                      <span className="text-[10px] font-mono text-amber-300 font-semibold flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                        <Clock className="w-2.5 h-2.5" />
                        {item.deadlineInfo.dueInHours}h left
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold font-['Space_Grotesk'] text-white line-clamp-1">
                    {item.title}
                  </h4>

                  <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-800/70 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                  </span>

                  <button
                    onClick={() => handleAction(item)}
                    className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-[#40e3bd] text-zinc-200 hover:text-[#052219] font-bold text-xs font-['Space_Grotesk'] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>{item.actionText || 'View Details'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Footer link to drawer */}
      <div className="pt-2 flex items-center justify-between text-xs text-zinc-400">
        <span>
          Showing {Math.min(4, displayedList.length)} of {notifications.length} live notifications in your feed
        </span>
        <button
          onClick={openDrawer}
          className="text-[#40e3bd] hover:underline font-bold flex items-center gap-1 cursor-pointer"
        >
          <span>View all in slide-out panel ({unreadCount} unread)</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
