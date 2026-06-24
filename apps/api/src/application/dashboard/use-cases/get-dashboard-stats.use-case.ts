import type { DashboardStats } from "@interwjuer/contracts";

import type { DashboardRepository } from "../ports/dashboard.repository.js";

export class GetDashboardStatsUseCase {
  constructor(private readonly repository: DashboardRepository) {}

  async execute(userId: string): Promise<DashboardStats> {
    const stats = await this.repository.getStats({ userId });

    return {
      jobApplications: stats.jobApplications,
      interviewRounds: stats.interviewRounds,
      questions: stats.questions,
      skillEvaluations: stats.skillEvaluations,
      skills: stats.skills,
      weakSkills: stats.weakSkills,
      questionsByTopic: stats.questionsByTopic,
      statusBreakdown: stats.statusBreakdown,
      progressOverTime: stats.progressOverTime,
    };
  }
}
