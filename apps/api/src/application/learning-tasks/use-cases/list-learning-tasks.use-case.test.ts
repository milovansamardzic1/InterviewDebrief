import { describe, expect, it } from "vitest";

import type {
  LearningTasksRepository,
  ListLearningTasksOptions,
} from "../ports/learning-tasks.repository.js";
import type { LearningTaskRecord } from "../read-models/learning-task.record.js";
import { ListLearningTasksUseCase } from "./list-learning-tasks.use-case.js";

const TASK: LearningTaskRecord = {
  id: "task-1",
  userId: "user-1",
  skillId: "skill-1",
  skillName: "System Design",
  skillCategory: "Architecture",
  title: "Review caching patterns",
  status: "IN_PROGRESS",
  priority: "HIGH",
  dueDate: new Date("2026-08-30T10:00:00.000Z"),
  notes: null,
  completedAt: null,
  createdAt: new Date("2026-08-20T10:00:00.000Z"),
  updatedAt: new Date("2026-08-21T10:00:00.000Z"),
};

class ListRepository implements LearningTasksRepository {
  lastOptions?: ListLearningTasksOptions;

  async findMany(options: ListLearningTasksOptions) {
    this.lastOptions = options;
    return [TASK];
  }

  async skillExists() {
    return true;
  }

  async create() {
    return TASK;
  }

  async update() {
    return TASK;
  }

  async delete() {
    return true;
  }
}

describe("ListLearningTasksUseCase", () => {
  it("lists tenant tasks and serializes dates", async () => {
    const repository = new ListRepository();
    const result = await new ListLearningTasksUseCase(repository).execute({
      userId: "user-1",
      includeCompleted: true,
    });

    expect(repository.lastOptions).toEqual({
      userId: "user-1",
      includeCompleted: true,
    });
    expect(result.items[0]).toMatchObject({
      id: "task-1",
      dueDate: "2026-08-30T10:00:00.000Z",
      createdAt: "2026-08-20T10:00:00.000Z",
    });
  });

  it("leaves includeCompleted undefined for the default repository filter", async () => {
    const repository = new ListRepository();
    await new ListLearningTasksUseCase(repository).execute({
      userId: "user-1",
    });

    expect(repository.lastOptions?.includeCompleted).toBeUndefined();
  });
});
