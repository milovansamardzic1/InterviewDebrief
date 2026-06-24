import type { ApplicationStatus } from "./enums.js";
import type { ApplicationDetail } from "./job-applications.js";

export type CreateApplicationRequest = {
  company: string;
  position: string;
  applicationSourceId: string;
  applicationDate: Date | string;
  location?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  jobPostingUrl?: string | null;
  jobDescription?: string | null;
  applicationStatus?: ApplicationStatus;
  notes?: string | null;
};

export type UpdateApplicationRequest = {
  company?: string;
  position?: string;
  applicationSourceId?: string;
  applicationDate?: Date | string;
  location?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  jobPostingUrl?: string | null;
  jobDescription?: string | null;
  applicationStatus?: ApplicationStatus;
  rejectionReason?: string | null;
  notes?: string | null;
};

export type CreateApplicationResponse = ApplicationDetail;
export type UpdateApplicationResponse = ApplicationDetail;
