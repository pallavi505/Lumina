import type { CourseMaterial, TraineePerformanceRecord, AssessmentMCQ } from '../types';

export const SAMPLE_LECTURE_DOCUMENTS = [
  {
    id: 'doc-national-accounts',
    filename: 'Lecture_Notes_SNA_2008_MacroAggregates.pdf',
    title: 'System of National Accounts (SNA 2008) & Gross Value Added (GVA)',
    fileSize: '3.4 MB',
    pages: 28,
    words: 4620,
    domain: 'National Accounts & Price Indices',
    text: `System of National Accounts (SNA 2008) Guidelines for Indian Statistical Cadre:
1. Overview of Macroeconomic Aggregates:
Gross Domestic Product (GDP) represents the monetary value of all final goods and services produced within a national boundary over a specified accounting period. Gross Value Added (GVA) at basic prices is defined as output minus intermediate consumption plus net product taxes minus net product subsidies.

2. Production vs. Income vs. Expenditure Approaches:
- Production Approach: GVA at basic prices is aggregated across Agriculture, Industry, and Services sectors.
- Expenditure Approach: GDP = Private Final Consumption Expenditure (PFCE) + Government Final Consumption Expenditure (GFCE) + Gross Fixed Capital Formation (GFCF) + Changes in Stocks + Valuables + Net Exports (X - M).
- Discrepancies between Production and Expenditure estimates are reconciled through the Supply and Use Tables (SUT) balancing framework.

3. Deflator and Double Deflation Methodology:
Constant price estimates require adjusting nominal values for inflation. Single indicator deflation inflates inputs or outputs using aggregate WPI/CPI. True double deflation computes real gross output deflated by output price indices, and intermediate consumption deflated by input price indices, preserving real value added margins.

4. Chain Volume Measures vs Fixed Base Year:
Annual chain linking updates weights every year rather than fixing weights for a decade (e.g. 2011-12 base), reducing substitution bias in fast-evolving sectors like ICT, financial services, and digital retail.`,
  },
  {
    id: 'doc-survey-sampling',
    filename: 'Survey_Sampling_CAPI_Telemetry_Manual.pdf',
    title: 'Stratified Multistage Sampling & CAPI Field Telemetry Guidelines',
    fileSize: '4.8 MB',
    pages: 42,
    words: 6150,
    domain: 'Survey Sampling & Field CAPI Telemetry',
    text: `National Sample Survey (NSS) Field Operations Directorate Standards:
1. Multistage Stratified Sampling Design:
First Stage Units (FSUs) are 2011 Census villages in rural sectors and Urban Frame Survey (UFS) blocks in urban sectors. Ultimate Stage Units (USUs) are households selected via circular systematic sampling with random start.

2. Computer Assisted Personal Interviewing (CAPI) Telemetry:
All field investigators must record geo-coordinates (latitude/longitude with CEP < 5 meters), questionnaire start and completion timestamps, and automated logical validation rules at the point of data entry. Range checks flag monthly per-capita consumer expenditure (MPCE) outliers > 3 standard deviations from block median.

3. Non-Response Bias & Multiplier Weighting:
When sampled households are temporarily locked or unwilling to respond after 3 verified revisit attempts, substitution is prohibited. Instead, non-response adjustments are calculated at the second-stage stratum level using sub-sample multiplier adjustments to prevent self-selection bias.

4. Post-Stratification and Estimation Formulas:
Aggregate totals are generated using Horvitz-Thompson unbiased estimators with design weights inverse to inclusion probabilities: Y_hat = sum(y_i / pi_i). Variance estimation uses balanced repeated replication (BRR) or jackknife resampling across independent sub-sample replicates.`,
  },
  {
    id: 'doc-price-index',
    filename: 'CPI_Indexation_Laspeyres_Rebasing_2026.txt',
    title: 'Consumer Price Index (CPI) Formulation & Item Basket Reweighting',
    fileSize: '1.9 MB',
    pages: 18,
    words: 3200,
    domain: 'Statistical Concepts & Standards',
    text: `Economic Statistics Division Technical Note on Consumer Price Indexation:
1. Index Formulation Mechanics:
The headline CPI (Rural, Urban, Combined) is calculated using the modified Laspeyres formula, measuring relative changes in the cost of a fixed consumption basket of goods and services relative to a base period.
Modified Laspeyres: I_t = sum( (P_t / P_0) * W_0 ) / sum( W_0 ), where W_0 is the base period expenditure share derived from the Household Consumption Expenditure Survey (HCES).

2. Geometric Mean vs Arithmetic Mean (Carli vs Jevons):
Elementary price relatives at the quote level should utilize the Jevons index (geometric mean) to prevent upward Carli index bias when relative price dispersion increases.

3. Imputation of Missing Price Quotes:
When price quotes for seasonal agricultural commodities (e.g. vegetables) are unavailable, carry-forward pricing is strictly disallowed. Imputation must use cell-relative price movement from matching nearest market centers or class-mean imputation from corresponding sub-groups.`,
  },
];

