import type {
  ApplicationStatus,
  InterviewRoundStatus,
} from "@interwjuer/contracts";
import type { VariantProps } from "class-variance-authority";

import { badgeVariants } from "@/components/ui/badge";

const applicationStatusLabels: Record<ApplicationStatus, string> = {
  APPLIED: "Prijavljeno",
  SCREENING: "Screening",
  INTERVIEWING: "Intervjui",
  OFFER: "Ponuda",
  ACCEPTED: "Prihvaćeno",
  REJECTED: "Odbijeno",
  WITHDRAWN: "Povučeno",
};

const applicationStatusVariants: Record<
  ApplicationStatus,
  VariantProps<typeof badgeVariants>["variant"]
> = {
  APPLIED: "secondary",
  SCREENING: "outline",
  INTERVIEWING: "default",
  OFFER: "default",
  ACCEPTED: "default",
  REJECTED: "destructive",
  WITHDRAWN: "outline",
};

const roundStatusLabels: Record<InterviewRoundStatus, string> = {
  SCHEDULED: "Zakazano",
  IN_PROGRESS: "U toku",
  COMPLETED: "Završeno",
  CANCELLED: "Otkazano",
  NO_SHOW: "Nije se pojavio",
};

const roundStatusVariants: Record<
  InterviewRoundStatus,
  VariantProps<typeof badgeVariants>["variant"]
> = {
  SCHEDULED: "outline",
  IN_PROGRESS: "default",
  COMPLETED: "secondary",
  CANCELLED: "outline",
  NO_SHOW: "destructive",
};

export function getApplicationStatusLabel(status: ApplicationStatus) {
  return applicationStatusLabels[status];
}

export function getApplicationStatusVariant(status: ApplicationStatus) {
  return applicationStatusVariants[status];
}

export function getRoundStatusLabel(status: InterviewRoundStatus) {
  return roundStatusLabels[status];
}

export function getRoundStatusVariant(status: InterviewRoundStatus) {
  return roundStatusVariants[status];
}

export function formatApplicationDate(date: Date) {
  return new Intl.DateTimeFormat("sr-Latn-RS", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("sr-Latn-RS", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatDifficulty(difficulty: number) {
  return `${difficulty}/5`;
}

export function formatSalaryRange(min: number | null, max: number | null) {
  const formatter = new Intl.NumberFormat("sr-Latn-RS", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });

  if (min != null && max != null) {
    return `${formatter.format(min)} – ${formatter.format(max)}`;
  }

  if (min != null) {
    return `od ${formatter.format(min)}`;
  }

  if (max != null) {
    return `do ${formatter.format(max)}`;
  }

  return null;
}

export function abbreviateInterviewType(name: string) {
  const abbreviations: Record<string, string> = {
    "Phone Screen": "Phone",
    Technical: "Tech",
    "System Design": "Design",
    Behavioral: "Behavior",
    HR: "HR",
    "Take Home": "Take home",
  };

  return abbreviations[name] ?? name;
}

export function getCompletedRoundCount(
  rounds: Array<{ status: InterviewRoundStatus }>,
) {
  return rounds.filter((round) => round.status === "COMPLETED").length;
}

export function getNextRound(
  rounds: Array<{
    status: InterviewRoundStatus;
    interviewTypeName: string;
    scheduledAt: Date | null;
  }>,
) {
  const upcoming = rounds.find(
    (round) => round.status === "SCHEDULED" || round.status === "IN_PROGRESS",
  );

  return upcoming ?? null;
}
