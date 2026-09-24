import { Wallet } from "lucide-react";
import Link from "next/link";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ApplicationStatusBadge } from "@/features/job-applications/components/application-status-badge";
import {
  formatApplicationDate,
  formatSalaryRange,
  getCompletedRoundCount,
  getNextRound,
} from "@/features/job-applications/lib/format";
import type { ApplicationListItem } from "@interwjuer/contracts";

type ApplicationCardProps = {
  application: ApplicationListItem;
};

export function ApplicationCard({ application }: ApplicationCardProps) {
  const salary = formatSalaryRange(
    application.salaryMin,
    application.salaryMax,
  );
  const completed = getCompletedRoundCount(application.rounds);
  const total = application.rounds.length;
  const nextRound = getNextRound(application.rounds);
  const progressRatio = total > 0 ? completed / total : 0;

  return (
    <Link
      href={`/applications/${application.id}`}
      className="block h-full min-w-0"
    >
      <Card className="flex h-full flex-col transition-colors hover:bg-muted/30">
        <CardHeader className="gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <CardTitle className="truncate text-lg tracking-tight">
                {application.company}
              </CardTitle>
              <CardDescription className="line-clamp-2 text-sm">
                {application.position}
              </CardDescription>
            </div>
            <ApplicationStatusBadge status={application.applicationStatus} />
          </div>

          <dl className="grid gap-1.5 text-sm">
            <div className="flex min-w-0 items-baseline justify-between gap-3">
              <dt className="shrink-0 text-muted-foreground">Datum</dt>
              <dd className="truncate text-right">
                {formatApplicationDate(application.applicationDate)}
              </dd>
            </div>
            <div className="flex min-w-0 items-baseline justify-between gap-3">
              <dt className="shrink-0 text-muted-foreground">Izvor</dt>
              <dd className="truncate text-right">{application.sourceName}</dd>
            </div>
            {application.location ? (
              <div className="flex min-w-0 items-baseline justify-between gap-3">
                <dt className="shrink-0 text-muted-foreground">Lokacija</dt>
                <dd className="truncate text-right">{application.location}</dd>
              </div>
            ) : null}
            {salary ? (
              <div className="flex min-w-0 items-baseline justify-between gap-3">
                <dt className="inline-flex shrink-0 items-center gap-1 text-muted-foreground">
                  <Wallet className="size-3.5" strokeWidth={2} />
                  Plata
                </dt>
                <dd className="truncate text-right">{salary}</dd>
              </div>
            ) : null}
          </dl>

          <div className="space-y-2 border-t border-border pt-3">
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="text-muted-foreground">Runde</span>
              <span className="font-medium tabular-nums">
                {total > 0 ? `${completed}/${total}` : "—"}
              </span>
            </div>
            {total > 0 ? (
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${progressRatio * 100}%` }}
                />
              </div>
            ) : null}
            <p className="truncate text-sm text-muted-foreground">
              {nextRound
                ? `Sledeće: ${nextRound.interviewTypeName}`
                : total > 0 && completed === total
                  ? "Proces završen"
                  : total === 0
                    ? "Nema evidentiranih rundi"
                    : null}
            </p>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
