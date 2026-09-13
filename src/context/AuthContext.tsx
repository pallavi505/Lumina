import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  auth, 
  db, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as fbSignOut, 
  signInWithPopup, 
  googleProvider, 
  githubProvider,
  microsoftProvider,
  doc, 
  getDoc, 
  setDoc,
  updateProfile,
  type FirebaseUser
} from '../lib/firebase';
import type { ApprovalStatus, DemoAccount, UserRole } from '../types';
import { DEMO_ACCOUNTS } from '../data/demoAccounts';
import { canonicalApprovalStatus, canonicalRole } from '../lib/rbac';

function normalizeRole(r?: string): UserRole {
  return canonicalRole(r);
}

function resolveApproval(data?: { approvalStatus?: string; status?: string }): ApprovalStatus {
  if (data?.approvalStatus) return canonicalApprovalStatus(data.approvalStatus);
  if (data?.status) return canonicalApprovalStatus(data.status);
  return 'Approved';
}

function defaultCadre(role: UserRole): string {
  if (role === 'trainer') return 'DES';
  return 'ISS';
}

function getDefaultTitle(role: UserRole): string {
  if (role === 'admin') return 'Institutional Director & Platform Administrator';
  if (role === 'trainer') return 'Lead Curriculum Chair & Master Trainer';
  return 'Indian Statistical Service (ISS) Trainee';
}

function getDefaultBadge(role: UserRole): string {
  if (role === 'admin') return 'Chief Academy Administrator';
  if (role === 'trainer') return 'Senior Faculty Mentor';
  return 'National Statistical Academy Cohort #24';
}

interface AuthContextType {

