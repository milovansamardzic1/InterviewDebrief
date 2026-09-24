import type {
  DashboardActiveApplication,
  DashboardUpcomingRound,
} from "@interwjuer/contracts";
import Link from "next/link";

import {
  formatDateTime,
  getApplicationStatusLabel,
} from "@/features/job-applications/lib/format";

type ActiveAndUpcomingProps = {
  activeApplications: DashboardActiveApplication[];
  upcomingRound: DashboardUpcomingRound | null;
};

const ACTIVE_LIMIT = 3;

export function ActiveAndUpcoming({
  activeApplications,
  upcomingRound,
}: ActiveAndUpcomingProps) {
  const active = activeApplications.slice(0, ACTIVE_LIMIT);

  if (!upcomingRound && active.length === 0) {
    return null;
  }

  return (
    <section className="flex h-full min-h-0 min-w-0 flex-col gap-2.5 overflow-hidden rounded-lg border border-border bg-card p-3">
      {upcomingRound ? (
        <div className="min-w-0 shrink-0">
          <h2 className="text-sm font-semibold">Sledeći intervju</h2>
          <Link
            href={`/applications/${upcomingRound.applicationId}`}
            className="mt-1.5 block min-w-0 rounded-md border border-border bg-muted/50 px-2.5 py-1.5 transition-colors hover:bg-muted"
          >
            <p className="truncate text-sm font-medium">
              {upcomingRound.company}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {upcomingRound.position}
            </p>
            <p className="mt-0.5 truncate text-xs text-primary">
              {upcomingRound.roundType} ·{" "}
              {formatDateTime(new Date(upcomingRound.scheduledAt))}
            </p>
          </Link>
        </div>
      ) : null}

      {active.length > 0 ? (
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="flex shrink-0 items-center justify-between gap-2">
            <h2 className="text-sm font-semibold">Aktivne prijave</h2>
            <Link
              href="/applications"
              className="shrink-0 text-xs text-primary hover:underline"
            >
              Sve
            </Link>
          </div>
          <ul className="mt-1.5 min-h-0 flex-1 divide-y divide-border overflow-y-auto rounded-md border border-border">
            {active.map((application) => (
              <li key={application.id}>
                <Link
                  href={`/applications/${application.id}`}
                  className="flex items-center justify-between gap-3 px-2.5 py-1.5 text-sm transition-colors hover:bg-muted/50"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium">
                      {application.company}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {application.position}
                    </span>
                  </span>
                  <span
                    className="w-fit shrink-0 rounded-full px-2 py-0.5 text-xs font-medium"
                    style={{
                      backgroundColor:
                        "color-mix(in oklab, var(--primary) 12%, var(--card))",
                      color: "var(--primary)",
                    }}
                  >
                    {getApplicationStatusLabel(application.applicationStatus)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
