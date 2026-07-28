import { z } from "zod";
import type {
  ApplicationDetailRound,
  CreateInterviewRoundRequest,
  InterviewRoundStatus,
  UpdateInterviewRoundRequest,
} from "@interwjuer/contracts";

const ROUND_STATUS_VALUES = [
  "SCHEDULED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
] as const satisfies readonly InterviewRoundStatus[];

export const roundStatusOptions: Array<{
  value: InterviewRoundStatus;
  label: string;
}> = [
  { value: "SCHEDULED", label: "Zakazano" },
  { value: "IN_PROGRESS", label: "U toku" },
  { value: "COMPLETED", label: "Završeno" },
  { value: "CANCELLED", label: "Otkazano" },
  { value: "NO_SHOW", label: "Nije se pojavio" },
];

// Mirrors apps/api/src/application/interview-rounds/round-status.ts —
// keep in sync so the picker never offers a transition the API will reject.
const VALID_STATUS_TRANSITIONS: Record<
  InterviewRoundStatus,
  readonly InterviewRoundStatus[]
> = {
  SCHEDULED: ["IN_PROGRESS", "CANCELLED", "NO_SHOW"],
  IN_PROGRESS: ["COMPLETED", "CANCELLED", "NO_SHOW"],
  COMPLETED: [],
  CANCELLED: [],
  NO_SHOW: [],
};

export function getAvailableStatusOptions(currentStatus: InterviewRoundStatus) {
  const allowed = new Set<InterviewRoundStatus>([
    currentStatus,
    ...VALID_STATUS_TRANSITIONS[currentStatus],
  ]);
  return roundStatusOptions.filter((option) => allowed.has(option.value));
}

export const roundFormSchema = z.object({
  interviewTypeId: z.string().min(1, "Tip intervjua je obavezan."),
  status: z.enum(ROUND_STATUS_VALUES),
  scheduledAt: z.string().trim().optional(),
  completedAt: z.string().trim().optional(),
  notes: z.string().max(10000, "Maksimalno 10000 karaktera.").optional(),
});

export type RoundFormValues = z.infer<typeof roundFormSchema>;

export function buildEmptyRoundFormValues(): RoundFormValues {
  return {
    interviewTypeId: "",
    status: "SCHEDULED",
    scheduledAt: "",
    completedAt: "",
    notes: "",
  };
}

function toDateTimeInputValue(date: Date | null) {
  if (!date) {
    return "";
  }

  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

export function roundDetailToFormValues(
  round: ApplicationDetailRound,
  interviewTypeId: string,
): RoundFormValues {
  return {
    interviewTypeId,
    status: round.status,
    scheduledAt: toDateTimeInputValue(round.scheduledAt),
    completedAt: toDateTimeInputValue(round.completedAt),
    notes: round.notes ?? "",
  };
}

export function toInterviewRoundRequestPayload(
  values: RoundFormValues,
): CreateInterviewRoundRequest & UpdateInterviewRoundRequest {
  return {
    interviewTypeId: values.interviewTypeId,
    status: values.status,
    scheduledAt: values.scheduledAt ? new Date(values.scheduledAt) : null,
    completedAt: values.completedAt ? new Date(values.completedAt) : null,
    notes: values.notes?.trim() ? values.notes.trim() : null,
  };
}
