import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Award, 
  AlertTriangle, 
  Layers, 
  Filter, 
  Send, 
  Sparkles,
  CheckCircle2,
  Info,
  ChevronRight,
  X
} from 'lucide-react';
import { 
  SEED_COURSE_ENROLLMENT_ANALYTICS, 
  SEED_DOMAIN_COMPETENCY_ANALYTICS,
  SEED_SKILL_GAP_HEATMAP,
  STATISTICAL_DEPARTMENTS,
  SKILL_DOMAINS,
  type SkillGapCell
} from '../../data/adminData';

interface SystemCapacityAnalyticsProps {
  onDispatchCurriculumAlert?: (courseName: string, department: string) => void;
}

export default function SystemCapacityAnalytics({
  onDispatchCurriculumAlert
}: SystemCapacityAnalyticsProps) {
  const [selectedCell, setSelectedCell] = useState<SkillGapCell | null>(null);
  const [heatmapMetric, setHeatmapMetric] = useState<'percentage' | 'personnel'>('percentage');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [alertSuccess, setAlertSuccess] = useState<string | null>(null);

  // Filtered heatmap departments
  const filteredDepartments = useMemo(() => {
    if (departmentFilter === 'all') return STATISTICAL_DEPARTMENTS;
    return STATISTICAL_DEPARTMENTS.filter(d => d.id === departmentFilter);
  }, [departmentFilter]);

  // Skill gap matrix lookup helper
  const getCellData = (deptCode: string, skillId: string): SkillGapCell | undefined => {
    return SEED_SKILL_GAP_HEATMAP.find(
      c => c.department === deptCode && c.skillDomain === skillId
    );
  };

  // Color generator for heatmap cell
  const getCellColor = (gap: number) => {
    if (gap < 20) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30';
    if (gap <= 35) return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/30';
    if (gap <= 50) return 'bg-amber-500/25 text-amber-300 border-amber-500/40 hover:bg-amber-500/35';
    return 'bg-rose-500/30 text-rose-300 border-rose-500/50 hover:bg-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.15)]';
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'Critical':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      case 'High':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'Moderate':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  const handleTriggerIntervention = (cell: SkillGapCell) => {
    if (onDispatchCurriculumAlert) {
      onDispatchCurriculumAlert(cell.recommendedCourse, cell.department);
    }
    setAlertSuccess(`Targeted curriculum alert for "${cell.recommendedCourse}" dispatched to ${cell.department} officers.`);
    setTimeout(() => setAlertSuccess(null), 4000);
  };

  return (
    <div className="space-y-8">
      {/* Top Level KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-[#40e3bd]/40 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Total Academy Learners</span>
            <div className="p-2 rounded-xl bg-[#40e3bd]/10 text-[#40e3bd]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-['Space_Grotesk'] text-white mt-2">
            48,250<span className="text-sm font-normal text-zinc-500 ml-1">Officers</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium mt-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14.2% MoM growth across 36 States/UTs</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-cyan-500/40 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Active Concurrent Concurrency</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-['Space_Grotesk'] text-white mt-2">
            19,530<span className="text-sm font-normal text-zinc-500 ml-1">Daily Active</span>
          </div>
          <div className="text-[11px] text-zinc-400 mt-1.5 font-mono">
            68% Cloud Sandbox Capacity Utilized
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-purple-500/40 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">iGOT Credentials Awarded</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-['Space_Grotesk'] text-white mt-2">
            12,870<span className="text-sm font-normal text-zinc-500 ml-1">Verifiable</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#40e3bd] mt-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% Karmayogi Standard Compliant</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-amber-500/40 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">System Skill Gap Index</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-['Space_Grotesk'] text-white mt-2">
            24.8%<span className="text-xs font-normal text-emerald-400 ml-2">↓ -6.4% YTD</span>
          </div>
          <div className="text-[11px] text-zinc-400 mt-1.5">
            Targeting &lt;15% before Dec 2026 census
          </div>
        </div>
      </div>

      {/* Success alert banner */}
      <AnimatePresence>
        {alertSuccess && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-xs text-emerald-300 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{alertSuccess}</span>
            </div>
            <button onClick={() => setAlertSuccess(null)} className="text-zinc-400 hover:text-white text-xs">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recharts Section: Two Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Course Enrollments & Active Concurrency */}
        <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
                <BarChart className="w-4 h-4 text-[#40e3bd]" />
                Course Enrollments & Active Concurrency
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Distribution of learners across major national statistical tracks
              </p>
            </div>
            <span className="text-[11px] font-mono text-[#40e3bd] bg-[#40e3bd]/10 px-2 py-0.5 rounded border border-[#40e3bd]/30">
              Live Telemetry
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={SEED_COURSE_ENROLLMENT_ANALYTICS}
                margin={{ top: 10, right: 10, left: -10, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis 
                  dataKey="shortName" 
                  stroke="#71717a" 
                  fontSize={10} 
                  tickLine={false}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3 bg-zinc-950/95 border border-zinc-700 rounded-xl shadow-xl text-xs space-y-1.5">
                          <div className="font-bold text-white font-['Space_Grotesk']">{data.course}</div>
                          <div className="text-emerald-400 flex justify-between gap-4">
                            <span>Total Enrolled:</span>
                            <strong className="font-mono">{data.enrolled.toLocaleString()}</strong>
                          </div>
                          <div className="text-cyan-400 flex justify-between gap-4">
                            <span>Active This Week:</span>
                            <strong className="font-mono">{data.active.toLocaleString()}</strong>
                          </div>
                          <div className="text-purple-400 flex justify-between gap-4">
                            <span>Certified Completers:</span>
                            <strong className="font-mono">{data.certified.toLocaleString()}</strong>
                          </div>
                          <div className="text-zinc-400 border-t border-zinc-800 pt-1 text-[10px] flex justify-between">
                            <span>Completion Rate:</span>
                            <span className="text-[#40e3bd] font-bold">{data.completionRate}%</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  iconSize={10}
                />
                <Bar dataKey="enrolled" name="Total Enrolled" fill="#40e3bd" radius={[4, 4, 0, 0]} />
                <Bar dataKey="active" name="Active This Week" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="certified" name="Certified Completers" fill="#818cf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Domain-Wise Competency Distribution */}
        <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Domain-Wise Competency Distribution
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Assessed officer proficiency levels across core subject domains
              </p>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
              iGOT Matrix
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={SEED_DOMAIN_COMPETENCY_ANALYTICS}
                margin={{ top: 10, right: 10, left: -10, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis 
                  dataKey="domain" 
                  stroke="#71717a" 
                  fontSize={10} 
                  tickLine={false}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3 bg-zinc-950/95 border border-zinc-700 rounded-xl shadow-xl text-xs space-y-1.5">
                          <div className="font-bold text-white font-['Space_Grotesk']">{data.domain}</div>
                          <div className="text-[#40e3bd] flex justify-between gap-4">
                            <span>Master / Expert Tier:</span>
                            <strong className="font-mono">{data.certifiedMaster.toLocaleString()}</strong>
                          </div>
                          <div className="text-sky-400 flex justify-between gap-4">
                            <span>Intermediate Proficient:</span>
                            <strong className="font-mono">{data.intermediateProficient.toLocaleString()}</strong>
                          </div>
                          <div className="text-amber-400 flex justify-between gap-4">
                            <span>Foundational / Developing:</span>
                            <strong className="font-mono">{data.foundationalDeveloping.toLocaleString()}</strong>
                          </div>
                          <div className="text-zinc-400 border-t border-zinc-800 pt-1 text-[10px] flex justify-between">
                            <span>Total Officers Tested:</span>
                            <span className="text-white font-mono font-bold">{data.totalAssessed.toLocaleString()}</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  iconSize={10}
                />
                <Bar dataKey="certifiedMaster" name="Master / Expert" stackId="a" fill="#40e3bd" />
                <Bar dataKey="intermediateProficient" name="Intermediate Proficient" stackId="a" fill="#38bdf8" />
                <Bar dataKey="foundationalDeveloping" name="Foundational / Developing" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Statistical System Skill Gap Heatmap */}
      <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-6">
        {/* Heatmap Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
                Statistical System Skill Gap Heatmap
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/30">
                Departmental Deficit Matrix
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Cross-tabulation of competency deficits across MoSPI Directorates and State statistical agencies. Click any cell to inspect root causes and dispatch targeted curriculum.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
            {/* Metric Mode Switcher */}
            <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs font-semibold">
              <button
                onClick={() => setHeatmapMetric('percentage')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  heatmapMetric === 'percentage' 
                    ? 'bg-[#40e3bd] text-[#052219]' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                % Deficit Gap
              </button>
              <button
                onClick={() => setHeatmapMetric('personnel')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  heatmapMetric === 'personnel' 
                    ? 'bg-[#40e3bd] text-[#052219]' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Personnel Count
              </button>
            </div>

            {/* Department Filter */}
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-[#40e3bd]"
            >
              <option value="all">All 7 Directorates</option>
              {STATISTICAL_DEPARTMENTS.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between flex-wrap gap-3 text-xs text-zinc-400 pt-1">
          <span className="font-semibold text-zinc-300">Competency Deficit Scale:</span>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500/40 border border-emerald-500/60 inline-block" />
              <span>&lt;20% Low Gap (Optimal)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-cyan-500/40 border border-cyan-500/60 inline-block" />
              <span>20% - 35% Moderate</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-500/50 border border-amber-500/70 inline-block" />
              <span>35% - 50% High Deficit</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-rose-500/60 border border-rose-500/80 inline-block" />
              <span>&gt;50% Critical Deficit</span>
            </span>
          </div>
        </div>

        {/* Heatmap Grid Container */}
        <div className="overflow-x-auto pb-2">
          <table className="w-full border-collapse text-left min-w-[720px]">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="p-3 text-xs font-bold font-['Space_Grotesk'] text-zinc-400 uppercase tracking-wider w-48 bg-zinc-950/40 rounded-tl-xl">
                  Directorate / Cadre
                </th>
                {SKILL_DOMAINS.map((domain) => (
                  <th
                    key={domain.id}
                    className="p-3 text-center text-xs font-bold font-['Space_Grotesk'] text-zinc-300 uppercase tracking-wider bg-zinc-950/40"
                  >
                    <div>{domain.name}</div>
                    <div className="text-[10px] text-zinc-500 normal-case font-normal">{domain.category}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.map((dept) => (
                <tr key={dept.id} className="border-b border-zinc-800/60 hover:bg-zinc-800/20 transition-colors">
                  <td className="p-3 text-xs font-semibold text-white whitespace-nowrap bg-zinc-950/20">
                    <div className="font-['Space_Grotesk']">{dept.name}</div>
                    <div className="text-[10px] font-mono text-zinc-500">{dept.code} System Unit</div>
                  </td>

                  {SKILL_DOMAINS.map((domain) => {
                    const cell = getCellData(dept.id, domain.id);
                    if (!cell) return <td key={domain.id} className="p-2 text-center text-zinc-600">-</td>;

                    const isSelected = selectedCell?.department === dept.id && selectedCell?.skillDomain === domain.id;

                    return (
                      <td key={domain.id} className="p-2 text-center">
                        <button
                          onClick={() => setSelectedCell(cell)}
                          className={`w-full py-2.5 px-2 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer flex flex-col items-center justify-center ${
                            getCellColor(cell.gapPercentage)
                          } ${isSelected ? 'ring-2 ring-white scale-105 z-10' : ''}`}
                        >
                          <span>
                            {heatmapMetric === 'percentage' 
                              ? `${cell.gapPercentage}%` 
                              : `${cell.personnelAffected} Off.`}
                          </span>
                          <span className="text-[9px] font-sans font-normal opacity-75">
                            {cell.urgency}
                          </span>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Heatmap Drilldown & Action Card */}
        <AnimatePresence>
          {selectedCell && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="p-5 rounded-2xl bg-gradient-to-r from-[#0d231c] via-[#091512] to-[#0d231c] border border-[#40e3bd]/40 space-y-4 shadow-xl shadow-black/60"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#40e3bd]/15 text-[#40e3bd] border border-[#40e3bd]/30">
                      {selectedCell.department} Directorate
                    </span>
                    <span className="text-zinc-400">×</span>
                    <span className="text-sm font-bold text-white font-['Space_Grotesk']">
                      {SKILL_DOMAINS.find(s => s.id === selectedCell.skillDomain)?.name || selectedCell.skillDomain}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getUrgencyBadge(selectedCell.urgency)}`}>
                      {selectedCell.urgency} Priority Deficit
                    </span>
                  </div>
                  <div className="text-xs text-zinc-300 mt-1 flex items-center gap-4">
                    <span>Deficit Gap: <strong className="text-rose-400 font-mono text-sm">{selectedCell.gapPercentage}%</strong></span>
                    <span>•</span>
                    <span>Officers Needing Training: <strong className="text-white font-mono text-sm">{selectedCell.personnelAffected} Personnel</strong></span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCell(null)}
                  className="p-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Analysis & Root Cause */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-zinc-800 text-xs space-y-1">
                <div className="text-[11px] text-[#40e3bd] font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  Root Cause Diagnostics
                </div>
                <p className="text-zinc-300 font-sans leading-relaxed">
                  {selectedCell.rootCause}
                </p>
              </div>

              {/* Recommended Course & Dispatch Action */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#40e3bd]/10 border border-[#40e3bd]/30">
                <div className="space-y-0.5">
                  <div className="text-[11px] text-zinc-400 font-medium">Recommended Intervention Curriculum:</div>
                  <div className="text-xs font-bold text-[#40e3bd] font-['Space_Grotesk']">
                    {selectedCell.recommendedCourse}
                  </div>
                </div>

                <button
                  onClick={() => handleTriggerIntervention(selectedCell)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#40e3bd] to-[#20b892] hover:from-[#5ef8d5] text-[#052219] text-xs font-bold font-['Space_Grotesk'] flex items-center gap-1.5 transition-all shadow-md cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Targeted Curriculum Notice</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
