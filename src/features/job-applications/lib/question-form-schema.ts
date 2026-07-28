import { z } from "zod";
import type {
  ApplicationDetailQuestion,
  CreateQuestionRequest,
  UpdateQuestionRequest,
} from "@interwjuer/contracts";

export const difficultyOptions = [1, 2, 3, 4, 5] as const;

export const questionFormSchema = z.object({
  question: z
    .string()
    .trim()
    .min(1, "Pitanje je obavezno.")
    .max(10000, "Maksimalno 10000 karaktera."),
  myAnswer: z.string().max(10000, "Maksimalno 10000 karaktera.").optional(),
  topic: z.string().trim().max(200, "Maksimalno 200 karaktera.").optional(),
  difficulty: z.string().trim().optional(),
  notes: z.string().max(10000, "Maksimalno 10000 karaktera.").optional(),
});

export type QuestionFormValues = z.infer<typeof questionFormSchema>;

export function buildEmptyQuestionFormValues(): QuestionFormValues {
  return {
    question: "",
    myAnswer: "",
    topic: "",
    difficulty: "",
    notes: "",
  };
}

export function questionDetailToFormValues(
  question: ApplicationDetailQuestion,
): QuestionFormValues {
  return {
    question: question.question,
    myAnswer: question.myAnswer ?? "",
    topic: question.topic ?? "",
    difficulty: question.difficulty != null ? String(question.difficulty) : "",
    notes: question.notes ?? "",
  };
}

export function toQuestionRequestPayload(
  values: QuestionFormValues,
): CreateQuestionRequest & UpdateQuestionRequest {
  return {
    question: values.question.trim(),
    myAnswer: values.myAnswer?.trim() ? values.myAnswer.trim() : null,
    topic: values.topic?.trim() ? values.topic.trim() : null,
    difficulty: values.difficulty ? Number(values.difficulty) : null,
    notes: values.notes?.trim() ? values.notes.trim() : null,
  };
}
