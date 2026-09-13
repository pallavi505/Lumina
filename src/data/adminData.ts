import type { UserRole } from '../types';

export interface PendingRegistrationRequest {
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
}

export interface UserPermissions {
  canAuthorCourses: boolean;
  canGenerateAIAssessments: boolean;
  canAccessRawTelemetry: boolean;
  canApproveRequests: boolean;
  canBroadcastAnnouncements: boolean;
  hasAuditAccess: boolean;
}

export interface ManagedUser {
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
}

export interface SkillGapCell {
  department: string;
  skillDomain: string;
  gapPercentage: number; // 0 - 100%
  personnelAffected: number;
  urgency: 'Low' | 'Moderate' | 'High' | 'Critical';
  recommendedCourse: string;
  recommendedCourseId?: string;
  rootCause: string;
}

export interface BroadcastItem {
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
}

// ==========================================
// SEED PENDING REGISTRATIONS
// ==========================================
export const SEED_PENDING_REQUESTS: PendingRegistrationRequest[] = [
  {
    id: 'req-tr-101',
    type: 'trainee',
    name: 'Ananya Deshmukh',
    email: 'ananya.d@mospi.gov.in',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    cadre: 'ISS Probationer (Batch 2026)',
    department: 'National Accounts Division (NAD)',
    institution: 'Ministry of Statistics and Programme Implementation',
    employeeId: 'GOI-ISS-2026-4819',
    idVerificationStatus: 'verified',
    govEmailVerified: true,
    requestedRole: 'trainee',
    requestedAccessTier: 'Standard Trainee Accreditation',
    submissionDate: 'Sep 12, 2026',
    statementOfIntent: 'Joining the National Accounts Division to work on Supply-Use Table (SUT) rebasing and quarterly GDP compilation. Requesting full access to SNA 2008 simulation sandbox and assessment modules.',
    documents: [
      { name: 'MoSPI_Appointment_Letter_ISS_2026.pdf', type: 'PDF', size: '1.4 MB', verified: true },
      { name: 'Aadhaar_Govt_Card_ID.pdf', type: 'PDF', size: '820 KB', verified: true },
      { name: 'NSSTA_Joining_Endorsement.pdf', type: 'PDF', size: '540 KB', verified: true }
    ],
    recommendationBy: 'Dr. V. K. Malhotra, Deputy Director General (NAD)',
    status: 'pending'
  },
  {
    id: 'req-tr-102',
    type: 'trainee',
    name: 'Rajesh Kumar Meena',
    email: 'rk.meena@fod.nic.in',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    cadre: 'Senior Statistical Officer (SSO)',
    department: 'Field Operations Directorate (FOD - NSSO)',
    institution: 'National Sample Survey Office, Jaipur Regional Office',
    employeeId: 'NSSO-SSO-8924',
    idVerificationStatus: 'verified',
    govEmailVerified: true,
    requestedRole: 'trainee',
    requestedAccessTier: 'CAPI Field Specialist Tier',
    submissionDate: 'Sep 11, 2026',
    statementOfIntent: 'Overseeing multi-stage stratified sampling and geospatial audit trails in western regional surveys. Need certification in High-Frequency CAPI Telemetry and automated anomaly detection.',
    documents: [
      { name: 'FOD_Regional_Office_Deputation.pdf', type: 'PDF', size: '2.1 MB', verified: true },
      { name: 'Govt_Identity_Card_NIC.pdf', type: 'PDF', size: '690 KB', verified: true }
    ],
    recommendationBy: 'Smt. Sunita Rao, Regional Joint Director (FOD)',
    status: 'pending'
  },
  {
    id: 'req-tr-103',
    type: 'trainee',
    name: 'Kavita Sundaram',
    email: 'kavita.s@des.tn.gov.in',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    cadre: 'District Statistical Officer (DSO)',
    department: 'State Directorate of Economics & Statistics (DES)',
    institution: 'Government of Tamil Nadu, Chennai',
    employeeId: 'TN-DES-2023-1120',
    idVerificationStatus: 'pending_id_check',
    govEmailVerified: true,
    requestedRole: 'trainee',
    requestedAccessTier: 'State Capacity-Building Track',
    submissionDate: 'Sep 10, 2026',
    statementOfIntent: 'Coordinating state domestic product (SDP) estimation and district-level economic indicators under the Centrally Sponsored Scheme.',
    documents: [
      { name: 'TN_DES_Nomination_Letter.pdf', type: 'PDF', size: '1.8 MB', verified: false },
      { name: 'State_Govt_Service_Book_Extract.pdf', type: 'PDF', size: '1.2 MB', verified: true }
    ],
    recommendationBy: 'Director of Economics & Statistics, Tamil Nadu',
    status: 'pending'
  },
  {
    id: 'req-tr-104',
    type: 'trainee',
    name: 'Arjun Vikram Rathore',
    email: 'arjun.rathore@diid.gov.in',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    cadre: 'Junior Statistical Officer (JSO)',
    department: 'Data Informatics & Innovation Division (DIID)',
    institution: 'MoSPI New Delhi',
    employeeId: 'MOSPI-JSO-2025-3341',
    idVerificationStatus: 'verified',
    govEmailVerified: true,
    requestedRole: 'trainee',
    requestedAccessTier: 'Standard Trainee',
    submissionDate: 'Sep 09, 2026',
    statementOfIntent: 'Assigned to big data microdata ingestion pipelines and API-based dissemination. Requesting AI and Automated Imputation track access.',
    documents: [
      { name: 'Joining_Order_DIID.pdf', type: 'PDF', size: '1.1 MB', verified: true }
    ],
    status: 'pending'
  },
  // Pending Trainers
  {
    id: 'req-fac-201',
    type: 'trainer',
    name: 'Prof. Debashis Sen',
    email: 'dsen@isical.ac.in',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    cadre: 'Professor & Head of Econometrics',
    department: 'Theoretical Statistics & Applied Econometrics',
    institution: 'Indian Statistical Institute (ISI) Kolkata',
    employeeId: 'ISI-FAC-9921',
    idVerificationStatus: 'verified',
    govEmailVerified: true,
    requestedRole: 'trainer',
    requestedAccessTier: 'Master Course Author & Examiner',
    submissionDate: 'Sep 11, 2026',
    statementOfIntent: 'Invited by MoSPI to develop the advanced 6-week module on "Machine Learning Applications in Official Economic Imputation & GST Anomaly Detection". Need course authoring, Gemini AI assessment generator, and evaluation permissions.',
    documents: [
      { name: 'MoSPI_Standing_Committee_MoU.pdf', type: 'PDF', size: '3.4 MB', verified: true },
      { name: 'ISI_NOC_Faculty_Deputation.pdf', type: 'PDF', size: '1.5 MB', verified: true },
      { name: 'CV_Academic_Publications_2026.pdf', type: 'PDF', size: '2.8 MB', verified: true }
    ],
    recommendationBy: 'Dr. G. P. Samanta, Ex-Chief Statistician of India',
    status: 'pending'
  },
  {
    id: 'req-fac-202',
    type: 'trainer',
    name: 'Dr. Meenakshi Sundaram',
    email: 'm.sundaram@nssta.gov.in',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    cadre: 'Joint Director (Training Faculty)',
    department: 'Price Statistics & Inflation Research',
    institution: 'National Statistical Systems Training Academy (NSSTA)',
    employeeId: 'NSSTA-DIR-4091',
    idVerificationStatus: 'verified',
    govEmailVerified: true,
    requestedRole: 'trainer',
    requestedAccessTier: 'Senior Examiner & Faculty Lead',
    submissionDate: 'Sep 10, 2026',
    statementOfIntent: 'Conducting national workshops on Consumer Price Index (CPI) basket rebasing, hedonic regression for electronics, and scanner data integration. Requesting authoring and assessment publishing rights.',
    documents: [
      { name: 'NSSTA_Faculty_Gazette_Notification.pdf', type: 'PDF', size: '1.7 MB', verified: true },
      { name: 'Govt_ID_Card.pdf', type: 'PDF', size: '920 KB', verified: true }
    ],
    recommendationBy: 'Director General, Central Statistics Office',
    status: 'pending'
  },
  {
    id: 'req-fac-203',
    type: 'trainer',
    name: 'Siddharth Chatterjee',
    email: 'siddharth.c@worldbank.org',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    cadre: 'Senior Statistical Capacity Consultant',
    department: 'Development Data Group (DECDG)',
    institution: 'The World Bank Group',
    employeeId: 'WB-DECDG-7742',
    idVerificationStatus: 'manual_review',
    govEmailVerified: false,
    requestedRole: 'trainer',
    requestedAccessTier: 'Guest Course Author',
    submissionDate: 'Sep 08, 2026',
    statementOfIntent: 'Collaborating on international best practices for System of Environmental-Economic Accounting (SEEA) and green GDP accounting.',
    documents: [
      { name: 'World_Bank_MoSPI_Capacity_Agreement.pdf', type: 'PDF', size: '2.4 MB', verified: true },
      { name: 'Passport_Copy_Redacted.pdf', type: 'PDF', size: '1.1 MB', verified: true }
    ],
    recommendationBy: 'Adviser (International Statistics), MoSPI',
    status: 'pending'
  }
];

