"use server";

import type {
  ApplicationDetail,
  CreateApplicationRequest,
  UpdateApplicationRequest,
} from "@interwjuer/contracts";

import { applicationsApi } from "@/lib/api/applications";
import { ApiError } from "@/lib/api/errors";

export type ApplicationMutationResult =
  | { success: true; application: ApplicationDetail }
  | { success: false; error: string };

export type DeleteApplicationResult =
  | { success: true }
  | { success: false; error: string };

function toErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    return error.message;
  }

  return "Došlo je do neočekivane greške. Pokušaj ponovo.";
}

/**
 * Server Actions proxy mutations to the API. They exist because the browser
 * cannot read the httpOnly access-token cookie (see `lib/auth/session.ts`),
 * so any write coming from a Client Component must be executed on the server.
 */
export async function createApplicationAction(
  payload: CreateApplicationRequest,
): Promise<ApplicationMutationResult> {
  try {
    const application = await applicationsApi.create(payload);
    return { success: true, application };
  } catch (error) {
    return { success: false, error: toErrorMessage(error) };
  }
}

export async function updateApplicationAction(
  id: string,
  payload: UpdateApplicationRequest,
): Promise<ApplicationMutationResult> {
  try {
    const application = await applicationsApi.update(id, payload);
    return { success: true, application };
  } catch (error) {
    return { success: false, error: toErrorMessage(error) };
  }
}

export async function deleteApplicationAction(
  id: string,
): Promise<DeleteApplicationResult> {
  try {
    await applicationsApi.delete(id);
    return { success: true };
  } catch (error) {
    return { success: false, error: toErrorMessage(error) };
  }
}
