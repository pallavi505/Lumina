import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Sparkles, 
  Award, 
  BookOpen, 
  RefreshCw, 
  Clock, 
  ExternalLink, 
  Calendar, 
  CheckCircle2, 
  Search,
  Star,
  Zap,
  Tag
} from 'lucide-react';
import type { NotificationsData, AnnouncementItem, AchievementItem, CourseItem } from '../types';
import { defaultNotifications } from '../data/defaultNotifications';

interface AnnouncementBoardProps {
  onSelectCourse?: (course: CourseItem) => void;
  onOpenAuth?: () => void;
}

export default function AnnouncementBoard({ onSelectCourse, onOpenAuth }: AnnouncementBoardProps) {
  const [data, setData] = useState<NotificationsData>(defaultNotifications);
  const [activeTab, setActiveTab] = useState<'announcements' | 'achievements' | 'courses'>('announcements');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementItem | null>(null);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.warn('Using default notifications cache:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Filter announcements
  const filteredAnnouncements = data.announcements.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  return (
    <section 
      id="announcements"
      className="relative z-20 w-full max-w-6xl mx-auto px-4 py-8 sm:py-12"
    >
      {/* Container Card with Glassmorphism in Grey Shades */}
      <div className="rounded-3xl bg-zinc-900/85 backdrop-blur-2xl border border-zinc-800/90 p-6 sm:p-8 lumina-glow-card shadow-2xl relative overflow-hidden">
        {/* Background Ambient Glow (Silvery Graphite) */}
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-zinc-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-neutral-400/10 blur-3xl pointer-events-none" />

        {/* Board Header Bar */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800/70">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="p-1.5 rounded-lg bg-[#40e3bd]/10 text-[#40e3bd] border border-[#40e3bd]/30">
                <Bell className="w-4 h-4" />
              </span>
              <span className="text-xs uppercase tracking-widest font-mono text-[#40e3bd] font-semibold">
                MoSPI Dissemination Gateway
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-zinc-800/80 border border-zinc-700/60 text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-[#40e3bd] animate-pulse" />
                Live API: /api/notifications
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-white tracking-tight">
              Public Announcement Board
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-['Inter'] mt-0.5">
              Official circulars, national capacity achievements, and newly certified statistical curriculum.
            </p>
          </div>

          {/* Refresh & Live Sync Action */}
          <div className="flex items-center gap-3">
            <button
              id="btn-refresh-notifications"
              onClick={fetchNotifications}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800/80 hover:bg-[#40e3bd]/10 border border-zinc-700/60 hover:border-[#40e3bd]/40 text-xs font-medium text-zinc-300 hover:text-[#40e3bd] transition-all cursor-pointer disabled:opacity-60"
              title="Refresh from /api/notifications"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#40e3bd] ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Syncing...' : 'Live Refresh'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="relative z-10 flex items-center gap-2 pt-6 pb-4 overflow-x-auto no-scrollbar border-b border-zinc-800/60">
          <button
            id="tab-announcements"
            onClick={() => setActiveTab('announcements')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold font-['Space_Grotesk'] transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'announcements'
                ? 'bg-gradient-to-r from-[#40e3bd] to-[#20b892] text-[#052219] font-bold shadow-[0_0_20px_rgba(64,227,189,0.35)] border border-[#40e3bd]'
                : 'text-zinc-400 hover:text-[#40e3bd] hover:bg-[#40e3bd]/10 border border-transparent'
            }`}
          >
            <Bell className={`w-4 h-4 ${activeTab === 'announcements' ? 'text-[#052219]' : 'text-zinc-400'}`} />
            <span>Announcements & Circulars</span>
            <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[11px] font-mono ${activeTab === 'announcements' ? 'bg-[#082a21] text-[#72f9dc]' : 'bg-zinc-950 text-zinc-300'}`}>
              {data.announcements.length}
            </span>
          </button>

          <button
            id="tab-achievements"
            onClick={() => setActiveTab('achievements')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold font-['Space_Grotesk'] transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'achievements'
                ? 'bg-gradient-to-r from-[#40e3bd] to-[#20b892] text-[#052219] font-bold shadow-[0_0_20px_rgba(64,227,189,0.35)] border border-[#40e3bd]'
                : 'text-zinc-400 hover:text-[#40e3bd] hover:bg-[#40e3bd]/10 border border-transparent'
            }`}
          >
            <Award className={`w-4 h-4 ${activeTab === 'achievements' ? 'text-[#052219]' : 'text-zinc-400'}`} />
            <span>National Achievements</span>
            <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[11px] font-mono ${activeTab === 'achievements' ? 'bg-[#082a21] text-[#72f9dc]' : 'bg-zinc-950 text-zinc-300'}`}>
              {data.achievements.length}
            </span>
          </button>

          <button
            id="tab-courses"
            onClick={() => setActiveTab('courses')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold font-['Space_Grotesk'] transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'courses'
                ? 'bg-gradient-to-r from-[#40e3bd] to-[#20b892] text-[#052219] font-bold shadow-[0_0_20px_rgba(64,227,189,0.35)] border border-[#40e3bd]'
                : 'text-zinc-400 hover:text-[#40e3bd] hover:bg-[#40e3bd]/10 border border-transparent'
            }`}
          >
            <BookOpen className={`w-4 h-4 ${activeTab === 'courses' ? 'text-[#052219]' : 'text-zinc-400'}`} />
            <span>Newly Added Courses</span>
            <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[11px] font-mono ${activeTab === 'courses' ? 'bg-[#082a21] text-[#72f9dc]' : 'bg-zinc-950 text-zinc-300'}`}>
              {data.newCourses.length}
            </span>
          </button>
        </div>

        {/* Tab Content 1: Announcements */}
        {activeTab === 'announcements' && (
          <div className="pt-6">
            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search announcements, ISS, or MoSPI..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0a0a0c] border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#40e3bd] focus:ring-1 focus:ring-[#40e3bd]/30"
                />
              </div>

              <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                {['all', 'Policy Update', 'iGOT Integration', 'Security', 'Competition'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'bg-[#40e3bd]/20 text-[#40e3bd] border border-[#40e3bd]/50 font-semibold'
                        : 'text-zinc-400 hover:text-[#40e3bd] bg-[#0a0a0c] border border-zinc-800/60 hover:border-[#40e3bd]/30'
                    }`}
                  >
                    {cat === 'all' ? 'All Tags' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Announcements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAnnouncements.map((item) => (
                <motion.div
                  key={item.id}
                  id={`announcement-card-${item.id}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setSelectedAnnouncement(item)}
                  className="p-5 rounded-2xl bg-[#0a0a0c]/80 border border-zinc-800/80 hover:border-[#40e3bd]/50 hover:bg-zinc-900/60 hover:shadow-[0_0_20px_rgba(64,227,189,0.1)] transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#40e3bd]/10 text-[#40e3bd] border border-[#40e3bd]/30">
                        {item.category}
                      </span>

                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-[#40e3bd]/15 text-[#72f9dc] border border-[#40e3bd]/40">
                            {item.badge}
                          </span>
                        )}
                        <span className="text-[11px] text-zinc-400 flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3 text-[#40e3bd]" />
                          {item.date}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-white font-['Space_Grotesk'] group-hover:text-[#40e3bd] transition-colors leading-snug">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-xs text-zinc-300 font-['Inter'] line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-400">
                    <span className="truncate max-w-[200px]">{item.author}</span>
                    <span className="text-[#40e3bd] group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-medium">
                      Details <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content 2: Achievements */}
        {activeTab === 'achievements' && (
          <div className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.achievements.map((ach) => (
                <div
                  key={ach.id}
                  className="p-6 rounded-2xl bg-[#0a0a0c]/80 border border-zinc-800/80 hover:border-[#40e3bd]/40 transition-all flex flex-col justify-between hover:shadow-[0_0_20px_rgba(64,227,189,0.1)]"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="text-3xl font-extrabold font-['Space_Grotesk'] bg-gradient-to-r from-white via-[#a3f7e2] to-[#40e3bd] bg-clip-text text-transparent">
                        {ach.metric}
                      </div>
                      <h3 className="text-sm font-bold text-white font-['Space_Grotesk'] mt-1">
                        {ach.subtitle}
                      </h3>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-[#40e3bd]/10 border border-[#40e3bd]/30 flex items-center justify-center text-[#40e3bd]">
                      <Award className="w-5 h-5" />
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 font-['Inter'] leading-relaxed pt-3 border-t border-zinc-800/60">
                    {ach.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content 3: Newly Added Courses */}
        {activeTab === 'courses' && (
          <div className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {data.newCourses.map((course) => (
                <div
                  key={course.id}
                  id={`course-card-${course.id}`}
                  className="p-5 rounded-2xl bg-[#0a0a0c]/80 border border-zinc-800/80 hover:border-[#40e3bd]/50 hover:shadow-[0_0_20px_rgba(64,227,189,0.1)] transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#40e3bd]/10 text-[#40e3bd] border border-[#40e3bd]/30">
                          {course.code}
                        </span>
                        <span className="text-xs text-zinc-400 font-['Inter']">
                          {course.level}
                        </span>
                      </div>

                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#40e3bd]/10 text-[#72f9dc] border border-[#40e3bd]/30">
                        {course.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white font-['Space_Grotesk'] group-hover:text-[#40e3bd] transition-colors">
                      {course.title}
                    </h3>

                    <p className="text-xs text-zinc-400 font-['Inter'] mt-1">
                      Provider: <span className="text-zinc-200 font-medium">{course.provider}</span>
                    </p>

                    <div className="mt-3 p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300 font-mono">
                      {course.curriculum}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-800/60 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3 text-xs text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-zinc-400" />
                        {course.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-[#40e3bd] fill-[#40e3bd]" />
                        {course.rating} ({course.enrolledCount} enrolled)
                      </span>
                    </div>

                    <button
                      id={`btn-enroll-${course.id}`}
                      onClick={() => {
                        if (onSelectCourse) onSelectCourse(course);
                        if (onOpenAuth) onOpenAuth();
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#40e3bd] via-[#35d8b2] to-[#20b892] hover:from-[#5ef8d5] hover:to-[#35d8b2] text-[#052219] font-bold font-['Space_Grotesk'] text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(64,227,189,0.25)]"
                    >
                      <span>Enroll / Syllabus</span>
                      <ExternalLink className="w-3 h-3 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal for Selected Announcement */}
      <AnimatePresence>
        {selectedAnnouncement && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl rounded-2xl bg-zinc-900 border border-[#40e3bd]/30 p-6 shadow-2xl relative text-zinc-100"
            >
              <div className="flex items-center justify-between gap-2 pb-4 border-b border-zinc-800">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#40e3bd]/10 text-[#40e3bd] border border-[#40e3bd]/30">
                  {selectedAnnouncement.category}
                </span>
                <span className="text-xs text-zinc-400 font-mono">
                  {selectedAnnouncement.date}
                </span>
              </div>

              <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white mt-4">
                {selectedAnnouncement.title}
              </h3>

              <p className="mt-3 text-sm text-zinc-300 font-['Inter'] leading-relaxed">
                {selectedAnnouncement.description}
              </p>

              <div className="mt-6 p-3 rounded-xl bg-[#0a0a0c] border border-zinc-800 text-xs text-zinc-400">
                <span className="font-semibold text-zinc-300">Issuing Authority:</span>{' '}
                {selectedAnnouncement.author}
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedAnnouncement(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors cursor-pointer"
                >
                  Close
                </button>
                {onOpenAuth && (
                  <button
                    onClick={() => {
                      setSelectedAnnouncement(null);
                      onOpenAuth();
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#40e3bd] via-[#35d8b2] to-[#20b892] hover:from-[#5ef8d5] hover:to-[#35d8b2] text-[#052219] font-bold text-xs font-['Space_Grotesk'] transition-colors cursor-pointer shadow-[0_0_15px_rgba(64,227,189,0.25)]"
                  >
                    Login to Access Full Document
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
