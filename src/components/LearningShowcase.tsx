import { motion } from 'motion/react';
import { Award, Sparkles, BookOpen, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function LearningShowcase() {
  return (
    <div
      id="lumina-learning-showcase"
      className="hidden lg:flex flex-col justify-between w-full max-w-lg xl:max-w-xl z-10 py-6 pr-6 pointer-events-none select-none"
    >
      {/* Top Value Proposition & Live Metric */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="space-y-4"
      >
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-[#40e3bd]/30 backdrop-blur-md shadow-[0_0_15px_rgba(64,227,189,0.1)]">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#40e3bd] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#40e3bd]"></span>
          </span>
          <span className="text-xs font-medium text-[#40e3bd] tracking-wide font-['Space_Grotesk']">
            Lumina Institutional Learning Engine v4.2
          </span>
        </div>

        <h2 className="text-3xl xl:text-4xl font-bold font-['Space_Grotesk'] text-white leading-tight tracking-tight">
          Where knowledge turns into <br />
          <span className="lumina-gradient-text">limitless breakthrough.</span>
        </h2>
        
        <p className="text-sm xl:text-base text-zinc-400 font-normal leading-relaxed max-w-md font-['Inter']">
          Adaptive official statistical curriculums, interactive peer laboratories, and verifiable skill credentials designed for forward-thinking scholars and officers.
        </p>
      </motion.div>

      {/* Centerpiece: Stylized SVG Learning Illustration with Floating Glass Cards */}
      <div className="relative my-8 pointer-events-auto">
        {/* Soft back aura */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#40e3bd]/10 via-zinc-800/30 to-zinc-900/20 rounded-3xl blur-2xl transform -rotate-3" />

        {/* Custom Stylized Tech Learning Vector Art */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-10 w-full max-w-md mx-auto p-5 rounded-2xl bg-[#0e0e11]/80 border border-zinc-800 backdrop-blur-xl shadow-2xl"
        >
          {/* Top Window Bar */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#40e3bd]" />
              <span className="ml-2 font-mono text-[11px] text-zinc-400">lumina://workspace/statistical-systems</span>
            </div>
            <span className="flex items-center gap-1 text-[11px] text-[#40e3bd]">
              <Sparkles className="w-3 h-3 text-[#40e3bd] animate-spin-slow" />
              Live Sync
            </span>
          </div>

          {/* Interactive Learning Module Visualizer */}
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#40e3bd]/10 border border-[#40e3bd]/30 flex items-center justify-center text-[#40e3bd]">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white font-['Space_Grotesk']">National Accounts & Statistical Inference</div>
                  <div className="text-[11px] text-zinc-400">Module 07 of 12 • 4.9 ★★★★★</div>
                </div>
              </div>
              <span className="px-2 py-1 rounded bg-[#40e3bd]/10 border border-[#40e3bd]/30 text-[10px] font-medium text-[#40e3bd]">
                In Progress
              </span>
            </div>

            {/* Progress Track */}
            <div className="space-y-1.5 px-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-zinc-400">Curriculum Mastery</span>
                <span className="text-[#40e3bd] font-mono">87.4%</span>
              </div>
              <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden p-0.5 border border-zinc-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '87.4%' }}
                  transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-[#20b892] via-[#40e3bd] to-[#a3f7e2] shadow-[0_0_10px_rgba(64,227,189,0.5)]"
                />
              </div>
            </div>
          </div>

          {/* Micro floating stats badge 1 */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute -right-5 -top-4 p-3 rounded-xl bg-zinc-900/95 border border-[#40e3bd]/40 backdrop-blur-xl shadow-[0_10px_25px_rgba(0,0,0,0.5)] flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-full bg-[#40e3bd]/15 border border-[#40e3bd]/40 flex items-center justify-center text-[#40e3bd]">
              <Award className="w-4 h-4 text-[#40e3bd]" />
            </div>
            <div>
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider">Cohort Ranking</div>
              <div className="text-xs font-bold text-[#40e3bd] font-['Space_Grotesk']">Top 1% National</div>
            </div>
          </motion.div>

          {/* Micro floating stats badge 2 */}
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute -left-6 -bottom-5 p-3 rounded-xl bg-zinc-900/95 border border-[#40e3bd]/40 backdrop-blur-xl shadow-[0_10px_25px_rgba(0,0,0,0.5)] flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-full bg-[#40e3bd]/15 border border-[#40e3bd]/40 flex items-center justify-center text-[#40e3bd]">
              <TrendingUp className="w-4 h-4 text-[#40e3bd]" />
            </div>
            <div>
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider">Streak Record</div>
              <div className="text-xs font-bold text-[#a3f7e2] font-['Space_Grotesk']">48 Days Continuous</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Trust & Compliance Statement */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="pt-2 border-t border-zinc-800/80 flex items-center gap-4 text-xs text-zinc-400"
      >
        <div className="flex items-center gap-1.5 text-zinc-400">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#40e3bd]" />
          <span>MoSPI Statistical Grid</span>
        </div>
        <div className="flex items-center gap-1.5 text-zinc-400">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#40e3bd]" />
          <span>iGOT Karmayogi Linked</span>
        </div>
        <div className="flex items-center gap-1.5 text-zinc-400">
          <CheckCircle2 className="w-3.5 h-3.5 text-zinc-300" />
          <span>NIC e-Gov SSO</span>
        </div>
      </motion.div>
    </div>
  );
}
