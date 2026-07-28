import type { QuestionHistoryResponse } from "@interwjuer/contracts";

import { api } from "@/lib/api/client";

export type QuestionHistoryParams = {
  topic?: string;
  cursor?: string;
};

export const questionsApi = {
  history(params: QuestionHistoryParams = {}) {
    const query = new URLSearchParams();

    if (params.topic) {
      query.set("topic", params.topic);
    }

    if (params.cursor) {
      query.set("cursor", params.cursor);
    }

    const queryString = query.toString();
    return api.get<QuestionHistoryResponse>(
      `/questions${queryString ? `?${queryString}` : ""}`,
    );
  },
};
