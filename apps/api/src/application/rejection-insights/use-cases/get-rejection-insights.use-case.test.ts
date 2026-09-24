import { describe, expect, it } from "vitest";

import type { RejectionInsightsRepository } from "../ports/rejection-insights.repository.js";
import { GetRejectionInsightsUseCase } from "./get-rejection-insights.use-case.js";

class FakeRejectionInsightsRepository implements RejectionInsightsRepository {
  lastUserId: string | null = null;

  async getInsightsForUser(userId: string) {
    this.lastUserId = userId;
    return {
      rejectedCount: 2,
      categorizedCount: 1,
      categoryBreakdown: [
        { category: "SYSTEM_DESIGN" as const, count: 1 },
        { category: null, count: 1 },
      ],
      recentRejections: [
        {
          applicationId: "app-1",
          company: "Acme",
          position: "Backend Engineer",
          category: "SYSTEM_DESIGN" as const,
          reason: "Trade-offs were not clear.",
          applicationDate: new Date("2026-08-01T00:00:00.000Z"),
        },
      ],
    };
  }
}

describe("GetRejectionInsightsUseCase", () => {
  it("maps repository data and scopes the request to the user", async () => {
    const repository = new FakeRejectionInsightsRepository();
    const useCase = new GetRejectionInsightsUseCase(repository);

    const result = await useCase.execute("user-1");

    expect(repository.lastUserId).toBe("user-1");
    expect(result).toMatchObject({
      rejectedCount: 2,
      categorizedCount: 1,
      categoryBreakdown: [
        { category: "SYSTEM_DESIGN", count: 1 },
        { category: null, count: 1 },
      ],
      recentRejections: [
        {
          applicationId: "app-1",
          applicationDate: "2026-08-01T00:00:00.000Z",
        },
      ],
    });
    expect(result.generatedAt).toEqual(expect.any(String));
  });
});
