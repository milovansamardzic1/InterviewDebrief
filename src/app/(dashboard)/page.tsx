import { StatsOverview } from "@/features/dashboard/components/stats-overview";
import { resolveDashboardPhase } from "@/features/dashboard/lib/dashboard-phase";
import type { GettingStartedActionContext } from "@/features/dashboard/lib/getting-started-actions";
import { applicationsApi } from "@/lib/api/applications";
import { dashboardApi } from "@/lib/api/dashboard";
import { learningPlanApi } from "@/lib/api/learning-plan";
import { learningTasksApi } from "@/lib/api/learning-tasks";
import { referenceDataApi } from "@/lib/api/reference-data";
import type { DashboardStats } from "@interwjuer/contracts";

export const dynamic = "force-dynamic";

async function loadActionContext(
  stats: DashboardStats,
): Promise<GettingStartedActionContext | null> {
  const phase = resolveDashboardPhase(stats);

  if (phase !== "onboarding" && phase !== "getting_started") {
    return null;
  }

  const [applicationSources, interviewTypes, skills] = await Promise.all([
    referenceDataApi.applicationSources(),
    referenceDataApi.interviewTypes(),
    referenceDataApi.skills(),
  ]);

  if (phase === "onboarding") {
    return {
      applicationSources,
      interviewTypes,
      skills,
      primaryApplication: null,
    };
  }

  let primaryApplicationId =
    stats.activeApplications[0]?.id ??
    stats.upcomingRound?.applicationId ??
    null;

  if (!primaryApplicationId) {
    const listed = await applicationsApi.list();
    primaryApplicationId = listed.items[0]?.id ?? null;
  }

  const primaryApplication = primaryApplicationId
    ? await applicationsApi.byId(primaryApplicationId)
    : null;

  return {
    applicationSources,
    interviewTypes,
    skills,
    primaryApplication,
  };
}

export default async function Home() {
  const [stats, learningPlan, learningTasks] = await Promise.all([
    dashboardApi.stats(),
    learningPlanApi.get(),
    learningTasksApi.list(),
  ]);
  const actionContext = await loadActionContext(stats);

  return (
    <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden p-3 lg:h-[calc(100svh-3.5rem)] lg:overflow-hidden lg:p-4">
      <header className="mb-3 shrink-0">
        <h1 className="text-lg font-semibold lg:text-xl">Dashboard</h1>
      </header>

      <StatsOverview
        stats={stats}
        learningPlanItems={learningPlan.items}
        learningTasks={learningTasks.items}
        actionContext={actionContext}
      />
    </main>
  );
}
