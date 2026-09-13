import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  Target, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles, 
  ShieldCheck, 
  BookOpen, 
  ChevronRight,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface CompetencyData {
  subject: string;
  current: number;
  benchmark: number;
  fullMark: number;
  category: string;
  gapText: string;
  recommendation: string;
  recommendedPathwayId: string;
  recommendedPathwayTitle: string;
}

const CADRE_PROFILES: Record<string, { title: string; subtitle: string; data: CompetencyData[] }> = {
  'iss-officer': {
    title: 'Indian Statistical Service (ISS) Executive Cadre',
    subtitle: 'Benchmark standards set by Central Planning & MoSPI Directorate',
    data: [
      { 
        subject: 'National Accounts (SNA)', 
        current: 92, 
        benchmark: 80, 
        fullMark: 100, 
        category: 'Macroeconomics',
        gapText: '+12% (Cadre Exemplary)',
        recommendation: 'You exceed the benchmark for quarterly GDP rebasing and SUT matrix inversion.',
        recommendedPathwayId: 'macro-accounts',
        recommendedPathwayTitle: 'Macroeconomic & National Accounts Systems'
      },
      { 
        subject: 'Sample Surveys & Design', 
        current: 95, 
        benchmark: 85, 
        fullMark: 100, 
        category: 'Statistical Theory',
        gapText: '+10% (Cadre Exemplary)',
        recommendation: 'Demonstrates deep mastery in multi-stage cluster weighting and design effect calibration.',
        recommendedPathwayId: 'sample-survey-capi',
        recommendedPathwayTitle: 'Modern Sample Survey & High-Frequency CAPI'
      },
      { 
        subject: 'Econometric Modeling', 
        current: 84, 
        benchmark: 82, 
        fullMark: 100, 
        category: 'Analytics',
        gapText: '+2% (On Benchmark)',
        recommendation: 'Solid grasp of vector autoregression and macroeconomic time-series decomposition.',
        recommendedPathwayId: 'macro-accounts',
        recommendedPathwayTitle: 'Macroeconomic & National Accounts Systems'
      },
      { 
        subject: 'AI & Data Science', 
        current: 74, 
        benchmark: 88, 
        fullMark: 100, 
        category: 'Emerging Tech',
        gapText: '-14% (Priority Target Gap)',
        recommendation: 'Cadre priority: Complete the LLM Grounding & Neural Telemetry modules to close this gap.',
        recommendedPathwayId: 'ai-statistics',
        recommendedPathwayTitle: 'Machine Learning & Predictive Telemetry in Public Policy'
      },
      { 
        subject: 'CAPI & Field Telemetry', 
        current: 88, 
        benchmark: 80, 
        fullMark: 100, 
        category: 'Operations',
        gapText: '+8% (Above Benchmark)',
        recommendation: 'High proficiency in geofencing validation and tablet-based field survey QA protocols.',
        recommendedPathwayId: 'sample-survey-capi',
        recommendedPathwayTitle: 'Modern Sample Survey & High-Frequency CAPI'
      },
      { 
        subject: 'Data Governance & Ethics', 
        current: 78, 
        benchmark: 85, 
        fullMark: 100, 
        category: 'Institutional Policy',
        gapText: '-7% (Moderate Gap)',
        recommendation: 'Review the National Data Sharing and Accessibility Policy (NDSAP) framework lessons.',
        recommendedPathwayId: 'macro-accounts',
        recommendedPathwayTitle: 'Macroeconomic & National Accounts Systems'
      }
    ]
  },
  'sss-cadre': {
    title: 'Subordinate Statistical Service (SSS) Field Lead',
    subtitle: 'Core operational benchmarks for field operations, CAPI & primary sampling',
    data: [
      { 
        subject: 'National Accounts (SNA)', 
        current: 78, 
        benchmark: 70, 
        fullMark: 100, 
        category: 'Macroeconomics',
        gapText: '+8% (Satisfactory)',
        recommendation: 'Competent understanding of enterprise survey compilation into GVA aggregates.',
        recommendedPathwayId: 'macro-accounts',
        recommendedPathwayTitle: 'Macroeconomic & National Accounts Systems'
      },
      { 
        subject: 'Sample Surveys & Design', 
        current: 96, 
        benchmark: 90, 
        fullMark: 100, 
        category: 'Statistical Theory',
        gapText: '+6% (Exemplary)',
        recommendation: 'Outstanding execution of household sampling frame selection and non-response adjustment.',
        recommendedPathwayId: 'sample-survey-capi',
        recommendedPathwayTitle: 'Modern Sample Survey & High-Frequency CAPI'
      },
      { 
        subject: 'Econometric Modeling', 
        current: 65, 
        benchmark: 60, 
        fullMark: 100, 
        category: 'Analytics',
        gapText: '+5% (On Target)',
        recommendation: 'Meets prerequisite standards for secondary data interpolation and trend fitting.',
        recommendedPathwayId: 'macro-accounts',
        recommendedPathwayTitle: 'Macroeconomic & National Accounts Systems'
      },
      { 
        subject: 'AI & Data Science', 
        current: 70, 
        benchmark: 75, 
        fullMark: 100, 
        category: 'Emerging Tech',
        gapText: '-5% (Minor Gap)',
        recommendation: 'Adopt automated data cleaning pipelines and Python pandas anomaly detection scripts.',
        recommendedPathwayId: 'ai-statistics',
        recommendedPathwayTitle: 'Machine Learning & Predictive Telemetry in Public Policy'
      },
      { 
        subject: 'CAPI & Field Telemetry', 
        current: 98, 
        benchmark: 92, 
        fullMark: 100, 
        category: 'Operations',
        gapText: '+6% (Exemplary)',
        recommendation: 'Gold-standard field telemetry scores across geo-audit trails and offline synchronization.',
        recommendedPathwayId: 'sample-survey-capi',
        recommendedPathwayTitle: 'Modern Sample Survey & High-Frequency CAPI'
      },
      { 
        subject: 'Data Governance & Ethics', 
        current: 82, 
        benchmark: 80, 
        fullMark: 100, 
        category: 'Institutional Policy',
        gapText: '+2% (Meets Target)',
        recommendation: 'Sound adherence to respondent privacy guarantees and encrypted transmission protocols.',
        recommendedPathwayId: 'sample-survey-capi',
        recommendedPathwayTitle: 'Modern Sample Survey & High-Frequency CAPI'
      }
    ]
  },
  'ai-systems': {
    title: 'AI & Telemetry Systems Engineer',
    subtitle: 'Technical benchmarks for full-stack statistical engineering & automated models',
    data: [
      { 
        subject: 'National Accounts (SNA)', 
        current: 70, 
        benchmark: 65, 
        fullMark: 100, 
        category: 'Macroeconomics',
        gapText: '+5% (Meets Target)',
        recommendation: 'Good conceptual knowledge of national database schemas and relational table mappings.',
        recommendedPathwayId: 'macro-accounts',
        recommendedPathwayTitle: 'Macroeconomic & National Accounts Systems'
      },
      { 
        subject: 'Sample Surveys & Design', 
        current: 82, 
        benchmark: 75, 
        fullMark: 100, 
        category: 'Statistical Theory',
        gapText: '+7% (Above Target)',
        recommendation: 'Effective algorithmic implementations of unequal probability sampling (PPS).',
        recommendedPathwayId: 'sample-survey-capi',
        recommendedPathwayTitle: 'Modern Sample Survey & High-Frequency CAPI'
      },
      { 
        subject: 'Econometric Modeling', 
        current: 78, 
        benchmark: 80, 
        fullMark: 100, 
        category: 'Analytics',
        gapText: '-2% (Minor Gap)',
        recommendation: 'Refine stochastic volatility and time-series cointegration testing modules.',
        recommendedPathwayId: 'macro-accounts',
        recommendedPathwayTitle: 'Macroeconomic & National Accounts Systems'
      },
      { 
        subject: 'AI & Data Science', 
        current: 94, 
        benchmark: 92, 
        fullMark: 100, 
        category: 'Emerging Tech',
        gapText: '+2% (Exemplary)',
        recommendation: 'Cutting-edge prompt engineering, Gemini API integrations, and vector search embeddings.',
        recommendedPathwayId: 'ai-statistics',
        recommendedPathwayTitle: 'Machine Learning & Predictive Telemetry in Public Policy'
      },
      { 
        subject: 'CAPI & Field Telemetry', 
        current: 90, 
        benchmark: 88, 
        fullMark: 100, 
        category: 'Operations',
        gapText: '+2% (On Target)',
        recommendation: 'Proven mastery of WebSocket pipelines, offline IndexedDB sync, and server-side validation.',
        recommendedPathwayId: 'sample-survey-capi',
        recommendedPathwayTitle: 'Modern Sample Survey & High-Frequency CAPI'
      },
      { 
        subject: 'Data Governance & Ethics', 
        current: 88, 
        benchmark: 90, 
        fullMark: 100, 
        category: 'Institutional Policy',
        gapText: '-2% (Minor Gap)',
        recommendation: 'Verify AI transparency standards and algorithmic bias mitigation protocols.',
        recommendedPathwayId: 'ai-statistics',
        recommendedPathwayTitle: 'Machine Learning & Predictive Telemetry in Public Policy'
      }
    ]
  }
};

