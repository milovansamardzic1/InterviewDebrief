import { Prisma } from "@prisma/client";

import type { ApplicationDetailRecord } from "../../../../application/job-applications/read-models/application-detail.record.js";
import type { ApplicationListRecord } from "../../../../application/job-applications/read-models/application-list.record.js";

export const listArgs = Prisma.validator<Prisma.JobApplicationDefaultArgs>()({
  include: {
    applicationSource: true,
    interviewRounds: {
      orderBy: { sortOrder: "asc" },
      include: {
        interviewType: true,
        _count: { select: { questions: true } },
      },
    },
  },
});

export const detailArgs = Prisma.validator<Prisma.JobApplicationDefaultArgs>()({
  include: {
    applicationSource: true,
    interviewRounds: {
      orderBy: { sortOrder: "asc" },
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
  },
});

export type JobApplicationListRow = Prisma.JobApplicationGetPayload<
  typeof listArgs
>;

export type JobApplicationDetailRow = Prisma.JobApplicationGetPayload<
  typeof detailArgs
>;

type DetailQuestionRow =
  JobApplicationDetailRow["interviewRounds"][number]["questions"][number];

type DetailSkillEvaluationRow =
  JobApplicationDetailRow["interviewRounds"][number]["skillEvaluations"][number];

type DetailRoundRow = JobApplicationDetailRow["interviewRounds"][number];

function toQuestionRecord(question: DetailQuestionRow) {
  return {
    id: question.id,
    question: question.question,
    myAnswer: question.myAnswer,
    topic: question.topic,
    difficulty: question.difficulty,
    notes: question.notes,
  };
}

function toSkillEvaluationRecord(evaluation: DetailSkillEvaluationRow) {
  return {
    id: evaluation.id,
    skillName: evaluation.skill.name,
    skillCategory: evaluation.skill.category,
    score: evaluation.score,
    notes: evaluation.notes,
  };
}

function toRoundRecord(round: DetailRoundRow) {
  return {
    id: round.id,
    sortOrder: round.sortOrder,
    status: round.status,
    scheduledAt: round.scheduledAt,
    completedAt: round.completedAt,
    notes: round.notes,
    interviewTypeName: round.interviewType.name,
    interviewTypeDescription: round.interviewType.description,
    questions: round.questions.map(toQuestionRecord),
    skillEvaluations: round.skillEvaluations.map(toSkillEvaluationRecord),
  };
}

export function toApplicationListRecord(
  application: JobApplicationListRow,
): ApplicationListRecord {
  return {
    id: application.id,
    company: application.company,
    position: application.position,
    location: application.location,
    applicationStatus: application.applicationStatus,
    applicationDate: application.applicationDate,
    salaryMin: application.salaryMin,
    salaryMax: application.salaryMax,
    sourceName: application.applicationSource.name,
    rounds: application.interviewRounds.map((round) => ({
      id: round.id,
      sortOrder: round.sortOrder,
      status: round.status,
      scheduledAt: round.scheduledAt,
      interviewTypeName: round.interviewType.name,
      questionCount: round._count.questions,
    })),
  };
}

export function toApplicationDetailRecord(
  application: JobApplicationDetailRow,
): ApplicationDetailRecord {
  return {
    id: application.id,
    company: application.company,
    position: application.position,
    location: application.location,
    applicationStatus: application.applicationStatus,
    applicationDate: application.applicationDate,
    salaryMin: application.salaryMin,
    salaryMax: application.salaryMax,
    jobPostingUrl: application.jobPostingUrl,
    jobDescription: application.jobDescription,
    rejectionCategory: application.rejectionCategory,
    rejectionReason: application.rejectionReason,
    notes: application.notes,
    sourceName: application.applicationSource.name,
    rounds: application.interviewRounds.map(toRoundRecord),
  };
}