// ==========================================
// SEED MANAGED USERS (ROLE & PERMISSION MATRIX)
// ==========================================
export const SEED_MANAGED_USERS: ManagedUser[] = [
  {
    id: 'usr-admin-1',
    name: 'Marcus Sterling',
    email: 'admin@lumina.edu',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'admin',
    cadre: 'Institutional Director & Platform Administrator',
    department: 'Ministry of Statistics and Programme Implementation (MoSPI)',
    institution: 'MoSPI National Training Academy',
    employeeId: 'MOSPI-ADMIN-001',
    status: 'active',
    joinedDate: 'Jun 15, 2022',
    lastActive: 'Just now',
    permissions: {
      canAuthorCourses: true,
      canGenerateAIAssessments: true,
      canAccessRawTelemetry: true,
      canApproveRequests: true,
      canBroadcastAnnouncements: true,
      hasAuditAccess: true
    }
  },
  {
    id: 'usr-trainer-1',
    name: 'Dr. Julian Hayes',
    email: 'trainer@lumina.edu',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'trainer',
    cadre: 'Lead Curriculum Chair & Master Trainer',
    department: 'Curriculum & Statistical Pedagogy Wing',
    institution: 'National Statistical Systems Training Academy (NSSTA)',
    employeeId: 'NSSTA-FAC-1002',
    status: 'active',
    joinedDate: 'Jan 10, 2024',
    lastActive: '12 mins ago',
    permissions: {
      canAuthorCourses: true,
      canGenerateAIAssessments: true,
      canAccessRawTelemetry: true,
      canApproveRequests: false,
      canBroadcastAnnouncements: true,
      hasAuditAccess: false
    }
  },
  {
    id: 'usr-trainee-1',
    name: 'Elena Vance',
    email: 'trainee@lumina.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'trainee',
    cadre: 'Indian Statistical Service (ISS) Trainee',
    department: 'National Accounts Division (NAD)',
    institution: 'National Statistical Systems Training Academy (NSSTA)',
    employeeId: 'GOI-ISS-2026-0042',
    status: 'active',
    joinedDate: 'Aug 01, 2026',
    lastActive: '1 hour ago',
    permissions: {
      canAuthorCourses: false,
      canGenerateAIAssessments: false,
      canAccessRawTelemetry: false,
      canApproveRequests: false,
      canBroadcastAnnouncements: false,
      hasAuditAccess: false
    }
  },
  {
    id: 'usr-trainee-2',
    name: 'Vikramaditya Nair',
    email: 'v.nair@mospi.gov.in',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'trainee',
    cadre: 'ISS Officer (Batch 2025)',
    department: 'Price Statistics Division (PSD)',
    institution: 'MoSPI New Delhi',
    employeeId: 'GOI-ISS-2025-0118',
    status: 'active',
    joinedDate: 'Feb 14, 2025',
    lastActive: '3 hours ago',
    permissions: {
      canAuthorCourses: false,
      canGenerateAIAssessments: false,
      canAccessRawTelemetry: true,
      canApproveRequests: false,
      canBroadcastAnnouncements: false,
      hasAuditAccess: false
    }
  },
  {
    id: 'usr-trainer-2',
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@nssta.gov.in',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    role: 'trainer',
    cadre: 'Deputy Director & Senior Faculty',
    department: 'Survey Design & Research Division (SDRD)',
    institution: 'NSSTA Greater Noida',
    employeeId: 'NSSTA-FAC-2041',
    status: 'active',
    joinedDate: 'Mar 20, 2024',
    lastActive: 'Yesterday',
    permissions: {
      canAuthorCourses: true,
      canGenerateAIAssessments: true,
      canAccessRawTelemetry: true,
      canApproveRequests: true,
      canBroadcastAnnouncements: false,
      hasAuditAccess: false
    }
  },
  {
    id: 'usr-trainee-3',
    name: 'Manoj Kumar Gupta',
    email: 'mk.gupta@fod.gov.in',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'trainee',
    cadre: 'Senior Statistical Officer (SSO)',
    department: 'Field Operations Directorate (FOD)',
    institution: 'NSSO Lucknow Regional Office',
    employeeId: 'NSSO-SSO-7719',
    status: 'active',
    joinedDate: 'Nov 05, 2025',
    lastActive: '4 hours ago',
    permissions: {
      canAuthorCourses: false,
      canGenerateAIAssessments: false,
      canAccessRawTelemetry: false,
      canApproveRequests: false,
      canBroadcastAnnouncements: false,
      hasAuditAccess: false
    }
  },
  {
    id: 'usr-trainee-4',
    name: 'Shreya Roy Chowdhury',
    email: 'shreya.roy@des.wb.gov.in',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'trainee',
    cadre: 'Statistical Research Officer',
    department: 'State Directorate of Economics & Statistics (DES)',
    institution: 'Government of West Bengal',
    employeeId: 'WB-DES-2024-055',
    status: 'pending',
    joinedDate: 'Sep 02, 2026',
    lastActive: '2 days ago',
    permissions: {
      canAuthorCourses: false,
      canGenerateAIAssessments: false,
      canAccessRawTelemetry: false,
      canApproveRequests: false,
      canBroadcastAnnouncements: false,
      hasAuditAccess: false
    }
  },
  {
    id: 'usr-trainee-5',
    name: 'Tsering Dorjee',
    email: 'tsering.d@fod.gov.in',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    role: 'trainee',
    cadre: 'Field Investigator & CAPI Auditor',
    department: 'Field Operations Directorate (FOD)',
    institution: 'NSSO Shimla Sub-Regional Office',
    employeeId: 'NSSO-SSO-9012',
    status: 'suspended',
    joinedDate: 'Jan 15, 2026',
    lastActive: '1 week ago',
    permissions: {
      canAuthorCourses: false,
      canGenerateAIAssessments: false,
      canAccessRawTelemetry: false,
      canApproveRequests: false,
      canBroadcastAnnouncements: false,
      hasAuditAccess: false
    }
  }
];

