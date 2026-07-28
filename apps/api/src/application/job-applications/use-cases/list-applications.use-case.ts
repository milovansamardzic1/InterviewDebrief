import type {
  ApplicationListItem,
  ApplicationListResponse,
  ApplicationStatus,
} from "@interwjuer/contracts";

import type { JobApplicationsRepository } from "../ports/job-applications.repository.js";
import type { ApplicationListRecord } from "../read-models/application-list.record.js";

export type ListApplicationsInput = {
  userId: string;
  limit?: number;
  cursor?: string;
  search?: string;
  status?: ApplicationStatus;
  applicationSourceId?: string;
  dateFrom?: Date;
  dateTo?: Date;
};

function toApplicationListItem(
  application: ApplicationListRecord,
): ApplicationListItem {
  const totalQuestions = application.rounds.reduce(
    (sum, round) => sum + round.questionCount,
    0,
  );

  return {
    id: application.id,
    company: application.company,
    position: application.position,
    location: application.location,
    applicationStatus: application.applicationStatus,
    applicationDate: application.applicationDate,
    salaryMin: application.salaryMin,
    salaryMax: application.salaryMax,
    sourceName: application.sourceName,
    roundCount: application.rounds.length,
    totalQuestions,
    rounds: application.rounds.map((round) => ({
      id: round.id,
      sortOrder: round.sortOrder,
      status: round.status,
      scheduledAt: round.scheduledAt,
      interviewTypeName: round.interviewTypeName,
      questionCount: round.questionCount,
    })),
  };
}

export class ListApplicationsUseCase {
  constructor(private readonly repository: JobApplicationsRepository) {}

  async execute(
    input: ListApplicationsInput,
  ): Promise<ApplicationListResponse> {
    const result = await this.repository.findManyForList({
      userId: input.userId,
      limit: input.limit,
      cursor: input.cursor,
      search: input.search,
      status: input.status,
      applicationSourceId: input.applicationSourceId,
      dateFrom: input.dateFrom,
      dateTo: input.dateTo,
    });

    return {
      items: result.items.map(toApplicationListItem),
      nextCursor: result.nextCursor,
    };
  }
}
