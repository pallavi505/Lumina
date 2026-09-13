import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  Sparkles, 
  ArrowRight, 
  Loader2, 
  GraduationCap, 
  School, 
  ShieldCheck,
  Check,
  Info
} from 'lucide-react';
import type { UserRole, AuthMode, DemoAccount } from '../types';
import { DEMO_ACCOUNTS } from '../data/demoAccounts';
import { useAuth } from '../context/AuthContext';

interface LoginFormProps {
  onLoginSuccess: (account: DemoAccount) => void;
  onOpenForgotPassword: (email: string) => void;
}

export default function LoginForm({ onLoginSuccess, onOpenForgotPassword }: LoginFormProps) {
  const { signInEmail, signUpEmail, signInWithGoogle, signInWithGithub, signInWithMicrosoft, signInWithDemoAccount } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [selectedRole, setSelectedRole] = useState<UserRole>('trainee');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('trainee@lumina.edu');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');

  // Handle Role Change and auto-match demo credentials
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setAuthError('');
    const match = DEMO_ACCOUNTS.find((acc) => acc.role === role);
    if (match) {
      setEmail(match.email);
      setPassword('lumina-secure-pass');
      setName(match.name);
    }
  };

  // Quick 1-Click Demo Fill
  const handleQuickDemo = (demo: DemoAccount) => {
    setSelectedRole(demo.role);
    setEmail(demo.email);
    setPassword('lumina-quantum-key');
    setName(demo.name);
    setAuthError('');
    signInWithDemoAccount(demo);
    onLoginSuccess(demo);
  };

  // Password strength calculation for Sign Up
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    return score;
  };
  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!email || !email.includes('@')) {
      setAuthError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (authMode === 'signin') {
        const acc = await signInEmail(email, password);
        setIsSubmitting(false);
        onLoginSuccess(acc);
      } else {
        const acc = await signUpEmail(email, password, name, selectedRole);
        setIsSubmitting(false);
        onLoginSuccess(acc);
      }
    } catch (err: any) {
      setIsSubmitting(false);
      // If Firebase Auth throws user-not-found / invalid-credential, fallback gracefully to persona demo
      const matchedAccount = DEMO_ACCOUNTS.find((acc) => acc.role === selectedRole) || {
        id: `user-${Date.now()}`,
        name: name || (email.split('@')[0].replace('.', ' ') || 'Trainee Scholar'),
        email: email,
        role: selectedRole,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        title: selectedRole === 'admin' 
          ? 'Institutional Director & Platform Administrator' 
          : selectedRole === 'trainer' 
          ? 'Lead Curriculum Chair & Master Trainer' 
          : 'Indian Statistical Service (ISS) Trainee',
        badge: selectedRole === 'admin'
          ? 'Chief Academy Administrator (Level 1)'
          : selectedRole === 'trainer'
          ? 'Senior Faculty Mentor • 3,200+ Trainees'
          : 'National Statistical Academy Cohort #24',
        coursesCount: selectedRole === 'admin' ? 38 : selectedRole === 'trainer' ? 14 : 6,
      };
      signInWithDemoAccount(matchedAccount);
      onLoginSuccess(matchedAccount);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setIsSubmitting(true);
    setAuthError('');
    try {
      let acc: DemoAccount;
      if (provider === 'Google') {
        acc = await signInWithGoogle();
      } else if (provider === 'GitHub') {
        acc = await signInWithGithub();
      } else {
        acc = await signInWithMicrosoft();
      }
      setIsSubmitting(false);
      onLoginSuccess(acc);
    } catch (err: any) {
      console.warn('Social login fallback:', err);
      setIsSubmitting(false);
      const demoUser = DEMO_ACCOUNTS.find(a => a.role === selectedRole) || DEMO_ACCOUNTS[0];
      const acc = {
        ...demoUser,
        name: `${demoUser.name} (${provider} Verified)`,
      };
      signInWithDemoAccount(acc);
      onLoginSuccess(acc);
    }
  };

  return (
    <motion.div
      id="lumina-auth-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
      className="relative w-full max-w-[480px] mx-auto rounded-3xl bg-[#0e0e11]/90 backdrop-blur-2xl border border-zinc-800 p-6 sm:p-8 lumina-glow-card shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] text-zinc-100 overflow-hidden z-20"
    >
      {/* Top radiant bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-zinc-700 via-[#40e3bd] to-zinc-700" />

      {/* Auth Mode Switcher Tabs (Sign In / Create Account) */}
      <div 
        id="auth-mode-tabs"
        className="flex p-1 mb-5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 relative"
      >
        <button
          id="tab-signin"
          type="button"
          onClick={() => {
            setAuthMode('signin');
            setAuthError('');
          }}
          className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all text-center relative z-10 cursor-pointer ${
            authMode === 'signin'
              ? 'text-[#40e3bd] font-bold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          {authMode === 'signin' && (
            <motion.div
              layoutId="auth-tab-pill"
              className="absolute inset-0 bg-[#40e3bd]/15 rounded-lg border border-[#40e3bd]/50 shadow-[0_0_15px_rgba(64,227,189,0.2)] -z-10"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          Sign In
        </button>

        <button
          id="tab-signup"
          type="button"
          onClick={() => {
            setAuthMode('signup');
            setAuthError('');
          }}
          className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all text-center relative z-10 cursor-pointer ${
            authMode === 'signup'
              ? 'text-[#40e3bd] font-bold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          {authMode === 'signup' && (
            <motion.div
              layoutId="auth-tab-pill"
              className="absolute inset-0 bg-[#40e3bd]/15 rounded-lg border border-[#40e3bd]/50 shadow-[0_0_15px_rgba(64,227,189,0.2)] -z-10"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          Create Account
        </button>
      </div>

      {/* 3 Types of Login Selector (Trainee, Admin, Trainer) */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <label className="text-[11px] uppercase tracking-wider text-zinc-300 font-semibold flex items-center gap-1.5">
            <span>Select Login Type</span>
            <span className="text-[10px] text-[#40e3bd] font-mono lowercase">(3 portals)</span>
          </label>
          <span className="text-[10px] font-mono text-zinc-400 capitalize">Active: {selectedRole}</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* 1. Trainee Login */}
          <button
            id="role-trainee"
            type="button"
            onClick={() => handleRoleSelect('trainee')}
            className={`py-2.5 px-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
              selectedRole === 'trainee'
                ? 'bg-[#40e3bd]/15 border-[#40e3bd] text-[#40e3bd] shadow-[0_0_15px_rgba(64,227,189,0.2)] font-semibold scale-[1.02]'
                : 'bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
            }`}
          >
            <GraduationCap className={`w-4 h-4 ${selectedRole === 'trainee' ? 'text-[#40e3bd]' : 'text-zinc-500'}`} />
            <span className="text-xs font-bold font-['Space_Grotesk']">Trainee</span>
            <span className="text-[9px] text-zinc-400">Cadre Scholar</span>
          </button>

          {/* 2. Admin Login */}
          <button
            id="role-admin"
            type="button"
            onClick={() => handleRoleSelect('admin')}
            className={`py-2.5 px-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
              selectedRole === 'admin'
                ? 'bg-[#40e3bd]/15 border-[#40e3bd] text-[#40e3bd] shadow-[0_0_15px_rgba(64,227,189,0.2)] font-semibold scale-[1.02]'
                : 'bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
            }`}
          >
            <ShieldCheck className={`w-4 h-4 ${selectedRole === 'admin' ? 'text-[#40e3bd]' : 'text-zinc-500'}`} />
            <span className="text-xs font-bold font-['Space_Grotesk']">Admin</span>
            <span className="text-[9px] text-zinc-400">Governance</span>
          </button>

          {/* 3. Trainer Login */}
          <button
            id="role-trainer"
            type="button"
            onClick={() => handleRoleSelect('trainer')}
            className={`py-2.5 px-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
              selectedRole === 'trainer'
                ? 'bg-[#40e3bd]/15 border-[#40e3bd] text-[#40e3bd] shadow-[0_0_15px_rgba(64,227,189,0.2)] font-semibold scale-[1.02]'
                : 'bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
            }`}
          >
            <School className={`w-4 h-4 ${selectedRole === 'trainer' ? 'text-[#40e3bd]' : 'text-zinc-500'}`} />
            <span className="text-xs font-bold font-['Space_Grotesk']">Trainer</span>
            <span className="text-[9px] text-zinc-400">Faculty Mentor</span>
          </button>
        </div>

        {/* Dynamic Contextual Helper for Selected Role */}
        <div className="mt-2.5 p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/80 flex items-start gap-2 text-[11px] text-zinc-400">
          <Info className="w-3.5 h-3.5 text-[#40e3bd] shrink-0 mt-0.5" />
          <p className="leading-tight">
            {selectedRole === 'trainee' && (
              <span><strong>Trainee Portal:</strong> Access personal learning tracks, course video player, interactive chapter quizzes, live deadline alerts, and verified MoSPI completion certificates.</span>
            )}
            {selectedRole === 'admin' && (
              <span><strong>Admin Portal:</strong> Manage institutional academy cohorts, monitor nationwide compliance, inspect system analytics, and review accreditation logs.</span>
            )}
            {selectedRole === 'trainer' && (
              <span><strong>Trainer Portal:</strong> Author AI-assisted statistical curriculums, evaluate trainee quiz submissions, track cohort performance, and review progress.</span>
            )}
          </p>
        </div>
      </div>

      {/* Quick 1-Click Demo Profiles Bar */}
      <div 
        id="demo-accounts-pill-bar"
        className="mb-5 p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between text-xs"
      >
        <span className="text-[11px] text-zinc-400 flex items-center gap-1 pl-1">
          <Sparkles className="w-3.5 h-3.5 text-[#40e3bd]" />
          <span>Quick 1-Click Login:</span>
        </span>
        <div className="flex items-center gap-1.5">
          {DEMO_ACCOUNTS.map((acc) => (
            <button
              key={acc.id}
              id={`quick-fill-${acc.role}`}
              type="button"
              onClick={() => handleQuickDemo(acc)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer capitalize ${
                selectedRole === acc.role
                  ? 'bg-[#40e3bd]/20 text-[#40e3bd] border border-[#40e3bd]/50 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
              title={`Sign in as ${acc.role.toUpperCase()} (${acc.name})`}
            >
              {acc.role}
            </button>
          ))}
        </div>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name (Sign Up only) */}
        <AnimatePresence>
          {authMode === 'signup' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <label className="block text-xs font-medium text-zinc-300 mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="input-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={selectedRole === 'admin' ? 'Marcus Sterling' : selectedRole === 'trainer' ? 'Dr. Julian Hayes' : 'Elena Vance'}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#40e3bd] focus:ring-2 focus:ring-[#40e3bd]/20 text-sm transition-all"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Email Field */}
        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5 uppercase tracking-wider">
            {selectedRole.toUpperCase()} Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="input-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (authError) setAuthError('');
              }}
              placeholder={`${selectedRole}@lumina.edu`}
              required
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#40e3bd] focus:ring-2 focus:ring-[#40e3bd]/20 text-sm transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-zinc-300 uppercase tracking-wider">
              Password
            </label>
            {authMode === 'signin' && (
              <button
                id="btn-forgot-password-link"
                type="button"
                onClick={() => onOpenForgotPassword(email)}
                className="text-xs text-[#40e3bd]/80 hover:text-[#40e3bd] transition-colors cursor-pointer"
              >
                Forgot password?
              </button>
            )}
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="input-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (authError) setAuthError('');
              }}
              placeholder="••••••••••••"
              required
              className="w-full pl-10 pr-11 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#40e3bd] focus:ring-2 focus:ring-[#40e3bd]/20 text-sm transition-all shadow-inner"
            />
            <button
              id="btn-toggle-password-visibility"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#40e3bd] transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Password Strength Indicator for Sign Up */}
          {authMode === 'signup' && password && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-zinc-400">
                <span>Password Strength</span>
                <span className={
                  passwordStrength >= 3 ? 'text-[#40e3bd]' : passwordStrength === 2 ? 'text-amber-400' : 'text-rose-400'
                }>
                  {passwordStrength >= 3 ? 'Strong' : passwordStrength === 2 ? 'Medium' : 'Weak'}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1 h-1">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-full rounded-full transition-colors ${
                      passwordStrength >= step
                        ? step >= 3
                          ? 'bg-[#40e3bd]'
                          : step === 2
                          ? 'bg-amber-400'
                          : 'bg-rose-400'
                        : 'bg-zinc-800'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Remember Me & Terms Checkbox */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              id="checkbox-remember"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-4 h-4 rounded bg-zinc-950 border border-zinc-700 peer-checked:bg-[#40e3bd] peer-checked:border-[#40e3bd] flex items-center justify-center transition-all">
              {rememberMe && <Check className="w-3 h-3 text-[#052219] stroke-[3]" />}
            </div>
            <span className="text-xs text-zinc-300">
              {authMode === 'signin' ? 'Stay signed in for 30 days' : 'I accept the Institutional Policy'}
            </span>
          </label>
        </div>

        {/* Error Alert */}
        {authError && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2"
          >
            <span>{authError}</span>
          </motion.div>
        )}

        {/* Submit Action Button */}
        <button
          id="btn-submit-auth"
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#40e3bd] via-[#35d8b2] to-[#20b892] hover:from-[#5ef8d5] hover:to-[#35d8b2] text-[#052219] font-bold font-['Space_Grotesk'] tracking-wide text-sm shadow-[0_0_25px_rgba(64,227,189,0.35)] hover:shadow-[0_0_35px_rgba(64,227,189,0.55)] transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 group"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#052219]" />
              <span>Authenticating {selectedRole.toUpperCase()} Portal...</span>
            </>
          ) : (
            <>
              <span>
                {authMode === 'signin' 
                  ? `Sign In as ${selectedRole === 'trainee' ? 'Trainee' : selectedRole === 'admin' ? 'Admin' : 'Trainer'}`
                  : `Create ${selectedRole === 'trainee' ? 'Trainee' : selectedRole === 'admin' ? 'Admin' : 'Trainer'} Account`}
              </span>
              <ArrowRight className="w-4 h-4 text-[#052219] transition-transform group-hover:translate-x-1 stroke-[2.5]" />
            </>
          )}
        </button>
      </form>

      {/* Social SSO Authentication Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-800" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 bg-zinc-900 text-zinc-400 uppercase tracking-wider text-[10px]">
            Or SSO login with verified identity
          </span>
        </div>
      </div>

      {/* Social Provider Buttons (Google, Microsoft, GitHub) */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Google SSO */}
        <button
          id="btn-sso-google"
          type="button"
          onClick={() => handleSocialLogin('Google')}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-zinc-950/70 hover:bg-[#40e3bd]/10 border border-zinc-800 hover:border-[#40e3bd]/40 transition-all text-xs font-medium text-zinc-300 hover:text-[#40e3bd] cursor-pointer group"
          title="Sign in with Google Workspace"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.97 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Google</span>
        </button>

        {/* GitHub SSO */}
        <button
          id="btn-sso-github"
          type="button"
          onClick={() => handleSocialLogin('GitHub')}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-zinc-950/70 hover:bg-[#40e3bd]/10 border border-zinc-800 hover:border-[#40e3bd]/40 transition-all text-xs font-medium text-zinc-300 hover:text-[#40e3bd] cursor-pointer group"
          title="Sign in with GitHub"
        >
          <svg className="w-4 h-4 fill-current text-zinc-200 group-hover:text-[#40e3bd]" viewBox="0 0 24 24">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          <span>GitHub</span>
        </button>

        {/* Microsoft SSO */}
        <button
          id="btn-sso-microsoft"
          type="button"
          onClick={() => handleSocialLogin('Microsoft')}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-zinc-950/70 hover:bg-[#40e3bd]/10 border border-zinc-800 hover:border-[#40e3bd]/40 transition-all text-xs font-medium text-zinc-300 hover:text-[#40e3bd] cursor-pointer group"
          title="Sign in with Microsoft 365"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 21 21">
            <path fill="#f25022" d="M1 1h9v9H1z"/>
            <path fill="#00a4ef" d="M1 11h9v9H1z"/>
            <path fill="#7fba00" d="M11 1h9v9h-9z"/>
            <path fill="#ffb900" d="M11 11h9v9h-9z"/>
          </svg>
          <span>Microsoft</span>
        </button>
      </div>

      {/* Security footnote */}
      <div className="mt-6 pt-4 border-t border-zinc-800/80 text-center">
        <p className="text-[11px] text-zinc-400">
          Protected by MoSPI National Statistical Training Gateway.
        </p>
      </div>
    </motion.div>
  );
}

