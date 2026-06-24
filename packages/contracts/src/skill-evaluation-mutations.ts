import type { ApplicationDetailSkillEvaluation } from "./job-applications.js";

export type CreateSkillEvaluationRequest = {
  skillId: string;
  score: number;
  notes?: string | null;
};

export type UpdateSkillEvaluationRequest = {
  score?: number;
  notes?: string | null;
};

export type SkillEvaluationResponse = ApplicationDetailSkillEvaluation;
