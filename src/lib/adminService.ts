import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  setDoc, 
  updateDoc, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth } from './firebase';
import type { 
  PendingRegistrationRequest, 
  ManagedUser, 
  UserPermissions, 
  BroadcastItem 
} from '../data/adminData';
import { 
  SEED_PENDING_REQUESTS, 
  SEED_MANAGED_USERS, 
  SEED_BROADCASTS 
} from '../data/adminData';
import type { UserRole } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const APPROVALS_COLLECTION = 'approvals';
const USERS_COLLECTION = 'users';
const BROADCASTS_COLLECTION = 'broadcasts';

let hasSeededApprovals = false;
let hasSeededUsers = false;
let hasSeededBroadcasts = false;

/**
 * Seeds initial approvals in Firestore if collection is empty
 */
async function seedApprovalsIfEmpty(): Promise<void> {
  if (hasSeededApprovals) return;
  hasSeededApprovals = true;
  try {
    const snap = await getDocs(collection(db, APPROVALS_COLLECTION));
    if (snap.empty) {
      for (const req of SEED_PENDING_REQUESTS) {
        await setDoc(doc(db, APPROVALS_COLLECTION, req.id), {
          ...req,
          createdAt: new Date().toISOString()
        });
      }
    }
  } catch (error) {
    console.warn('Approvals seeding fallback/notice:', error);
  }
}

/**
 * Seeds initial users in Firestore if collection is empty
 */
async function seedUsersIfEmpty(): Promise<void> {
  if (hasSeededUsers) return;
  hasSeededUsers = true;
  try {
    const snap = await getDocs(collection(db, USERS_COLLECTION));
    if (snap.empty) {
      for (const user of SEED_MANAGED_USERS) {
        await setDoc(doc(db, USERS_COLLECTION, user.id), {
          ...user,
          createdAt: new Date().toISOString()
        });
      }
    }
  } catch (error) {
    console.warn('Users seeding fallback/notice:', error);
  }
}

/**
 * Seeds initial broadcasts in Firestore if collection is empty
 */
async function seedBroadcastsIfEmpty(): Promise<void> {
  if (hasSeededBroadcasts) return;
  hasSeededBroadcasts = true;
  try {
    const snap = await getDocs(collection(db, BROADCASTS_COLLECTION));
    if (snap.empty) {
      for (const bc of SEED_BROADCASTS) {
        await setDoc(doc(db, BROADCASTS_COLLECTION, bc.id), {
          ...bc,
          createdAt: new Date().toISOString()
        });
      }
    }
  } catch (error) {
    console.warn('Broadcasts seeding fallback/notice:', error);
  }
}

/**
 * Real-time listener for pending and historical approvals
 */
export function subscribeToPendingApprovals(
  onUpdate: (requests: PendingRegistrationRequest[]) => void,
  onError?: (error: Error) => void
): () => void {
  // Trigger non-blocking check
  seedApprovalsIfEmpty();

  const colRef = collection(db, APPROVALS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        // Fall back to seed data if Firestore is currently empty
        onUpdate(SEED_PENDING_REQUESTS);
        return;
      }
      const requests: PendingRegistrationRequest[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          type: data.type || 'trainee',
          name: data.name || '',
          email: data.email || '',
          avatar: data.avatar || '',
          cadre: data.cadre || '',
          department: data.department || '',
          institution: data.institution || '',
          employeeId: data.employeeId || '',
          idVerificationStatus: data.idVerificationStatus || 'verified',
          govEmailVerified: data.govEmailVerified ?? true,
          requestedRole: data.requestedRole || 'trainee',
          requestedAccessTier: data.requestedAccessTier || 'Standard',
          submissionDate: data.submissionDate || 'Recently',
          statementOfIntent: data.statementOfIntent || '',
          documents: data.documents || [],
          recommendationBy: data.recommendationBy,
          status: data.status || 'pending',
          reviewedAt: data.reviewedAt,
          reviewedBy: data.reviewedBy,
          rejectionReason: data.rejectionReason,
        } as PendingRegistrationRequest;
      });
      onUpdate(requests);
    },
    (error) => {
      console.error('Error subscribing to approvals:', error);
      if (onError) onError(error);
      else {
        try {
          handleFirestoreError(error, OperationType.GET, APPROVALS_COLLECTION);
        } catch (e) {
          // Keep local fallback alive for resilient UX
          onUpdate(SEED_PENDING_REQUESTS);
        }
      }
    }
  );
}

/**
 * Review an approval request (Approve or Reject)
 */
