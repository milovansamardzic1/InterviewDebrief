import type {
  ApplicationStatus,
  DashboardStats,
} from "@interwjuer/contracts";

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
      activeApplications: stats.activeApplications.map((application) => ({
        id: application.id,
        company: application.company,
        position: application.position,
        applicationStatus: application.applicationStatus as ApplicationStatus,
      })),
      upcomingRound: stats.upcomingRound
        ? {
            id: stats.upcomingRound.id,
            roundType: stats.upcomingRound.roundType,
            scheduledAt: stats.upcomingRound.scheduledAt.toISOString(),
            company: stats.upcomingRound.company,
            position: stats.upcomingRound.position,
            applicationId: stats.upcomingRound.applicationId,
          }
        : null,
    };
  }
}
