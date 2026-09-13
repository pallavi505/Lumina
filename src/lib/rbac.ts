import type { AppView, DemoAccount, UserRole } from '../types';

export type CanonicalRole = 'trainee' | 'trainer' | 'admin';
export type ApprovalStatus = 'Approved' | 'Pending' | 'Rejected';
export type TrainerStudioTab = 'assessment-creator' | 'material-library' | 'performance-tracker';
export type AdminStudioModule = 'queue' | 'analytics' | 'users';

export const PUBLIC_VIEWS: AppView[] = ['home', 'login'];

export const TRAINEE_VIEWS: AppView[] = [
  'dashboard',
  'explore',
  'progress',
  'profile',
  'course-layout',
  'course-player',
];

export const TRAINER_VIEWS: AppView[] = ['trainer-dashboard', 'profile'];

export const ADMIN_VIEWS: AppView[] = ['admin-dashboard', 'profile'];

const ROLE_VIEWS: Record<CanonicalRole, AppView[]> = {
  trainee: TRAINEE_VIEWS,
  trainer: TRAINER_VIEWS,
  admin: ADMIN_VIEWS,
};

export function canonicalRole(role?: UserRole | string | null): CanonicalRole {
  if (role === 'admin' || role === 'institution' || role === 'Admin') return 'admin';
  if (role === 'trainer' || role === 'educator' || role === 'Trainer') return 'trainer';
  return 'trainee';
}

export function canonicalApprovalStatus(
  status?: ApprovalStatus | string | null
): ApprovalStatus {
  const normalized = String(status || '').toLowerCase();
  if (normalized === 'pending') return 'Pending';
  if (normalized === 'rejected' || normalized === 'suspended' || normalized === 'denied') {
    return 'Rejected';
  }
  if (normalized === 'approved' || normalized === 'active' || normalized === 'verified') {
    return 'Approved';
  }
  return 'Approved';
}

export function isApproved(user: DemoAccount | null | undefined): boolean {
  if (!user) return false;
  return canonicalApprovalStatus(user.approvalStatus) === 'Approved';
}

export function getHomeViewForUser(user: DemoAccount | null): AppView {
  if (!user) return 'home';
  if (!isApproved(user)) return 'pending-verification';
  const role = canonicalRole(user.role);
  if (role === 'admin') return 'admin-dashboard';
  if (role === 'trainer') return 'trainer-dashboard';
  return 'dashboard';
}

export function canAccessView(user: DemoAccount | null, view: AppView): boolean {
  if (PUBLIC_VIEWS.includes(view)) return true;
  if (!user) return false;
  if (!isApproved(user)) return view === 'pending-verification';
  if (view === 'pending-verification') return false;
  return ROLE_VIEWS[canonicalRole(user.role)].includes(view);
}

export function resolveCadreBadge(user: DemoAccount | null | undefined): string {
  if (!user) return 'ISS';
  const haystack = `${user.cadre || ''} ${user.title || ''} ${user.badge || ''}`.toUpperCase();
  if (haystack.includes('SSS') || haystack.includes('SUBORDINATE')) return 'SSS';
  if (haystack.includes('DES') || haystack.includes('DIRECTORATE')) return 'DES';
  return 'ISS';
}

export function roleLabel(role?: UserRole | string | null): string {
  const canonical = canonicalRole(role);
  if (canonical === 'admin') return 'Admin';
  if (canonical === 'trainer') return 'Trainer';
  return 'Trainee';
}
