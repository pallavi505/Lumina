import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Mail, 
  Briefcase, 
  Building2, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Award, 
  Edit3, 
  Save, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink,
  Target,
  GraduationCap,
  Calendar,
  Check
} from 'lucide-react';
import type { DemoAccount, AICourse, CourseEnrollment, CertificateData } from '../types';
import { useAuth } from '../context/AuthContext';
import CertificateModal from './CertificateModal';

interface UserProfileViewProps {
  currentUser: DemoAccount | null;
  courses: AICourse[];
  enrollments: CourseEnrollment[];
  onNavigateToProgress: () => void;
  onNavigateToExplore: () => void;
  onContinueCourse: (course: AICourse) => void;
  onBackToDashboard?: () => void;
  onOpenCreateAIModal?: (topic?: string) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
];

const AVAILABLE_INTERESTS = [
  'Official Statistics',
  'AI & Machine Learning',
  'Python Data Science',
  'Full Stack Web',
  'Cloud & DevOps',
  'Survey Sampling',
  'National Accounts',
  'Data Governance'
];

export default function UserProfileView({
  currentUser,
  courses,
  enrollments,
  onNavigateToProgress,
  onNavigateToExplore,
  onContinueCourse,
}: UserProfileViewProps) {
  const { updateUserProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [name, setName] = useState(currentUser?.name || '');
  const [title, setTitle] = useState(currentUser?.title || '');
  const [institution, setInstitution] = useState(currentUser?.institution || 'National Statistical Systems Training Academy');
  const [bio, setBio] = useState(currentUser?.bio || 'Dedicated scholar specializing in modern survey technologies, administrative data analytics, and full-stack software development.');
  const [avatar, setAvatar] = useState(currentUser?.avatar || PRESET_AVATARS[0]);
  const [targetHours, setTargetHours] = useState(currentUser?.targetHoursPerWeek || 8);
  const [interests, setInterests] = useState<string[]>(
    currentUser?.interests || ['Official Statistics', 'AI & Machine Learning', 'Python Data Science']
  );

  // Certificate Modal State
  const [selectedCert, setSelectedCert] = useState<CertificateData | null>(null);

  // Calculate stats
  const completedEnrollments = enrollments.filter(e => e.completed || e.progress >= 100);
  const totalCompletedCourses = completedEnrollments.length;
  const inProgressCourses = enrollments.length - totalCompletedCourses;
  const totalHours = (enrollments.length * 3.8).toFixed(1);
  const streakDays = currentUser?.streakDays || 5;

  // Toggle interest tag
  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUserProfile({
        name,
        title,
        institution,
        bio,
        avatar,
        targetHoursPerWeek: Number(targetHours),
        interests,
      });
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const openCertificate = (course: AICourse, enr: CourseEnrollment) => {
    setSelectedCert({
      certificateId: `LUM-${course.id.substring(0, 8).toUpperCase()}-${enr.id.substring(0, 6).toUpperCase()}`,
      studentName: currentUser?.name || 'Lumina Scholar',
      courseTitle: course.title,
      courseId: course.id,
      completedDate: new Date(enr.lastAccessed || Date.now()).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      issuer: 'Lumina Learning Academy • MoSPI Training Directorate',
    });
  };

  return (
    <div className="min-h-screen bg-[#07080b] text-white pt-20 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Profile Hero Header Card */}
        <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-gradient-to-r from-[#0d0f15] via-[#10131d] to-[#0d0f15] p-6 sm:p-8 shadow-2xl">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-10 w-80 h-80 bg-[#40e3bd]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Avatar with Glow Ring */}
              <div className="relative group">
                <img
                  src={avatar}
                  alt={name}
                  referrerPolicy="no-referrer"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-[#40e3bd]/50 shadow-[0_0_25px_rgba(64,227,189,0.2)]"
                />
                <div className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-zinc-900 border border-zinc-700 text-[#40e3bd]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>

              {/* Scholar Information */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white">
                    {name || 'Lumina Scholar'}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#40e3bd]/15 border border-[#40e3bd]/40 text-[#40e3bd] text-[11px] font-bold font-mono">
                    {currentUser?.badge || 'Verified Lumina ID'}
                  </span>
                </div>

                <p className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-[#40e3bd]" />
                  <span>{title || 'Institutional Scholar & Data Analyst'}</span>
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 pt-1">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{institution}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{currentUser?.email}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {!isEditing ? (
                <button
                  id="btn-edit-profile"
                  onClick={() => setIsEditing(true)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-bold font-['Space_Grotesk'] text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#40e3bd]" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(false)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              )}

              <button
                onClick={onNavigateToProgress}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#40e3bd] hover:bg-[#5ef8d5] text-[#052219] text-xs font-bold font-['Space_Grotesk'] flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(64,227,189,0.3)] transition-all cursor-pointer"
              >
                <Target className="w-3.5 h-3.5 fill-current" />
                <span>My Learning Progress</span>
              </button>
            </div>
          </div>

          {/* Success Banner if Saved */}
          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Profile details updated successfully in GovCloud Firestore!</span>
            </motion.div>
          )}

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-6 mt-6 border-t border-zinc-800/80">
            <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800/60 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#40e3bd]/10 text-[#40e3bd] flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <div className="text-lg font-bold font-['Space_Grotesk'] text-white">
                  {enrollments.length}
                </div>
                <div className="text-[11px] text-zinc-400">Total Enrolled</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800/60 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <div className="text-lg font-bold font-['Space_Grotesk'] text-white">
                  {totalCompletedCourses}
                </div>
                <div className="text-[11px] text-zinc-400">Certificates Earned</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800/60 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <Flame className="w-4 h-4 fill-current" />
              </div>
              <div>
                <div className="text-lg font-bold font-['Space_Grotesk'] text-white">
                  {streakDays} Days
                </div>
                <div className="text-[11px] text-zinc-400">Learning Streak</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800/60 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-lg font-bold font-['Space_Grotesk'] text-white">
                  {totalHours} hrs
                </div>
                <div className="text-[11px] text-zinc-400">Dedicated Hours</div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Edit Form Section */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 sm:p-8 rounded-3xl border border-[#40e3bd]/30 bg-[#0d0f15] space-y-6 shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h2 className="text-lg font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#40e3bd]" />
                <span>Update Scholar Profile & Learning Goals</span>
              </h2>
              <span className="text-xs text-zinc-400">Synced to secure Firestore profile</span>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Avatar Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300">Choose Scholar Avatar</label>
                <div className="flex flex-wrap items-center gap-3">
                  {PRESET_AVATARS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatar(url)}
                      className={`relative rounded-xl overflow-hidden w-12 h-12 border-2 transition-all cursor-pointer ${
                        avatar === url ? 'border-[#40e3bd] scale-105 shadow-[0_0_10px_#40e3bd]' : 'border-zinc-800 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="Preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#40e3bd] transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Designation / Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Statistical Officer, Full Stack Engineer"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#40e3bd] transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Affiliated Institution</label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="e.g. Ministry of Statistics, Lumina Academy"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#40e3bd] transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Target Weekly Study Hours</label>
                  <div className="flex items-center gap-2">
                    {[5, 8, 12, 15, 20].map((hrs) => (
                      <button
                        key={hrs}
                        type="button"
                        onClick={() => setTargetHours(hrs)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          targetHours === hrs
                            ? 'bg-[#40e3bd] text-[#052219]'
                            : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {hrs}h/wk
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Biography & Learning Objective</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#40e3bd] transition-colors resize-none"
                  placeholder="Share a brief overview of your background, specializations, or learning aspirations..."
                />
              </div>

              {/* Learning Interests Tags */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300">Curriculum Interests (Select to Personalize)</label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_INTERESTS.map((item) => {
                    const isSelected = interests.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleInterest(item)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#40e3bd]/20 border border-[#40e3bd] text-[#40e3bd]'
                            : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {item} {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#40e3bd] to-[#20b892] text-[#052219] text-xs font-bold font-['Space_Grotesk'] flex items-center gap-2 shadow-lg cursor-pointer transition-all disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving to Firestore...' : 'Save Profile'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Bio & Interests Preview (when not editing) */}
        {!isEditing && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 p-6 rounded-3xl border border-zinc-800 bg-[#0d0f15] space-y-4">
              <h3 className="text-sm font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
                <User className="w-4 h-4 text-[#40e3bd]" />
                <span>Scholar Bio & Focus</span>
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {bio}
              </p>

              <div className="pt-2">
                <div className="text-xs font-semibold text-zinc-400 mb-2">Primary Specializations & Competencies:</div>
                <div className="flex flex-wrap gap-2">
                  {interests.map((it, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[#40e3bd] text-xs font-medium"
                    >
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Weekly Target Widget */}
            <div className="p-6 rounded-3xl border border-zinc-800 bg-[#0d0f15] space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#40e3bd]" />
                    <span>Weekly Learning Target</span>
                  </h3>
                  <span className="text-xs font-bold text-[#40e3bd]">{targetHours} hrs / wk</span>
                </div>
                <p className="text-xs text-zinc-400">
                  Target pace to complete statistical and software certification tracks on schedule.
                </p>
              </div>

              <div className="space-y-2 pt-4">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>Current Week Progress</span>
                  <span className="text-white font-bold">5.5 / {targetHours} hrs (68%)</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-[#40e3bd] to-[#20b892] h-full rounded-full w-[68%]" />
                </div>
              </div>

              <button
                onClick={onNavigateToProgress}
                className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-white transition-colors cursor-pointer text-center"
              >
                Inspect Detailed Progress
              </button>
            </div>
          </div>
        )}

        {/* Mastered Certifications & Verifiable Credentials */}
        <div className="rounded-3xl border border-zinc-800 bg-[#0d0f15] p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-[#40e3bd]" />
                <span>Earned Credentials & Certificates of Mastery</span>
              </h2>
              <p className="text-xs text-zinc-400">
                Official certificates generated upon 100% curriculum completion and quiz mastery.
              </p>
            </div>

            <button
              onClick={onNavigateToExplore}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold font-['Space_Grotesk'] text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Explore More Courses</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#40e3bd]" />
            </button>
          </div>

          {completedEnrollments.length === 0 ? (
            <div className="p-8 rounded-2xl border border-dashed border-zinc-800 text-center space-y-3">
              <GraduationCap className="w-10 h-10 text-zinc-600 mx-auto" />
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                No completed courses yet. Work through your enrolled tracks to earn verified Lumina credentials!
              </p>
              <button
                onClick={onNavigateToProgress}
                className="px-4 py-2 rounded-xl bg-[#40e3bd] text-[#052219] text-xs font-bold font-['Space_Grotesk'] cursor-pointer"
              >
                Go to My Learning Progress
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedEnrollments.map((enr) => {
                const course = courses.find(c => c.id === enr.courseId);
                if (!course) return null;
                return (
                  <div
                    key={course.id}
                    className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-[#40e3bd]/50 transition-all flex flex-col justify-between space-y-3 group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Mastered
                        </span>
                        <span className="text-zinc-500 font-mono text-[10px]">
                          {new Date(enr.lastAccessed || Date.now()).toLocaleDateString()}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold font-['Space_Grotesk'] text-white group-hover:text-[#40e3bd] transition-colors line-clamp-2">
                        {course.title}
                      </h4>
                      <p className="text-xs text-zinc-400 line-clamp-1">
                        {course.category} • {course.duration}
                      </p>
                    </div>

                    <button
                      onClick={() => openCertificate(course, enr)}
                      className="w-full py-2 rounded-xl bg-gradient-to-r from-[#40e3bd]/15 to-[#20b892]/15 hover:bg-[#40e3bd]/25 border border-[#40e3bd]/40 text-[#40e3bd] text-xs font-bold font-['Space_Grotesk'] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>View Official Certificate</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Badges & Institutional Honors */}
        <div className="rounded-3xl border border-zinc-800 bg-[#0d0f15] p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#40e3bd]" />
              <span>Competency Badges & Honors</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Recognized badges achieved across curriculum tracks and technical milestones.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Custom Earned Badges from Quizzes */}
            {(currentUser.badges || []).map((b, bIdx) => (
              <div
                key={`earned-${bIdx}`}
                className="p-4 rounded-2xl border border-[#40e3bd]/50 bg-gradient-to-b from-[#40e3bd]/10 via-zinc-900/80 to-zinc-900/60 shadow-[0_0_20px_rgba(64,227,189,0.1)] flex flex-col justify-between space-y-2 transition-all hover:scale-[1.02]"
              >
                <div className="text-2xl">{b.icon || '🎓'}</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-[9px] text-[#40e3bd] font-mono font-bold uppercase">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>Verified Mastery</span>
                  </div>
                  <h4 className="text-xs font-bold text-white">{b.title}</h4>
                  <p className="text-[11px] text-zinc-400 line-clamp-2">{b.description}</p>
                </div>
                <div className="text-[10px] font-mono text-emerald-400 font-bold">
                  EARNED {new Date(b.earnedDate).toLocaleDateString()}
                </div>
              </div>
            ))}

            {[
              {
                title: "Statistical Pioneer",
                desc: "Completed foundation survey sampling schedule modules",
                unlocked: true,
                icon: "📊"
              },
              {
                title: "5-Day Learning Streak",
                desc: "Maintained continuous daily learning momentum",
                unlocked: true,
                icon: "🔥"
              },
              {
                title: "Full-Stack AI Builder",
                desc: "Constructed generative AI applications with Gemini 3.8",
                unlocked: true,
                icon: "⚡"
              },
              {
                title: "Macroeconomic Modeler",
                desc: "Calculated input-output multiplier matrices and SUT tables",
                unlocked: totalCompletedCourses >= 2,
                icon: "🏛️"
              }
            ].map((badge, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-2 ${
                  badge.unlocked
                    ? 'bg-zinc-900/60 border-zinc-800 hover:border-[#40e3bd]/40'
                    : 'bg-zinc-950/40 border-zinc-900 opacity-50'
                }`}
              >
                <div className="text-2xl">{badge.icon}</div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white">{badge.title}</h4>
                  <p className="text-[11px] text-zinc-400">{badge.desc}</p>
                </div>
                <div className="text-[10px] font-mono text-[#40e3bd]">
                  {badge.unlocked ? 'UNLOCKED' : 'IN PROGRESS'}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Reusable Certificate Modal */}
      <CertificateModal
        isOpen={!!selectedCert}
        onClose={() => setSelectedCert(null)}
        certificate={selectedCert}
      />
    </div>
  );
}
