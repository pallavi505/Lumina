import { motion, AnimatePresence } from 'motion/react';
import { Clock, Award, MessageSquare, ArrowRight, X } from 'lucide-react';
import { useLiveNotifications } from '../context/NotificationContext';

export default function LiveNotificationToast({
  onNavigate
}: {
  onNavigate?: (view: string, courseId?: string) => void;
}) {
  const { activeToast, dismissToast, openDrawer, markAsRead } = useLiveNotifications();

  if (!activeToast) return null;

  const handleOpenDetails = () => {
    markAsRead(activeToast.id);
    dismissToast();
    openDrawer();
  };

  const handleQuickAction = () => {
    markAsRead(activeToast.id);
    dismissToast();
    if (activeToast.targetView && onNavigate) {
      onNavigate(activeToast.targetView, activeToast.targetCourseId);
    } else {
      openDrawer();
    }
  };

  return (
    <div className="fixed top-18 right-4 sm:right-6 z-50 pointer-events-none max-w-sm sm:max-w-md w-full">
      <AnimatePresence>
        <motion.div
          key={activeToast.id}
          initial={{ opacity: 0, y: -20, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="pointer-events-auto bg-[#0f1218]/95 border border-zinc-700/80 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl rounded-2xl p-4 text-zinc-100 flex flex-col gap-2.5 overflow-hidden relative"
        >
          {/* Top accent pulse border */}
          <div 
            className={`absolute top-0 left-0 right-0 h-1 ${
              activeToast.type === 'deadline' 
                ? 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.6)]' 
                : activeToast.type === 'completion' 
                ? 'bg-[#40e3bd] shadow-[0_0_12px_rgba(64,227,189,0.6)]' 
                : 'bg-indigo-400 shadow-[0_0_12px_rgba(129,140,248,0.6)]'
            }`} 
          />

          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div 
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                  activeToast.type === 'deadline'
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : activeToast.type === 'completion'
                    ? 'bg-[#40e3bd]/20 border-[#40e3bd]/40 text-[#40e3bd]'
                    : 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                }`}
              >
                {activeToast.type === 'deadline' && <Clock className="w-4 h-4" />}
                {activeToast.type === 'completion' && <Award className="w-4 h-4" />}
                {activeToast.type === 'peer' && <MessageSquare className="w-4 h-4" />}
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono tracking-wide uppercase px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-semibold">
                    {activeToast.type === 'deadline' ? 'Deadline Alert' : activeToast.type === 'completion' ? 'Completion' : 'Peer Interaction'}
                  </span>
                  {activeToast.priority === 'urgent' && (
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold">
                      Urgent
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-zinc-100 line-clamp-1 mt-0.5">
                  {activeToast.title}
                </h4>
              </div>
            </div>

            <button
              onClick={dismissToast}
              className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 transition-colors"
              title="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed pl-10">
            {activeToast.description}
          </p>

          <div className="flex items-center justify-between pl-10 pt-1 border-t border-zinc-800/60">
            <button
              onClick={handleOpenDetails}
              className="text-[11px] text-zinc-400 hover:text-[#40e3bd] transition-colors"
            >
              View in Live Feed
            </button>
            <button
              onClick={handleQuickAction}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#40e3bd]/15 hover:bg-[#40e3bd]/25 border border-[#40e3bd]/40 text-[#40e3bd] text-xs font-semibold transition-all hover:scale-102 cursor-pointer"
            >
              <span>{activeToast.actionText || 'Take Action'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
