import type {
  LearningPlanItem,
  LearningPlanResponse,
} from "@interwjuer/contracts";

import type { LearningPlanRepository } from "../ports/learning-plan.repository.js";
import type { LearningPlanItemRecord } from "../read-models/learning-plan.record.js";

export function buildFocusHint(averageScore: number): string {
  if (averageScore < 2) {
    return "Prioritet: temeljna vežba";
  }

  return "Ojačaj kroz ponavljanje";
}

function toLearningPlanItem(record: LearningPlanItemRecord): LearningPlanItem {
  return {
    skillId: record.skillId,
    skillName: record.skillName,
    skillCategory: record.skillCategory,
    averageScore: record.averageScore,
    evaluationCount: record.evaluationCount,
    lastEvaluatedAt: record.lastEvaluatedAt.toISOString(),
    focusHint: buildFocusHint(record.averageScore),
    relatedQuestions: record.relatedQuestions.map((question) => ({
      id: question.id,
      questionText: question.questionText,
      topic: question.topic,
      applicationId: question.applicationId,
      roundId: question.roundId,
      company: question.company,
    })),
  };
}

export class GetLearningPlanUseCase {
  constructor(private readonly repository: LearningPlanRepository) {}

  async execute(userId: string): Promise<LearningPlanResponse> {
    const items = await this.repository.getPlanForUser(userId);

    return {
      items: items.map(toLearningPlanItem),
      generatedAt: new Date().toISOString(),
    };
  }
}
