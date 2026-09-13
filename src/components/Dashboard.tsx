import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  BookOpen, 
  GraduationCap, 
  Clock, 
  Award, 
  PlayCircle, 
  Plus, 
  Search, 
  Filter, 
  Star, 
  Users, 
  CheckCircle2, 
  Flame, 
  TrendingUp, 
  ArrowRight,
  Video,
  ShieldCheck,
  Zap,
  Layers,
  ChevronRight,
  Target,
  Compass,
  User,
  LayoutDashboard,
  HelpCircle,
  BarChart3,
  ExternalLink,
  Bell
} from 'lucide-react';
import type { AICourse, CourseEnrollment, DemoAccount, CertificateData } from '../types';
import { useLiveNotifications } from '../context/NotificationContext';
import CertificateModal from './CertificateModal';
import TraineeMetricsGrid from './TraineeMetricsGrid';
import TraineeLiveFeedWidget from './TraineeLiveFeedWidget';
import CompetencyRadarSection from './CompetencyRadarSection';
import IgotPathwaysCarousel from './IgotPathwaysCarousel';
import InteractiveQuizPlayerModal from './InteractiveQuizPlayerModal';
import CertificatesBadgesGallery from './CertificatesBadgesGallery';

interface DashboardProps {
  currentUser: DemoAccount | null;
  courses: AICourse[];
  enrollments: CourseEnrollment[];
  onOpenCreateModal: () => void;
  onSelectCourseLayout: (course: AICourse) => void;
  onContinueCourse: (course: AICourse) => void;
  onNavigateToProfile?: () => void;
  onNavigateToProgress?: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToTrainerDashboard?: () => void;
  onNavigateToAdminDashboard?: () => void;
  onUpdateEnrollment?: (updated: CourseEnrollment) => void;
}

