import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Layers, 
  Users, 
  BookOpen, 
  GraduationCap, 
  Award, 
  Plus, 
  Upload, 
  ShieldCheck, 
  ExternalLink, 
  Eye, 
  CheckCircle2, 
  TrendingUp, 
  Clock, 
  FileText, 
  Settings, 
  HelpCircle,
  BarChart3,
  Sliders,
  PlayCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import type { AICourse, DemoAccount, AssessmentPackage, CourseMaterial, TraineePerformanceRecord } from '../types';
import AiAssessmentCreator from './trainer/AiAssessmentCreator';
import MaterialLibraryManager from './trainer/MaterialLibraryManager';
import TraineePerformanceTracker from './trainer/TraineePerformanceTracker';
import {
  fetchTrainerMaterials,
  uploadMaterialRecord,
  deleteMaterialRecord,
  subscribeToCourseAnalytics
} from '../lib/trainerService';

interface TrainerDashboardProps {
  currentUser: DemoAccount | null;
  courses: AICourse[];
  onSwitchToTraineeView?: () => void;
  onOpenCreateModal?: () => void;
  onSelectCourseLayout?: (course: AICourse) => void;
}

export type TrainerTab = 'assessment-creator' | 'material-library' | 'performance-tracker';

export default function TrainerDashboard({
  currentUser,
  courses,
  onSwitchToTraineeView,
  onOpenCreateModal,
  onSelectCourseLayout
}: TrainerDashboardProps) {
  const [activeTab, setActiveTab] = useState<TrainerTab>('assessment-creator');
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [traineeRecords, setTraineeRecords] = useState<TraineePerformanceRecord[]>([]);
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(true);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Initialize live Firestore listeners and fetch materials
  useEffect(() => {
    // 1. Fetch materials from Firestore
    fetchTrainerMaterials()
      .then((data) => {
        setMaterials(data);
        setIsLoadingMaterials(false);
      })
      .catch((err) => {
        console.error('Fetch materials notice:', err);
        setErrorNotice(`Materials sync: ${err.message}`);
        setIsLoadingMaterials(false);
      });

    // 2. Real-time Firestore subscription to trainee performance metrics
    const unsubAnalytics = subscribeToCourseAnalytics(
      undefined,
      (records) => {
        setTraineeRecords(records);
        setIsLoadingAnalytics(false);
      },
      (err) => {
        console.error('Analytics stream notice:', err);
        setErrorNotice(`Analytics stream: ${err.message}`);
        setIsLoadingAnalytics(false);
      }
    );

    return () => {
      unsubAnalytics();
    };
  }, []);

  const handleUploadMaterial = async (materialData: Omit<CourseMaterial, 'id' | 'uploadedAt' | 'downloadsCount'> & { id?: string }) => {
    try {
      const uploaded = await uploadMaterialRecord(materialData);
      setMaterials(prev => [uploaded, ...prev]);
      setNotice(`Curricular resource "${uploaded.title}" persisted to Firestore.`);
      setTimeout(() => setNotice(null), 3500);
      return uploaded;
    } catch (err) {
      setErrorNotice(`Upload failed: ${err instanceof Error ? err.message : String(err)}`);
      throw err;
    }
  };

  const handleDeleteMaterial = async (materialId: string) => {
    try {
      await deleteMaterialRecord(materialId);
      setMaterials(prev => prev.filter(m => m.id !== materialId));
      setNotice('Resource permanently removed from Firestore curriculum library.');
      setTimeout(() => setNotice(null), 3000);
    } catch (err) {
      setErrorNotice(`Delete failed: ${err instanceof Error ? err.message : String(err)}`);
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0d12] text-zinc-100 pb-20 pt-4">
      {/* Top Banner & Faculty Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Lumina Trainer Welcome Bar */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#111318] via-[#161a22] to-[#0d151c] border border-zinc-800/80 p-6 sm:p-8 shadow-2xl">
          {/* Subtle glow backdrop */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#40e3bd]/10 via-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="relative">
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={currentUser?.name || 'Faculty Member'}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#40e3bd]/50 shadow-[0_0_20px_rgba(64,227,189,0.2)]"
                />
                <span className="absolute -bottom-1 -right-1 p-1 rounded-lg bg-[#40e3bd] text-[#052219]" title="Verified Academy Faculty">
                  <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#40e3bd]/15 border border-[#40e3bd]/40 text-[#40e3bd] text-xs font-mono font-semibold">
                    Faculty Command Center
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400">
                    National Statistical Systems Academy • Live Firestore Connected
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-white tracking-tight">
                  Welcome back, {currentUser?.name || 'Dr. Julian Hayes'}
                </h1>

                <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl">
                  Administer accredited official statistics curricula, synthesize AI-powered psychometric assessments, and guide ISS & SSS cadre performance with live telemetry.
                </p>
              </div>
            </div>

            {/* Quick Action Switcher */}
            <div className="flex items-center gap-3 self-start md:self-center">
              {onSwitchToTraineeView && (
                <button
                  onClick={onSwitchToTraineeView}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-xs font-semibold text-zinc-200 transition-colors flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Eye className="w-4 h-4 text-[#40e3bd]" />
                  <span>Switch to Trainee View</span>
                </button>
              )}

              {onOpenCreateModal && (
                <button
                  onClick={onOpenCreateModal}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#40e3bd] to-[#22d3ee] hover:from-[#a3f7e2] hover:to-[#40e3bd] text-[#052219] font-bold text-xs font-['Space_Grotesk'] transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(64,227,189,0.3)]"
                >
                  <Plus className="w-4 h-4 text-[#052219] stroke-[2.5]" />
                  <span>Author New Course</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="mt-6 pt-5 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Active Cadre Scholars</span>
              <p className="text-lg font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
                {isLoadingAnalytics ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#40e3bd]" />
                ) : (
                  `${traineeRecords.length} Officers`
                )}
              </p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Assessment Bank</span>
              <p className="text-lg font-bold font-['Space_Grotesk'] text-[#40e3bd]">85 Validated Items</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Curriculum Modules</span>
              <p className="text-lg font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
                {isLoadingMaterials ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                ) : (
                  `${materials.length} Resources`
                )}
              </p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Firestore State</span>
              <p className="text-lg font-bold font-['Space_Grotesk'] text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Stream
              </p>
            </div>
          </div>
        </div>

        {/* Global Notice Banner */}
        <AnimatePresence>
          {notice && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="p-4 rounded-2xl bg-[#0a271e] border border-[#40e3bd]/40 text-xs font-semibold text-[#40e3bd] flex items-center justify-between shadow-lg"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#40e3bd]" />
                <span>{notice}</span>
              </div>
              <button onClick={() => setNotice(null)} className="text-zinc-400 hover:text-white text-xs cursor-pointer">
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Error Notice Banner */}
        <AnimatePresence>
          {errorNotice && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="p-4 rounded-2xl bg-red-950/80 border border-red-500/40 text-xs font-semibold text-red-300 flex items-center justify-between shadow-lg"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorNotice}</span>
              </div>
              <button onClick={() => setErrorNotice(null)} className="text-zinc-400 hover:text-white text-xs cursor-pointer">
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Section Navigation Tabs Matching Lumina Design System */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-1">
          <nav className="flex items-center gap-2 sm:gap-4 overflow-x-auto scrollbar-none py-1">
            {/* Tab 1: AI Assessment Creator */}
            <button
              onClick={() => setActiveTab('assessment-creator')}
              className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold font-['Space_Grotesk'] transition-all cursor-pointer flex items-center gap-2.5 relative whitespace-nowrap ${
                activeTab === 'assessment-creator'
                  ? 'bg-zinc-900 text-white border border-zinc-700/80 shadow-lg'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
              }`}
            >
              <div className={`p-1.5 rounded-lg ${activeTab === 'assessment-creator' ? 'bg-[#40e3bd]/20 text-[#40e3bd]' : 'text-zinc-500'}`}>
                <Sparkles className="w-4 h-4" />
              </div>
              <span>AI Assessment Creator</span>
              {activeTab === 'assessment-creator' && (
                <motion.div
                  layoutId="activeTrainerTabIndicator"
                  className="absolute -bottom-1.5 left-4 right-4 h-0.5 bg-[#40e3bd] rounded-full shadow-[0_0_8px_#40e3bd]"
                />
              )}
            </button>

            {/* Tab 2: Material Library Manager */}
            <button
              onClick={() => setActiveTab('material-library')}
              className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold font-['Space_Grotesk'] transition-all cursor-pointer flex items-center gap-2.5 relative whitespace-nowrap ${
                activeTab === 'material-library'
                  ? 'bg-zinc-900 text-white border border-zinc-700/80 shadow-lg'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
              }`}
            >
              <div className={`p-1.5 rounded-lg ${activeTab === 'material-library' ? 'bg-cyan-500/20 text-cyan-400' : 'text-zinc-500'}`}>
                <Layers className="w-4 h-4" />
              </div>
              <span>Material Library Manager</span>
              {materials.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-zinc-800 text-zinc-300">
                  {materials.length}
                </span>
              )}
              {activeTab === 'material-library' && (
                <motion.div
                  layoutId="activeTrainerTabIndicator"
                  className="absolute -bottom-1.5 left-4 right-4 h-0.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]"
                />
              )}
            </button>

            {/* Tab 3: Trainee Performance Tracker */}
            <button
              onClick={() => setActiveTab('performance-tracker')}
              className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold font-['Space_Grotesk'] transition-all cursor-pointer flex items-center gap-2.5 relative whitespace-nowrap ${
                activeTab === 'performance-tracker'
                  ? 'bg-zinc-900 text-white border border-zinc-700/80 shadow-lg'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
              }`}
            >
              <div className={`p-1.5 rounded-lg ${activeTab === 'performance-tracker' ? 'bg-emerald-500/20 text-emerald-400' : 'text-zinc-500'}`}>
                <Users className="w-4 h-4" />
              </div>
              <span>Trainee Performance Tracker</span>
              {traineeRecords.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-zinc-800 text-zinc-300">
                  {traineeRecords.length}
                </span>
              )}
              {activeTab === 'performance-tracker' && (
                <motion.div
                  layoutId="activeTrainerTabIndicator"
                  className="absolute -bottom-1.5 left-4 right-4 h-0.5 bg-emerald-400 rounded-full shadow-[0_0_8px_#34d399]"
                />
              )}
            </button>
          </nav>
        </div>

        {/* Tab Content Rendering with Motion Fade */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="w-full pt-2"
          >
            {activeTab === 'assessment-creator' && (
              <AiAssessmentCreator />
            )}

            {activeTab === 'material-library' && (
              <MaterialLibraryManager 
                materials={materials}
                isLoading={isLoadingMaterials}
                onUploadMaterial={handleUploadMaterial}
                onDeleteMaterial={handleDeleteMaterial}
              />
            )}

            {activeTab === 'performance-tracker' && (
              <TraineePerformanceTracker 
                trainees={traineeRecords}
                isLoading={isLoadingAnalytics}
              />
            )}
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}
