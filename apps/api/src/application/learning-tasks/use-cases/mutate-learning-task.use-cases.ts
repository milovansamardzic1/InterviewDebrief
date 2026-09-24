import type {
  LearningTask,
  LearningTaskPriority,
  LearningTaskStatus,
} from "@interwjuer/contracts";

import {
  assertCondition,
  assertResourceExists,
} from "../../shared/assert-resource.js";
import type { LearningTasksRepository } from "../ports/learning-tasks.repository.js";
import { toLearningTask } from "./list-learning-tasks.use-case.js";

export type CreateLearningTaskInput = {
  userId: string;
  skillId: string;
  title: string;
  priority?: LearningTaskPriority;
  dueDate?: Date | null;
  notes?: string | null;
};

export class CreateLearningTaskUseCase {
  constructor(private readonly repository: LearningTasksRepository) {}

  async execute(input: CreateLearningTaskInput): Promise<LearningTask> {
    const skillExists = await this.repository.skillExists(input.skillId);
    assertCondition(skillExists, "Skill not found", "SKILL_NOT_FOUND");

    const task = await this.repository.create(input);
    return toLearningTask(task);
  }
}

export type UpdateLearningTaskInput = {
  id: string;
  userId: string;
  title?: string;
  status?: LearningTaskStatus;
  priority?: LearningTaskPriority;
  dueDate?: Date | null;
  notes?: string | null;
};

export class UpdateLearningTaskUseCase {
  constructor(
    private readonly repository: LearningTasksRepository,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async execute(input: UpdateLearningTaskInput): Promise<LearningTask> {
    const completedAt =
      input.status === "COMPLETED"
        ? this.now()
        : input.status === "PLANNED" || input.status === "IN_PROGRESS"
          ? null
          : undefined;
    const task = await this.repository.update(input.id, input.userId, {
      title: input.title,
      status: input.status,
      priority: input.priority,
      dueDate: input.dueDate,
      notes: input.notes,
      completedAt,
    });

    assertResourceExists(
      task,
      "Learning task not found",
      "LEARNING_TASK_NOT_FOUND",
    );
    return toLearningTask(task);
  }
}

export class DeleteLearningTaskUseCase {
  constructor(private readonly repository: LearningTasksRepository) {}

  async execute(input: { id: string; userId: string }): Promise<void> {
    const deleted = await this.repository.delete(input.id, input.userId);
    assertCondition(
      deleted,
      "Learning task not found",
      "LEARNING_TASK_NOT_FOUND",
    );
  }
}
