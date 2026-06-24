import type { InterviewRoundStatus } from "@interwjuer/contracts";

import { ValidationError } from "../shared/errors/app-error.js";

const VALID_TRANSITIONS: Record<
  InterviewRoundStatus,
  readonly InterviewRoundStatus[]
> = {
  SCHEDULED: ["IN_PROGRESS", "CANCELLED", "NO_SHOW"],
  IN_PROGRESS: ["COMPLETED", "CANCELLED", "NO_SHOW"],
  COMPLETED: [],
  CANCELLED: [],
  NO_SHOW: [],
};

export function assertValidStatusTransition(
  current: InterviewRoundStatus,
  next: InterviewRoundStatus,
): void {
  if (current === next) {
    return;
  }

  if (!VALID_TRANSITIONS[current].includes(next)) {
    throw new ValidationError(
      `Cannot transition round status from ${current} to ${next}`,
      { code: "INVALID_STATUS_TRANSITION" },
    );
  }
}

export function resolveCompletedAt(
  currentStatus: InterviewRoundStatus,
  nextStatus: InterviewRoundStatus,
  explicitCompletedAt: Date | null | undefined,
): Date | null | undefined {
  if (explicitCompletedAt !== undefined) {
    return explicitCompletedAt;
  }

  if (nextStatus === "COMPLETED" && currentStatus !== "COMPLETED") {
    return new Date();
  }

  return undefined;
}
