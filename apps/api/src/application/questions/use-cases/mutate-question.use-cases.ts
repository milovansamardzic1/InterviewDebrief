import type { QuestionResponse } from "@interwjuer/contracts";

import { assertCondition, assertResourceExists } from "../../shared/assert-resource.js";
import type { QuestionsRepository } from "../ports/questions.repository.js";

export type CreateQuestionInput = {
  applicationId: string;
  roundId: string;
  userId: string;
  question: string;
  myAnswer?: string | null;
  topic?: string | null;
  difficulty?: number | null;
  notes?: string | null;
};

export class CreateQuestionUseCase {
  constructor(private readonly repository: QuestionsRepository) {}

  async execute(input: CreateQuestionInput): Promise<QuestionResponse> {
    const question = await this.repository.create({
      applicationId: input.applicationId,
      roundId: input.roundId,
      userId: input.userId,
      question: input.question,
      myAnswer: input.myAnswer,
      topic: input.topic,
      difficulty: input.difficulty,
      notes: input.notes,
    });

    assertResourceExists(question, "Round not found", "ROUND_NOT_FOUND");
    return question;
  }
}

export type UpdateQuestionInput = {
  applicationId: string;
  roundId: string;
  questionId: string;
  userId: string;
  question?: string;
  myAnswer?: string | null;
  topic?: string | null;
  difficulty?: number | null;
  notes?: string | null;
};

export class UpdateQuestionUseCase {
  constructor(private readonly repository: QuestionsRepository) {}

  async execute(input: UpdateQuestionInput): Promise<QuestionResponse> {
    const question = await this.repository.update(
      input.applicationId,
      input.roundId,
      input.questionId,
      input.userId,
      {
        question: input.question,
        myAnswer: input.myAnswer,
        topic: input.topic,
        difficulty: input.difficulty,
        notes: input.notes,
      },
    );

    assertResourceExists(question, "Question not found", "QUESTION_NOT_FOUND");
    return question;
  }
}

export type DeleteQuestionInput = {
  applicationId: string;
  roundId: string;
  questionId: string;
  userId: string;
};

export class DeleteQuestionUseCase {
  constructor(private readonly repository: QuestionsRepository) {}

  async execute(input: DeleteQuestionInput): Promise<void> {
    const deleted = await this.repository.delete(
      input.applicationId,
      input.roundId,
      input.questionId,
      input.userId,
    );

    assertCondition(deleted, "Question not found", "QUESTION_NOT_FOUND");
  }
}
