import type { SkillEvaluationResponse } from "@interwjuer/contracts";

export type CreateSkillEvaluationData = {
  applicationId: string;
  roundId: string;
  userId: string;
  skillId: string;
  score: number;
  notes?: string | null;
};

export type UpdateSkillEvaluationData = {
  score?: number;
  notes?: string | null;
};

export interface SkillEvaluationsRepository {
  create(
    data: CreateSkillEvaluationData,
  ): Promise<SkillEvaluationResponse | null>;

  update(
    applicationId: string,
    roundId: string,
    evaluationId: string,
    userId: string,
    data: UpdateSkillEvaluationData,
  ): Promise<SkillEvaluationResponse | null>;

  delete(
    applicationId: string,
    roundId: string,
    evaluationId: string,
    userId: string,
  ): Promise<boolean>;
}
