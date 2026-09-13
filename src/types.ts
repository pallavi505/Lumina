export type UserRole = 'trainee' | 'admin' | 'trainer' | 'student' | 'educator' | 'institution';

export type ApprovalStatus = 'Approved' | 'Pending' | 'Rejected';

export type AuthMode = 'signin' | 'signup';

export type AppView = 
  | 'home' 
  | 'login' 
  | 'dashboard' 
  | 'trainer-dashboard'
  | 'admin-dashboard'
  | 'course-layout' 
  | 'course-player' 
  | 'profile' 
  | 'progress' 
  | 'explore'
  | 'pending-verification';

export interface DemoAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  title: string;
  badge: string;
  coursesCount: number;
  bio?: string;
  institution?: string;
  cadre?: string;
  approvalStatus?: ApprovalStatus;
  targetHoursPerWeek?: number;
  interests?: string[];
  joinedDate?: string;
  streakDays?: number;
  totalHoursLearned?: number;
  badges?: EarnedBadge[];
}

export interface EarnedBadge {
  id: string;
  title: string;
  courseId: string;
  courseTitle: string;
  category: string;
  icon: string;
  earnedDate: string;
  description: string;
}

export interface CertificateData {
  certificateId: string;
  studentName: string;
  studentId?: string;
  courseTitle: string;
  courseId: string;
  completedDate: string;
  grade?: string;
  score?: number;
  badgeEarned?: string;
  issuer: string;
}

export interface ParticleData {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  driftX: number;
  driftY: number;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  badge: string;
  badgeColor?: string;
  author: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  metric: string;
  subtitle: string;
  detail: string;
  icon: string;
}

export interface CourseItem {
  id: string;
  title: string;
  code: string;
  provider: string;
  curriculum: string;
  duration: string;
  level: string;
  competencies: number;
  enrolledCount: number;
  rating: number;
  badge: string;
}

export interface NotificationsData {
  announcements: AnnouncementItem[];
  achievements: AchievementItem[];
  newCourses: CourseItem[];
}

export interface ChapterQuiz {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface ChapterContent {
  markdown: string;
  codeSnippet?: string;
  codeLanguage?: string;
  keyTakeaways: string[];
  quiz?: ChapterQuiz;
}

export interface Chapter {
  id: string;
  chapterNumber: number;
  title: string;
  summary: string;
  durationMinutes: number;
  youtubeVideoId: string;
  videoTitle: string;
  lessons?: string[];
  content?: ChapterContent;
}

export interface AICourse {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  bannerImage: string;
  bannerPrompt?: string;
  tags: string[];
  learningOutcomes: string[];
  chapters: Chapter[];
  authorId?: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  enrolledCount: number;
  rating: number;
  includeVideo?: boolean;
}

export interface CourseEnrollment {
  id: string;
  userId: string;
  courseId: string;
  progress: number; // 0 - 100
  completedLessons: string[]; // chapter ids
  completed: boolean;
  enrolledAt: string;
  lastAccessed: string;
}

export interface CourseNote {
  id: string;
  userId: string;
  courseId: string;
  chapterId: string;
  chapterIndex: number;
  chapterTitle: string;
  timestamp: string; // e.g. "04:15"
  timestampSeconds: number; // e.g. 255
  text: string;
  createdAt: string;
  updatedAt?: string;
}

export type LiveNotificationType = 'deadline' | 'completion' | 'peer';
export type NotificationPriority = 'urgent' | 'high' | 'normal' | 'low';

export interface DeadlineInfo {
  assignmentTitle: string;
  courseTitle: string;
  courseId?: string;
  dueDate: string;
  dueInHours: number;
  submitted?: boolean;
  submissionFormat?: string;
  weightage?: string;
}

export interface CompletionInfo {
  courseTitle: string;
  courseId?: string;
  chapterTitle?: string;
  learnerName: string;
  isSelf: boolean;
  grade?: string;
  score?: number;
  badgeTitle?: string;
  certificateId?: string;
  accreditedHours?: number;
}

export interface PeerInfo {
  peerName: string;
  peerAvatar: string;
  peerRole: string;
  interactionType: 'comment' | 'mention' | 'endorsement' | 'review_request';
  targetTopic: string;
  snippet: string;
  repliesCount?: number;
  lastReply?: string;
}

export interface LiveNotificationItem {
  id: string;
  type: LiveNotificationType;
  title: string;
  description: string;
  timestamp: string; // ISO format or relative
  read: boolean;
  priority: NotificationPriority;
  pinned?: boolean;
  deadlineInfo?: DeadlineInfo;
  completionInfo?: CompletionInfo;
  peerInfo?: PeerInfo;
  actionText?: string;
  targetView?: AppView;
  targetCourseId?: string;
}

// ========================
// Trainer Dashboard Types
// ========================
export type AssessmentDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Master';

export interface AssessmentMCQ {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: AssessmentDifficulty;
  competencyDomain: string;
  sourceSnippet?: string;
}

export interface AssessmentPackage {
  id: string;
  title: string;
  courseId?: string;
  courseTitle?: string;
  moduleName?: string;
  difficulty: AssessmentDifficulty;
  competencyDomain: string;
  questions: AssessmentMCQ[];
  sourceFilename?: string;
  createdAt: string;
  status: 'published' | 'draft';
}

export type MaterialType = 'video' | 'presentation' | 'document' | 'dataset';

export interface CourseMaterial {
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
  url?: string;
  tags: string[];
  downloadsCount: number;
}

export type TraineePerformanceStatus = 'Proficient' | 'On Track' | 'Needs Attention' | 'At Risk';

export interface TraineePerformanceRecord {
  id: string;
  name: string;
  email: string;
  avatar: string;
  cadre: string;
  courseId: string;
  courseTitle: string;
  currentModule: string;
  participationRate: number; // 0 - 100%
  completionRate: number; // 0 - 100%
  avgAssessmentScore: number; // 0 - 100%
  finalExamScore: number | null;
  scoreDistribution: number[]; // recent quiz scores
  status: TraineePerformanceStatus;
  lastActive: string;
}

