"use server";

import type {
  CreateQuestionRequest,
  QuestionResponse,
  UpdateQuestionRequest,
} from "@interwjuer/contracts";

import { applicationsApi } from "@/lib/api/applications";
import { ApiError } from "@/lib/api/errors";

export type QuestionMutationResult =
  | { success: true; question: QuestionResponse }
  | { success: false; error: string };

export type DeleteQuestionResult =
  | { success: true }
  | { success: false; error: string };

function toErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    return error.message;
  }

  return "Došlo je do neočekivane greške. Pokušaj ponovo.";
}

export async function createQuestionAction(
  applicationId: string,
  roundId: string,
  payload: CreateQuestionRequest,
): Promise<QuestionMutationResult> {
  try {
    const question = await applicationsApi.questions.create(
      applicationId,
      roundId,
      payload,
    );
    return { success: true, question };
  } catch (error) {
    return { success: false, error: toErrorMessage(error) };
  }
}

export async function updateQuestionAction(
  applicationId: string,
  roundId: string,
  questionId: string,
  payload: UpdateQuestionRequest,
): Promise<QuestionMutationResult> {
  try {
    const question = await applicationsApi.questions.update(
      applicationId,
      roundId,
      questionId,
      payload,
    );
    return { success: true, question };
  } catch (error) {
    return { success: false, error: toErrorMessage(error) };
  }
}

export async function deleteQuestionAction(
  applicationId: string,
  roundId: string,
  questionId: string,
): Promise<DeleteQuestionResult> {
  try {
    await applicationsApi.questions.delete(applicationId, roundId, questionId);
    return { success: true };
  } catch (error) {
    return { success: false, error: toErrorMessage(error) };
  }
}
