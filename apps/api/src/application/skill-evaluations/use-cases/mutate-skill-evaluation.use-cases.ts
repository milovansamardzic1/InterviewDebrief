import type { SkillEvaluationResponse } from "@interwjuer/contracts";

import { assertCondition, assertResourceExists } from "../../shared/assert-resource.js";
import type { SkillEvaluationsRepository } from "../ports/skill-evaluations.repository.js";

export type CreateSkillEvaluationInput = {
  applicationId: string;
  roundId: string;
  userId: string;
  skillId: string;
  score: number;
  notes?: string | null;
};

export class CreateSkillEvaluationUseCase {
  constructor(private readonly repository: SkillEvaluationsRepository) {}

  async execute(
    input: CreateSkillEvaluationInput,
  ): Promise<SkillEvaluationResponse> {
    const evaluation = await this.repository.create({
      applicationId: input.applicationId,
      roundId: input.roundId,
      userId: input.userId,
      skillId: input.skillId,
      score: input.score,
      notes: input.notes,
    });

    assertResourceExists(evaluation, "Round not found", "ROUND_NOT_FOUND");
    return evaluation;
  }
}

export type UpdateSkillEvaluationInput = {
  applicationId: string;
  roundId: string;
  evaluationId: string;
  userId: string;
  score?: number;
  notes?: string | null;
};

export class UpdateSkillEvaluationUseCase {
  constructor(private readonly repository: SkillEvaluationsRepository) {}

  async execute(
    input: UpdateSkillEvaluationInput,
  ): Promise<SkillEvaluationResponse> {
    const evaluation = await this.repository.update(
      input.applicationId,
      input.roundId,
      input.evaluationId,
      input.userId,
      {
        score: input.score,
        notes: input.notes,
      },
    );

    assertResourceExists(
      evaluation,
      "Skill evaluation not found",
      "SKILL_EVALUATION_NOT_FOUND",
    );
    return evaluation;
  }
}

export type DeleteSkillEvaluationInput = {
  applicationId: string;
  roundId: string;
  evaluationId: string;
  userId: string;
};

export class DeleteSkillEvaluationUseCase {
  constructor(private readonly repository: SkillEvaluationsRepository) {}

  async execute(input: DeleteSkillEvaluationInput): Promise<void> {
    const deleted = await this.repository.delete(
      input.applicationId,
      input.roundId,
      input.evaluationId,
      input.userId,
    );

    assertCondition(
      deleted,
      "Skill evaluation not found",
      "SKILL_EVALUATION_NOT_FOUND",
    );
  }
}
