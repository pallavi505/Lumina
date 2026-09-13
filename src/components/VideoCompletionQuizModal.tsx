import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Check, 
  ShieldCheck, 
  Printer, 
  BookOpen,
  CloudCheck,
  X,
  GraduationCap
} from 'lucide-react';
import type { AICourse, Chapter, DemoAccount, ChapterContent, CertificateData, EarnedBadge, CourseEnrollment } from '../types';
import { awardCompletionCertificateAndBadge } from '../lib/courseService';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface VideoCompletionQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: AICourse;
  currentChapter: Chapter;
  activeChapterIndex: number;
  chapterContent: ChapterContent | null;
  currentUser: DemoAccount | null;
  onUpdateEnrollment: (updated: CourseEnrollment) => void;
  onViewCertificate: (cert: CertificateData) => void;
  onNextChapter?: () => void;
}

export default function VideoCompletionQuizModal({
  isOpen,
  onClose,
  course,
  currentChapter,
  activeChapterIndex,
  chapterContent,
  currentUser,
  onUpdateEnrollment,
  onViewCertificate,
  onNextChapter
}: VideoCompletionQuizModalProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [scorePercent, setScorePercent] = useState(0);
  const [isAwarding, setIsAwarding] = useState(false);
  const [awardedBadge, setAwardedBadge] = useState<EarnedBadge | null>(null);
  const [awardedCert, setAwardedCert] = useState<CertificateData | null>(null);

  // Generate or assemble questions when modal opens
  useEffect(() => {
    if (!isOpen) return;

    // Reset state
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerRevealed(false);
    setUserAnswers([]);
    setQuizCompleted(false);
    setAwardedBadge(null);
    setAwardedCert(null);

    const questionList: QuizQuestion[] = [];

    // 1. If AI-generated chapterContent has a quiz, use it
    if (chapterContent?.quiz) {
      questionList.push({
        question: chapterContent.quiz.question,
        options: chapterContent.quiz.options,
        correctAnswer: chapterContent.quiz.correctAnswer,
        explanation: chapterContent.quiz.explanation || 'Demonstrates essential practical understanding of the core concept.'
      });
    }

    // 2. Synthesize additional questions from chapter summary and course topic
    const cat = course.category?.toLowerCase() || '';
    if (cat.includes('stat') || cat.includes('math') || course.title.toLowerCase().includes('data')) {
      questionList.push({
        question: `How does the primary methodology in "${currentChapter.title}" safeguard against sample bias or variance errors?`,
        options: [
          'By standardizing probability weights and stratifying homogeneous clusters',
          'By omitting outlier observations arbitrarily without documentation',
          'By reducing sample frame diversity to minimize computation time',
          'By replacing systematic sampling with unstructured volunteer feedback'
        ],
        correctAnswer: 0,
        explanation: 'Stratification and proper weighting ensure representative estimation and bounded variance across subgroups.'
      });
      questionList.push({
        question: `In practical execution, what metric best evaluates the validity of this chapter\'s models?`,
        options: [
          'Design effect (deff) and root mean squared error (RMSE)',
          'Total file size of the spreadsheet export',
          'Raw execution speed regardless of confidence intervals',
          'Arbitrary visual inspection of bar charts'
        ],
        correctAnswer: 0,
        explanation: 'Design effect (deff) measures sample efficiency, while RMSE evaluates predictive precision.'
      });
    } else if (cat.includes('ai') || cat.includes('tech')) {
      questionList.push({
        question: `What fundamental architectural principle was highlighted in "${currentChapter.title}"?`,
        options: [
          'Separation of concerns between state representation and execution pipeline',
          'Hardcoding API keys directly in client-side script bundles',
          'Disabling error boundaries and retry logic for higher throughput',
          'Bypassing validation layers to reduce initial latency'
        ],
        correctAnswer: 0,
        explanation: 'Proper state encapsulation and modular architecture ensure resilient, maintainable engineering pipelines.'
      });
      questionList.push({
        question: `Which strategy effectively prevents hallucinations in this generative workflow?`,
        options: [
          'Grounding prompts with authoritative domain schema and structured output constraints',
          'Increasing model temperature to maximum entropy',
          'Omitting system instructions to allow unbounded exploration',
          'Repeatedly querying the model without verification checks'
        ],
        correctAnswer: 0,
        explanation: 'Structured schema enforcement and domain grounding yield strictly verifiable, hallucination-resistant outputs.'
      });
    } else {
      questionList.push({
        question: `What is the principal strategic objective addressed in "${currentChapter.title}"?`,
        options: [
          `Mastering core workflows to drive systematic outcomes in ${course.title}`,
          'Memorizing raw syntax without understanding operational context',
          'Ignoring foundational constraints in favor of rapid guesswork',
          'Deferring validation until the end of deployment lifecycle'
        ],
        correctAnswer: 0,
        explanation: 'Systematic workflow mastery creates durable, reproducible results across professional applications.'
      });
      questionList.push({
        question: `When applying these concepts, what constitutes a successful milestone?`,
        options: [
          'Verifiable implementation aligned with curriculum benchmarks',
          'Finishing reading without applying any practical exercises',
          'Skipping prerequisite evaluations',
          'Replicating legacy errors without revision'
        ],
        correctAnswer: 0,
        explanation: 'Applied milestones validated against standards confirm genuine competency mastery.'
      });
    }

    setQuestions(questionList);
  }, [isOpen, currentChapter.id, chapterContent]);

  if (!isOpen) return null;

  const currentQ = questions[currentQuestionIndex];
  const isFinalQuestion = currentQuestionIndex === questions.length - 1;

  const handleSelectOption = (idx: number) => {
    if (isAnswerRevealed) return;
    setSelectedOption(idx);
  };

  const handleVerifyAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerRevealed(true);
  };

  const handleNextQuestion = () => {
    const nextAnswers = [...userAnswers, selectedOption ?? -1];
    setUserAnswers(nextAnswers);

    if (isFinalQuestion) {
      // Calculate final score
      let correctCount = 0;
      questions.forEach((q, idx) => {
        const userChoice = idx === currentQuestionIndex ? selectedOption : nextAnswers[idx];
        if (userChoice === q.correctAnswer) correctCount++;
      });
      const pct = Math.round((correctCount / questions.length) * 100);
      setScorePercent(pct);
      setQuizCompleted(true);

      // Award badge & certificate if passed (>= 60%)
      if (pct >= 60 && currentUser) {
        setIsAwarding(true);
        awardCompletionCertificateAndBadge({
          user: currentUser,
          course,
          score: pct
        }).then(({ certificate, badge, updatedEnrollment }) => {
          setAwardedBadge(badge);
          setAwardedCert(certificate);
          setIsAwarding(false);
          onUpdateEnrollment(updatedEnrollment);
        }).catch(err => {
          console.warn('Failed to award certificate:', err);
          setIsAwarding(false);
        });
      }
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerRevealed(false);
    setUserAnswers([]);
    setQuizCompleted(false);
    setAwardedBadge(null);
    setAwardedCert(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 w-full max-w-2xl bg-[#0d1017] border border-[#40e3bd]/40 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col text-white my-auto"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-950/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#40e3bd]/15 border border-[#40e3bd]/40 flex items-center justify-center text-[#40e3bd]">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-['Space_Grotesk'] text-white">
                  Video Completion Assessment
                </h3>
                <p className="text-[11px] text-zinc-400">
                  Ch {activeChapterIndex + 1}: {currentChapter.title}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {!quizCompleted ? (
              // Active Quiz Screen
              currentQ ? (
                <div className="space-y-6">
                  {/* Progress bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[#40e3bd] font-bold">
                        Question {currentQuestionIndex + 1} of {questions.length}
                      </span>
                      <span className="text-zinc-400 text-[11px]">
                        Pass threshold: 60%
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800/80 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-[#40e3bd] to-[#20b892] h-full transition-all duration-300"
                        style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Question text */}
                  <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                    <h4 className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                      {currentQ.question}
                    </h4>
                  </div>

                  {/* Options */}
                  <div className="space-y-2.5">
                    {currentQ.options.map((opt, idx) => {
                      const isSelected = selectedOption === idx;
                      const isCorrect = idx === currentQ.correctAnswer;
                      
                      let optionClasses = "bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 text-zinc-300";
                      
                      if (isAnswerRevealed) {
                        if (isCorrect) {
                          optionClasses = "bg-emerald-500/20 border-emerald-500 text-emerald-200 font-semibold shadow-[0_0_15px_rgba(16,185,129,0.2)]";
                        } else if (isSelected && !isCorrect) {
                          optionClasses = "bg-rose-500/20 border-rose-500 text-rose-300";
                        } else {
                          optionClasses = "bg-zinc-950/40 border-zinc-900 text-zinc-600 opacity-60";
                        }
                      } else if (isSelected) {
                        optionClasses = "bg-[#40e3bd]/15 border-[#40e3bd] text-white shadow-[0_0_15px_rgba(64,227,189,0.15)]";
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={isAnswerRevealed}
                          onClick={() => handleSelectOption(idx)}
                          className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm flex items-start gap-3 transition-all cursor-pointer ${optionClasses}`}
                        >
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 ${
                            isSelected && !isAnswerRevealed
                              ? 'bg-[#40e3bd] text-[#052219]'
                              : isAnswerRevealed && isCorrect
                              ? 'bg-emerald-500 text-white'
                              : isAnswerRevealed && isSelected && !isCorrect
                              ? 'bg-rose-500 text-white'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}>
                            {String.fromCharCode(65 + idx)}
                          </div>
                          <span className="flex-1 leading-snug">{opt}</span>
                          {isAnswerRevealed && isCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          )}
                          {isAnswerRevealed && isSelected && !isCorrect && (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation Callout */}
                  {isAnswerRevealed && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                        selectedOption === currentQ.correctAnswer
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                      }`}
                    >
                      <div className="font-bold mb-1 flex items-center gap-1.5">
                        {selectedOption === currentQ.correctAnswer ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Correct Analysis!</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-rose-400" />
                            <span>Incorrect. Here is the reason:</span>
                          </>
                        )}
                      </div>
                      <p className="text-zinc-300">{currentQ.explanation}</p>
                    </motion.div>
                  )}

                  {/* Action buttons */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-zinc-500">
                      Select best answer and verify to proceed
                    </span>

                    {!isAnswerRevealed ? (
                      <button
                        type="button"
                        disabled={selectedOption === null}
                        onClick={handleVerifyAnswer}
                        className="px-5 py-2.5 rounded-xl bg-[#40e3bd] text-[#052219] font-bold text-xs flex items-center gap-1.5 disabled:opacity-40 shadow-md hover:bg-[#5ef8d5] transition-colors cursor-pointer"
                      >
                        <span>Check Answer</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleNextQuestion}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#40e3bd] to-[#20b892] text-[#052219] font-bold text-xs flex items-center gap-1.5 shadow-lg hover:from-[#5ef8d5] transition-all cursor-pointer"
                      >
                        <span>{isFinalQuestion ? 'View Results & Credentials' : 'Next Question'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ) : null
            ) : (
              // Quiz Completed & Credentials Result Screen
              <div className="text-center space-y-6">
                {scorePercent >= 60 ? (
                  // PASSED: Award Badge and Certificate
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6"
                  >
                    <div className="w-16 h-16 rounded-3xl bg-[#40e3bd]/15 border border-[#40e3bd]/40 mx-auto flex items-center justify-center text-[#40e3bd] shadow-[0_0_30px_rgba(64,227,189,0.3)]">
                      <Award className="w-8 h-8 fill-current" />
                    </div>

                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>ASSESSMENT PASSED • {scorePercent}% SCORE</span>
                      </div>
                      <h3 className="text-2xl font-extrabold font-['Space_Grotesk'] text-white">
                        Outstanding Work, {currentUser?.name || 'Scholar'}!
                      </h3>
                      <p className="text-xs text-zinc-300 max-w-md mx-auto">
                        You have validated comprehension of <span className="text-[#40e3bd] font-semibold">{currentChapter.title}</span>. Your earned badge and official certificate are ready!
                      </p>
                    </div>

                    {/* Unlocked Badge Card */}
                    <div className="p-5 rounded-2xl bg-zinc-900/80 border border-[#40e3bd]/50 shadow-[0_0_20px_rgba(64,227,189,0.15)] flex items-center gap-4 text-left">
                      <div className="w-14 h-14 rounded-2xl bg-[#40e3bd]/15 border border-[#40e3bd]/40 flex items-center justify-center text-3xl shrink-0 shadow-inner">
                        {awardedBadge?.icon || '🎓'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#40e3bd]/20 text-[#40e3bd] font-mono font-bold uppercase">
                            New Badge Earned
                          </span>
                          <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                            <CloudCheck className="w-3 h-3" />
                            Synced to Profile
                          </span>
                        </div>
                        <h4 className="text-sm font-bold font-['Space_Grotesk'] text-white mt-1">
                          {awardedBadge?.title || 'Technical Curriculum Specialist'}
                        </h4>
                        <p className="text-[11px] text-zinc-400 line-clamp-1">
                          {awardedBadge?.description || `Mastery in ${course.title}`}
                        </p>
                      </div>
                    </div>

                    {/* Certificate Preview Banner */}
                    <div className="p-4 rounded-2xl bg-zinc-950/90 border border-zinc-800 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#40e3bd]" />
                          <span>Official Lumina Credential</span>
                          <span className="font-mono text-[#40e3bd]">{awardedCert?.certificateId || 'VERIFIED'}</span>
                        </div>
                        <div className="font-semibold text-white">
                          Certificate of Completion Mastery
                        </div>
                      </div>

                      {awardedCert && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onViewCertificate(awardedCert);
                          }}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#40e3bd] to-[#20b892] text-[#052219] font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:from-[#5ef8d5] transition-all cursor-pointer shrink-0"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>View Official Certificate</span>
                        </button>
                      )}
                    </div>

                    {/* Bottom Navigation */}
                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleRetakeQuiz}
                        className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Retake Quiz</span>
                      </button>

                      {activeChapterIndex < course.chapters.length - 1 && onNextChapter && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onNextChapter();
                          }}
                          className="px-5 py-2.5 rounded-xl bg-[#40e3bd] text-[#052219] text-xs font-bold font-['Space_Grotesk'] flex items-center gap-1.5 shadow-md hover:bg-[#5ef8d5] transition-all cursor-pointer"
                        >
                          <span>Proceed to Next Chapter</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors cursor-pointer"
                      >
                        Close Window
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  // FAILED: Encouragement & Retake
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/40 mx-auto flex items-center justify-center text-rose-400">
                      <XCircle className="w-7 h-7" />
                    </div>

                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold font-mono">
                        <span>SCORE: {scorePercent}% • 60% REQUIRED TO PASS</span>
                      </div>
                      <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                        Keep Learning & Review Key Concepts
                      </h3>
                      <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                        You can re-watch the video lecture or consult your saved lecture notes before attempting this evaluation again.
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleRetakeQuiz}
                        className="px-5 py-2.5 rounded-xl bg-[#40e3bd] text-[#052219] font-bold text-xs flex items-center gap-1.5 shadow-md hover:bg-[#5ef8d5] transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Try Again</span>
                      </button>

                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors cursor-pointer"
                      >
                        Review Lecture Notes
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
