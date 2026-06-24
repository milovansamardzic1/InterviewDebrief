import type { PrismaClient } from "@prisma/client";

import type {
  CreateSkillEvaluationData,
  SkillEvaluationsRepository,
  UpdateSkillEvaluationData,
} from "../../../application/skill-evaluations/ports/skill-evaluations.repository.js";
import type { Logger } from "../../logging/logger.js";
import { runPrismaOperation } from "./prisma-error.js";

function toSkillEvaluationResponse(evaluation: {
  id: string;
  score: number;
  notes: string | null;
  skill: { name: string; category: string | null };
}) {
  return {
    id: evaluation.id,
    skillName: evaluation.skill.name,
    skillCategory: evaluation.skill.category,
    score: evaluation.score,
    notes: evaluation.notes,
  };
}

const evaluationInclude = {
  skill: true,
} as const;

export class PrismaSkillEvaluationsRepository implements SkillEvaluationsRepository {
  constructor(
    private readonly db: PrismaClient,
    private readonly logger: Logger,
  ) {}

  private async roundOwnedByUser(
    applicationId: string,
    roundId: string,
    userId: string,
  ): Promise<boolean> {
    const count = await runPrismaOperation(
      "skillEvaluation.roundOwnedByUser",
      this.logger,
      () =>
        this.db.interviewRound.count({
          where: {
            id: roundId,
            jobApplicationId: applicationId,
            jobApplication: { userId },
          },
        }),
    );

    return count > 0;
  }

  async create(data: CreateSkillEvaluationData) {
    const owned = await this.roundOwnedByUser(
      data.applicationId,
      data.roundId,
      data.userId,
    );

    if (!owned) {
      return null;
    }

    const evaluation = await runPrismaOperation(
      "skillEvaluation.create",
      this.logger,
      () =>
        this.db.skillEvaluation.create({
          data: {
            interviewRoundId: data.roundId,
            skillId: data.skillId,
            score: data.score,
            notes: data.notes ?? null,
          },
          include: evaluationInclude,
        }),
    );

    return toSkillEvaluationResponse(evaluation);
  }

  async update(
    applicationId: string,
    roundId: string,
    evaluationId: string,
    userId: string,
    data: UpdateSkillEvaluationData,
  ) {
    const owned = await this.roundOwnedByUser(applicationId, roundId, userId);

    if (!owned) {
      return null;
    }

    const existing = await runPrismaOperation(
      "skillEvaluation.findForUpdate",
      this.logger,
      () =>
        this.db.skillEvaluation.findFirst({
          where: {
            id: evaluationId,
            interviewRoundId: roundId,
          },
        }),
    );

    if (!existing) {
      return null;
    }

    const evaluation = await runPrismaOperation(
      "skillEvaluation.update",
      this.logger,
      () =>
        this.db.skillEvaluation.update({
          where: { id: evaluationId },
          data: {
            ...(data.score !== undefined ? { score: data.score } : {}),
            ...(data.notes !== undefined ? { notes: data.notes } : {}),
          },
          include: evaluationInclude,
        }),
    );

    return toSkillEvaluationResponse(evaluation);
  }

  async delete(
    applicationId: string,
    roundId: string,
    evaluationId: string,
    userId: string,
  ) {
    const owned = await this.roundOwnedByUser(applicationId, roundId, userId);

    if (!owned) {
      return false;
    }

    const existing = await runPrismaOperation(
      "skillEvaluation.findForDelete",
      this.logger,
      () =>
        this.db.skillEvaluation.findFirst({
          where: {
            id: evaluationId,
            interviewRoundId: roundId,
          },
        }),
    );

    if (!existing) {
      return false;
    }

    await runPrismaOperation("skillEvaluation.delete", this.logger, () =>
      this.db.skillEvaluation.delete({ where: { id: evaluationId } }),
    );

    return true;
  }
}
