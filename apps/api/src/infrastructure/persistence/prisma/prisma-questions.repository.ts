import type { PrismaClient } from "@prisma/client";

import type {
  CreateQuestionData,
  ListQuestionHistoryOptions,
  QuestionHistoryPage,
  QuestionsRepository,
  UpdateQuestionData,
} from "../../../application/questions/ports/questions.repository.js";
import type { QuestionHistoryRecord } from "../../../application/questions/read-models/question-history.record.js";
import type { Logger } from "../../logging/logger.js";
import { runPrismaOperation } from "./prisma-error.js";

const DEFAULT_HISTORY_LIMIT = 50;
const MAX_HISTORY_LIMIT = 100;

function toQuestionResponse(question: {
  id: string;
  question: string;
  myAnswer: string | null;
  topic: string | null;
  difficulty: number | null;
  notes: string | null;
}) {
  return {
    id: question.id,
    question: question.question,
    myAnswer: question.myAnswer,
    topic: question.topic,
    difficulty: question.difficulty,
    notes: question.notes,
  };
}

export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(
    private readonly db: PrismaClient,
    private readonly logger: Logger,
  ) {}

  private async roundOwnedByUser(
    applicationId: string,
    roundId: string,
    userId: string,
  ): Promise<boolean> {
    const count = await runPrismaOperation(
      "question.roundOwnedByUser",
      this.logger,
      () =>
        this.db.interviewRound.count({
          where: {
            id: roundId,
            jobApplicationId: applicationId,
            jobApplication: { userId },
          },
        }),
    );

    return count > 0;
  }

  async create(data: CreateQuestionData) {
    const owned = await this.roundOwnedByUser(
      data.applicationId,
      data.roundId,
      data.userId,
    );

    if (!owned) {
      return null;
    }

    const question = await runPrismaOperation(
      "question.create",
      this.logger,
      () =>
        this.db.question.create({
          data: {
            interviewRoundId: data.roundId,
            question: data.question,
            myAnswer: data.myAnswer ?? null,
            topic: data.topic ?? null,
            difficulty: data.difficulty ?? null,
            notes: data.notes ?? null,
          },
        }),
    );

    return toQuestionResponse(question);
  }

  async update(
    applicationId: string,
    roundId: string,
    questionId: string,
    userId: string,
    data: UpdateQuestionData,
  ) {
    const owned = await this.roundOwnedByUser(applicationId, roundId, userId);

    if (!owned) {
      return null;
    }

    const existing = await runPrismaOperation(
      "question.findForUpdate",
      this.logger,
      () =>
        this.db.question.findFirst({
          where: {
            id: questionId,
            interviewRoundId: roundId,
          },
        }),
    );

    if (!existing) {
      return null;
    }

    const question = await runPrismaOperation(
      "question.update",
      this.logger,
      () =>
        this.db.question.update({
          where: { id: questionId },
          data: {
            ...(data.question !== undefined ? { question: data.question } : {}),
            ...(data.myAnswer !== undefined ? { myAnswer: data.myAnswer } : {}),
            ...(data.topic !== undefined ? { topic: data.topic } : {}),
            ...(data.difficulty !== undefined
              ? { difficulty: data.difficulty }
              : {}),
            ...(data.notes !== undefined ? { notes: data.notes } : {}),
          },
        }),
    );

    return toQuestionResponse(question);
  }

  async delete(
    applicationId: string,
    roundId: string,
    questionId: string,
    userId: string,
  ) {
    const owned = await this.roundOwnedByUser(applicationId, roundId, userId);

    if (!owned) {
      return false;
    }

    const existing = await runPrismaOperation(
      "question.findForDelete",
      this.logger,
      () =>
        this.db.question.findFirst({
          where: {
            id: questionId,
            interviewRoundId: roundId,
          },
        }),
    );

    if (!existing) {
      return false;
    }

    await runPrismaOperation("question.delete", this.logger, () =>
      this.db.question.delete({ where: { id: questionId } }),
    );

    return true;
  }

  async listHistoryForUser(
    options: ListQuestionHistoryOptions,
  ): Promise<QuestionHistoryPage> {
    const take =
      Math.min(options.limit ?? DEFAULT_HISTORY_LIMIT, MAX_HISTORY_LIMIT) + 1;

    const questions = await runPrismaOperation(
      "question.listHistoryForUser",
      this.logger,
      () =>
        this.db.question.findMany({
          where: {
            interviewRound: {
              jobApplication: {
                userId: options.userId,
                ...(options.company
                  ? {
                      company: {
                        contains: options.company,
                        mode: "insensitive",
                      },
                    }
                  : {}),
              },
            },
            ...(options.topic ? { topic: options.topic } : {}),
            ...(options.difficulty !== undefined
              ? { difficulty: options.difficulty }
              : {}),
            ...(options.answeredOnly ? { myAnswer: { not: null } } : {}),
            ...(options.search
              ? {
                  OR: [
                    {
                      question: {
                        contains: options.search,
                        mode: "insensitive",
                      },
                    },
                    {
                      myAnswer: {
                        contains: options.search,
                        mode: "insensitive",
                      },
                    },
                    {
                      notes: {
                        contains: options.search,
                        mode: "insensitive",
                      },
                    },
                    {
                      topic: {
                        contains: options.search,
                        mode: "insensitive",
                      },
                    },
                  ],
                }
              : {}),
          },
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          take,
          ...(options.cursor
            ? { cursor: { id: options.cursor }, skip: 1 }
            : {}),
          select: {
            id: true,
            question: true,
            myAnswer: true,
            topic: true,
            difficulty: true,
            notes: true,
            interviewRound: {
              select: {
                id: true,
                jobApplication: {
                  select: { id: true, company: true, position: true },
                },
                interviewType: { select: { name: true } },
              },
            },
          },
        }),
    );

    const hasMore = questions.length > take - 1;
    const page = hasMore ? questions.slice(0, take - 1) : questions;

    const items: QuestionHistoryRecord[] = page.map((question) => ({
      id: question.id,
      question: question.question,
      myAnswer: question.myAnswer,
      topic: question.topic,
      difficulty: question.difficulty,
      notes: question.notes,
      applicationId: question.interviewRound.jobApplication.id,
      company: question.interviewRound.jobApplication.company,
      position: question.interviewRound.jobApplication.position,
      roundId: question.interviewRound.id,
      interviewTypeName: question.interviewRound.interviewType.name,
    }));

    return {
      items,
      nextCursor: hasMore ? (page.at(-1)?.id ?? null) : null,
    };
  }
}
