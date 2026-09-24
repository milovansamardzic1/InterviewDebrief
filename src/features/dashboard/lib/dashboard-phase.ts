import type { DashboardStats } from "@interwjuer/contracts";

export type DashboardPhase = "onboarding" | "getting_started" | "analytics";

/** Enough signal for charts / breakdown panels to feel useful. */
export const ANALYTICS_THRESHOLDS = {
  applications: 3,
  questions: 8,
  skillEvaluations: 3,
} as const;

type PhaseInput = Pick<
  DashboardStats,
  "jobApplications" | "interviewRounds" | "questions" | "skillEvaluations"
>;

export function resolveDashboardPhase(stats: PhaseInput): DashboardPhase {
  if (stats.jobApplications === 0) {
    return "onboarding";
  }

  const readyForAnalytics =
    stats.jobApplications >= ANALYTICS_THRESHOLDS.applications ||
    stats.questions >= ANALYTICS_THRESHOLDS.questions ||
    stats.skillEvaluations >= ANALYTICS_THRESHOLDS.skillEvaluations;

  if (readyForAnalytics) {
    return "analytics";
  }

  return "getting_started";
}

export type GettingStartedStepId =
  | "application"
  | "round"
  | "questions"
  | "evaluations";

export type GettingStartedStep = {
  id: GettingStartedStepId;
  title: string;
  description: string;
  done: boolean;
  href: string;
};

/**
 * Checklist for the early-stage home. Steps unlock in order of the product
 * loop: application → round → questions → skill evaluations.
 */
export function buildGettingStartedSteps(
  stats: PhaseInput,
  primaryApplicationId: string | null,
): GettingStartedStep[] {
  const appHref = primaryApplicationId
    ? `/applications/${primaryApplicationId}`
    : "/applications";

  return [
    {
      id: "application",
      title: "Dodaj prijavu",
      description: "Kompanija, pozicija i status.",
      done: stats.jobApplications > 0,
      href: "/applications",
    },
    {
      id: "round",
      title: "Dodaj intervju rundu",
      description: "Zakaži ili zabeleži technical / HR rundu.",
      done: stats.interviewRounds > 0,
      href: appHref,
    },
    {
      id: "questions",
      title: "Zabeleži pitanja",
      description: "Šta su te pitali — po temi.",
      done: stats.questions > 0,
      href: appHref,
    },
    {
      id: "evaluations",
      title: "Oceni veštine",
      description: "Posle runde — da bi nastao plan učenja.",
      done: stats.skillEvaluations > 0,
      href: appHref,
    },
  ];
}
