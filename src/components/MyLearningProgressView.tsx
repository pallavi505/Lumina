import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Target, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Award, 
  PlayCircle, 
  ChevronRight, 
  BarChart3, 
  Sparkles, 
  Search, 
  ArrowUpRight,
  GraduationCap,
  Calendar,
  Layers,
  Lock,
  Compass
} from 'lucide-react';
import type { AICourse, CourseEnrollment, CertificateData, DemoAccount } from '../types';
import CertificateModal from './CertificateModal';

interface MyLearningProgressViewProps {
  currentUser: DemoAccount | null;
  courses: AICourse[];
  enrollments: CourseEnrollment[];
  onContinueCourse: (course: AICourse, chapterIndex?: number) => void;
  onViewCourseLayout: (course: AICourse) => void;
  onNavigateToExplore: () => void;
  onNavigateToProfile: () => void;
  onOpenCreateAIModal?: (topic?: string) => void;
}

type ProgressFilter = 'all' | 'in_progress' | 'completed';

export default function MyLearningProgressView({
  currentUser,
  courses,
  enrollments,
  onContinueCourse,
  onViewCourseLayout,
  onNavigateToExplore,
  onNavigateToProfile,
}: MyLearningProgressViewProps) {
  const [activeFilter, setActiveFilter] = useState<ProgressFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCert, setSelectedCert] = useState<CertificateData | null>(null);

  // Map courses with their enrollment details
  const enrolledCoursesWithDetails = enrollments.map(enr => {
    const course = courses.find(c => c.id === enr.courseId);
    return {
      enrollment: enr,
      course,
    };
  }).filter((item): item is { enrollment: CourseEnrollment; course: AICourse } => !!item.course);

  // Aggregates
  const totalEnrolled = enrolledCoursesWithDetails.length;
  const completedTracks = enrolledCoursesWithDetails.filter(item => item.enrollment.completed || item.enrollment.progress >= 100);
  const inProgressTracks = enrolledCoursesWithDetails.filter(item => !item.enrollment.completed && item.enrollment.progress < 100);

  // Overall progress calculation
  const averageProgress = totalEnrolled > 0
    ? Math.round(enrolledCoursesWithDetails.reduce((acc, curr) => acc + curr.enrollment.progress, 0) / totalEnrolled)
    : 0;

  // Total chapters completed across all courses
  let totalChaptersCount = 0;
  let totalChaptersCompleted = 0;
  enrolledCoursesWithDetails.forEach(item => {
    totalChaptersCount += item.course.chapters.length;
    totalChaptersCompleted += item.enrollment.completedLessons?.length || 0;
  });

  // Filtered courses
  const filteredCourses = enrolledCoursesWithDetails.filter(item => {
    const isCompleted = item.enrollment.completed || item.enrollment.progress >= 100;
    if (activeFilter === 'in_progress' && isCompleted) return false;
    if (activeFilter === 'completed' && !isCompleted) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.course.title.toLowerCase().includes(q);
      const matchCategory = item.course.category.toLowerCase().includes(q);
      return matchTitle || matchCategory;
    }
    return true;
  });

  // Pick the most recently active course for "Continue Where You Left Off"
  const mostRecentCourse = inProgressTracks.length > 0 ? inProgressTracks[0] : enrolledCoursesWithDetails[0];

  const handleOpenCert = (course: AICourse, enr: CourseEnrollment) => {
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
      issuer: 'Lumina Learning Academy • MoSPI Training Framework',
    });
  };

  // Weekly study data for the activity chart
  const weeklyActivity = [
    { day: 'Mon', hours: 1.5, target: 1.2 },
    { day: 'Tue', hours: 2.0, target: 1.2 },
    { day: 'Wed', hours: 0.8, target: 1.2 },
    { day: 'Thu', hours: 2.4, target: 1.2 },
    { day: 'Fri', hours: 1.6, target: 1.2 },
    { day: 'Sat', hours: 3.0, target: 1.5 },
    { day: 'Sun', hours: 1.2, target: 1.5 },
  ];

  return (
    <div className="min-h-screen bg-[#07080b] text-white pt-20 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#40e3bd]/10 border border-[#40e3bd]/30 text-[#40e3bd] text-[11px] font-bold font-mono">
                SCHOLAR TELEMETRY
              </span>
              <span className="text-xs text-zinc-500">•</span>
              <span className="text-xs text-zinc-400">Continuous Curriculum Tracking</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white">
              My Learning Progress
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              Track chapter completions, quiz assessments, weekly study velocity, and earned certificates.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToExplore}
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-bold font-['Space_Grotesk'] text-white flex items-center gap-2 transition-all cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-[#40e3bd]" />
              <span>Explore More Courses</span>
            </button>
            <button
              onClick={onNavigateToProfile}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#40e3bd] to-[#20b892] hover:from-[#5ef8d5] text-[#052219] text-xs font-bold font-['Space_Grotesk'] flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" />
              <span>My Profile & Badges</span>
            </button>
          </div>
        </div>

        {/* Macro Progress Stats & Visual Tracker */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Overall Completion Metric Card */}
          <div className="rounded-3xl border border-zinc-800 bg-[#0d0f15] p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Overall Progress</span>
                <span className="text-xs font-mono text-[#40e3bd] font-bold">{averageProgress}% COMPLETE</span>
              </div>
              
              {/* Radial or Big Bar Indicator */}
              <div className="pt-2">
                <div className="text-4xl sm:text-5xl font-black font-['Space_Grotesk'] text-white">
                  {averageProgress}%
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Average mastery across {totalEnrolled} registered curriculum tracks
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-zinc-800/80 rounded-full h-3 overflow-hidden mt-3">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${averageProgress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-[#40e3bd] to-[#20b892]"
                />
              </div>
            </div>

            {/* Micro counters */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-800/80 text-xs">
              <div>
                <div className="text-zinc-500 text-[11px]">CHAPTERS MASTERED</div>
                <div className="text-base font-bold font-['Space_Grotesk'] text-white">
                  {totalChaptersCompleted} / {totalChaptersCount}
                </div>
              </div>
              <div>
                <div className="text-zinc-500 text-[11px]">CREDENTIALS ISSUED</div>
                <div className="text-base font-bold font-['Space_Grotesk'] text-[#40e3bd]">
                  {completedTracks.length} Certified
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Learning Activity Chart */}
          <div className="lg:col-span-2 rounded-3xl border border-zinc-800 bg-[#0d0f15] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#40e3bd]" />
                  <span>Weekly Study Velocity & Activity</span>
                </h3>
                <p className="text-xs text-zinc-400">12.5 hrs logged this week • Daily goal: 1.5 hrs</p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1 text-zinc-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#40e3bd]" />
                  <span>Logged</span>
                </span>
                <span className="flex items-center gap-1 text-zinc-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  <span>Target</span>
                </span>
              </div>
            </div>

            {/* Interactive Bar Visualization */}
            <div className="h-40 flex items-end justify-between gap-2 sm:gap-4 pt-4 px-2">
              {weeklyActivity.map((item, idx) => {
                const maxVal = 3.5;
                const barHeight = Math.min(100, Math.round((item.hours / maxVal) * 100));
                const targetHeight = Math.min(100, Math.round((item.target / maxVal) * 100));
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="text-[10px] text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                      {item.hours}h
                    </div>
                    <div className="w-full max-w-[36px] bg-zinc-800/60 rounded-t-lg relative flex items-end h-28 overflow-hidden">
                      {/* Target marker line */}
                      <div 
                        className="absolute w-full border-t border-dashed border-zinc-600 z-10 pointer-events-none"
                        style={{ bottom: `${targetHeight}%` }}
                      />
                      {/* Actual studied bar */}
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${barHeight}%` }}
                        transition={{ duration: 0.6, delay: idx * 0.08 }}
                        className={`w-full rounded-t-lg transition-all ${
                          item.hours >= item.target
                            ? 'bg-gradient-to-t from-[#20b892] to-[#40e3bd]'
                            : 'bg-zinc-700'
                        }`}
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-zinc-400 group-hover:text-white transition-colors">
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Quick Resume Banner (if in progress courses exist) */}
        {mostRecentCourse && (
          <div className="rounded-3xl border border-[#40e3bd]/30 bg-gradient-to-r from-[#0e161c] via-[#0d1217] to-[#0e161c] p-6 sm:p-7 relative overflow-hidden shadow-xl">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2 text-xs font-bold text-[#40e3bd]">
                  <PlayCircle className="w-4 h-4 fill-current" />
                  <span>RESUME ACTIVE CURRICULUM</span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold font-['Space_Grotesk'] text-white">
                  {mostRecentCourse.course.title}
                </h3>
                <p className="text-xs text-zinc-300">
                  You are currently on Chapter {(mostRecentCourse.enrollment.completedLessons?.length || 0) + 1} of {mostRecentCourse.course.chapters.length}. Keep the momentum going!
                </p>
                <div className="flex items-center gap-4 text-xs text-zinc-400 pt-1">
                  <span>{mostRecentCourse.enrollment.progress}% Completed</span>
                  <span>•</span>
                  <span>{mostRecentCourse.course.duration} Total Track</span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={() => onViewCourseLayout(mostRecentCourse.course)}
                  className="flex-1 md:flex-initial px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-bold font-['Space_Grotesk'] text-white cursor-pointer transition-colors"
                >
                  View Full Syllabus
                </button>
                <button
                  onClick={() => onContinueCourse(mostRecentCourse.course)}
                  className="flex-1 md:flex-initial px-6 py-3 rounded-xl bg-[#40e3bd] hover:bg-[#5ef8d5] text-[#052219] text-xs font-bold font-['Space_Grotesk'] flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <PlayCircle className="w-4 h-4 fill-current" />
                  <span>Continue Lesson Now</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          {/* Filter Pills */}
          <div className="flex items-center gap-2 bg-zinc-900/80 p-1.5 rounded-2xl border border-zinc-800">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-['Space_Grotesk'] transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-[#40e3bd] text-[#052219] shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              All Enrolled ({totalEnrolled})
            </button>
            <button
              onClick={() => setActiveFilter('in_progress')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-['Space_Grotesk'] transition-all cursor-pointer ${
                activeFilter === 'in_progress'
                  ? 'bg-[#40e3bd] text-[#052219] shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              In Progress ({inProgressTracks.length})
            </button>
            <button
              onClick={() => setActiveFilter('completed')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-['Space_Grotesk'] transition-all cursor-pointer ${
                activeFilter === 'completed'
                  ? 'bg-[#40e3bd] text-[#052219] shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Completed ({completedTracks.length})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter my enrolled courses..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#40e3bd] transition-colors"
            />
          </div>
        </div>

        {/* Detailed Course Progress Cards List */}
        {filteredCourses.length === 0 ? (
          <div className="p-12 rounded-3xl border border-dashed border-zinc-800 text-center space-y-4 bg-[#0d0f15]">
            <BookOpen className="w-12 h-12 text-zinc-600 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold font-['Space_Grotesk'] text-white">
                No courses match this filter
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                {activeFilter === 'completed'
                  ? 'Complete all chapters of an enrolled course to unlock your verified credential and appear here.'
                  : 'Ready to expand your statistical and software competencies? Browse the course catalog.'}
              </p>
            </div>
            <button
              onClick={onNavigateToExplore}
              className="px-5 py-2.5 rounded-xl bg-[#40e3bd] hover:bg-[#5ef8d5] text-[#052219] text-xs font-bold font-['Space_Grotesk'] cursor-pointer transition-all"
            >
              Explore Course Catalog
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredCourses.map(({ course, enrollment }) => {
              const isFinished = enrollment.completed || enrollment.progress >= 100;
              const completedChapterIds = enrollment.completedLessons || [];

              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-3xl border border-zinc-800 hover:border-zinc-700 bg-[#0d0f15] p-6 sm:p-7 space-y-6 transition-all shadow-lg"
                >
                  {/* Card Top: Banner, Info, Actions */}
                  <div className="flex flex-col md:flex-row items-start justify-between gap-5">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <img
                        src={course.bannerImage}
                        alt={course.title}
                        referrerPolicy="no-referrer"
                        className="w-full sm:w-40 h-28 rounded-2xl object-cover border border-zinc-800 shrink-0"
                      />

                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-lg bg-zinc-800 text-[#40e3bd] text-[11px] font-bold">
                            {course.category}
                          </span>
                          <span className="px-2 py-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 text-[11px]">
                            {course.level}
                          </span>
                          {isFinished ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              100% Completed
                            </span>
                          ) : (
                            <span className="text-[11px] font-mono text-zinc-400">
                              {enrollment.progress}% Progress
                            </span>
                          )}
                        </div>

                        <h3 className="text-base sm:text-lg font-bold font-['Space_Grotesk'] text-white">
                          {course.title}
                        </h3>

                        <p className="text-xs text-zinc-400 line-clamp-2">
                          {course.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 pt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{course.duration}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Layers className="w-3.5 h-3.5" />
                            <span>{course.chapters.length} Chapters</span>
                          </span>
                          <span>
                            Instructor: {course.authorName}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-row md:flex-col items-center gap-2 w-full md:w-auto shrink-0 pt-2 md:pt-0">
                      {isFinished ? (
                        <button
                          onClick={() => handleOpenCert(course, enrollment)}
                          className="w-full px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#40e3bd] to-[#20b892] hover:from-[#5ef8d5] text-[#052219] text-xs font-bold font-['Space_Grotesk'] flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>View Certificate</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onContinueCourse(course)}
                          className="w-full px-5 py-2.5 rounded-xl bg-[#40e3bd] hover:bg-[#5ef8d5] text-[#052219] text-xs font-bold font-['Space_Grotesk'] flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                        >
                          <PlayCircle className="w-3.5 h-3.5 fill-current" />
                          <span>Continue Learning</span>
                        </button>
                      )}

                      <button
                        onClick={() => onViewCourseLayout(course)}
                        className="w-full px-4 py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                      >
                        Syllabus Outline
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400">Curriculum Completion</span>
                      <span className="font-bold text-white">
                        {completedChapterIds.length} of {course.chapters.length} Chapters Completed ({enrollment.progress}%)
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#40e3bd] to-[#20b892] transition-all duration-500"
                        style={{ width: `${enrollment.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Chapter by Chapter Checklist */}
                  <div className="space-y-2 pt-2 border-t border-zinc-800/60">
                    <div className="text-xs font-semibold text-zinc-400 mb-2">
                      Chapter-by-Chapter Milestones:
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {course.chapters.map((ch, idx) => {
                        const isDone = completedChapterIds.includes(ch.id);
                        return (
                          <div
                            key={ch.id}
                            onClick={() => onContinueCourse(course, idx)}
                            className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition-all cursor-pointer ${
                              isDone
                                ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200 hover:bg-emerald-950/30'
                                : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-300 hover:border-[#40e3bd]/50 hover:bg-zinc-800/50'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 overflow-hidden">
                              {isDone ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border border-zinc-600 flex items-center justify-center text-[10px] text-zinc-400 shrink-0">
                                  {idx + 1}
                                </div>
                              )}
                              <span className="truncate font-medium">
                                Ch {idx + 1}: {ch.title}
                              </span>
                            </div>

                            <span className="text-[10px] text-zinc-500 shrink-0 font-mono">
                              {ch.durationMinutes}m
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>
        )}

      </div>

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={!!selectedCert}
        onClose={() => setSelectedCert(null)}
        certificate={selectedCert}
      />
    </div>
  );
}
