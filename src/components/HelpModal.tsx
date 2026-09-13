import { motion, AnimatePresence } from 'motion/react';
import { X, HelpCircle, Mail, Shield, BookOpen, ExternalLink } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          id="lumina-help-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <motion.div
            id="lumina-help-dialog"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-lg p-6 sm:p-8 rounded-2xl bg-[#0e0e11] border border-zinc-800 shadow-2xl lumina-glow-card"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-zinc-700 via-[#40e3bd] to-zinc-700" />

            <button
              id="btn-close-help-modal"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#40e3bd]/10 border border-[#40e3bd]/30 flex items-center justify-center text-[#40e3bd]">
                <HelpCircle className="w-5 h-5 text-[#40e3bd]" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
                  Lumina Help & Authentication Support
                </h3>
                <p className="text-xs text-zinc-400">Institutional Knowledge & Troubleshooting</p>
              </div>
            </div>

            <div className="space-y-3.5 my-5 text-xs text-zinc-300">
              <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-start gap-3">
                <Shield className="w-4 h-4 text-[#40e3bd] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white mb-0.5">Single Sign-On (SSO) Assistance</div>
                  <p className="text-zinc-400 leading-relaxed">
                    If your university or enterprise uses SAML/OAuth (Google Workspace, Microsoft Entra ID, or Okta), click the respective provider icon.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-start gap-3">
                <BookOpen className="w-4 h-4 text-[#40e3bd] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white mb-0.5">Quick Demo Persona Credentials</div>
                  <p className="text-zinc-400 leading-relaxed">
                    Use the 1-click pills on the sign-in form (Elena for Student, Dr. Julian for Faculty, Marcus for Enterprise) to preview the experience.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#40e3bd] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white mb-0.5">Campus IT Hotline</div>
                  <p className="text-zinc-400 leading-relaxed">
                    Support desk available 24/7 at <span className="text-[#40e3bd] font-mono">support@lumina.edu</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
              <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                Lumina Support Docs <ExternalLink className="w-3 h-3 text-[#40e3bd]" />
              </span>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#40e3bd]/15 hover:bg-[#40e3bd]/25 text-[#40e3bd] text-xs font-semibold transition-colors border border-[#40e3bd]/40"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
