import type { ApplicationDetail } from "@interwjuer/contracts";

import { assertCondition, assertResourceExists } from "../../shared/assert-resource.js";
import type { JobApplicationsRepository } from "../ports/job-applications.repository.js";
import type { ApplicationDetailRecord } from "../read-models/application-detail.record.js";

function toApplicationDetail(
  application: ApplicationDetailRecord,
): ApplicationDetail {
  return {
    id: application.id,
    company: application.company,
    position: application.position,
    location: application.location,
    applicationStatus: application.applicationStatus,
    applicationDate: application.applicationDate,
    salaryMin: application.salaryMin,
    salaryMax: application.salaryMax,
    jobPostingUrl: application.jobPostingUrl,
    jobDescription: application.jobDescription,
    rejectionReason: application.rejectionReason,
    notes: application.notes,
    sourceName: application.sourceName,
    rounds: application.rounds.map((round) => ({
      id: round.id,
      sortOrder: round.sortOrder,
      status: round.status,
      scheduledAt: round.scheduledAt,
      completedAt: round.completedAt,
      notes: round.notes,
      interviewTypeName: round.interviewTypeName,
      interviewTypeDescription: round.interviewTypeDescription,
      questions: round.questions,
      skillEvaluations: round.skillEvaluations,
    })),
  };
}

export type CreateApplicationInput = {
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
  applicationStatus?: import("@interwjuer/contracts").ApplicationStatus;
  notes?: string | null;
};

export class CreateApplicationUseCase {
  constructor(private readonly repository: JobApplicationsRepository) {}

  async execute(input: CreateApplicationInput): Promise<ApplicationDetail> {
    const application = await this.repository.create({
      userId: input.userId,
      company: input.company,
      position: input.position,
      applicationSourceId: input.applicationSourceId,
      applicationDate: input.applicationDate,
      location: input.location,
      salaryMin: input.salaryMin,
      salaryMax: input.salaryMax,
      jobPostingUrl: input.jobPostingUrl,
      jobDescription: input.jobDescription,
      applicationStatus: input.applicationStatus,
      notes: input.notes,
    });

    return toApplicationDetail(application);
  }
}

export type UpdateApplicationInput = {
  id: string;
  userId: string;
  company?: string;
  position?: string;
  applicationSourceId?: string;
  applicationDate?: Date;
  location?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  jobPostingUrl?: string | null;
  jobDescription?: string | null;
  applicationStatus?: import("@interwjuer/contracts").ApplicationStatus;
  rejectionReason?: string | null;
  notes?: string | null;
};

export class UpdateApplicationUseCase {
  constructor(private readonly repository: JobApplicationsRepository) {}

  async execute(input: UpdateApplicationInput): Promise<ApplicationDetail> {
    const application = await this.repository.update(input.id, input.userId, {
      company: input.company,
      position: input.position,
      applicationSourceId: input.applicationSourceId,
      applicationDate: input.applicationDate,
      location: input.location,
      salaryMin: input.salaryMin,
      salaryMax: input.salaryMax,
      jobPostingUrl: input.jobPostingUrl,
      jobDescription: input.jobDescription,
      applicationStatus: input.applicationStatus,
      rejectionReason: input.rejectionReason,
      notes: input.notes,
    });

    assertResourceExists(application, "Application not found", "APPLICATION_NOT_FOUND");
    return toApplicationDetail(application);
  }
}

export type DeleteApplicationInput = {
  id: string;
  userId: string;
};

export class DeleteApplicationUseCase {
  constructor(private readonly repository: JobApplicationsRepository) {}

  async execute(input: DeleteApplicationInput): Promise<void> {
    const deleted = await this.repository.delete(input.id, input.userId);
    assertCondition(deleted, "Application not found", "APPLICATION_NOT_FOUND");
  }
}