// ==========================================
// SYSTEM CAPACITY ANALYTICS DATA
// ==========================================
export const SEED_COURSE_ENROLLMENT_ANALYTICS = [
  {
    course: 'National Accounts (SNA 2008)',
    shortName: 'SNA 2008 SUT',
    enrolled: 4250,
    active: 3120,
    certified: 1840,
    capacityLimit: 5000,
    completionRate: 78
  },
  {
    course: 'Survey Sampling & CAPI Telemetry',
    shortName: 'Survey CAPI',
    enrolled: 8490,
    active: 6240,
    certified: 4910,
    capacityLimit: 10000,
    completionRate: 85
  },
  {
    course: 'CPI & Inflation Forecasting',
    shortName: 'CPI Forecasting',
    enrolled: 4890,
    active: 3410,
    certified: 2280,
    capacityLimit: 6000,
    completionRate: 74
  },
  {
    course: 'AI & Anomaly Detection in Admin Data',
    shortName: 'AI & Anomaly',
    enrolled: 3150,
    active: 2480,
    certified: 1210,
    capacityLimit: 4000,
    completionRate: 68
  },
  {
    course: 'Differential Privacy & Microdata QA',
    shortName: 'Diff Privacy',
    enrolled: 2650,
    active: 1890,
    certified: 980,
    capacityLimit: 3500,
    completionRate: 64
  },
  {
    course: 'Geospatial Analytics in Census',
    shortName: 'Geospatial GIS',
    enrolled: 3820,
    active: 2790,
    certified: 1650,
    capacityLimit: 5000,
    completionRate: 72
  }
];

