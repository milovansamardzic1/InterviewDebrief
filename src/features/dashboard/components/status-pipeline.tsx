import type { ApplicationStatus, StatusCount } from "@interwjuer/contracts";
import Link from "next/link";

import { getApplicationStatusLabel } from "@/features/job-applications/lib/format";

type StatusPipelineProps = {
  breakdown: StatusCount[];
};

const PIPELINE_ORDER: ApplicationStatus[] = [
  "APPLIED",
  "SCREENING",
  "INTERVIEWING",
  "OFFER",
  "ACCEPTED",
  "REJECTED",
  "WITHDRAWN",
];

function statusBarColor(status: string): string {
  if (status === "REJECTED" || status === "WITHDRAWN") {
    return "var(--destructive)";
  }
  return "var(--primary)";
}

function isApplicationStatus(value: string): value is ApplicationStatus {
  return PIPELINE_ORDER.includes(value as ApplicationStatus);
}

export function StatusPipeline({ breakdown }: StatusPipelineProps) {
  if (breakdown.length === 0) {
    return null;
  }

  const countByStatus = new Map(
    breakdown.map((item) => [item.status, item.count]),
  );
  const total = breakdown.reduce((sum, item) => sum + item.count, 0);
  const ordered = PIPELINE_ORDER.filter((status) =>
    countByStatus.has(status),
  ).map((status) => ({
    status,
    count: countByStatus.get(status) ?? 0,
  }));

  return (
    <section className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-card p-3">
      <div className="flex shrink-0 items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">Status prijava</h2>
        {(countByStatus.get("REJECTED") ?? 0) > 0 ? (
          <Link
            href="/insights/rejections"
            className="text-xs text-primary hover:underline"
          >
            Uvidi
          </Link>
        ) : null}
      </div>
      <p className="mt-0.5 shrink-0 text-xs text-muted-foreground">
        Raspored prijava po statusu.
      </p>

      <ul className="mt-2 min-h-0 flex-1 space-y-1.5 overflow-y-auto">
        {ordered.map(({ status, count }) => {
          const widthPercent = total > 0 ? (count / total) * 100 : 0;
          const label = isApplicationStatus(status)
            ? getApplicationStatusLabel(status)
            : status;
          const color = statusBarColor(status);

          return (
            <li key={status} className="min-w-0 space-y-0.5">
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="min-w-0 truncate">{label}</span>
                <span className="shrink-0 font-medium tabular-nums">
                  {count}
                </span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${widthPercent}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
