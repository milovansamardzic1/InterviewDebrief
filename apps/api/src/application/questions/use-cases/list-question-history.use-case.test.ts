import { describe, expect, it } from "vitest";

import type {
  ListQuestionHistoryOptions,
  QuestionsRepository,
} from "../ports/questions.repository.js";
import type { QuestionHistoryRecord } from "../read-models/question-history.record.js";
import { ListQuestionHistoryUseCase } from "./list-question-history.use-case.js";

const RECORD: QuestionHistoryRecord = {
  id: "question-1",
  question: "What is a closure?",
  myAnswer: "A function bound to its lexical scope.",
  topic: "JavaScript",
  difficulty: 3,
  notes: null,
  applicationId: "application-1",
  company: "Acme",
  position: "Engineer",
  roundId: "round-1",
  interviewTypeName: "Technical",
};

class FakeQuestionsRepository implements QuestionsRepository {
  lastHistoryOptions: ListQuestionHistoryOptions | null = null;

  constructor(
    private readonly page: {
      items: QuestionHistoryRecord[];
      nextCursor: string | null;
    },
  ) {}

  async create() {
    return null;
  }

  async update() {
    return null;
  }

  async delete() {
    return false;
  }

  async listHistoryForUser(options: ListQuestionHistoryOptions) {
    this.lastHistoryOptions = options;
    return this.page;
  }
}

describe("ListQuestionHistoryUseCase", () => {
  it("maps repository records to contract items", async () => {
    const useCase = new ListQuestionHistoryUseCase(
      new FakeQuestionsRepository({
        items: [RECORD],
        nextCursor: "cursor-abc",
      }),
    );

    const result = await useCase.execute({ userId: "user-1" });

    expect(result.nextCursor).toBe("cursor-abc");
    expect(result.items).toEqual([
      {
        id: RECORD.id,
        question: RECORD.question,
        myAnswer: RECORD.myAnswer,
        topic: RECORD.topic,
        difficulty: RECORD.difficulty,
        notes: RECORD.notes,
        applicationId: RECORD.applicationId,
        company: RECORD.company,
        position: RECORD.position,
        roundId: RECORD.roundId,
        interviewTypeName: RECORD.interviewTypeName,
      },
    ]);
  });

  it("returns an empty list and null cursor when there is no history", async () => {
    const useCase = new ListQuestionHistoryUseCase(
      new FakeQuestionsRepository({ items: [], nextCursor: null }),
    );

    const result = await useCase.execute({ userId: "user-1" });

    expect(result).toEqual({ items: [], nextCursor: null });
  });

  it("passes history filters to the repository", async () => {
    const repository = new FakeQuestionsRepository({
      items: [],
      nextCursor: null,
    });
    const useCase = new ListQuestionHistoryUseCase(repository);

    await useCase.execute({
      userId: "user-1",
      limit: 25,
      cursor: "question-cursor",
      topic: "JavaScript",
      search: "closure",
      company: "Acme",
      difficulty: 3,
      answeredOnly: true,
    });

    expect(repository.lastHistoryOptions).toEqual({
      userId: "user-1",
      limit: 25,
      cursor: "question-cursor",
      topic: "JavaScript",
      search: "closure",
      company: "Acme",
      difficulty: 3,
      answeredOnly: true,
    });
  });
});
