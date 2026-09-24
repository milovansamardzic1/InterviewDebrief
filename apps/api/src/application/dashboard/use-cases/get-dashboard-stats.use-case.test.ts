import { describe, expect, it } from "vitest";

import type {
  DashboardRepository,
  DashboardStatsRecord,
} from "../ports/dashboard.repository.js";
import { GetDashboardStatsUseCase } from "./get-dashboard-stats.use-case.js";

const EMPTY_STATS: DashboardStatsRecord = {
  jobApplications: 0,
  interviewRounds: 0,
  questions: 0,
  skillEvaluations: 0,
  skills: 0,
  weakSkills: [],
  questionsByTopic: [],
  statusBreakdown: [],
  progressOverTime: [],
  activeApplications: [],
  upcomingRound: null,
};

class FakeDashboardRepository implements DashboardRepository {
  constructor(private readonly stats: DashboardStatsRecord) {}

  async getStats() {
    return this.stats;
  }
}

describe("GetDashboardStatsUseCase", () => {
  it("maps repository records including active applications and upcoming round", async () => {
    const scheduledAt = new Date("2026-08-01T10:00:00.000Z");
    const useCase = new GetDashboardStatsUseCase(
      new FakeDashboardRepository({
        ...EMPTY_STATS,
        jobApplications: 3,
        interviewRounds: 5,
        questions: 12,
        skillEvaluations: 8,
        skills: 20,
        statusBreakdown: [{ status: "INTERVIEWING", count: 2 }],
        activeApplications: [
          {
            id: "app-1",
            company: "Acme",
            position: "Senior Engineer",
            applicationStatus: "INTERVIEWING",
          },
        ],
        upcomingRound: {
          id: "round-1",
          roundType: "System Design",
          scheduledAt,
          company: "Acme",
          position: "Senior Engineer",
          applicationId: "app-1",
        },
      }),
    );

    const result = await useCase.execute("user-1");

    expect(result.jobApplications).toBe(3);
    expect(result.activeApplications).toEqual([
      {
        id: "app-1",
        company: "Acme",
        position: "Senior Engineer",
        applicationStatus: "INTERVIEWING",
      },
    ]);
    expect(result.upcomingRound).toEqual({
      id: "round-1",
      roundType: "System Design",
      scheduledAt: "2026-08-01T10:00:00.000Z",
      company: "Acme",
      position: "Senior Engineer",
      applicationId: "app-1",
    });
  });

  it("returns null upcomingRound when repository has none", async () => {
    const useCase = new GetDashboardStatsUseCase(
      new FakeDashboardRepository(EMPTY_STATS),
    );

    const result = await useCase.execute("user-1");

    expect(result.activeApplications).toEqual([]);
    expect(result.upcomingRound).toBeNull();
  });
});
