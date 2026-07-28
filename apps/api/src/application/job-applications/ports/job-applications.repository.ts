import type { ApplicationStatus } from "@interwjuer/contracts";

import type { ApplicationDetailRecord } from "../read-models/application-detail.record.js";
import type { ApplicationListRecord } from "../read-models/application-list.record.js";

export type FindManyApplicationsOptions = {
  userId: string;
  limit?: number;
  cursor?: string;
  search?: string;
  status?: ApplicationStatus;
  applicationSourceId?: string;
  dateFrom?: Date;
  dateTo?: Date;
};

export type FindApplicationByIdOptions = {
  userId: string;
};

export type CreateApplicationData = {
  userId: string;
  company: string;
  position: string;
  applicationSourceId: string;
  applicationDate: Date;
  location?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  jobPostingUrl?: string | null;
  jobDescription?: string | null;
  applicationStatus?: ApplicationStatus;
  notes?: string | null;
};

export type UpdateApplicationData = {
  company?: string;
  position?: string;
  applicationSourceId?: string;
  applicationDate?: Date;
  location?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  jobPostingUrl?: string | null;
  jobDescription?: string | null;
  applicationStatus?: ApplicationStatus;
  rejectionReason?: string | null;
  notes?: string | null;
};

export type PaginatedListResult = {
  items: ApplicationListRecord[];
  nextCursor: string | null;
};

export interface JobApplicationsRepository {
  findManyForList(
    options: FindManyApplicationsOptions,
  ): Promise<PaginatedListResult>;

  findDetailById(
    id: string,
    options: FindApplicationByIdOptions,
  ): Promise<ApplicationDetailRecord | null>;

  existsForUser(id: string, userId: string): Promise<boolean>;

  create(data: CreateApplicationData): Promise<ApplicationDetailRecord>;

  update(
    id: string,
    userId: string,
    data: UpdateApplicationData,
  ): Promise<ApplicationDetailRecord | null>;

  delete(id: string, userId: string): Promise<boolean>;
}