export async function reviewApprovalRequest(
  requestId: string,
  decision: 'approved' | 'rejected',
  options?: {
    customTier?: string;
    reason?: string;
    reviewedBy?: string;
  }
): Promise<void> {
  const docRef = doc(db, APPROVALS_COLLECTION, requestId);
  const now = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  try {
    const existing = await getDoc(docRef);
    if (!existing.exists()) {
      // Document might be from local seed before sync, create it first
      const seedItem = SEED_PENDING_REQUESTS.find(r => r.id === requestId);
      if (seedItem) {
        await setDoc(docRef, {
          ...seedItem,
          status: decision,
          requestedAccessTier: options?.customTier || seedItem.requestedAccessTier,
          rejectionReason: decision === 'rejected' ? (options?.reason || 'Official documentation required verification') : undefined,
          reviewedAt: now,
          reviewedBy: options?.reviewedBy || 'Apex Administrator',
          updatedAt: new Date().toISOString()
        });
        return;
      }
    }

    await updateDoc(docRef, {
      status: decision,
      ...(options?.customTier ? { requestedAccessTier: options.customTier } : {}),
      ...(decision === 'rejected' ? { rejectionReason: options?.reason || 'Review criteria not satisfied' } : {}),
      reviewedAt: now,
      reviewedBy: options?.reviewedBy || 'Apex Administrator',
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${APPROVALS_COLLECTION}/${requestId}`);
  }
}

/**
 * Fetch all registered and managed users
 */
export async function fetchAllUsers(): Promise<ManagedUser[]> {
  await seedUsersIfEmpty();

  try {
    const snap = await getDocs(collection(db, USERS_COLLECTION));
    if (snap.empty) {
      return SEED_MANAGED_USERS;
    }
    return snap.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name || '',
        email: data.email || '',
        avatar: data.avatar || '',
        role: data.role || 'trainee',
        cadre: data.cadre || 'Official Statistical Cadre',
        department: data.department || 'National Accounts Division',
        institution: data.institution || 'MoSPI',
        employeeId: data.employeeId || `EMP-${docSnap.id.slice(0, 6)}`,
        status: data.status || 'active',
        joinedDate: data.joinedDate || '2026',
        lastActive: data.lastActive || 'Today',
        permissions: data.permissions || {
          canAuthorCourses: data.role === 'trainer' || data.role === 'admin',
          canGenerateAIAssessments: data.role === 'trainer' || data.role === 'admin',
          canAccessRawTelemetry: data.role === 'admin',
          canApproveRequests: data.role === 'admin',
          canBroadcastAnnouncements: data.role === 'admin',
          hasAuditAccess: data.role === 'admin'
        }
      } as ManagedUser;
    });
  } catch (error) {
    console.error('Error in fetchAllUsers:', error);
    try {
      handleFirestoreError(error, OperationType.GET, USERS_COLLECTION);
    } catch {
      return SEED_MANAGED_USERS;
    }
  }
}

/**
 * Real-time listener for broadcasts
 */
export function subscribeToBroadcasts(
  onUpdate: (broadcasts: BroadcastItem[]) => void,
  onError?: (error: Error) => void
): () => void {
  seedBroadcastsIfEmpty();

  const colRef = collection(db, BROADCASTS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        onUpdate(SEED_BROADCASTS);
        return;
      }
      const broadcasts: BroadcastItem[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          title: data.title || '',
          description: data.description || '',
          category: data.category || 'Policy Update',
          priority: data.priority || 'standard',
          targetAudience: data.targetAudience || 'All Cadres',
          broadcastType: data.broadcastType || 'both',
          badgeText: data.badgeText,
          badgeColor: data.badgeColor || 'emerald',
          actionText: data.actionText || 'View Details',
          targetView: data.targetView || 'explore',
          publishedAt: data.publishedAt || 'Recently',
          author: data.author || 'Apex Admin',
          pinned: data.pinned ?? false,
          sentCount: data.sentCount || 48250,
          openRate: data.openRate || 100,
          active: data.active ?? true
        } as BroadcastItem;
      });
      onUpdate(broadcasts);
    },
    (error) => {
      console.error('Error subscribing to broadcasts:', error);
      if (onError) onError(error);
      else {
        try {
          handleFirestoreError(error, OperationType.GET, BROADCASTS_COLLECTION);
        } catch {
          onUpdate(SEED_BROADCASTS);
        }
      }
    }
  );
}

/**
 * Dispatches a new platform broadcast directive
 */
export async function dispatchBroadcast(
  broadcast: Omit<BroadcastItem, 'id' | 'publishedAt' | 'sentCount' | 'openRate'>
): Promise<string> {
  const newId = `bc-${Date.now()}`;
  const docRef = doc(db, BROADCASTS_COLLECTION, newId);
  
  const payload: BroadcastItem = {
    ...broadcast,
    id: newId,
    publishedAt: 'Just now',
    sentCount: broadcast.targetAudience.includes('All') ? 48250 : 3840,
    openRate: 100,
    active: true
  };

  try {
    await setDoc(docRef, {
      ...payload,
      createdAt: new Date().toISOString()
    });
    return newId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${BROADCASTS_COLLECTION}/${newId}`);
  }
}

/**
 * Updates an officer's granular capability permissions
 */
export async function updateUserPermissions(
  userId: string, 
  permissions: UserPermissions
): Promise<void> {
  const docRef = doc(db, USERS_COLLECTION, userId);
  try {
    const existing = await getDoc(docRef);
    if (!existing.exists()) {
      // Find from seeds if exists
      const seedUser = SEED_MANAGED_USERS.find(u => u.id === userId);
      if (seedUser) {
        await setDoc(docRef, {
          ...seedUser,
          permissions,
          updatedAt: new Date().toISOString()
        });
        return;
      }
    }
    await updateDoc(docRef, {
      permissions,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${USERS_COLLECTION}/${userId}`);
  }
}

/**
 * Updates an officer's role and synchronizes default permissions
 */
export async function updateUserRole(
  userId: string,
  newRole: UserRole,
  permissions?: UserPermissions
): Promise<void> {
  const docRef = doc(db, USERS_COLLECTION, userId);
  try {
    const existing = await getDoc(docRef);
    if (!existing.exists()) {
      const seedUser = SEED_MANAGED_USERS.find(u => u.id === userId);
      if (seedUser) {
        await setDoc(docRef, {
          ...seedUser,
          role: newRole,
          ...(permissions ? { permissions } : {}),
          updatedAt: new Date().toISOString()
        });
        return;
      }
    }
    await updateDoc(docRef, {
      role: newRole,
      ...(permissions ? { permissions } : {}),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${USERS_COLLECTION}/${userId}`);
  }
}

/**
 * Creates or onboards a new managed user
 */
export async function createManagedUser(user: ManagedUser): Promise<void> {
  const docRef = doc(db, USERS_COLLECTION, user.id);
  try {
    await setDoc(docRef, {
      ...user,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${USERS_COLLECTION}/${user.id}`);
  }
}
