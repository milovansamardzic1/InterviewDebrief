import type { QuestionResponse } from "@interwjuer/contracts";
import { describe, expect, it } from "vitest";

import { NotFoundError } from "../../shared/errors/app-error.js";
import type {
  CreateQuestionData,
  ListQuestionHistoryOptions,
  QuestionsRepository,
  UpdateQuestionData,
} from "../ports/questions.repository.js";
import {
  CreateQuestionUseCase,
  DeleteQuestionUseCase,
  UpdateQuestionUseCase,
} from "./mutate-question.use-cases.js";

const APPLICATION_ID = "application-1";
const ROUND_ID = "round-1";
const QUESTION_ID = "question-1";
const USER_ID = "user-1";

function toResponse(
  overrides: Partial<QuestionResponse> = {},
): QuestionResponse {
  return {
    id: QUESTION_ID,
    question: "What is a closure?",
    myAnswer: null,
    topic: null,
    difficulty: null,
    notes: null,
    ...overrides,
  };
}

class FakeQuestionsRepository implements QuestionsRepository {
  questions = new Map<string, QuestionResponse>();
  roundOwnedByUser = true;

  async create(data: CreateQuestionData) {
    if (!this.roundOwnedByUser) {
      return null;
    }
    const question = toResponse({ question: data.question });
    this.questions.set(question.id, question);
    return question;
  }

  async update(
    _applicationId: string,
    _roundId: string,
    questionId: string,
    _userId: string,
    data: UpdateQuestionData,
  ) {
    if (!this.roundOwnedByUser) {
      return null;
    }
    const existing = this.questions.get(questionId);
    if (!existing) {
      return null;
    }
    const updated = {
      ...existing,
      ...(data.question !== undefined ? { question: data.question } : {}),
    };
    this.questions.set(questionId, updated);
    return updated;
  }

  async delete(
    _applicationId: string,
    _roundId: string,
    questionId: string,
    _userId: string,
  ) {
    if (!this.roundOwnedByUser) {
      return false;
    }
    return this.questions.delete(questionId);
  }

  async listHistoryForUser(_options: ListQuestionHistoryOptions) {
    return { items: [], nextCursor: null };
  }
}

describe("CreateQuestionUseCase", () => {
  it("throws NotFoundError when the round is not owned by the user", async () => {
    const repository = new FakeQuestionsRepository();
    repository.roundOwnedByUser = false;
    const useCase = new CreateQuestionUseCase(repository);

    await expect(
      useCase.execute({
        applicationId: APPLICATION_ID,
        roundId: ROUND_ID,
        userId: USER_ID,
        question: "What is a closure?",
      }),
    ).rejects.toThrow(NotFoundError);
  });
});

describe("UpdateQuestionUseCase", () => {
  it("throws NotFoundError when the round is not owned by the user", async () => {
    const repository = new FakeQuestionsRepository();
    repository.roundOwnedByUser = false;
    const useCase = new UpdateQuestionUseCase(repository);

    await expect(
      useCase.execute({
        applicationId: APPLICATION_ID,
        roundId: ROUND_ID,
        questionId: QUESTION_ID,
        userId: USER_ID,
        question: "Updated?",
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it("updates an owned question", async () => {
    const repository = new FakeQuestionsRepository();
    repository.questions.set(QUESTION_ID, toResponse());
    const useCase = new UpdateQuestionUseCase(repository);

    const result = await useCase.execute({
      applicationId: APPLICATION_ID,
      roundId: ROUND_ID,
      questionId: QUESTION_ID,
      userId: USER_ID,
      question: "Updated?",
    });

    expect(result.question).toBe("Updated?");
  });
});

describe("DeleteQuestionUseCase", () => {
  it("throws NotFoundError when the round is not owned by the user", async () => {
    const repository = new FakeQuestionsRepository();
    repository.roundOwnedByUser = false;
    const useCase = new DeleteQuestionUseCase(repository);

    await expect(
      useCase.execute({
        applicationId: APPLICATION_ID,
        roundId: ROUND_ID,
        questionId: QUESTION_ID,
        userId: USER_ID,
      }),
    ).rejects.toThrow(NotFoundError);
  });
});
