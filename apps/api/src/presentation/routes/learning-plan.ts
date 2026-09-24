import { Hono } from "hono";

import type { GetLearningPlanUseCase } from "../../application/learning-plan/use-cases/get-learning-plan.use-case.js";
import type { AppVariables } from "../context.js";

export type LearningPlanRouteDeps = {
  getLearningPlan: GetLearningPlanUseCase;
};

export function createLearningPlanRoutes(deps: LearningPlanRouteDeps) {
  return new Hono<{ Variables: AppVariables }>().get("/", async (c) => {
    const userId = c.get("userId");
    const plan = await deps.getLearningPlan.execute(userId);
    return c.json(plan);
  });
}
