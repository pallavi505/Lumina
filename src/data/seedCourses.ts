import type { AICourse } from '../types';

export const SEED_COURSES: AICourse[] = [
  {
    id: "crs-nextjs-saas",
    title: "Full-Stack AI Online Learning Platform with Next.js 15 & Neon",
    description: "Build, deploy, and scale a production-grade AI SaaS application with Clerk Auth, Neon Postgres, Drizzle ORM, YouTube curriculum integration, and Tailwind CSS.",
    category: "Full Stack Web",
    level: "Intermediate",
    duration: "4.5 Hours",
    bannerImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80",
    bannerPrompt: "Ultra-modern developer workstation with dark terminal showing Next.js and AI code",
    tags: ["Next.js 15", "AI Integration", "Drizzle ORM", "SaaS Architecture"],
    learningOutcomes: [
      "Master Next.js App Router, Server Components, and API handlers",
      "Integrate automated AI course syllabus and markdown content generation",
      "Embed streaming YouTube educational video players with responsive layout",
      "Deploy full-stack SaaS with serverless database and production auth"
    ],
    chapters: [
      {
        id: "ch-nextjs-1",
        chapterNumber: 1,
        title: "Platform Architecture & Environment Setup",
        summary: "Bootstrapping Next.js 15 project, Tailwind configuration, component architecture, and Clerk authentication setup.",
        durationMinutes: 45,
        youtubeVideoId: "utInDVvTbWg",
        videoTitle: "Build & Deploy an AI Online Learning Platform - Part 1",
        lessons: ["Project Initialization & Config", "Design System & Theme Setup", "Authentication Integration"]
      },
      {
        id: "ch-nextjs-2",
        chapterNumber: 2,
        title: "AI Course Generation Engine",
        summary: "Crafting structured Gemini API prompts to generate course schemas, chapter outlines, and thematic banner images.",
        durationMinutes: 60,
        youtubeVideoId: "wm5gMKuwSYk",
        videoTitle: "Next.js AI Prompt Engineering & Structured JSON",
        lessons: ["Gemini API Setup", "Course Schema Design", "Banner Prompting & Image Mapping"]
      },
      {
        id: "ch-nextjs-3",
        chapterNumber: 3,
        title: "Dynamic Course Player & Video Streaming",
        summary: "Building the interactive classroom viewer, YouTube video player, and rich markdown lesson renderer.",
        durationMinutes: 50,
        youtubeVideoId: "bMknfKXIFA8",
        videoTitle: "Interactive Course Player & Custom Controls",
        lessons: ["Video Player Component", "Markdown Rendering", "Lesson Checklist & Navigation"]
      },
      {
        id: "ch-nextjs-4",
        chapterNumber: 4,
        title: "Progress Tracking & Completion Workflows",
        summary: "Persisting enrollment progress in the database, milestone badges, and final certification.",
        durationMinutes: 40,
        youtubeVideoId: "843nec-IvW0",
        videoTitle: "Database Persistence & Progress Milestones",
        lessons: ["Enrollment Schema", "Mark as Completed Mutations", "Production Deployment"]
      }
    ],
    authorName: "Lumina AI Learning Studio",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    createdAt: "2026-09-01T10:00:00Z",
    enrolledCount: 1420,
    rating: 4.96,
    includeVideo: true
  },
  {
    id: "crs-ai-stats",
    title: "AI & Machine Learning for Official Administrative Data",
    description: "Automated anomaly detection in GST, trade classification using LLMs, and synthetic imputation pipelines for national statistical systems.",
    category: "Official Statistics",
    level: "Advanced",
    duration: "5 Hours",
    bannerImage: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=1200&auto=format&fit=crop&q=80",
    bannerPrompt: "Abstract neon matrix of statistical distributions and machine learning neurons",
    tags: ["Machine Learning", "LLMs", "Administrative Data", "MoSPI Guidelines"],
    learningOutcomes: [
      "Process multi-terabyte administrative transaction records efficiently",
      "Train unsupervised anomaly detectors for tax and customs filings",
      "Deploy classification models compliant with UN Statistical Commission guidelines",
      "Apply differential privacy and zero-trust safeguards to microdata"
    ],
    chapters: [
      {
        id: "ch-aistats-1",
        chapterNumber: 1,
        title: "Administrative Data Cleaning & Preprocessing",
        summary: "Standardizing heterogeneous datasets from GSTN, MCA21, and state revenue portals.",
        durationMinutes: 45,
        youtubeVideoId: "aircAruvnKk",
        videoTitle: "Neural Networks & Foundation Models in Data",
        lessons: ["Data Ingestion Pipelines", "Handling Missingness & Noise", "Validation Protocols"]
      },
      {
        id: "ch-aistats-2",
        chapterNumber: 2,
        title: "Feature Engineering & High-Dimensional Imputation",
        summary: "Building predictive imputation routines for non-response and lagged reporting.",
        durationMinutes: 55,
        youtubeVideoId: "Gv9_4yMHFhI",
        videoTitle: "Machine Learning Imputation & Variance Controls",
        lessons: ["Vector Encodings", "Imputation Algorithms", "Cross-Validation"]
      },
      {
        id: "ch-aistats-3",
        chapterNumber: 3,
        title: "Production Telemetry & Model Governance",
        summary: "Operationalizing models with automated drift detection and explainable AI dashboards.",
        durationMinutes: 60,
        youtubeVideoId: "zjkBMFhNj_g",
        videoTitle: "Model Governance and Production Guardrails",
        lessons: ["Audit Logging", "Explainable AI (SHAP)", "Governance Review"]
      }
    ],
    authorName: "ISI Kolkata & DIID MoSPI",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    createdAt: "2026-08-20T12:00:00Z",
    enrolledCount: 2950,
    rating: 4.95,
    includeVideo: true
  },
  {
    id: "crs-python-datasci",
    title: "Python for Data Science, Survey Sampling & Econometrics",
    description: "From Python fundamentals to vectorized numerical computing with NumPy, Pandas, survey weighting, and regression modeling.",
    category: "Data Science",
    level: "Beginner",
    duration: "3.5 Hours",
    bannerImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80",
    bannerPrompt: "Sleek code editor showing Python data science and analytical charts in cyan and dark charcoal",
    tags: ["Python", "Pandas", "Econometrics", "Survey Sampling"],
    learningOutcomes: [
      "Master Python data structures, list comprehensions, and functional methods",
      "Manipulate survey microdata tables with high-performance Pandas routines",
      "Compute stratified sampling weights, design effects, and confidence intervals",
      "Generate publication-ready visualizations with Matplotlib & Seaborn"
    ],
    chapters: [
      {
        id: "ch-pyds-1",
        chapterNumber: 1,
        title: "Python Primitives & Data Structures",
        summary: "Essential programming constructs, collections, vectorization, and environment hygiene.",
        durationMinutes: 35,
        youtubeVideoId: "rfscVS0vtbw",
        videoTitle: "Python for Beginners - Learn Python in 1 Hour",
        lessons: ["Variables & Control Flow", "Functions & Modules", "Virtual Environments"]
      },
      {
        id: "ch-pyds-2",
        chapterNumber: 2,
        title: "Pandas for Tabular Survey Microdata",
        summary: "Aggregating, filtering, joining, and transforming multi-file survey schedules.",
        durationMinutes: 50,
        youtubeVideoId: "LHBE6Q9XlzI",
        videoTitle: "Data Analysis with Python and Pandas",
        lessons: ["DataFrames & Series", "Groupby & Pivots", "Missing Value Treatment"]
      },
      {
        id: "ch-pyds-3",
        chapterNumber: 3,
        title: "Econometric Modeling & Hypothesis Testing",
        summary: "Ordinary Least Squares, heteroscedasticity-robust standard errors, and hypothesis evaluation.",
        durationMinutes: 55,
        youtubeVideoId: "qBigTkBLU6g",
        videoTitle: "Statistics Fundamentals for Data Science",
        lessons: ["Linear Regression", "Hypothesis Tests & p-values", "Model Diagnostics"]
      }
    ],
    authorName: "National Statistical Systems Training Academy (NSSTA)",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    createdAt: "2026-08-15T09:30:00Z",
    enrolledCount: 3820,
    rating: 4.88,
    includeVideo: true
  },
  {
    id: "crs-nat-accounts",
    title: "National Accounts Statistics & Supply-Use Tables (SUT)",
    description: "System of National Accounts (SNA 2025/2026), Gross Value Added calculation, double deflation methodology, and inter-industry input-output modeling.",
    category: "Official Statistics",
    level: "Intermediate",
    duration: "4 Hours",
    bannerImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80",
    bannerPrompt: "Macroeconomic charts, financial telemetry graphs, and national economic ledger in emerald teal and charcoal",
    tags: ["National Accounts", "SUT", "Macroeconomics", "GDP Rebasing"],
    learningOutcomes: [
      "Understand System of National Accounts (SNA) production and consumption boundaries",
      "Construct symmetric input-output tables and Leontief multiplier matrices",
      "Apply double deflation indexing to nominal industrial gross value added (GVA)",
      "Analyze macroeconomic impacts of policy shocks using supply and use balances"
    ],
    chapters: [
      {
        id: "ch-na-1",
        chapterNumber: 1,
        title: "Foundations of SNA & Macroeconomic Aggregates",
        summary: "Production boundary, institutional sectors, GDP via production, expenditure, and income approaches.",
        durationMinutes: 40,
        youtubeVideoId: "D4Sfg1b6q7o",
        videoTitle: "System of National Accounts Fundamentals",
        lessons: ["Economic Territory & Residents", "Gross Value Added (GVA)", "Current vs Constant Prices"]
      },
      {
        id: "ch-na-2",
        chapterNumber: 2,
        title: "Supply-Use Table (SUT) Construction",
        summary: "Balancing product supply against intermediate and final demand across 140 industrial sectors.",
        durationMinutes: 55,
        youtubeVideoId: "3e_Tq7Z2p7I",
        videoTitle: "Constructing and Balancing Supply-Use Tables",
        lessons: ["Domestic Production Matrix", "Trade & Transport Margins", "Row and Column Reconciliation"]
      },
      {
        id: "ch-na-3",
        chapterNumber: 3,
        title: "Double Deflation & Volume Estimates",
        summary: "Deflating output and intermediate inputs with price indices to derive constant price GVA.",
        durationMinutes: 45,
        youtubeVideoId: "7kI2aYcIq4w",
        videoTitle: "Double Deflation in Macroeconomic Statistics",
        lessons: ["Producer Price Indices (PPI)", "Input Deflation Matrices", "Reconciliation of Growth Rates"]
      }
    ],
    authorName: "Central Statistics Office (CSO) & NSSTA",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    createdAt: "2026-08-10T08:00:00Z",
    enrolledCount: 4210,
    rating: 4.92,
    includeVideo: true
  },
  {
    id: "crs-fastapi-microservices",
    title: "FastAPI & High-Throughput Microservices with Docker",
    description: "Architect async Python APIs with Pydantic validation, Redis caching, PostgreSQL connection pools, Docker containerization, and automated OpenAPI contract testing.",
    category: "Cloud & DevOps",
    level: "Intermediate",
    duration: "3.5 Hours",
    bannerImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80",
    bannerPrompt: "High-tech server room with glowing fiber optic cables and distributed computing architecture",
    tags: ["FastAPI", "Python", "Docker", "Microservices"],
    learningOutcomes: [
      "Build sub-millisecond asynchronous REST endpoints using FastAPI and Starlette",
      "Enforce strict payload validation and schema serialization with Pydantic v2",
      "Containerize microservices with multi-stage Docker builds and health probes",
      "Implement distributed caching with Redis and async connection pooling"
    ],
    chapters: [
      {
        id: "ch-fa-1",
        chapterNumber: 1,
        title: "Async FastAPI Core & Routing",
        summary: "Event loops, dependency injection, and asynchronous request handling.",
        durationMinutes: 40,
        youtubeVideoId: "tLKKmouU5OI",
        videoTitle: "FastAPI Complete Tutorial - Getting Started",
        lessons: ["Path & Query Parameters", "Pydantic Models & Validation", "Dependency Injection Engine"]
      },
      {
        id: "ch-fa-2",
        chapterNumber: 2,
        title: "Database Integration & Async ORM",
        summary: "Connecting async SQLAlchemy and SQLModel to Postgres with connection pooling.",
        durationMinutes: 50,
        youtubeVideoId: "77b_5sM6l0o",
        videoTitle: "FastAPI Database Persistence & Async SQLAlchemy",
        lessons: ["Async Engine & Sessionmaker", "CRUD Operations", "Database Migrations with Alembic"]
      },
      {
        id: "ch-fa-3",
        chapterNumber: 3,
        title: "Dockerization & Production Telemetry",
        summary: "Multi-stage Docker builds, non-root security containers, and Prometheus metrics.",
        durationMinutes: 45,
        youtubeVideoId: "0sOvCWFmrtA",
        videoTitle: "Dockerizing FastAPI Applications for Production",
        lessons: ["Dockerfile Optimization", "Docker Compose Orchestration", "Zero-Trust Security Policies"]
      }
    ],
    authorName: "Lumina Cloud Engineering Guild",
    authorAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    createdAt: "2026-08-25T11:00:00Z",
    enrolledCount: 2680,
    rating: 4.89,
    includeVideo: true
  },
  {
    id: "crs-gemini-genai",
    title: "Generative AI & Multimodal LLMs with Gemini 3.8 Flash",
    description: "Harness Google Gemini 3.8 Flash for structured JSON extraction, automated reasoning, real-time multimodal audio/video analysis, and reliable grounding.",
    category: "AI & Data Science",
    level: "Advanced",
    duration: "4.5 Hours",
    bannerImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&auto=format&fit=crop&q=80",
    bannerPrompt: "Glowing neural network visualization with hyper-dimensional vectors and quantum light rays",
    tags: ["Gemini 3.8", "GenAI", "Multimodal", "Structured Output"],
    learningOutcomes: [
      "Master the @google/genai TypeScript SDK and modern client initialization",
      "Enforce strict Pydantic/Zod JSON output schemas for deterministic application pipelines",
      "Process high-resolution images, audio streams, and PDF reports natively",
      "Implement multi-turn conversational agents with stateful tools and function calling"
    ],
    chapters: [
      {
        id: "ch-gem-1",
        chapterNumber: 1,
        title: "Gemini 3.8 Flash SDK & Architecture",
        summary: "Model selection, API token management, system instructions, and temperature tuning.",
        durationMinutes: 45,
        youtubeVideoId: "j6fKzL6K68Q",
        videoTitle: "Gemini API Masterclass - Zero to Hero",
        lessons: ["Google GenAI SDK Setup", "Prompt Design Principles", "System Instructions & Context Windows"]
      },
      {
        id: "ch-gem-2",
        chapterNumber: 2,
        title: "Deterministic Structured Outputs & Function Calling",
        summary: "Enforcing responseSchema with type-safe JSON returns and executing agentic tool functions.",
        durationMinutes: 55,
        youtubeVideoId: "2n3xM_1x5zI",
        videoTitle: "Structured Outputs and Tool Use with Gemini",
        lessons: ["Schema Definition (responseSchema)", "Function Calling Loop", "Error Handling & Retries"]
      },
      {
        id: "ch-gem-3",
        chapterNumber: 3,
        title: "Multimodal Video & Document Understanding",
        summary: "Analyzing long-form video lectures, microdata reports, and visual diagrams natively.",
        durationMinutes: 50,
        youtubeVideoId: "fM5O4tHh87k",
        videoTitle: "Multimodal Gemini Analysis - Vision & Audio",
        lessons: ["Image & Video Embeddings", "Document QA & Summarization", "Production Deployment"]
      }
    ],
    authorName: "Lumina AI Research Lab",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    createdAt: "2026-09-05T14:00:00Z",
    enrolledCount: 5120,
    rating: 4.98,
    includeVideo: true
  }
];
