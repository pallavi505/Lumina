import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Filter, 
  Download, 
  Mail, 
  Award, 
  ArrowUpDown, 
  ChevronRight, 
  BarChart3, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Check, 
  X, 
  Eye,
  Send,
  AlertCircle
} from 'lucide-react';
import type { TraineePerformanceRecord, TraineePerformanceStatus } from '../../types';
import { INITIAL_TRAINEE_RECORDS } from '../../data/trainerData';
import { useLiveNotifications } from '../../context/NotificationContext';

interface TraineePerformanceTrackerProps {
  trainees?: TraineePerformanceRecord[];
  isLoading?: boolean;
}

export default function TraineePerformanceTracker({
  trainees: propTrainees,
  isLoading = false
}: TraineePerformanceTrackerProps) {
  const { addNotification } = useLiveNotifications();
  const [trainees, setTrainees] = useState<TraineePerformanceRecord[]>(propTrainees || INITIAL_TRAINEE_RECORDS);

  React.useEffect(() => {
    if (propTrainees && propTrainees.length > 0) {
      setTrainees(propTrainees);
    }
  }, [propTrainees]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'completion' | 'score' | 'participation' | 'name'>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedTrainee, setSelectedTrainee] = useState<TraineePerformanceRecord | null>(null);
  const [notificationSentMessage, setNotificationSentMessage] = useState<string | null>(null);

  // Available courses for filter
  const uniqueCourses = useMemo(() => {
    return Array.from(new Set(trainees.map(t => t.courseTitle)));
  }, [trainees]);

  // Filtered & Sorted trainees
  const filteredTrainees = useMemo(() => {
    return trainees
      .filter(t => {
        const matchSearch = searchQuery === '' ||
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.cadre.toLowerCase().includes(searchQuery.toLowerCase());
        const matchStatus = statusFilter === 'all' || t.status === statusFilter;
        const matchCourse = courseFilter === 'all' || t.courseTitle === courseFilter;
        return matchSearch && matchStatus && matchCourse;
      })
      .sort((a, b) => {
        let valA = 0;
        let valB = 0;
        if (sortBy === 'completion') {
          valA = a.completionRate;
          valB = b.completionRate;
        } else if (sortBy === 'score') {
          valA = a.avgAssessmentScore;
          valB = b.avgAssessmentScore;
        } else if (sortBy === 'participation') {
          valA = a.participationRate;
          valB = b.participationRate;
        } else {
          return sortOrder === 'asc' 
            ? a.name.localeCompare(b.name) 
            : b.name.localeCompare(a.name);
        }
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      });
  }, [trainees, searchQuery, statusFilter, courseFilter, sortBy, sortOrder]);

  // Aggregate Cohort Analytics
  const analytics = useMemo(() => {
    const total = trainees.length;
    const avgCompletion = Math.round(trainees.reduce((acc, t) => acc + t.completionRate, 0) / (total || 1));
    const avgScore = Math.round(trainees.reduce((acc, t) => acc + t.avgAssessmentScore, 0) / (total || 1));
    const atRiskCount = trainees.filter(t => t.status === 'Needs Attention' || t.status === 'At Risk').length;
    const proficientCount = trainees.filter(t => t.status === 'Proficient').length;

    // Score distribution buckets
    const bucket90 = trainees.filter(t => t.avgAssessmentScore >= 90).length;
    const bucket80 = trainees.filter(t => t.avgAssessmentScore >= 80 && t.avgAssessmentScore < 90).length;
    const bucket70 = trainees.filter(t => t.avgAssessmentScore >= 70 && t.avgAssessmentScore < 80).length;
    const bucketBelow70 = trainees.filter(t => t.avgAssessmentScore < 70).length;

    return {
      total,
      avgCompletion,
      avgScore,
      atRiskCount,
      proficientCount,
      distribution: {
        bucket90,
        bucket80,
        bucket70,
        bucketBelow70
      }
    };
  }, [trainees]);

  const handleToggleSort = (key: 'completion' | 'score' | 'participation' | 'name') => {
    if (sortBy === key) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Cadre', 'Course', 'Module', 'Participation %', 'Completion %', 'Avg Score %', 'Final Score', 'Status', 'Last Active'];
    const rows = filteredTrainees.map(t => [
      t.id,
      `"${t.name}"`,
      t.email,
      `"${t.cadre}"`,
      `"${t.courseTitle}"`,
      `"${t.currentModule}"`,
      t.participationRate,
      t.completionRate,
      t.avgAssessmentScore,
      t.finalExamScore ?? 'N/A',
      t.status,
      `"${t.lastActive}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Trainee_Gradebook_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendCohortAlert = () => {
    addNotification({
      type: 'deadline',
      priority: 'urgent',
      title: 'Academy Milestone Reminder from Dr. Julian Hayes',
      description: `All ISS & SSS trainees are requested to submit Chapter 3 Double Deflation assessments by Friday 18:00 IST.`,
      deadlineInfo: {
        assignmentTitle: 'National Accounts Assessment Review',
        courseTitle: 'National Accounts Statistics & Supply-Use Tables',
        dueDate: 'Sep 18, 2026',
        dueInHours: 72,
        weightage: 'Mandatory iGOT Sync'
      }
    });

    setNotificationSentMessage('Cohort deadline alert dispatched to all active trainees!');
    setTimeout(() => setNotificationSentMessage(null), 3500);
  };

  const handleSendIndividualAlert = (trainee: TraineePerformanceRecord) => {
    addNotification({
      type: 'peer',
      priority: 'high',
      title: `Mentor Feedback Dispatched to ${trainee.name}`,
      description: `Dr. Julian Hayes issued targeted study recommendations for ${trainee.currentModule}.`,
      peerInfo: {
        peerName: trainee.name,
        peerAvatar: trainee.avatar,
        peerRole: trainee.cadre,
        interactionType: 'endorsement',
        targetTopic: trainee.courseTitle,
        snippet: `Please review item response rationale for the last assessment to improve your score.`
      }
    });

    setNotificationSentMessage(`Direct feedback notification sent to ${trainee.name}`);
    setTimeout(() => setNotificationSentMessage(null), 3000);
  };

  const getStatusBadgeClass = (status: TraineePerformanceStatus) => {
    switch (status) {
      case 'Proficient':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'On Track':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
      case 'Needs Attention':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'At Risk':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Header & Cohort Broadcast */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              Module 3: Trainee Performance Tracker
            </span>
            <span className="text-zinc-500 text-xs font-mono">ISS & SSS National Roster</span>
          </div>
          <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white tracking-tight">
            Trainee Participation & Assessment Score Distribution
          </h2>
          <p className="text-sm text-zinc-400 max-w-3xl mt-1">
            Monitor real-time participation metrics, syllabus completion trajectories, and assessment score distributions. Intervene early with targeted mentoring for civil service scholars.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-xs font-semibold text-zinc-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#40e3bd]" />
            <span>Export Gradebook (CSV)</span>
          </button>

          <button
            onClick={handleSendCohortAlert}
            className="px-4 py-2 rounded-xl bg-[#40e3bd] hover:bg-[#a3f7e2] text-[#052219] font-bold text-xs font-['Space_Grotesk'] transition-all flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Broadcast Cohort Alert</span>
          </button>
        </div>
      </div>

      {/* Success Alert Banner */}
      <AnimatePresence>
        {notificationSentMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{notificationSentMessage}</span>
            </div>
            <button onClick={() => setNotificationSentMessage(null)} className="text-emerald-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Aggregate Cohort Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-2xl bg-[#111318]/90 border border-zinc-800 shadow-md space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-mono">Scholars Monitored</span>
            <Users className="w-4 h-4 text-[#40e3bd]" />
          </div>
          <p className="text-2xl font-bold font-['Space_Grotesk'] text-white">
            {analytics.total} Officers
          </p>
          <p className="text-[11px] text-zinc-500 font-mono">
            {analytics.proficientCount} proficient • 100% ISS/SSS active
          </p>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-2xl bg-[#111318]/90 border border-zinc-800 shadow-md space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-mono">Mean Completion Rate</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold font-['Space_Grotesk'] text-white">
            {analytics.avgCompletion}%
          </p>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-1">
            <div 
              className="bg-gradient-to-r from-[#40e3bd] to-[#22d3ee] h-full rounded-full"
              style={{ width: `${analytics.avgCompletion}%` }}
            />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-2xl bg-[#111318]/90 border border-zinc-800 shadow-md space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-mono">Average Assessment Score</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold font-['Space_Grotesk'] text-white">
            {analytics.avgScore}%
          </p>
          <p className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            +4.2% higher than Q2 cohort baseline
          </p>
        </div>

        {/* Metric 4: Score Distribution Mini Histogram */}
        <div className="p-4 rounded-2xl bg-[#111318]/90 border border-zinc-800 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-mono">Score Distribution</span>
            <BarChart3 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-end gap-1.5 h-8 pt-1">
            <div 
              className="flex-1 bg-emerald-500 rounded-t"
              style={{ height: `${Math.max(15, (analytics.distribution.bucket90 / analytics.total) * 100)}%` }}
              title={`90-100%: ${analytics.distribution.bucket90} trainees`}
            />
            <div 
              className="flex-1 bg-cyan-500 rounded-t"
              style={{ height: `${Math.max(15, (analytics.distribution.bucket80 / analytics.total) * 100)}%` }}
              title={`80-89%: ${analytics.distribution.bucket80} trainees`}
            />
            <div 
              className="flex-1 bg-amber-500 rounded-t"
              style={{ height: `${Math.max(15, (analytics.distribution.bucket70 / analytics.total) * 100)}%` }}
              title={`70-79%: ${analytics.distribution.bucket70} trainees`}
            />
            <div 
              className="flex-1 bg-rose-500 rounded-t"
              style={{ height: `${Math.max(15, (analytics.distribution.bucketBelow70 / analytics.total) * 100)}%` }}
              title={`<70%: ${analytics.distribution.bucketBelow70} trainees`}
            />
          </div>
          <div className="flex justify-between text-[9px] font-mono text-zinc-500">
            <span>&gt;90%</span>
            <span>80s</span>
            <span>70s</span>
            <span>&lt;70%</span>
          </div>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-4 rounded-2xl bg-[#111318]/90 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by officer name, cadre, or email..."
            className="w-full text-xs bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#40e3bd]"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-300 focus:outline-none focus:border-[#40e3bd]"
          >
            <option value="all">All Statuses</option>
            <option value="Proficient">Proficient</option>
            <option value="On Track">On Track</option>
            <option value="Needs Attention">Needs Attention</option>
            <option value="At Risk">At Risk</option>
          </select>

          {/* Course Filter */}
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="text-xs bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-300 focus:outline-none focus:border-[#40e3bd] max-w-[220px] truncate"
          >
            <option value="all">All Courses</option>
            {uniqueCourses.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Performance Data Table */}
      <div className="rounded-2xl bg-[#111318]/90 border border-zinc-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/60 text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4 font-semibold">Trainee / Cadre</th>
                <th className="py-3.5 px-4 font-semibold">Course & Current Module</th>
                <th 
                  className="py-3.5 px-4 font-semibold cursor-pointer hover:text-white"
                  onClick={() => handleToggleSort('participation')}
                >
                  <div className="flex items-center gap-1">
                    <span>Participation</span>
                    <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                  </div>
                </th>
                <th 
                  className="py-3.5 px-4 font-semibold cursor-pointer hover:text-white"
                  onClick={() => handleToggleSort('completion')}
                >
                  <div className="flex items-center gap-1">
                    <span>Completion</span>
                    <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                  </div>
                </th>
                <th 
                  className="py-3.5 px-4 font-semibold cursor-pointer hover:text-white"
                  onClick={() => handleToggleSort('score')}
                >
                  <div className="flex items-center gap-1">
                    <span>Assessment Scores</span>
                    <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                  </div>
                </th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#40e3bd]">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 border-2 border-[#40e3bd] border-t-transparent rounded-full animate-spin" />
                      <span className="font-mono">Streaming cohort assessment telemetry from Firestore...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredTrainees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500">
                    No trainee records match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredTrainees.map((t) => (
                  <tr 
                    key={t.id}
                    className="hover:bg-zinc-900/50 transition-colors"
                  >
                    {/* Trainee Identity */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={t.avatar}
                          alt={t.name}
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded-xl object-cover border border-zinc-700 shrink-0"
                        />
                        <div className="space-y-0.5">
                          <p className="font-bold text-white text-xs hover:text-[#40e3bd] transition-colors cursor-pointer" onClick={() => setSelectedTrainee(t)}>
                            {t.name}
                          </p>
                          <p className="text-[11px] text-zinc-400 truncate max-w-[180px]">
                            {t.cadre}
                          </p>
                          <span className="text-[10px] font-mono text-zinc-500">
                            {t.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Course & Module */}
                    <td className="py-3.5 px-4 max-w-[220px]">
                      <p className="font-semibold text-zinc-200 text-xs truncate" title={t.courseTitle}>
                        {t.courseTitle}
                      </p>
                      <p className="text-[11px] text-[#40e3bd] font-mono truncate mt-0.5" title={t.currentModule}>
                        {t.currentModule}
                      </p>
                      <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                        Active: {t.lastActive}
                      </p>
                    </td>

                    {/* Participation Rate */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-mono font-bold">
                          <span className={t.participationRate >= 80 ? 'text-emerald-400' : t.participationRate >= 60 ? 'text-amber-400' : 'text-rose-400'}>
                            {t.participationRate}%
                          </span>
                        </div>
                        <div className="w-20 bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${t.participationRate >= 80 ? 'bg-emerald-500' : t.participationRate >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
                            style={{ width: `${t.participationRate}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Completion Rate */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <span className="text-xs font-mono font-bold text-white">
                          {t.completionRate}%
                        </span>
                        <div className="w-24 bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-[#40e3bd] to-[#22d3ee] h-full rounded-full"
                            style={{ width: `${t.completionRate}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Assessment Score Distribution */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                            t.avgAssessmentScore >= 85 
                              ? 'bg-emerald-500/20 text-emerald-300' 
                              : t.avgAssessmentScore >= 70 
                              ? 'bg-cyan-500/20 text-cyan-300' 
                              : 'bg-rose-500/20 text-rose-300'
                          }`}>
                            Avg: {t.avgAssessmentScore}%
                          </span>
                          {t.finalExamScore && (
                            <span className="text-[11px] font-mono text-zinc-400">
                              Final: <strong className="text-white">{t.finalExamScore}%</strong>
                            </span>
                          )}
                        </div>

                        {/* Recent score distribution pills */}
                        <div className="flex items-center gap-1">
                          {t.scoreDistribution.map((sc, i) => (
                            <span 
                              key={i} 
                              className={`text-[9px] font-mono px-1 py-0.2 rounded ${
                                sc >= 85 ? 'bg-emerald-500/15 text-emerald-400' : sc >= 70 ? 'bg-zinc-800 text-zinc-300' : 'bg-rose-500/15 text-rose-400'
                              }`}
                              title={`Quiz #${i + 1}: ${sc}%`}
                            >
                              {sc}%
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold border ${getStatusBadgeClass(t.status)}`}>
                        {t.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedTrainee(t)}
                          className="p-1.5 rounded-lg bg-zinc-900 hover:bg-[#40e3bd]/20 border border-zinc-800 hover:border-[#40e3bd]/50 text-zinc-300 hover:text-[#40e3bd] transition-colors cursor-pointer"
                          title="View Trainee Dossier"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleSendIndividualAlert(t)}
                          className="p-1.5 rounded-lg bg-zinc-900 hover:bg-cyan-500/20 border border-zinc-800 hover:border-cyan-500/50 text-zinc-400 hover:text-cyan-300 transition-colors cursor-pointer"
                          title="Dispatch Mentor Feedback"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trainee Dossier Modal */}
      <AnimatePresence>
        {selectedTrainee && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl rounded-2xl bg-[#111318] border border-zinc-800 p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-start justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedTrainee.avatar}
                    alt={selectedTrainee.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-2xl object-cover border border-[#40e3bd]/40"
                  />
                  <div>
                    <h3 className="text-base font-bold font-['Space_Grotesk'] text-white">
                      {selectedTrainee.name}
                    </h3>
                    <p className="text-xs text-zinc-400">{selectedTrainee.cadre}</p>
                    <p className="text-[11px] font-mono text-[#40e3bd]">{selectedTrainee.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTrainee(null)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Summary */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block">Participation</span>
                  <span className="text-base font-bold font-['Space_Grotesk'] text-white">{selectedTrainee.participationRate}%</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block">Completion</span>
                  <span className="text-base font-bold font-['Space_Grotesk'] text-[#40e3bd]">{selectedTrainee.completionRate}%</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block">Mean Score</span>
                  <span className="text-base font-bold font-['Space_Grotesk'] text-white">{selectedTrainee.avgAssessmentScore}%</span>
                </div>
              </div>

              {/* Active Course & Module Details */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">Enrolled Track:</span>
                  <span className="text-white font-semibold">{selectedTrainee.courseTitle}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">Current Chapter:</span>
                  <span className="text-[#40e3bd] font-semibold">{selectedTrainee.currentModule}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">Evaluation Status:</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] ${getStatusBadgeClass(selectedTrainee.status)}`}>
                    {selectedTrainee.status}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => {
                    handleSendIndividualAlert(selectedTrainee);
                    setSelectedTrainee(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#40e3bd] hover:bg-[#a3f7e2] text-[#052219] font-bold text-xs font-['Space_Grotesk'] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Personal Feedback</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
