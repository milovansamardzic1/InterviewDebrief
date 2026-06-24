import type { InterviewRoundStatus } from "./enums.js";
import type { ApplicationDetailRound } from "./job-applications.js";

export type CreateInterviewRoundRequest = {
  interviewTypeId: string;
  sortOrder?: number;
  status?: InterviewRoundStatus;
  scheduledAt?: Date | string | null;
  notes?: string | null;
};

export type UpdateInterviewRoundRequest = {
  interviewTypeId?: string;
  sortOrder?: number;
  status?: InterviewRoundStatus;
  scheduledAt?: Date | string | null;
  completedAt?: Date | string | null;
  notes?: string | null;
};

export type InterviewRoundResponse = ApplicationDetailRound;
