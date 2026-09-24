import type { LearningPlanItemRecord } from "../read-models/learning-plan.record.js";

export type LearningPlanRepository = {
  getPlanForUser(userId: string): Promise<LearningPlanItemRecord[]>;
};
