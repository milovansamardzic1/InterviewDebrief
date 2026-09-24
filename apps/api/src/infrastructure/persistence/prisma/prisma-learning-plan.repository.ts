import type { PrismaClient } from "@prisma/client";

import type { LearningPlanRepository } from "../../../application/learning-plan/ports/learning-plan.repository.js";
import type { LearningPlanItemRecord } from "../../../application/learning-plan/read-models/learning-plan.record.js";
import {
  LEARNING_PLAN_RELATED_QUESTIONS_LIMIT,
  WEAK_SKILL_LEARNING_PLAN_LIMIT,
  WEAK_SKILL_THRESHOLD,
} from "../../../application/shared/weak-skill-rules.js";
import type { Logger } from "../../logging/logger.js";
import { runPrismaOperation } from "./prisma-error.js";

export class PrismaLearningPlanRepository implements LearningPlanRepository {
  constructor(
    private readonly db: PrismaClient,
    private readonly logger: Logger,
  ) {}

  async getPlanForUser(userId: string): Promise<LearningPlanItemRecord[]> {
    const evaluationWhere = {
      interviewRound: { jobApplication: { userId } },
    };

    const skillScoreGroups = await runPrismaOperation(
      "learningPlan.skillScoreGroups",
      this.logger,
      () =>
        this.db.skillEvaluation.groupBy({
          by: ["skillId"],
          where: evaluationWhere,
          _avg: { score: true },
          _count: { _all: true },
          _max: { createdAt: true },
        }),
    );

    if (skillScoreGroups.length === 0) {
      return [];
    }

    const skillIds = skillScoreGroups.map((group) => group.skillId);
    const skillRecords = await runPrismaOperation(
      "learningPlan.getSkillNames",
      this.logger,
      () =>
        this.db.skill.findMany({
          where: { id: { in: skillIds } },
          select: { id: true, name: true, category: true },
        }),
    );

    const skillById = new Map(skillRecords.map((skill) => [skill.id, skill]));

    const weakSkills = skillScoreGroups
      .map((group) => {
        const skill = skillById.get(group.skillId);

        if (
          !skill ||
          group._avg.score === null ||
          group._max.createdAt === null
        ) {
          return null;
        }

        return {
          skillId: group.skillId,
          skillName: skill.name,
          skillCategory: skill.category,
          averageScore: Math.round(group._avg.score * 10) / 10,
          evaluationCount: group._count._all,
          lastEvaluatedAt: group._max.createdAt,
        };
      })
      .filter(
        (
          item,
        ): item is {
          skillId: string;
          skillName: string;
          skillCategory: string | null;
          averageScore: number;
          evaluationCount: number;
          lastEvaluatedAt: Date;
        } => item !== null && item.averageScore < WEAK_SKILL_THRESHOLD,
      )
      .sort((a, b) => a.averageScore - b.averageScore)
      .slice(0, WEAK_SKILL_LEARNING_PLAN_LIMIT);

    if (weakSkills.length === 0) {
      return [];
    }

    const skillNames = weakSkills.map((skill) => skill.skillName);
    const relatedQuestions = await runPrismaOperation(
      "learningPlan.relatedQuestions",
      this.logger,
      () =>
        this.db.question.findMany({
          where: {
            interviewRound: { jobApplication: { userId } },
            OR: skillNames.map((name) => ({
              topic: { contains: name, mode: "insensitive" as const },
            })),
          },
          orderBy: { createdAt: "desc" },
          take: skillNames.length * LEARNING_PLAN_RELATED_QUESTIONS_LIMIT * 3,
          select: {
            id: true,
            question: true,
            topic: true,
            interviewRound: {
              select: {
                id: true,
                jobApplication: {
                  select: {
                    id: true,
                    company: true,
                  },
                },
              },
            },
          },
        }),
    );

    return weakSkills.map((skill) => {
      const nameLower = skill.skillName.toLowerCase();
      const matched = relatedQuestions
        .filter((question) => question.topic?.toLowerCase().includes(nameLower))
        .slice(0, LEARNING_PLAN_RELATED_QUESTIONS_LIMIT)
        .map((question) => ({
          id: question.id,
          questionText: question.question,
          topic: question.topic,
          applicationId: question.interviewRound.jobApplication.id,
          roundId: question.interviewRound.id,
          company: question.interviewRound.jobApplication.company,
        }));

      return {
        ...skill,
        relatedQuestions: matched,
      };
    });
  }
}
