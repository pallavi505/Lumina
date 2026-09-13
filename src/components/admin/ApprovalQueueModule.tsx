import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UserCheck, 
  UserX, 
  Search, 
  Filter, 
  FileText, 
  Building2, 
  Mail, 
  Award, 
  Check, 
  Eye, 
  AlertCircle, 
  Download,
  Users,
  GraduationCap,
  History
} from 'lucide-react';
import type { PendingRegistrationRequest } from '../../data/adminData';
import TraineeProfileModal from './TraineeProfileModal';

interface ApprovalQueueModuleProps {
  requests: PendingRegistrationRequest[];
  isLoading?: boolean;
  onApprove: (id: string, customTier?: string) => void;
  onReject: (id: string, reason: string) => void;
  onApproveAllVerified?: () => void;
}

export default function ApprovalQueueModule({
  requests,
  isLoading = false,
  onApprove,
  onReject,
  onApproveAllVerified
}: ApprovalQueueModuleProps) {
  const [activeTab, setActiveTab] = useState<'trainees' | 'trainers' | 'history'>('trainees');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [previewRequest, setPreviewRequest] = useState<PendingRegistrationRequest | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Compute counts
  const pendingTrainees = useMemo(() => 
    requests.filter(r => r.type === 'trainee' && r.status === 'pending'), 
    [requests]
  );
  const pendingTrainers = useMemo(() => 
    requests.filter(r => r.type === 'trainer' && r.status === 'pending'), 
    [requests]
  );
  const historyList = useMemo(() => 
    requests.filter(r => r.status !== 'pending'), 
    [requests]
  );

  // Filter current list
  const currentList = useMemo(() => {
    let baseList: PendingRegistrationRequest[] = [];
    if (activeTab === 'trainees') baseList = pendingTrainees;
    else if (activeTab === 'trainers') baseList = pendingTrainers;
    else baseList = historyList;

    return baseList.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.cadre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.department.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDept = filterDepartment === 'all' || item.department.toLowerCase().includes(filterDepartment.toLowerCase());

      return matchesSearch && matchesDept;
    });
  }, [activeTab, pendingTrainees, pendingTrainers, historyList, searchQuery, filterDepartment]);

  const handleQuickApprove = (id: string) => {
    onApprove(id);
    setActionNotice('Registration request approved successfully. Notification & credential dispatched.');
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleQuickReject = (id: string) => {
    onReject(id, 'Official documentation review flagged discrepancies or required supervisor sign-off.');
    setActionNotice('Application declined. Candidate informed via official dispatch.');
    setTimeout(() => setActionNotice(null), 3500);
  };

  const exportQueueCSV = () => {
    const headers = ['Request ID', 'Type', 'Name', 'Email', 'Cadre', 'Department', 'Employee ID', 'Tier', 'Status'];
    const rows = requests.map(r => [
      r.id,
      r.type,
      `"${r.name}"`,
      r.email,
      `"${r.cadre}"`,
      `"${r.department}"`,
      r.employeeId,
      `"${r.requestedAccessTier}"`,
      r.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `lumina_approval_queue_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {actionNotice && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 rounded-xl bg-[#092b21] border border-[#40e3bd]/50 text-xs font-semibold text-[#40e3bd] flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{actionNotice}</span>
            </div>
            <button onClick={() => setActionNotice(null)} className="text-zinc-400 hover:text-white text-xs">
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Controls & Tab Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div className="flex items-center gap-2 p-1 bg-zinc-900/90 rounded-xl border border-zinc-800">
          <button
            id="tab-pending-trainees"
            onClick={() => setActiveTab('trainees')}
            className={`px-4 py-2 rounded-lg text-xs font-bold font-['Space_Grotesk'] flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'trainees'
                ? 'bg-gradient-to-r from-[#40e3bd] to-[#20b892] text-[#052219] shadow-md shadow-[#40e3bd]/20'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Trainee Requests</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              activeTab === 'trainees' ? 'bg-[#052219] text-[#40e3bd]' : 'bg-zinc-800 text-zinc-300'
            }`}>
              {pendingTrainees.length}
            </span>
          </button>

          <button
            id="tab-pending-trainers"
            onClick={() => setActiveTab('trainers')}
            className={`px-4 py-2 rounded-lg text-xs font-bold font-['Space_Grotesk'] flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'trainers'
                ? 'bg-gradient-to-r from-[#40e3bd] to-[#20b892] text-[#052219] shadow-md shadow-[#40e3bd]/20'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Trainer Requests</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              activeTab === 'trainers' ? 'bg-[#052219] text-[#40e3bd]' : 'bg-zinc-800 text-zinc-300'
            }`}>
              {pendingTrainers.length}
            </span>
          </button>

          <button
            id="tab-approval-history"
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg text-xs font-bold font-['Space_Grotesk'] flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-[#40e3bd] to-[#20b892] text-[#052219] shadow-md shadow-[#40e3bd]/20'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit History</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              activeTab === 'history' ? 'bg-[#052219] text-[#40e3bd]' : 'bg-zinc-800 text-zinc-300'
            }`}>
              {historyList.length}
            </span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {activeTab !== 'history' && (
            <button
              onClick={onApproveAllVerified}
              className="px-3 py-1.5 rounded-xl bg-[#40e3bd]/10 hover:bg-[#40e3bd]/20 border border-[#40e3bd]/30 text-xs font-semibold text-[#40e3bd] flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Batch-approve all applications with verified NIC domains and Digilocker credentials"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Approve All Verified</span>
            </button>
          )}

          <button
            onClick={exportQueueCSV}
            className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Download CSV report of registration requests"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, cadre, ID, or dept..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#40e3bd]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-zinc-500 hidden sm:inline" />
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-3 py-2 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-[#40e3bd] w-full sm:w-auto"
          >
            <option value="all">All Departments</option>
            <option value="National Accounts">National Accounts Division (NAD)</option>
            <option value="Field Operations">Field Operations (FOD - NSSO)</option>
            <option value="Price Statistics">Price Statistics Division (PSD)</option>
            <option value="Data Informatics">Data Informatics & Innovation (DIID)</option>
            <option value="Directorate of Economics">State DES Directorates</option>
            <option value="ISI">Indian Statistical Institute</option>
          </select>
        </div>
      </div>

      {/* Cards List */}
      {isLoading ? (
        <div className="p-12 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-4">
          <div className="w-10 h-10 border-2 border-[#40e3bd] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-[#40e3bd]">
            Syncing live accreditation queue from Firestore...
          </p>
        </div>
      ) : currentList.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-zinc-800/60 border border-zinc-700/60 text-zinc-400 flex items-center justify-center mx-auto">
            <Check className="w-6 h-6 text-[#40e3bd]" />
          </div>
          <h4 className="text-sm font-bold text-white font-['Space_Grotesk']">
            No Requests Found
          </h4>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            {activeTab === 'history' 
              ? 'No reviewed applications in current filter.' 
              : 'All incoming officer applications for this cadre have been evaluated.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {currentList.map((req) => (
            <motion.div
              key={req.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800/90 hover:border-[#40e3bd]/40 transition-all shadow-sm"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Officer Dossier Summary */}
                <div className="flex items-start gap-3.5">
                  <div className="relative shrink-0">
                    <img
                      src={req.avatar}
                      alt={req.name}
                      referrerPolicy="no-referrer"
                      className="w-13 h-13 rounded-xl object-cover border border-[#40e3bd]/40 shadow-sm"
                    />
                    <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-zinc-900 border border-[#40e3bd]/50">
                      {req.type === 'trainer' ? (
                        <Award className="w-3 h-3 text-[#40e3bd]" />
                      ) : (
                        <Users className="w-3 h-3 text-[#40e3bd]" />
                      )}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-white font-['Space_Grotesk']">
                        {req.name}
                      </h4>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#40e3bd]/10 text-[#40e3bd] border border-[#40e3bd]/30">
                        {req.cadre}
                      </span>
                      {req.govEmailVerified && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" /> Gov.in Email
                        </span>
                      )}
                      <span className="text-[11px] font-mono text-zinc-500">
                        ID: {req.employeeId}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-zinc-400 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-zinc-500" />
                        {req.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-zinc-500" />
                        {req.email}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-300 line-clamp-2 pt-1 font-sans italic">
                      "{req.statementOfIntent}"
                    </p>

                    {/* Metadata tags */}
                    <div className="flex items-center gap-3 pt-1 text-[11px] text-zinc-400 flex-wrap">
                      <span className="text-zinc-500">Tier: <strong className="text-zinc-200">{req.requestedAccessTier}</strong></span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-zinc-400">
                        <FileText className="w-3 h-3 text-[#40e3bd]" />
                        {req.documents.length} Docs Attached ({req.documents.map(d => d.type).join(', ')})
                      </span>
                      {req.recommendationBy && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-400/90 truncate max-w-xs">
                            Rec: {req.recommendationBy}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="flex items-center gap-2 shrink-0 self-end lg:self-center pt-2 lg:pt-0 border-t lg:border-t-0 border-zinc-800 w-full lg:w-auto justify-between lg:justify-end">
                  <button
                    onClick={() => setPreviewRequest(req)}
                    className="px-3 py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/60 text-xs font-semibold text-zinc-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#40e3bd]" />
                    <span>View Dossier</span>
                  </button>

                  {req.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleQuickReject(req.id)}
                        className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-semibold text-rose-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Decline registration request"
                      >
                        <UserX className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>

                      <button
                        onClick={() => handleQuickApprove(req.id)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#40e3bd] to-[#20b892] hover:from-[#5ef8d5] text-[#052219] text-xs font-bold font-['Space_Grotesk'] flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-medium">
                      {req.status === 'approved' ? (
                        <span className="text-emerald-400 bg-emerald-500/10 border-emerald-500/20 flex items-center gap-1 px-2 py-0.5 rounded">
                          <Check className="w-3 h-3" /> Approved
                        </span>
                      ) : (
                        <span className="text-rose-400 bg-rose-500/10 border-rose-500/20 flex items-center gap-1 px-2 py-0.5 rounded">
                          <AlertCircle className="w-3 h-3" /> Rejected
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Trainee / Trainer Profile Slide-over Modal */}
      <TraineeProfileModal
        request={previewRequest}
        isOpen={!!previewRequest}
        onClose={() => setPreviewRequest(null)}
        onApprove={onApprove}
        onReject={onReject}
      />
    </div>
  );
}
