import { Prisma } from "@prisma/client";

import type { InterviewRoundResponse } from "@interwjuer/contracts";

export const roundDetailArgs = Prisma.validator<Prisma.InterviewRoundDefaultArgs>()(
  {
    include: {
      interviewType: true,
      questions: {
        orderBy: { createdAt: "asc" },
      },
      skillEvaluations: {
        orderBy: { createdAt: "asc" },
        include: { skill: true },
      },
    },
  },
);

export type InterviewRoundDetailRow = Prisma.InterviewRoundGetPayload<
  typeof roundDetailArgs
>;

export function toInterviewRoundResponse(
  round: InterviewRoundDetailRow,
): InterviewRoundResponse {
  return {
    id: round.id,
    sortOrder: round.sortOrder,
    status: round.status,
    scheduledAt: round.scheduledAt,
    completedAt: round.completedAt,
    notes: round.notes,
    interviewTypeName: round.interviewType.name,
    interviewTypeDescription: round.interviewType.description,
    questions: round.questions.map((question) => ({
      id: question.id,
      question: question.question,
      myAnswer: question.myAnswer,
      topic: question.topic,
      difficulty: question.difficulty,
      notes: question.notes,
    })),
    skillEvaluations: round.skillEvaluations.map((evaluation) => ({
      id: evaluation.id,
      skillName: evaluation.skill.name,
      skillCategory: evaluation.skill.category,
      score: evaluation.score,
      notes: evaluation.notes,
    })),
  };
}
