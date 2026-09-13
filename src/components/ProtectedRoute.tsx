import type { ReactNode } from 'react';
import type { DemoAccount } from '../types';
import {
  canAccessView,
  canonicalRole,
  isApproved,
  type CanonicalRole,
} from '../lib/rbac';
import type { AppView } from '../types';

interface ProtectedRouteProps {
  allowedRoles: CanonicalRole[];
  currentUser: DemoAccount | null;
  view: AppView;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * View-level RBAC gate used by the App view machine.
 * Denies unauthenticated users, unapproved accounts, and mismatched roles.
 */
export default function ProtectedRoute({
  allowedRoles,
  currentUser,
  view,
  children,
  fallback = null,
}: ProtectedRouteProps) {
  if (!currentUser) return <>{fallback}</>;
  if (!isApproved(currentUser)) return <>{fallback}</>;
  if (!allowedRoles.includes(canonicalRole(currentUser.role))) return <>{fallback}</>;
  if (!canAccessView(currentUser, view)) return <>{fallback}</>;
  return <>{children}</>;
}
