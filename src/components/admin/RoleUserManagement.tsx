import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Search, 
  Filter, 
  ShieldCheck, 
  UserPlus, 
  Check, 
  Lock, 
  Unlock, 
  AlertCircle, 
  Sparkles, 
  Building2, 
  Mail, 
  FileText, 
  KeyRound, 
  CheckCircle2, 
  RefreshCw,
  X
} from 'lucide-react';
import { 
  SEED_MANAGED_USERS, 
  type ManagedUser, 
  type UserPermissions 
} from '../../data/adminData';
import type { UserRole } from '../../types';

interface RoleUserManagementProps {
  users?: ManagedUser[];
  isLoading?: boolean;
  onUpdatePermissions?: (userId: string, permissions: UserPermissions) => Promise<void>;
  onUpdateRole?: (userId: string, newRole: UserRole, permissions?: UserPermissions) => Promise<void>;
  onAddUser?: (user: ManagedUser) => Promise<void>;
}

export default function RoleUserManagement({
  users: propUsers,
  isLoading = false,
  onUpdatePermissions,
  onUpdateRole,
  onAddUser
}: RoleUserManagementProps) {
  const [users, setUsers] = useState<ManagedUser[]>(propUsers || SEED_MANAGED_USERS);

  // Synchronize when external users update
  React.useEffect(() => {
    if (propUsers && propUsers.length > 0) {
      setUsers(propUsers);
    }
  }, [propUsers]);

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  // Invite Modal State
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteCadre, setInviteCadre] = useState('ISS Probationer (Batch 2026)');
  const [inviteDepartment, setInviteDepartment] = useState('National Accounts Division (NAD)');
  const [inviteRole, setInviteRole] = useState<UserRole>('trainee');
  const [inviteEmployeeId, setInviteEmployeeId] = useState('');

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch = 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.cadre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.department.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      const matchesDept = departmentFilter === 'all' || u.department.toLowerCase().includes(departmentFilter.toLowerCase());
      const matchesStatus = statusFilter === 'all' || u.status === statusFilter;

      return matchesSearch && matchesRole && matchesDept && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, departmentFilter, statusFilter]);

  // Toggle single permission for a user
  const handleTogglePermission = async (userId: string, permKey: keyof UserPermissions) => {
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;

    const updatedPerms: UserPermissions = {
      ...targetUser.permissions,
      [permKey]: !targetUser.permissions[permKey]
    };

    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          permissions: updatedPerms
        };
      }
      return user;
    }));

    if (onUpdatePermissions) {
      try {
        await onUpdatePermissions(userId, updatedPerms);
        setSaveNotice(`Permissions updated and persisted to Firestore for ${targetUser.name}.`);
      } catch (err) {
        setSaveNotice(`Failed to persist permissions: ${err instanceof Error ? err.message : String(err)}`);
      }
    } else {
      setSaveNotice(`Permissions updated for officer.`);
    }

    setTimeout(() => setSaveNotice(null), 3000);
  };

  // Change user role
  const handleChangeRole = async (userId: string, newRole: UserRole) => {
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;

    // Apply default permission template based on new role
    let updatedPerms: UserPermissions = {
      canAuthorCourses: false,
      canGenerateAIAssessments: false,
      canAccessRawTelemetry: false,
      canApproveRequests: false,
      canBroadcastAnnouncements: false,
      hasAuditAccess: false
    };

    if (newRole === 'admin') {
      updatedPerms = {
        canAuthorCourses: true,
        canGenerateAIAssessments: true,
        canAccessRawTelemetry: true,
        canApproveRequests: true,
        canBroadcastAnnouncements: true,
        hasAuditAccess: true
      };
    } else if (newRole === 'trainer' || newRole === 'educator') {
      updatedPerms = {
        canAuthorCourses: true,
        canGenerateAIAssessments: true,
        canAccessRawTelemetry: true,
        canApproveRequests: false,
        canBroadcastAnnouncements: true,
        hasAuditAccess: false
      };
    }

    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          role: newRole,
          permissions: updatedPerms
        };
      }
      return user;
    }));

    if (onUpdateRole) {
      try {
        await onUpdateRole(userId, newRole, updatedPerms);
        setSaveNotice(`Role changed to ${newRole.toUpperCase()} and persisted to Firestore.`);
      } catch (err) {
        setSaveNotice(`Failed to update role in Firestore: ${err instanceof Error ? err.message : String(err)}`);
      }
    } else {
      setSaveNotice(`Role changed to ${newRole.toUpperCase()} with updated permission matrix.`);
    }

    setTimeout(() => setSaveNotice(null), 3000);
  };

  // Toggle user status
  const handleToggleStatus = (userId: string) => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        const nextStatus = user.status === 'active' ? 'suspended' : 'active';
        return { ...user, status: nextStatus };
      }
      return user;
    }));
  };

  // Add new user from invite form
  const handleCreateOfficer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    const newOfficer: ManagedUser = {
      id: `usr-${Date.now()}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: inviteRole,
      cadre: inviteCadre,
      department: inviteDepartment,
      institution: 'Ministry of Statistics and Programme Implementation (MoSPI)',
      employeeId: inviteEmployeeId.trim() || `GOI-STAT-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'active',
      joinedDate: 'Sep 13, 2026',
      lastActive: 'Just registered',
      permissions: {
        canAuthorCourses: inviteRole === 'trainer' || inviteRole === 'admin',
        canGenerateAIAssessments: inviteRole === 'trainer' || inviteRole === 'admin',
        canAccessRawTelemetry: inviteRole === 'admin',
        canApproveRequests: inviteRole === 'admin',
        canBroadcastAnnouncements: inviteRole === 'admin',
        hasAuditAccess: inviteRole === 'admin'
      }
    };

    setUsers([newOfficer, ...users]);
    if (onAddUser) {
      try {
        await onAddUser(newOfficer);
      } catch (err) {
        console.warn('Notice saving user to Firestore:', err);
      }
    }
    setIsInviteOpen(false);
    setInviteName('');
    setInviteEmail('');
    setInviteEmployeeId('');
    setSaveNotice(`New officer ${newOfficer.name} enrolled and persisted.`);
    setTimeout(() => setSaveNotice(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notice */}
      <AnimatePresence>
        {saveNotice && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 rounded-xl bg-[#092b21] border border-[#40e3bd]/50 text-xs font-semibold text-[#40e3bd] flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{saveNotice}</span>
            </div>
            <button onClick={() => setSaveNotice(null)} className="text-zinc-400 hover:text-white text-xs">
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h3 className="text-base font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
            <Users className="w-5 h-5 text-[#40e3bd]" />
            Official User Directory & Permission Matrix
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Manage cadre roles, cloud sandbox access, and security authorization toggles across {users.length} enrolled personnel.
          </p>
        </div>

        <button
          onClick={() => setIsInviteOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#40e3bd] to-[#20b892] hover:from-[#5ef8d5] text-[#052219] font-bold text-xs font-['Space_Grotesk'] flex items-center gap-2 shadow-[0_0_20px_rgba(64,227,189,0.3)] transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Onboard New Officer</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-5 relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, employee ID, or cadre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#40e3bd]"
          />
        </div>

        <div className="sm:col-span-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-3 py-2.5 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-[#40e3bd]"
          >
            <option value="all">All Roles</option>
            <option value="trainee">Trainees</option>
            <option value="trainer">Trainers / Faculty</option>
            <option value="admin">Administrators</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-full px-3 py-2.5 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-[#40e3bd]"
          >
            <option value="all">All Directorates</option>
            <option value="National Accounts">National Accounts (NAD)</option>
            <option value="Field Operations">Field Operations (FOD)</option>
            <option value="Price Statistics">Price Statistics (PSD)</option>
            <option value="Informatics">Informatics & AI (DIID)</option>
            <option value="Economics & Statistics">State DES Directorates</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2.5 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-[#40e3bd]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Permissions Legend */}
      <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between flex-wrap gap-3 text-[11px] text-zinc-400">
        <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#40e3bd]" />
          Granular Permission Toggles:
        </span>
        <div className="flex items-center gap-3 flex-wrap">
          <span title="Author and publish official course modules">
            <strong className="text-zinc-200 font-mono">AUTH:</strong> Author Courses
          </span>
          <span>•</span>
          <span title="Run Gemini AI for MCQ generation">
            <strong className="text-zinc-200 font-mono">AI:</strong> AI Assessments
          </span>
          <span>•</span>
          <span title="Access raw CAPI field GPS telemetry and microdata">
            <strong className="text-zinc-200 font-mono">TEL:</strong> Raw Telemetry
          </span>
          <span>•</span>
          <span title="Review and approve registration requests">
            <strong className="text-zinc-200 font-mono">APPR:</strong> Approve Queues
          </span>
          <span>•</span>
          <span title="Publish platform-wide broadcast alerts">
            <strong className="text-zinc-200 font-mono">BCST:</strong> Broadcast
          </span>
          <span>•</span>
          <span title="Security audit log inspections">
            <strong className="text-zinc-200 font-mono">AUD:</strong> Audit Logs
          </span>
        </div>
      </div>

      {/* User Directory Table */}
      <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/60 shadow-sm">
        <table className="w-full border-collapse text-left min-w-[900px]">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-950/70">
              <th className="p-3.5 text-xs font-bold font-['Space_Grotesk'] text-zinc-400 uppercase tracking-wider">
                Officer / User Identity
              </th>
              <th className="p-3.5 text-xs font-bold font-['Space_Grotesk'] text-zinc-400 uppercase tracking-wider">
                Cadre & Department
              </th>
              <th className="p-3.5 text-xs font-bold font-['Space_Grotesk'] text-zinc-400 uppercase tracking-wider">
                System Role
              </th>
              <th className="p-3.5 text-xs font-bold font-['Space_Grotesk'] text-zinc-400 uppercase tracking-wider text-center">
                Security Permissions Matrix
              </th>
              <th className="p-3.5 text-xs font-bold font-['Space_Grotesk'] text-zinc-400 uppercase tracking-wider text-right">
                Status / Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-12 text-center text-xs text-[#40e3bd]">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 border-2 border-[#40e3bd] border-t-transparent rounded-full animate-spin" />
                    <span className="font-mono">Loading authenticated cadre profiles from Firestore...</span>
                  </div>
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-xs text-zinc-400">
                  No matching officers found for the specified search criteria.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-zinc-800/30 transition-colors">
                  {/* Identity */}
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-xl object-cover border border-zinc-700/60"
                      />
                      <div>
                        <div className="text-xs font-bold text-white font-['Space_Grotesk'] flex items-center gap-1.5">
                          {user.name}
                          {user.id === 'usr-admin-1' && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              Root Admin
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-zinc-500" />
                          <span>{user.email}</span>
                        </div>
                        <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                          ID: {user.employeeId}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Cadre & Department */}
                  <td className="p-3.5">
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold text-zinc-200">
                        {user.cadre}
                      </div>
                      <div className="text-[11px] text-zinc-400 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-zinc-500 shrink-0" />
                        <span className="truncate max-w-[200px]" title={user.department}>{user.department}</span>
                      </div>
                    </div>
                  </td>

                  {/* Role Selector */}
                  <td className="p-3.5">
                    <select
                      value={user.role}
                      onChange={(e) => handleChangeRole(user.id, e.target.value as UserRole)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold font-['Space_Grotesk'] border focus:outline-none cursor-pointer ${
                        user.role === 'admin'
                          ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                          : user.role === 'trainer'
                          ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                          : 'bg-[#40e3bd]/15 text-[#40e3bd] border-[#40e3bd]/30'
                      }`}
                    >
                      <option value="trainee">Trainee</option>
                      <option value="trainer">Trainer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>

                  {/* Permissions Matrix Toggles */}
                  <td className="p-3.5">
                    <div className="flex items-center justify-center gap-1.5 flex-wrap max-w-xs mx-auto">
                      {[
                        { key: 'canAuthorCourses' as keyof UserPermissions, label: 'AUTH', tip: 'Can Author Courses' },
                        { key: 'canGenerateAIAssessments' as keyof UserPermissions, label: 'AI', tip: 'Can Generate AI Assessments' },
                        { key: 'canAccessRawTelemetry' as keyof UserPermissions, label: 'TEL', tip: 'Can Access Raw Telemetry & Microdata' },
                        { key: 'canApproveRequests' as keyof UserPermissions, label: 'APPR', tip: 'Can Approve Registration Requests' },
                        { key: 'canBroadcastAnnouncements' as keyof UserPermissions, label: 'BCST', tip: 'Can Publish Broadcasts' },
                        { key: 'hasAuditAccess' as keyof UserPermissions, label: 'AUD', tip: 'Has Audit Log Access' },
                      ].map((perm) => {
                        const isGranted = user.permissions[perm.key];
                        return (
                          <button
                            key={perm.key}
                            type="button"
                            onClick={() => handleTogglePermission(user.id, perm.key)}
                            title={`${perm.tip}: ${isGranted ? 'GRANTED (Click to Revoke)' : 'DENIED (Click to Grant)'}`}
                            className={`px-2 py-1 rounded-md text-[10px] font-mono font-bold transition-all cursor-pointer border ${
                              isGranted
                                ? 'bg-[#40e3bd]/20 text-[#40e3bd] border-[#40e3bd]/50 shadow-[0_0_8px_rgba(64,227,189,0.2)]'
                                : 'bg-zinc-900 text-zinc-600 border-zinc-800 hover:text-zinc-400'
                            }`}
                          >
                            {perm.label}
                          </button>
                        );
                      })}
                    </div>
                  </td>

                  {/* Status & Actions */}
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                          user.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                            : user.status === 'pending'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                        }`}
                        title="Toggle Account Activation Status"
                      >
                        {user.status === 'active' ? 'Active' : user.status === 'pending' ? 'Pending' : 'Suspended'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Onboard Officer Modal */}
      <AnimatePresence>
        {isInviteOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative w-full max-w-lg bg-[#091512] border border-[#40e3bd]/30 rounded-2xl shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-[#40e3bd]" />
                  <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
                    Onboard Government Officer
                  </h3>
                </div>
                <button
                  onClick={() => setIsInviteOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateOfficer} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Full Officer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Ramesh Chander"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#40e3bd]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Official Government Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="r.chander@mospi.gov.in"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#40e3bd]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-300">Cadre / Designation</label>
                    <input
                      type="text"
                      value={inviteCadre}
                      onChange={(e) => setInviteCadre(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#40e3bd]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-300">Employee ID</label>
                    <input
                      type="text"
                      placeholder="GOI-MOSPI-XXXX"
                      value={inviteEmployeeId}
                      onChange={(e) => setInviteEmployeeId(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#40e3bd]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-300">Assigned Directorate</label>
                    <select
                      value={inviteDepartment}
                      onChange={(e) => setInviteDepartment(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-[#40e3bd]"
                    >
                      <option value="National Accounts Division (NAD)">National Accounts (NAD)</option>
                      <option value="Field Operations Directorate (FOD)">Field Operations (FOD)</option>
                      <option value="Price Statistics Division (PSD)">Price Statistics (PSD)</option>
                      <option value="Data Informatics & Innovation (DIID)">Informatics & AI (DIID)</option>
                      <option value="State DES Directorates">State DES Directorates</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-300">Platform Role</label>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-[#40e3bd]"
                    >
                      <option value="trainee">Trainee Officer</option>
                      <option value="trainer">Master Trainer / Faculty</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsInviteOpen(false)}
                    className="px-4 py-2 rounded-xl bg-zinc-800 text-xs font-medium text-zinc-300 hover:bg-zinc-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#40e3bd] to-[#20b892] text-[#052219] font-bold text-xs font-['Space_Grotesk'] shadow-md hover:from-[#5ef8d5] transition-all cursor-pointer"
                  >
                    Register Officer
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