export const INITIAL_ASSESSMENT_BANK: AssessmentMCQ[] = [
  {
    id: 'mcq-1',
    question: 'Under the SNA 2008 accounting framework, what is the precise relationship between GDP at market prices and GVA at basic prices?',
    options: [
      'GDP at market prices = GVA at basic prices + Product Taxes - Product Subsidies',
      'GDP at market prices = GVA at basic prices - Production Taxes + Production Subsidies',
      'GDP at market prices = GVA at factor cost + Gross Capital Formation',
      'GDP at market prices = GVA at basic prices / GDP Deflator'
    ],
    correctAnswer: 0,
    explanation: 'By standard SNA 2008 definition, GDP at market prices equals Gross Value Added (GVA) at basic prices plus net taxes on products (Product Taxes minus Product Subsidies). Production taxes/subsidies are already internalized in basic prices.',
    difficulty: 'Intermediate',
    competencyDomain: 'National Accounts & Price Indices',
    sourceSnippet: 'GVA at basic prices is defined as output minus intermediate consumption plus net product taxes...'
  },
  {
    id: 'mcq-2',
    question: 'Why is the Jevons elementary index (geometric mean) preferred over the Carli index (arithmetic mean) when compiling elementary aggregate price relatives?',
    options: [
      'The Carli index violates the time reversal test and exhibits a persistent upward drift bias.',
      'The Jevons index requires exact quantities at the elementary quote level whereas Carli does not.',
      'The Carli index is mathematically undefined whenever any single price remains unchanged.',
      'The Jevons index artificially forces price index numbers to sum to 100.'
    ],
    correctAnswer: 0,
    explanation: 'The Carli index is known in international index theory to fail the time-reversal axiom, introducing an inherent upward substitution bias. The Jevons geometric mean satisfies both the circular and time-reversal tests.',
    difficulty: 'Advanced',
    competencyDomain: 'Statistical Concepts & Standards',
    sourceSnippet: 'Elementary price relatives at the quote level should utilize the Jevons index to prevent upward Carli bias...'
  },
  {
    id: 'mcq-3',
    question: 'In NSS CAPI telemetry protocols, what procedure must field investigators follow when a sampled ultimate household is found locked after multiple visits?',
    options: [
      'Immediately substitute with the nearest neighboring household in the same hamlet.',
      'Log the visit GPS telemetry, make 3 distinct scheduled revisits, and calculate sub-sample non-response weights without casual substitution.',
      'Delete the household record from the CAPI device to prevent incomplete survey errors.',
      'Impute the household expenditure data using the mean of the urban frame survey block.'
    ],
    correctAnswer: 1,
    explanation: 'Uncontrolled household substitution distorts the probability selection mechanism and introduces severe self-selection bias. Protocols require documented revisits and sub-sample non-response weighting adjustments.',
    difficulty: 'Intermediate',
    competencyDomain: 'Survey Sampling & Field CAPI Telemetry',
    sourceSnippet: 'When sampled households are temporarily locked or unwilling to respond after 3 verified revisit attempts, substitution is prohibited.'
  },
  {
    id: 'mcq-4',
    question: 'In double deflation methodology for estimating real GVA in constant prices, how are intermediate inputs deflated?',
    options: [
      'Using the single aggregate Consumer Price Index (CPI-Combined) across all sectors.',
      'Using specific product-level input price indices (or WPI commodity groups) matching intermediate consumption baskets.',
      'By applying the output price deflator uniformly to both gross output and intermediate inputs.',
      'By deducting nominal depreciation from current price intermediate expenditures.'
    ],
    correctAnswer: 1,
    explanation: 'Double deflation deflates gross output with output price indices and separately deflates intermediate inputs with relevant input price indices (e.g., input-output specific price relatives), capturing real value added accurately.',
    difficulty: 'Advanced',
    competencyDomain: 'National Accounts & Price Indices',
    sourceSnippet: 'True double deflation computes real gross output deflated by output price indices, and intermediate consumption deflated by input price indices.'
  },
  {
    id: 'mcq-5',
    question: 'Which estimation estimator guarantees unbiased estimation of population totals in unequal probability multistage sampling designs?',
    options: [
      'Horvitz-Thompson Estimator: Y_hat = sum(y_i / pi_i)',
      'Simple Random Sample Mean: Y_hat = N * y_bar',
      'Ratio-to-Regression Baseline with fixed intercepts',
      'Unweighted Sample Median scaled by Census population'
    ],
    correctAnswer: 0,
    explanation: 'The Horvitz-Thompson estimator is the canonical design-unbiased estimator in survey sampling, weighting each observation inversely by its first-order inclusion probability (pi_i).',
    difficulty: 'Advanced',
    competencyDomain: 'Survey Sampling & Field CAPI Telemetry',
    sourceSnippet: 'Aggregate totals are generated using Horvitz-Thompson unbiased estimators with design weights inverse to inclusion probabilities...'
  }
];

