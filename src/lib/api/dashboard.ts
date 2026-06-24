import type { DashboardStats } from "@interwjuer/contracts";

import { api } from "@/lib/api/client";

export const dashboardApi = {
  stats() {
    return api.get<DashboardStats>("/dashboard/stats");
  },
};
