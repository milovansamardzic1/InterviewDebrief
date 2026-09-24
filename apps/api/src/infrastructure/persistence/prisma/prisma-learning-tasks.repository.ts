import type { Prisma, PrismaClient } from "@prisma/client";

import type {
  CreateLearningTaskData,
  LearningTasksRepository,
  ListLearningTasksOptions,
  UpdateLearningTaskData,
} from "../../../application/learning-tasks/ports/learning-tasks.repository.js";
import type { LearningTaskRecord } from "../../../application/learning-tasks/read-models/learning-task.record.js";
import type { Logger } from "../../logging/logger.js";
import { runPrismaOperation } from "./prisma-error.js";

const taskWithSkill = {
  include: {
    skill: {
      select: { name: true, category: true },
    },
  },
} satisfies Prisma.LearningTaskDefaultArgs;

type TaskWithSkill = Prisma.LearningTaskGetPayload<typeof taskWithSkill>;

const PRIORITY_RANK = { HIGH: 0, MEDIUM: 1, LOW: 2 } as const;

function toRecord(task: TaskWithSkill): LearningTaskRecord {
  return {
    id: task.id,
    userId: task.userId,
    skillId: task.skillId,
    skillName: task.skill.name,
    skillCategory: task.skill.category,
    title: task.title,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate,
    notes: task.notes,
    completedAt: task.completedAt,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}

function compareTasks(left: TaskWithSkill, right: TaskWithSkill): number {
  const priorityDifference =
    PRIORITY_RANK[left.priority] - PRIORITY_RANK[right.priority];
  if (priorityDifference !== 0) {
    return priorityDifference;
  }

  if (left.dueDate !== null && right.dueDate !== null) {
    const dueDateDifference = left.dueDate.getTime() - right.dueDate.getTime();
    if (dueDateDifference !== 0) {
      return dueDateDifference;
    }
  } else if (left.dueDate === null && right.dueDate !== null) {
    return 1;
  } else if (left.dueDate !== null && right.dueDate === null) {
    return -1;
  }

  const createdAtDifference =
    right.createdAt.getTime() - left.createdAt.getTime();
  return createdAtDifference !== 0
    ? createdAtDifference
    : right.id.localeCompare(left.id);
}

export class PrismaLearningTasksRepository implements LearningTasksRepository {
  constructor(
    private readonly db: PrismaClient,
    private readonly logger: Logger,
  ) {}

  async findMany(
    options: ListLearningTasksOptions,
  ): Promise<LearningTaskRecord[]> {
    const tasks = await runPrismaOperation(
      "learningTask.findMany",
      this.logger,
      () =>
        this.db.learningTask.findMany({
          where: {
            userId: options.userId,
            ...(!options.includeCompleted
              ? { status: { not: "COMPLETED" as const } }
              : {}),
          },
          ...taskWithSkill,
        }),
    );

    return tasks.sort(compareTasks).map(toRecord);
  }

  async skillExists(skillId: string): Promise<boolean> {
    const count = await runPrismaOperation(
      "learningTask.skillExists",
      this.logger,
      () => this.db.skill.count({ where: { id: skillId } }),
    );
    return count > 0;
  }

  async create(data: CreateLearningTaskData): Promise<LearningTaskRecord> {
    const task = await runPrismaOperation(
      "learningTask.create",
      this.logger,
      () =>
        this.db.learningTask.create({
          data: {
            userId: data.userId,
            skillId: data.skillId,
            title: data.title,
            status: "PLANNED",
            priority: data.priority ?? "MEDIUM",
            dueDate: data.dueDate ?? null,
            notes: data.notes ?? null,
          },
          ...taskWithSkill,
        }),
    );
    return toRecord(task);
  }

  async update(
    id: string,
    userId: string,
    data: UpdateLearningTaskData,
  ): Promise<LearningTaskRecord | null> {
    const existing = await runPrismaOperation(
      "learningTask.findForUpdate",
      this.logger,
      () => this.db.learningTask.findFirst({ where: { id, userId } }),
    );
    if (!existing) {
      return null;
    }

    const task = await runPrismaOperation(
      "learningTask.update",
      this.logger,
      () =>
        this.db.learningTask.update({
          where: { id },
          data: {
            ...(data.title !== undefined ? { title: data.title } : {}),
            ...(data.status !== undefined ? { status: data.status } : {}),
            ...(data.priority !== undefined ? { priority: data.priority } : {}),
            ...(data.dueDate !== undefined ? { dueDate: data.dueDate } : {}),
            ...(data.notes !== undefined ? { notes: data.notes } : {}),
            ...(data.completedAt !== undefined
              ? { completedAt: data.completedAt }
              : {}),
          },
          ...taskWithSkill,
        }),
    );
    return toRecord(task);
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const result = await runPrismaOperation(
      "learningTask.delete",
      this.logger,
      () => this.db.learningTask.deleteMany({ where: { id, userId } }),
    );
    return result.count > 0;
  }
}
