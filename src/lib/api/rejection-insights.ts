import type { RejectionInsightsResponse } from "@interwjuer/contracts";

import { api } from "@/lib/api/client";

export const rejectionInsightsApi = {
  get() {
    return api.get<RejectionInsightsResponse>("/rejection-insights");
  },
};
