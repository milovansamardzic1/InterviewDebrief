import type { QuestionHistoryResponse } from "@interwjuer/contracts";

import { api } from "@/lib/api/client";

export type QuestionHistoryParams = {
  topic?: string;
  search?: string;
  company?: string;
  difficulty?: number;
  answeredOnly?: boolean;
  cursor?: string;
};

export const questionsApi = {
  history(params: QuestionHistoryParams = {}) {
    const query = new URLSearchParams();

    if (params.topic) {
      query.set("topic", params.topic);
    }

    if (params.search) {
      query.set("search", params.search);
    }

    if (params.company) {
      query.set("company", params.company);
    }

    if (params.difficulty !== undefined) {
      query.set("difficulty", String(params.difficulty));
    }

    if (params.answeredOnly) {
      query.set("answeredOnly", "true");
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
