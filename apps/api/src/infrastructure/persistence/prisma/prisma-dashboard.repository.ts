import type { PrismaClient } from "@prisma/client";

import type {
  DashboardRepository,
  GetDashboardStatsOptions,
} from "../../../application/dashboard/ports/dashboard.repository.js";
import type { Logger } from "../../logging/logger.js";
import { runPrismaOperation } from "./prisma-error.js";

const WEAK_SKILL_THRESHOLD = 3;
const WEAK_SKILL_LIMIT = 10;

export class PrismaDashboardRepository implements DashboardRepository {
  constructor(
    private readonly db: PrismaClient,
    private readonly logger: Logger,
  ) {}

  async getStats(options: GetDashboardStatsOptions) {
    const applicationWhere = { userId: options.userId };
    const roundWhere = { jobApplication: applicationWhere };
    const questionWhere = { interviewRound: { jobApplication: applicationWhere } };
    const evaluationWhere = {
      interviewRound: { jobApplication: applicationWhere },
    };

    const [
      jobApplications,
      interviewRounds,
      questions,
      skillEvaluations,
      skills,
      statusGroups,
      topicGroups,
      skillScoreGroups,
      completedRounds,
      completedRoundSkillScores,
    ] = await runPrismaOperation("dashboard.getStats", this.logger, () =>
      Promise.all([
        this.db.jobApplication.count({ where: applicationWhere }),
        this.db.interviewRound.count({ where: roundWhere }),
        this.db.question.count({ where: questionWhere }),
        this.db.skillEvaluation.count({ where: evaluationWhere }),
        this.db.skill.count(),
        this.db.jobApplication.groupBy({
          by: ["applicationStatus"],
          where: applicationWhere,
          _count: { _all: true },
        }),
        this.db.question.groupBy({
          by: ["topic"],
          where: {
            ...questionWhere,
            topic: { not: null },
          },
          _count: { _all: true },
        }),
        this.db.skillEvaluation.groupBy({
          by: ["skillId"],
          where: evaluationWhere,
          _avg: { score: true },
          _count: { _all: true },
        }),
        this.db.interviewRound.findMany({
          where: {
            ...roundWhere,
            status: "COMPLETED",
            completedAt: { not: null },
          },
          select: { completedAt: true },
        }),
        this.db.skillEvaluation.findMany({
          where: {
            ...evaluationWhere,
            interviewRound: {
              jobApplication: applicationWhere,
              status: "COMPLETED",
              completedAt: { not: null },
            },
          },
          select: {
            score: true,
            interviewRound: { select: { completedAt: true } },
          },
        }),
      ]),
    );

    const skillIds = skillScoreGroups.map((group) => group.skillId);
    const skillRecords =
      skillIds.length > 0
        ? await runPrismaOperation("dashboard.getSkillNames", this.logger, () =>
            this.db.skill.findMany({
              where: { id: { in: skillIds } },
              select: { id: true, name: true, category: true },
            }),
          )
        : [];

    const skillById = new Map(skillRecords.map((skill) => [skill.id, skill]));

    const weakSkills = skillScoreGroups
      .map((group) => {
        const skill = skillById.get(group.skillId);

        if (!skill || group._avg.score === null) {
          return null;
        }

        return {
          skillId: group.skillId,
          skillName: skill.name,
          skillCategory: skill.category,
          averageScore: Math.round(group._avg.score * 10) / 10,
          evaluationCount: group._count._all,
        };
      })
      .filter(
        (item): item is NonNullable<typeof item> =>
          item !== null && item.averageScore < WEAK_SKILL_THRESHOLD,
      )
      .sort((a, b) => a.averageScore - b.averageScore)
      .slice(0, WEAK_SKILL_LIMIT);

    const questionsByTopic = topicGroups
      .filter((group) => group.topic !== null)
      .map((group) => ({
        topic: group.topic as string,
        count: group._count._all,
      }))
      .sort((a, b) => b.count - a.count);

    const statusBreakdown = statusGroups.map((group) => ({
      status: group.applicationStatus,
      count: group._count._all,
    }));

    const progressMap = new Map<
      string,
      { completedRounds: number; totalScore: number; scoreCount: number }
    >();

    function getMonthEntry(month: string) {
      const existing = progressMap.get(month);

      if (existing) {
        return existing;
      }

      const created = { completedRounds: 0, totalScore: 0, scoreCount: 0 };
      progressMap.set(month, created);
      return created;
    }

    for (const round of completedRounds) {
      if (!round.completedAt) {
        continue;
      }

      const month = round.completedAt.toISOString().slice(0, 7);
      getMonthEntry(month).completedRounds += 1;
    }

    for (const evaluation of completedRoundSkillScores) {
      const completedAt = evaluation.interviewRound.completedAt;

      if (!completedAt) {
        continue;
      }

      const month = completedAt.toISOString().slice(0, 7);
      const entry = getMonthEntry(month);
      entry.totalScore += evaluation.score;
      entry.scoreCount += 1;
    }

    const progressOverTime = [...progressMap.entries()]
      .map(([month, entry]) => ({
        month,
        completedRounds: entry.completedRounds,
        averageSkillScore:
          entry.scoreCount > 0
            ? Math.round((entry.totalScore / entry.scoreCount) * 10) / 10
            : null,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    return {
      jobApplications,
      interviewRounds,
      questions,
      skillEvaluations,
      skills,
      weakSkills,
      questionsByTopic,
      statusBreakdown,
      progressOverTime,
    };
  }
}