export const SEED_DOMAIN_COMPETENCY_ANALYTICS = [
  {
    domain: 'Macroeconomic Accounts',
    certifiedMaster: 1280,
    intermediateProficient: 2410,
    foundationalDeveloping: 1850,
    totalAssessed: 5540
  },
  {
    domain: 'Field Survey & CAPI',
    certifiedMaster: 2840,
    intermediateProficient: 4290,
    foundationalDeveloping: 2180,
    totalAssessed: 9310
  },
  {
    domain: 'Price & Economic Indices',
    certifiedMaster: 1450,
    intermediateProficient: 2680,
    foundationalDeveloping: 1720,
    totalAssessed: 5850
  },
  {
    domain: 'Applied AI & Anomaly ML',
    certifiedMaster: 680,
    intermediateProficient: 1640,
    foundationalDeveloping: 2490,
    totalAssessed: 4810
  },
  {
    domain: 'Data Ethics & Governance',
    certifiedMaster: 1890,
    intermediateProficient: 3120,
    foundationalDeveloping: 1420,
    totalAssessed: 6430
  },
  {
    domain: 'SDG Indicators & Dissemination',
    certifiedMaster: 1120,
    intermediateProficient: 2150,
    foundationalDeveloping: 1980,
    totalAssessed: 5250
  }
];

