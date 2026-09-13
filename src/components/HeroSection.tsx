import { motion } from 'motion/react';
import { ArrowRight, Compass, ShieldCheck, Award, Sparkles, Building2 } from 'lucide-react';
import LuminaLogo from './LuminaLogo';

interface HeroSectionProps {
  onGetStarted: () => void;
  onExplorePathways: () => void;
}

export default function HeroSection({ onGetStarted, onExplorePathways }: HeroSectionProps) {
  return (
    <section 
      id="hero-section"
      className="relative z-20 w-full max-w-6xl mx-auto pt-4 pb-12 sm:pb-16 flex flex-col items-center text-center px-4"
    >
      {/* 1. Official Government & Ecosystem Pill */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/90 border border-[#40e3bd]/30 text-xs sm:text-sm text-zinc-300 mb-6 backdrop-blur-md shadow-[0_0_20px_rgba(64,227,189,0.12)]"
      >
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#40e3bd] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#40e3bd] shadow-[0_0_8px_#40e3bd]" />
        </span>
        <span className="font-semibold text-white tracking-wide">Government of India</span>
        <span className="text-zinc-600">•</span>
        <span className="text-zinc-300 hidden sm:inline">Ministry of Statistics & Programme Implementation (MoSPI)</span>
        <span className="text-zinc-300 sm:hidden">MoSPI</span>
        <span className="text-zinc-600">•</span>
        <span className="text-[#a3f7e2] font-medium flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#40e3bd]" /> iGOT Karmayogi
        </span>
      </motion.div>

      {/* 2. Central Animated Star Brand Emblem */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-4"
      >
        <LuminaLogo size="lg" showTagline={false} layout="vertical" />
      </motion.div>

      {/* 3. High-Impact Gradient Headline */}
      <motion.h1
        id="hero-heading"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.2 }}
        className="text-4xl sm:text-6xl lg:text-7xl font-bold font-['Space_Grotesk'] tracking-tight max-w-4xl mx-auto leading-[1.1] sm:leading-[1.12]"
      >
        <span className="text-white">Empowering India's </span>
        <span className="bg-gradient-to-r from-[#a3f7e2] via-[#40e3bd] to-[#20b892] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(64,227,189,0.35)]">
          Official Statistical System
        </span>
      </motion.h1>

      {/* 4. Subtitle / Narrative */}
      <motion.p
        id="hero-subheading"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.3 }}
        className="mt-6 text-base sm:text-lg lg:text-xl text-zinc-300 font-['Inter'] max-w-3xl mx-auto leading-relaxed"
      >
        India’s next-generation institutional learning OS for the{' '}
        <span className="text-[#a3f7e2] font-semibold underline decoration-[#40e3bd]/50 decoration-1 underline-offset-4">National Statistical Office (NSO)</span>,{' '}
        State Statistical Bureaus, and the{' '}
        <span className="text-[#a3f7e2] font-semibold underline decoration-[#40e3bd]/50 decoration-1 underline-offset-4">Indian Statistical Service (ISS)</span>. 
        Accelerating macroeconomic modeling, sample survey telemetry, and AI-enabled data governance.
      </motion.p>

      {/* 5. Dual Call To Action (CTA) Buttons */}
      <motion.div
        id="hero-cta-group"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.4 }}
        className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
      >
        {/* Primary CTA: "Get Started" */}
        <button
          id="btn-hero-get-started"
          onClick={onGetStarted}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#40e3bd] via-[#35d8b2] to-[#20b892] hover:from-[#5ef8d5] hover:to-[#35d8b2] text-[#052219] font-bold font-['Space_Grotesk'] text-base tracking-wide flex items-center justify-center gap-2.5 shadow-[0_0_28px_rgba(64,227,189,0.35)] hover:shadow-[0_0_40px_rgba(64,227,189,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          <span>Get Started</span>
          <ArrowRight className="w-5 h-5 text-[#052219] stroke-[2.5]" />
        </button>

        {/* Secondary CTA: "Explore iGOT Pathways" */}
        <button
          id="btn-hero-explore-pathways"
          onClick={onExplorePathways}
          className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-zinc-900/90 hover:bg-[#40e3bd]/15 border border-[#40e3bd]/40 hover:border-[#40e3bd] text-[#40e3bd] hover:text-[#72f9dc] font-semibold font-['Space_Grotesk'] text-base flex items-center justify-center gap-2.5 backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-[0_0_20px_rgba(64,227,189,0.12)]"
        >
          <Compass className="w-5 h-5 text-[#40e3bd]" />
          <span>Explore iGOT Pathways</span>
        </button>
      </motion.div>

      {/* 6. Ecosystem Trust Badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.55 }}
        className="mt-10 pt-6 border-t border-zinc-800/80 w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-zinc-400 font-['Inter']"
      >
        <div className="flex items-center justify-center gap-2">
          <Building2 className="w-4 h-4 text-[#40e3bd]" />
          <span>MoSPI Institutional Hub</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Award className="w-4 h-4 text-[#40e3bd]" />
          <span>iGOT Karmayogi Certified</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#40e3bd]" />
          <span>NIC GovCloud Secured</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-[#40e3bd]" />
          <span>AI Adaptive Learning</span>
        </div>
      </motion.div>
    </section>
  );
}
