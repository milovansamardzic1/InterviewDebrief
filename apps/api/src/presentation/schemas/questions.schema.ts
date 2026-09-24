import { z } from "zod";

const cuid = z.string().cuid();

export const ListQuestionHistoryQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  cursor: cuid.optional(),
  topic: z.string().trim().min(1).max(200).optional(),
  search: z.string().trim().min(1).max(200).optional(),
  company: z.string().trim().min(1).max(200).optional(),
  difficulty: z.coerce.number().int().min(1).max(5).optional(),
  answeredOnly: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),
});

export type ListQuestionHistoryQuery = z.infer<
  typeof ListQuestionHistoryQuerySchema
>;
