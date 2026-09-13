import { motion } from 'motion/react';
import { 
  LogOut, 
  Sparkles, 
  BookOpen, 
  Flame, 
  Layers, 
  Play, 
  Clock, 
  ChevronRight, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import type { DemoAccount } from '../types';
import LuminaLogo from './LuminaLogo';

interface LuminaWorkspacePreviewProps {
  account: DemoAccount;
  onLogout: () => void;
}

export default function LuminaWorkspacePreview({ account, onLogout }: LuminaWorkspacePreviewProps) {
  return (
    <motion.div
      id="lumina-authenticated-workspace"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative z-20 w-full max-w-4xl mx-auto px-4 py-6"
    >
      {/* Container Card */}
      <div className="rounded-3xl bg-[#0e0e11]/95 backdrop-blur-2xl border border-zinc-800 p-6 sm:p-8 lumina-glow-card shadow-2xl text-zinc-100">
        {/* Workspace Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={account.avatar}
                alt={account.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-zinc-500 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-zinc-900" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-white">
                  Welcome back, {account.name}!
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-600 text-[11px] font-semibold text-zinc-300 uppercase tracking-wide">
                  {account.role}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 mt-0.5 flex items-center gap-2">
                <span>{account.title}</span>
                <span>•</span>
                <span className="text-zinc-300 font-mono">{account.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              id="btn-workspace-logout"
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-850 hover:bg-zinc-800 border border-zinc-700 text-xs font-medium text-zinc-200 hover:text-white transition-all cursor-pointer shadow-sm"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>Sign Out / Return to Portal</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 my-6">
          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs">Learning Streak</span>
              <Flame className="w-4 h-4 text-[#40e3bd]" />
            </div>
            <div className="text-2xl font-bold font-['Space_Grotesk'] text-[#40e3bd]">48 Days</div>
            <div className="text-[11px] text-zinc-400 mt-1">Top 2% consistent</div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs">Active Modules</span>
              <BookOpen className="w-4 h-4 text-[#40e3bd]" />
            </div>
            <div className="text-2xl font-bold font-['Space_Grotesk'] text-white">{account.coursesCount} Enrolled</div>
            <div className="text-[11px] text-zinc-400 mt-1">2 due this Friday</div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs">Skill Mastery</span>
              <Sparkles className="w-4 h-4 text-[#40e3bd]" />
            </div>
            <div className="text-2xl font-bold font-['Space_Grotesk'] text-[#a3f7e2]">94.8%</div>
            <div className="text-[11px] text-zinc-400 mt-1">+6.2% this month</div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs">Security State</span>
              <ShieldCheck className="w-4 h-4 text-[#40e3bd]" />
            </div>
            <div className="text-2xl font-bold font-['Space_Grotesk'] text-[#40e3bd]">Zero Trust</div>
            <div className="text-[11px] text-[#40e3bd]/80 mt-1">Session active (1h)</div>
          </div>
        </div>

        {/* Current Lab in Progress */}
        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-700 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#40e3bd]/15 text-[#40e3bd] border border-[#40e3bd]/40 uppercase tracking-wider">
                  Active Session
                </span>
                <span className="text-xs text-zinc-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#40e3bd]" /> 24 mins remaining
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white font-['Space_Grotesk']">
                National Statistics & Macroeconomic Aggregates Lab
              </h3>
              <p className="text-xs text-zinc-400">
                Interactive official statistical modeler with real-time survey aggregation telemetry.
              </p>
            </div>

            <button
              id="btn-resume-lab"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#40e3bd] via-[#35d8b2] to-[#20b892] hover:from-[#5ef8d5] hover:to-[#35d8b2] text-[#052219] font-bold font-['Space_Grotesk'] text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(64,227,189,0.35)] transition-all cursor-pointer whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Resume Interactive Lab</span>
            </button>
          </div>
        </div>

        {/* Active Enrolled Courses */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-300 font-['Space_Grotesk']">
              Recommended for your track
            </h4>
            <span className="text-xs text-zinc-400 hover:text-[#40e3bd] flex items-center gap-1 cursor-pointer hover:underline">
              View full catalog <ChevronRight className="w-3 h-3 text-[#40e3bd]" />
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 hover:border-[#40e3bd]/50 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#40e3bd]/10 border border-[#40e3bd]/30 flex items-center justify-center text-[#40e3bd]">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Sample Survey Methodology & CPI Estimation</div>
                  <div className="text-[11px] text-zinc-400">Instructor: Prof. Sterling • 8 Labs</div>
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-[#40e3bd]" />
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 hover:border-[#40e3bd]/50 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#40e3bd]/10 border border-[#40e3bd]/30 flex items-center justify-center text-[#40e3bd]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Predictive Time-Series & Econometric Indices</div>
                  <div className="text-[11px] text-zinc-400">Instructor: Dr. Julian Hayes • 12 Labs</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#40e3bd]/10 text-[10px] text-[#40e3bd] border border-[#40e3bd]/30">In Progress</span>
            </div>
          </div>
        </div>

        {/* Footer brand stamp */}
        <div className="mt-8 pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <LuminaLogo size="sm" showTagline={false} />
            <span>Lumina Institutional Portal v4.2</span>
          </div>
          <span className="text-[11px] font-mono text-zinc-500">
            Grid Node: in-delhi-01 • Latency: 4ms
          </span>
        </div>
      </div>
    </motion.div>
  );
}
