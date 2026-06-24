import type { ApplicationDetail } from "@interwjuer/contracts";

import type { JobApplicationsRepository } from "../ports/job-applications.repository.js";

export type GetApplicationByIdInput = {
  id: string;
  userId: string;
};

export class GetApplicationByIdUseCase {
  constructor(private readonly repository: JobApplicationsRepository) {}

  async execute(
    input: GetApplicationByIdInput,
  ): Promise<ApplicationDetail | null> {
    return this.repository.findDetailById(input.id, {
      userId: input.userId,
    });
  }
}
