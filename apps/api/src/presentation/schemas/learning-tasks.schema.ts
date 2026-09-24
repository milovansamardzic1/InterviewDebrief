import { z } from "zod";

const cuid = z.string().cuid();
const LearningTaskStatusSchema = z.enum([
  "PLANNED",
  "IN_PROGRESS",
  "COMPLETED",
]);
const LearningTaskPrioritySchema = z.enum(["LOW", "MEDIUM", "HIGH"]);

export const LearningTaskIdParamSchema = z.object({
  id: cuid,
});

export const ListLearningTasksQuerySchema = z.object({
  includeCompleted: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .default("false"),
});

export const CreateLearningTaskBodySchema = z.object({
  skillId: cuid,
  title: z.string().trim().min(1).max(500),
  priority: LearningTaskPrioritySchema.optional(),
  dueDate: z.coerce.date().nullable().optional(),
  notes: z.string().max(10000).nullable().optional(),
});

export const UpdateLearningTaskBodySchema = z.object({
  title: z.string().trim().min(1).max(500).optional(),
  status: LearningTaskStatusSchema.optional(),
  priority: LearningTaskPrioritySchema.optional(),
  dueDate: z.coerce.date().nullable().optional(),
  notes: z.string().max(10000).nullable().optional(),
});