export const INITIAL_COURSE_MATERIALS: CourseMaterial[] = [
  {
    id: 'mat-1',
    title: 'SNA 2008 Macroeconomic Framework & GVA Compilation Lecture',
    type: 'video',
    moduleId: 'mod-1',
    moduleTitle: 'Module 1: National Accounts & Macro Aggregates',
    courseId: 'crs-1',
    courseTitle: 'National Accounts Statistics & Supply-Use Tables',
    durationOrPages: '42 mins',
    fileSize: '340 MB',
    uploadedAt: 'Sep 09, 2026',
    status: 'published',
    author: 'Dr. Julian Hayes (Master Trainer)',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    tags: ['SNA 2008', 'GVA', 'Macroeconomics'],
    downloadsCount: 148
  },
  {
    id: 'mat-2',
    title: 'Supply and Use Tables (SUT) Balancing Matrix Handbook',
    type: 'document',
    moduleId: 'mod-1',
    moduleTitle: 'Module 1: National Accounts & Macro Aggregates',
    courseId: 'crs-1',
    courseTitle: 'National Accounts Statistics & Supply-Use Tables',
    durationOrPages: '64 pages',
    fileSize: '4.2 MB',
    uploadedAt: 'Sep 05, 2026',
    status: 'published',
    author: 'National Statistical Academy Faculty',
    tags: ['SUT', 'Input-Output', 'National Accounts'],
    downloadsCount: 312
  },
  {
    id: 'mat-3',
    title: 'CAPI Field Inspection & GPS Telemetry Protocol Slide Deck',
    type: 'presentation',
    moduleId: 'mod-2',
    moduleTitle: 'Module 2: Survey Sampling & Field CAPI Telemetry',
    courseId: 'crs-2',
    courseTitle: 'Modern Survey Sampling & High-Frequency CAPI Telemetry',
    durationOrPages: '48 slides',
    fileSize: '12.8 MB',
    uploadedAt: 'Sep 02, 2026',
    status: 'published',
    author: 'Field Operations Division (FOD)',
    tags: ['CAPI', 'GPS Telemetry', 'Field Auditing'],
    downloadsCount: 280
  },
  {
    id: 'mat-4',
    title: 'Sample Household CAPI Microdata Validation Script (Python/Jupyter)',
    type: 'dataset',
    moduleId: 'mod-2',
    moduleTitle: 'Module 2: Survey Sampling & Field CAPI Telemetry',
    courseId: 'crs-2',
    courseTitle: 'Modern Survey Sampling & High-Frequency CAPI Telemetry',
    durationOrPages: '2,400 records',
    fileSize: '8.4 MB',
    uploadedAt: 'Aug 28, 2026',
    status: 'published',
    author: 'Data Informatics Division (DIID)',
    tags: ['Jupyter', 'Pandas', 'Validation'],
    downloadsCount: 425
  },
  {
    id: 'mat-5',
    title: 'CPI Elementary Aggregate Rebasing & Jevons Formulation Guide',
    type: 'document',
    moduleId: 'mod-3',
    moduleTitle: 'Module 3: Price Indices & Inflation Forecasting',
    courseId: 'crs-4',
    courseTitle: 'Consumer Price Index (CPI) & Inflation Forecasting',
    durationOrPages: '32 pages',
    fileSize: '2.6 MB',
    uploadedAt: 'Aug 20, 2026',
    status: 'published',
    author: 'Economic Statistics Division',
    tags: ['CPI', 'Laspeyres', 'Inflation'],
    downloadsCount: 196
  },
  {
    id: 'mat-6',
    title: 'Anomaly Detection in GST Microdata Using Isolation Forests',
    type: 'video',
    moduleId: 'mod-4',
    moduleTitle: 'Module 4: Applied AI & Machine Learning for Official Data',
    courseId: 'crs-3',
    courseTitle: 'AI & Machine Learning for Official Administrative Data',
    durationOrPages: '56 mins',
    fileSize: '480 MB',
    uploadedAt: 'Aug 15, 2026',
    status: 'draft',
    author: 'Dr. Julian Hayes',
    tags: ['Machine Learning', 'Anomaly Detection', 'GST Data'],
    downloadsCount: 42
  }
];