// ==========================================
// STATISTICAL SYSTEM SKILL GAP HEATMAP
// ==========================================
export const STATISTICAL_DEPARTMENTS = [
  { id: 'NAD', name: 'National Accounts (NAD)', code: 'NAD' },
  { id: 'FOD', name: 'Field Operations (FOD)', code: 'FOD' },
  { id: 'PSD', name: 'Price Statistics (PSD)', code: 'PSD' },
  { id: 'DIID', name: 'Informatics & AI (DIID)', code: 'DIID' },
  { id: 'ESD', name: 'Economic Statistics (ESD)', code: 'ESD' },
  { id: 'SDRD', name: 'Survey Design & Res. (SDRD)', code: 'SDRD' },
  { id: 'DES', name: 'State DES Directorates', code: 'DES' }
];

export const SKILL_DOMAINS = [
  { id: 'sna_sut', name: 'SNA 2008 & SUT', category: 'Macroeconomics' },
  { id: 'capi_telemetry', name: 'CAPI & GPS Telemetry', category: 'Field Surveys' },
  { id: 'nowcasting', name: 'Inflation Nowcasting', category: 'Prices' },
  { id: 'ml_anomaly', name: 'ML & Auto-Imputation', category: 'Artificial Intelligence' },
  { id: 'diff_privacy', name: 'Differential Privacy', category: 'Data Governance' },
  { id: 'big_data_pipelines', name: 'Big Data Streaming', category: 'Infrastructure' }
];

