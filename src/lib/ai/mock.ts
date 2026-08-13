import type { JobAnalysisResult } from "@/lib/ai/types";

export function getMockText(instructions: string): string {
  if (instructions.includes("cover letter section")) {
    return "I am excited to apply for this role, bringing proven experience aligned with your team's priorities.";
  }
  if (instructions.includes("professional summary")) {
    return "Results-driven professional with demonstrated experience across relevant roles, focused on delivering measurable outcomes while collaborating across teams.";
  }
  return "Developed and delivered high-quality work aligned with team objectives, improving processes and supporting stakeholders effectively.";
}

export function getMockStructured(schemaName: string): unknown {
  switch (schemaName) {
    case "job_analysis":
      return {
        jobTitle: "Product Designer",
        skills: ["Figma", "User Research", "Prototyping"],
        preferredSkills: ["Design Systems", "A/B Testing"],
        keywords: ["product design", "UX", "cross-functional"],
        responsibilities: ["Lead design for key product flows", "Partner with engineering"],
        experienceRequirements: ["3+ years product design experience"],
        educationRequirements: ["Degree or equivalent experience"],
        companyValues: ["Innovation", "Collaboration"],
        roleExpectations: ["Ship high-quality designs", "Present to stakeholders"],
      } satisfies JobAnalysisResult;
    case "experience_bullets":
      return {
        bullets: [
          "Supported customer enquiries and resolved issues promptly.",
          "Collaborated with team members to improve service workflows.",
        ],
        explanation: "Grounded bullets based on provided description.",
        confidence: 0.85,
        metricQuestions: ["What volume of enquiries did you handle weekly?"],
      };
    case "skills_suggestions":
      return {
        demonstratedSkills: ["Customer Support", "Communication"],
        skillsToConsider: ["CRM tools", "Conflict resolution"],
        explanation: "Based on your experience description.",
        confidence: 0.82,
      };
    case "cover_letter_generate":
      return {
        body: {
          greeting: "Dear Hiring Manager,",
          opening: "I am writing to express my interest in the role.",
          experience: "My background includes relevant experience detailed in my CV.",
          skills: "I bring skills aligned with your requirements.",
          closing: "Thank you for your consideration.",
          signature: "Kind regards,",
        },
        explanation: "Draft based on provided CV and job details.",
        confidence: 0.88,
      };
    case "cv_analysis":
      return {
        overallScore: 78,
        atsScore: 85,
        disclaimer:
          "VitatePro AI assessment — not a hiring guarantee or universal ATS score.",
        categories: [
          {
            id: "content",
            label: "Content",
            score: 80,
            status: "good",
            explanation: "Solid foundation with room to strengthen outcomes.",
            strengths: ["Clear section structure"],
            improvements: ["Add measurable outcomes where available"],
          },
          {
            id: "experience",
            label: "Experience",
            score: 75,
            status: "good",
            explanation: "Experience entries are present but could be more specific.",
            strengths: ["Relevant roles listed"],
            improvements: ["Strengthen bullet impact"],
          },
        ],
        atsBreakdown: [
          { id: "structure", label: "Section Structure", score: 90 },
          { id: "keywords", label: "Keyword Alignment", score: 78 },
          { id: "formatting", label: "Formatting", score: 88 },
        ],
        atsIssues: [],
        strengths: ["Clear structure", "Professional tone"],
        weaknesses: ["Limited measurable outcomes"],
        recommendations: [
          {
            id: "rec_1",
            priority: "high",
            title: "Strengthen professional summary",
            reason: "Summary could better highlight your target role.",
            action: "Improve summary with AI",
            sectionType: "summary",
            aiAction: "summary",
          },
        ],
        improvementPlan: [
          {
            id: "plan_1",
            priority: "high",
            title: "Strengthen professional summary",
            reason: "Opens stronger with role alignment.",
            action: "Improve summary",
            sectionType: "summary",
            aiAction: "summary",
          },
        ],
        summaryAnalysis: {
          score: 72,
          explanation: "Summary is present but generic.",
          strengths: ["Professional tone"],
          improvements: ["Add role-specific positioning"],
        },
        experienceAnalysis: [],
        educationAnalysis: null,
        isIncomplete: false,
        missingAreas: [],
      };
    case "job_match":
      return {
        matchScore: 74,
        disclaimer:
          "AI-assisted relevance assessment — not a hiring probability.",
        breakdown: [
          { id: "skills", label: "Skills Match", score: 78 },
          { id: "experience", label: "Experience Match", score: 72 },
          { id: "keywords", label: "Keyword Match", score: 70 },
        ],
        matchingSkills: ["Communication", "Teamwork"],
        missingKeywords: ["Project management"],
        keywords: [
          { keyword: "Communication", priority: "high", status: "present" },
          { keyword: "Project management", priority: "medium", status: "missing" },
        ],
        skillGaps: [
          {
            skill: "Project management",
            status: "missing_from_cv",
            note: "Mentioned in job description but not clearly demonstrated in CV.",
          },
        ],
        relevantExperience: [],
        recommendations: [],
        jobTitle: "Target Role",
      };
    case "ai_suggestion":
      return {
        suggestion: "Developed customer support processes that improved response quality.",
        explanation: "Stronger action verb without inventing metrics.",
        confidence: 0.87,
        metricQuestions: [],
      };
    default:
      return {
        suggestion: "Improved professional wording based on your input.",
        explanation: "Mock AI response for development.",
        confidence: 0.8,
      };
  }
}
