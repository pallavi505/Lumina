import { Clock, ShieldAlert, Mail, LogOut, BadgeCheck } from 'lucide-react';
import { motion } from 'motion/react';
import type { DemoAccount } from '../types';
import { canonicalApprovalStatus, resolveCadreBadge, roleLabel } from '../lib/rbac';
import { useTheme } from '../context/ThemeContext';

interface AccreditationPendingViewProps {
  currentUser: DemoAccount | null;
  onLogout: () => void;
}

export default function AccreditationPendingView({
  currentUser,
  onLogout,
}: AccreditationPendingViewProps) {
  const { isDark } = useTheme();
  const status = canonicalApprovalStatus(currentUser?.approvalStatus);
  const isRejected = status === 'Rejected';

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-3xl border p-8 sm:p-10 text-center shadow-2xl ${
          isDark
            ? 'bg-zinc-900/80 border-zinc-800'
            : 'bg-white border-slate-200'
        }`}
      >
        <div
          className={`mx-auto mb-6 w-16 h-16 rounded-2xl flex items-center justify-center ${
            isRejected
              ? 'bg-rose-500/15 text-rose-400'
              : 'bg-[#40e3bd]/15 text-[#40e3bd]'
          }`}
        >
          {isRejected ? <ShieldAlert className="w-8 h-8" /> : <Clock className="w-8 h-8" />}
        </div>

        <p className="text-[11px] font-mono uppercase tracking-widest text-[#40e3bd] mb-2">
          Capacity Connect • Officer Accreditation
        </p>
        <h1 className={`text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] mb-3 ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          {isRejected
            ? 'Accreditation Request Declined'
            : 'Accreditation Pending Verification'}
        </h1>
        <p className={`text-sm leading-relaxed max-w-lg mx-auto ${
          isDark ? 'text-zinc-400' : 'text-slate-600'
        }`}>
          {isRejected
            ? 'Your institutional dossier was not approved. Contact your NSSTA nodal officer or MoSPI capacity cell with supporting documentation to reapply.'
            : 'Your government identity, cadre credentials, and access tier are under review by the Academy Administrator. Dashboard, studio, and command surfaces remain locked until approval.'}
        </p>

        {currentUser && (
          <div className={`mt-8 rounded-2xl border p-4 text-left ${
            isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-xl object-cover border border-[#40e3bd]/40"
              />
              <div className="min-w-0">
                <p className={`font-semibold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {currentUser.name}
                </p>
                <p className={`text-xs truncate ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  {currentUser.email}
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#40e3bd]/15 text-[#40e3bd] border border-[#40e3bd]/30">
                <BadgeCheck className="w-3 h-3" />
                {resolveCadreBadge(currentUser)} Cadre
              </span>
              <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                isDark ? 'bg-zinc-800 text-zinc-300 border-zinc-700' : 'bg-white text-slate-700 border-slate-200'
              }`}>
                {roleLabel(currentUser.role)}
              </span>
              <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold ${
                isRejected
                  ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                  : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
              }`}>
                {status}
              </span>
            </div>
          </div>
        )}

        <div className={`mt-6 flex items-start gap-2 text-left text-xs rounded-xl p-3 ${
          isDark ? 'bg-zinc-950/40 text-zinc-500' : 'bg-slate-50 text-slate-500'
        }`}>
          <Mail className="w-4 h-4 mt-0.5 shrink-0 text-[#40e3bd]" />
          <span>
            Review updates are sent to your official email. Typical verification window is 1–2 working days for ISS / SSS / DES dossiers.
          </span>
        </div>

        <button
          onClick={onLogout}
          className={`mt-8 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border cursor-pointer ${
            isDark
              ? 'bg-zinc-900 border-zinc-700 text-zinc-200 hover:border-rose-500/40 hover:text-rose-300'
              : 'bg-white border-slate-200 text-slate-700 hover:border-rose-300 hover:text-rose-600'
          }`}
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </motion.div>
    </div>
  );
}
