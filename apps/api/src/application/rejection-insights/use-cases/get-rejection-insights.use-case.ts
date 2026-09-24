import type { RejectionInsightsResponse } from "@interwjuer/contracts";

import type { RejectionInsightsRepository } from "../ports/rejection-insights.repository.js";

export class GetRejectionInsightsUseCase {
  constructor(private readonly repository: RejectionInsightsRepository) {}

  async execute(userId: string): Promise<RejectionInsightsResponse> {
    const insights = await this.repository.getInsightsForUser(userId);

    return {
      rejectedCount: insights.rejectedCount,
      categorizedCount: insights.categorizedCount,
      categoryBreakdown: insights.categoryBreakdown,
      recentRejections: insights.recentRejections.map((item) => ({
        ...item,
        applicationDate: item.applicationDate.toISOString(),
      })),
      generatedAt: new Date().toISOString(),
    };
  }
}
