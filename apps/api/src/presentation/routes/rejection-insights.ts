import { Hono } from "hono";

import type { GetRejectionInsightsUseCase } from "../../application/rejection-insights/use-cases/get-rejection-insights.use-case.js";
import type { AppVariables } from "../context.js";

export type RejectionInsightsRouteDeps = {
  getRejectionInsights: GetRejectionInsightsUseCase;
};

export function createRejectionInsightsRoutes(
  deps: RejectionInsightsRouteDeps,
) {
  return new Hono<{ Variables: AppVariables }>().get("/", async (c) => {
    const userId = c.get("userId");
    const insights = await deps.getRejectionInsights.execute(userId);
    return c.json(insights);
  });
}
