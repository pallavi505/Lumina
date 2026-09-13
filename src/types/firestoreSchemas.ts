import type { UserRole, MaterialType, TraineePerformanceStatus } from '../types';
import type { UserPermissions } from '../data/adminData';

/**
 * Firestore Database Schema Definitions for LUMINA
 * Collections:
 *  - /approvals/{approvalId}
 *  - /broadcasts/{broadcastId}
 *  - /users/{userId}
 *  - /materials/{materialId}
 *  - /trainee_records/{recordId}
 */

export interface ApprovalRequestDoc {
  id: string;
  type: 'trainee' | 'trainer';
  name: string;
  email: string;
  avatar: string;
  cadre: string;
  department: string;
  institution: string;
  employeeId: string;
  idVerificationStatus: 'verified' | 'pending_id_check' | 'manual_review';
  govEmailVerified: boolean;
  requestedRole: UserRole;
  requestedAccessTier: string;
  submissionDate: string;
  statementOfIntent: string;
  documents: {
    name: string;
    type: string;
    size: string;
    verified: boolean;
  }[];
  recommendationBy?: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  createdAt?: string | number | null;
  updatedAt?: string | number | null;
}

export interface BroadcastDoc {
  id: string;
  title: string;
  description: string;
  category: 'Policy Update' | 'iGOT Integration' | 'Curriculum Alert' | 'Urgent Maintenance' | 'Competition' | 'Security & Standards';
  priority: 'urgent' | 'high' | 'standard' | 'info';
  targetAudience: string;
  broadcastType: 'notification' | 'homepage' | 'both';
  badgeText?: string;
  badgeColor?: string;
  actionText?: string;
  targetView?: string;
  publishedAt: string;
  author: string;
  pinned: boolean;
  sentCount: number;
  openRate: number;
  active: boolean;
  createdAt?: string | number | null;
  updatedAt?: string | number | null;
}

export interface ManagedUserDoc {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  cadre: string;
  department: string;
  institution: string;
  employeeId: string;
  status: 'active' | 'pending' | 'suspended';
  joinedDate: string;
  lastActive: string;
  permissions: UserPermissions;
  createdAt?: string | number | null;
  updatedAt?: string | number | null;
}

export interface CourseMaterialDoc {
  id: string;
  title: string;
  type: MaterialType;
  moduleId: string;
  moduleTitle: string;
  courseId: string;
  courseTitle: string;
  fileSize?: string;
  durationOrPages?: string;
  uploadedAt: string;
  status: 'published' | 'draft' | 'archived';
  author: string;
  authorId?: string;
  url?: string;
  tags: string[];
  downloadsCount: number;
  createdAt?: string | number | null;
  updatedAt?: string | number | null;
}

export interface TraineePerformanceDoc {
  id: string;
  name: string;
  email: string;
  avatar: string;
  cadre: string;
  courseId: string;
  courseTitle: string;
  currentModule: string;
  participationRate: number;
  completionRate: number;
  avgAssessmentScore: number;
  finalExamScore: number | null;
  scoreDistribution: number[];
  status: TraineePerformanceStatus;
  lastActive: string;
  createdAt?: string | number | null;
  updatedAt?: string | number | null;
}
