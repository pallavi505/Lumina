import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Compass, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  Database,
  Cpu,
  BarChart3,
  Globe2
} from 'lucide-react';

interface IgotPathwaysSectionProps {
  onSelectPathway: (pathwayId: string) => void;
}

interface Pathway {
  id: string;
  title: string;
  shortCode: string;
  tier: string;
  targetCadre: string;
  competencies: string[];
  modulesCount: number;
  duration: string;
  badgeTitle: string;
  icon: typeof BarChart3;
  gradient: string;
  summary: string;
}

const PATHWAYS: Pathway[] = [
  {
    id: 'macro-accounts',
    title: 'Macroeconomic & National Accounts Systems',
    shortCode: 'NAS-ISS-01',
    tier: 'Tier 3 (Executive ISS)',
    targetCadre: 'Indian Statistical Service & Central Planning Ministries',
    competencies: [
      'GDP Rebasing & Deflator Estimation',
      'Supply-Use Tables (SUT) Matrix Inversion',
      'System of National Accounts (SNA 2008 & 2025)',
      'Quarterly Flash Economic Indicators'
    ],
    modulesCount: 14,
    duration: '45 Hours (Self-paced + Labs)',
    badgeTitle: 'National Accounts Master Practitioner',
    icon: BarChart3,
    gradient: 'from-zinc-100 to-zinc-400',
    summary: 'Master comprehensive macro-economic balance of payments, capital stock valuation, and inter-industry linkages compliant with international SNA benchmarks.'
  },
  {
    id: 'sample-survey-capi',
    title: 'Modern Sample Survey & High-Frequency CAPI Telemetry',
    shortCode: 'SURV-SSS-02',
    tier: 'Tier 2 (Operational Cadre)',
    targetCadre: 'Subordinate Statistical Service (SSS) & Field Directors',
    competencies: [
      'Stratified Multi-stage Sampling Frames',
      'Computer Assisted Personal Interview (CAPI) QA',
      'Real-time Geospatial Enumeration Verification',
      'Non-sampling Error Weighting & Imputation'
    ],
    modulesCount: 18,
    duration: '60 Hours (Interactive Field Labs)',
    badgeTitle: 'Field Telemetry & Sampling Specialist',
    icon: Layers,
    gradient: 'from-neutral-200 to-zinc-500',
    summary: 'Operationalize CAPI digital tablets, GPS tracking protocols, and automated household verification pipelines for high-precision national surveys.'
  },
  {
    id: 'statistical-ai',
    title: 'Applied AI & Big Data for Official Administrative Records',
    shortCode: 'AIDA-EXP-03',
    tier: 'Tier 3 (Specialist Cadre)',
    targetCadre: 'Data Informatics Division & Senior Researchers',
    competencies: [
      'Automated Harmonization of GST & Customs Records',
      'Differential Privacy in Census Microdata',
      'LLM Assisted Commodity Classification (NIC/HS)',
      'Automated Data Anomaly & Outlier Triage'
    ],
    modulesCount: 12,
    duration: '40 Hours (Cloud Sandbox)',
    badgeTitle: 'Official Statistics AI Architect',
    icon: Cpu,
    gradient: 'from-zinc-200 to-stone-400',
    summary: 'Harness advanced machine learning algorithms and privacy-preserving synthesis on massive administrative data lakes without privacy compromise.'
  },
  {
    id: 'prices-sdg',
    title: 'Price Indices, Inflation & SDG Localization Framework',
    shortCode: 'PSDG-ALL-04',
    tier: 'Tier 1 & 2 (Cross-Departmental)',
    targetCadre: 'State Directorates of Economics & Statistics (DES)',
    competencies: [
      'Consumer Price Index (CPI) Web Scraping & Geolocation',
      'Wholesale Price Index (WPI) Core Inflation Models',
      'Sub-national SDG Indicator Progress Tracking',
      'Executive Dashboards & Policy Infographics'
    ],
    modulesCount: 10,
    duration: '32 Hours (Modular)',
    badgeTitle: 'Price Systems & SDG Officer',
    icon: Globe2,
    gradient: 'from-white to-zinc-400',
    summary: 'Standardize state and district-level price data collection while measuring progress towards United Nations Sustainable Development Goals.'
  }
];