export const SEED_SKILL_GAP_HEATMAP: SkillGapCell[] = [
  // NAD
  { department: 'NAD', skillDomain: 'sna_sut', gapPercentage: 14, personnelAffected: 28, urgency: 'Low', recommendedCourse: 'National Accounts Statistics & Supply-Use Tables', rootCause: 'Strong core grounding; ongoing refreshers for 2026 rebasing cycle.' },
  { department: 'NAD', skillDomain: 'capi_telemetry', gapPercentage: 38, personnelAffected: 62, urgency: 'Moderate', recommendedCourse: 'Modern Survey Sampling & High-Frequency CAPI Telemetry', rootCause: 'NAD analysts need deeper understanding of primary raw field survey telemetry.' },
  { department: 'NAD', skillDomain: 'nowcasting', gapPercentage: 22, personnelAffected: 44, urgency: 'Low', recommendedCourse: 'Consumer Price Index & Inflation Forecasting', rootCause: 'Deflator synchronization requires basic hedonic nowcasting.' },
  { department: 'NAD', skillDomain: 'ml_anomaly', gapPercentage: 58, personnelAffected: 118, urgency: 'Critical', recommendedCourse: 'AI & Machine Learning for Official Administrative Data', rootCause: 'Transitioning to automated outlier detection in corporate balance sheets (MCA21).' },
  { department: 'NAD', skillDomain: 'diff_privacy', gapPercentage: 42, personnelAffected: 84, urgency: 'High', recommendedCourse: 'Differential Privacy & Microdata QA Protocols', rootCause: 'Publishing granular supply-use matrices without violating firm confidentiality.' },
  { department: 'NAD', skillDomain: 'big_data_pipelines', gapPercentage: 52, personnelAffected: 95, urgency: 'High', recommendedCourse: 'Big Data Pipeline Engineering for Official Statistics', rootCause: 'Handling continuous GST transaction streams in real-time national accounting.' },

  // FOD
  { department: 'FOD', skillDomain: 'sna_sut', gapPercentage: 64, personnelAffected: 380, urgency: 'Critical', recommendedCourse: 'National Accounts Statistics & Supply-Use Tables', rootCause: 'Field supervisors lack contextual knowledge of how survey items feed into national accounts.' },
  { department: 'FOD', skillDomain: 'capi_telemetry', gapPercentage: 16, personnelAffected: 140, urgency: 'Low', recommendedCourse: 'Modern Survey Sampling & High-Frequency CAPI Telemetry', rootCause: 'Core field strength; periodic hardware and GPS telemetry calibration needed.' },
  { department: 'FOD', skillDomain: 'nowcasting', gapPercentage: 54, personnelAffected: 290, urgency: 'High', recommendedCourse: 'Consumer Price Index & Inflation Forecasting', rootCause: 'Urban price collection staff require scanner data validation techniques.' },
  { department: 'FOD', skillDomain: 'ml_anomaly', gapPercentage: 72, personnelAffected: 420, urgency: 'Critical', recommendedCourse: 'AI & Machine Learning for Official Administrative Data', rootCause: 'Field telemetry needs automated in-device real-time logic error detection.' },
  { department: 'FOD', skillDomain: 'diff_privacy', gapPercentage: 48, personnelAffected: 310, urgency: 'Moderate', recommendedCourse: 'Differential Privacy & Microdata QA Protocols', rootCause: 'Protection of household GPS coordinates in geo-tagged village sample files.' },
  { department: 'FOD', skillDomain: 'big_data_pipelines', gapPercentage: 68, personnelAffected: 390, urgency: 'Critical', recommendedCourse: 'Big Data Pipeline Engineering for Official Statistics', rootCause: 'Submitting simultaneous multi-state sync payloads to central servers.' },

  // PSD
  { department: 'PSD', skillDomain: 'sna_sut', gapPercentage: 32, personnelAffected: 45, urgency: 'Moderate', recommendedCourse: 'National Accounts Statistics & Supply-Use Tables', rootCause: 'Integrating producer price indices into input-output valuation layers.' },
  { department: 'PSD', skillDomain: 'capi_telemetry', gapPercentage: 24, personnelAffected: 38, urgency: 'Low', recommendedCourse: 'Modern Survey Sampling & High-Frequency CAPI Telemetry', rootCause: 'Mobile app deployment for rural price data collectors.' },
  { department: 'PSD', skillDomain: 'nowcasting', gapPercentage: 18, personnelAffected: 30, urgency: 'Low', recommendedCourse: 'Consumer Price Index & Inflation Forecasting', rootCause: 'Established division core domain with strong academic mentors.' },
  { department: 'PSD', skillDomain: 'ml_anomaly', gapPercentage: 46, personnelAffected: 72, urgency: 'Moderate', recommendedCourse: 'AI & Machine Learning for Official Administrative Data', rootCause: 'Web scraping and online price aggregator anomaly filtering.' },
  { department: 'PSD', skillDomain: 'diff_privacy', gapPercentage: 36, personnelAffected: 54, urgency: 'Moderate', recommendedCourse: 'Differential Privacy & Microdata QA Protocols', rootCause: 'Enterprise quotation confidentiality compliance.' },
  { department: 'PSD', skillDomain: 'big_data_pipelines', gapPercentage: 44, personnelAffected: 68, urgency: 'Moderate', recommendedCourse: 'Big Data Pipeline Engineering for Official Statistics', rootCause: 'High-frequency e-commerce data ingestion APIs.' },

  // DIID
  { department: 'DIID', skillDomain: 'sna_sut', gapPercentage: 48, personnelAffected: 82, urgency: 'Moderate', recommendedCourse: 'National Accounts Statistics & Supply-Use Tables', rootCause: 'Software engineers building national portals need domain economic vocabulary.' },
  { department: 'DIID', skillDomain: 'capi_telemetry', gapPercentage: 26, personnelAffected: 45, urgency: 'Low', recommendedCourse: 'Modern Survey Sampling & High-Frequency CAPI Telemetry', rootCause: 'Directly manage cloud backend telemetry APIs.' },
  { department: 'DIID', skillDomain: 'nowcasting', gapPercentage: 35, personnelAffected: 58, urgency: 'Moderate', recommendedCourse: 'Consumer Price Index & Inflation Forecasting', rootCause: 'Model deployment pipelines for macroeconomic time-series.' },
  { department: 'DIID', skillDomain: 'ml_anomaly', gapPercentage: 15, personnelAffected: 32, urgency: 'Low', recommendedCourse: 'AI & Machine Learning for Official Administrative Data', rootCause: 'Core technical specialty of Division data scientists.' },
  { department: 'DIID', skillDomain: 'diff_privacy', gapPercentage: 22, personnelAffected: 42, urgency: 'Low', recommendedCourse: 'Differential Privacy & Microdata QA Protocols', rootCause: 'Active zero-trust and encryption implementation track.' },
  { department: 'DIID', skillDomain: 'big_data_pipelines', gapPercentage: 18, personnelAffected: 36, urgency: 'Low', recommendedCourse: 'Big Data Pipeline Engineering for Official Statistics', rootCause: 'Expert cloud architects managing National Data Warehouse clusters.' },

  // ESD
  { department: 'ESD', skillDomain: 'sna_sut', gapPercentage: 28, personnelAffected: 48, urgency: 'Low', recommendedCourse: 'National Accounts Statistics & Supply-Use Tables', rootCause: 'Close synergy with NAD on Index of Industrial Production (IIP).' },
  { department: 'ESD', skillDomain: 'capi_telemetry', gapPercentage: 44, personnelAffected: 78, urgency: 'Moderate', recommendedCourse: 'Modern Survey Sampling & High-Frequency CAPI Telemetry', rootCause: 'Annual Survey of Industries (ASI) web portal validation audits.' },
  { department: 'ESD', skillDomain: 'nowcasting', gapPercentage: 25, personnelAffected: 42, urgency: 'Low', recommendedCourse: 'Consumer Price Index & Inflation Forecasting', rootCause: 'Energy and service sector indicator forecasting.' },
  { department: 'ESD', skillDomain: 'ml_anomaly', gapPercentage: 52, personnelAffected: 88, urgency: 'High', recommendedCourse: 'AI & Machine Learning for Official Administrative Data', rootCause: 'Automated factory balance sheet error flagging.' },
  { department: 'ESD', skillDomain: 'diff_privacy', gapPercentage: 40, personnelAffected: 65, urgency: 'Moderate', recommendedCourse: 'Differential Privacy & Microdata QA Protocols', rootCause: 'Factory-level confidential operational census disclosure.' },
  { department: 'ESD', skillDomain: 'big_data_pipelines', gapPercentage: 49, personnelAffected: 82, urgency: 'Moderate', recommendedCourse: 'Big Data Pipeline Engineering for Official Statistics', rootCause: 'Fast-moving customs logistics telemetry.' },

  // SDRD
  { department: 'SDRD', skillDomain: 'sna_sut', gapPercentage: 36, personnelAffected: 54, urgency: 'Moderate', recommendedCourse: 'National Accounts Statistics & Supply-Use Tables', rootCause: 'Questionnaire design aligned to international classification standards.' },
  { department: 'SDRD', skillDomain: 'capi_telemetry', gapPercentage: 19, personnelAffected: 32, urgency: 'Low', recommendedCourse: 'Modern Survey Sampling & High-Frequency CAPI Telemetry', rootCause: 'Primary architects of sampling frames and survey schedules.' },
  { department: 'SDRD', skillDomain: 'nowcasting', gapPercentage: 42, personnelAffected: 62, urgency: 'Moderate', recommendedCourse: 'Consumer Price Index & Inflation Forecasting', rootCause: 'Integrating hedonic attributes into consumer expenditure rounds.' },
  { department: 'SDRD', skillDomain: 'ml_anomaly', gapPercentage: 45, personnelAffected: 70, urgency: 'Moderate', recommendedCourse: 'AI & Machine Learning for Official Administrative Data', rootCause: 'Adaptive survey design using machine learning propensity weights.' },
  { department: 'SDRD', skillDomain: 'diff_privacy', gapPercentage: 28, personnelAffected: 45, urgency: 'Low', recommendedCourse: 'Differential Privacy & Microdata QA Protocols', rootCause: 'Pioneered top-coding and statistical disclosure limitation.' },
  { department: 'SDRD', skillDomain: 'big_data_pipelines', gapPercentage: 54, personnelAffected: 84, urgency: 'High', recommendedCourse: 'Big Data Pipeline Engineering for Official Statistics', rootCause: 'Integrating satellite earth observation datasets with survey frames.' },

  // DES (State Directorates)
  { department: 'DES', skillDomain: 'sna_sut', gapPercentage: 62, personnelAffected: 620, urgency: 'Critical', recommendedCourse: 'National Accounts Statistics & Supply-Use Tables', rootCause: 'State GDP compilation methodologies vary; need unified SNA 2008 alignment.' },
  { department: 'DES', skillDomain: 'capi_telemetry', gapPercentage: 56, personnelAffected: 540, urgency: 'Critical', recommendedCourse: 'Modern Survey Sampling & High-Frequency CAPI Telemetry', rootCause: 'Many state teams transitioning from paper-based to electronic CAPI tablets.' },
  { department: 'DES', skillDomain: 'nowcasting', gapPercentage: 59, personnelAffected: 580, urgency: 'Critical', recommendedCourse: 'Consumer Price Index & Inflation Forecasting', rootCause: 'State-level CPI compilation suffers from price imputation delays.' },
  { department: 'DES', skillDomain: 'ml_anomaly', gapPercentage: 78, personnelAffected: 750, urgency: 'Critical', recommendedCourse: 'AI & Machine Learning for Official Administrative Data', rootCause: 'Urgent capacity gap in applying automated outlier checks to local datasets.' },
  { department: 'DES', skillDomain: 'diff_privacy', gapPercentage: 65, personnelAffected: 630, urgency: 'Critical', recommendedCourse: 'Differential Privacy & Microdata QA Protocols', rootCause: 'State public health and agricultural survey data governance training needed.' },
  { department: 'DES', skillDomain: 'big_data_pipelines', gapPercentage: 74, personnelAffected: 710, urgency: 'Critical', recommendedCourse: 'Big Data Pipeline Engineering for Official Statistics', rootCause: 'High dependency on central ministry for cloud and pipeline maintenance.' }
];

