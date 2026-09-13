import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import BackgroundMesh from './components/BackgroundMesh';
import LuminaLogo from './components/LuminaLogo';
import LoginForm from './components/LoginForm';
import LearningShowcase from './components/LearningShowcase';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import ForgotPasswordModal from './components/ForgotPasswordModal';
import HelpModal from './components/HelpModal';
import LuminaWorkspacePreview from './components/LuminaWorkspacePreview';
import Dashboard from './components/Dashboard';
import CourseLayoutView from './components/CourseLayoutView';
import CoursePlayerView from './components/CoursePlayerView';
import AICourseCreatorModal from './components/AICourseCreatorModal';
import UserProfileView from './components/UserProfileView';
import MyLearningProgressView from './components/MyLearningProgressView';
import ExploreCoursesView from './components/ExploreCoursesView';
import TrainerDashboard from './components/TrainerDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import LiveNotificationsDrawer from './components/LiveNotificationsDrawer';
import LiveNotificationToast from './components/LiveNotificationToast';
import ProtectedRoute from './components/ProtectedRoute';
import AccreditationPendingView from './components/AccreditationPendingView';
import type { DemoAccount, AppView, AICourse, CourseEnrollment } from './types';
import type { TrainerTab } from './components/TrainerDashboard';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import { fetchAllCourses, fetchUserEnrollments, enrollInCourse } from './lib/courseService';
import { SEED_COURSES } from './data/seedCourses';
import {
  canAccessView,
  canonicalRole,
  getHomeViewForUser,
  isApproved,
  type AdminStudioModule,
} from './lib/rbac';

