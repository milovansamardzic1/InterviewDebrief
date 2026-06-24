import { Hono } from "hono";

import type { GetDashboardStatsUseCase } from "../../application/dashboard/use-cases/get-dashboard-stats.use-case.js";
import type { AppVariables } from "../context.js";

export type DashboardRouteDeps = {
  getDashboardStats: GetDashboardStatsUseCase;
};

export function createDashboardRoutes(deps: DashboardRouteDeps) {
  return new Hono<{ Variables: AppVariables }>().get("/stats", async (c) => {
    const userId = c.get("userId");
    const stats = await deps.getDashboardStats.execute(userId);
    return c.json(stats);
  });
}
