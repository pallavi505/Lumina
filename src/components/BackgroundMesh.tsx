import { useMemo } from 'react';
import { motion } from 'motion/react';
import type { ParticleData } from '../types';
import { useTheme } from '../context/ThemeContext';

export default function BackgroundMesh() {
  const { isDark } = useTheme();

  // Generate stable particles for Layer 4 calibrated to theme
  const particles: ParticleData[] = useMemo(() => {
    const darkColors = [
      'rgba(64, 227, 189, 0.45)',  // #40e3bd luminous mint
      'rgba(114, 249, 220, 0.4)',  // #72f9dc soft mint
      'rgba(244, 244, 245, 0.45)', // zinc-100 silver light
      'rgba(212, 212, 216, 0.35)', // zinc-300 platinum
      'rgba(64, 227, 189, 0.3)',   // #40e3bd ambient glow
      'rgba(255, 255, 255, 0.5)',  // pure luminous white
      'rgba(32, 184, 146, 0.35)',  // deeper emerald
    ];

    const lightColors = [
      'rgba(13, 148, 136, 0.45)',  // teal-600 rich accent
      'rgba(2, 132, 199, 0.4)',   // sky-600 ambient light
      'rgba(16, 185, 129, 0.45)',  // emerald-500
      'rgba(100, 116, 139, 0.35)', // slate-500
      'rgba(20, 184, 166, 0.45)',  // teal-500
      'rgba(14, 165, 233, 0.35)',  // cyan-500
      'rgba(99, 102, 241, 0.3)',   // indigo-500
    ];

    const colors = isDark ? darkColors : lightColors;

    return Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      x: Math.floor(Math.random() * 100),
      y: Math.floor(Math.random() * 100),
      size: Math.floor(Math.random() * 6) + 2, // 2px - 8px
      color: colors[i % colors.length],
      duration: 10 + Math.random() * 14,
      delay: Math.random() * 5,
      driftX: (Math.random() - 0.5) * 60,
      driftY: -40 - Math.random() * 60,
    }));
  }, [isDark]);

  return (
    <div 
      id="lumina-background-layers"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 transition-colors duration-500"
      aria-hidden="true"
    >
      {/* LAYER 1 - Base Gradient & Grain Texture Overlay */}
      <div 
        id="bg-layer-1-base"
        className={`absolute inset-0 transition-colors duration-500 ${
          isDark 
            ? 'bg-gradient-to-br from-[#090a0c] via-[#0f1515] to-[#0c0d10]' 
            : 'bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]'
        }`} 
      />
      <div 
        id="bg-layer-1-grain"
        className={`absolute inset-0 transition-opacity duration-500 grain-overlay ${
          isDark ? 'opacity-[0.035] mix-blend-screen' : 'opacity-[0.04] mix-blend-multiply'
        }`} 
      />

      {/* LAYER 2 - Gradient Mesh (Animated Orbs maintaining ethereal glassmorphic glow) */}
      <div id="bg-layer-2-mesh" className="absolute inset-0 overflow-hidden">
        {/* Orb 1: Top Left */}
        <motion.div
          id="mesh-orb-1"
          animate={{
            y: [0, -35, 0],
            x: [0, 25, 0],
            rotate: [0, 360],
          }}
          transition={{
            y: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
            x: { duration: 11, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
          }}
          className={`absolute -top-48 -left-48 w-[600px] h-[600px] rounded-full blur-3xl will-change-transform transition-all duration-700 ${
            isDark
              ? 'bg-gradient-to-br from-[#40e3bd]/15 via-zinc-700/20 to-[#1ea383]/15 opacity-50'
              : 'bg-gradient-to-br from-[#0d9488]/15 via-[#38bdf8]/12 to-[#40e3bd]/20 opacity-60'
          }`}
        />

        {/* Orb 2: Top Right */}
        <motion.div
          id="mesh-orb-2"
          animate={{
            y: [0, 40, 0],
            x: [0, -30, 0],
            rotate: [360, 0],
          }}
          transition={{
            y: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
            x: { duration: 13, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: 24, repeat: Infinity, ease: 'linear' },
          }}
          className={`absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full blur-3xl will-change-transform transition-all duration-700 ${
            isDark
              ? 'bg-gradient-to-br from-zinc-500/20 via-[#40e3bd]/10 to-neutral-700/25 opacity-40'
              : 'bg-gradient-to-br from-[#0284c7]/12 via-[#a78bfa]/10 to-[#14b8a6]/15 opacity-50'
          }`}
        />

        {/* Orb 3: Bottom Left */}
        <motion.div
          id="mesh-orb-3"
          animate={{
            y: [0, -45, 0],
            x: [0, -20, 0],
            rotate: [360, 0],
          }}
          transition={{
            y: { duration: 12, repeat: Infinity, ease: 'easeInOut' },
            x: { duration: 15, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: 28, repeat: Infinity, ease: 'linear' },
          }}
          className={`absolute -bottom-64 -left-64 w-[700px] h-[700px] rounded-full blur-3xl will-change-transform transition-all duration-700 ${
            isDark
              ? 'bg-gradient-to-br from-neutral-700/25 via-zinc-800/30 to-[#40e3bd]/12 opacity-40'
              : 'bg-gradient-to-br from-[#10b981]/12 via-[#06b6d4]/12 to-[#cbd5e1]/40 opacity-55'
          }`}
        />

        {/* Orb 4: Bottom Right */}
        <motion.div
          id="mesh-orb-4"
          animate={{
            y: [0, 30, 0],
            x: [0, 35, 0],
            rotate: [0, 360],
          }}
          transition={{
            y: { duration: 9, repeat: Infinity, ease: 'easeInOut' },
            x: { duration: 12, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: 22, repeat: Infinity, ease: 'linear' },
          }}
          className={`absolute -bottom-48 -right-48 w-[550px] h-[550px] rounded-full blur-3xl will-change-transform transition-all duration-700 ${
            isDark
              ? 'bg-gradient-to-br from-[#40e3bd]/15 via-zinc-700/20 to-neutral-800/25 opacity-40'
              : 'bg-gradient-to-br from-[#14b8a6]/15 via-[#64748b]/12 to-[#38bdf8]/15 opacity-50'
          }`}
        />
      </div>

      {/* LAYER 3 - Grid Pattern */}
      <div
        id="bg-layer-3-grid"
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: isDark ? 0.09 : 0.06,
          backgroundImage: isDark
            ? 'radial-gradient(circle, rgba(255, 255, 255, 0.4) 1px, transparent 1px)'
            : 'radial-gradient(circle, rgba(15, 23, 42, 0.25) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* LAYER 4 - Animated Particles */}
      <div id="bg-layer-4-particles" className="absolute inset-0 overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={`${p.id}-${isDark ? 'dark' : 'light'}`}
            id={`lumina-particle-${p.id}`}
            className="absolute rounded-full blur-[0.5px]"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            }}
            animate={{
              y: [0, p.driftY, 0],
              x: [0, p.driftX, 0],
              opacity: isDark ? [0.15, 0.7, 0.15] : [0.2, 0.8, 0.2],
              scale: [1, 1.25, 1],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  );
}