export default function App() {
  const { currentUser, logout, signInWithDemoAccount } = useAuth();
  const { isDark } = useTheme();
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [createCourseModalOpen, setCreateCourseModalOpen] = useState(false);
  const [initialAICourseTopic, setInitialAICourseTopic] = useState('');
  const [trainerTab, setTrainerTab] = useState<TrainerTab>('assessment-creator');
  const [adminModule, setAdminModule] = useState<AdminStudioModule>('queue');
  const [adminBroadcastOpen, setAdminBroadcastOpen] = useState(false);

  // Core LMS state
  const [courses, setCourses] = useState<AICourse[]>(SEED_COURSES);
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<AICourse>(SEED_COURSES[0]);

  // Load courses & user enrollments
  useEffect(() => {
    async function initData() {
      try {
        const loadedCourses = await fetchAllCourses();
        if (loadedCourses && loadedCourses.length > 0) {
          setCourses(loadedCourses);
        }
      } catch (err) {
        console.warn('Using seed courses:', err);
      }
    }
    initData();
  }, []);

  useEffect(() => {
    async function loadEnrollments() {
      const uid = currentUser?.id || 'demo_scholar';
      try {
        const userEnrollments = await fetchUserEnrollments(uid);
        setEnrollments(userEnrollments);
      } catch (err) {
        console.warn('Error fetching enrollments:', err);
      }
    }
    loadEnrollments();
  }, [currentUser]);

  useEffect(() => {
    if (!canAccessView(currentUser, currentView)) {
      setCurrentView(getHomeViewForUser(currentUser));
    }
  }, [currentUser, currentView]);

  const handleLoginSuccess = (account: DemoAccount) => {
    signInWithDemoAccount(account);
    setCurrentView(getHomeViewForUser(account));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await logout();
    setCurrentView('home');
  };

  const handleOpenForgot = (email: string) => {
    setForgotEmail(email);
    setForgotModalOpen(true);
  };

  const handleNavigateToLogin = () => {
    setCurrentView('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToHome = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateIfAllowed = (view: AppView) => {
    if (!currentUser) {
      setCurrentView('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!canAccessView(currentUser, view)) {
      setCurrentView(getHomeViewForUser(currentUser));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToDashboard = () => navigateIfAllowed('dashboard');
  const handleNavigateToProfile = () => navigateIfAllowed('profile');
  const handleNavigateToProgress = () => navigateIfAllowed('progress');
  const handleNavigateToExplore = () => navigateIfAllowed('explore');

  const handleNavigateToTrainerStudio = (tab: TrainerTab = 'assessment-creator') => {
    if (!currentUser || canonicalRole(currentUser.role) !== 'trainer' || !isApproved(currentUser)) {
      navigateIfAllowed(getHomeViewForUser(currentUser));
      return;
    }
    setTrainerTab(tab);
    setCurrentView('trainer-dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToAdminStudio = (module: AdminStudioModule = 'queue') => {
    if (!currentUser || canonicalRole(currentUser.role) !== 'admin' || !isApproved(currentUser)) {
      navigateIfAllowed(getHomeViewForUser(currentUser));
      return;
    }
    setAdminModule(module);
    setCurrentView('admin-dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCreateWithTopic = (topic?: string) => {
    if (!currentUser) {
      setCurrentView('login');
      return;
    }
    if (!isApproved(currentUser) || canonicalRole(currentUser.role) === 'admin') {
      return;
    }
    if (topic) setInitialAICourseTopic(topic);
    setCreateCourseModalOpen(true);
  };

  const handleSelectCourseLayout = (course: AICourse) => {
    if (!currentUser) {
      setCurrentView('login');
      return;
    }
    setSelectedCourse(course);
    setCurrentView('course-layout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnrollAndPlay = async (course: AICourse) => {
    if (!currentUser) {
      setCurrentView('login');
      return;
    }
    const uid = currentUser?.id || 'demo_scholar';
    try {
      const enrollment = await enrollInCourse(uid, course.id);
      setEnrollments(prev => {
        const exists = prev.some(e => e.courseId === course.id);
        return exists ? prev : [enrollment, ...prev];
      });
      setSelectedCourse(course);
      setCurrentView('course-player');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.warn('Error enrolling:', err);
      setSelectedCourse(course);
      setCurrentView('course-player');
    }
  };

  const handleDirectPlay = (course: AICourse) => {
    if (!currentUser) {
      setCurrentView('login');
      return;
    }
    setSelectedCourse(course);
    setCurrentView('course-player');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCourseCreated = (newCourse: AICourse) => {
    setCourses(prev => [newCourse, ...prev]);
    setSelectedCourse(newCourse);
    setCurrentView('course-layout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateEnrollment = (updated: CourseEnrollment) => {
    setEnrollments(prev => {
      const idx = prev.findIndex(e => e.id === updated.id || (e.courseId === updated.courseId && e.userId === updated.userId));
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updated;
        return copy;
      }
      return [updated, ...prev];
    });
  };

  const handleNotificationNavigateToCourse = (courseId: string) => {
    const match = courses.find(c => c.id === courseId);
    if (match) {
      setSelectedCourse(match);
      setCurrentView('course-player');
    } else {
      setCurrentView('dashboard');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToastNavigate = (view: string, courseId?: string) => {
    if (courseId) {
      handleNotificationNavigateToCourse(courseId);
      return;
    }
    if (view === 'dashboard' || view === 'progress' || view === 'explore' || view === 'profile') {
      setCurrentView(view as AppView);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Find active enrollment for selected course
  const currentEnrollment = enrollments.find(e => e.courseId === selectedCourse?.id) || null;

  return (
    <div className={`min-h-screen relative overflow-x-hidden flex flex-col justify-between transition-colors duration-300 ${
      isDark 
        ? 'bg-[#090a0c] text-zinc-100 selection:bg-[#40e3bd]/30 selection:text-[#40e3bd]' 
        : 'bg-[#f8fafc] text-slate-900 selection:bg-teal-500/30 selection:text-teal-900'
    }`}>
      {/* Dynamic 4-Layer Animated Background in Grey Shades */}
      <BackgroundMesh />

      {/* Top Navigation */}
      <Navbar 
        currentView={currentView}
        currentUser={currentUser}
        trainerTab={trainerTab}
        adminModule={adminModule}
        onNavigateHome={handleNavigateToHome}
        onNavigateLogin={handleNavigateToLogin}
        onNavigateDashboard={handleNavigateToDashboard}
        onNavigateExplore={handleNavigateToExplore}
        onNavigateProgress={handleNavigateToProgress}
        onNavigateProfile={handleNavigateToProfile}
        onNavigateTrainerStudio={handleNavigateToTrainerStudio}
        onNavigateAdminStudio={handleNavigateToAdminStudio}
        onOpenBroadcast={() => setAdminBroadcastOpen(true)}
        onOpenCreateCourse={() => handleOpenCreateWithTopic()}
        onHelpClick={() => setHelpModalOpen(true)} 
        onLogout={handleLogout}
      />

      {/* Main Content Area with View Routing */}
      <main className="relative z-10 flex-1 flex flex-col justify-start items-center">
        <AnimatePresence mode="wait">
          
          {/* View: User Profile (Details, stats, badges, edit bio) */}
          {currentView === 'profile' ? (
            <motion.div
              key="profile-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <UserProfileView
                currentUser={currentUser}
                courses={courses}
                enrollments={enrollments}
                onNavigateToProgress={handleNavigateToProgress}
                onNavigateToExplore={handleNavigateToExplore}
                onContinueCourse={handleDirectPlay}
                onBackToDashboard={handleNavigateToDashboard}
                onOpenCreateAIModal={handleOpenCreateWithTopic}
              />
            </motion.div>
          ) : currentView === 'progress' ? (
            /* View: My Learning Progress (Course completion tracks, chapters, stats, certificates) */
            <motion.div
              key="progress-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <MyLearningProgressView
                currentUser={currentUser}
                courses={courses}
                enrollments={enrollments}
                onContinueCourse={handleDirectPlay}
                onViewCourseLayout={handleSelectCourseLayout}
                onNavigateToExplore={handleNavigateToExplore}
                onNavigateToProfile={handleNavigateToProfile}
                onOpenCreateAIModal={handleOpenCreateWithTopic}
              />
            </motion.div>
          ) : currentView === 'explore' ? (
            /* View: Explore More Courses (Search, filters, syllabus inspection, AI prompt) */
            <motion.div
              key="explore-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <ExploreCoursesView
                currentUser={currentUser}
                courses={courses}
                enrollments={enrollments}
                onEnroll={handleEnrollAndPlay}
                onContinueCourse={handleDirectPlay}
                onViewCourseLayout={handleSelectCourseLayout}
                onOpenCreateAIModal={handleOpenCreateWithTopic}
              />
            </motion.div>
          ) : currentView === 'course-player' && selectedCourse ? (
            /* View: Course Player (Classroom Video + Markdown + Quiz) */
            <motion.div
              key="player-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <CoursePlayerView
                course={selectedCourse}
                enrollment={currentEnrollment}
                currentUser={currentUser}
                onBackToDashboard={handleNavigateToDashboard}
                onUpdateEnrollment={handleUpdateEnrollment}
              />
            </motion.div>
          ) : currentView === 'course-layout' && selectedCourse ? (
            /* View: Course Layout (Syllabus, Banner, Outcomes, Enroll) */
            <motion.div
              key="layout-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <CourseLayoutView
                course={selectedCourse}
                enrollment={currentEnrollment}
                currentUser={currentUser}
                onBack={handleNavigateToDashboard}
                onEnrollAndPlay={handleEnrollAndPlay}
                onDirectPlay={handleDirectPlay}
              />
            </motion.div>
          ) : currentView === 'admin-dashboard' ? (
            /* View: Lumina Admin Dashboard (Approval Queue, Capacity Analytics, Broadcast Center, User Directory) */
            <motion.div
              key="admin-dashboard-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <AdminDashboard
                onNavigate={(view) => {
                  if (view === 'dashboard') handleNavigateToDashboard();
                  else if (view === 'explore') handleNavigateToExplore();
                  else if (view === 'progress') handleNavigateToProgress();
                  else if (view === 'trainer-dashboard') handleNavigateToTrainerDashboard();
                  else setCurrentView(view);
                }}
              />
            </motion.div>
          ) : currentView === 'trainer-dashboard' ? (
            /* View: Lumina Trainer Dashboard (Assessment Creator, Material Library, Trainee Tracker) */
            <motion.div
              key="trainer-dashboard-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <TrainerDashboard
                currentUser={currentUser}
                courses={courses}
                onSwitchToTraineeView={handleNavigateToDashboard}
                onOpenCreateModal={() => handleOpenCreateWithTopic()}
                onSelectCourseLayout={handleSelectCourseLayout}
              />
            </motion.div>
          ) : currentView === 'dashboard' ? (
            /* View: Learning Dashboard (Enrolled tracks, explore catalog, AI studio) */
            <motion.div
              key="dashboard-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <Dashboard
                currentUser={currentUser}
                courses={courses}
                enrollments={enrollments}
                onOpenCreateModal={() => handleOpenCreateWithTopic()}
                onSelectCourseLayout={handleSelectCourseLayout}
                onContinueCourse={handleDirectPlay}
                onNavigateToProfile={handleNavigateToProfile}
                onNavigateToProgress={handleNavigateToProgress}
                onNavigateToExplore={handleNavigateToExplore}
                onNavigateToTrainerDashboard={handleNavigateToTrainerDashboard}
                onNavigateToAdminDashboard={handleNavigateToAdminDashboard}
                onUpdateEnrollment={handleUpdateEnrollment}
              />
            </motion.div>
          ) : currentView === 'login' ? (
            /* View: Official Portal Login & Registration */
            <motion.div
              key="auth-view"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-6xl mx-auto flex flex-col items-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
            >
              {/* Back to Homepage Breadcrumb */}
              <div className="w-full flex items-center justify-start mb-4">
                <button
                  id="btn-back-to-home"
                  onClick={handleNavigateToHome}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-900/90 hover:bg-[#40e3bd]/10 border border-zinc-700/60 hover:border-[#40e3bd]/50 text-xs font-semibold text-zinc-200 hover:text-[#40e3bd] transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
                >
                  <ArrowLeft className="w-4 h-4 text-[#40e3bd]" />
                  <span>Return to Institutional Homepage</span>
                </button>
              </div>

              {/* Central Top Brand Header */}
              <div className="mb-6 sm:mb-8 text-center">
                <LuminaLogo size="lg" showTagline={true} />
              </div>

              {/* Main Split Layout: Learning Showcase & Login Form */}
              <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-8 xl:gap-14">
                <LearningShowcase />
                <div className="w-full lg:w-auto flex justify-center">
                  <LoginForm
                    onLoginSuccess={handleLoginSuccess}
                    onOpenForgotPassword={handleOpenForgot}
                  />
                </div>
              </div>

              <div className="mt-8 text-center text-xs text-zinc-400">
                <span>Want to review public courses and curriculum? </span>
                <button
                  onClick={handleNavigateToExplore}
                  className="text-[#40e3bd] hover:text-[#a3f7e2] font-semibold underline underline-offset-4 cursor-pointer"
                >
                  Browse Course Catalog
                </button>
              </div>
            </motion.div>
          ) : (
            /* View: Default Institutional Homepage */
            <motion.div
              key="homepage-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <HomePage 
                onNavigateToLogin={handleNavigateToLogin}
                onNavigateToDashboard={handleNavigateToDashboard}
                onNavigateToExplore={handleNavigateToExplore}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Modals */}
      <AICourseCreatorModal
        isOpen={createCourseModalOpen}
        onClose={() => {
          setCreateCourseModalOpen(false);
          setInitialAICourseTopic('');
        }}
        onCourseCreated={handleCourseCreated}
        initialTopic={initialAICourseTopic}
      />

      <ForgotPasswordModal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        defaultEmail={forgotEmail}
      />

      <HelpModal
        isOpen={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
      />

      {/* Persistent Live Notifications Slide-Out Drawer - Authenticated Only */}
      {currentUser && (
        <LiveNotificationsDrawer
          onNavigateToCourse={handleNotificationNavigateToCourse}
          onNavigateToProgress={handleNavigateToProgress}
          onNavigateToDashboard={handleNavigateToDashboard}
          onNavigateToExplore={handleNavigateToExplore}
        />
      )}

      {/* Real-time Floating Notification Toast HUD - Authenticated Only */}
      {currentUser && (
        <LiveNotificationToast onNavigate={handleToastNavigate} />
      )}
    </div>
  );
}
