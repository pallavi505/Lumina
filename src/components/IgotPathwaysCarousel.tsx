import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Layers, 
  Clock, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight,
  Database,
  Cpu,
  Globe2,
  BookOpen
} from 'lucide-react';
import type { AICourse } from '../types';

export interface PathwayItem {
  id: string;
  title: string;
  shortCode: string;
  tier: string;
  cadre: string;
  matchScore: number;
  matchReason: string;
  competencies: string[];
  modulesCount: number;
  duration: string;
  badgeTitle: string;
  summary: string;
  category: string;
}

const DEFAULT_PATHWAYS: PathwayItem[] = [
  {
    id: 'macro-accounts',
    title: 'Macroeconomic & National Accounts Systems',
    shortCode: 'NAS-ISS-01',
    tier: 'Tier 3 (Executive ISS)',
    cadre: 'Indian Statistical Service & Central Planning Ministries',
    matchScore: 98,
    matchReason: 'Direct alignment with your recent 100% quiz performance in National Accounts.',
    competencies: [
      'GDP Rebasing & Deflator Estimation',
      'Supply-Use Tables (SUT) Matrix Inversion',
      'System of National Accounts (SNA 2008 & 2025)',
      'Quarterly Flash Economic Indicators'
    ],
    modulesCount: 14,
    duration: '45 Hours',
    badgeTitle: 'National Accounts Master Practitioner',
    summary: 'Master macro-economic balance of payments, capital stock valuation, and inter-industry linkages compliant with international SNA benchmarks.',
    category: 'ISS'
  },
  {
    id: 'sample-survey-capi',
    title: 'Modern Sample Survey & High-Frequency CAPI Telemetry',
    shortCode: 'SURV-SSS-02',
    tier: 'Tier 2 (Operational Cadre)',
    cadre: 'Subordinate Statistical Service (SSS) & Field Directors',
    matchScore: 94,
    matchReason: 'Bridges your field telemetry gap and satisfies annual MoSPI credentialing.',
    competencies: [
      'Stratified Multi-Stage Cluster Design',
      'Real-time Geofencing & Paradata Auditing',
      'Post-Stratification Non-Response Weighting',
      'Offline-First Tablet Field Sync'
    ],
    modulesCount: 12,
    duration: '38 Hours',
    badgeTitle: 'Certified Field Survey Director',
    summary: 'Design robust probability sampling frames, deploy CAPI questionnaires with audit trails, and compute design effect adjustments for nation-scale inquiries.',
    category: 'SSS'
  },
  {
    id: 'ai-statistics',
    title: 'Machine Learning & Predictive Telemetry in Public Policy',
    shortCode: 'STAT-AI-03',
    tier: 'Cross-Cadre Specialist',
    cadre: 'Data Scientists, Econometricians & Policy Planners',
    matchScore: 92,
    matchReason: 'Recommended by Lumina AI to expand your automated predictive modeling skills.',
    competencies: [
      'High-Dimensional Regularized Regression',
      'Synthetic Control Methods in Policy Evaluation',
      'Automated NLP for Unstructured Administrative Registries',
      'Explainable AI (SHAP / LIME) for Governance'
    ],
    modulesCount: 16,
    duration: '52 Hours',
    badgeTitle: 'Public Sector Data Science Fellow',
    summary: 'Harness state-of-the-art causal ML models to forecast district-level socio-economic indicators and audit public expenditure delivery mechanisms.',
    category: 'AI'
  },
  {
    id: 'index-numbers-price',
    title: 'Price Indices, CPI/WPI Harmonization & Inflation Dynamics',
    shortCode: 'PRICE-ISS-04',
    tier: 'Tier 3 (Executive Cadre)',
    cadre: 'Price Statistics Division & Economic Advisers',
    matchScore: 89,
    matchReason: 'Matches your profile interest in statistical indices and economic modeling.',
    competencies: [
      'Laspeyres, Paasche & Fisher Ideal Indices',
      'Hedonic Quality Adjustments in Consumer Goods',
      'Chain-Linking Methodologies & Seasonal Smoothing',
      'Core vs. Headline Inflation Decomposition'
    ],
    modulesCount: 10,
    duration: '32 Hours',
    badgeTitle: 'Price Statistics Specialist',
    summary: 'Build high-frequency basket monitoring algorithms, integrate web-scraped price series, and generate robust index series for monetary policy decision-making.',
    category: 'ISS'
  }
];

interface IgotPathwaysCarouselProps {
  onSelectPathway?: (pathwayId: string) => void;
  onEnrollPathway?: (pathway: PathwayItem) => void;
}

