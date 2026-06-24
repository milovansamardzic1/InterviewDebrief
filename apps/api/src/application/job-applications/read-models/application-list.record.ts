import type {
  ApplicationStatus,
  InterviewRoundStatus,
} from "@interwjuer/contracts";

export type ApplicationListRoundRecord = {
  id: string;
  sortOrder: number;
  status: InterviewRoundStatus;
  scheduledAt: Date | null;
  interviewTypeName: string;
  questionCount: number;
};

export type ApplicationListRecord = {
  id: string;
  company: string;
  position: string;
  location: string | null;
  applicationStatus: ApplicationStatus;
  applicationDate: Date;
  salaryMin: number | null;
  salaryMax: number | null;
  sourceName: string;
  rounds: ApplicationListRoundRecord[];
};
