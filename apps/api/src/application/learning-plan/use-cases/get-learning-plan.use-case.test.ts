import { describe, expect, it } from "vitest";

import type { LearningPlanRepository } from "../ports/learning-plan.repository.js";
import type { LearningPlanItemRecord } from "../read-models/learning-plan.record.js";
import {
  buildFocusHint,
  GetLearningPlanUseCase,
} from "./get-learning-plan.use-case.js";

const WEAK_SYSTEM_DESIGN: LearningPlanItemRecord = {
  skillId: "skill-1",
  skillName: "System Design",
  skillCategory: "Architecture",
  averageScore: 1.5,
  evaluationCount: 4,
  lastEvaluatedAt: new Date("2024-06-01T12:00:00.000Z"),
  relatedQuestions: [
    {
      id: "q-1",
      questionText: "Design a URL shortener",
      topic: "System Design",
      applicationId: "app-1",
      roundId: "round-1",
      company: "Acme",
    },
  ],
};

const WEAK_ALGORITHMS: LearningPlanItemRecord = {
  skillId: "skill-2",
  skillName: "Algorithms",
  skillCategory: null,
  averageScore: 2.4,
  evaluationCount: 2,
  lastEvaluatedAt: new Date("2024-05-15T08:00:00.000Z"),
  relatedQuestions: [],
};

class FakeLearningPlanRepository implements LearningPlanRepository {
  constructor(private readonly items: LearningPlanItemRecord[]) {}

  async getPlanForUser(_userId: string) {
    return this.items;
  }
}

describe("buildFocusHint", () => {
  it("returns foundational practice hint for scores below 2", () => {
    expect(buildFocusHint(1.5)).toBe("Prioritet: temeljna vežba");
  });

  it("returns reinforcement hint for scores from 2 up to the weak threshold", () => {
    expect(buildFocusHint(2)).toBe("Ojačaj kroz ponavljanje");
    expect(buildFocusHint(2.9)).toBe("Ojačaj kroz ponavljanje");
  });
});

describe("GetLearningPlanUseCase", () => {
  it("maps repository records to contract items with focus hints", async () => {
    const useCase = new GetLearningPlanUseCase(
      new FakeLearningPlanRepository([WEAK_SYSTEM_DESIGN, WEAK_ALGORITHMS]),
    );

    const result = await useCase.execute("user-1");

    expect(result.items).toHaveLength(2);
    expect(result.items[0]).toMatchObject({
      skillId: "skill-1",
      skillName: "System Design",
      averageScore: 1.5,
      lastEvaluatedAt: "2024-06-01T12:00:00.000Z",
      focusHint: "Prioritet: temeljna vežba",
      relatedQuestions: [
        {
          id: "q-1",
          questionText: "Design a URL shortener",
          company: "Acme",
        },
      ],
    });
    expect(result.items[1]).toMatchObject({
      skillId: "skill-2",
      focusHint: "Ojačaj kroz ponavljanje",
      relatedQuestions: [],
    });
    expect(result.generatedAt).toEqual(expect.any(String));
  });

  it("returns an empty plan when there are no weak skills", async () => {
    const useCase = new GetLearningPlanUseCase(
      new FakeLearningPlanRepository([]),
    );

    const result = await useCase.execute("user-1");

    expect(result.items).toEqual([]);
    expect(result.generatedAt).toEqual(expect.any(String));
  });

  it("preserves related questions passthrough from the repository", async () => {
    const useCase = new GetLearningPlanUseCase(
      new FakeLearningPlanRepository([WEAK_SYSTEM_DESIGN]),
    );

    const result = await useCase.execute("user-1");

    expect(result.items[0]?.relatedQuestions).toEqual([
      {
        id: "q-1",
        questionText: "Design a URL shortener",
        topic: "System Design",
        applicationId: "app-1",
        roundId: "round-1",
        company: "Acme",
      },
    ]);
  });
});
