import type {
  LearningTask,
  LearningTaskListResponse,
} from "@interwjuer/contracts";

import type { LearningTasksRepository } from "../ports/learning-tasks.repository.js";
import type { LearningTaskRecord } from "../read-models/learning-task.record.js";

export function toLearningTask(record: LearningTaskRecord): LearningTask {
  return {
    id: record.id,
    skillId: record.skillId,
    skillName: record.skillName,
    skillCategory: record.skillCategory,
    title: record.title,
    status: record.status,
    priority: record.priority,
    dueDate: record.dueDate?.toISOString() ?? null,
    notes: record.notes,
    completedAt: record.completedAt?.toISOString() ?? null,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export class ListLearningTasksUseCase {
  constructor(private readonly repository: LearningTasksRepository) {}

  async execute(input: {
    userId: string;
    includeCompleted?: boolean;
  }): Promise<LearningTaskListResponse> {
    const tasks = await this.repository.findMany(input);
    return { items: tasks.map(toLearningTask) };
  }
}
