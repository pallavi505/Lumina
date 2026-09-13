import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Building2, 
  Mail, 
  FileText, 
  Download, 
  Award, 
  Check, 
  Clock, 
  Sparkles,
  UserCheck,
  UserX
} from 'lucide-react';
import type { PendingRegistrationRequest } from '../../data/adminData';

interface TraineeProfileModalProps {
  request: PendingRegistrationRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string, customTier?: string) => void;
  onReject: (id: string, reason: string) => void;
}

export default function TraineeProfileModal({
  request,
  isOpen,
  onClose,
  onApprove,
  onReject
}: TraineeProfileModalProps) {
  const [selectedTier, setSelectedTier] = useState<string>(request?.requestedAccessTier || 'Standard Trainee');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectReason, setRejectReason] = useState('Official credential or posting order verification incomplete.');
  const [previewDoc, setPreviewDoc] = useState<string | null>(null);

  if (!isOpen || !request) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl bg-[#091512] border border-[#40e3bd]/30 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden my-8"
        >
          {/* Header Banner */}
          <div className="relative p-6 bg-gradient-to-r from-[#0d231c] via-[#091a15] to-[#0d231c] border-b border-[#40e3bd]/20 flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="relative">
                <img
                  src={request.avatar}
                  alt={request.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#40e3bd]/50 shadow-md"
                />
                <span className="absolute -bottom-1.5 -right-1.5 p-1 rounded-full bg-[#091512] border border-[#40e3bd]/40">
                  {request.type === 'trainer' ? (
                    <Award className="w-3.5 h-3.5 text-[#40e3bd]" />
                  ) : (
                    <ShieldCheck className="w-3.5 h-3.5 text-[#40e3bd]" />
                  )}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                    {request.name}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#40e3bd]/15 text-[#40e3bd] border border-[#40e3bd]/30">
                    {request.type === 'trainer' ? 'Trainer Applicant' : 'Trainee Applicant'}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium border ${
                    request.status === 'approved'
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : request.status === 'rejected'
                      ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                      : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                  }`}>
                    {request.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-[#40e3bd] font-medium mt-1">
                  {request.cadre}
                </p>
                <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1.5 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-zinc-500" />
                    {request.department}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-zinc-500" />
                    {request.email}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700/50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Dossier Body */}
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Quick Verification Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-[#0d201a]/80 border border-[#40e3bd]/20 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#40e3bd]/10 text-[#40e3bd]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-zinc-400">Gov.in Domain Email</div>
                  <div className="text-xs font-semibold text-white flex items-center gap-1">
                    {request.govEmailVerified ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Verified NIC/Gov
                      </span>
                    ) : (
                      <span className="text-amber-400">External Domain</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0d201a]/80 border border-[#40e3bd]/20 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#40e3bd]/10 text-[#40e3bd]">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-zinc-400">Employee ID No.</div>
                  <div className="text-xs font-mono font-semibold text-white">
                    {request.employeeId}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0d201a]/80 border border-[#40e3bd]/20 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#40e3bd]/10 text-[#40e3bd]">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-zinc-400">Submitted On</div>
                  <div className="text-xs font-semibold text-white">
                    {request.submissionDate}
                  </div>
                </div>
              </div>
            </div>

            {/* Statement of Intent / Justification */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 font-['Space_Grotesk'] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#40e3bd]" />
                Official Statement of Intent & Learning Objectives
              </h4>
              <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 text-xs text-zinc-300 leading-relaxed font-sans">
                "{request.statementOfIntent}"
              </div>
            </div>

            {/* Attached Verification Documents */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 font-['Space_Grotesk'] flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-[#40e3bd]" />
                  Uploaded Verification Credentials ({request.documents.length})
                </h4>
                <span className="text-[11px] text-[#40e3bd] font-medium">All PDFs Cryptographically Sealed</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {request.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-[#40e3bd]/40 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-mono font-bold">
                        {doc.type}
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-xs font-medium text-zinc-200 truncate group-hover:text-white" title={doc.name}>
                          {doc.name}
                        </div>
                        <div className="text-[10px] text-zinc-500 font-mono">
                          {doc.size} • {doc.verified ? 'Verified Digilocker/Office' : 'Pending Physical Check'}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setPreviewDoc(previewDoc === doc.name ? null : doc.name)}
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-[#40e3bd]/20 text-zinc-300 hover:text-[#40e3bd] text-[11px] font-medium border border-zinc-700/60 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>{previewDoc === doc.name ? 'Viewing' : 'Inspect'}</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Mock Document Inspector if selected */}
              {previewDoc && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 rounded-xl bg-black/60 border border-[#40e3bd]/30 space-y-2 text-xs text-zinc-300"
                >
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="font-mono text-[#40e3bd] text-[11px]">Dossier Document Viewer: {previewDoc}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">Signature Hash Valid</span>
                  </div>
                  <p className="text-zinc-400 text-xs">
                    Official Gazette / Deputation Order issued under the seal of the Competent Cadre Controlling Authority. Candidate identity matches national database records.
                  </p>
                </motion.div>
              )}
            </div>

            {/* Department Recommendation */}
            {request.recommendationBy && (
              <div className="p-3.5 rounded-xl bg-[#0c241c]/50 border border-[#40e3bd]/20 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#40e3bd] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="text-zinc-400 text-[11px]">Departmental Recommendation / Endorser:</div>
                  <div className="font-semibold text-white mt-0.5">{request.recommendationBy}</div>
                </div>
              </div>
            )}

            {/* Access Tier Assignment */}
            <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 font-['Space_Grotesk'] block">
                Assign Accreditation Tier upon Approval
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  'Standard Trainee',
                  'High-Compute AI Sandbox Tier',
                  request.type === 'trainer' ? 'Master Course Author & Examiner' : 'Regional Field Lead'
                ].map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setSelectedTier(tier)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all cursor-pointer ${
                      selectedTier === tier
                        ? 'bg-[#40e3bd]/15 border-[#40e3bd] text-[#40e3bd] shadow-[0_0_12px_rgba(64,227,189,0.15)]'
                        : 'bg-zinc-800/60 border-zinc-700/60 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <div className="font-semibold">{tier}</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">
                      {tier.includes('High-Compute') ? 'Full GPU & telemetry access' : 'Curriculum & quiz pathway'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Rejection Note Input (if opened) */}
            {showRejectInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 space-y-2"
              >
                <label className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Specify Rejection or Clarification Reason for Candidate:
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-rose-500/40 text-xs text-zinc-200 focus:outline-none focus:border-rose-400"
                />
              </motion.div>
            )}
          </div>

          {/* Action Footer */}
          <div className="p-4 sm:p-6 bg-[#081310] border-t border-zinc-800 flex items-center justify-between gap-3 flex-wrap">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-medium text-zinc-300 transition-colors"
            >
              Close Dossier
            </button>

            <div className="flex items-center gap-2">
              {request.status === 'pending' && (
                <>
                  {!showRejectInput ? (
                    <button
                      onClick={() => setShowRejectInput(true)}
                      className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <UserX className="w-3.5 h-3.5" />
                      <span>Decline Request</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        onReject(request.id, rejectReason);
                        onClose();
                      }}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-rose-900/30"
                    >
                      <UserX className="w-3.5 h-3.5" />
                      <span>Confirm Rejection</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      onApprove(request.id, selectedTier);
                      onClose();
                    }}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#40e3bd] to-[#20b892] hover:from-[#5ef8d5] text-[#052219] text-xs font-bold font-['Space_Grotesk'] flex items-center gap-1.5 transition-all shadow-[0_0_20px_rgba(64,227,189,0.3)] cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Approve & Provision Access</span>
                  </button>
                </>
              )}

              {request.status !== 'pending' && (
                <span className="text-xs text-zinc-400 font-mono">
                  This request has already been marked as {request.status}.
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
