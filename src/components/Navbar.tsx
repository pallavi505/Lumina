import { useEffect, useRef, useState } from 'react';
import {
  HelpCircle,
  LogIn,
  Sparkles,
  BookOpen,
  LogOut,
  Bell,
  Sun,
  Moon,
  ShieldCheck,
  Layers,
  BarChart3,
  Megaphone,
  Users,
  UserCheck,
  ClipboardCheck,
  ChevronDown,
  Home,
} from 'lucide-react';
import { motion } from 'motion/react';
import LuminaLogo from './LuminaLogo';
import type { AppView, DemoAccount } from '../types';
import { useLiveNotifications } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';
import {
  canonicalRole,
  isApproved,
  resolveCadreBadge,
  roleLabel,
  type AdminStudioModule,
  type TrainerStudioTab,
} from '../lib/rbac';

interface NavbarProps {
  currentView: AppView;
  currentUser: DemoAccount | null;
  trainerTab?: TrainerStudioTab;
  adminModule?: AdminStudioModule;
  onNavigateHome: () => void;
  onNavigateLogin: () => void;
  onNavigateDashboard: () => void;
  onNavigateExplore: () => void;
  onNavigateProgress: () => void;
  onNavigateProfile: () => void;
  onNavigateTrainerStudio: (tab?: TrainerStudioTab) => void;
  onNavigateAdminStudio: (module?: AdminStudioModule) => void;
  onOpenBroadcast?: () => void;
  onOpenCreateCourse: () => void;
  onHelpClick: () => void;
  onLogout: () => void;
}

function navBtnClass(active: boolean, isDark: boolean) {
  if (active) {
    return isDark
      ? 'text-[#40e3bd] bg-[#40e3bd]/10'
      : 'text-teal-700 bg-teal-50 font-semibold';
  }
  return isDark
    ? 'hover:text-[#40e3bd]'
    : 'hover:text-teal-700 hover:bg-slate-100';
}

