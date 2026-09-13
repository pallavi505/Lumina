import { useState } from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

interface LuminaLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  layout?: 'vertical' | 'horizontal';
}

export default function LuminaLogo({ 
  size = 'md', 
  showTagline = true,
  layout
}: LuminaLogoProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { isDark } = useTheme();

  // Determine sizing dimensions
  const symbolDimension = size === 'sm' ? 40 : size === 'lg' ? 76 : 56;
  const textSizeClass = size === 'sm' ? 'text-xl' : size === 'lg' ? 'text-4xl sm:text-5xl' : 'text-2xl sm:text-3xl';
  
  // Sizing for responsive layout
  const isHorizontal = layout === 'horizontal' || (size === 'sm' && !showTagline);

  return (
    <div 
      id="lumina-brand-header"
      className={`select-none cursor-pointer group ${
        isHorizontal ? 'flex flex-row items-center gap-3' : 'flex flex-col items-center'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Star Mark Container */}
      <div 
        className={`relative flex items-center justify-center ${
          isHorizontal ? 'mb-0' : 'mb-3'
        }`}
        style={{ width: symbolDimension, height: symbolDimension }}
      >
        {/* 1. Deep Celestial Aura (Nebula Glow) */}
        <motion.div
          id="lumina-star-ambient-aura"
          animate={{
            scale: isHovered ? [1.2, 1.4, 1.2] : [1, 1.2, 1],
            opacity: isHovered ? [0.8, 1, 0.8] : [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 rounded-full blur-xl bg-gradient-to-tr from-zinc-700 via-[#40e3bd]/30 to-zinc-200 pointer-events-none"
        />

        {/* 2. Orbiting Stardust Sparkle Particles */}
        <motion.div
          id="lumina-star-orbital-particles"
          animate={{ rotate: 360 }}
          transition={{
            duration: isHovered ? 6 : 14,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute inset-0 pointer-events-none flex items-center justify-center"
        >
          {/* Spark 1 */}
          <motion.div 
            animate={{
              scale: [0.8, 1.3, 0.8],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#40e3bd] shadow-[0_0_10px_#40e3bd]"
          />
          {/* Spark 2 */}
          <motion.div 
            animate={{
              scale: [1.2, 0.7, 1.2],
              opacity: [0.5, 0.9, 0.5],
            }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-zinc-200 shadow-[0_0_8px_#d4d4d8]"
          />
          {/* Spark 3 */}
          <motion.div 
            animate={{
              scale: [0.7, 1.2, 0.7],
              opacity: [0.4, 0.85, 0.4],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute top-1/2 -right-1 -translate-y-1/2 w-1 h-1 rounded-full bg-[#72f9dc] shadow-[0_0_8px_#72f9dc]"
          />
        </motion.div>

        {/* 3. Outer Rotating Starlight Rays / Halo */}
        <motion.div
          id="lumina-star-rotating-corona"
          animate={{ rotate: -360 }}
          transition={{
            duration: isHovered ? 15 : 30,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-60 group-hover:opacity-90 transition-opacity"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            {/* Subtle outer constellation ring */}
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke="#A1A1AA"
              strokeWidth="0.8"
              strokeDasharray="2 6"
              opacity="0.4"
            />
            {/* Delicate corona star rays */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <line
                key={deg}
                x1="50"
                y1="50"
                x2={50 + 47 * Math.cos((deg * Math.PI) / 180)}
                y2={50 + 47 * Math.sin((deg * Math.PI) / 180)}
                stroke="url(#coronaGrad)"
                strokeWidth="1"
                strokeLinecap="round"
                opacity="0.6"
              />
            ))}
          </svg>
        </motion.div>

        {/* 4. Primary Geometric Animated Star (SVG) */}
        <motion.div
          id="lumina-primary-star"
          animate={{
            scale: isHovered ? 1.08 : [1, 1.04, 1],
            rotate: isHovered ? [0, 5, -5, 0] : 0,
          }}
          transition={{
            scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="relative z-10 w-full h-full flex items-center justify-center"
        >
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-[0_0_18px_rgba(255,255,255,0.4)] group-hover:drop-shadow-[0_0_26px_rgba(255,255,255,0.7)] transition-all duration-300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Gradients for faceted 3D lighting */}
              <linearGradient id="facetTopLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="60%" stopColor="#E4E4E7" />
                <stop offset="100%" stopColor="#A1A1AA" />
              </linearGradient>

              <linearGradient id="facetTopRight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F4F4F5" />
                <stop offset="60%" stopColor="#A1A1AA" />
                <stop offset="100%" stopColor="#52525B" />
              </linearGradient>

              <linearGradient id="facetRightBottom" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#D4D4D8" />
                <stop offset="70%" stopColor="#71717A" />
                <stop offset="100%" stopColor="#3F3F46" />
              </linearGradient>

              <linearGradient id="facetBottomLeft" x1="100%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#E4E4E7" />
                <stop offset="70%" stopColor="#71717A" />
                <stop offset="100%" stopColor="#27272A" />
              </linearGradient>

              <linearGradient id="facetDiagLight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#A1A1AA" />
              </linearGradient>

              <linearGradient id="facetDiagDark" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D4D4D8" />
                <stop offset="100%" stopColor="#52525B" />
              </linearGradient>

              {/* Corona Ray Gradient */}
              <linearGradient id="coronaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                <stop offset="70%" stopColor="#A1A1AA" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#71717A" stopOpacity="0" />
              </linearGradient>

              {/* Core Starburst Radial Glow */}
              <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                <stop offset="40%" stopColor="#E4E4E7" stopOpacity="0.9" />
                <stop offset="80%" stopColor="#A1A1AA" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#52525B" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Back Star Flares / Diagonal Secondary Rays (8-point celestial star) */}
            <g id="star-secondary-rays" opacity="0.95">
              {/* North-East Ray */}
              <polygon points="50,50 56,44 76,24 50,50" fill="url(#facetDiagLight)" />
              <polygon points="50,50 76,24 62,46 50,50" fill="url(#facetDiagDark)" />

              {/* South-East Ray */}
              <polygon points="50,50 62,54 76,76 50,50" fill="url(#facetDiagLight)" />
              <polygon points="50,50 76,76 56,56 50,50" fill="url(#facetDiagDark)" />

              {/* South-West Ray */}
              <polygon points="50,50 56,56 24,76 50,50" fill="url(#facetDiagDark)" />
              <polygon points="50,50 24,76 44,56 50,50" fill="url(#facetDiagLight)" />

              {/* North-West Ray */}
              <polygon points="50,50 44,44 24,24 50,50" fill="url(#facetDiagLight)" />
              <polygon points="50,50 24,24 46,38 50,50" fill="url(#facetDiagDark)" />
            </g>

            {/* Primary 4-Point Majestic Faceted Cardinal Star Rays */}
            <g id="star-cardinal-rays">
              {/* Top Vertical Ray */}
              <polygon points="50,50 44,44 50,4 50,50" fill="url(#facetTopLeft)" />
              <polygon points="50,50 50,4 56,44 50,50" fill="url(#facetTopRight)" />

              {/* Right Horizontal Ray */}
              <polygon points="50,50 56,44 96,50 50,50" fill="url(#facetTopLeft)" />
              <polygon points="50,50 96,50 56,56 50,50" fill="url(#facetRightBottom)" />

              {/* Bottom Vertical Ray */}
              <polygon points="50,50 56,56 50,96 50,50" fill="url(#facetRightBottom)" />
              <polygon points="50,50 50,96 44,56 50,50" fill="url(#facetBottomLeft)" />

              {/* Left Horizontal Ray */}
              <polygon points="50,50 44,56 4,50 50,50" fill="url(#facetBottomLeft)" />
              <polygon points="50,50 4,50 44,44 50,50" fill="url(#facetTopLeft)" />
            </g>

            {/* Star Edge Highlights (Reflective Starlight Rim) */}
            <polyline
              points="50,4 56,44 96,50 56,56 50,96 44,56 4,50 44,44 50,4"
              stroke="#FFFFFF"
              strokeWidth="0.6"
              strokeLinejoin="round"
              opacity="0.75"
            />

            {/* Radiant Center Core Glow */}
            <circle cx="50" cy="50" r="12" fill="url(#coreGlow)" />
            <circle cx="50" cy="50" r="3.5" fill="#FFFFFF" />
          </svg>
        </motion.div>

        {/* 5. Center Diamond Glint Sparkle (Twinkle Flare) */}
        <motion.div
          id="lumina-star-sparkle-glint"
          animate={{
            scale: isHovered ? [0.9, 1.5, 0.9] : [0.75, 1.25, 0.75],
            rotate: [0, 90, 180, 270, 360],
            opacity: isHovered ? [0.8, 1, 0.8] : [0.6, 0.95, 0.6],
          }}
          transition={{
            duration: isHovered ? 2 : 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute z-20 pointer-events-none flex items-center justify-center"
        >
          {/* Micro 4-point light glint cross */}
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-white drop-shadow-[0_0_8px_#FFFFFF]" fill="currentColor">
            <path d="M12 0L13.5 9.5L24 12L13.5 14.5L12 24L10.5 14.5L0 12L10.5 9.5L12 0Z" />
          </svg>
        </motion.div>
      </div>

      {/* Brand Text Block */}
      <div className={`flex flex-col ${isHorizontal ? 'items-start' : 'items-center'}`}>
        {/* Title: LUMINA */}
        <motion.h1
          id="lumina-brand-title"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`font-bold font-display tracking-tight ${textSizeClass} lumina-gradient-text lumina-text-shadow font-['Space_Grotesk']`}
          style={{
            textShadow: isDark 
              ? '0 0 25px rgba(64, 227, 189, 0.4)' 
              : '0 0 20px rgba(13, 148, 136, 0.2)',
          }}
        >
          LUMINA
        </motion.h1>

        {/* Tagline: "Illuminate Your Potential" */}
        {showTagline && (
          <motion.p
            id="lumina-brand-tagline"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            className="text-zinc-400 font-normal text-xs sm:text-sm tracking-wider uppercase mt-1 font-['Inter'] flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#40e3bd] shadow-[0_0_8px_#40e3bd] inline-block animate-pulse" />
            <span>Illuminate Your Potential</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#72f9dc] shadow-[0_0_8px_#72f9dc] inline-block animate-pulse" />
          </motion.p>
        )}
      </div>
    </div>
  );
}

