import { ShieldCheck, Mail, Phone, MapPin, ExternalLink, Globe, Sparkles } from 'lucide-react';
import LuminaLogo from './LuminaLogo';

interface FooterProps {
  onNavigateHome?: () => void;
  onNavigateLogin?: () => void;
}

export default function Footer({ onNavigateHome, onNavigateLogin }: FooterProps) {
  return (
    <footer 
      id="lumina-footer"
      className="relative z-20 w-full border-t border-zinc-800 bg-[#08080a] text-zinc-400 font-['Inter']"
    >
      {/* Upper Ecosystem Bar */}
      <div className="w-full border-b border-zinc-800/80 bg-zinc-900/50 py-4 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#40e3bd] shadow-[0_0_8px_rgba(64,227,189,0.5)]" />
            <span className="font-semibold text-zinc-200">
              National Statistical Capacity Initiative
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[11px] text-zinc-400">
            <span className="hover:text-[#40e3bd] transition-colors cursor-pointer">MoSPI Portal</span>
            <span>•</span>
            <span className="hover:text-[#40e3bd] transition-colors cursor-pointer">NSSTA Greater Noida</span>
            <span>•</span>
            <span className="hover:text-[#40e3bd] transition-colors cursor-pointer">iGOT Karmayogi Bharat</span>
            <span>•</span>
            <span className="hover:text-[#40e3bd] transition-colors cursor-pointer">National Data Warehouse</span>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Mission Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <LuminaLogo size="sm" showTagline={false} layout="horizontal" />
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed max-w-sm">
              LUMINA is India's dedicated institutional learning platform empowering the official statistical machinery. Built to upskill officers across National Accounts, CAPI survey telemetry, and modern data governance.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <div className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 flex items-center gap-1.5 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-[#40e3bd]" />
                <span>NIC GovCloud Host • ISO 27001</span>
              </div>
            </div>
          </div>

          {/* Column 2: Statistical Pathways */}
          <div className="space-y-3 text-xs">
            <h4 className="text-xs uppercase tracking-wider font-bold text-white font-['Space_Grotesk']">
              iGOT Pathways
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#igot-pathways" className="hover:text-[#40e3bd] transition-colors block">
                  National Accounts & SUT
                </a>
              </li>
              <li>
                <a href="#igot-pathways" className="hover:text-[#40e3bd] transition-colors block">
                  Survey Sampling & CAPI
                </a>
              </li>
              <li>
                <a href="#igot-pathways" className="hover:text-[#40e3bd] transition-colors block">
                  AI & Administrative Data
                </a>
              </li>
              <li>
                <a href="#igot-pathways" className="hover:text-[#40e3bd] transition-colors block">
                  Price Statistics & SDGs
                </a>
              </li>
              <li>
                <a href="#igot-pathways" className="hover:text-[#40e3bd] transition-colors block">
                  Microdata Dissemination
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Institutional Portals */}
          <div className="space-y-3 text-xs">
            <h4 className="text-xs uppercase tracking-wider font-bold text-white font-['Space_Grotesk']">
              Institutional Portals
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={onNavigateLogin} className="hover:text-[#40e3bd] transition-colors text-left cursor-pointer">
                  Official Portal Login
                </button>
              </li>
              <li>
                <a href="#announcements" className="hover:text-[#40e3bd] transition-colors block">
                  Public Circulars & Feeds
                </a>
              </li>
              <li>
                <a href="#live-statistics-banner" className="hover:text-[#40e3bd] transition-colors block">
                  Live National Metrics
                </a>
              </li>
              <li>
                <span className="text-zinc-500 hover:text-[#40e3bd] transition-colors flex items-center gap-1 cursor-pointer">
                  iGOT SSO Gateway <ExternalLink className="w-2.5 h-2.5 text-[#40e3bd]" />
                </span>
              </li>
              <li>
                <span className="text-zinc-500 hover:text-[#40e3bd] transition-colors flex items-center gap-1 cursor-pointer">
                  NSSTA Faculty Sandbox <ExternalLink className="w-2.5 h-2.5 text-[#40e3bd]" />
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Government Address */}
          <div className="space-y-3 text-xs">
            <h4 className="text-xs uppercase tracking-wider font-bold text-white font-['Space_Grotesk']">
              Nodal Office
            </h4>
            <div className="space-y-2 text-zinc-300 text-[11px] leading-relaxed">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#40e3bd] shrink-0 mt-0.5" />
                <span>
                  Sardar Patel Bhavan, Sansad Marg, New Delhi – 110001
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#40e3bd] shrink-0" />
                <span className="hover:text-[#40e3bd] transition-colors cursor-pointer">support-lumina@mospi.gov.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#40e3bd] shrink-0" />
                <span>011-23360889 (Toll Free: 1800-111-STAT)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer & Government Copyright */}
        <div className="mt-12 pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div className="text-center sm:text-left text-[11px]">
            <p>
              © 2026 Ministry of Statistics and Programme Implementation (MoSPI), Government of India.
            </p>
            <p className="text-zinc-500 mt-0.5">
              Content managed by National Statistical Systems Training Academy (NSSTA) & National Informatics Centre (NIC).
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="hover:text-[#40e3bd] transition-colors cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-[#40e3bd] transition-colors cursor-pointer">Terms of Use</span>
            <span>•</span>
            <span className="hover:text-[#40e3bd] transition-colors cursor-pointer">Hyperlink Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
