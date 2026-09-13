import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  PlayCircle, 
  Clock, 
  Sparkles, 
  BookOpen, 
  ChevronRight, 
  ChevronLeft, 
  Award, 
  Copy, 
  Check, 
  Video, 
  HelpCircle,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  ListOrdered,
  PartyPopper,
  FileText
} from 'lucide-react';
import type { AICourse, CourseEnrollment, DemoAccount, ChapterContent, CertificateData } from '../types';
import { callGenerateChapterContent, markChapterCompleted } from '../lib/courseService';
import CourseNotesPanel from './CourseNotesPanel';
import VideoCompletionQuizModal from './VideoCompletionQuizModal';
import CertificateModal from './CertificateModal';

interface CoursePlayerViewProps {
  course: AICourse;
  enrollment: CourseEnrollment | null;
  currentUser: DemoAccount | null;
  onBackToDashboard: () => void;
  onUpdateEnrollment: (updated: CourseEnrollment) => void;
}

export default function CoursePlayerView({
  course,
  enrollment,
  currentUser,
  onBackToDashboard,
  onUpdateEnrollment
}: CoursePlayerViewProps) {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [chapterContent, setChapterContent] = useState<ChapterContent | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Video completion quiz & certificate states
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateData | null>(null);

  // Video time tracking & seeking from Notes
  const [videoSeekSeconds, setVideoSeekSeconds] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [seekToast, setSeekToast] = useState<string | null>(null);

  const currentChapter = course.chapters[activeChapterIndex] || course.chapters[0];
  const completedLessons = enrollment?.completedLessons || [];
  const isCurrentChapterDone = completedLessons.includes(currentChapter.id);
  const progressPercent = enrollment?.progress || 0;
  const isCourseFullyCompleted = enrollment?.completed || progressPercent === 100;

  // Listen to YouTube player postMessages to detect video completion (onStateChange === 0)
  useEffect(() => {
    const handleYouTubeMessage = (event: MessageEvent) => {
      try {
        if (!event.data) return;
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        // YouTube API info === 0 indicates video has finished playing
        if (data?.event === 'onStateChange' && (data?.info === 0 || data?.info === '0')) {
          setShowQuizModal(true);
        }
      } catch {
        // ignore non-json messages
      }
    };

    window.addEventListener('message', handleYouTubeMessage);
    return () => window.removeEventListener('message', handleYouTubeMessage);
  }, []);

  // Track video elapsed session timer & reset upon chapter change
  useEffect(() => {
    setElapsedSeconds(0);
    setVideoSeekSeconds(null);
    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeChapterIndex, currentChapter.id]);

  const handleSeekVideo = (seconds: number, chapterIndex?: number) => {
    if (chapterIndex !== undefined && chapterIndex !== activeChapterIndex) {
      setActiveChapterIndex(chapterIndex);
    }
    setVideoSeekSeconds(seconds);
    setElapsedSeconds(seconds);
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    setSeekToast(`Jumped video to ${timeFormatted}`);
    setTimeout(() => {
      setSeekToast(null);
    }, 3000);
  };

  // Load or generate chapter content when active chapter changes
  useEffect(() => {
    let isMounted = true;
    setSelectedQuizOption(null);
    setQuizSubmitted(false);

    if (currentChapter.content) {
      setChapterContent(currentChapter.content);
      return;
    }

    async function fetchContent() {
      setIsLoadingContent(true);
      try {
        const content = await callGenerateChapterContent({
          courseTitle: course.title,
          chapterTitle: currentChapter.title,
          chapterSummary: currentChapter.summary,
          topic: course.category,
          level: course.level
        });
        if (isMounted) {
          setChapterContent(content);
          currentChapter.content = content; // cache in memory
        }
      } catch (err) {
        console.warn('Could not generate dynamic content:', err);
      } finally {
        if (isMounted) setIsLoadingContent(false);
      }
    }

    fetchContent();

    return () => {
      isMounted = false;
    };
  }, [currentChapter.id, course.title]);

  const handleMarkAsCompleted = async () => {
    if (!currentUser) return;
    try {
      const updated = await markChapterCompleted(
        currentUser.id,
        course.id,
        currentChapter.id,
        course.chapters.length
      );
      onUpdateEnrollment(updated);

      // If this was the last chapter or course is 100%, show congratulations
      if (updated.completed || updated.progress === 100) {
        setShowCompletionModal(true);
      } else if (activeChapterIndex < course.chapters.length - 1) {
        // Move to next chapter automatically
        setActiveChapterIndex(prev => prev + 1);
      }
    } catch (err) {
      console.warn('Error marking chapter completed:', err);
    }
  };

  const handleCopyCode = () => {
    if (chapterContent?.codeSnippet && navigator.clipboard) {
      navigator.clipboard.writeText(chapterContent.codeSnippet);
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080b] text-white flex flex-col pt-16">
      
      {/* Top Classroom Bar */}
      <header className="h-16 border-b border-zinc-800 bg-[#0d0f15]/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-30 sticky top-16">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold text-zinc-300 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          <div className="h-4 w-[1px] bg-zinc-800 hidden sm:block" />

          <div className="min-w-0">
            <h1 className="text-xs sm:text-sm font-bold font-['Space_Grotesk'] text-white truncate max-w-md">
              {course.title}
            </h1>
            <p className="text-[11px] text-zinc-400 truncate">
              Chapter {activeChapterIndex + 1} of {course.chapters.length}: {currentChapter.title}
            </p>
          </div>
        </div>

        {/* Progress Tracker & Completion Action */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden md:flex items-center gap-2 text-xs">
            <span className="text-zinc-400">Progress:</span>
            <div className="w-28 bg-zinc-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#40e3bd] to-[#20b892] h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[#40e3bd] font-mono font-bold">{progressPercent}%</span>
          </div>

          <button
            onClick={handleMarkAsCompleted}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold font-['Space_Grotesk'] flex items-center gap-1.5 transition-all cursor-pointer ${
              isCurrentChapterDone
                ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30'
                : 'bg-gradient-to-r from-[#40e3bd] to-[#20b892] text-[#052219] hover:from-[#5ef8d5] shadow-[0_0_15px_rgba(64,227,189,0.25)]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCurrentChapterDone ? 'Completed' : 'Mark as Completed'}</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Chapters Navigation Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-80' : 'w-14'
          } shrink-0 border-r border-zinc-800/80 bg-[#0a0c10] transition-all duration-300 flex flex-col hidden lg:flex`}
        >
          <div className="p-3.5 border-b border-zinc-800 flex items-center justify-between">
            {sidebarOpen && (
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <ListOrdered className="w-3.5 h-3.5 text-[#40e3bd]" />
                Course Syllabus
              </span>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors ml-auto cursor-pointer"
            >
              {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {course.chapters.map((ch, idx) => {
              const isActive = idx === activeChapterIndex;
              const isDone = completedLessons.includes(ch.id);

              return (
                <button
                  key={ch.id}
                  onClick={() => setActiveChapterIndex(idx)}
                  className={`w-full p-2.5 rounded-xl text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#40e3bd]/15 border border-[#40e3bd]/40 text-white shadow-sm'
                      : isDone
                      ? 'bg-zinc-900/40 border border-zinc-800/60 text-zinc-300 hover:bg-zinc-900'
                      : 'border border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold font-['Space_Grotesk'] mt-0.5 ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : isActive
                        ? 'bg-[#40e3bd] text-[#052219]'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {isDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                  </div>

                  {sidebarOpen && (
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold truncate leading-tight">
                        {ch.title}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {ch.durationMinutes}m
                        </span>
                        {ch.youtubeVideoId && (
                          <span className="text-rose-400 flex items-center gap-0.5">
                            <Video className="w-2.5 h-2.5" />
                            Video
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom badge */}
          {sidebarOpen && (
            <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/40 text-[11px] text-zinc-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#40e3bd] shrink-0" />
              <span className="truncate">Lumina Certified Curriculum</span>
            </div>
          )}
        </aside>

        {/* Main Stage & Learning Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8 max-w-5xl mx-auto w-full">
          
          {/* Chapter Title Banner */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#40e3bd]/10 border border-[#40e3bd]/30 text-[#40e3bd] text-[11px] font-bold font-mono">
                CHAPTER {activeChapterIndex + 1} OF {course.chapters.length}
              </span>
              <span className="text-xs text-zinc-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-zinc-500" />
                {currentChapter.durationMinutes} minutes
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold font-['Space_Grotesk'] text-white">
              {currentChapter.title}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {currentChapter.summary}
            </p>
          </div>

          {/* YouTube Video Player Embed */}
          {course.includeVideo && currentChapter.youtubeVideoId && (
            <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-black shadow-2xl relative">
              <div className="p-3 bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-zinc-300 truncate">
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span className="font-semibold text-white truncate">{currentChapter.videoTitle}</span>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  {/* Elapsed lecture timer */}
                  <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-950 border border-zinc-800 font-mono text-[11px] text-zinc-400">
                    <Clock className="w-3 h-3 text-[#40e3bd]" />
                    <span>
                      {Math.floor(elapsedSeconds / 60).toString().padStart(2, '0')}:
                      {(elapsedSeconds % 60).toString().padStart(2, '0')}
                    </span>
                  </div>

                  {/* Take Quiz Trigger directly from Video bar */}
                  <button
                    type="button"
                    onClick={() => setShowQuizModal(true)}
                    className="px-2.5 py-1 rounded-lg bg-[#40e3bd]/15 hover:bg-[#40e3bd] text-[#40e3bd] hover:text-[#052219] font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer"
                    title="Take Video Quiz & Earn Badge"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Video Quiz</span>
                  </button>
                  
                  <span className="text-[11px] text-zinc-400 font-mono shrink-0 hidden md:inline">YouTube HD</span>
                </div>
              </div>

              {/* Seek Toast Alert */}
              <AnimatePresence>
                {seekToast && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-14 left-1/2 -translate-x-1/2 z-20 px-3.5 py-1.5 rounded-xl bg-zinc-950/90 border border-[#40e3bd]/60 text-[#40e3bd] text-xs font-mono font-bold shadow-lg backdrop-blur-md flex items-center gap-2"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{seekToast}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Responsive 16:9 Video Player */}
              <div className="relative w-full pb-[56.25%] bg-zinc-950">
                <iframe
                  key={`${currentChapter.id}_${videoSeekSeconds || 0}`}
                  src={
                    videoSeekSeconds !== null
                      ? `https://www.youtube-nocookie.com/embed/${currentChapter.youtubeVideoId}?enablejsapi=1&start=${videoSeekSeconds}&autoplay=1&rel=0&modestbranding=1`
                      : `https://www.youtube-nocookie.com/embed/${currentChapter.youtubeVideoId}?enablejsapi=1&rel=0&modestbranding=1`
                  }
                  title={currentChapter.videoTitle || currentChapter.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>
            </div>
          )}

          {/* Video Completion & Credential Assessment Action Card */}
          {course.includeVideo && currentChapter.youtubeVideoId && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-zinc-900 via-[#0d1017] to-zinc-900 border border-[#40e3bd]/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#40e3bd]/15 border border-[#40e3bd]/40 flex items-center justify-center text-[#40e3bd] shrink-0 shadow-[0_0_15px_rgba(64,227,189,0.2)]">
                  <Award className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-bold font-['Space_Grotesk'] text-white">
                      Video Completion Assessment & Certification
                    </h4>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] font-bold">
                      Badge + Certificate
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-zinc-300 leading-relaxed">
                    Finished watching the video lecture? Test your comprehension to validate course mastery and claim your institutional credential.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowQuizModal(true)}
                  className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#40e3bd] to-[#20b892] hover:from-[#5ef8d5] text-[#052219] font-bold font-['Space_Grotesk'] text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(64,227,189,0.3)] hover:scale-[1.02] transition-all cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Take Completion Quiz</span>
                </button>
              </div>
            </div>
          )}

          {/* AI-Generated Rich Lesson Content */}
          <div className="rounded-2xl border border-zinc-800/90 bg-[#0d0f15] p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2 text-xs font-bold text-[#40e3bd]">
                <Sparkles className="w-4 h-4" />
                <span>AI Lesson Content & Technical Guide</span>
              </div>
              <span className="text-[11px] text-zinc-400 font-mono">Gemini 3.8 Flash</span>
            </div>

            {isLoadingContent ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <div className="w-8 h-8 rounded-full border-2 border-zinc-800 border-t-[#40e3bd] animate-spin" />
                <p className="text-xs text-zinc-400 font-mono">
                  Synthesizing in-depth instructional content & interactive quiz...
                </p>
              </div>
            ) : chapterContent ? (
              <div className="space-y-6">
                
                {/* Markdown text representation */}
                <div className="text-sm text-zinc-200 leading-relaxed whitespace-pre-line space-y-4 font-normal">
                  {chapterContent.markdown}
                </div>

                {/* Runnable / Practical Code Snippet */}
                {chapterContent.codeSnippet && (
                  <div className="rounded-xl overflow-hidden border border-zinc-800 bg-[#06070a]">
                    <div className="p-3 bg-zinc-900/70 border-b border-zinc-800 flex items-center justify-between text-xs">
                      <span className="text-zinc-400 font-mono text-[11px]">
                        {chapterContent.codeLanguage || 'Example Code / Formula'}
                      </span>
                      <button
                        onClick={handleCopyCode}
                        className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      >
                        {copiedSnippet ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Code</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-4 text-xs font-mono text-[#40e3bd] overflow-x-auto leading-relaxed">
                      <code>{chapterContent.codeSnippet}</code>
                    </pre>
                  </div>
                )}

                {/* Key Takeaways Callout */}
                {chapterContent.keyTakeaways && chapterContent.keyTakeaways.length > 0 && (
                  <div className="p-5 rounded-xl bg-[#40e3bd]/5 border border-[#40e3bd]/20 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#40e3bd] flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      Key Milestones & Takeaways
                    </h4>
                    <ul className="space-y-2 text-xs sm:text-sm text-zinc-300">
                      {chapterContent.keyTakeaways.map((takeaway, tIdx) => (
                        <li key={tIdx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-[#40e3bd] shrink-0 mt-0.5" />
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Interactive Knowledge Check Quiz */}
                {chapterContent.quiz && (
                  <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-[#40e3bd]" />
                      <h4 className="text-sm font-bold font-['Space_Grotesk'] text-white">
                        Knowledge Check: Test Your Comprehension
                      </h4>
                    </div>

                    <p className="text-xs sm:text-sm text-zinc-200 font-medium">
                      {chapterContent.quiz.question}
                    </p>

                    <div className="space-y-2">
                      {chapterContent.quiz.options.map((opt, oIdx) => {
                        const isSelected = selectedQuizOption === oIdx;
                        const isCorrect = oIdx === chapterContent.quiz?.correctAnswer;

                        let styleClasses = "bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-300";
                        if (quizSubmitted) {
                          if (isCorrect) {
                            styleClasses = "bg-emerald-500/15 border-emerald-500 text-emerald-300";
                          } else if (isSelected && !isCorrect) {
                            styleClasses = "bg-rose-500/15 border-rose-500 text-rose-300";
                          }
                        } else if (isSelected) {
                          styleClasses = "bg-[#40e3bd]/15 border-[#40e3bd] text-[#40e3bd]";
                        }

                        return (
                          <button
                            key={oIdx}
                            type="button"
                            onClick={() => {
                              if (!quizSubmitted) setSelectedQuizOption(oIdx);
                            }}
                            className={`w-full p-3 text-left rounded-xl border text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${styleClasses}`}
                          >
                            <span>{opt}</span>
                            {quizSubmitted && isCorrect && (
                              <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {!quizSubmitted ? (
                      <button
                        type="button"
                        disabled={selectedQuizOption === null}
                        onClick={() => setQuizSubmitted(true)}
                        className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[#40e3bd] text-xs font-bold disabled:opacity-40 transition-colors cursor-pointer"
                      >
                        Submit Answer
                      </button>
                    ) : (
                      <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-300 space-y-1">
                        <div className="font-bold text-white">
                          {selectedQuizOption === chapterContent.quiz.correctAnswer
                            ? "✨ Correct! Outstanding work."
                            : "💡 Review the key concept:"}
                        </div>
                        <p>{chapterContent.quiz.explanation}</p>
                      </div>
                    )}
                  </div>
                )}

              </div>
            ) : (
              <p className="text-xs text-zinc-400">
                Lesson content loaded. Review the lecture video above and execute hands-on exercises.
              </p>
            )}
          </div>

          {/* Bottom Chapter Navigation Bar */}
          <div className="flex items-center justify-between pt-4 pb-12">
            <button
              onClick={() => setActiveChapterIndex(prev => Math.max(0, prev - 1))}
              disabled={activeChapterIndex === 0}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1.5 disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Chapter</span>
            </button>

            <button
              onClick={handleMarkAsCompleted}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#40e3bd] to-[#20b892] hover:from-[#5ef8d5] text-[#052219] font-bold font-['Space_Grotesk'] text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(64,227,189,0.3)] transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isCurrentChapterDone ? 'Completed (Next Chapter)' : 'Mark Chapter Completed'}</span>
            </button>

            <button
              onClick={() => setActiveChapterIndex(prev => Math.min(course.chapters.length - 1, prev + 1))}
              disabled={activeChapterIndex === course.chapters.length - 1}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1.5 disabled:opacity-30 cursor-pointer"
            >
              <span>Next Chapter</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </main>
      </div>

      {/* Course Completion Celebration Modal */}
      <AnimatePresence>
        {showCompletionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCompletionModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#0e1017] border border-[#40e3bd]/50 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-[0_0_50px_rgba(64,227,189,0.2)] z-10"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#40e3bd]/15 border border-[#40e3bd]/40 mx-auto flex items-center justify-center text-[#40e3bd]">
                <Award className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-[#40e3bd]/10 text-[#40e3bd] text-xs font-bold font-mono uppercase">
                  Curriculum Mastered
                </span>
                <h3 className="text-2xl font-extrabold font-['Space_Grotesk'] text-white">
                  Congratulations, {currentUser?.name || 'Scholar'}!
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 max-w-sm mx-auto leading-relaxed">
                  You have successfully completed all chapters of <span className="text-[#40e3bd] font-semibold">{course.title}</span>.
                </p>
              </div>

              {/* Certificate preview card */}
              <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-left space-y-2 text-xs">
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span>Certificate ID: LUMINA-{Date.now().toString().slice(-6)}</span>
                  <span className="text-[#40e3bd] font-mono">VERIFIED</span>
                </div>
                <div className="font-bold text-white text-sm">
                  {currentUser?.name || 'Institutional Scholar'}
                </div>
                <div className="text-zinc-400 text-[11px]">
                  Mastery in {course.category} • Certified on {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setShowCompletionModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white cursor-pointer"
                >
                  Review Materials
                </button>
                <button
                  onClick={() => {
                    setShowCompletionModal(false);
                    onBackToDashboard();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#40e3bd] to-[#20b892] text-[#052219] font-bold font-['Space_Grotesk'] text-xs shadow-lg cursor-pointer"
                >
                  Back to Dashboard
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Lecture Notes Panel syncing with Firestore */}
      <CourseNotesPanel
        course={course}
        currentChapter={currentChapter}
        activeChapterIndex={activeChapterIndex}
        currentUser={currentUser}
        onSeekVideo={handleSeekVideo}
        currentVideoElapsedSeconds={elapsedSeconds}
      />

      {/* Video Completion Knowledge Assessment Quiz Modal */}
      <VideoCompletionQuizModal
        isOpen={showQuizModal}
        onClose={() => setShowQuizModal(false)}
        course={course}
        currentChapter={currentChapter}
        activeChapterIndex={activeChapterIndex}
        chapterContent={chapterContent}
        currentUser={currentUser}
        onUpdateEnrollment={onUpdateEnrollment}
        onViewCertificate={(cert) => setSelectedCertificate(cert)}
        onNextChapter={() => {
          if (activeChapterIndex < course.chapters.length - 1) {
            setActiveChapterIndex(prev => prev + 1);
          }
        }}
      />

      {/* Official Verifiable Certificate Modal */}
      <CertificateModal
        isOpen={!!selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
        certificate={selectedCertificate}
      />

    </div>
  );
}
