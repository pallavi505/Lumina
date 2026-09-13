import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  BookOpen, 
  Layers, 
  Clock, 
  Video, 
  CheckCircle2, 
  Loader2, 
  ArrowRight,
  Code,
  LineChart,
  Brain,
  Globe,
  Briefcase
} from 'lucide-react';
import type { AICourse } from '../types';
import { callGenerateAICourse, saveCourse } from '../lib/courseService';

interface AICourseCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCourseCreated: (course: AICourse) => void;
  initialTopic?: string;
}

const CATEGORIES = [
  { id: "Programming", label: "Programming & Web", icon: Code },
  { id: "Official Statistics", label: "Official Statistics & MoSPI", icon: LineChart },
  { id: "AI & Machine Learning", label: "AI & Data Science", icon: Brain },
  { id: "Cloud & DevOps", label: "Cloud & Infrastructure", icon: Globe },
  { id: "Business & Policy", label: "Economics & Governance", icon: Briefcase }
];

const SUGGESTIONS = [
  "Next.js 15 & Neon SaaS Platform",
  "Python for Survey Microdata & Pandas",
  "Machine Learning for GST Anomaly Detection",
  "National Accounts & Input-Output Matrices",
  "React & Tailwind Component Systems",
  "FastAPI Microservices & Docker"
];

export default function AICourseCreatorModal({ isOpen, onClose, onCourseCreated, initialTopic }: AICourseCreatorModalProps) {
  const [topic, setTopic] = useState(initialTopic || '');
  const [category, setCategory] = useState('Programming');
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [duration, setDuration] = useState('2-3 Hours');
  const [includeVideo, setIncludeVideo] = useState(true);
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (initialTopic) {
      setTopic(initialTopic);
    }
  }, [initialTopic]);

  const loadingSteps = [
    "Synthesizing curriculum requirements with Gemini 3.8 Flash...",
    "Generating modular chapter blueprints and lesson topics...",
    "Curating verified educational YouTube lectures...",
    "Synthesizing thematic banner artwork and learning outcomes..."
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please enter a course topic or title');
      return;
    }

    setError('');
    setIsGenerating(true);
    setGenerationStep(0);

    const stepInterval = setInterval(() => {
      setGenerationStep(prev => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 1200);

    try {
      const newCourse = await callGenerateAICourse({
        topic: topic.trim(),
        category,
        level,
        duration,
        includeVideo,
        description: description.trim()
      });

      clearInterval(stepInterval);
      await saveCourse(newCourse);
      setIsGenerating(false);
      onCourseCreated(newCourse);
      onClose();
    } catch (err: any) {
      clearInterval(stepInterval);
      setIsGenerating(false);
      setError(err.message || 'Failed to generate course. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={!isGenerating ? onClose : undefined}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[#0e0f14] border border-zinc-800/90 rounded-2xl shadow-2xl overflow-hidden z-10 my-8"
        >
          {/* Top glowing accent line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#40e3bd] to-transparent" />

          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-zinc-800/80 bg-zinc-900/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#40e3bd]/10 border border-[#40e3bd]/30 flex items-center justify-center text-[#40e3bd]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold font-['Space_Grotesk'] text-white">
                  Generate AI Course Layout
                </h2>
                <p className="text-xs text-zinc-400">
                  Powered by Gemini 3.8 Flash • Structured curriculum, YouTube lectures & banner
                </p>
              </div>
            </div>

            {!isGenerating && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Body */}
          {isGenerating ? (
            <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-2 border-zinc-800 border-t-[#40e3bd] animate-spin flex items-center justify-center" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-[#40e3bd] animate-pulse" />
                </div>
              </div>

              <div className="space-y-2 max-w-md">
                <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
                  Crafting Your Masterclass
                </h3>
                <p className="text-xs text-[#40e3bd] font-mono min-h-[36px] flex items-center justify-center">
                  {loadingSteps[generationStep]}
                </p>
              </div>

              <div className="w-full max-w-md bg-zinc-900 rounded-full h-1.5 overflow-hidden border border-zinc-800">
                <motion.div
                  className="bg-gradient-to-r from-[#40e3bd] to-[#20b892] h-full"
                  initial={{ width: "10%" }}
                  animate={{ width: `${((generationStep + 1) / loadingSteps.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 w-full max-w-md text-left text-[11px] text-zinc-400">
                <div className="p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800/60 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#40e3bd]" />
                  <span>Topic: {topic}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800/60 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#40e3bd]" />
                  <span>Level: {level}</span>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleGenerate} className="p-6 sm:p-8 space-y-5">
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {error}
                </div>
              )}

              {/* Topic Input */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  Course Topic or Subject <span className="text-[#40e3bd]">*</span>
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Next.js 15 Full Stack SaaS, Python for Microdata, Macroeconomics..."
                  required
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-700/70 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-[#40e3bd] focus:ring-1 focus:ring-[#40e3bd] transition-all"
                />

                {/* Quick suggestions */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[11px] text-zinc-400 mr-1 self-center">Try:</span>
                  {SUGGESTIONS.map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => setTopic(sug)}
                      className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-[#40e3bd]/50 hover:text-[#40e3bd] text-[11px] text-zinc-400 transition-colors cursor-pointer"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Select */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#40e3bd]/10 border-[#40e3bd] text-[#40e3bd]'
                            : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#40e3bd]' : 'text-zinc-400'}`} />
                        <span className="text-xs font-medium truncate">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Level & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                    Difficulty Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setLevel(lvl)}
                        className={`py-2 px-2 text-center rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                          level === lvl
                            ? 'bg-[#40e3bd]/15 border-[#40e3bd] text-[#40e3bd]'
                            : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-400'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                    Estimated Duration
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['1-2 Hours', '2-3 Hours', '4+ Hours'].map((dur) => (
                      <button
                        key={dur}
                        type="button"
                        onClick={() => setDuration(dur)}
                        className={`py-2 px-2 text-center rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                          duration === dur
                            ? 'bg-[#40e3bd]/15 border-[#40e3bd] text-[#40e3bd]'
                            : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-400'
                        }`}
                      >
                        {dur}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Include Video Toggle */}
              <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#40e3bd]/10 border border-[#40e3bd]/30 flex items-center justify-center text-[#40e3bd]">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">Include YouTube Video Lectures</div>
                    <div className="text-[11px] text-zinc-400">Embed verified tutorial video for each chapter</div>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={includeVideo}
                  onChange={(e) => setIncludeVideo(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#40e3bd] cursor-pointer"
                />
              </div>

              {/* Optional Description / Goal */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  Course Goal or Focus <span className="text-zinc-500 font-normal">(Optional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Focus on production deployment with server actions and live error handling..."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-700/70 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-[#40e3bd] focus:ring-1 focus:ring-[#40e3bd] transition-all resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800/80">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#40e3bd] via-[#35d8b2] to-[#20b892] hover:from-[#5ef8d5] hover:to-[#35d8b2] text-[#052219] text-xs font-bold font-['Space_Grotesk'] flex items-center gap-2 shadow-[0_0_20px_rgba(64,227,189,0.35)] transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>Generate Course Layout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
