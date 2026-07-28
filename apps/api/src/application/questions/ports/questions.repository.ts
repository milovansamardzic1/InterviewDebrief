import type { QuestionResponse } from "@interwjuer/contracts";

import type { QuestionHistoryRecord } from "../read-models/question-history.record.js";

export type CreateQuestionData = {
  applicationId: string;
  roundId: string;
  userId: string;
  question: string;
  myAnswer?: string | null;
  topic?: string | null;
  difficulty?: number | null;
  notes?: string | null;
};

export type UpdateQuestionData = {
  question?: string;
  myAnswer?: string | null;
  topic?: string | null;
  difficulty?: number | null;
  notes?: string | null;
};

export type ListQuestionHistoryOptions = {
  userId: string;
  limit?: number;
  cursor?: string;
  topic?: string;
};

export type QuestionHistoryPage = {
  items: QuestionHistoryRecord[];
  nextCursor: string | null;
};

export interface QuestionsRepository {
  create(data: CreateQuestionData): Promise<QuestionResponse | null>;

  update(
    applicationId: string,
    roundId: string,
    questionId: string,
    userId: string,
    data: UpdateQuestionData,
  ): Promise<QuestionResponse | null>;

  delete(
    applicationId: string,
    roundId: string,
    questionId: string,
    userId: string,
  ): Promise<boolean>;

  listHistoryForUser(
    options: ListQuestionHistoryOptions,
  ): Promise<QuestionHistoryPage>;
}
