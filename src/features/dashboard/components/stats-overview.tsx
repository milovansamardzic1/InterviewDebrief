import type {
  DashboardStats,
  LearningPlanItem,
  LearningTask,
} from "@interwjuer/contracts";

import { ActiveAndUpcoming } from "@/features/dashboard/components/active-and-upcoming";
import { DashboardEmptyState } from "@/features/dashboard/components/dashboard-empty-state";
import { DashboardGettingStarted } from "@/features/dashboard/components/dashboard-getting-started";
import { LearningPreview } from "@/features/dashboard/components/learning-preview";
import { LearningTasksPreview } from "@/features/dashboard/components/learning-tasks-preview";
import { MetricStrip } from "@/features/dashboard/components/metric-strip";
import { QuestionsByTopic } from "@/features/dashboard/components/questions-by-topic";
import { StatusPipeline } from "@/features/dashboard/components/status-pipeline";
import { WeakSkillsPreview } from "@/features/dashboard/components/weak-skills-preview";
import { resolveDashboardPhase } from "@/features/dashboard/lib/dashboard-phase";
import type { GettingStartedActionContext } from "@/features/dashboard/lib/getting-started-actions";

type StatsOverviewProps = {
  stats: DashboardStats;
  learningPlanItems: LearningPlanItem[];
  learningTasks: LearningTask[];
  actionContext: GettingStartedActionContext | null;
};

export function StatsOverview({
  stats,
  learningPlanItems,
  learningTasks,
  actionContext,
}: StatsOverviewProps) {
  const phase = resolveDashboardPhase(stats);

  if (phase === "onboarding") {
    return (
      <DashboardEmptyState
        applicationSources={actionContext?.applicationSources ?? []}
      />
    );
  }

  if (phase === "getting_started") {
    return (
      <DashboardGettingStarted stats={stats} actionContext={actionContext} />
    );
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2.5 lg:gap-3">
      <div className="shrink-0">
        <MetricStrip
          jobApplications={stats.jobApplications}
          interviewRounds={stats.interviewRounds}
          questions={stats.questions}
          skillEvaluations={stats.skillEvaluations}
        />
      </div>

      <div className="grid min-h-0 min-w-0 shrink gap-2.5 lg:grid-cols-2 lg:gap-3 lg:overflow-hidden">
        <StatusPipeline breakdown={stats.statusBreakdown} />
        <ActiveAndUpcoming
          activeApplications={stats.activeApplications}
          upcomingRound={stats.upcomingRound}
        />
      </div>

      <div className="min-h-0 shrink">
        {learningTasks.length > 0 ? (
          <LearningTasksPreview tasks={learningTasks} />
        ) : (
          <LearningPreview items={learningPlanItems} />
        )}
      </div>

      <div className="grid min-h-0 min-w-0 flex-1 gap-2.5 lg:grid-cols-2 lg:gap-3 lg:overflow-hidden">
        <QuestionsByTopic topics={stats.questionsByTopic} />
        <WeakSkillsPreview weakSkills={stats.weakSkills} />
      </div>
    </div>
  );
}
