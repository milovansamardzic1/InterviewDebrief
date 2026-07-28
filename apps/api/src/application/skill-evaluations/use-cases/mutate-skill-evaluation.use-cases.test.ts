import type { SkillEvaluationResponse } from "@interwjuer/contracts";
import { describe, expect, it } from "vitest";

import { NotFoundError } from "../../shared/errors/app-error.js";
import type {
  CreateSkillEvaluationData,
  SkillEvaluationsRepository,
  UpdateSkillEvaluationData,
} from "../ports/skill-evaluations.repository.js";
import {
  CreateSkillEvaluationUseCase,
  DeleteSkillEvaluationUseCase,
  UpdateSkillEvaluationUseCase,
} from "./mutate-skill-evaluation.use-cases.js";

const APPLICATION_ID = "application-1";
const ROUND_ID = "round-1";
const EVALUATION_ID = "evaluation-1";
const USER_ID = "user-1";

function toResponse(
  overrides: Partial<SkillEvaluationResponse> = {},
): SkillEvaluationResponse {
  return {
    id: EVALUATION_ID,
    skillName: "System design",
    skillCategory: null,
    score: 3,
    notes: null,
    ...overrides,
  };
}

class FakeSkillEvaluationsRepository implements SkillEvaluationsRepository {
  evaluations = new Map<string, SkillEvaluationResponse>();
  roundOwnedByUser = true;

  async create(data: CreateSkillEvaluationData) {
    if (!this.roundOwnedByUser) {
      return null;
    }
    const evaluation = toResponse({ score: data.score });
    this.evaluations.set(evaluation.id, evaluation);
    return evaluation;
  }

  async update(
    _applicationId: string,
    _roundId: string,
    evaluationId: string,
    _userId: string,
    data: UpdateSkillEvaluationData,
  ) {
    if (!this.roundOwnedByUser) {
      return null;
    }
    const existing = this.evaluations.get(evaluationId);
    if (!existing) {
      return null;
    }
    const updated = {
      ...existing,
      ...(data.score !== undefined ? { score: data.score } : {}),
    };
    this.evaluations.set(evaluationId, updated);
    return updated;
  }

  async delete(
    _applicationId: string,
    _roundId: string,
    evaluationId: string,
    _userId: string,
  ) {
    if (!this.roundOwnedByUser) {
      return false;
    }
    return this.evaluations.delete(evaluationId);
  }
}

describe("CreateSkillEvaluationUseCase", () => {
  it("throws NotFoundError when the round is not owned by the user", async () => {
    const repository = new FakeSkillEvaluationsRepository();
    repository.roundOwnedByUser = false;
    const useCase = new CreateSkillEvaluationUseCase(repository);

    await expect(
      useCase.execute({
        applicationId: APPLICATION_ID,
        roundId: ROUND_ID,
        userId: USER_ID,
        skillId: "skill-1",
        score: 4,
      }),
    ).rejects.toThrow(NotFoundError);
  });
});

describe("UpdateSkillEvaluationUseCase", () => {
  it("throws NotFoundError when the evaluation does not exist", async () => {
    const repository = new FakeSkillEvaluationsRepository();
    const useCase = new UpdateSkillEvaluationUseCase(repository);

    await expect(
      useCase.execute({
        applicationId: APPLICATION_ID,
        roundId: ROUND_ID,
        evaluationId: "missing",
        userId: USER_ID,
        score: 5,
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it("updates an existing evaluation's score", async () => {
    const repository = new FakeSkillEvaluationsRepository();
    repository.evaluations.set(EVALUATION_ID, toResponse());
    const useCase = new UpdateSkillEvaluationUseCase(repository);

    const result = await useCase.execute({
      applicationId: APPLICATION_ID,
      roundId: ROUND_ID,
      evaluationId: EVALUATION_ID,
      userId: USER_ID,
      score: 5,
    });

    expect(result.score).toBe(5);
  });
});

describe("DeleteSkillEvaluationUseCase", () => {
  it("throws NotFoundError when the evaluation does not exist", async () => {
    const repository = new FakeSkillEvaluationsRepository();
    const useCase = new DeleteSkillEvaluationUseCase(repository);

    await expect(
      useCase.execute({
        applicationId: APPLICATION_ID,
        roundId: ROUND_ID,
        evaluationId: "missing",
        userId: USER_ID,
      }),
    ).rejects.toThrow(NotFoundError);
  });
});
