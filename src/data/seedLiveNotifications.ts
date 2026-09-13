import type { LiveNotificationItem } from '../types';

export const SEED_LIVE_NOTIFICATIONS: LiveNotificationItem[] = [
  {
    id: 'notif-dl-1',
    type: 'deadline',
    title: 'Macroeconomic SUT Analysis Case Study Due',
    description: 'Submission portal closes in 16 hours. Upload your supply-use matrix reconciling Gross Fixed Capital Formation (GFCF).',
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 min ago
    read: false,
    priority: 'urgent',
    pinned: true,
    deadlineInfo: {
      assignmentTitle: 'Supply-Use Matrix & GFCF Reconciliation Model',
      courseTitle: 'National Accounts Statistics & Supply-Use Tables (SUT)',
      courseId: 'crs-1',
      dueDate: 'Tomorrow at 17:00 IST',
      dueInHours: 16,
      submitted: false,
      submissionFormat: 'Python Notebook / PDF SUT Table',
      weightage: '25% of Cadre Grade'
    },
    actionText: 'Open Assignment',
    targetView: 'dashboard',
    targetCourseId: 'crs-1'
  },
  {
    id: 'notif-peer-1',
    type: 'peer',
    title: 'Dr. Ananya Sharma commented on your thread',
    description: '"Your synthesis of SNA 2008 FISIM allocation vs SNA 2025 digital asset treatment is spot-on. Can you check my formula for data capitalization?"',
    timestamp: new Date(Date.now() - 1000 * 60 * 85).toISOString(), // 85 min ago
    read: false,
    priority: 'high',
    peerInfo: {
      peerName: 'Dr. Ananya Sharma',
      peerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      peerRole: 'Senior Research Fellow, MoSPI AI Unit',
      interactionType: 'comment',
      targetTopic: 'National Income Accounting & Digital Assets (SNA 2025)',
      snippet: 'Your synthesis of SNA 2008 FISIM allocation vs SNA 2025 digital asset treatment is spot-on. Can you check my formula for data capitalization?',
      repliesCount: 3
    },
    actionText: 'Reply in Discussion',
    targetView: 'dashboard'
  },
  {
    id: 'notif-comp-1',
    type: 'completion',
    title: 'Chapter Distinction & Verifiable Credential Issued',
    description: 'You completed Chapter 2 "Gross Fixed Capital Formation (GFCF) & Deflator Mechanics" with distinction (Grade A+, 96%).',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
    read: false,
    priority: 'normal',
    completionInfo: {
      courseTitle: 'National Accounts Statistics & Supply-Use Tables (SUT)',
      courseId: 'crs-1',
      chapterTitle: 'GFCF & Price Deflator Calculation',
      learnerName: 'You (Officer Cadre)',
      isSelf: true,
      grade: 'Grade A+ (96%)',
      score: 96,
      badgeTitle: 'Macroeconomic Aggregates Master',
      certificateId: 'MoSPI-SNA-2026-9042',
      accreditedHours: 4.5
    },
    actionText: 'View Credential',
    targetView: 'progress',
    targetCourseId: 'crs-1'
  },
  {
    id: 'notif-dl-2',
    type: 'deadline',
    title: 'CAPI Geospatial Paradata Fieldwork Audit Due',
    description: 'Deadline approaching in 42 hours. Verify enumerator GPS dwell-time heatmaps and submit survey paradata audit report.',
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(), // 6 hours ago
    read: true,
    priority: 'high',
    deadlineInfo: {
      assignmentTitle: 'Field Paradata Anomaly Detection & Geofencing Audit',
      courseTitle: 'Modern Survey Sampling & High-Frequency CAPI Telemetry',
      courseId: 'crs-2',
      dueDate: 'Sep 15, 2026 at 23:59 IST',
      dueInHours: 42,
      submitted: false,
      submissionFormat: 'CSV Audit Log + Executive Summary',
      weightage: '20% of Field Certification'
    },
    actionText: 'Review Guidelines',
    targetView: 'dashboard',
    targetCourseId: 'crs-2'
  },
  {
    id: 'notif-peer-2',
    type: 'peer',
    title: 'Rajesh Kumar endorsed your lecture note',
    description: '"Rajesh Kumar (SSS Field Lead) endorsed your note: \'Stratified Sampling Non-Response Imputation Formula with R-Indicators\'."',
    timestamp: new Date(Date.now() - 1000 * 60 * 720).toISOString(), // 12 hours ago
    read: true,
    priority: 'normal',
    peerInfo: {
      peerName: 'Rajesh Kumar',
      peerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      peerRole: 'SSS Field Operations Lead (Northern Zone)',
      interactionType: 'endorsement',
      targetTopic: 'Non-Response Weighting & R-Indicator Imputation',
      snippet: 'This clear explanation helped our 14 field supervisors calibrate boundary weights during the quarterly NSS cycle.',
      repliesCount: 1
    },
    actionText: 'View Note',
    targetView: 'progress'
  },
  {
    id: 'notif-comp-2',
    type: 'completion',
    title: 'Cadre Peer Completion: Vikram Aditya Singh',
    description: 'Vikram Aditya Singh (ISS Executive Cadre) mastered "Machine Learning in Official Macro-Forecasting" (Batch Rank #1).',
    timestamp: new Date(Date.now() - 1000 * 60 * 1200).toISOString(), // 20 hours ago
    read: true,
    priority: 'normal',
    completionInfo: {
      courseTitle: 'Machine Learning in Official Macro-Forecasting',
      courseId: 'crs-3',
      learnerName: 'Vikram Aditya Singh',
      isSelf: false,
      grade: 'Distinction (98%)',
      score: 98,
      badgeTitle: 'AI Policy Strategist',
      certificateId: 'MoSPI-AI-2026-0114',
      accreditedHours: 8
    },
    actionText: 'Congratulate Peer',
    targetView: 'explore'
  },
  {
    id: 'notif-peer-3',
    type: 'peer',
    title: 'Priya Patel requested peer code review',
    description: 'Requested your feedback on the automated Consumer Price Index (CPI) web-scraping anomaly detector pipeline.',
    timestamp: new Date(Date.now() - 1000 * 60 * 1800).toISOString(), // 30 hours ago
    read: true,
    priority: 'normal',
    peerInfo: {
      peerName: 'Priya Patel',
      peerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      peerRole: 'Statistical Officer, Price Statistics Division',
      interactionType: 'review_request',
      targetTopic: 'Automated CPI High-Frequency Scraper & Outlier Filter',
      snippet: 'We incorporated the Tukey interquartile range filter as discussed; could you double-check the extreme price volatility threshold in line 84?',
      repliesCount: 2
    },
    actionText: 'Review Pipeline',
    targetView: 'dashboard'
  },
  {
    id: 'notif-dl-3',
    type: 'deadline',
    title: 'Econometric Deflator Calibration Submission',
    description: 'Due in 5 days. Submit your benchmark simulation comparing Fisher and Paasche chained volume indices.',
    timestamp: new Date(Date.now() - 1000 * 60 * 2400).toISOString(), // 40 hours ago
    read: true,
    priority: 'low',
    deadlineInfo: {
      assignmentTitle: 'Fisher vs Paasche Volume Index Simulation',
      courseTitle: 'Official Statistics & Macroeconomic Aggregates',
      courseId: 'crs-seed-1',
      dueDate: 'Sep 18, 2026 at 18:00 IST',
      dueInHours: 120,
      submitted: false,
      submissionFormat: 'Spreadsheet / R Script',
      weightage: '15% of Cadre Grade'
    },
    actionText: 'View Details',
    targetView: 'dashboard',
    targetCourseId: 'crs-seed-1'
  }
];
