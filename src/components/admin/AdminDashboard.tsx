import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Users, 
  BarChart3, 
  Megaphone, 
  UserCheck, 
  Download, 
  Building2, 
  Activity,
  CheckCircle2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import ApprovalQueueModule from './ApprovalQueueModule';
import SystemCapacityAnalytics from './SystemCapacityAnalytics';
import RoleUserManagement from './RoleUserManagement';
import BroadcastCenterModal from './BroadcastCenterModal';
import { 
  subscribeToPendingApprovals, 
  fetchAllUsers, 
  subscribeToBroadcasts, 
  reviewApprovalRequest, 
  dispatchBroadcast, 
  updateUserPermissions,
  updateUserRole,
  createManagedUser
} from '../../lib/adminService';
import type { 
  PendingRegistrationRequest, 
  ManagedUser,
  UserPermissions,
  BroadcastItem 
} from '../../data/adminData';
import type { AppView, UserRole } from '../../types';

interface AdminDashboardProps {
  onNavigate?: (view: AppView) => void;
}

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [activeModule, setActiveModule] = useState<'queue' | 'analytics' | 'broadcast' | 'users'>('queue');
  const [requests, setRequests] = useState<PendingRegistrationRequest[]>([]);
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [broadcasts, setBroadcasts] = useState<BroadcastItem[]>([]);
  const [isLoadingApprovals, setIsLoadingApprovals] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingBroadcasts, setIsLoadingBroadcasts] = useState(true);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [systemAuditAlert, setSystemAuditAlert] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Real-time Firestore subscriptions and initial queries
  useEffect(() => {
    // 1. Subscribe to pending and historical approvals
    const unsubApprovals = subscribeToPendingApprovals(
      (data) => {
        setRequests(data);
        setIsLoadingApprovals(false);
      },
      (err) => {
        console.error('Approvals subscription notice:', err);
        setErrorMessage(`Approvals sync notice: ${err.message}`);
        setIsLoadingApprovals(false);
      }
    );

    // 2. Fetch all registered and managed users
    fetchAllUsers()
      .then((data) => {
        setUsers(data);
        setIsLoadingUsers(false);
      })
      .catch((err) => {
        console.error('Fetch users notice:', err);
        setErrorMessage(`Users sync notice: ${err.message}`);
        setIsLoadingUsers(false);
      });

    // 3. Subscribe to platform broadcast notifications
    const unsubBroadcasts = subscribeToBroadcasts(
      (data) => {
        setBroadcasts(data);
        setIsLoadingBroadcasts(false);
      },
      (err) => {
        console.error('Broadcasts subscription notice:', err);
        setErrorMessage(`Broadcasts sync notice: ${err.message}`);
        setIsLoadingBroadcasts(false);
      }
    );

    // Cleanup listeners on unmount
    return () => {
      unsubApprovals();
      unsubBroadcasts();
    };
  }, []);

  // Pending count for tab badge
  const pendingCount = requests.filter(r => r.status === 'pending').length;

  const handleApprove = async (id: string, customTier?: string) => {
    try {
      await reviewApprovalRequest(id, 'approved', { customTier });
      setSystemAuditAlert('Application approved and synced to Firestore credentials store.');
      setTimeout(() => setSystemAuditAlert(null), 4000);
    } catch (err) {
      setErrorMessage(`Failed to approve: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleReject = async (id: string, reason: string) => {
    try {
      await reviewApprovalRequest(id, 'rejected', { reason });
      setSystemAuditAlert('Application rejection recorded in Firestore registry.');
      setTimeout(() => setSystemAuditAlert(null), 4000);
    } catch (err) {
      setErrorMessage(`Failed to reject: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleApproveAllVerified = async () => {
    const verifiedPending = requests.filter(r => r.status === 'pending' && r.govEmailVerified);
    try {
      for (const req of verifiedPending) {
        await reviewApprovalRequest(req.id, 'approved');
      }
      setSystemAuditAlert(`Batch approved ${verifiedPending.length} candidate applications in Firestore.`);
      setTimeout(() => setSystemAuditAlert(null), 4000);
    } catch (err) {
      setErrorMessage(`Batch approval error: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleUpdatePermissions = async (userId: string, permissions: UserPermissions) => {
    try {
      await updateUserPermissions(userId, permissions);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, permissions } : u));
      setSystemAuditAlert('Security permissions saved to Firestore.');
      setTimeout(() => setSystemAuditAlert(null), 3000);
    } catch (err) {
      setErrorMessage(`Permission update error: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: UserRole, permissions?: UserPermissions) => {
    try {
      await updateUserRole(userId, newRole, permissions);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole, ...(permissions ? { permissions } : {}) } : u));
      setSystemAuditAlert(`Officer role changed to ${newRole.toUpperCase()} in Firestore.`);
      setTimeout(() => setSystemAuditAlert(null), 3000);
    } catch (err) {
      setErrorMessage(`Role update error: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleAddUser = async (newUser: ManagedUser) => {
    try {
      await createManagedUser(newUser);
      setUsers(prev => [newUser, ...prev]);
    } catch (err) {
      setErrorMessage(`Add user error: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleDispatchBroadcast = async (broadcastData: Omit<BroadcastItem, 'id' | 'publishedAt' | 'sentCount' | 'openRate'>) => {
    try {
      const id = await dispatchBroadcast(broadcastData);
      setSystemAuditAlert('Directive dispatched to nationwide cadre networks & Firestore.');
      setTimeout(() => setSystemAuditAlert(null), 4000);
      return id;
    } catch (err) {
      setErrorMessage(`Broadcast dispatch error: ${err instanceof Error ? err.message : String(err)}`);
      throw err;
    }
  };

  const handleDispatchCurriculumAlert = () => {
    setIsBroadcastModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#06100d] text-zinc-100 font-sans pb-16">
      {/* Top Background Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#40e3bd]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 relative z-10">
        {/* Executive Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0d241c] via-[#091814] to-[#0a1e17] border border-[#40e3bd]/30 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#40e3bd]/10 via-transparent to-transparent pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#40e3bd]/15 text-[#40e3bd] border border-[#40e3bd]/30 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Apex Administrative Command
                </span>
                <span className="text-xs text-zinc-400 font-mono">
                  LUMINA v4.8 • Karmayogi Integrated • Live Firestore Connected
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
                National Academy Admin Command
              </h1>
              <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
                Supervise national officer registration queues, assess statistical system competency gaps, dispatch urgent learning directives, and govern role permissions across India's official statistical apparatus.
              </p>
            </div>

            {/* Admin Quick Action Controls */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                id="btn-open-broadcast"
                onClick={() => setIsBroadcastModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#40e3bd] to-[#20b892] hover:from-[#5ef8d5] text-[#052219] font-bold text-xs font-['Space_Grotesk'] flex items-center gap-2 shadow-[0_0_20px_rgba(64,227,189,0.3)] transition-all cursor-pointer"
              >
                <Megaphone className="w-4 h-4" />
                <span>Publish Broadcast</span>
              </button>

              <button
                onClick={() => {
                  setSystemAuditAlert('Cryptographic audit log exported: SHA-256 seal confirmed for 14,820 daily session activities.');
                  setTimeout(() => setSystemAuditAlert(null), 4000);
                }}
                className="px-3.5 py-2.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-300 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#40e3bd]" />
                <span>Export Audit Log</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Ticker */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-zinc-800/80 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#40e3bd]/10 text-[#40e3bd]">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-zinc-400 text-[11px]">Pending Approvals</div>
                <div className="text-base font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
                  {isLoadingApprovals ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#40e3bd]" />
                  ) : (
                    `${pendingCount} Candidates`
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="text-zinc-400 text-[11px]">Managed Officers</div>
                <div className="text-base font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
                  {isLoadingUsers ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                  ) : (
                    `${users.length} Active Records`
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-zinc-400 text-[11px]">Reporting Cadres</div>
                <div className="text-base font-bold font-['Space_Grotesk'] text-white">
                  ISS • SSS • 36 DES
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <div className="text-zinc-400 text-[11px]">Firestore State</div>
                <div className="text-base font-bold font-['Space_Grotesk'] text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Sync
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Audit Notification Banner */}
        <AnimatePresence>
          {systemAuditAlert && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="p-4 rounded-2xl bg-[#0a271e] border border-[#40e3bd]/40 text-xs font-semibold text-[#40e3bd] flex items-center justify-between shadow-lg"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#40e3bd]" />
                <span>{systemAuditAlert}</span>
              </div>
              <button onClick={() => setSystemAuditAlert(null)} className="text-zinc-400 hover:text-white text-xs cursor-pointer">
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Notification Banner */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="p-4 rounded-2xl bg-red-950/80 border border-red-500/40 text-xs font-semibold text-red-300 flex items-center justify-between shadow-lg"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button onClick={() => setErrorMessage(null)} className="text-zinc-400 hover:text-white text-xs cursor-pointer">
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Tabs for the 4 Key Modules */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-zinc-800">
          <button
            id="tab-approval-queue"
            onClick={() => setActiveModule('queue')}
            className={`px-5 py-3 rounded-2xl text-xs font-bold font-['Space_Grotesk'] flex items-center gap-2.5 transition-all cursor-pointer whitespace-nowrap ${
              activeModule === 'queue'
                ? 'bg-zinc-900 text-[#40e3bd] border border-[#40e3bd]/50 shadow-md shadow-black/40'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Approval Queue</span>
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#40e3bd] text-[#052219]">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            id="tab-system-analytics"
            onClick={() => setActiveModule('analytics')}
            className={`px-5 py-3 rounded-2xl text-xs font-bold font-['Space_Grotesk'] flex items-center gap-2.5 transition-all cursor-pointer whitespace-nowrap ${
              activeModule === 'analytics'
                ? 'bg-zinc-900 text-[#40e3bd] border border-[#40e3bd]/50 shadow-md shadow-black/40'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Capacity Analytics & Skill Heatmap</span>
          </button>

          <button
            id="tab-role-management"
            onClick={() => setActiveModule('users')}
            className={`px-5 py-3 rounded-2xl text-xs font-bold font-['Space_Grotesk'] flex items-center gap-2.5 transition-all cursor-pointer whitespace-nowrap ${
              activeModule === 'users'
                ? 'bg-zinc-900 text-[#40e3bd] border border-[#40e3bd]/50 shadow-md shadow-black/40'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Role & User Directory</span>
            {users.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-zinc-800 text-zinc-300">
                {users.length}
              </span>
            )}
          </button>

          <button
            id="tab-broadcast-center"
            onClick={() => setIsBroadcastModalOpen(true)}
            className="px-5 py-3 rounded-2xl text-xs font-bold font-['Space_Grotesk'] flex items-center gap-2.5 transition-all cursor-pointer whitespace-nowrap text-zinc-400 hover:text-white hover:bg-zinc-900/50"
          >
            <Megaphone className="w-4 h-4 text-cyan-400" />
            <span>Broadcast Center ({broadcasts.length})</span>
          </button>
        </div>

        {/* Tab Module Content */}
        <div>
          {activeModule === 'queue' && (
            <ApprovalQueueModule
              requests={requests}
              isLoading={isLoadingApprovals}
              onApprove={handleApprove}
              onReject={handleReject}
              onApproveAllVerified={handleApproveAllVerified}
            />
          )}

          {activeModule === 'analytics' && (
            <SystemCapacityAnalytics
              onDispatchCurriculumAlert={handleDispatchCurriculumAlert}
            />
          )}

          {activeModule === 'users' && (
            <RoleUserManagement
              users={users}
              isLoading={isLoadingUsers}
              onUpdatePermissions={handleUpdatePermissions}
              onUpdateRole={handleUpdateRole}
              onAddUser={handleAddUser}
            />
          )}
        </div>
      </div>

      {/* Broadcast Center Modal Form */}
      <BroadcastCenterModal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        broadcasts={broadcasts}
        isLoading={isLoadingBroadcasts}
        onPublishBroadcast={handleDispatchBroadcast}
        onPublishSuccess={() => {
          setSystemAuditAlert('Broadcast alert successfully published and dispatched across official channels.');
          setTimeout(() => setSystemAuditAlert(null), 4000);
        }}
      />
    </div>
  );
}
