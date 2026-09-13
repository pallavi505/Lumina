import React from 'react';
import { motion } from 'motion/react';
import { 
  Clock, 
  TrendingUp, 
  BookOpen, 
  HelpCircle, 
  ArrowUpRight, 
  Sparkles, 
  CheckCircle2, 
  Award,
  Zap,
  ChevronRight
} from 'lucide-react';
import type { CourseEnrollment } from '../types';

interface TraineeMetricsGridProps {
  totalHours: number;
  skillIndex: number;
  enrollments: CourseEnrollment[];
  pendingQuizzesCount: number;
  onLaunchPendingQuiz: () => void;
  onViewMyCourses: () => void;
}

export default function TraineeMetricsGrid({
  totalHours,
  skillIndex,
  enrollments,
  pendingQuizzesCount,
  onLaunchPendingQuiz,
  onViewMyCourses
}: TraineeMetricsGridProps) {
  const completedCount = enrollments.filter(e => e.completed || e.progress === 100).length;
  const inProgressCount = enrollments.length - completedCount;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Metric 1: Learning Hours */}
      <motion.div
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
        className="relative overflow-hidden rounded-2xl p-5 border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-xl shadow-lg hover:border-[#40e3bd]/40 transition-all group"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-cyan-500/20 transition-all" />
        
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Clock className="w-5 h-5" />
          </div>
          <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <ArrowUpRight className="w-3 h-3" />
            +4.8h this week
          </span>
        </div>

        <div className="space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white tracking-tight">
            {totalHours.toFixed(1)} <span className="text-sm font-normal text-zinc-400">hrs</span>
          </div>
          <p className="text-xs font-semibold text-zinc-300">Total Learning Hours</p>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
          <span className="text-zinc-400">Weekly Goal: 10 hrs</span>
          <span className="text-[#40e3bd] font-mono font-semibold">48% achieved</span>
        </div>
        <div className="w-full bg-zinc-800/80 rounded-full h-1 mt-1.5 overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-[#40e3bd] h-full rounded-full" style={{ width: '48%' }} />
        </div>
      </motion.div>

      {/* Metric 2: Skill Index */}
      <motion.div
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
        className="relative overflow-hidden rounded-2xl p-5 border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-xl shadow-lg hover:border-[#40e3bd]/40 transition-all group"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#40e3bd]/10 rounded-full blur-xl pointer-events-none group-hover:bg-[#40e3bd]/20 transition-all" />
        
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#40e3bd]/15 border border-[#40e3bd]/30 flex items-center justify-center text-[#40e3bd]">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-[#40e3bd] bg-[#40e3bd]/10 px-2 py-0.5 rounded-full border border-[#40e3bd]/25">
            <Zap className="w-3 h-3 fill-current" />
            Top 8% Cadre
          </span>
        </div>

        <div className="space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white tracking-tight flex items-baseline gap-1.5">
            {skillIndex} <span className="text-sm font-normal text-zinc-400">/ 100</span>
          </div>
          <p className="text-xs font-semibold text-zinc-300">Composite Skill Index</p>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
          <span className="text-zinc-400">Cadre Benchmark: 80</span>
          <span className="text-emerald-400 font-mono font-semibold">+12 pts ahead</span>
        </div>
        <div className="w-full bg-zinc-800/80 rounded-full h-1 mt-1.5 overflow-hidden">
          <div className="bg-gradient-to-r from-[#20b892] to-[#40e3bd] h-full rounded-full" style={{ width: `${skillIndex}%` }} />
        </div>
      </motion.div>

      {/* Metric 3: Enrolled Courses */}
      <motion.div
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
        onClick={onViewMyCourses}
        className="relative overflow-hidden rounded-2xl p-5 border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-xl shadow-lg hover:border-[#40e3bd]/40 transition-all group cursor-pointer"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-purple-500/20 transition-all" />
        
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="flex items-center gap-1 text-[11px] font-mono font-semibold text-zinc-400 group-hover:text-purple-300 transition-colors">
            <span>View All</span>
            <ChevronRight className="w-3 h-3" />
          </span>
        </div>

        <div className="space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white tracking-tight">
            {enrollments.length} <span className="text-sm font-normal text-zinc-400">tracks</span>
          </div>
          <p className="text-xs font-semibold text-zinc-300">Enrolled Courses</p>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
          <span className="text-zinc-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            {completedCount} Mastered
          </span>
          <span className="text-zinc-400">
            {inProgressCount} In Progress
          </span>
        </div>
        <div className="w-full bg-zinc-800/80 rounded-full h-1 mt-1.5 overflow-hidden flex">
          <div 
            className="bg-emerald-400 h-full" 
            style={{ width: `${enrollments.length > 0 ? (completedCount / enrollments.length) * 100 : 0}%` }} 
          />
          <div 
            className="bg-purple-400 h-full" 
            style={{ width: `${enrollments.length > 0 ? (inProgressCount / enrollments.length) * 100 : 0}%` }} 
          />
        </div>
      </motion.div>

      {/* Metric 4: Pending Quizzes */}
      <motion.div
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
        onClick={onLaunchPendingQuiz}
        className="relative overflow-hidden rounded-2xl p-5 border border-amber-500/40 bg-gradient-to-b from-amber-500/10 via-zinc-900/70 to-zinc-900/60 backdrop-blur-xl shadow-lg hover:border-amber-400 transition-all group cursor-pointer"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/15 rounded-full blur-xl pointer-events-none group-hover:bg-amber-500/25 transition-all" />
        
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
            <HelpCircle className="w-5 h-5" />
          </div>
          <span className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Action Ready
          </span>
        </div>

        <div className="space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white tracking-tight">
            {pendingQuizzesCount} <span className="text-sm font-normal text-amber-200/80">pending</span>
          </div>
          <p className="text-xs font-semibold text-zinc-200">Pending Quizzes & Badges</p>
        </div>

        <div className="mt-4 pt-3 border-t border-amber-500/20 flex items-center justify-between">
          <span className="text-[11px] text-amber-200/90 font-medium">Verify & Unlock Badges</span>
          <span className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-[#07080b] font-bold text-[10px] font-['Space_Grotesk'] flex items-center gap-1 shadow-sm transition-all">
            <span>Take Quiz</span>
            <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </motion.div>
    </div>
  );
}
