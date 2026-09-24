"use server";

import type {
  CreateLearningTaskRequest,
  LearningTask,
  UpdateLearningTaskRequest,
} from "@interwjuer/contracts";

import { ApiError } from "@/lib/api/errors";
import { learningTasksApi } from "@/lib/api/learning-tasks";

export type LearningTaskMutationResult =
  | { success: true; task: LearningTask }
  | { success: false; error: string };

export type DeleteLearningTaskResult =
  | { success: true }
  | { success: false; error: string };

function toErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    return error.message;
  }

  return "Došlo je do neočekivane greške. Pokušaj ponovo.";
}

export async function createLearningTaskAction(
  payload: CreateLearningTaskRequest,
): Promise<LearningTaskMutationResult> {
  try {
    const task = await learningTasksApi.create(payload);
    return { success: true, task };
  } catch (error) {
    return { success: false, error: toErrorMessage(error) };
  }
}

export async function updateLearningTaskAction(
  id: string,
  payload: UpdateLearningTaskRequest,
): Promise<LearningTaskMutationResult> {
  try {
    const task = await learningTasksApi.update(id, payload);
    return { success: true, task };
  } catch (error) {
    return { success: false, error: toErrorMessage(error) };
  }
}

export async function deleteLearningTaskAction(
  id: string,
): Promise<DeleteLearningTaskResult> {
  try {
    await learningTasksApi.delete(id);
    return { success: true };
  } catch (error) {
    return { success: false, error: toErrorMessage(error) };
  }
}
