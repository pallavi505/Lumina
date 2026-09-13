import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Award, 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  Printer, 
  ExternalLink, 
  ArrowRight,
  ChevronRight,
  Flame,
  Calendar,
  CloudCheck,
  Zap
} from 'lucide-react';
import type { DemoAccount, CertificateData, EarnedBadge, AICourse } from '../types';

interface CertificatesBadgesGalleryProps {
  currentUser: DemoAccount | null;
  courses: AICourse[];
  onViewCertificate: (cert: CertificateData) => void;
  onLaunchQuiz: () => void;
}

export default function CertificatesBadgesGallery({
  currentUser,
  courses,
  onViewCertificate,
  onLaunchQuiz
}: CertificatesBadgesGalleryProps) {
  const [activeSubTab, setActiveSubTab] = useState<'certificates' | 'badges'>('certificates');

  // Derive user certificates
  const userBadges = currentUser?.badges || [];

  const earnedCertificates: CertificateData[] = [
    {
      certificateId: 'LUMINA-SNA-9284',
      studentName: currentUser?.name || 'Lumina Scholar',
      studentId: currentUser?.id || 'demo_scholar',
      courseTitle: 'Macroeconomic & National Accounts Systems (SNA 2008 / 2025)',
      courseId: 'crs-macro-01',
      completedDate: 'September 10, 2026',
      grade: 'A+ (High Distinction)',
      score: 96,
      badgeEarned: 'National Accounts Master Practitioner',
      issuer: 'Lumina National Learning Academy & iGOT Karmayogi'
    },
    {
      certificateId: 'LUMINA-SURV-7142',
      studentName: currentUser?.name || 'Lumina Scholar',
      studentId: currentUser?.id || 'demo_scholar',
      courseTitle: 'Modern Sample Survey & High-Frequency CAPI Telemetry',
      courseId: 'crs-surv-02',
      completedDate: 'August 24, 2026',
      grade: 'A (Distinction)',
      score: 92,
      badgeEarned: 'Certified Field Survey Director',
      issuer: 'Lumina National Learning Academy'
    }
  ];

  const lockedBadges = [
    {
      id: 'locked-ai',
      title: 'Full-Stack AI Policy Architect',
      category: 'Emerging Technologies',
      icon: '⚡',
      requirement: 'Complete AI & Data Science Quiz with ≥85% score',
      courseTitle: 'Machine Learning Pipelines in Public Governance'
    },
    {
      id: 'locked-index',
      title: 'Price Indices & Inflation Modeler',
      category: 'Price Statistics Division',
      icon: '🏛️',
      requirement: 'Pass the CPI/WPI Harmonization Assessment',
      courseTitle: 'Price Indices & Inflation Dynamics'
    },
    {
      id: 'locked-telemetry',
      title: 'Cloud Paradata Auditor',
      category: 'Field Operations',
      icon: '🔬',
      requirement: 'Verify 500 GPS Geo-audit trails in live CAPI simulator',
      courseTitle: 'Modern CAPI Telemetry & Field QA'
    }
  ];

  return (
    <div className="rounded-3xl border border-zinc-800/90 bg-gradient-to-b from-[#0d1017]/95 via-[#0c0e15]/90 to-[#0d1017]/95 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-6">
      
      {/* Header & Subtabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#40e3bd]" />
            <span className="text-xs font-mono font-bold text-[#40e3bd] uppercase tracking-wider">
              Institutional Credentials
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold font-['Space_Grotesk'] text-white">
            Certificates & Skill Badges Gallery
          </h2>
          <p className="text-xs text-zinc-400">
            Verifiable cryptographically stamped credentials synced to your National Karmayogi Scholar registry
          </p>
        </div>

        {/* Subtab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-2xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveSubTab('certificates')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold font-['Space_Grotesk'] transition-all cursor-pointer ${
              activeSubTab === 'certificates'
                ? 'bg-[#40e3bd] text-[#052219] shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Certificates ({earnedCertificates.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('badges')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold font-['Space_Grotesk'] transition-all cursor-pointer ${
              activeSubTab === 'badges'
                ? 'bg-[#40e3bd] text-[#052219] shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Skill Badges ({userBadges.length + 3})
          </button>
        </div>
      </div>

      {/* View 1: Official Verifiable Certificates */}
      {activeSubTab === 'certificates' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {earnedCertificates.map(cert => (
              <div
                key={cert.certificateId}
                className="relative overflow-hidden rounded-2xl border border-[#40e3bd]/40 bg-gradient-to-r from-zinc-900/90 via-[#0e121a] to-zinc-900/80 p-5 sm:p-6 shadow-xl flex flex-col justify-between space-y-4 hover:border-[#40e3bd] transition-all group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#40e3bd]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#40e3bd]/20 transition-all" />

                <div className="space-y-3 relative z-10">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#40e3bd]/15 border border-[#40e3bd]/40 flex items-center justify-center text-[#40e3bd]">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <span className="font-mono text-xs font-bold text-[#40e3bd]">
                        {cert.certificateId}
                      </span>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] font-bold">
                      {cert.grade}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white font-['Space_Grotesk'] leading-snug">
                      {cert.courseTitle}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      Awarded to <strong className="text-zinc-200">{cert.studentName}</strong> • {cert.completedDate}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-[11px] text-zinc-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-zinc-400">
                      <Sparkles className="w-3.5 h-3.5 text-[#40e3bd]" />
                      Badge: <strong className="text-white">{cert.badgeEarned}</strong>
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">
                      Score: {cert.score}%
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800 flex items-center justify-between relative z-10">
                  <span className="text-[11px] text-zinc-500 font-mono">
                    Official Institutional Seal
                  </span>

                  <button
                    type="button"
                    onClick={() => onViewCertificate(cert)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#40e3bd] to-[#20b892] text-[#052219] font-bold text-xs font-['Space_Grotesk'] flex items-center gap-1.5 shadow-md hover:from-[#5ef8d5] transition-all cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>View & Print Certificate</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Action Prompt to earn more */}
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-white">Ready for your next Cadre credential?</h4>
                <p className="text-zinc-400">Take an assessment now to validate competencies and mint another official certificate.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onLaunchQuiz}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <span>Take Assessment</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      ) : (
        /* View 2: Skill Badges Showcase (Earned & Locked) */
        <div className="space-y-6">
          
          {/* Earned Badges Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#40e3bd] uppercase">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Earned & Verified Competency Badges</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Default Earned Badges */}
              {[
                {
                  title: 'National Accounts Master',
                  category: 'Macroeconomics',
                  icon: '📊',
                  date: 'September 2026',
                  desc: 'Certified competence in GDP rebasing, SUT balancing, and quarterly flash estimation.'
                },
                {
                  title: 'Certified Field Survey Director',
                  category: 'Survey Methodology',
                  icon: '🎓',
                  date: 'August 2026',
                  desc: 'Mastery in multi-stage cluster sampling, design effects, and CAPI paradata auditing.'
                },
                ...userBadges.map(b => ({
                  title: b.title,
                  category: b.category,
                  icon: b.icon,
                  date: new Date(b.earnedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                  desc: b.description
                }))
              ].map((b, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-[#40e3bd]/40 bg-zinc-900/80 shadow-[0_5px_20px_rgba(64,227,189,0.1)] flex items-start gap-3.5 hover:scale-[1.02] transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#40e3bd]/15 border border-[#40e3bd]/40 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                    {b.icon}
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-mono text-[#40e3bd] font-bold uppercase truncate">
                        {b.category}
                      </span>
                      <span className="text-[9px] text-emerald-400 font-mono font-bold flex items-center gap-0.5">
                        <CloudCheck className="w-2.5 h-2.5" />
                        VERIFIED
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white font-['Space_Grotesk'] leading-snug">
                      {b.title}
                    </h4>
                    <p className="text-[11px] text-zinc-400 line-clamp-2">
                      {b.desc}
                    </p>
                    <div className="text-[10px] text-zinc-500 font-mono pt-1">
                      Minted {b.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Locked Cadre Badges Section */}
          <div className="space-y-3 pt-4 border-t border-zinc-800">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-400 uppercase">
              <Lock className="w-4 h-4 text-zinc-500" />
              <span>Cadre Badges Available to Unlock</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {lockedBadges.map(lb => (
                <div
                  key={lb.id}
                  className="p-4 rounded-2xl border border-zinc-800 bg-zinc-950/60 flex flex-col justify-between space-y-3 opacity-75 hover:opacity-100 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700 flex items-center justify-center text-xl grayscale">
                      {lb.icon}
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-500 text-[10px] font-mono flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" />
                      Locked
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-zinc-200">{lb.title}</h4>
                    <p className="text-[11px] text-zinc-400 leading-snug">
                      <strong className="text-amber-400">Req:</strong> {lb.requirement}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={onLaunchQuiz}
                    className="w-full py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] font-semibold text-[#40e3bd] transition-colors cursor-pointer"
                  >
                    Attempt Unlock Quiz
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
