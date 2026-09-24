import type { PrismaClient } from "@prisma/client";

import type { RejectionInsightsRepository } from "../../../application/rejection-insights/ports/rejection-insights.repository.js";
import type { Logger } from "../../logging/logger.js";
import { runPrismaOperation } from "./prisma-error.js";

const RECENT_REJECTIONS_LIMIT = 5;

export class PrismaRejectionInsightsRepository implements RejectionInsightsRepository {
  constructor(
    private readonly db: PrismaClient,
    private readonly logger: Logger,
  ) {}

  async getInsightsForUser(userId: string) {
    const rejectedWhere = {
      userId,
      applicationStatus: "REJECTED" as const,
    };

    const [rejectedCount, categorizedCount, categoryGroups, recentRows] =
      await runPrismaOperation(
        "rejectionInsights.getForUser",
        this.logger,
        () =>
          Promise.all([
            this.db.jobApplication.count({ where: rejectedWhere }),
            this.db.jobApplication.count({
              where: {
                ...rejectedWhere,
                rejectionCategory: { not: null },
              },
            }),
            this.db.jobApplication.groupBy({
              by: ["rejectionCategory"],
              where: rejectedWhere,
              _count: { _all: true },
              orderBy: { _count: { rejectionCategory: "desc" } },
            }),
            this.db.jobApplication.findMany({
              where: rejectedWhere,
              orderBy: [{ applicationDate: "desc" }, { id: "desc" }],
              take: RECENT_REJECTIONS_LIMIT,
              select: {
                id: true,
                company: true,
                position: true,
                rejectionCategory: true,
                rejectionReason: true,
                applicationDate: true,
              },
            }),
          ]),
      );

    return {
      rejectedCount,
      categorizedCount,
      categoryBreakdown: categoryGroups.map((group) => ({
        category: group.rejectionCategory,
        count: group._count._all,
      })),
      recentRejections: recentRows.map((row) => ({
        applicationId: row.id,
        company: row.company,
        position: row.position,
        category: row.rejectionCategory,
        reason: row.rejectionReason,
        applicationDate: row.applicationDate,
      })),
    };
  }
}
