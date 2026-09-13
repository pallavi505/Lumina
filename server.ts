import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { 
  generateCourseWithGemini, 
  generateChapterContentWithGemini,
  generateAssessmentMCQsWithGemini
} from "./server/geminiService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: GET /api/notifications
  app.get("/api/notifications", (_req, res) => {
    res.json({
      announcements: [
        {
          id: "ann-1",
          title: "National Data Governance & Statistical AI Framework 2026 Operationalized",
          description: "MoSPI mandates all state statistical directorates to complete foundational modern survey sampling, geospatial telemetry, and automated data validation modules on LUMINA.",
          category: "Policy Update",
          date: "Sep 08, 2026",
          badge: "Priority",
          badgeColor: "rose",
          author: "Ministry of Statistics and Programme Implementation (MoSPI)"
        },
        {
          id: "ann-2",
          title: "iGOT Karmayogi Competency Synchronization v4.8 Released",
          description: "Automated badge and verifiable credential issuance for Indian Statistical Service (ISS) officers upon mastery of National Accounts & Input-Output modeling.",
          category: "iGOT Integration",
          date: "Sep 04, 2026",
          badge: "New Feature",
          badgeColor: "cyan",
          author: "Mission Karmayogi Digital Governance Division"
        },
        {
          id: "ann-3",
          title: "Annual Statistical Quiz & Competitive Hackathon Registration Live",
          description: "Inter-departmental hackathon for automated macroeconomic indicator validation using open microdata datasets hosted at NSSTA Greater Noida campus.",
          category: "Competition",
          date: "Aug 29, 2026",
          badge: "Open for ISS & SSS",
          badgeColor: "purple",
          author: "National Statistical Systems Training Academy (NSSTA)"
        },
        {
          id: "ann-4",
          title: "Microdata Dissemination Security Protocol Compliance Audit",
          description: "Updated zero-trust telemetry, ISO 27001 anonymization pipelines, and differential privacy data masking guidelines applied to all survey sandbox clusters.",
          category: "Security & Standards",
          date: "Aug 22, 2026",
          badge: "Compliance",
          badgeColor: "emerald",
          author: "National Data Warehouse (NDW)"
        }
      ],
      achievements: [
        {
          id: "ach-1",
          title: "National Scale Milestone",
          metric: "48,250+",
          subtitle: "Civil & Statistical Servants Onboarded",
          detail: "Across 28 States and 8 Union Territories in full compliance with National Education Policy (NEP) and Mission Karmayogi guidelines.",
          icon: "Award"
        },
        {
          id: "ach-2",
          title: "Automated Assessment Engine",
          metric: "2.45M+",
          subtitle: "Statistical MCQs & Scenario Tests Completed",
          detail: "Continuous adaptive item-response theory (IRT) evaluation with zero manual grading latency.",
          icon: "CheckCircle2"
        },
        {
          id: "ach-3",
          title: "Cadre Competency Mapping",
          metric: "348",
          subtitle: "ISS & SSS Role Competencies Mapped",
          detail: "All core statistical and data engineering roles formally linked with standardized Karmayogi competency dictionaries.",
          icon: "Target"
        },
        {
          id: "ach-4",
          title: "System Uptime & Latency",
          metric: "99.98%",
          subtitle: "GovCloud High Availability",
          detail: "Geo-replicated NIC cloud instances with sub-30ms regional transit times across all directorates.",
          icon: "Zap"
        }
      ],
      newCourses: [
        {
          id: "crs-1",
          title: "National Accounts Statistics & Supply-Use Tables (SUT)",
          code: "STAT-701",
          provider: "National Statistical Systems Training Academy (NSSTA)",
          curriculum: "Macroeconomic Aggregates • GDP Rebasing • Input-Output Matrices",
          duration: "4 Weeks (36 Hrs)",
          level: "Executive ISS",
          competencies: 8,
          enrolledCount: 3840,
          rating: 4.9,
          badge: "Featured iGOT Pathway"
        },
        {
          id: "crs-2",
          title: "Modern Survey Sampling & High-Frequency CAPI Telemetry",
          code: "SURV-420",
          provider: "Field Operations Division (FOD) Training Directorate",
          curriculum: "Stratified Multistage Sampling • Geospatial GPS Auditing • Non-Response Weighting",
          duration: "3 Weeks (24 Hrs)",
          level: "SSS & Field Officers",
          competencies: 6,
          enrolledCount: 8190,
          rating: 4.8,
          badge: "High Demand"
        },
        {
          id: "crs-3",
          title: "AI & Machine Learning for Official Administrative Data",
          code: "AIDA-850",
          provider: "ISI Kolkata & Data Informatics and Innovation Division (DIID)",
          curriculum: "Anomaly Detection in GST & Customs • LLMs for Trade Classification • Automated Imputation",
          duration: "6 Weeks (48 Hrs)",
          level: "Advanced Analysts",
          competencies: 11,
          enrolledCount: 2950,
          rating: 4.95,
          badge: "New 2026 Batch"
        },
        {
          id: "crs-4",
          title: "Consumer Price Index (CPI) & Inflation Forecasting Architectures",
          code: "ECON-510",
          provider: "Economic Statistics Division (ESD)",
          curriculum: "Item Basket Reweighting • Geometric Laspeyres Indices • Flash Nowcasting Models",
          duration: "3 Weeks (20 Hrs)",
          level: "Mid-Career Officers",
          competencies: 5,
          enrolledCount: 4210,
          rating: 4.85,
          badge: "Core Requirement"
        }
      ]
    });
  });

  // AI Course Generation Route
  app.post("/api/courses/generate", async (req, res) => {
    try {
      const { topic, category, level, duration, includeVideo, description } = req.body;
      if (!topic || typeof topic !== "string") {
        return res.status(400).json({ error: "Topic is required" });
      }

      const generatedCourse = await generateCourseWithGemini({
        topic: topic.trim(),
        category: category || "Programming",
        level: level || "Intermediate",
        duration: duration || "2.5 Hours",
        includeVideo: includeVideo !== false,
        description: description || ""
      });

      res.json({ success: true, course: generatedCourse });
    } catch (err: any) {
      console.error("Error generating course:", err);
      res.status(500).json({ error: err.message || "Failed to generate course" });
    }
  });

  // AI Chapter Content Generation Route
  app.post("/api/courses/generate-content", async (req, res) => {
    try {
      const { courseTitle, chapterTitle, chapterSummary, topic, level } = req.body;
      if (!courseTitle || !chapterTitle) {
        return res.status(400).json({ error: "courseTitle and chapterTitle are required" });
      }

      const content = await generateChapterContentWithGemini({
        courseTitle,
        chapterTitle,
        chapterSummary: chapterSummary || "",
        topic: topic || "",
        level: level || "Intermediate"
      });

      res.json({ success: true, content });
    } catch (err: any) {
      console.error("Error generating chapter content:", err);
      res.status(500).json({ error: err.message || "Failed to generate chapter content" });
    }
  });

  // AI Assessment MCQ Generator Route
  app.post("/api/assessment/generate-mcqs", async (req, res) => {
    try {
      const { notesText, questionCount, difficulty, competencyDomain, courseTitle, focusArea } = req.body;
      const count = Number(questionCount) || 5;

      const questions = await generateAssessmentMCQsWithGemini({
        notesText: notesText || "",
        questionCount: count,
        difficulty: difficulty || "Intermediate",
        competencyDomain: competencyDomain || "Statistical Concepts & Standards",
        courseTitle: courseTitle || "Official Statistics & Data Governance",
        focusArea: focusArea || ""
      });

      res.json({ success: true, questions });
    } catch (err: any) {
      console.error("Error generating assessment questions:", err);
      res.status(500).json({ error: err.message || "Failed to generate assessment questions" });
    }
  });

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LUMINA Server running on port ${PORT}`);
  });
}

startServer();
