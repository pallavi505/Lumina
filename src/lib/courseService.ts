import { db, doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where } from './firebase';
import type { AICourse, CourseEnrollment, CertificateData, EarnedBadge, DemoAccount } from '../types';
import { SEED_COURSES } from '../data/seedCourses';

const LOCAL_COURSES_KEY = 'lumina_custom_courses';
const LOCAL_ENROLLMENTS_KEY = 'lumina_user_enrollments';

// Helper to get locally stored courses
function getLocalCustomCourses(): AICourse[] {
  try {
    const raw = localStorage.getItem(LOCAL_COURSES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Helper to save locally
function saveLocalCustomCourses(courses: AICourse[]) {
  try {
    localStorage.setItem(LOCAL_COURSES_KEY, JSON.stringify(courses));
  } catch (err) {
    console.warn('Could not cache courses locally:', err);
  }
}

// Helper to get local enrollments
function getLocalEnrollments(): CourseEnrollment[] {
  try {
    const raw = localStorage.getItem(LOCAL_ENROLLMENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalEnrollments(enrollments: CourseEnrollment[]) {
  try {
    localStorage.setItem(LOCAL_ENROLLMENTS_KEY, JSON.stringify(enrollments));
  } catch (err) {
    console.warn('Could not cache enrollments locally:', err);
  }
}

export async function fetchAllCourses(): Promise<AICourse[]> {
  const localList = getLocalCustomCourses();
  let firestoreList: AICourse[] = [];

  try {
    const snap = await getDocs(collection(db, 'courses'));
    if (!snap.empty) {
      firestoreList = snap.docs.map(d => d.data() as AICourse);
    }
  } catch (err) {
    console.warn('Firestore fetch courses failed or offline, using local/seed:', err);
  }

  // Combine unique courses: seed + firestore + local
  const map = new Map<string, AICourse>();
  for (const c of SEED_COURSES) {
    map.set(c.id, c);
  }
  for (const c of firestoreList) {
    map.set(c.id, c);
  }
  for (const c of localList) {
    map.set(c.id, c);
  }

  return Array.from(map.values());
}

export async function saveCourse(course: AICourse): Promise<void> {
  // Update local cache
  const local = getLocalCustomCourses();
  const existingIdx = local.findIndex(c => c.id === course.id);
  if (existingIdx >= 0) {
    local[existingIdx] = course;
  } else {
    local.unshift(course);
  }
  saveLocalCustomCourses(local);

  // Persist in Firestore
  try {
    await setDoc(doc(db, 'courses', course.id), course, { merge: true });
  } catch (err) {
    console.warn('Could not write course to Firestore:', err);
  }
}

export async function fetchUserEnrollments(userId: string): Promise<CourseEnrollment[]> {
  const localEnrollments = getLocalEnrollments().filter(e => e.userId === userId);
  let firestoreEnrollments: CourseEnrollment[] = [];

  try {
    const q = query(collection(db, 'enrollments'), where('userId', '==', userId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      firestoreEnrollments = snap.docs.map(d => d.data() as CourseEnrollment);
    }
  } catch (err) {
    console.warn('Firestore fetch enrollments failed or offline:', err);
  }

  // Merge map by courseId
  const map = new Map<string, CourseEnrollment>();
  for (const e of localEnrollments) {
    map.set(e.courseId, e);
  }
  for (const e of firestoreEnrollments) {
    map.set(e.courseId, e);
  }

  // If new user with no enrollments, provide seed enrollments for rich preview
  if (map.size === 0) {
    const seedEnrollment: CourseEnrollment = {
      id: `enr-${userId}-${SEED_COURSES[0].id}`,
      userId,
      courseId: SEED_COURSES[0].id,
      progress: 50,
      completedLessons: [SEED_COURSES[0].chapters[0].id, SEED_COURSES[0].chapters[1].id],
      completed: false,
      enrolledAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
      lastAccessed: new Date().toISOString()
    };
    map.set(SEED_COURSES[0].id, seedEnrollment);
    saveLocalEnrollments([seedEnrollment]);
  }

  return Array.from(map.values());
}

export async function enrollInCourse(userId: string, courseId: string): Promise<CourseEnrollment> {
  const enrollmentId = `enr-${userId}-${courseId}`;
  const newEnrollment: CourseEnrollment = {
    id: enrollmentId,
    userId,
    courseId,
    progress: 0,
    completedLessons: [],
    completed: false,
    enrolledAt: new Date().toISOString(),
    lastAccessed: new Date().toISOString()
  };

  // Local save
  const local = getLocalEnrollments();
  const existingIdx = local.findIndex(e => e.userId === userId && e.courseId === courseId);
  if (existingIdx >= 0) {
    return local[existingIdx];
  }
  local.unshift(newEnrollment);
  saveLocalEnrollments(local);

  // Firestore save
  try {
    await setDoc(doc(db, 'enrollments', enrollmentId), newEnrollment, { merge: true });
  } catch (err) {
    console.warn('Firestore enroll write warning:', err);
  }

  return newEnrollment;
}

export async function markChapterCompleted(
  userId: string,
  courseId: string,
  chapterId: string,
  totalChapters: number
): Promise<CourseEnrollment> {
  const local = getLocalEnrollments();
  let enrollment = local.find(e => e.userId === userId && e.courseId === courseId);

  if (!enrollment) {
    enrollment = {
      id: `enr-${userId}-${courseId}`,
      userId,
      courseId,
      progress: 0,
      completedLessons: [],
      completed: false,
      enrolledAt: new Date().toISOString(),
      lastAccessed: new Date().toISOString()
    };
    local.push(enrollment);
  }

  if (!enrollment.completedLessons.includes(chapterId)) {
    enrollment.completedLessons.push(chapterId);
  }

  const progressPercent = Math.min(100, Math.round((enrollment.completedLessons.length / Math.max(1, totalChapters)) * 100));
  enrollment.progress = progressPercent;
  enrollment.completed = progressPercent >= 100;
  enrollment.lastAccessed = new Date().toISOString();

  saveLocalEnrollments(local);

  // Update in Firestore
  try {
    await setDoc(doc(db, 'enrollments', enrollment.id), enrollment, { merge: true });
  } catch (err) {
    console.warn('Firestore update completion warning:', err);
  }

  return enrollment;
}

export async function callGenerateAICourse(params: {
  topic: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration?: string;
  includeVideo?: boolean;
  description?: string;
}): Promise<AICourse> {
  const res = await fetch('/api/courses/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate course');
  }

  const data = await res.json();
  return data.course;
}

export async function callGenerateChapterContent(params: {
  courseTitle: string;
  chapterTitle: string;
  chapterSummary: string;
  topic?: string;
  level?: string;
}) {
  const res = await fetch('/api/courses/generate-content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate chapter content');
  }

  const data = await res.json();
  return data.content;
}

export async function awardCompletionCertificateAndBadge(params: {
  user: DemoAccount;
  course: AICourse;
  score: number;
  grade?: string;
}): Promise<{ certificate: CertificateData; badge: EarnedBadge; updatedEnrollment: CourseEnrollment }> {
  const { user, course, score } = params;

  // Determine distinctive badge based on topic / category
  let badgeIcon = '🎓';
  let badgeTitle = `${course.category || 'Curriculum'} Specialist`;
  const lowerCat = (course.category || '').toLowerCase();
  const lowerTitle = (course.title || '').toLowerCase();

  if (lowerCat.includes('stat') || lowerCat.includes('math') || lowerTitle.includes('data')) {
    badgeIcon = '📊';
    badgeTitle = 'Statistical Pioneer';
  } else if (lowerCat.includes('ai') || lowerCat.includes('tech') || lowerTitle.includes('intelligence')) {
    badgeIcon = '⚡';
    badgeTitle = 'Full-Stack AI Virtuoso';
  } else if (lowerCat.includes('econ') || lowerCat.includes('policy') || lowerTitle.includes('macro')) {
    badgeIcon = '🏛️';
    badgeTitle = 'Macroeconomic Modeler';
  } else if (lowerCat.includes('health') || lowerCat.includes('bio')) {
    badgeIcon = '🔬';
    badgeTitle = 'Applied Sciences Scholar';
  }

  const badge: EarnedBadge = {
    id: `badge-${course.id}-${Date.now().toString().slice(-4)}`,
    title: badgeTitle,
    courseId: course.id,
    courseTitle: course.title,
    category: course.category || 'General',
    icon: badgeIcon,
    earnedDate: new Date().toISOString(),
    description: `Demonstrated technical mastery in ${course.title} with a certified ${score}% quiz performance.`
  };

  const certificateId = `LUMINA-${course.id.slice(0, 6).toUpperCase()}-${Date.now().toString().slice(-4)}`;
  const completedDateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const certificate: CertificateData = {
    certificateId,
    studentName: user.name,
    studentId: user.id,
    courseTitle: course.title,
    courseId: course.id,
    completedDate: completedDateStr,
    grade: params.grade || (score === 100 ? 'A+ (High Distinction)' : score >= 80 ? 'A (Distinction)' : 'Pass'),
    score,
    badgeEarned: badge.title,
    issuer: 'Lumina National Learning Academy'
  };

  // 1. Update enrollment to 100% completed
  const localEnrollments = getLocalEnrollments();
  let enrollment = localEnrollments.find(e => e.userId === user.id && e.courseId === course.id);
  const allChapterIds = course.chapters.map(c => c.id);

  if (!enrollment) {
    enrollment = {
      id: `enr-${user.id}-${course.id}`,
      userId: user.id,
      courseId: course.id,
      progress: 100,
      completedLessons: allChapterIds,
      completed: true,
      enrolledAt: new Date().toISOString(),
      lastAccessed: new Date().toISOString()
    };
    localEnrollments.unshift(enrollment);
  } else {
    enrollment.progress = 100;
    enrollment.completed = true;
    enrollment.completedLessons = allChapterIds;
    enrollment.lastAccessed = new Date().toISOString();
  }
  saveLocalEnrollments(localEnrollments);

  // 2. Persist Certificate in Firestore
  try {
    await setDoc(doc(db, 'certificates', certificateId), certificate, { merge: true });
  } catch (err) {
    console.warn('Could not save certificate in Firestore:', err);
  }

  // 3. Persist Enrollment in Firestore
  try {
    await setDoc(doc(db, 'enrollments', enrollment.id), enrollment, { merge: true });
  } catch (err) {
    console.warn('Could not update enrollment in Firestore:', err);
  }

  // 4. Update user profile in Firestore and local storage
  try {
    const existingBadges = user.badges || [];
    const hasBadgeAlready = existingBadges.some(b => b.courseId === course.id);
    const updatedBadges = hasBadgeAlready ? existingBadges : [...existingBadges, badge];
    
    // Save to Firestore user doc
    await setDoc(doc(db, 'users', user.id), {
      badges: updatedBadges,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    // Update local accounts
    const localAccountsRaw = localStorage.getItem('lumina_demo_accounts');
    if (localAccountsRaw) {
      const accounts: DemoAccount[] = JSON.parse(localAccountsRaw);
      const accIdx = accounts.findIndex(a => a.id === user.id);
      if (accIdx >= 0) {
        accounts[accIdx].badges = updatedBadges;
        localStorage.setItem('lumina_demo_accounts', JSON.stringify(accounts));
      }
    }
    user.badges = updatedBadges;
  } catch (err) {
    console.warn('Could not update user badges in Firestore:', err);
  }

  return {
    certificate,
    badge,
    updatedEnrollment: enrollment
  };
}
