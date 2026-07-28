import type { QuestionHistoryItem, QuestionHistoryResponse } from "@interwjuer/contracts";

import type { QuestionsRepository } from "../ports/questions.repository.js";
import type { QuestionHistoryRecord } from "../read-models/question-history.record.js";

export type ListQuestionHistoryInput = {
  userId: string;
  limit?: number;
  cursor?: string;
  topic?: string;
};

function toQuestionHistoryItem(
  record: QuestionHistoryRecord,
): QuestionHistoryItem {
  return {
    id: record.id,
    question: record.question,
    myAnswer: record.myAnswer,
    topic: record.topic,
    difficulty: record.difficulty,
    notes: record.notes,
    applicationId: record.applicationId,
    company: record.company,
    position: record.position,
    roundId: record.roundId,
    interviewTypeName: record.interviewTypeName,
  };
}

export class ListQuestionHistoryUseCase {
  constructor(private readonly repository: QuestionsRepository) {}

  async execute(input: ListQuestionHistoryInput): Promise<QuestionHistoryResponse> {
    const result = await this.repository.listHistoryForUser({
      userId: input.userId,
      limit: input.limit,
      cursor: input.cursor,
      topic: input.topic,
    });

    return {
      items: result.items.map(toQuestionHistoryItem),
      nextCursor: result.nextCursor,
    };
  }
}