  currentUser: DemoAccount | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signInEmail: (email: string, pass: string) => Promise<DemoAccount>;
  signUpEmail: (email: string, pass: string, name: string, role: UserRole) => Promise<DemoAccount>;
  signInWithGoogle: () => Promise<DemoAccount>;
  signInWithGithub: () => Promise<DemoAccount>;
  signInWithMicrosoft: () => Promise<DemoAccount>;
  signInWithDemoAccount: (account: DemoAccount) => void;
  updateUserProfile: (updates: Partial<DemoAccount>) => Promise<DemoAccount>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<DemoAccount | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            const normalized = normalizeRole(data.role);
            setCurrentUser({
              id: user.uid,
              name: data.name || user.displayName || 'Trainee Scholar',
              email: user.email || data.email || '',
              role: normalized,
              avatar: data.avatar || user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
              title: data.title || getDefaultTitle(normalized),
              badge: data.badge || getDefaultBadge(normalized),
              coursesCount: data.coursesCount || 4,
              bio: data.bio || 'Probationer mastering statistical data systems, official indicators, and full-stack AI technologies.',
              institution: data.institution || 'National Statistical Systems Training Academy (NSSTA)',
              cadre: data.cadre || defaultCadre(normalized),
              approvalStatus: resolveApproval(data),
              targetHoursPerWeek: data.targetHoursPerWeek || 8,
              interests: data.interests || ['Official Statistics', 'Data Science', 'AI & Machine Learning'],
              joinedDate: data.createdAt || 'August 2026',
              streakDays: data.streakDays || 5,
              totalHoursLearned: data.totalHoursLearned || 14.5,
            });
          } else {
            // First time auth without firestore doc
            const defaultAcc: DemoAccount = {
              id: user.uid,
              name: user.displayName || (user.email?.split('@')[0] || 'Trainee Scholar'),
              email: user.email || '',
              role: 'trainee',
              avatar: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
              title: getDefaultTitle('trainee'),
              badge: getDefaultBadge('trainee'),
              coursesCount: 4,
              bio: 'Probationer mastering statistical data systems, official indicators, and full-stack AI technologies.',
              institution: 'National Statistical Systems Training Academy (NSSTA)',
              cadre: 'ISS',
              approvalStatus: 'Pending',
              targetHoursPerWeek: 8,
              interests: ['Official Statistics', 'Data Science', 'AI & Machine Learning'],
              joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
              streakDays: 5,
              totalHoursLearned: 14.5,
            };
            await setDoc(userDocRef, {
              ...defaultAcc,
              createdAt: new Date().toISOString(),
            }, { merge: true });
            setCurrentUser(defaultAcc);
          }
        } catch (err) {
          console.warn('Could not read user profile from firestore, using basic profile:', err);
          setCurrentUser({
            id: user.uid,
            name: user.displayName || user.email?.split('@')[0] || 'Trainee Scholar',
            email: user.email || '',
            role: 'trainee',
            avatar: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            title: getDefaultTitle('trainee'),
            badge: getDefaultBadge('trainee'),
            coursesCount: 4,
            bio: 'Probationer mastering statistical data systems, official indicators, and full-stack AI technologies.',
            institution: 'National Statistical Systems Training Academy (NSSTA)',
            cadre: 'ISS',
            approvalStatus: 'Pending',
            targetHoursPerWeek: 8,
            interests: ['Official Statistics', 'Data Science', 'AI & Machine Learning'],
            joinedDate: 'August 2026',
            streakDays: 5,
            totalHoursLearned: 14.5,
          });
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInEmail = async (email: string, pass: string): Promise<DemoAccount> => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const user = cred.user;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const d = userDoc.data();
        const normalized = normalizeRole(d.role);
        const acc: DemoAccount = {
          id: user.uid,
          name: d.name || user.displayName || 'Trainee Scholar',
          email: user.email || '',
          role: normalized,
          avatar: d.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          title: d.title || getDefaultTitle(normalized),
          badge: d.badge || getDefaultBadge(normalized),
          coursesCount: d.coursesCount || 5,
          cadre: d.cadre || defaultCadre(normalized),
          approvalStatus: resolveApproval(d),
        };
        setCurrentUser(acc);
        return acc;
      }
      const newAcc: DemoAccount = {
        id: user.uid,
        name: user.displayName || email.split('@')[0],
        email: user.email || email,
        role: 'trainee',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        title: getDefaultTitle('trainee'),
        badge: getDefaultBadge('trainee'),
        coursesCount: 5,
        cadre: 'ISS',
        approvalStatus: 'Pending',
      };
      await setDoc(doc(db, 'users', user.uid), newAcc);
      setCurrentUser(newAcc);
      return newAcc;
    } catch (err: any) {
      // If demo account fallback is desired or invalid-credential
      const demoMatch = DEMO_ACCOUNTS.find(a => a.email.toLowerCase() === email.toLowerCase());
      if (demoMatch) {
        setCurrentUser(demoMatch);
        return demoMatch;
      }
      throw err;
    }
  };

  const signUpEmail = async (email: string, pass: string, name: string, role: UserRole): Promise<DemoAccount> => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    const user = cred.user;
    if (name) {
      await updateProfile(user, { displayName: name });
    }
    const normalized = normalizeRole(role);
    const newAcc: DemoAccount = {
      id: user.uid,
      name: name || email.split('@')[0],
      email: user.email || email,
      role: normalized,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      title: getDefaultTitle(normalized),
      badge: getDefaultBadge(normalized),
      coursesCount: normalized === 'admin' ? 24 : normalized === 'trainer' ? 12 : 4,
      cadre: defaultCadre(normalized),
      approvalStatus: 'Pending',
    };
    await setDoc(doc(db, 'users', user.uid), {
      ...newAcc,
      createdAt: new Date().toISOString()
    });
    setCurrentUser(newAcc);
    return newAcc;
  };

  const signInWithGoogle = async (): Promise<DemoAccount> => {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      const d = userDoc.data();
      const acc: DemoAccount = {
        id: user.uid,
        name: d.name || user.displayName || 'Scholar',
        email: user.email || '',
        role: normalizeRole(d.role),
        avatar: user.photoURL || d.avatar,
        title: d.title || 'Google Verified Scholar',
        badge: 'Google SSO',
        coursesCount: d.coursesCount || 4,
        cadre: d.cadre || defaultCadre(normalizeRole(d.role)),
        approvalStatus: resolveApproval(d),
      };
      setCurrentUser(acc);
      return acc;
    }
    const newAcc: DemoAccount = {
      id: user.uid,
      name: user.displayName || 'Scholar',
      email: user.email || '',
      role: 'trainee',
      avatar: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      title: 'Google Verified Scholar',
      badge: 'Google SSO',
      coursesCount: 4,
      cadre: 'ISS',
      approvalStatus: 'Pending',
    };
    await setDoc(doc(db, 'users', user.uid), {
      ...newAcc,
      createdAt: new Date().toISOString()
    });
    setCurrentUser(newAcc);
    return newAcc;
  };

  const signInWithGithub = async (): Promise<DemoAccount> => {
    const res = await signInWithPopup(auth, githubProvider);
    const user = res.user;
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      const d = userDoc.data();
      const acc: DemoAccount = {
        id: user.uid,
        name: d.name || user.displayName || 'GitHub Scholar',
        email: user.email || '',
        role: normalizeRole(d.role),
        avatar: user.photoURL || d.avatar,
        title: d.title || 'Developer Fellow',
        badge: 'GitHub SSO',
        coursesCount: d.coursesCount || 4,
        cadre: d.cadre || defaultCadre(normalizeRole(d.role)),
        approvalStatus: resolveApproval(d),
      };
      setCurrentUser(acc);
      return acc;
    }
    const newAcc: DemoAccount = {
      id: user.uid,
      name: user.displayName || 'GitHub Scholar',
      email: user.email || '',
      role: 'trainee',
      avatar: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      title: 'Developer Fellow',
      badge: 'GitHub SSO',
      coursesCount: 4,
      cadre: 'ISS',
      approvalStatus: 'Pending',
    };
    await setDoc(doc(db, 'users', user.uid), {
      ...newAcc,
      createdAt: new Date().toISOString()
    });
    setCurrentUser(newAcc);
    return newAcc;
  };

  const signInWithMicrosoft = async (): Promise<DemoAccount> => {
    const res = await signInWithPopup(auth, microsoftProvider);
    const user = res.user;
    const newAcc: DemoAccount = {
      id: user.uid,
      name: user.displayName || 'Microsoft Scholar',
      email: user.email || '',
      role: 'trainee',
      avatar: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      title: 'Enterprise Fellow',
      badge: 'M365 Verified',
      coursesCount: 6,
      cadre: 'ISS',
      approvalStatus: 'Pending',
    };
    await setDoc(doc(db, 'users', user.uid), {
      ...newAcc,
      createdAt: new Date().toISOString()
    });
    setCurrentUser(newAcc);
    return newAcc;
  };

  const signInWithDemoAccount = (account: DemoAccount) => {
    setCurrentUser(account);
  };

  const updateUserProfile = async (updates: Partial<DemoAccount>): Promise<DemoAccount> => {
    if (!currentUser) {
      throw new Error('No authenticated user to update');
    }
    const updated: DemoAccount = {
      ...currentUser,
      ...updates,
    };
    setCurrentUser(updated);

    // Persist to Firestore if user ID exists
    try {
      if (currentUser.id) {
        await setDoc(doc(db, 'users', currentUser.id), {
          ...updated,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }
    } catch (err) {
      console.warn('Could not persist profile update to Firestore:', err);
    }

    return updated;
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch (e) {
      console.warn('Sign out error:', e);
    }
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        firebaseUser,
        loading,
        signInEmail,
        signUpEmail,
        signInWithGoogle,
        signInWithGithub,
        signInWithMicrosoft,
        signInWithDemoAccount,
        updateUserProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
