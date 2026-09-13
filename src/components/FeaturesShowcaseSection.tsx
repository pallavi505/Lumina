import { motion } from 'motion/react';
import { 
  Bell, 
  Sparkles, 
  PlayCircle, 
  ShieldCheck, 
  Award, 
  BarChart3, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  GraduationCap, 
  School, 
  Building2,
  Lock
} from 'lucide-react';

interface FeaturesShowcaseSectionProps {
  onNavigateToLogin: () => void;
}

export default function FeaturesShowcaseSection({ onNavigateToLogin }: FeaturesShowcaseSectionProps) {
  const features = [
    {
      id: 'live-notifications',
      title: 'Persistent Live Notification & Deadline Engine',
      category: 'Real-Time Telemetry',
      badge: 'Integrated into Dashboard',
      roles: ['Trainee', 'Trainer', 'Admin'],
      icon: Bell,
      accentColor: 'text-[#40e3bd]',
      borderColor: 'border-[#40e3bd]/30',
      bgColor: 'bg-[#40e3bd]/10',
      description: 'Persistent slide-out notification drawer with live countdown timers for assignment deadlines, instant peer interaction alerts, and course mastery updates.',
      highlights: [
        'Urgent deadline countdown timers with visual status indicators',
        'Category filtering (Assignments, Milestones, Community, Alerts)',
        'Audio chime alerts with mute toggle & one-click course navigation'
      ]
    },
    {
      id: 'ai-curriculum-generator',
      title: 'Gemini AI Course Studio & Curriculum Builder',
      category: 'Adaptive AI Engine',
      badge: 'Integrated into Dashboard',
      roles: ['Trainee', 'Trainer', 'Admin'],
      icon: Sparkles,
      accentColor: 'text-purple-400',
      borderColor: 'border-purple-500/30',
      bgColor: 'bg-purple-500/10',
      description: 'Generate comprehensive 4-module statistical curriculums in seconds. Powered by Gemini AI with syllabus sequencing, grounded video lectures, and practice quizzes.',
      highlights: [
        'Natural-language prompt to full syllabus generation',
        'Official video lesson integration with lesson notes',
        'Pre-configured MoSPI statistical prompt templates'
      ]
    },
    {
      id: 'interactive-classroom',
      title: 'Interactive Multi-Chapter Classroom & Quiz Player',
      category: 'Learning Player',
      badge: 'Integrated into Dashboard',
      roles: ['Trainee'],
      icon: PlayCircle,
      accentColor: 'text-cyan-400',
      borderColor: 'border-cyan-500/30',
      bgColor: 'bg-cyan-500/10',
      description: 'Immersive course classroom featuring high-definition video player, playback speed controls, interactive chapter quizzes, and progress persistence.',
      highlights: [
        'Multi-module video player with speed controls & notes',
        'Auto-graded multiple choice chapter check assessments',
        'Instant progress checkpointing and module unlock sequence'
      ]
    },
    {
      id: 'tri-role-portals',
      title: 'Tri-Role Institutional Login Portals',
      category: 'Access Control',
      badge: 'Trainee • Trainer • Admin',
      roles: ['Trainee', 'Trainer', 'Admin'],
      icon: ShieldCheck,
      accentColor: 'text-amber-400',
      borderColor: 'border-amber-500/30',
      bgColor: 'bg-amber-500/10',
      description: 'Role-customized experiences for Indian Statistical Service (ISS) Trainees, Faculty Trainers designing curriculums, and Institutional Administrators managing governance.',
      highlights: [
        'Trainee Portal: Learning tracks, quizzes, deadline alerts & certificates',
        'Trainer Portal: AI curriculum authoring, submissions review & cohorts',
        'Admin Portal: Institutional compliance, audits & academy metrics'
      ]
    },
    {
      id: 'verified-credentials',
      title: 'Verifiable MoSPI Digital Certificates & Badges',
      category: 'Accreditation',
      badge: 'Integrated into Dashboard',
      roles: ['Trainee'],
      icon: Award,
      accentColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
      bgColor: 'bg-emerald-500/10',
      description: 'Earn cryptographically stamped completion certificates and civil competency skill badges aligned with National Statistical Office standards.',
      highlights: [
        'Unique verifiable verification hash and credential ID',
        'Official Government of India & MoSPI seal rendering',
        'Printable and downloadable high-res vector diplomas'
      ]
    },
    {
      id: 'competency-radar',
      title: 'Dynamic Competency Radar & Skill Gap Analysis',
      category: 'Analytics & Benchmarking',
      badge: 'Integrated into Dashboard',
      roles: ['Trainee'],
      icon: BarChart3,
      accentColor: 'text-blue-400',
      borderColor: 'border-blue-500/30',
      bgColor: 'bg-blue-500/10',
      description: 'Interactive radar charts evaluating personal statistical skill depth across 6 national dimensions, benchmarked against iGOT Karmayogi civil standards.',
      highlights: [
        'Recharts-powered multi-axial skill visualization',
        'Personal proficiency vs. national target benchmark comparison',
        'Targeted pathway recommendations to close identified skill gaps'
      ]
    }
  ];

  return (
    <section 
      id="platform-features"
      className="relative z-20 w-full max-w-6xl mx-auto px-4 py-12 sm:py-16"
    >
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900 border border-[#40e3bd]/30 text-xs font-mono text-[#40e3bd]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Platform Capabilities & Features</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-['Space_Grotesk'] text-white tracking-tight">
          Engineered for India's Statistical Excellence
        </h2>

        <p className="text-sm sm:text-base text-zinc-300 font-['Inter'] leading-relaxed">
          The features below are active and fully operational inside your authenticated Lumina dashboard. 
          To protect institutional training integrity, please sign in via your specific portal to access them.
        </p>

        <div className="pt-2 flex items-center justify-center gap-2 text-xs text-zinc-400">
          <Lock className="w-3.5 h-3.5 text-[#40e3bd]" />
          <span>Login required for interactive access • Choose Trainee, Trainer, or Admin on the login page</span>
        </div>
      </div>

      {/* Grid of 6 Feature Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <motion.div
              key={feat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="rounded-3xl border border-zinc-800/90 bg-zinc-900/80 p-6 flex flex-col justify-between space-y-5 hover:border-[#40e3bd]/50 hover:bg-zinc-900/95 transition-all shadow-xl group relative overflow-hidden"
            >
              {/* Top Accent Pill */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                  {feat.category}
                </span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-[#40e3bd] border border-zinc-700">
                  {feat.badge}
                </span>
              </div>

              {/* Title & Icon */}
              <div className="space-y-3">
                <div className={`w-12 h-12 rounded-2xl ${feat.bgColor} ${feat.borderColor} border flex items-center justify-center ${feat.accentColor} shadow-inner`}>
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white group-hover:text-[#40e3bd] transition-colors leading-snug">
                  {feat.title}
                </h3>

                <p className="text-xs text-zinc-300 font-['Inter'] leading-relaxed">
                  {feat.description}
                </p>
              </div>

              {/* Highlights Checklist */}
              <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                  Key Capabilities:
                </span>
                <ul className="space-y-1.5">
                  {feat.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#40e3bd] shrink-0 mt-0.5" />
                      <span className="leading-tight">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Role Tags & Portal Action */}
              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  {feat.roles.map((r) => (
                    <span key={r} className="px-2 py-0.5 rounded-md bg-zinc-800/90 text-[10px] font-mono text-zinc-400">
                      {r}
                    </span>
                  ))}
                </div>

                <button
                  onClick={onNavigateToLogin}
                  className="inline-flex items-center gap-1.5 text-xs font-bold font-['Space_Grotesk'] text-[#40e3bd] hover:text-[#7cfce0] transition-colors cursor-pointer group-hover:translate-x-0.5"
                >
                  <span>Login to Use</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Central Banner Encouraging Login */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="mt-12 rounded-3xl border border-[#40e3bd]/30 bg-gradient-to-r from-zinc-950 via-[#061e16] to-zinc-950 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl"
      >
        <div className="space-y-2 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-[#40e3bd] font-mono">
            <GraduationCap className="w-4 h-4" />
            <span>Ready to begin your training?</span>
          </div>
          <h4 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-white">
            Access Your Customized Trainee, Trainer, or Admin Dashboard
          </h4>
          <p className="text-xs text-zinc-300 max-w-xl">
            Choose your login type on the portal login page to enter your personal workspace, track active deadlines, generate AI curriculums, and verify credentials.
          </p>
        </div>

        <button
          onClick={onNavigateToLogin}
          className="shrink-0 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#40e3bd] to-[#20b892] hover:from-[#5ef8d5] text-[#052219] font-bold font-['Space_Grotesk'] text-sm shadow-[0_0_20px_rgba(64,227,189,0.35)] flex items-center gap-2 cursor-pointer hover:scale-105 transition-all"
        >
          <span>Go to Portal Login</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </motion.div>
    </section>
  );
}