export default function IgotPathwaysCarousel({
  onSelectPathway,
  onEnrollPathway
}: IgotPathwaysCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredPathways = selectedCategory === 'All' 
    ? DEFAULT_PATHWAYS 
    : DEFAULT_PATHWAYS.filter(p => p.category === selectedCategory);

  const activeIndex = Math.min(currentIndex, filteredPathways.length - 1);
  const activePathway = filteredPathways[activeIndex] || DEFAULT_PATHWAYS[0];

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? filteredPathways.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev === filteredPathways.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="rounded-3xl border border-zinc-800/90 bg-gradient-to-b from-[#0d1017]/95 via-[#0c0e15]/90 to-[#0d1017]/95 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-6">
      
      {/* Carousel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#40e3bd]" />
            <span className="text-xs font-mono font-bold text-[#40e3bd] uppercase tracking-wider">
              Personalized AI Recommendations
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold font-['Space_Grotesk'] text-white">
            Official iGOT Karmayogi Curated Pathways
          </h2>
          <p className="text-xs text-zinc-400">
            AI-matched learning trajectories aligned with Central Civil Service competency standards
          </p>
        </div>

        {/* Filters & Navigation Controls */}
        <div className="flex items-center gap-3">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
            {['All', 'ISS', 'SSS', 'AI'].map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentIndex(0);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold font-['Space_Grotesk'] transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#40e3bd] text-[#052219]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Carousel Arrow Controls */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrev}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title="Previous Pathway"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title="Next Pathway"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Active Pathway Showcase (Glassmorphic Featured Slide) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activePathway.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="relative rounded-2xl overflow-hidden border border-[#40e3bd]/40 bg-gradient-to-r from-zinc-900/90 via-[#0e121a] to-zinc-900/90 p-6 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.6)]"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#40e3bd]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            
            {/* Top Row Badges */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-[#40e3bd]/20 border border-[#40e3bd]/50 text-[#40e3bd] text-xs font-mono font-bold tracking-wider">
                  {activePathway.shortCode}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-semibold">
                  {activePathway.tier}
                </span>
              </div>

              {/* AI Match Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold font-mono">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>{activePathway.matchScore}% AI CADRE MATCH</span>
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-2 max-w-3xl">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold font-['Space_Grotesk'] text-white">
                {activePathway.title}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {activePathway.summary}
              </p>
              <div className="text-xs text-zinc-400 font-medium">
                <span className="text-zinc-500">Target Cadre:</span> {activePathway.cadre}
              </div>
            </div>

            {/* AI Personalization Justification Pill */}
            <div className="p-3 rounded-xl bg-zinc-950/70 border border-[#40e3bd]/25 text-xs text-zinc-300 flex items-start sm:items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-[#40e3bd]/20 text-[#40e3bd] flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="leading-snug">
                <strong className="text-[#40e3bd]">Why recommended for you:</strong> {activePathway.matchReason}
              </span>
            </div>

            {/* Competency Tags */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono text-zinc-400 font-bold uppercase tracking-wider">
                Competencies Gained & Validated:
              </div>
              <div className="flex flex-wrap gap-2">
                {activePathway.competencies.map((comp, cIdx) => (
                  <span
                    key={cIdx}
                    className="px-3 py-1 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#40e3bd]" />
                    <span>{comp}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Meta & Action Bar */}
            <div className="pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-xs text-zinc-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-zinc-500" />
                  {activePathway.modulesCount} Modules
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-zinc-500" />
                  {activePathway.duration}
                </span>
                <span className="hidden md:flex items-center gap-1.5 text-[#40e3bd]">
                  <Award className="w-4 h-4" />
                  {activePathway.badgeTitle}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onSelectPathway && onSelectPathway(activePathway.id)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  View Full Syllabus
                </button>

                <button
                  type="button"
                  onClick={() => onEnrollPathway && onEnrollPathway(activePathway)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#40e3bd] to-[#20b892] hover:from-[#5ef8d5] text-[#052219] font-bold font-['Space_Grotesk'] text-xs flex items-center gap-1.5 shadow-[0_0_20px_rgba(64,227,189,0.3)] transition-all cursor-pointer"
                >
                  <span>Enroll in Pathway</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide Indicators / Dots */}
      <div className="flex items-center justify-center gap-2 pt-2">
        {filteredPathways.map((p, idx) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              idx === activeIndex
                ? 'w-8 bg-[#40e3bd]'
                : 'w-2 bg-zinc-700 hover:bg-zinc-500'
            }`}
            title={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

    </div>
  );
}
