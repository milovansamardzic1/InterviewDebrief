import type { ApplicationStatus } from "./enums.js";

export type DashboardStats = {
  jobApplications: number;
  interviewRounds: number;
  questions: number;
  skillEvaluations: number;
  skills: number;
  weakSkills: WeakSkillStat[];
  questionsByTopic: TopicCount[];
  statusBreakdown: StatusCount[];
  progressOverTime: MonthlyProgress[];
  activeApplications: DashboardActiveApplication[];
  upcomingRound: DashboardUpcomingRound | null;
};

export type WeakSkillStat = {
  skillId: string;
  skillName: string;
  skillCategory: string | null;
  averageScore: number;
  evaluationCount: number;
};

export type TopicCount = {
  topic: string;
  count: number;
};

export type StatusCount = {
  status: string;
  count: number;
};

export type MonthlyProgress = {
  month: string;
  completedRounds: number;
  averageSkillScore: number | null;
};

export type DashboardActiveApplication = {
  id: string;
  company: string;
  position: string;
  applicationStatus: ApplicationStatus;
};

export type DashboardUpcomingRound = {
  id: string;
  roundType: string;
  scheduledAt: string;
  company: string;
  position: string;
  applicationId: string;
};
