import type { LearningPlanResponse } from "@interwjuer/contracts";

import { api } from "@/lib/api/client";

export const learningPlanApi = {
  get() {
    return api.get<LearningPlanResponse>("/learning-plan");
  },
};
