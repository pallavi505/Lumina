import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  ShieldCheck, 
  CloudCheck,
  X,
  FileCheck,
  Check,
  Zap,
  Info
} from 'lucide-react';
import type { DemoAccount, CertificateData, EarnedBadge, AICourse, CourseEnrollment } from '../types';
import { awardCompletionCertificateAndBadge } from '../lib/courseService';

interface QuestionItem {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  referenceStandard: string;
}

const QUIZ_SUITES: Record<string, { title: string; category: string; questions: QuestionItem[] }> = {
  'macro-sna': {
    title: 'National Accounts (SNA 2008 / 2025) & GDP Rebasing Certification',
    category: 'Macroeconomics & Official Statistics',
    questions: [
      {
        id: 'sna-q1',
        topic: 'GDP Deflator vs. CPI',
        question: 'When rebasing the Gross Domestic Product (GDP) series, how does the implicit GDP Deflator conceptually differ from the Consumer Price Index (CPI)?',
        options: [
          'The GDP Deflator reflects the prices of all domestically produced final goods and services using Paasche current-period weighting, whereas CPI reflects a fixed Laspeyres basket of consumer purchases including imports.',
          'The GDP Deflator only measures capital formation prices, while the CPI strictly tracks wholesale agricultural commodity inflation.',
          'The CPI automatically accounts for hedonic substitution effects, whereas the GDP Deflator uses unweighted arithmetic averages.',
          'There is no conceptual difference; both indices utilize identical fixed-weight baskets derived from decennial household expenditure surveys.'
        ],
        correctAnswer: 0,
        explanation: 'The GDP deflator covers all domestically produced goods/services with dynamic current-year weights (Paasche index), while CPI reflects a fixed consumption basket of households (Laspeyres-type) and includes imported final consumer goods.',
        referenceStandard: 'UN System of National Accounts (SNA 2008) Chapter 15: Price and Volume Measures'
      },
      {
        id: 'sna-q2',
        topic: 'Supply-Use Tables (SUT)',
        question: 'In the construction of Supply and Use Tables (SUT), what identity must hold strictly at the product level before matrix inversion to an Input-Output table?',
        options: [
          'Total Supply at Purchasers\' Prices = Total Domestic Output + Imports + Trade & Transport Margins + Taxes less Subsidies on Products = Total Use at Purchasers\' Prices.',
          'Total Gross Value Added must equal the total physical tonnage of industrial output reported in the Annual Survey of Industries.',
          'Net Indirect Taxes must equal exactly zero across all secondary manufacturing groups.',
          'Intermediate consumption of services must be omitted to prevent double counting of government transfer payments.'
        ],
        correctAnswer: 0,
        explanation: 'At purchaser prices, total supply (domestic output at basic prices plus imports, trade/transport margins, and net product taxes) must exactly balance total use (intermediate consumption plus final consumption, gross capital formation, and exports).',
        referenceStandard: 'MoSPI National Accounts Division Guidelines on SUT Balancing'
      },
      {
        id: 'sna-q3',
        topic: 'FISIM Allocation',
        question: 'How is Financial Intermediation Services Indirectly Measured (FISIM) calculated according to modern SNA standards?',
        options: [
          'As the interest margin between lending/deposit rates and an exogenous risk-free reference rate applied to the loan and deposit stocks.',
          'As the direct explicit fee charged on bank statement paper generation and ATM transaction charges.',
          'As the total market capitalization of nationalized commercial banks divided by total bank employees.',
          'As an arbitrary 2% flat markup over the central bank repo rate.'
        ],
        correctAnswer: 0,
        explanation: 'FISIM represents the implicit service charge reflected in interest rate differentials: (Lending Rate - Reference Rate) × Loan Stock + (Reference Rate - Deposit Rate) × Deposit Stock.',
        referenceStandard: 'SNA 2008 Section 6.163: The Measurement of FISIM'
      }
    ]
  },
  'capi-surveys': {
    title: 'Modern High-Frequency CAPI Telemetry & Sampling Variance',
    category: 'Survey Methodology & CAPI',
    questions: [
      {
        id: 'capi-q1',
        topic: 'Design Effect (Deff)',
        question: 'When designing a two-stage stratified cluster sample for socio-economic inquiries, what does a Design Effect (Deff) of 2.4 indicate?',
        options: [
          'The variance of the estimator under this cluster design is 2.4 times larger than it would be under a Simple Random Sample (SRS) of equal sample size, due to intra-cluster correlation.',
          'The survey costs are 2.4 times lower than an unstratified census inquiry.',
          'Exactly 2.4% of respondent households are projected to decline participation due to non-contact.',
          'The sample size must be divided by 2.4 to achieve a 95% confidence interval.'
        ],
        correctAnswer: 0,
        explanation: 'Deff = Var(cluster) / Var(SRS). A Deff of 2.4 means clustering induces an intra-cluster correlation (roh) that inflates variance by a factor of 2.4 compared to an equivalent simple random sample.',
        referenceStandard: 'Leslie Kish Survey Sampling & NSSO Methodology Series'
      },
      {
        id: 'capi-q2',
        topic: 'Paradata Geofencing Audit',
        question: 'Which CAPI field paradata metric is most effective for detecting falsification or remote desk-filling by field investigators?',
        options: [
          'High-precision timestamp intervals combined with GPS geofence drift and audio audit paradata.',
          'The brand name of the Android tablet utilized during the interview.',
          'The brightness setting of the tablet screen during questionnaire entry.',
          'The local Wi-Fi network name at the regional statistical office headquarters.'
        ],
        correctAnswer: 0,
        explanation: 'Auditing duration per question module, timestamp progression, and spatial GPS coordinates against the boundary frame prevents off-site proxy entries and ensures interview veracity.',
        referenceStandard: 'MoSPI Computer Assisted Personal Interviewing (CAPI) Quality Control Protocol'
      }
    ]
  },
  'ai-policy': {
    title: 'Machine Learning Pipelines & Grounded AI for Governance',
    category: 'AI & Data Science',
    questions: [
      {
        id: 'ai-q1',
        topic: 'Hallucination Prevention in Public Data',
        question: 'When deploying Generative AI models to query administrative statistical registers, what architectural approach ensures verifiable numerical accuracy?',
        options: [
          'Retrieval-Augmented Generation (RAG) with structured schema constraints, deterministic SQL/tabular tooling, and explicit citation anchoring.',
          'Increasing model sampling temperature to 1.0 to encourage diverse creative interpretations of budget tables.',
          'Omitting system instructions and prompting the model to guess missing historical values.',
          'Running the query through an unstructured image generator instead of textual validation.'
        ],
        correctAnswer: 0,
        explanation: 'Grounding the model with verified database schemas and deterministic query tools prevents probabilistic hallucination of statistical aggregates.',
        referenceStandard: 'Lumina National AI Governance Framework'
      },
      {
        id: 'ai-q2',
        topic: 'Algorithmic Fairness & Bias',
        question: 'In predictive targeting models for rural welfare subsidy disbursement, how should disparate impact be audited?',
        options: [
          'By calculating demographic parity ratios and equalized odds across protected socio-demographic strata.',
          'By assuming all algorithms are intrinsically neutral and omitting subgroup performance monitoring.',
          'By training only on urban respondents and extrapolating results to remote tribal habitations.',
          'By deleting all demographic metadata and ignoring evaluation metrics.'
        ],
        correctAnswer: 0,
        explanation: 'Evaluating disparate impact through demographic parity and false positive/negative parity ensures equitable service delivery across all administrative districts.',
        referenceStandard: 'National Ethics Guidelines for Emerging Technologies'
      }
    ]
  }
};