// ==========================================
// SEED BROADCAST LOGS
// ==========================================
export const SEED_BROADCASTS: BroadcastItem[] = [
  {
    id: 'bc-1',
    title: 'National Data Governance & Statistical AI Framework 2026 Operationalized',
    description: 'MoSPI mandates all state statistical directorates to complete foundational modern survey sampling, geospatial telemetry, and automated data validation modules on LUMINA.',
    category: 'Policy Update',
    priority: 'urgent',
    targetAudience: 'All Cadres (ISS, SSS, State DES)',
    broadcastType: 'both',
    badgeText: 'Priority Mandate',
    badgeColor: 'rose',
    actionText: 'Review Guidelines',
    targetView: 'explore',
    publishedAt: 'Sep 08, 2026',
    author: 'Marcus Sterling (MoSPI Admin)',
    pinned: true,
    sentCount: 48250,
    openRate: 94.2,
    active: true
  },
  {
    id: 'bc-2',
    title: 'iGOT Karmayogi Competency Synchronization v4.8 Released',
    description: 'Automated badge and verifiable credential issuance for Indian Statistical Service (ISS) officers upon mastery of National Accounts & Input-Output modeling.',
    category: 'iGOT Integration',
    priority: 'high',
    targetAudience: 'Indian Statistical Service (ISS)',
    broadcastType: 'both',
    badgeText: 'New Protocol',
    badgeColor: 'cyan',
    actionText: 'Check Profile Badges',
    targetView: 'profile',
    publishedAt: 'Sep 04, 2026',
    author: 'Marcus Sterling (MoSPI Admin)',
    pinned: false,
    sentCount: 3200,
    openRate: 88.6,
    active: true
  },
  {
    id: 'bc-3',
    title: 'Annual Statistical Quiz & Competitive Hackathon Registration Live',
    description: 'Inter-departmental hackathon for automated macroeconomic indicator validation using open microdata datasets hosted at NSSTA Greater Noida campus.',
    category: 'Competition',
    priority: 'standard',
    targetAudience: 'All Registered Trainees & Faculty',
    broadcastType: 'homepage',
    badgeText: 'Open Entry',
    badgeColor: 'purple',
    actionText: 'Register Team',
    targetView: 'explore',
    publishedAt: 'Aug 29, 2026',
    author: 'Dr. Julian Hayes (Lead Trainer)',
    pinned: false,
    sentCount: 14200,
    openRate: 72.4,
    active: true
  },
  {
    id: 'bc-4',
    title: 'GovCloud Cluster Scheduled Telemetry Maintenance Notice',
    description: 'Routine maintenance on regional database nodes. Live course streaming will remain uninterrupted; microdata sandbox queries may experience brief 5-minute pauses.',
    category: 'Urgent Maintenance',
    priority: 'info',
    targetAudience: 'All System Users',
    broadcastType: 'notification',
    badgeText: 'Maintenance',
    badgeColor: 'amber',
    actionText: 'View Status',
    publishedAt: 'Aug 25, 2026',
    author: 'DevOps & Cloud SecOps Team',
    pinned: false,
    sentCount: 48250,
    openRate: 64.8,
    active: false
  }
];
