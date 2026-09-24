import type {
  CreateLearningTaskRequest,
  LearningTask,
  LearningTaskListResponse,
  UpdateLearningTaskRequest,
} from "@interwjuer/contracts";

import { api } from "@/lib/api/client";

export const learningTasksApi = {
  list(options: { includeCompleted?: boolean } = {}) {
    const params = new URLSearchParams();

    if (options.includeCompleted !== undefined) {
      params.set("includeCompleted", String(options.includeCompleted));
    }

    const query = params.toString();
    return api.get<LearningTaskListResponse>(
      `/learning-tasks${query ? `?${query}` : ""}`,
    );
  },

  create(body: CreateLearningTaskRequest) {
    return api.post<LearningTask>("/learning-tasks", body);
  },

  update(id: string, body: UpdateLearningTaskRequest) {
    return api.patch<LearningTask>(`/learning-tasks/${id}`, body);
  },

  delete(id: string) {
    return api.delete(`/learning-tasks/${id}`);
  },
};
