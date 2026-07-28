"use server";

import type {
  CreateInterviewRoundRequest,
  InterviewRoundResponse,
  UpdateInterviewRoundRequest,
} from "@interwjuer/contracts";

import { applicationsApi } from "@/lib/api/applications";
import { ApiError } from "@/lib/api/errors";

export type RoundMutationResult =
  | { success: true; round: InterviewRoundResponse }
  | { success: false; error: string };

export type DeleteRoundResult =
  | { success: true }
  | { success: false; error: string };

function toErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    return error.message;
  }

  return "Došlo je do neočekivane greške. Pokušaj ponovo.";
}

export async function createInterviewRoundAction(
  applicationId: string,
  payload: CreateInterviewRoundRequest,
): Promise<RoundMutationResult> {
  try {
    const round = await applicationsApi.rounds.create(applicationId, payload);
    return { success: true, round };
  } catch (error) {
    return { success: false, error: toErrorMessage(error) };
  }
}

export async function updateInterviewRoundAction(
  applicationId: string,
  roundId: string,
  payload: UpdateInterviewRoundRequest,
): Promise<RoundMutationResult> {
  try {
    const round = await applicationsApi.rounds.update(
      applicationId,
      roundId,
      payload,
    );
    return { success: true, round };
  } catch (error) {
    return { success: false, error: toErrorMessage(error) };
  }
}

export async function deleteInterviewRoundAction(
  applicationId: string,
  roundId: string,
): Promise<DeleteRoundResult> {
  try {
    await applicationsApi.rounds.delete(applicationId, roundId);
    return { success: true };
  } catch (error) {
    return { success: false, error: toErrorMessage(error) };
  }
}
