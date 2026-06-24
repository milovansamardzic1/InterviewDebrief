import type { PrismaClient } from "@prisma/client";

import type {
  CreateInterviewRoundData,
  InterviewRoundsRepository,
  UpdateInterviewRoundData,
} from "../../../application/interview-rounds/ports/interview-rounds.repository.js";
import type { Logger } from "../../logging/logger.js";
import {
  roundDetailArgs,
  toInterviewRoundResponse,
} from "./mappers/interview-round.mapper.js";
import { runPrismaOperation } from "./prisma-error.js";

export class PrismaInterviewRoundsRepository implements InterviewRoundsRepository {
  constructor(
    private readonly db: PrismaClient,
    private readonly logger: Logger,
  ) {}

  private async assertApplicationOwnership(
    applicationId: string,
    userId: string,
  ): Promise<boolean> {
    const count = await runPrismaOperation(
      "interviewRound.assertApplicationOwnership",
      this.logger,
      () =>
        this.db.jobApplication.count({
          where: { id: applicationId, userId },
        }),
    );

    return count > 0;
  }

  async create(data: CreateInterviewRoundData) {
    const owned = await this.assertApplicationOwnership(
      data.applicationId,
      data.userId,
    );

    if (!owned) {
      return null;
    }

    let sortOrder = data.sortOrder;

    if (sortOrder === undefined) {
      const aggregate = await runPrismaOperation(
        "interviewRound.maxSortOrder",
        this.logger,
        () =>
          this.db.interviewRound.aggregate({
            where: { jobApplicationId: data.applicationId },
            _max: { sortOrder: true },
          }),
      );

      sortOrder = (aggregate._max.sortOrder ?? 0) + 1;
    }

    const round = await runPrismaOperation(
      "interviewRound.create",
      this.logger,
      () =>
        this.db.interviewRound.create({
          data: {
            jobApplicationId: data.applicationId,
            interviewTypeId: data.interviewTypeId,
            sortOrder,
            status: data.status ?? "SCHEDULED",
            scheduledAt: data.scheduledAt ?? null,
            notes: data.notes ?? null,
          },
          ...roundDetailArgs,
        }),
    );

    return toInterviewRoundResponse(round);
  }

  async update(
    applicationId: string,
    roundId: string,
    userId: string,
    data: UpdateInterviewRoundData,
  ) {
    const existing = await this.findRoundForUser(
      applicationId,
      roundId,
      userId,
    );

    if (!existing) {
      return null;
    }

    const round = await runPrismaOperation(
      "interviewRound.update",
      this.logger,
      () =>
        this.db.interviewRound.update({
          where: { id: roundId, jobApplicationId: applicationId },
          data: {
            ...(data.interviewTypeId !== undefined
              ? { interviewTypeId: data.interviewTypeId }
              : {}),
            ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
            ...(data.status !== undefined ? { status: data.status } : {}),
            ...(data.scheduledAt !== undefined
              ? { scheduledAt: data.scheduledAt }
              : {}),
            ...(data.completedAt !== undefined
              ? { completedAt: data.completedAt }
              : {}),
            ...(data.notes !== undefined ? { notes: data.notes } : {}),
          },
          ...roundDetailArgs,
        }),
    );

    return toInterviewRoundResponse(round);
  }

  async delete(applicationId: string, roundId: string, userId: string) {
    const existing = await this.findRoundForUser(
      applicationId,
      roundId,
      userId,
    );

    if (!existing) {
      return false;
    }

    await runPrismaOperation("interviewRound.delete", this.logger, () =>
      this.db.interviewRound.delete({
        where: { id: roundId, jobApplicationId: applicationId },
      }),
    );

    return true;
  }

  async findRoundForUser(
    applicationId: string,
    roundId: string,
    userId: string,
  ) {
    const owned = await this.assertApplicationOwnership(applicationId, userId);

    if (!owned) {
      return null;
    }

    const round = await runPrismaOperation(
      "interviewRound.findRoundForUser",
      this.logger,
      () =>
        this.db.interviewRound.findFirst({
          where: {
            id: roundId,
            jobApplicationId: applicationId,
          },
          ...roundDetailArgs,
        }),
    );

    if (!round) {
      return null;
    }

    return toInterviewRoundResponse(round);
  }
}
