import { z } from "zod";
import type {
  ApplicationDetailSkillEvaluation,
  CreateSkillEvaluationRequest,
  UpdateSkillEvaluationRequest,
} from "@interwjuer/contracts";

export const skillScoreOptions = [1, 2, 3, 4, 5] as const;

export const skillEvaluationFormSchema = z.object({
  skillId: z.string().min(1, "Veština je obavezna."),
  score: z.string().min(1, "Ocena je obavezna."),
  notes: z.string().max(10000, "Maksimalno 10000 karaktera.").optional(),
});

export type SkillEvaluationFormValues = z.infer<
  typeof skillEvaluationFormSchema
>;

export function buildEmptySkillEvaluationFormValues(): SkillEvaluationFormValues {
  return {
    skillId: "",
    score: "3",
    notes: "",
  };
}

export function skillEvaluationDetailToFormValues(
  evaluation: ApplicationDetailSkillEvaluation,
  skillId: string,
): SkillEvaluationFormValues {
  return {
    skillId,
    score: String(evaluation.score),
    notes: evaluation.notes ?? "",
  };
}

export function toSkillEvaluationRequestPayload(
  values: SkillEvaluationFormValues,
): CreateSkillEvaluationRequest & UpdateSkillEvaluationRequest {
  return {
    skillId: values.skillId,
    score: Number(values.score),
    notes: values.notes?.trim() ? values.notes.trim() : null,
  };
}
