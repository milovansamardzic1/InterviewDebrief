import type { DashboardStats } from "@interwjuer/contracts";

import { ActiveAndUpcoming } from "@/features/dashboard/components/active-and-upcoming";
import { GettingStartedChecklist } from "@/features/dashboard/components/getting-started-checklist";
import { MetricStrip } from "@/features/dashboard/components/metric-strip";
import { ANALYTICS_THRESHOLDS } from "@/features/dashboard/lib/dashboard-phase";
import type { GettingStartedActionContext } from "@/features/dashboard/lib/getting-started-actions";

type DashboardGettingStartedProps = {
  stats: DashboardStats;
  actionContext: GettingStartedActionContext | null;
};

export function DashboardGettingStarted({
  stats,
  actionContext,
}: DashboardGettingStartedProps) {
  const towardAnalytics = [
    {
      label: "Prijave",
      current: stats.jobApplications,
      target: ANALYTICS_THRESHOLDS.applications,
    },
    {
      label: "Pitanja",
      current: stats.questions,
      target: ANALYTICS_THRESHOLDS.questions,
    },
    {
      label: "Evaluacije",
      current: stats.skillEvaluations,
      target: ANALYTICS_THRESHOLDS.skillEvaluations,
    },
  ];

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

      <div className="grid min-h-0 min-w-0 flex-1 gap-2.5 lg:grid-cols-2 lg:gap-3 lg:overflow-hidden">
        <section className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-lg border border-border border-l-4 border-l-primary bg-card p-3 sm:p-4">
          <div className="shrink-0">
            <h2 className="text-sm font-semibold sm:text-base">
              Sledeći koraci
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
              Klik otvara formu direktno — bez lutanja po stranicama.
            </p>
          </div>

          <GettingStartedChecklist
            stats={stats}
            actionContext={actionContext}
          />
        </section>

        <div className="flex min-h-0 min-w-0 flex-col gap-2.5 lg:gap-3 lg:overflow-hidden">
          {stats.upcomingRound || stats.activeApplications.length > 0 ? (
            <ActiveAndUpcoming
              activeApplications={stats.activeApplications}
              upcomingRound={stats.upcomingRound}
            />
          ) : (
            <section className="rounded-lg border border-dashed border-border bg-card/50 p-3 sm:p-4">
              <h2 className="text-sm font-semibold">Sledeći intervju</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Kad dodaš rundu sa datumom, pojaviće se ovde.
              </p>
            </section>
          )}

          <section className="min-w-0 flex-1 rounded-lg border border-dashed border-border bg-card/60 p-3 sm:p-4">
            <h2 className="text-sm font-semibold">Kad se pojavi analitika</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Status, teme i slabosti čim dostigneš bilo koji od ovih pragova:
            </p>
            <ul className="mt-3 space-y-2">
              {towardAnalytics.map((item) => {
                const met = item.current >= item.target;
                const width = Math.min(
                  100,
                  Math.round((item.current / item.target) * 100),
                );

                return (
                  <li key={item.label} className="min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className="truncate">{item.label}</span>
                      <span className="shrink-0 tabular-nums text-muted-foreground">
                        {item.current}/{item.target}
                        {met ? " ✓" : ""}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">
              Dovoljan je jedan ispunjen prag (npr. 8 pitanja i sa jednom
              prijavom).
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