interface CompetencyRadarSectionProps {
  onSelectPathway?: (pathwayId: string) => void;
  onLaunchQuiz?: () => void;
}

export default function CompetencyRadarSection({
  onSelectPathway,
  onLaunchQuiz
}: CompetencyRadarSectionProps) {
  const { isDark } = useTheme();
  const [selectedCadreKey, setSelectedCadreKey] = useState<string>('iss-officer');
  const [activeCompetencyIndex, setActiveCompetencyIndex] = useState<number>(3); // default to AI & Data Science gap

  const activeProfile = CADRE_PROFILES[selectedCadreKey];
  const chartData = activeProfile.data;
  const activeCompetency = chartData[activeCompetencyIndex] || chartData[0];

  // Calculate gaps
  const deficits = chartData.filter(d => d.current < d.benchmark);
  const strengths = chartData.filter(d => d.current >= d.benchmark);

  return (
    <div className={`rounded-3xl border transition-colors duration-300 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-6 ${
      isDark
        ? 'border-zinc-800/90 bg-gradient-to-b from-[#0d1017]/90 via-[#0a0c12]/95 to-[#0d1017]/90'
        : 'border-slate-200/90 bg-white/85 shadow-lg'
    }`}>
      
      {/* Header with Cadre Role Selector */}
      <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b ${
        isDark ? 'border-zinc-800/80' : 'border-slate-200'
      }`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-[#40e3bd]' : 'bg-teal-600'} animate-pulse`} />
            <span className={`text-xs font-mono font-bold uppercase tracking-wider ${
              isDark ? 'text-[#40e3bd]' : 'text-teal-700'
            }`}>
              Interactive Skill Radar & Gap Analysis
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold font-['Space_Grotesk'] text-white">
            Competency Matrix vs. Cadre Benchmark
          </h2>
          <p className="text-xs text-zinc-400">
            {activeProfile.subtitle}
          </p>
        </div>

        {/* Cadre Filter Buttons */}
        <div className={`flex items-center gap-1.5 p-1 border rounded-2xl self-start lg:self-auto overflow-x-auto max-w-full ${
          isDark ? 'bg-zinc-900/90 border-zinc-800' : 'bg-slate-100 border-slate-200'
        }`}>
          {[
            { key: 'iss-officer', label: 'ISS Executive' },
            { key: 'sss-cadre', label: 'SSS Field Lead' },
            { key: 'ai-systems', label: 'AI Systems' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => {
                setSelectedCadreKey(tab.key);
                setActiveCompetencyIndex(0);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-['Space_Grotesk'] whitespace-nowrap transition-all cursor-pointer ${
                selectedCadreKey === tab.key
                  ? isDark
                    ? 'bg-[#40e3bd] text-[#052219] shadow-md'
                    : 'bg-teal-700 text-white shadow-md'
                  : isDark
                    ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Split Grid: Radar Chart & Gap Analysis Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left: Radar Chart (Powered by Recharts) */}
        <div className={`lg:col-span-7 relative h-80 sm:h-96 w-full flex items-center justify-center p-2 rounded-2xl border ${
          isDark ? 'bg-zinc-950/40 border-zinc-800/50' : 'bg-slate-50/80 border-slate-200'
        }`}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
              <PolarGrid stroke={isDark ? '#27272a' : '#cbd5e1'} strokeDasharray="3 3" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: isDark ? '#a1a1aa' : '#334155', fontSize: 11, fontFamily: 'Space Grotesk' }}
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 100]} 
                tick={{ fill: isDark ? '#71717a' : '#64748b', fontSize: 10 }}
                axisLine={false}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as CompetencyData;
                    const diff = data.current - data.benchmark;
                    return (
                      <div className={`p-3 rounded-xl border shadow-2xl backdrop-blur-md text-xs space-y-1 z-50 ${
                        isDark 
                          ? 'bg-zinc-900/95 border-[#40e3bd]/40' 
                          : 'bg-white/95 border-teal-500/50 shadow-lg'
                      }`}>
                        <div className="font-bold font-['Space_Grotesk'] text-white">{data.subject}</div>
                        <div className="flex items-center justify-between gap-4 text-zinc-300 text-[11px]">
                          <span className={isDark ? 'text-[#40e3bd]' : 'text-teal-700 font-semibold'}>Learner Current:</span>
                          <span className="font-mono font-bold">{data.current}%</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-zinc-400 text-[11px]">
                          <span className={isDark ? 'text-blue-400' : 'text-blue-600 font-semibold'}>Cadre Target:</span>
                          <span className="font-mono font-bold">{data.benchmark}%</span>
                        </div>
                        <div className={`text-[11px] font-mono font-semibold pt-1 border-t ${
                          isDark ? 'border-zinc-800' : 'border-slate-200'
                        } ${
                          diff >= 0 ? (isDark ? 'text-emerald-400' : 'text-emerald-600') : (isDark ? 'text-amber-400' : 'text-amber-600')
                        }`}>
                          {diff >= 0 ? `+${diff}% Above Target` : `${diff}% Gap to Target`}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Radar
                name="Learner Competency"
                dataKey="current"
                stroke={isDark ? '#40e3bd' : '#0d9488'}
                fill={isDark ? '#40e3bd' : '#0d9488'}
                fillOpacity={isDark ? 0.35 : 0.25}
                strokeWidth={2}
              />
              <Radar
                name="Cadre Benchmark"
                dataKey="benchmark"
                stroke={isDark ? '#3b82f6' : '#2563eb'}
                fill={isDark ? '#3b82f6' : '#2563eb'}
                fillOpacity={isDark ? 0.15 : 0.12}
                strokeWidth={1.5}
                strokeDasharray="4 4"
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Right: Gap Analysis & Actionable Insight */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Top Quick Status summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-semibold mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Exemplary Strengths</span>
              </div>
              <div className="text-lg font-bold font-['Space_Grotesk'] text-white">
                {strengths.length} <span className="text-xs text-zinc-400 font-normal">domains</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold mb-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Target Deficits</span>
              </div>
              <div className="text-lg font-bold font-['Space_Grotesk'] text-white">
                {deficits.length} <span className="text-xs text-zinc-400 font-normal">domains</span>
              </div>
            </div>
          </div>

          {/* Interactive Competency Selector List */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-mono font-bold text-zinc-400 uppercase">
              Click Competency to Inspect Gap
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {chartData.map((item, idx) => {
                const isSelected = idx === activeCompetencyIndex;
                const diff = item.current - item.benchmark;
                return (
                  <button
                    key={item.subject}
                    type="button"
                    onClick={() => setActiveCompetencyIndex(idx)}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-800/90 border-[#40e3bd] shadow-[0_0_15px_rgba(64,227,189,0.15)]'
                        : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${diff >= 0 ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                      <span className="text-xs font-semibold text-white truncate">{item.subject}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-mono font-bold text-zinc-300">
                        {item.current}% <span className="text-zinc-500">/ {item.benchmark}%</span>
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        diff >= 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {diff >= 0 ? `+${diff}%` : `${diff}%`}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detail Card for Active Selected Competency */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCompetency.subject}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#40e3bd] font-bold uppercase">
                    {activeCompetency.category}
                  </span>
                  <h4 className="text-sm font-bold text-white font-['Space_Grotesk']">
                    {activeCompetency.subject}
                  </h4>
                </div>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                  activeCompetency.current >= activeCompetency.benchmark
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {activeCompetency.gapText}
                </span>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                {activeCompetency.recommendation}
              </p>

              {/* Action trigger to bridge gap */}
              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                <div className="text-[11px] text-zinc-400 truncate">
                  Target: <span className="text-white font-medium">{activeCompetency.recommendedPathwayTitle}</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (onSelectPathway) {
                      onSelectPathway(activeCompetency.recommendedPathwayId);
                    } else if (onLaunchQuiz) {
                      onLaunchQuiz();
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#40e3bd] to-[#20b892] text-[#052219] font-bold text-[11px] font-['Space_Grotesk'] flex items-center gap-1 shrink-0 shadow-md hover:from-[#5ef8d5] transition-all cursor-pointer"
                >
                  <span>Bridge Gap</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

        </div>

      </div>

    </div>
  );
}