interface InteractiveQuizPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: DemoAccount | null;
  courses: AICourse[];
  onUpdateEnrollment?: (updated: CourseEnrollment) => void;
  onViewCertificate?: (cert: CertificateData) => void;
}

export default function InteractiveQuizPlayerModal({
  isOpen,
  onClose,
  currentUser,
  courses,
  onUpdateEnrollment,
  onViewCertificate
}: InteractiveQuizPlayerModalProps) {
  const [selectedSuiteKey, setSelectedSuiteKey] = useState<string>('macro-sna');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [scorePercent, setScorePercent] = useState(0);
  const [isAwarding, setIsAwarding] = useState(false);
  const [awardedBadge, setAwardedBadge] = useState<EarnedBadge | null>(null);
  const [awardedCert, setAwardedCert] = useState<CertificateData | null>(null);

  if (!isOpen) return null;

  const currentSuite = QUIZ_SUITES[selectedSuiteKey] || QUIZ_SUITES['macro-sna'];
  const questions = currentSuite.questions;
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
      // Calculate score
      let correct = 0;
      questions.forEach((q, idx) => {
        const choice = idx === currentQuestionIndex ? selectedOption : nextAnswers[idx];
        if (choice === q.correctAnswer) correct++;
      });
      const pct = Math.round((correct / questions.length) * 100);
      setScorePercent(pct);
      setQuizCompleted(true);

      // Award certificate & badge if passed (>= 60%)
      if (pct >= 60 && currentUser) {
        setIsAwarding(true);
        // Find matching course or use first
        const matchCourse = courses.find(c => 
          c.title.toLowerCase().includes('macro') || 
          c.title.toLowerCase().includes('survey') || 
          c.title.toLowerCase().includes('data')
        ) || courses[0];

        awardCompletionCertificateAndBadge({
          user: currentUser,
          course: {
            ...matchCourse,
            title: currentSuite.title,
            category: currentSuite.category
          },
          score: pct
        }).then(({ certificate, badge, updatedEnrollment }) => {
          setAwardedBadge(badge);
          setAwardedCert(certificate);
          setIsAwarding(false);
          if (onUpdateEnrollment) onUpdateEnrollment(updatedEnrollment);
        }).catch(err => {
          console.warn('Award failed:', err);
          setIsAwarding(false);
        });
      }
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
    }
  };

  const handleRetake = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerRevealed(false);
    setUserAnswers([]);
    setQuizCompleted(false);
    setAwardedBadge(null);
    setAwardedCert(null);
  };

  const handleSwitchSuite = (suiteKey: string) => {
    setSelectedSuiteKey(suiteKey);
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
          className="relative z-10 w-full max-w-3xl bg-[#0d1017] border border-[#40e3bd]/40 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col text-white my-auto max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-950/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#40e3bd]/15 border border-[#40e3bd]/40 flex items-center justify-center text-[#40e3bd]">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-['Space_Grotesk'] text-white">
                  Interactive Assessment & Credential Player
                </h3>
                <p className="text-[11px] text-zinc-400">
                  Immediate feedback • Verifiable Certificate & Skill Badge
                </p>
              </div>
            </div>

            {/* Assessment Topic Suite Pills */}
            {!quizCompleted && (
              <div className="flex items-center gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-xl self-start sm:self-auto overflow-x-auto">
                {[
                  { key: 'macro-sna', label: 'National Accounts' },
                  { key: 'capi-surveys', label: 'CAPI Surveys' },
                  { key: 'ai-policy', label: 'AI & Policy' }
                ].map(s => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => handleSwitchSuite(s.key)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-['Space_Grotesk'] whitespace-nowrap transition-all cursor-pointer ${
                      selectedSuiteKey === s.key
                        ? 'bg-[#40e3bd] text-[#052219]'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer self-end sm:self-auto"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
            {!quizCompleted ? (
              currentQ ? (
                <div className="space-y-6">
                  {/* Progress bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[#40e3bd] font-bold">
                          Question {currentQuestionIndex + 1} of {questions.length}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-mono">
                          {currentQ.topic}
                        </span>
                      </div>
                      <span className="text-zinc-400 text-[11px] font-mono">
                        Pass: 60%
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800/80 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-[#40e3bd] to-[#20b892] h-full transition-all duration-300"
                        style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Question Stem Card */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800">
                    <h4 className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                      {currentQ.question}
                    </h4>
                  </div>

                  {/* Multi-Choice Options */}
                  <div className="space-y-2.5">
                    {currentQ.options.map((opt, idx) => {
                      const isSelected = selectedOption === idx;
                      const isCorrect = idx === currentQ.correctAnswer;
                      
                      let optionClasses = "bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 text-zinc-300";
                      
                      if (isAnswerRevealed) {
                        if (isCorrect) {
                          optionClasses = "bg-emerald-500/20 border-emerald-500 text-emerald-200 font-semibold shadow-[0_0_20px_rgba(16,185,129,0.25)]";
                        } else if (isSelected && !isCorrect) {
                          optionClasses = "bg-rose-500/20 border-rose-500 text-rose-300";
                        } else {
                          optionClasses = "bg-zinc-950/40 border-zinc-900 text-zinc-600 opacity-50";
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
                          className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm flex items-start gap-3 transition-all cursor-pointer ${optionClasses}`}
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
                          <span className="flex-1 leading-relaxed">{opt}</span>
                          {isAnswerRevealed && isCorrect && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                          )}
                          {isAnswerRevealed && isSelected && !isCorrect && (
                            <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Immediate Feedback & Detailed Explanation Popup */}
                  {isAnswerRevealed && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-2 ${
                        selectedOption === currentQ.correctAnswer
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-2">
                        {selectedOption === currentQ.correctAnswer ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Correct Response!</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-rose-400" />
                            <span>Incorrect. Review Analysis Below:</span>
                          </>
                        )}
                      </div>
                      
                      <p className="text-zinc-300 leading-relaxed font-normal">
                        {currentQ.explanation}
                      </p>

                      <div className="pt-2 border-t border-zinc-800/60 flex items-center gap-1.5 text-[11px] text-zinc-400">
                        <Info className="w-3.5 h-3.5 text-[#40e3bd]" />
                        <span>Reference Standard: <strong className="text-zinc-200">{currentQ.referenceStandard}</strong></span>
                      </div>
                    </motion.div>
                  )}

                  {/* Action bar */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-zinc-500">
                      Select best option & verify for immediate feedback
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
                        <span>{isFinalQuestion ? 'Finalize & Claim Credentials' : 'Next Question'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ) : null
            ) : (
              // Results & Claim Credentials Screen
              <div className="text-center space-y-6">
                {scorePercent >= 60 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6"
                  >
                    <div className="w-16 h-16 rounded-3xl bg-[#40e3bd]/15 border border-[#40e3bd]/40 mx-auto flex items-center justify-center text-[#40e3bd] shadow-[0_0_35px_rgba(64,227,189,0.35)]">
                      <Award className="w-8 h-8 fill-current" />
                    </div>

                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>ASSESSMENT PASSED • {scorePercent}% SCORE</span>
                      </div>
                      <h3 className="text-2xl font-extrabold font-['Space_Grotesk'] text-white">
                        Congratulations, {currentUser?.name || 'Scholar'}!
                      </h3>
                      <p className="text-xs text-zinc-300 max-w-md mx-auto">
                        You have successfully validated your knowledge in <span className="text-[#40e3bd] font-semibold">{currentSuite.title}</span>. Your earned badge and official certificate have been minted.
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
                            New Cadre Badge Earned
                          </span>
                          <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                            <CloudCheck className="w-3 h-3" />
                            Synced to Profile
                          </span>
                        </div>
                        <h4 className="text-sm font-bold font-['Space_Grotesk'] text-white mt-1">
                          {awardedBadge?.title || `${currentSuite.category} Specialist`}
                        </h4>
                        <p className="text-[11px] text-zinc-400 line-clamp-1">
                          {awardedBadge?.description || `Demonstrated certified ${scorePercent}% mastery.`}
                        </p>
                      </div>
                    </div>

                    {/* Certificate Preview Banner */}
                    <div className="p-4 rounded-2xl bg-zinc-950/90 border border-zinc-800 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#40e3bd]" />
                          <span>Official Lumina Institutional Credential</span>
                          <span className="font-mono text-[#40e3bd]">{awardedCert?.certificateId || 'VERIFIED'}</span>
                        </div>
                        <div className="font-semibold text-white">
                          Certificate of Completion & Technical Competency
                        </div>
                      </div>

                      {awardedCert && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            if (onViewCertificate) onViewCertificate(awardedCert);
                          }}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#40e3bd] to-[#20b892] text-[#052219] font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:from-[#5ef8d5] transition-all cursor-pointer shrink-0"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>View Official Certificate</span>
                        </button>
                      )}
                    </div>

                    {/* Navigation buttons */}
                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleRetake}
                        className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Retake Assessment</span>
                      </button>

                      <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl bg-[#40e3bd] text-[#052219] font-bold text-xs transition-colors cursor-pointer"
                      >
                        Done & Return to Dashboard
                      </button>
                    </div>
                  </motion.div>
                ) : (
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
                        Review Standards & Retake Evaluation
                      </h3>
                      <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                        Revisit the recommended syllabus modules or inspect the question explanations before re-attempting this assessment.
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleRetake}
                        className="px-5 py-2.5 rounded-xl bg-[#40e3bd] text-[#052219] font-bold text-xs flex items-center gap-1.5 shadow-md hover:bg-[#5ef8d5] transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Retake Quiz</span>
                      </button>

                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors cursor-pointer"
                      >
                        Close
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
