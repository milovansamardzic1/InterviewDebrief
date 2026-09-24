import type { LearningTaskPriority, LearningTaskStatus } from "./enums.js";

export type LearningTask = {
  id: string;
  skillId: string;
  skillName: string;
  skillCategory: string | null;
  title: string;
  status: LearningTaskStatus;
  priority: LearningTaskPriority;
  dueDate: string | null;
  notes: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LearningTaskListResponse = {
  items: LearningTask[];
};

export type CreateLearningTaskRequest = {
  skillId: string;
  title: string;
  priority?: LearningTaskPriority;
  dueDate?: string | null;
  notes?: string | null;
};

export type UpdateLearningTaskRequest = {
  title?: string;
  status?: LearningTaskStatus;
  priority?: LearningTaskPriority;
  dueDate?: string | null;
  notes?: string | null;
};
