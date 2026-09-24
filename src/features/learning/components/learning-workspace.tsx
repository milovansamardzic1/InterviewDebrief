import type { LearningPlanItem, LearningTask } from "@interwjuer/contracts";

import { LearningPlanView } from "@/features/learning/components/learning-plan-view";
import { LearningTaskList } from "@/features/learning/components/learning-task-list";

type LearningWorkspaceProps = {
  planItems: LearningPlanItem[];
  tasks: LearningTask[];
};

export function LearningWorkspace({
  planItems,
  tasks,
}: LearningWorkspaceProps) {
  const activeTaskCount = tasks.filter(
    (task) => task.status !== "COMPLETED",
  ).length;
  const completedTaskCount = tasks.length - activeTaskCount;

  return (
    <>
      <header>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Učenje
        </h1>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground sm:text-base">
          Pretvori uvide sa intervjua u konkretne zadatke i prati napredak.
        </p>
      </header>

      <div className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(23rem,0.7fr)]">
        <section aria-labelledby="learning-tasks-heading" className="space-y-4">
          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2
                id="learning-tasks-heading"
                className="text-lg font-semibold tracking-tight"
              >
                Moji zadaci
              </h2>
              <p className="text-sm text-muted-foreground">
                Aktivni: {activeTaskCount} · Završeni: {completedTaskCount}
              </p>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Planirani koraci za ciljano unapređivanje veština.
            </p>
          </div>
          <LearningTaskList tasks={tasks} />
        </section>

        <aside
          aria-labelledby="learning-plan-heading"
          className="min-w-0 space-y-4 xl:border-l xl:border-border xl:pl-6"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <h2
                id="learning-plan-heading"
                className="text-lg font-semibold tracking-tight"
              >
                Preporučeni fokusi
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Najslabije evaluirane veštine.
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              {planItems.length} preporuka
            </p>
          </div>
          <LearningPlanView items={planItems} />
        </aside>
      </div>
    </>
  );
}