export default function Dashboard({
  currentUser,
  courses,
  enrollments,
  onOpenCreateModal,
  onSelectCourseLayout,
  onContinueCourse,
  onNavigateToProfile,
  onNavigateToProgress,
  onNavigateToExplore,
  onNavigateToTrainerDashboard,
  onNavigateToAdminDashboard,
  onUpdateEnrollment
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'enrolled' | 'all' | 'quizzes' | 'ai-studio'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedCert, setSelectedCert] = useState<CertificateData | null>(null);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const { openDrawer, unreadCount, urgentDeadlinesCount } = useLiveNotifications();

  // Compute stats
  const totalCourses = courses.length;
  const enrolledCount = enrollments.length;
  const completedCourses = enrollments.filter(e => e.completed || e.progress === 100).length;
  const inProgressCourses = enrolledCount - completedCourses;
  const totalHoursLearned = useMemo(() => {
    return enrollments.reduce((acc, curr) => {
      const match = courses.find(c => c.id === curr.courseId);
      const courseHours = match ? (match.chapters?.length || 4) * 1.5 : 5;
      return acc + (courseHours * (curr.progress / 100));
    }, 18.5); // base historical accredited hours
  }, [enrollments, courses]);

  // Skill index calculation
  const compositeSkillIndex = useMemo(() => {
    const base = 80;
    const bonus = Math.min(18, completedCourses * 6 + (enrollments.length * 2));
    return Math.min(99, base + bonus);
  }, [completedCourses, enrollments]);

  // Pending quizzes calculation
  const pendingQuizzesCount = useMemo(() => {
    const uncompleted = enrollments.filter(e => !e.completed && e.progress >= 25);
    return Math.max(2, uncompleted.length + 1);
  }, [enrollments]);

  // Merge enrolled courses with course details
  const enrolledCoursesWithMeta = useMemo(() => {
    return enrollments.map(enr => {
      const course = courses.find(c => c.id === enr.courseId);
      return {
        enrollment: enr,
        course: course || ({
          id: enr.courseId,
          title: 'Official Statistics Track',
          category: 'Official Statistics',
          level: 'Advanced' as const,
          description: 'In-progress curriculum module',
          duration: '6 Hours',
          bannerImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
          tags: ['Statistics'],
          learningOutcomes: ['SNA principles', 'Data modeling'],
          chapters: [],
          authorName: 'MoSPI Academy Faculty',
          rating: 4.9,
          enrolledCount: 120,
          createdAt: new Date().toISOString()
        } as AICourse)
      };
    });
  }, [enrollments, courses]);

  // Filter all courses
  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      const matchesSearch = searchQuery === '' || 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
      const matchesLvl = selectedLevel === 'All' || c.level === selectedLevel;

      return matchesSearch && matchesCat && matchesLvl;
    });
  }, [courses, searchQuery, selectedCategory, selectedLevel]);

  const categories = ['All', 'Official Statistics', 'AI & Machine Learning', 'Data Science', 'Civil Services', 'Policy Analytics'];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Trainee Banner with Profile Greeting & Instant Actions */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-gradient-to-r from-[#0a151b] via-[#091017] to-[#120a1c] p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#40e3bd]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#40e3bd]/15 border border-[#40e3bd]/30 text-[#40e3bd] text-xs font-mono font-bold tracking-wider uppercase">
                {currentUser?.badge || 'Indian Statistical Service (ISS)'}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs font-medium">
                {currentUser?.title || 'Senior Research Fellow'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-['Space_Grotesk'] text-white tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#40e3bd] to-[#60a5fa]">{currentUser?.name || 'Trainee Scholar'}</span>
            </h1>

            <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
              Unified competency dashboard aligned with iGOT Karmayogi national civil capacity frameworks. Monitor your learning trajectory, close skill benchmark gaps, and verify professional credentials.
            </p>
          </div>

          {/* Quick Primary Actions */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={openDrawer}
              className="px-3.5 py-2.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 hover:border-[#40e3bd]/50 text-zinc-200 hover:text-[#40e3bd] text-xs font-bold font-['Space_Grotesk'] flex items-center gap-2 transition-all cursor-pointer shadow-sm relative"
              title="Open Live Notifications"
            >
              <div className="relative">
                <Bell className="w-4 h-4 text-[#40e3bd]" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#40e3bd] shadow-[0_0_6px_#40e3bd] animate-pulse" />
                )}
              </div>
              <span>Live Feed</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-[#40e3bd] text-[#052219] text-[10px] font-mono font-bold leading-none">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsQuizModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Launch Assessment Quiz</span>
            </button>

            {onNavigateToTrainerDashboard && (
              <button
                id="btn-dashboard-trainer-center"
                onClick={onNavigateToTrainerDashboard}
                className="px-4 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 font-bold text-xs font-['Space_Grotesk'] flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                title="Open Lumina Trainer Dashboard"
              >
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Trainer Command Center</span>
              </button>
            )}

            {onNavigateToAdminDashboard && (
              <button
                id="btn-dashboard-admin-center"
                onClick={onNavigateToAdminDashboard}
                className="px-4 py-2.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/40 text-purple-300 font-bold text-xs font-['Space_Grotesk'] flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                title="Open LUMINA Admin Dashboard"
              >
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>Admin Command</span>
              </button>
            )}

            <button
              onClick={onOpenCreateModal}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#40e3bd] to-[#20b892] hover:from-[#5ef8d5] text-[#052219] font-bold text-xs font-['Space_Grotesk'] flex items-center gap-2 shadow-[0_0_20px_rgba(64,227,189,0.3)] transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>Generate AI Course</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Switcher & Navigation Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        
        {/* Navigation Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-900/90 rounded-2xl border border-zinc-800 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-['Space_Grotesk'] transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-[#40e3bd] text-[#052219] shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>
              {currentUser?.role === 'trainer'
                ? 'Trainer Dashboard'
                : currentUser?.role === 'admin'
                ? 'Admin Governance'
                : 'Trainee Dashboard'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('enrolled')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-['Space_Grotesk'] transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'enrolled'
                ? 'bg-[#40e3bd] text-[#052219] shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>My Learning ({enrolledCoursesWithMeta.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('quizzes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-['Space_Grotesk'] transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'quizzes'
                ? 'bg-[#40e3bd] text-[#052219] shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Certificates & Badges</span>
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-['Space_Grotesk'] transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-[#40e3bd] text-[#052219] shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Explore Catalog ({courses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-studio')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-['Space_Grotesk'] transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'ai-studio'
                ? 'bg-[#40e3bd] text-[#052219] shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Course Studio</span>
          </button>
        </div>

        {/* Global Search box */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tracks, skills..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#40e3bd] transition-colors"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: TRAINEE DASHBOARD (The Full Core Suite)                             */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* 1. Overview Metrics Grid */}
          <TraineeMetricsGrid
            totalHours={totalHoursLearned}
            skillIndex={compositeSkillIndex}
            enrollments={enrollments}
            pendingQuizzesCount={pendingQuizzesCount}
            onLaunchPendingQuiz={() => setIsQuizModalOpen(true)}
            onViewMyCourses={() => setActiveTab('enrolled')}
          />

          {/* 2. Real-Time Live Notification Feed & Urgent Deadlines Widget */}
          <TraineeLiveFeedWidget
            courses={courses}
            onContinueCourse={onContinueCourse}
            onLaunchQuiz={() => setIsQuizModalOpen(true)}
          />

          {/* 3. Interactive Competency Radar Chart & Gap Analysis (Powered by Recharts) */}
          <CompetencyRadarSection
            onSelectPathway={() => {
              // Scroll to pathways or show catalog
              const elem = document.getElementById('igot-pathways-container');
              if (elem) elem.scrollIntoView({ behavior: 'smooth' });
            }}
            onLaunchQuiz={() => setIsQuizModalOpen(true)}
          />

          {/* 3. Personalized AI-Recommended iGOT Pathways Carousel */}
          <div id="igot-pathways-container">
            <IgotPathwaysCarousel
              onSelectPathway={() => {
                if (courses.length > 0) onSelectCourseLayout(courses[0]);
              }}
              onEnrollPathway={(pathway) => {
                const match = courses.find(c => c.title.toLowerCase().includes(pathway.title.slice(0, 10).toLowerCase())) || courses[0];
                if (match) onContinueCourse(match);
              }}
            />
          </div>

          {/* 4. Certificates & Skill Badges Gallery */}
          <CertificatesBadgesGallery
            currentUser={currentUser}
            courses={courses}
            onViewCertificate={(cert) => setSelectedCert(cert)}
            onLaunchQuiz={() => setIsQuizModalOpen(true)}
          />

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MY ENROLLED LEARNING TRACKS                                        */}
      {/* ========================================================================= */}
      {activeTab === 'enrolled' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                Active Enrolled Curriculums
              </h2>
              <p className="text-xs text-zinc-400">
                Continue learning your active pathways, review video lectures, and take chapter quizzes
              </p>
            </div>

            <button
              onClick={() => setActiveTab('all')}
              className="text-xs font-mono text-[#40e3bd] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Browse more courses</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {enrolledCoursesWithMeta.length === 0 ? (
            <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#40e3bd]/15 text-[#40e3bd] flex items-center justify-center mx-auto">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">No active enrollments yet</h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  Explore our MoSPI-accredited course catalog or generate a tailored curriculum with AI Studio.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('all')}
                className="px-5 py-2.5 rounded-xl bg-[#40e3bd] text-[#052219] font-bold text-xs cursor-pointer"
              >
                Explore Course Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCoursesWithMeta.map(({ course, enrollment }) => {
                const progressPct = enrollment.progress || 0;
                const isCompleted = enrollment.completed || progressPct === 100;

                return (
                  <div
                    key={course.id}
                    className="relative rounded-2xl border border-zinc-800/90 bg-zinc-900/70 p-5 flex flex-col justify-between space-y-4 hover:border-[#40e3bd]/50 transition-all shadow-lg group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#40e3bd]/15 text-[#40e3bd]">
                          {course.category}
                        </span>
                        <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full ${
                          isCompleted ? 'bg-emerald-500/20 text-emerald-300' : 'bg-purple-500/20 text-purple-300'
                        }`}>
                          {isCompleted ? 'Mastered' : `${progressPct}% Done`}
                        </span>
                      </div>

                      <h3 className="text-base font-bold font-['Space_Grotesk'] text-white group-hover:text-[#40e3bd] transition-colors line-clamp-2">
                        {course.title}
                      </h3>

                      <p className="text-xs text-zinc-400 line-clamp-2">
                        {course.summary || course.description}
                      </p>

                      {/* Progress Bar */}
                      <div className="space-y-1 pt-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-zinc-500">Progress</span>
                          <span className="font-mono text-zinc-300 font-bold">{progressPct}%</span>
                        </div>
                        <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              isCompleted ? 'bg-emerald-400' : 'bg-gradient-to-r from-purple-500 to-[#40e3bd]'
                            }`}
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onSelectCourseLayout(course)}
                        className="text-xs text-zinc-400 hover:text-white font-medium cursor-pointer"
                      >
                        Syllabus Details
                      </button>

                      <button
                        onClick={() => onContinueCourse(course)}
                        className="px-4 py-2 rounded-xl bg-[#40e3bd] text-[#052219] font-bold text-xs flex items-center gap-1.5 shadow-md hover:bg-[#5ef8d5] transition-colors cursor-pointer"
                      >
                        <PlayCircle className="w-3.5 h-3.5 fill-current" />
                        <span>{isCompleted ? 'Review Course' : 'Continue Player'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CERTIFICATES & ASSESSMENTS GALLERY                                 */}
      {/* ========================================================================= */}
      {activeTab === 'quizzes' && (
        <div className="space-y-6">
          <CertificatesBadgesGallery
            currentUser={currentUser}
            courses={courses}
            onViewCertificate={(cert) => setSelectedCert(cert)}
            onLaunchQuiz={() => setIsQuizModalOpen(true)}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: EXPLORE CATALOG                                                    */}
      {/* ========================================================================= */}
      {activeTab === 'all' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-zinc-400 mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3 text-[#40e3bd]" />
                Filter:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#40e3bd]/20 border border-[#40e3bd] text-[#40e3bd]'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 focus:outline-none cursor-pointer"
              >
                <option value="All">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const isEnrolled = enrollments.some(e => e.courseId === course.id);
              return (
                <div
                  key={course.id}
                  className="rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-5 flex flex-col justify-between space-y-4 hover:border-[#40e3bd]/50 transition-all shadow-md group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#40e3bd]/15 text-[#40e3bd] font-bold">
                        {course.category}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {course.level}
                      </span>
                    </div>

                    <h3 className="text-base font-bold font-['Space_Grotesk'] text-white group-hover:text-[#40e3bd] transition-colors line-clamp-2">
                      {course.title}
                    </h3>

                    <p className="text-xs text-zinc-400 line-clamp-2">
                      {course.summary || course.description}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-zinc-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-zinc-500" />
                        {course.modules?.length || 4} modules
                      </span>
                      <span className="flex items-center gap-1 text-amber-400">
                        <Star className="w-3 h-3 fill-current" />
                        {course.rating || 4.9}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onSelectCourseLayout(course)}
                      className="text-xs text-zinc-400 hover:text-white font-medium cursor-pointer"
                    >
                      Syllabus Details
                    </button>

                    <button
                      onClick={() => onContinueCourse(course)}
                      className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-[#40e3bd] hover:text-[#052219] text-zinc-200 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <span>{isEnrolled ? 'Open Player' : 'Enroll & Start'}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: AI COURSE STUDIO                                                   */}
      {/* ========================================================================= */}
      {activeTab === 'ai-studio' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-zinc-800/90 bg-gradient-to-r from-purple-950/40 via-zinc-900 to-cyan-950/40 p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
              <Sparkles className="w-7 h-7" />
            </div>

            <div className="space-y-2 max-w-xl mx-auto">
              <h3 className="text-2xl font-extrabold font-['Space_Grotesk'] text-white">
                MoSPI AI Curriculum Generator
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Generate comprehensive 4-part instructional blueprints with official YouTube video grounding, structured Markdown study modules, and interactive mastery assessments in seconds.
              </p>
            </div>

            <button
              onClick={onOpenCreateModal}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#40e3bd] to-[#20b892] text-[#052219] font-extrabold font-['Space_Grotesk'] text-sm shadow-[0_0_25px_rgba(64,227,189,0.35)] hover:from-[#5ef8d5] transition-all cursor-pointer"
            >
              Launch AI Curriculum Builder
            </button>
          </div>
        </div>
      )}

      {/* Verifiable Certificate Modal */}
      <CertificateModal
        isOpen={!!selectedCert}
        certificate={selectedCert}
        onClose={() => setSelectedCert(null)}
      />

      {/* Interactive Assessment & Credential Player Modal */}
      <InteractiveQuizPlayerModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        currentUser={currentUser}
        courses={courses}
        onUpdateEnrollment={onUpdateEnrollment}
        onViewCertificate={(cert) => {
          setIsQuizModalOpen(false);
          setSelectedCert(cert);
        }}
      />

    </div>
  );
}
