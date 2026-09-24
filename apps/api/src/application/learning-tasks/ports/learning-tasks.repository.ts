import type {
  LearningTaskPriority,
  LearningTaskStatus,
} from "@interwjuer/contracts";

import type { LearningTaskRecord } from "../read-models/learning-task.record.js";

export type ListLearningTasksOptions = {
  userId: string;
  includeCompleted?: boolean;
};

export type CreateLearningTaskData = {
  userId: string;
  skillId: string;
  title: string;
  priority?: LearningTaskPriority;
  dueDate?: Date | null;
  notes?: string | null;
};

export type UpdateLearningTaskData = {
  title?: string;
  status?: LearningTaskStatus;
  priority?: LearningTaskPriority;
  dueDate?: Date | null;
  notes?: string | null;
  completedAt?: Date | null;
};

export interface LearningTasksRepository {
  findMany(options: ListLearningTasksOptions): Promise<LearningTaskRecord[]>;
  skillExists(skillId: string): Promise<boolean>;
  create(data: CreateLearningTaskData): Promise<LearningTaskRecord>;
  update(
    id: string,
    userId: string,
    data: UpdateLearningTaskData,
  ): Promise<LearningTaskRecord | null>;
  delete(id: string, userId: string): Promise<boolean>;
}