export default function Navbar({
  currentView,
  currentUser,
  trainerTab,
  adminModule,
  onNavigateHome,
  onNavigateLogin,
  onNavigateDashboard,
  onNavigateExplore,
  onNavigateProgress,
  onNavigateProfile,
  onNavigateTrainerStudio,
  onNavigateAdminStudio,
  onOpenBroadcast,
  onOpenCreateCourse,
  onHelpClick,
  onLogout,
}: NavbarProps) {
  const { unreadCount, toggleDrawer, isOpen: isNotificationsOpen } = useLiveNotifications();
  const { theme, toggleTheme, isDark } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  const role = currentUser ? canonicalRole(currentUser.role) : null;
  const approved = isApproved(currentUser);
  const cadreBadge = resolveCadreBadge(currentUser);

  useEffect(() => {
    const onDocClick = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (currentView !== 'home') {
      onNavigateHome();
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAnnouncements = () => {
    if (currentUser && approved && role === 'trainee') {
      toggleDrawer();
      return;
    }
    scrollToSection('announcements');
  };

  return (
    <header
      id="lumina-top-navbar"
      className={`relative z-30 w-full px-4 sm:px-8 py-3.5 flex items-center justify-between border-b transition-colors duration-300 backdrop-blur-md sticky top-0 ${
        isDark
          ? 'border-zinc-800/80 bg-[#0c0d10]/90 text-zinc-100'
          : 'border-slate-200/90 bg-white/85 text-slate-800 shadow-sm'
      }`}
    >
      <div className="flex items-center gap-4 min-w-0">
        <div onClick={onNavigateHome} className="cursor-pointer" title="LUMINA - Home">
          <LuminaLogo size="sm" showTagline={false} layout="horizontal" />
        </div>

        <div
          className={`hidden lg:flex items-center gap-1 pl-3 border-l text-xs font-['Inter'] ${
            isDark ? 'border-zinc-800 text-zinc-400' : 'border-slate-300 text-slate-600'
          }`}
        >
          <button
            onClick={onNavigateHome}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${navBtnClass(currentView === 'home', isDark)}`}
          >
            <Home className="w-3.5 h-3.5" />
            Home
          </button>

          {!currentUser && (
            <button
              onClick={() => scrollToSection('platform-features')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                isDark ? 'hover:text-[#40e3bd] hover:bg-[#40e3bd]/10' : 'hover:text-teal-700 hover:bg-teal-50'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${isDark ? 'text-[#40e3bd]' : 'text-teal-600'}`} />
              Features
            </button>
          )}

          {currentUser && approved && role === 'trainee' && (
            <>
              <button
                onClick={onNavigateDashboard}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${navBtnClass(currentView === 'dashboard', isDark)}`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Dashboard
              </button>
              <button
                onClick={onNavigateExplore}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${navBtnClass(currentView === 'explore', isDark)}`}
              >
                Explore Courses
              </button>
              <button
                onClick={onNavigateProgress}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${navBtnClass(currentView === 'progress', isDark)}`}
              >
                My Progress
              </button>
            </>
          )}

          {currentUser && approved && role === 'trainer' && (
            <>
              <button
                onClick={() => onNavigateTrainerStudio('assessment-creator')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${navBtnClass(currentView === 'trainer-dashboard' && trainerTab === 'assessment-creator', isDark)}`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Trainer Studio
              </button>
              <button
                onClick={() => onNavigateTrainerStudio('material-library')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${navBtnClass(currentView === 'trainer-dashboard' && trainerTab === 'material-library', isDark)}`}
              >
                <Layers className="w-3.5 h-3.5" />
                Material Manager
              </button>
              <button
                onClick={() => onNavigateTrainerStudio('assessment-creator')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${navBtnClass(currentView === 'trainer-dashboard' && trainerTab === 'assessment-creator', isDark)}`}
              >
                <ClipboardCheck className="w-3.5 h-3.5" />
                Assessment Creator
              </button>
              <button
                onClick={() => onNavigateTrainerStudio('performance-tracker')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${navBtnClass(currentView === 'trainer-dashboard' && trainerTab === 'performance-tracker', isDark)}`}
              >
                <Users className="w-3.5 h-3.5" />
                Cohort Tracker
              </button>
            </>
          )}

          {currentUser && approved && role === 'admin' && (
            <>
              <button
                onClick={() => onNavigateAdminStudio('queue')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${navBtnClass(currentView === 'admin-dashboard' && adminModule === 'queue', isDark)}`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                Approval Queue
              </button>
              <button
                onClick={() => onNavigateAdminStudio('analytics')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${navBtnClass(currentView === 'admin-dashboard' && adminModule === 'analytics', isDark)}`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                System Analytics
              </button>
              <button
                onClick={() => {
                  onNavigateAdminStudio('queue');
                  onOpenBroadcast?.();
                }}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isDark ? 'hover:text-[#40e3bd]' : 'hover:text-teal-700 hover:bg-slate-100'
                }`}
              >
                <Megaphone className="w-3.5 h-3.5" />
                Broadcast Dispatcher
              </button>
              <button
                onClick={() => onNavigateAdminStudio('users')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${navBtnClass(currentView === 'admin-dashboard' && adminModule === 'users', isDark)}`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Role Management
              </button>
            </>
          )}

          {(!currentUser || (approved && role === 'trainee')) && (
            <button
              onClick={handleAnnouncements}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                isDark ? 'hover:text-[#40e3bd] hover:bg-[#40e3bd]/10' : 'hover:text-teal-700 hover:bg-teal-50'
              }`}
            >
              Announcements
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-2.5">
        {currentUser && approved && role === 'trainer' && (
          <button
            onClick={onOpenCreateCourse}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold font-['Space_Grotesk'] transition-all cursor-pointer ${
              isDark
                ? 'bg-[#40e3bd]/15 hover:bg-[#40e3bd]/25 border border-[#40e3bd]/40 text-[#40e3bd]'
                : 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Author Course
          </button>
        )}

        <button
          id="btn-global-theme-toggle"
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to High-Contrast Light Mode' : 'Switch to Dark Mode'}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
            isDark
              ? 'bg-zinc-900/80 hover:bg-zinc-800 text-amber-300 border-zinc-700/70 hover:border-amber-400/50 shadow-sm'
              : 'bg-white/95 hover:bg-slate-100 text-slate-800 border-slate-300 hover:border-teal-600/50 shadow-sm'
          }`}
        >
          <motion.div
            key={theme}
            initial={{ rotate: -90, scale: 0.6, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="flex items-center justify-center"
          >
            {isDark ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-teal-700" />}
          </motion.div>
          <span className="hidden sm:inline font-['Space_Grotesk'] text-[11px] font-bold">
            {isDark ? 'Light' : 'Dark'}
          </span>
        </button>

        <button
          id="btn-nav-help"
          onClick={onHelpClick}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
            isDark
              ? 'text-zinc-300 hover:text-[#40e3bd] bg-zinc-900/70 hover:bg-[#40e3bd]/10 border-zinc-800 hover:border-[#40e3bd]/50'
              : 'text-slate-700 hover:text-teal-700 bg-white/80 hover:bg-teal-50 border-slate-200 shadow-sm'
          }`}
        >
          <HelpCircle className={`w-3.5 h-3.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`} />
          <span className="hidden sm:inline">Helpdesk</span>
        </button>

        {currentUser && approved && (
          <button
            id="btn-nav-live-notifications"
            onClick={toggleDrawer}
            aria-label={`Live Notifications: ${unreadCount} unread`}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
              isNotificationsOpen
                ? isDark
                  ? 'bg-[#40e3bd]/20 border-[#40e3bd]/50 text-[#40e3bd]'
                  : 'bg-teal-50 border-teal-500 text-teal-800 shadow-sm'
                : unreadCount > 0
                ? isDark
                  ? 'bg-zinc-900/90 hover:bg-[#40e3bd]/15 border-zinc-700/80 text-zinc-200'
                  : 'bg-white hover:bg-teal-50 border-slate-300 text-slate-800 shadow-sm'
                : isDark
                  ? 'bg-zinc-900/70 hover:bg-zinc-800 border-zinc-800 text-zinc-400'
                  : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-600 shadow-sm'
            }`}
          >
            <Bell className={`w-3.5 h-3.5 ${unreadCount > 0 ? (isDark ? 'text-[#40e3bd]' : 'text-teal-600') : ''}`} />
            <span className="hidden md:inline font-['Space_Grotesk'] font-semibold">Updates</span>
            {unreadCount > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold leading-none ${
                isDark ? 'bg-[#40e3bd] text-[#052219]' : 'bg-teal-600 text-white'
              }`}>
                {unreadCount}
              </span>
            )}
          </button>
        )}

        {currentUser ? (
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((open) => !open)}
              className={`flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border transition-all cursor-pointer ${
                profileOpen || currentView === 'profile'
                  ? isDark
                    ? 'bg-[#40e3bd]/20 border-[#40e3bd] text-[#40e3bd]'
                    : 'bg-teal-50 border-teal-500 text-teal-800 shadow-sm'
                  : isDark
                    ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-200'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800 shadow-sm'
              }`}
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className={`w-6 h-6 rounded-lg object-cover border ${isDark ? 'border-[#40e3bd]/40' : 'border-teal-500'}`}
              />
              <span className="text-xs font-semibold truncate max-w-[100px] hidden sm:inline">
                {currentUser.name.split(' ')[0]}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            {profileOpen && (
              <div
                className={`absolute right-0 mt-2 w-72 rounded-2xl border shadow-2xl overflow-hidden z-50 ${
                  isDark ? 'bg-[#121318] border-zinc-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className={`p-4 border-b ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
                  <div className="flex items-center gap-3">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-xl object-cover border border-[#40e3bd]/40"
                    />
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {currentUser.name}
                      </p>
                      <p className={`text-[11px] truncate ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                        {currentUser.email}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#40e3bd]/15 text-[#40e3bd] border border-[#40e3bd]/30">
                      {cadreBadge} Cadre
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      isDark ? 'bg-zinc-800 text-zinc-300 border-zinc-700' : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {roleLabel(currentUser.role)}
                    </span>
                    {!approved && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        {currentUser.approvalStatus || 'Pending'}
                      </span>
                    )}
                  </div>
                </div>
                {approved && role === 'trainee' && (
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      onNavigateProfile();
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-semibold cursor-pointer ${
                      isDark ? 'hover:bg-zinc-800 text-zinc-200' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    View Profile
                  </button>
                )}
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    onLogout();
                  }}
                  className={`w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold cursor-pointer ${
                    isDark
                      ? 'hover:bg-rose-500/10 text-rose-300'
                      : 'hover:bg-rose-50 text-rose-600'
                  }`}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              id="btn-nav-login"
              onClick={onNavigateLogin}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold font-['Space_Grotesk'] text-xs transition-all cursor-pointer active:scale-95 ${
                isDark
                  ? 'bg-gradient-to-r from-[#40e3bd] via-[#35d8b2] to-[#20b892] text-[#052219] shadow-[0_0_20px_rgba(64,227,189,0.35)]'
                  : 'bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-700 text-white shadow-md'
              }`}
            >
              <LogIn className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Portal Login</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
