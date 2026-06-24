import type { ApplicationStatus, InterviewRoundStatus } from "./enums.js";

export type ApplicationListRound = {
  id: string;
  sortOrder: number;
  status: InterviewRoundStatus;
  scheduledAt: Date | null;
  interviewTypeName: string;
  questionCount: number;
};

export type ApplicationListItem = {
  id: string;
  company: string;
  position: string;
  location: string | null;
  applicationStatus: ApplicationStatus;
  applicationDate: Date;
  salaryMin: number | null;
  salaryMax: number | null;
  sourceName: string;
  roundCount: number;
  totalQuestions: number;
  rounds: ApplicationListRound[];
};

export type ApplicationDetailQuestion = {
  id: string;
  question: string;
  myAnswer: string | null;
  topic: string | null;
  difficulty: number | null;
  notes: string | null;
};

export type ApplicationDetailSkillEvaluation = {
  id: string;
  skillName: string;
  skillCategory: string | null;
  score: number;
  notes: string | null;
};

export type ApplicationDetailRound = {
  id: string;
  sortOrder: number;
  status: InterviewRoundStatus;
  scheduledAt: Date | null;
  completedAt: Date | null;
  notes: string | null;
  interviewTypeName: string;
  interviewTypeDescription: string | null;
  questions: ApplicationDetailQuestion[];
  skillEvaluations: ApplicationDetailSkillEvaluation[];
};

export type ApplicationDetail = {
  id: string;
  company: string;
  position: string;
  location: string | null;
  applicationStatus: ApplicationStatus;
  applicationDate: Date;
  salaryMin: number | null;
  salaryMax: number | null;
  jobPostingUrl: string | null;
  jobDescription: string | null;
  rejectionReason: string | null;
  notes: string | null;
  sourceName: string;
  rounds: ApplicationDetailRound[];
};
