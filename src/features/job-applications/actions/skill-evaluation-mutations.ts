"use server";

import type {
  CreateSkillEvaluationRequest,
  SkillEvaluationResponse,
  UpdateSkillEvaluationRequest,
} from "@interwjuer/contracts";

import { applicationsApi } from "@/lib/api/applications";
import { ApiError } from "@/lib/api/errors";

export type SkillEvaluationMutationResult =
  | { success: true; evaluation: SkillEvaluationResponse }
  | { success: false; error: string };

export type DeleteSkillEvaluationResult =
  | { success: true }
  | { success: false; error: string };

function toErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    return error.message;
  }

  return "Došlo je do neočekivane greške. Pokušaj ponovo.";
}

export async function createSkillEvaluationAction(
  applicationId: string,
  roundId: string,
  payload: CreateSkillEvaluationRequest,
): Promise<SkillEvaluationMutationResult> {
  try {
    const evaluation = await applicationsApi.skillEvaluations.create(
      applicationId,
      roundId,
      payload,
    );
    return { success: true, evaluation };
  } catch (error) {
    return { success: false, error: toErrorMessage(error) };
  }
}

export async function updateSkillEvaluationAction(
  applicationId: string,
  roundId: string,
  evaluationId: string,
  payload: UpdateSkillEvaluationRequest,
): Promise<SkillEvaluationMutationResult> {
  try {
    const evaluation = await applicationsApi.skillEvaluations.update(
      applicationId,
      roundId,
      evaluationId,
      payload,
    );
    return { success: true, evaluation };
  } catch (error) {
    return { success: false, error: toErrorMessage(error) };
  }
}

export async function deleteSkillEvaluationAction(
  applicationId: string,
  roundId: string,
  evaluationId: string,
): Promise<DeleteSkillEvaluationResult> {
  try {
    await applicationsApi.skillEvaluations.delete(
      applicationId,
      roundId,
      evaluationId,
    );
    return { success: true };
  } catch (error) {
    return { success: false, error: toErrorMessage(error) };
  }
}
