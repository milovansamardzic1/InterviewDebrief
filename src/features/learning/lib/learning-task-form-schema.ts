import { z } from "zod";
import type {
  CreateLearningTaskRequest,
  LearningTask,
  LearningTaskPriority,
  UpdateLearningTaskRequest,
} from "@interwjuer/contracts";

const LEARNING_TASK_PRIORITY_VALUES = [
  "LOW",
  "MEDIUM",
  "HIGH",
] as const satisfies readonly LearningTaskPriority[];

export const learningTaskPriorityOptions: Array<{
  value: LearningTaskPriority;
  label: string;
}> = [
  { value: "LOW", label: "Nizak" },
  { value: "MEDIUM", label: "Srednji" },
  { value: "HIGH", label: "Visok" },
];

export const learningTaskFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Naslov je obavezan.")
    .max(200, "Maksimalno 200 karaktera."),
  priority: z.enum(LEARNING_TASK_PRIORITY_VALUES),
  dueDate: z.string().optional(),
  notes: z.string().max(10000, "Maksimalno 10000 karaktera.").optional(),
});

export type LearningTaskFormValues = z.infer<typeof learningTaskFormSchema>;

export function buildLearningTaskFormValues(
  suggestedTitle: string,
): LearningTaskFormValues {
  return {
    title: suggestedTitle,
    priority: "MEDIUM",
    dueDate: "",
    notes: "",
  };
}

export function learningTaskToFormValues(
  task: LearningTask,
): LearningTaskFormValues {
  return {
    title: task.title,
    priority: task.priority,
    dueDate: task.dueDate
      ? new Date(task.dueDate).toISOString().slice(0, 10)
      : "",
    notes: task.notes ?? "",
  };
}

export function toLearningTaskRequestPayload(
  values: LearningTaskFormValues,
): Omit<CreateLearningTaskRequest, "skillId"> & UpdateLearningTaskRequest {
  return {
    title: values.title.trim(),
    priority: values.priority,
    dueDate: values.dueDate || null,
    notes: values.notes?.trim() ? values.notes.trim() : null,
  };
}
