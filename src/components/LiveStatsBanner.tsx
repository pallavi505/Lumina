import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, FileCheck2, Target, Activity, ShieldCheck, ArrowUpRight } from 'lucide-react';

interface StatMetric {
  id: string;
  label: string;
  targetValue: number;
  format: (n: number) => string;
  detail: string;
  trend: string;
  icon: typeof Users;
  accentColor: string;
  glowColor: string;
}

const STATS_DATA: StatMetric[] = [
  {
    id: 'officials-trained',
    label: 'Officials Trained',
    targetValue: 48250,
    format: (n) => `${n.toLocaleString('en-IN')}+`,
    detail: 'Across ISS, SSS, and State Statistical Directorates',
    trend: '+18.4% this quarter',
    icon: Users,
    accentColor: 'from-[#40e3bd] to-[#20b892]',
    glowColor: 'rgba(64, 227, 189, 0.25)',
  },
  {
    id: 'mcqs-generated',
    label: 'MCQs & Assessments',
    targetValue: 2450000,
    format: (n) => `${(n / 1000000).toFixed(2)}M+`,
    detail: 'Adaptive IRT items evaluated with automated grading',
    trend: '+320K this month',
    icon: FileCheck2,
    accentColor: 'from-[#6ef8d7] to-[#1ea383]',
    glowColor: 'rgba(110, 248, 215, 0.22)',
  },
  {
    id: 'competencies-mapped',
    label: 'Competencies Mapped',
    targetValue: 348,
    format: (n) => `${n}`,
    detail: 'iGOT Karmayogi civil service competency framework',
    trend: '100% Cadre Alignment',
    icon: Target,
    accentColor: 'from-[#40e3bd] to-zinc-500',
    glowColor: 'rgba(64, 227, 189, 0.22)',
  },
  {
    id: 'system-uptime',
    label: 'GovCloud Reliability',
    targetValue: 99.98,
    format: (n) => `${n.toFixed(2)}%`,
    detail: 'Zero-trust NIC high-availability operational SLA',
    trend: 'Sub-30ms Latency',
    icon: Activity,
    accentColor: 'from-white to-[#40e3bd]',
    glowColor: 'rgba(64, 227, 189, 0.25)',
  },
];

export default function LiveStatsBanner() {
  const [counts, setCounts] = useState<Record<string, number>>({
    'officials-trained': 0,
    'mcqs-generated': 0,
    'competencies-mapped': 0,
    'system-uptime': 0,
  });

  useEffect(() => {
    let animationFrameId: number;
    const startTime = performance.now();
    const duration = 1800; // ms

    const animateCounters = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      const nextCounts: Record<string, number> = {};
      STATS_DATA.forEach((stat) => {
        nextCounts[stat.id] = stat.targetValue * easeProgress;
      });

      setCounts(nextCounts);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animateCounters);
      }
    };

    animationFrameId = requestAnimationFrame(animateCounters);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <section 
      id="live-statistics-banner"
      className="relative z-20 w-full max-w-6xl mx-auto px-4 py-8 sm:py-12"
    >
      {/* Section Header with Live Pulse */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#40e3bd] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#40e3bd]" />
            </span>
            <span className="text-xs uppercase tracking-widest font-mono text-[#40e3bd] font-semibold">
              Live Telemetry • All-India Statistical Network
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-white tracking-tight">
            Impact Metrics Across the Republic
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-400 font-['Inter']">
          <ShieldCheck className="w-4 h-4 text-[#40e3bd]" />
          <span>Synced with MoSPI Central Dashboard</span>
        </div>
      </div>

      {/* Grid of 4 High-Impact Animated Cards in Grey/Silver with #40e3bd Accents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {STATS_DATA.map((stat, idx) => {
          const Icon = stat.icon;
          const displayVal = stat.format(counts[stat.id] || 0);

          return (
            <motion.div
              key={stat.id}
              id={`stat-card-${stat.id}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="relative group rounded-2xl bg-zinc-900/85 backdrop-blur-xl border border-zinc-800/90 p-5 sm:p-6 overflow-hidden shadow-xl hover:border-[#40e3bd]/50 hover:shadow-[0_0_30px_rgba(64,227,189,0.15)] transition-all duration-300"
            >
              {/* Corner Ambient Glow */}
              <div
                className="absolute -top-12 -right-12 w-28 h-28 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none"
                style={{ backgroundColor: stat.glowColor }}
              />

              {/* Top Row: Icon and Trend */}
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${stat.accentColor} p-0.5 shadow-md`}>
                  <div className="w-full h-full rounded-[10px] bg-[#0c0d10] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#40e3bd]" />
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-semibold text-[#40e3bd] px-2 py-0.5 rounded-full bg-[#40e3bd]/10 border border-[#40e3bd]/30 font-mono">
                  <span>{stat.trend}</span>
                  <ArrowUpRight className="w-3 h-3 text-[#40e3bd]" />
                </div>
              </div>

              {/* Main Counter Metric */}
              <div className="space-y-1">
                <div 
                  className={`text-3xl sm:text-4xl font-extrabold font-['Space_Grotesk'] tracking-tight text-white group-hover:text-[#40e3bd] transition-colors`}
                >
                  {displayVal}
                </div>
                <div className="text-sm font-semibold text-zinc-300 font-['Space_Grotesk']">
                  {stat.label}
                </div>
              </div>

              {/* Explanatory Subtext */}
              <p className="mt-3 pt-3 border-t border-zinc-800/60 text-xs text-zinc-400 font-['Inter'] leading-relaxed">
                {stat.detail}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
