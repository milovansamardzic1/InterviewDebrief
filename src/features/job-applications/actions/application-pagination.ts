"use server";

import type { ApplicationListResponse } from "@interwjuer/contracts";

import {
  applicationsApi,
  type ListApplicationsOptions,
} from "@/lib/api/applications";
import { ApiError } from "@/lib/api/errors";

export type LoadMoreApplicationsResult =
  | { success: true; page: ApplicationListResponse }
  | { success: false; error: string };

export async function loadMoreApplicationsAction(
  options: ListApplicationsOptions & { cursor: string },
): Promise<LoadMoreApplicationsResult> {
  try {
    const page = await applicationsApi.list(options);
    return { success: true, page };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof ApiError
          ? error.message
          : "Nove prijave trenutno nije moguće učitati. Pokušaj ponovo.",
    };
  }
}
