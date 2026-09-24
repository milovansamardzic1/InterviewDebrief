import { describe, expect, it } from "vitest";

import type {
  CreateLearningTaskData,
  LearningTasksRepository,
  ListLearningTasksOptions,
  UpdateLearningTaskData,
} from "../ports/learning-tasks.repository.js";
import type { LearningTaskRecord } from "../read-models/learning-task.record.js";
import {
  CreateLearningTaskUseCase,
  DeleteLearningTaskUseCase,
  UpdateLearningTaskUseCase,
} from "./mutate-learning-task.use-cases.js";

const USER_ID = "user-1";
const TASK_ID = "task-1";
const NOW = new Date("2026-08-24T01:00:00.000Z");

function task(overrides: Partial<LearningTaskRecord> = {}): LearningTaskRecord {
  return {
    id: TASK_ID,
    userId: USER_ID,
    skillId: "skill-1",
    skillName: "TypeScript",
    skillCategory: "Language",
    title: "Practice generics",
    status: "PLANNED",
    priority: "MEDIUM",
    dueDate: null,
    notes: null,
    completedAt: null,
    createdAt: new Date("2026-08-20T10:00:00.000Z"),
    updatedAt: new Date("2026-08-20T10:00:00.000Z"),
    ...overrides,
  };
}

class FakeLearningTasksRepository implements LearningTasksRepository {
  tasks = new Map<string, LearningTaskRecord>();
  skillIds = new Set(["skill-1"]);
  lastCreated?: CreateLearningTaskData;
  lastUpdated?: UpdateLearningTaskData;

  async findMany(options: ListLearningTasksOptions) {
    return [...this.tasks.values()].filter(
      (item) =>
        item.userId === options.userId &&
        (options.includeCompleted || item.status !== "COMPLETED"),
    );
  }

  async skillExists(skillId: string) {
    return this.skillIds.has(skillId);
  }

  async create(data: CreateLearningTaskData) {
    this.lastCreated = data;
    const created = task({
      userId: data.userId,
      skillId: data.skillId,
      title: data.title,
      priority: data.priority ?? "MEDIUM",
      status: "PLANNED",
      dueDate: data.dueDate ?? null,
      notes: data.notes ?? null,
    });
    this.tasks.set(created.id, created);
    return created;
  }

  async update(id: string, userId: string, data: UpdateLearningTaskData) {
    this.lastUpdated = data;
    const existing = this.tasks.get(id);
    if (!existing || existing.userId !== userId) {
      return null;
    }

    const updated = {
      ...existing,
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
      ...(data.priority !== undefined ? { priority: data.priority } : {}),
      ...(data.dueDate !== undefined ? { dueDate: data.dueDate } : {}),
      ...(data.notes !== undefined ? { notes: data.notes } : {}),
      ...(data.completedAt !== undefined
        ? { completedAt: data.completedAt }
        : {}),
    };
    this.tasks.set(id, updated);
    return updated;
  }

  async delete(id: string, userId: string) {
    const existing = this.tasks.get(id);
    return existing?.userId === userId ? this.tasks.delete(id) : false;
  }
}

describe("CreateLearningTaskUseCase", () => {
  it("creates a task with planned and medium defaults", async () => {
    const repository = new FakeLearningTasksRepository();
    const result = await new CreateLearningTaskUseCase(repository).execute({
      userId: USER_ID,
      skillId: "skill-1",
      title: "Practice generics",
    });

    expect(result).toMatchObject({
      status: "PLANNED",
      priority: "MEDIUM",
    });
    expect(repository.lastCreated).toMatchObject({
      userId: USER_ID,
      skillId: "skill-1",
    });
  });

  it("rejects a missing skill with a clear code", async () => {
    const repository = new FakeLearningTasksRepository();

    await expect(
      new CreateLearningTaskUseCase(repository).execute({
        userId: USER_ID,
        skillId: "missing",
        title: "Practice",
      }),
    ).rejects.toMatchObject({
      code: "SKILL_NOT_FOUND",
    });
  });
});

describe("UpdateLearningTaskUseCase", () => {
  it("does not expose another tenant's task", async () => {
    const repository = new FakeLearningTasksRepository();
    repository.tasks.set(TASK_ID, task({ userId: "other-user" }));

    await expect(
      new UpdateLearningTaskUseCase(repository).execute({
        id: TASK_ID,
        userId: USER_ID,
        title: "Changed",
      }),
    ).rejects.toMatchObject({
      code: "LEARNING_TASK_NOT_FOUND",
    });
  });

  it("sets completedAt when completing a task", async () => {
    const repository = new FakeLearningTasksRepository();
    repository.tasks.set(TASK_ID, task());
    const result = await new UpdateLearningTaskUseCase(
      repository,
      () => NOW,
    ).execute({
      id: TASK_ID,
      userId: USER_ID,
      status: "COMPLETED",
    });

    expect(result.completedAt).toBe(NOW.toISOString());
    expect(repository.lastUpdated?.completedAt).toEqual(NOW);
  });

  it.each(["PLANNED", "IN_PROGRESS"] as const)(
    "clears completedAt when transitioning to %s",
    async (status) => {
      const repository = new FakeLearningTasksRepository();
      repository.tasks.set(
        TASK_ID,
        task({ status: "COMPLETED", completedAt: NOW }),
      );

      const result = await new UpdateLearningTaskUseCase(repository).execute({
        id: TASK_ID,
        userId: USER_ID,
        status,
      });

      expect(result.completedAt).toBeNull();
      expect(repository.lastUpdated?.completedAt).toBeNull();
    },
  );
});

describe("DeleteLearningTaskUseCase", () => {
  it("deletes only the tenant's task", async () => {
    const repository = new FakeLearningTasksRepository();
    repository.tasks.set(TASK_ID, task());

    await new DeleteLearningTaskUseCase(repository).execute({
      id: TASK_ID,
      userId: USER_ID,
    });

    expect(repository.tasks.has(TASK_ID)).toBe(false);
  });

  it("returns tenant-scoped not found", async () => {
    const repository = new FakeLearningTasksRepository();
    repository.tasks.set(TASK_ID, task({ userId: "other-user" }));

    await expect(
      new DeleteLearningTaskUseCase(repository).execute({
        id: TASK_ID,
        userId: USER_ID,
      }),
    ).rejects.toMatchObject({
      code: "LEARNING_TASK_NOT_FOUND",
    });
  });
});