export default function IgotPathwaysSection({ onSelectPathway }: IgotPathwaysSectionProps) {
  const [activePathwayId, setActivePathwayId] = useState<string>(PATHWAYS[0].id);

  const activePathway = PATHWAYS.find((p) => p.id === activePathwayId) || PATHWAYS[0];
  const ActiveIcon = activePathway.icon;

  return (
    <section 
      id="igot-pathways"
      className="relative z-20 w-full max-w-6xl mx-auto px-4 py-8 sm:py-14"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Compass className="w-4 h-4 text-zinc-300" />
            <span className="text-xs uppercase tracking-widest font-mono text-zinc-300 font-semibold">
              Mission Karmayogi Competency Mapping
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-white tracking-tight">
            iGOT Statistical Pathways
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-['Inter'] mt-1 max-w-2xl">
            Structured civil service learning journeys designed in collaboration with NSSTA and ISI Kolkata, fully certified on the iGOT Karmayogi national platform.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-700/80">
          <Award className="w-3.5 h-3.5 text-zinc-300" />
          <span>Automated Verifiable Digital Credentials</span>
        </div>
      </div>

      {/* Pathway Selection Grid + Active Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 4 Pathway Selector Pills */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {PATHWAYS.map((pathway) => {
            const Icon = pathway.icon;
            const isSelected = pathway.id === activePathwayId;

            return (
              <button
                key={pathway.id}
                id={`btn-pathway-${pathway.id}`}
                onClick={() => setActivePathwayId(pathway.id)}
                className={`p-4 rounded-2xl text-left transition-all duration-200 cursor-pointer flex items-start gap-3.5 border ${
                  isSelected
                    ? 'bg-zinc-800/90 border-zinc-500/80 shadow-[0_0_20px_rgba(255,255,255,0.08)]'
                    : 'bg-[#0a0a0c]/80 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/60'
                }`}
              >
                <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${pathway.gradient} text-zinc-950 font-bold shadow-md`}>
                  <Icon className="w-5 h-5 text-zinc-950" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] text-zinc-300 uppercase tracking-wide">
                      {pathway.shortCode}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-semibold">
                      {pathway.tier}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white font-['Space_Grotesk'] mt-0.5 truncate">
                    {pathway.title}
                  </h3>

                  <div className="text-xs text-zinc-400 mt-1 flex items-center gap-3">
                    <span>{pathway.modulesCount} Modules</span>
                    <span>•</span>
                    <span>{pathway.duration}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Deep Dive Card for Active Pathway */}
        <div className="lg:col-span-7">
          <motion.div
            key={activePathway.id}
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
            className="h-full rounded-3xl bg-zinc-900/90 backdrop-blur-2xl border border-zinc-800/90 p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden"
          >
            {/* Ambient Corner Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-zinc-500/10 blur-3xl pointer-events-none" />

            <div>
              {/* Badge & Cadre Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-zinc-800/70">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-zinc-800 text-zinc-200 border border-zinc-700">
                    {activePathway.shortCode}
                  </span>
                  <span className="text-xs text-zinc-300 font-semibold">
                    {activePathway.tier}
                  </span>
                </div>

                <span className="text-xs text-zinc-400">
                  Cadre: <span className="text-zinc-200 font-medium">{activePathway.targetCadre}</span>
                </span>
              </div>

              {/* Title & Description */}
              <div className="mt-4">
                <h3 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-white">
                  {activePathway.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-zinc-300 font-['Inter'] leading-relaxed">
                  {activePathway.summary}
                </p>
              </div>

              {/* Mapped Competencies Checklist */}
              <div className="mt-6">
                <div className="text-xs uppercase tracking-wider font-semibold text-zinc-400 font-['Space_Grotesk'] mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Karmayogi Mapped Competencies</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activePathway.competencies.map((comp, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-[#0a0a0c]/80 border border-zinc-800/80 text-xs text-zinc-200 font-['Inter'] flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 shrink-0" />
                      <span className="truncate">{comp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Credential Issued */}
              <div className="mt-6 p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-zinc-850 border border-zinc-700 flex items-center justify-center text-zinc-200 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-zinc-400 font-semibold">
                    Verifiable Digital Badge Awarded
                  </div>
                  <div className="text-sm font-bold text-white font-['Space_Grotesk']">
                    {activePathway.badgeTitle}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Row */}
            <div className="mt-6 pt-5 border-t border-zinc-800/70 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-zinc-400">
                <span>Total Load: </span>
                <span className="text-zinc-200 font-mono font-medium">{activePathway.duration}</span>
              </div>

              <button
                id={`btn-enroll-pathway-${activePathway.id}`}
                onClick={() => onSelectPathway(activePathway.id)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-zinc-100 to-zinc-200 hover:from-white hover:to-zinc-300 text-zinc-950 font-bold font-['Space_Grotesk'] text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all cursor-pointer"
              >
                <span>Access Pathway on Portal</span>
                <ArrowRight className="w-4 h-4 text-zinc-950" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
