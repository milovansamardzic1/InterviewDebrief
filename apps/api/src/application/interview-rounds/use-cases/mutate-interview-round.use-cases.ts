import type { InterviewRoundResponse } from "@interwjuer/contracts";

import { assertCondition, assertResourceExists } from "../../shared/assert-resource.js";
import {
  assertValidStatusTransition,
  resolveCompletedAt,
} from "../round-status.js";
import type { InterviewRoundsRepository } from "../ports/interview-rounds.repository.js";

export type CreateInterviewRoundInput = {
  applicationId: string;
  userId: string;
  interviewTypeId: string;
  sortOrder?: number;
  status?: import("@interwjuer/contracts").InterviewRoundStatus;
  scheduledAt?: Date | null;
  notes?: string | null;
};

export class CreateInterviewRoundUseCase {
  constructor(private readonly repository: InterviewRoundsRepository) {}

  async execute(input: CreateInterviewRoundInput): Promise<InterviewRoundResponse> {
    const round = await this.repository.create({
      applicationId: input.applicationId,
      userId: input.userId,
      interviewTypeId: input.interviewTypeId,
      sortOrder: input.sortOrder,
      status: input.status,
      scheduledAt: input.scheduledAt,
      notes: input.notes,
    });

    assertResourceExists(round, "Application not found", "APPLICATION_NOT_FOUND");
    return round;
  }
}

export type UpdateInterviewRoundInput = {
  applicationId: string;
  roundId: string;
  userId: string;
  interviewTypeId?: string;
  sortOrder?: number;
  status?: import("@interwjuer/contracts").InterviewRoundStatus;
  scheduledAt?: Date | null;
  completedAt?: Date | null;
  notes?: string | null;
};

export class UpdateInterviewRoundUseCase {
  constructor(private readonly repository: InterviewRoundsRepository) {}

  async execute(input: UpdateInterviewRoundInput): Promise<InterviewRoundResponse> {
    const existing = await this.repository.findRoundForUser(
      input.applicationId,
      input.roundId,
      input.userId,
    );

    assertResourceExists(existing, "Round not found", "ROUND_NOT_FOUND");

    if (input.status !== undefined) {
      assertValidStatusTransition(existing.status, input.status);
    }

    const completedAt = input.status
      ? resolveCompletedAt(existing.status, input.status, input.completedAt)
      : input.completedAt;

    const round = await this.repository.update(
      input.applicationId,
      input.roundId,
      input.userId,
      {
        interviewTypeId: input.interviewTypeId,
        sortOrder: input.sortOrder,
        status: input.status,
        scheduledAt: input.scheduledAt,
        completedAt,
        notes: input.notes,
      },
    );

    assertResourceExists(round, "Round not found", "ROUND_NOT_FOUND");
    return round;
  }
}

export type DeleteInterviewRoundInput = {
  applicationId: string;
  roundId: string;
  userId: string;
};

export class DeleteInterviewRoundUseCase {
  constructor(private readonly repository: InterviewRoundsRepository) {}

  async execute(input: DeleteInterviewRoundInput): Promise<void> {
    const deleted = await this.repository.delete(
      input.applicationId,
      input.roundId,
      input.userId,
    );

    assertCondition(deleted, "Round not found", "ROUND_NOT_FOUND");
  }
}
