"use client";

import { ClipboardList, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { loadMoreApplicationsAction } from "@/features/job-applications/actions/application-pagination";
import { ApplicationCard } from "@/features/job-applications/components/application-card";
import type { ListApplicationsOptions } from "@/lib/api/applications";
import type { ApplicationListItem } from "@interwjuer/contracts";

type ApplicationListProps = {
  applications: ApplicationListItem[];
  hasActiveFilters?: boolean;
  nextCursor?: string | null;
  listOptions?: Omit<ListApplicationsOptions, "cursor">;
};

export function ApplicationList({
  applications,
  hasActiveFilters = false,
  nextCursor: initialNextCursor = null,
  listOptions = {},
}: ApplicationListProps) {
  const [items, setItems] = useState(applications);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function loadMore() {
    if (!nextCursor || isPending) {
      return;
    }

    const cursor = nextCursor;
    setError(null);
    startTransition(async () => {
      const result = await loadMoreApplicationsAction({
        ...listOptions,
        cursor,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      setItems((current) => {
        const existingIds = new Set(current.map((item) => item.id));
        return [
          ...current,
          ...result.page.items.filter((item) => !existingIds.has(item.id)),
        ];
      });
      setNextCursor(result.page.nextCursor);
    });
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-16 text-center">
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
          <ClipboardList
            className="size-6 text-muted-foreground"
            strokeWidth={2}
          />
        </div>
        <h2 className="text-lg font-medium">
          {hasActiveFilters
            ? "Nema prijava koje odgovaraju filterima"
            : "Nema prijava"}
        </h2>
        <p className="mt-1 max-w-sm text-base text-muted-foreground">
          {hasActiveFilters
            ? "Probaj druge filtere ili ih obriši da vidiš sve prijave."
            : "Kada dodaš prvu prijavu, ovde ćeš videti status, izvor i napredak kroz intervju runde."}
        </p>
        {hasActiveFilters ? (
          <Button
            variant="ghost"
            className="mt-4"
            nativeButton={false}
            render={<Link href="/applications" />}
          >
            Obriši filtere
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
        {items.map((application) => (
          <ApplicationCard key={application.id} application={application} />
        ))}
      </div>

      <div className="flex flex-col items-center gap-2">
        <p className="text-sm text-muted-foreground">
          Prikazano: {items.length}
        </p>
        {nextCursor && !error ? (
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={loadMore}
          >
            {isPending ? (
              <LoaderCircle className="animate-spin" aria-hidden="true" />
            ) : null}
            {isPending ? "Učitavanje..." : "Učitaj još"}
          </Button>
        ) : null}
        {error ? (
          <div className="flex flex-col items-center gap-1 text-center">
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isPending}
              onClick={loadMore}
            >
              Pokušaj ponovo
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
