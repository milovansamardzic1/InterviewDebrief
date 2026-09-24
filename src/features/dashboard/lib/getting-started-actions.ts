import type {
  ApplicationDetail,
  ApplicationSourceItem,
  InterviewTypeItem,
  SkillItem,
} from "@interwjuer/contracts";

/** Reference + primary app detail needed to open create sheets from the home checklist. */
export type GettingStartedActionContext = {
  applicationSources: ApplicationSourceItem[];
  interviewTypes: InterviewTypeItem[];
  skills: SkillItem[];
  primaryApplication: ApplicationDetail | null;
};

export function pickTargetRoundId(
  application: ApplicationDetail | null,
  upcomingRoundId: string | null,
): string | null {
  if (!application || application.rounds.length === 0) {
    return null;
  }

  if (
    upcomingRoundId &&
    application.rounds.some((round) => round.id === upcomingRoundId)
  ) {
    return upcomingRoundId;
  }

  const sorted = [...application.rounds].sort(
    (left, right) => right.sortOrder - left.sortOrder,
  );

  return sorted[0]?.id ?? null;
}
