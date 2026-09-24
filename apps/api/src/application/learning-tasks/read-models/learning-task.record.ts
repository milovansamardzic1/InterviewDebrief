import type {
  LearningTaskPriority,
  LearningTaskStatus,
} from "@interwjuer/contracts";

export type LearningTaskRecord = {
  id: string;
  userId: string;
  skillId: string;
  skillName: string;
  skillCategory: string | null;
  title: string;
  status: LearningTaskStatus;
  priority: LearningTaskPriority;
  dueDate: Date | null;
  notes: string | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
