export type ApplicationStatus =
  | "APPLIED"
  | "SCREENING"
  | "INTERVIEWING"
  | "OFFER"
  | "ACCEPTED"
  | "REJECTED"
  | "WITHDRAWN";

export type RejectionCategory =
  | "TECHNICAL_SKILLS"
  | "SYSTEM_DESIGN"
  | "PROBLEM_SOLVING"
  | "COMMUNICATION"
  | "EXPERIENCE_FIT"
  | "COMPENSATION"
  | "POSITION_CLOSED"
  | "OTHER";

export type LearningTaskStatus = "PLANNED" | "IN_PROGRESS" | "COMPLETED";

export type LearningTaskPriority = "LOW" | "MEDIUM" | "HIGH";

export type InterviewRoundStatus =
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";
