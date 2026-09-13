import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Sparkles, 
  PlayCircle, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  Star, 
  Users, 
  Video, 
  ChevronDown, 
  ChevronUp,
  Share2,
  BookmarkCheck,
  Award,
  Layers
} from 'lucide-react';
import type { AICourse, CourseEnrollment, DemoAccount } from '../types';

interface CourseLayoutViewProps {
  course: AICourse;
  enrollment?: CourseEnrollment | null;
  currentUser: DemoAccount | null;
  onBack: () => void;
  onEnrollAndPlay: (course: AICourse) => void;
  onDirectPlay: (course: AICourse) => void;
}

export default function CourseLayoutView({
  course,
  enrollment,
  currentUser,
  onBack,
  onEnrollAndPlay,
  onDirectPlay
}: CourseLayoutViewProps) {
  const [expandedChapter, setExpandedChapter] = useState<number | null>(1);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const isEnrolled = !!enrollment;
  const progress = enrollment?.progress || 0;
  const completedLessons = enrollment?.completedLessons || [];

  const handleEnrollClick = async () => {
    setIsEnrolling(true);
    await onEnrollAndPlay(course);
    setIsEnrolling(false);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080b] text-white pt-20 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Top Back Nav & Quick Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-zinc-700">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span>Back to Courses</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Hero Course Header Card */}
        <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-[#0d0f15] shadow-2xl">
          {/* Banner Image with Overlays */}
          <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-zinc-950">
            <img
              src={course.bannerImage}
              alt={course.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center filter brightness-85"
            />
            {/* Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f15] via-[#0d0f15]/60 to-transparent" />
            <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#07080b]/30 to-[#07080b]/90" />

            {/* AI Generated Badge */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#40e3bd]/40 text-[#40e3bd] text-[11px] font-bold font-['Space_Grotesk'] flex items-center gap-1.5 shadow-lg">
                <Sparkles className="w-3.5 h-3.5" />
                AI Generated Curriculum
              </span>
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-zinc-700 text-zinc-300 text-[11px] font-medium">
                {course.category}
              </span>
            </div>

            {/* Level & Duration Badges */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-zinc-700 text-zinc-300 text-[11px] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#40e3bd]" />
                {course.duration}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#40e3bd]/20 backdrop-blur-md border border-[#40e3bd]/40 text-[#40e3bd] text-[11px] font-semibold">
                {course.level}
              </span>
            </div>
          </div>

          {/* Card Content & Action Bar */}
          <div className="p-6 sm:p-8 space-y-6 relative -mt-8">
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-['Space_Grotesk'] text-white tracking-tight leading-tight">
                {course.title}
              </h1>
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-4xl">
                {course.description}
              </p>
            </div>

            {/* Meta bar: Author, Enrolled count, Rating */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 pb-4 border-b border-zinc-800 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <img
                  src={course.authorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                  alt={course.authorName}
                  className="w-6 h-6 rounded-full object-cover border border-[#40e3bd]/40"
                />
                <span className="text-zinc-300 font-medium">{course.authorName}</span>
              </div>

              <div className="flex items-center gap-1.5 text-zinc-300">
                <Users className="w-3.5 h-3.5 text-[#40e3bd]" />
                <span>{course.enrolledCount.toLocaleString()} Enrolled Scholars</span>
              </div>

              <div className="flex items-center gap-1 text-amber-400 font-medium">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{course.rating.toFixed(1)} / 5.0 Rating</span>
              </div>

              <div className="flex items-center gap-1.5 text-zinc-300">
                <BookOpen className="w-3.5 h-3.5 text-[#40e3bd]" />
                <span>{course.chapters.length} Interactive Chapters</span>
              </div>

              {course.includeVideo && (
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <Video className="w-3.5 h-3.5" />
                  <span>YouTube Lectures Included</span>
                </div>
              )}
            </div>

            {/* Enrollment Status & CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              {isEnrolled ? (
                <div className="w-full sm:w-auto flex-1 max-w-md space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-zinc-300 flex items-center gap-1.5">
                      <BookmarkCheck className="w-4 h-4 text-[#40e3bd]" />
                      <span>Your Learning Progress</span>
                    </span>
                    <span className="text-[#40e3bd] font-mono">{progress}% Complete</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#40e3bd] to-[#20b892] h-full rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    {completedLessons.length} of {course.chapters.length} chapters completed
                  </div>
                </div>
              ) : (
                <div className="text-xs text-zinc-400">
                  Free instant enrollment • Includes AI quiz assessment & certificate
                </div>
              )}

              <div className="w-full sm:w-auto flex items-center gap-3">
                {isEnrolled ? (
                  <button
                    onClick={() => onDirectPlay(course)}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-[#40e3bd] via-[#35d8b2] to-[#20b892] hover:from-[#5ef8d5] hover:to-[#35d8b2] text-[#052219] font-bold font-['Space_Grotesk'] text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(64,227,189,0.35)] transition-all cursor-pointer"
                  >
                    <PlayCircle className="w-5 h-5 fill-current" />
                    <span>{progress === 100 ? 'Review Masterclass' : 'Continue Learning'}</span>
                  </button>
                ) : (
                  <button
                    onClick={handleEnrollClick}
                    disabled={isEnrolling}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-[#40e3bd] via-[#35d8b2] to-[#20b892] hover:from-[#5ef8d5] hover:to-[#35d8b2] text-[#052219] font-bold font-['Space_Grotesk'] text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(64,227,189,0.35)] transition-all cursor-pointer disabled:opacity-50"
                  >
                    <BookOpen className="w-5 h-5" />
                    <span>{isEnrolling ? 'Enrolling...' : 'Enroll in Course'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Learning Outcomes Checklist */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0d0f15] border border-zinc-800/80 space-y-4">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-[#40e3bd]" />
            <h2 className="text-lg font-bold font-['Space_Grotesk'] text-white">
              What You Will Master
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {course.learningOutcomes.map((outcome, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/60 flex items-start gap-3"
              >
                <CheckCircle2 className="w-4 h-4 text-[#40e3bd] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-zinc-300 leading-snug">{outcome}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Course Syllabus & Chapters Layout */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                Course Curriculum & Chapters
              </h2>
              <p className="text-xs text-zinc-400">
                {course.chapters.length} modules • Total {course.duration} structured self-paced content
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {course.chapters.map((chapter) => {
              const isExpanded = expandedChapter === chapter.chapterNumber;
              const isChapterDone = completedLessons.includes(chapter.id);

              return (
                <div
                  key={chapter.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isChapterDone
                      ? 'bg-zinc-950/90 border-[#40e3bd]/30'
                      : isExpanded
                      ? 'bg-zinc-900/80 border-zinc-700 shadow-lg'
                      : 'bg-zinc-950/70 border-zinc-800/80 hover:border-zinc-700'
                  }`}
                >
                  {/* Chapter Header Accordion Click */}
                  <button
                    onClick={() => setExpandedChapter(isExpanded ? null : chapter.chapterNumber)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold font-['Space_Grotesk'] shrink-0 border ${
                          isChapterDone
                            ? 'bg-[#40e3bd]/20 border-[#40e3bd] text-[#40e3bd]'
                            : 'bg-zinc-900 border-zinc-700 text-zinc-300'
                        }`}
                      >
                        {isChapterDone ? (
                          <CheckCircle2 className="w-4 h-4 text-[#40e3bd]" />
                        ) : (
                          <span>0{chapter.chapterNumber}</span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm sm:text-base font-bold text-white truncate">
                            {chapter.title}
                          </h3>
                          {isChapterDone && (
                            <span className="px-2 py-0.5 rounded-full bg-[#40e3bd]/10 border border-[#40e3bd]/30 text-[#40e3bd] text-[10px] font-semibold">
                              Completed
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-400 truncate mt-0.5">
                          {chapter.summary}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-400">
                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{chapter.durationMinutes} min</span>
                      </div>

                      {chapter.youtubeVideoId && (
                        <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[10px] font-medium">
                          <Video className="w-3 h-3" />
                          Video
                        </span>
                      )}

                      <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </button>

                  {/* Expanded Chapter Details */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-5 pb-5 pt-1 border-t border-zinc-800/80 space-y-3.5"
                    >
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        {chapter.summary}
                      </p>

                      {/* Video lecture card preview */}
                      {chapter.videoTitle && (
                        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                              <Video className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-zinc-300 truncate font-medium">{chapter.videoTitle}</span>
                          </div>
                          <span className="text-[11px] text-zinc-400 font-mono shrink-0">YouTube Lecture</span>
                        </div>
                      )}

                      {/* Lessons Breakdown */}
                      {chapter.lessons && chapter.lessons.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                            Key Lesson Topics:
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {chapter.lessons.map((lesson, lIdx) => (
                              <div
                                key={lIdx}
                                className="flex items-center gap-2 text-xs text-zinc-300 bg-zinc-900/40 p-2 rounded-lg border border-zinc-800/50"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-[#40e3bd]" />
                                <span className="truncate">{lesson}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Quick Chapter Action */}
                      <div className="pt-2 flex items-center justify-end">
                        <button
                          onClick={() => {
                            if (isEnrolled) {
                              onDirectPlay(course);
                            } else {
                              handleEnrollClick();
                            }
                          }}
                          className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[#40e3bd] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <PlayCircle className="w-4 h-4" />
                          <span>{isEnrolled ? 'Open This Chapter in Player' : 'Enroll to Start Chapter'}</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
