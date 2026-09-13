import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, CheckCircle2, Download, Printer, X, ShieldCheck, Share2 } from 'lucide-react';
import type { CertificateData } from '../types';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: CertificateData | null;
}

export default function CertificateModal({ isOpen, onClose, certificate }: CertificateModalProps) {
  if (!isOpen || !certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}?cert=${certificate.certificateId}`;
    navigator.clipboard?.writeText(url);
    alert('Verification link copied to clipboard!');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative z-10 w-full max-w-3xl bg-[#0e1117] border border-[#40e3bd]/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-white"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-[#090b0e]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#40e3bd]" />
              <span className="text-xs font-bold font-['Space_Grotesk'] tracking-wide text-zinc-300">
                Official Credential Verification • Lumina LMS
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                title="Print Certificate"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                onClick={handleCopyLink}
                className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                title="Copy Credential Link"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Certificate Body (Printable Artwork) */}
          <div className="p-8 sm:p-12 relative overflow-hidden bg-gradient-to-b from-[#131722] via-[#0e1117] to-[#121620]">
            {/* Elegant double border */}
            <div className="border-2 border-[#40e3bd]/40 rounded-2xl p-6 sm:p-10 relative bg-[#090b0e]/80 shadow-[inset_0_0_40px_rgba(64,227,189,0.05)]">
              {/* Watermark Logo Accent */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-5">
                <Award className="w-96 h-96 text-[#40e3bd]" />
              </div>

              <div className="relative z-10 text-center space-y-6">
                {/* Top Badge */}
                <div className="flex justify-center items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-[#40e3bd]/10 border border-[#40e3bd]/40 flex items-center justify-center text-[#40e3bd] shadow-[0_0_20px_rgba(64,227,189,0.2)]">
                    <Award className="w-6 h-6 fill-current" />
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[11px] font-mono tracking-[0.25em] text-[#40e3bd] uppercase">
                    Certificate of Competency Mastery
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white">
                    LUMINA NATIONAL LEARNING ACADEMY
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Recognized under Digital Governance & Statistical Capacity Building Standards
                  </p>
                </div>

                <div className="py-2">
                  <p className="text-xs text-zinc-400 italic">This is proudly presented to</p>
                  <div className="text-2xl sm:text-3xl font-black font-['Space_Grotesk'] text-[#40e3bd] tracking-wide mt-1">
                    {certificate.studentName}
                  </div>
                  <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-[#40e3bd] to-transparent mx-auto mt-2" />
                </div>

                <div className="max-w-xl mx-auto space-y-2">
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    for successfully completing all curriculum modules, hands-on lab exercises, and automated comprehension examinations for
                  </p>
                  <h3 className="text-lg sm:text-xl font-bold font-['Space_Grotesk'] text-white">
                    {certificate.courseTitle}
                  </h3>
                </div>

                {/* Bottom Signatures & Verification */}
                <div className="pt-8 border-t border-zinc-800/80 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center text-xs">
                  <div className="text-left space-y-1">
                    <div className="text-[11px] text-zinc-500">ISSUED ON</div>
                    <div className="font-semibold text-zinc-200">{certificate.completedDate}</div>
                    <div className="text-[10px] text-zinc-400">{certificate.issuer}</div>
                  </div>

                  <div className="text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#40e3bd]/10 border border-[#40e3bd]/30 text-[11px] font-bold text-[#40e3bd]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified Credential</span>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="text-[11px] text-zinc-500">CREDENTIAL ID</div>
                    <div className="font-mono text-zinc-300 text-[11px]">{certificate.certificateId}</div>
                    <div className="text-[10px] text-zinc-500">Tamper-Proof Ledger</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-zinc-800 bg-[#090b0e] gap-3">
            <span className="text-xs text-zinc-400">
              Unique hash generated and recorded on GovCloud secure verification nodes.
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#40e3bd] to-[#20b892] hover:from-[#5ef8d5] text-[#052219] font-bold font-['Space_Grotesk'] text-xs flex items-center gap-2 shadow-lg cursor-pointer transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save / Print PDF</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
