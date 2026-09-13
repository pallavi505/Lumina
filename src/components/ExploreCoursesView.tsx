import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  Sparkles, 
  Clock, 
  Layers, 
  Star, 
  Users, 
  CheckCircle2, 
  PlayCircle, 
  ChevronRight, 
  BookOpen, 
  Compass, 
  X, 
  ArrowRight,
  Video,
  Flame,
  Award
} from 'lucide-react';
import type { AICourse, CourseEnrollment, DemoAccount } from '../types';

interface ExploreCoursesViewProps {
  currentUser: DemoAccount | null;
  courses: AICourse[];
  enrollments: CourseEnrollment[];
  onEnroll: (course: AICourse) => void;
  onContinueCourse: (course: AICourse) => void;
  onViewCourseLayout: (course: AICourse) => void;
  onOpenCreateAIModal: (initialTopic?: string) => void;
}

const CATEGORIES = [
  'All',
  'Official Statistics',
  'AI & Data Science',
  'Full Stack Web',
  'Cloud & DevOps',
  'Data Science',
];

const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function ExploreCoursesView({
  currentUser,
  courses,
  enrollments,
  onEnroll,
  onContinueCourse,
  onViewCourseLayout,
  onOpenCreateAIModal,
}: ExploreCoursesViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'duration' | 'newest'>('popular');
  const [onlyWithVideo, setOnlyWithVideo] = useState(false);
  const [previewCourse, setPreviewCourse] = useState<AICourse | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');

  // Check enrollment map for fast lookup
  const enrolledCourseIds = new Set(enrollments.map(e => e.courseId));
  const enrollmentMap = new Map(enrollments.map(e => [e.courseId, e]));

  // Filtering & Sorting
  const filteredCourses = courses.filter(course => {
    if (selectedCategory !== 'All' && course.category !== selectedCategory) {
      return false;
    }
    if (selectedLevel !== 'All' && course.level !== selectedLevel) {
      return false;
    }
    if (onlyWithVideo && !course.includeVideo) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = course.title.toLowerCase().includes(q);
      const matchDesc = course.description.toLowerCase().includes(q);
      const matchAuthor = course.authorName.toLowerCase().includes(q);
      const matchTags = course.tags?.some(t => t.toLowerCase().includes(q));
      return matchTitle || matchDesc || matchAuthor || matchTags;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'popular') return b.enrolledCount - a.enrolledCount;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'duration') {
      const durA = parseFloat(a.duration) || 0;
      const durB = parseFloat(b.duration) || 0;
      return durA - durB;
    }
    return 0;
  });

  const featuredCourse = courses[0];

  const handleCreateAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    onOpenCreateAIModal(aiPrompt.trim());
    setAiPrompt('');
  };

  return (
    <div className="min-h-screen bg-[#07080b] text-white pt-20 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Hero Discovery Header */}
        <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-gradient-to-r from-[#0b0e14] via-[#0f1422] to-[#0b0e14] p-8 sm:p-12 shadow-2xl">
          {/* Ambient light */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#40e3bd]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#40e3bd]/10 border border-[#40e3bd]/30 text-[#40e3bd] text-xs font-bold font-mono">
              <Compass className="w-3.5 h-3.5" />
              <span>EXPLORE LUMINA KNOWLEDGE REPOSITORY</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-['Space_Grotesk'] text-white leading-tight">
              Master Official Statistics, Modern Engineering & AI
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              Explore government-standard statistical methodologies, automated administrative pipelines, full-stack Next.js cloud stacks, and multimodal AI architectures.
            </p>

            {/* AI On-Demand Course Generation Search Input */}
            <form onSubmit={handleCreateAI} className="pt-3 flex flex-col sm:flex-row items-center gap-3 max-w-2xl">
              <div className="relative w-full flex-1">
                <Sparkles className="w-4 h-4 text-[#40e3bd] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Need a custom curriculum? Type any topic (e.g., 'Rust for Microdata Pipelines')..."
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-zinc-900/90 border border-[#40e3bd]/40 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#40e3bd] shadow-[0_0_20px_rgba(64,227,189,0.15)] transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#40e3bd] to-[#20b892] hover:from-[#5ef8d5] text-[#052219] text-xs font-bold font-['Space_Grotesk'] flex items-center justify-center gap-2 shadow-lg cursor-pointer shrink-0 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate with AI</span>
              </button>
            </form>
          </div>
        </div>

        {/* Featured Course Highlight */}
        {featuredCourse && (
          <div className="rounded-3xl border border-zinc-800 bg-[#0d0f15] overflow-hidden p-6 sm:p-8 relative shadow-xl">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-start gap-6 max-w-3xl">
                <img
                  src={featuredCourse.bannerImage}
                  alt={featuredCourse.title}
                  referrerPolicy="no-referrer"
                  className="w-full sm:w-56 h-36 rounded-2xl object-cover border border-zinc-800 shrink-0"
                />

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-bold flex items-center gap-1">
                      <Flame className="w-3 h-3 fill-current" />
                      FEATURED CURRICULUM
                    </span>
                    <span className="text-xs text-zinc-400 font-medium">
                      {featuredCourse.category}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-white">
                    {featuredCourse.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2">
                    {featuredCourse.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#40e3bd]" />
                      <span>{featuredCourse.duration}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-[#40e3bd]" />
                      <span>{featuredCourse.chapters.length} Chapters</span>
                    </span>
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{featuredCourse.rating} ({featuredCourse.enrolledCount} scholars)</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full lg:w-auto">
                <button
                  onClick={() => setPreviewCourse(featuredCourse)}
                  className="flex-1 lg:flex-initial px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-bold font-['Space_Grotesk'] text-white cursor-pointer transition-colors"
                >
                  Quick Syllabus
                </button>
                {enrolledCourseIds.has(featuredCourse.id) ? (
                  <button
                    onClick={() => onContinueCourse(featuredCourse)}
                    className="flex-1 lg:flex-initial px-6 py-3 rounded-xl bg-[#40e3bd] hover:bg-[#5ef8d5] text-[#052219] text-xs font-bold font-['Space_Grotesk'] flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
                  >
                    <PlayCircle className="w-4 h-4 fill-current" />
                    <span>Continue Track</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onEnroll(featuredCourse)}
                    className="flex-1 lg:flex-initial px-6 py-3 rounded-xl bg-[#40e3bd] hover:bg-[#5ef8d5] text-[#052219] text-xs font-bold font-['Space_Grotesk'] flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
                  >
                    <span>Enroll Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Filter Toolbar */}
        <div className="space-y-4">
          {/* Top Filter Bar: Search + Category Pills */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full lg:w-96">
              <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across topics, tags, instructors..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#40e3bd] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort & Quick Filters */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <span>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#40e3bd] cursor-pointer"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Recently Published</option>
                  <option value="duration">Fastest (Under 4 hrs)</option>
                </select>
              </div>

              <button
                onClick={() => setOnlyWithVideo(!onlyWithVideo)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  onlyWithVideo
                    ? 'bg-[#40e3bd]/20 border border-[#40e3bd] text-[#40e3bd]'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Video Lectures Only</span>
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-['Space_Grotesk'] whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#40e3bd] text-[#052219] shadow-sm'
                    : 'bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Level Filter Tags */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-500 font-semibold text-[11px] uppercase">Level:</span>
            {LEVELS.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedLevel === lvl
                    ? 'bg-zinc-800 text-white border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800/60 pb-3">
          <span>Showing {filteredCourses.length} of {courses.length} available courses</span>
          {(selectedCategory !== 'All' || selectedLevel !== 'All' || searchQuery || onlyWithVideo) && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedLevel('All');
                setSearchQuery('');
                setOnlyWithVideo(false);
              }}
              className="text-[#40e3bd] hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Course Cards Grid */}
        {filteredCourses.length === 0 ? (
          <div className="p-16 rounded-3xl border border-dashed border-zinc-800 text-center space-y-4 bg-[#0d0f15]">
            <BookOpen className="w-12 h-12 text-zinc-600 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold font-['Space_Grotesk'] text-white">
                No courses match your active criteria
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Try adjusting your search terms or generate a custom AI curriculum on this exact topic.
              </p>
            </div>
            <button
              onClick={() => onOpenCreateAIModal(searchQuery || 'Advanced Modern Statistics')}
              className="px-5 py-2.5 rounded-xl bg-[#40e3bd] text-[#052219] text-xs font-bold font-['Space_Grotesk'] cursor-pointer"
            >
              Generate Course on "{searchQuery || 'This Topic'}" with AI
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const isEnrolled = enrolledCourseIds.has(course.id);
              const enrollment = enrollmentMap.get(course.id);

              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-3xl border border-zinc-800 hover:border-zinc-700 bg-[#0d0f15] overflow-hidden flex flex-col justify-between group transition-all shadow-lg hover:shadow-2xl"
                >
                  {/* Top Card Image & Overlays */}
                  <div>
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={course.bannerImage}
                        alt={course.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f15] via-transparent to-black/40" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-xl bg-[#090b0e]/90 backdrop-blur-md border border-zinc-800 text-[#40e3bd] text-[11px] font-bold">
                          {course.category}
                        </span>

                        <span className="px-2.5 py-1 rounded-xl bg-[#090b0e]/90 backdrop-blur-md border border-zinc-800 text-zinc-300 text-[11px] font-medium">
                          {course.level}
                        </span>
                      </div>

                      {/* Video indicator */}
                      {course.includeVideo && (
                        <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-black/80 backdrop-blur-md text-white text-[10px] flex items-center gap-1 font-mono">
                          <Video className="w-3 h-3 text-[#40e3bd]" />
                          <span>Video Series</span>
                        </div>
                      )}
                    </div>

                    {/* Content Body */}
                    <div className="p-6 space-y-3">
                      <h3 className="text-base font-bold font-['Space_Grotesk'] text-white group-hover:text-[#40e3bd] transition-colors line-clamp-2">
                        {course.title}
                      </h3>

                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>

                      {/* Learning outcomes preview */}
                      {course.learningOutcomes && course.learningOutcomes.length > 0 && (
                        <div className="space-y-1 pt-1">
                          <div className="text-[11px] text-zinc-500 font-semibold uppercase">You will master:</div>
                          <ul className="text-xs text-zinc-300 space-y-1">
                            {course.learningOutcomes.slice(0, 2).map((outcome, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <CheckCircle2 className="w-3 h-3 text-[#40e3bd] shrink-0 mt-0.5" />
                                <span className="line-clamp-1">{outcome}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom Meta & Actions */}
                  <div className="p-6 pt-0 space-y-4">
                    {/* Metrics Bar */}
                    <div className="flex items-center justify-between text-xs text-zinc-400 border-t border-zinc-800/60 pt-3">
                      <div className="flex items-center gap-1 text-amber-400 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{course.rating}</span>
                        <span className="text-zinc-500 font-normal">({course.enrolledCount})</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{course.duration}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5" />
                          <span>{course.chapters.length} Ch</span>
                        </span>
                      </div>
                    </div>

                    {/* Instructor details */}
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <div className="flex items-center gap-2">
                        <img
                          src={course.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                          alt={course.authorName}
                          referrerPolicy="no-referrer"
                          className="w-6 h-6 rounded-full object-cover border border-zinc-700"
                        />
                        <span className="text-[11px] truncate max-w-[130px]">{course.authorName}</span>
                      </div>

                      <button
                        onClick={() => setPreviewCourse(course)}
                        className="text-[11px] text-zinc-400 hover:text-white underline cursor-pointer"
                      >
                        Inspect Syllabus
                      </button>
                    </div>

                    {/* Action Button */}
                    <div>
                      {isEnrolled ? (
                        <button
                          onClick={() => onContinueCourse(course)}
                          className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-bold font-['Space_Grotesk'] text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                          <PlayCircle className="w-3.5 h-3.5 text-[#40e3bd]" />
                          <span>Continue Course ({enrollment?.progress || 0}%)</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onEnroll(course)}
                          className="w-full py-2.5 rounded-xl bg-[#40e3bd] hover:bg-[#5ef8d5] text-[#052219] text-xs font-bold font-['Space_Grotesk'] flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Enroll & Start Free</span>
                        </button>
                      )}
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>
        )}

      </div>

      {/* Quick Syllabus Preview Modal */}
      <AnimatePresence>
        {previewCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewCourse(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 w-full max-w-2xl bg-[#0e1117] border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-white max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-6 border-b border-zinc-800 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-md bg-[#40e3bd]/15 text-[#40e3bd] text-[10px] font-bold">
                      {previewCourse.category}
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">
                      {previewCourse.duration} • {previewCourse.chapters.length} Chapters
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold font-['Space_Grotesk'] text-white">
                    {previewCourse.title}
                  </h3>
                </div>

                <button
                  onClick={() => setPreviewCourse(null)}
                  className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto space-y-6">
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {previewCourse.description}
                </p>

                {/* Chapters List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Curriculum Outline & Chapters
                  </h4>

                  <div className="space-y-2">
                    {previewCourse.chapters.map((ch, idx) => (
                      <div
                        key={ch.id}
                        className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800/80 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-lg bg-zinc-800 text-[#40e3bd] font-bold text-xs flex items-center justify-center shrink-0">
                            {idx + 1}
                          </div>
                          <div>
                            <div className="font-semibold text-white">{ch.title}</div>
                            <div className="text-[11px] text-zinc-400 line-clamp-1">{ch.summary}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-zinc-500 font-mono text-[11px] shrink-0">
                          {ch.youtubeVideoId && <Video className="w-3 h-3 text-[#40e3bd]" />}
                          <span>{ch.durationMinutes}m</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Outcomes */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Key Competencies Acquired
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {previewCourse.learningOutcomes.map((out, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#40e3bd] shrink-0 mt-0.5" />
                        <span>{out}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-zinc-800 flex items-center justify-end gap-3 bg-[#090b0e]">
                <button
                  onClick={() => setPreviewCourse(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-xs font-medium text-zinc-300 hover:text-white cursor-pointer"
                >
                  Close
                </button>
                {enrolledCourseIds.has(previewCourse.id) ? (
                  <button
                    onClick={() => {
                      const c = previewCourse;
                      setPreviewCourse(null);
                      onContinueCourse(c);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[#40e3bd] text-[#052219] text-xs font-bold font-['Space_Grotesk'] flex items-center gap-2 shadow-lg cursor-pointer"
                  >
                    <PlayCircle className="w-4 h-4 fill-current" />
                    <span>Continue Course</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const c = previewCourse;
                      setPreviewCourse(null);
                      onEnroll(c);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[#40e3bd] text-[#052219] text-xs font-bold font-['Space_Grotesk'] flex items-center gap-2 shadow-lg cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Enroll In Course</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
