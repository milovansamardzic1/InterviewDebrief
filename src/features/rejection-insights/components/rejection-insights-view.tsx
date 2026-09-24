import type { RejectionInsightsResponse } from "@interwjuer/contracts";
import { ClipboardX } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getRejectionCategoryLabel } from "@/features/rejection-insights/lib/rejection-categories";

type RejectionInsightsViewProps = {
  insights: RejectionInsightsResponse;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("sr-Latn-RS", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function RejectionInsightsView({
  insights,
}: RejectionInsightsViewProps) {
  if (insights.rejectedCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-16 text-center">
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
          <ClipboardX
            className="size-6 text-muted-foreground"
            strokeWidth={2}
          />
        </div>
        <h2 className="text-lg font-medium">Još nema odbijenih prijava</h2>
        <p className="mt-1 max-w-sm text-base text-muted-foreground">
          Kada označiš prijavu kao odbijenu i izabereš kategoriju, ovde ćeš
          videti obrasce.
        </p>
        <Button
          className="mt-6"
          variant="outline"
          nativeButton={false}
          render={<Link href="/applications" />}
        >
          Idi na prijave
        </Button>
      </div>
    );
  }

  const coverage = Math.round(
    (insights.categorizedCount / insights.rejectedCount) * 100,
  );

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <section className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-semibold">Razlozi odbijanja</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Pouzdan breakdown po izabranoj kategoriji.
            </p>
          </div>
          <span className="text-sm font-medium tabular-nums">{coverage}%</span>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${coverage}%` }}
          />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Kategorizovano {insights.categorizedCount}/{insights.rejectedCount}
        </p>

        <ul className="mt-5 space-y-3">
          {insights.categoryBreakdown.map((item) => {
            const share = Math.round(
              (item.count / insights.rejectedCount) * 100,
            );
            return (
              <li key={item.category ?? "uncategorized"} className="space-y-1">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate">
                    {getRejectionCategoryLabel(item.category)}
                  </span>
                  <span className="shrink-0 tabular-nums text-muted-foreground">
                    {item.count} ({share}%)
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${share}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold">Poslednja odbijanja</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Detalji koje si zabeležio uz prijave.
            </p>
          </div>
          <Link
            href="/applications?status=REJECTED"
            className="shrink-0 text-sm text-primary hover:underline"
          >
            Sve prijave
          </Link>
        </div>

        <ul className="mt-4 divide-y divide-border overflow-hidden rounded-md border border-border">
          {insights.recentRejections.map((item) => (
            <li key={item.applicationId}>
              <Link
                href={`/applications/${item.applicationId}`}
                className="block px-3 py-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {item.company} · {item.position}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {getRejectionCategoryLabel(item.category)} ·{" "}
                      {formatDate(item.applicationDate)}
                    </p>
                  </div>
                </div>
                {item.reason ? (
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {item.reason}
                  </p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
