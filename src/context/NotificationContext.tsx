import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { LiveNotificationItem, LiveNotificationType } from '../types';
import { SEED_LIVE_NOTIFICATIONS } from '../data/seedLiveNotifications';
import { playNotificationChime } from '../lib/notificationAudio';

interface NotificationContextValue {
  notifications: LiveNotificationItem[];
  unreadCount: number;
  urgentDeadlinesCount: number;
  peerMentionsCount: number;
  completionsCount: number;
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  markAsRead: (id: string) => void;
  markAsUnread: (id: string) => void;
  markAllAsRead: () => void;
  dismissNotification: (id: string) => void;
  submitAssignment: (id: string) => void;
  replyToPeer: (id: string, replyText: string) => void;
  addNotification: (item: Omit<LiveNotificationItem, 'id' | 'timestamp' | 'read'> & { read?: boolean }) => void;
  simulateIncoming: (type?: LiveNotificationType) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  filter: 'all' | 'deadline' | 'completion' | 'peer';
  setFilter: (f: 'all' | 'deadline' | 'completion' | 'peer') => void;
  unreadOnly: boolean;
  setUnreadOnly: (val: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeToast: LiveNotificationItem | null;
  dismissToast: () => void;
  resetNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

const STORAGE_KEY = 'lumina_live_notifications_v1';
const SOUND_STORAGE_KEY = 'lumina_notification_sound_v1';

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<LiveNotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved notifications from storage', e);
    }
    return SEED_LIVE_NOTIFICATIONS;
  });

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(SOUND_STORAGE_KEY);
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const [filter, setFilter] = useState<'all' | 'deadline' | 'completion' | 'peer'>('all');
  const [unreadOnly, setUnreadOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeToast, setActiveToast] = useState<LiveNotificationItem | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.warn('Failed to persist notifications', e);
    }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem(SOUND_STORAGE_KEY, soundEnabled.toString());
    } catch (e) {
      console.warn('Failed to persist sound preference', e);
    }
  }, [soundEnabled]);

  // Derived counts
  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const urgentDeadlinesCount = useMemo(() => {
    return notifications.filter(n => n.type === 'deadline' && (n.priority === 'urgent' || n.priority === 'high') && !n.deadlineInfo?.submitted).length;
  }, [notifications]);

  const peerMentionsCount = useMemo(() => {
    return notifications.filter(n => n.type === 'peer' && !n.read).length;
  }, [notifications]);

  const completionsCount = useMemo(() => {
    return notifications.filter(n => n.type === 'completion').length;
  }, [notifications]);

  // Drawer handlers
  const openDrawer = useCallback(() => setIsOpen(true), []);
  const closeDrawer = useCallback(() => setIsOpen(false), []);
  const toggleDrawer = useCallback(() => setIsOpen(prev => !prev), []);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => {
      const next = !prev;
      if (next) {
        playNotificationChime('normal');
      }
      return next;
    });
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAsUnread = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: false } : n));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const submitAssignment = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => {
      if (n.id === id && n.deadlineInfo) {
        return {
          ...n,
          read: true,
          title: `[Submitted] ${n.deadlineInfo.assignmentTitle}`,
          description: `Assignment successfully uploaded to MoSPI evaluation server. Pending academic review.`,
          deadlineInfo: {
            ...n.deadlineInfo,
            submitted: true
          }
        };
      }
      return n;
    }));
  }, []);

  const replyToPeer = useCallback((id: string, replyText: string) => {
    if (!replyText.trim()) return;
    setNotifications(prev => prev.map(n => {
      if (n.id === id && n.peerInfo) {
        return {
          ...n,
          read: true,
          peerInfo: {
            ...n.peerInfo,
            repliesCount: (n.peerInfo.repliesCount || 0) + 1,
            lastReply: replyText.trim()
          }
        };
      }
      return n;
    }));
  }, []);

  const addNotification = useCallback((item: Omit<LiveNotificationItem, 'id' | 'timestamp' | 'read'> & { read?: boolean }) => {
    const newId = `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newItem: LiveNotificationItem = {
      ...item,
      id: newId,
      timestamp: new Date().toISOString(),
      read: item.read ?? false
    };

    setNotifications(prev => [newItem, ...prev]);

    // Audio cue
    if (soundEnabled) {
      if (newItem.type === 'deadline') playNotificationChime('urgent');
      else if (newItem.type === 'completion') playNotificationChime('completion');
      else if (newItem.type === 'peer') playNotificationChime('peer');
      else playNotificationChime('normal');
    }

    // Trigger floating toast
    setActiveToast(newItem);
  }, [soundEnabled]);

  const dismissToast = useCallback(() => {
    setActiveToast(null);
  }, []);

  // Auto-dismiss toast after 6 seconds
  useEffect(() => {
    if (!activeToast) return;
    const timer = setTimeout(() => {
      setActiveToast(null);
    }, 6000);
    return () => clearTimeout(timer);
  }, [activeToast]);

  // Simulation engine for testing real-time events
  const simulateIncoming = useCallback((type?: LiveNotificationType) => {
    const types: LiveNotificationType[] = ['deadline', 'completion', 'peer'];
    const chosenType = type || types[Math.floor(Math.random() * types.length)];

    if (chosenType === 'deadline') {
      const hours = Math.floor(Math.random() * 24) + 6;
      addNotification({
        type: 'deadline',
        title: 'New Assignment: National Accounts Rebasing Exercise',
        description: `National Accounts Division has posted a high-priority calibration assignment due in ${hours} hours.`,
        priority: 'urgent',
        deadlineInfo: {
          assignmentTitle: 'National Accounts Rebasing Exercise & Chain Volume Index',
          courseTitle: 'National Accounts Statistics & Supply-Use Tables (SUT)',
          courseId: 'crs-1',
          dueDate: `In ${hours} hours`,
          dueInHours: hours,
          submitted: false,
          submissionFormat: 'Jupyter Notebook / Excel Model',
          weightage: '20% of Cadre Grade'
        },
        actionText: 'Inspect Assignment',
        targetView: 'dashboard',
        targetCourseId: 'crs-1'
      });
    } else if (chosenType === 'completion') {
      const grades = ['Distinction (Grade A+, 98%)', 'Honor Roll (Grade A, 93%)', 'Cadre Top 1% (Grade A+, 99%)'];
      const grade = grades[Math.floor(Math.random() * grades.length)];
      addNotification({
        type: 'completion',
        title: 'Survey Telemetry Credential Minted',
        description: `You successfully validated all 5 CAPI paradata modules. Your verifiable certificate has been stamped by NSSTA.`,
        priority: 'normal',
        completionInfo: {
          courseTitle: 'Modern Survey Sampling & High-Frequency CAPI Telemetry',
          courseId: 'crs-2',
          chapterTitle: 'CAPI Paradata Geofencing & Real-Time Enumeration Verification',
          learnerName: 'You (Officer Cadre)',
          isSelf: true,
          grade,
          score: 95,
          badgeTitle: 'Survey Architect',
          certificateId: `MoSPI-SURV-${Date.now().toString().slice(-4)}`,
          accreditedHours: 6.0
        },
        actionText: 'View Credential',
        targetView: 'progress',
        targetCourseId: 'crs-2'
      });
    } else {
      const peers = [
        {
          name: 'Sunita Rao',
          role: 'Deputy Director, National Sample Survey Office (NSSO)',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
          snippet: 'Shared feedback on your microdata anonymization script: "The k-anonymity threshold you configured satisfies ISO 27701 perfectly!"'
        },
        {
          name: 'Col. Arvind Mehra',
          role: 'Joint Director, Mission Karmayogi Capacity Cell',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
          snippet: 'Invited you to co-author the official iGOT Macroeconomic Model benchmark review.'
        }
      ];
      const peer = peers[Math.floor(Math.random() * peers.length)];
      addNotification({
        type: 'peer',
        title: `${peer.name} commented on your submission`,
        description: `"${peer.snippet}"`,
        priority: 'high',
        peerInfo: {
          peerName: peer.name,
          peerAvatar: peer.avatar,
          peerRole: peer.role,
          interactionType: 'comment',
          targetTopic: 'Institutional Review Thread',
          snippet: peer.snippet,
          repliesCount: 0
        },
        actionText: 'Reply to Peer',
        targetView: 'dashboard'
      });
    }
  }, [addNotification]);

  const resetNotifications = useCallback(() => {
    setNotifications(SEED_LIVE_NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value: NotificationContextValue = {
    notifications,
    unreadCount,
    urgentDeadlinesCount,
    peerMentionsCount,
    completionsCount,
    isOpen,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    dismissNotification,
    submitAssignment,
    replyToPeer,
    addNotification,
    simulateIncoming,
    soundEnabled,
    toggleSound,
    filter,
    setFilter,
    unreadOnly,
    setUnreadOnly,
    searchQuery,
    setSearchQuery,
    activeToast,
    dismissToast,
    resetNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useLiveNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useLiveNotifications must be used within a NotificationProvider');
  }
  return context;
}