export const INITIAL_TRAINEE_RECORDS: TraineePerformanceRecord[] = [
  {
    id: 'tr-101',
    name: 'Elena Vance',
    email: 'trainee@lumina.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    cadre: 'Indian Statistical Service (ISS Cohort #24)',
    courseId: 'crs-1',
    courseTitle: 'National Accounts Statistics & Supply-Use Tables',
    currentModule: 'Module 3: Double Deflation & SUT',
    participationRate: 96,
    completionRate: 88,
    avgAssessmentScore: 92,
    finalExamScore: 94,
    scoreDistribution: [90, 88, 96, 94],
    status: 'Proficient',
    lastActive: '12 mins ago'
  },
  {
    id: 'tr-102',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@mospi.gov.in',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    cadre: 'Senior Statistical Officer (SSO, Rajasthan)',
    courseId: 'crs-2',
    courseTitle: 'Modern Survey Sampling & High-Frequency CAPI Telemetry',
    currentModule: 'Module 2: CAPI Range Checks',
    participationRate: 88,
    completionRate: 75,
    avgAssessmentScore: 84,
    finalExamScore: 82,
    scoreDistribution: [80, 86, 82, 88],
    status: 'On Track',
    lastActive: '1 hour ago'
  },
  {
    id: 'tr-103',
    name: 'Pooja Iyer',
    email: 'pooja.iyer@mospi.gov.in',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    cadre: 'Assistant Director (Economic Statistics Division)',
    courseId: 'crs-4',
    courseTitle: 'Consumer Price Index (CPI) & Inflation Forecasting',
    currentModule: 'Module 4: Flash CPI Nowcasting',
    participationRate: 98,
    completionRate: 95,
    avgAssessmentScore: 96,
    finalExamScore: 98,
    scoreDistribution: [94, 96, 98, 96],
    status: 'Proficient',
    lastActive: '3 hours ago'
  },
  {
    id: 'tr-104',
    name: 'Rohan Mehra',
    email: 'rohan.mehra@mospi.gov.in',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    cadre: 'Junior Statistical Officer (JSO, Uttar Pradesh West)',
    courseId: 'crs-2',
    courseTitle: 'Modern Survey Sampling & High-Frequency CAPI Telemetry',
    currentModule: 'Module 1: Multistage Sampling',
    participationRate: 58,
    completionRate: 35,
    avgAssessmentScore: 58,
    finalExamScore: null,
    scoreDistribution: [60, 54, 60],
    status: 'Needs Attention',
    lastActive: '3 days ago'
  },
  {
    id: 'tr-105',
    name: 'Kavita Nair',
    email: 'kavita.nair@mospi.gov.in',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    cadre: 'Deputy Director (Data Informatics DIID)',
    courseId: 'crs-3',
    courseTitle: 'AI & Machine Learning for Official Administrative Data',
    currentModule: 'Module 3: Anomaly Detection Models',
    participationRate: 92,
    completionRate: 82,
    avgAssessmentScore: 89,
    finalExamScore: 91,
    scoreDistribution: [85, 92, 88, 91],
    status: 'Proficient',
    lastActive: '45 mins ago'
  },
  {
    id: 'tr-106',
    name: 'Vikram Joshi',
    email: 'vikram.joshi@mospi.gov.in',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    cadre: 'Field Investigator (FOD Central Zone)',
    courseId: 'crs-2',
    courseTitle: 'Modern Survey Sampling & High-Frequency CAPI Telemetry',
    currentModule: 'Module 1: Multistage Sampling',
    participationRate: 42,
    completionRate: 22,
    avgAssessmentScore: 48,
    finalExamScore: null,
    scoreDistribution: [50, 46],
    status: 'At Risk',
    lastActive: '6 days ago'
  },
  {
    id: 'tr-107',
    name: 'Sunita Patel',
    email: 'sunita.patel@mospi.gov.in',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    cadre: 'Senior Statistical Officer (SSO, Gujarat)',
    courseId: 'crs-1',
    courseTitle: 'National Accounts Statistics & Supply-Use Tables',
    currentModule: 'Module 2: GVA Compilation',
    participationRate: 85,
    completionRate: 70,
    avgAssessmentScore: 78,
    finalExamScore: 80,
    scoreDistribution: [75, 78, 80, 79],
    status: 'On Track',
    lastActive: '5 hours ago'
  },
  {
    id: 'tr-108',
    name: 'Manish Verma',
    email: 'manish.verma@mospi.gov.in',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    cadre: 'Statistical Investigator Grade I (Bihar)',
    courseId: 'crs-4',
    courseTitle: 'Consumer Price Index (CPI) & Inflation Forecasting',
    currentModule: 'Module 2: Elementary Aggregates',
    participationRate: 76,
    completionRate: 64,
    avgAssessmentScore: 72,
    finalExamScore: 74,
    scoreDistribution: [70, 72, 75, 71],
    status: 'On Track',
    lastActive: '1 day ago'
  }
];
