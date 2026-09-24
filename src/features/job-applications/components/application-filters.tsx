"use client";

import type {
  ApplicationSourceItem,
  ApplicationStatus,
} from "@interwjuer/contracts";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getApplicationStatusLabel } from "@/features/job-applications/lib/format";

const APPLICATION_STATUSES: ApplicationStatus[] = [
  "APPLIED",
  "SCREENING",
  "INTERVIEWING",
  "OFFER",
  "ACCEPTED",
  "REJECTED",
  "WITHDRAWN",
];

const ALL_VALUE = "__all__";
const SEARCH_DEBOUNCE_MS = 300;

type FilterValues = {
  search: string;
  status: string;
  applicationSourceId: string;
  dateFrom: string;
  dateTo: string;
};

type ApplicationFiltersProps = {
  applicationSources: ApplicationSourceItem[];
  search?: string;
  status?: ApplicationStatus;
  applicationSourceId?: string;
  dateFrom?: string;
  dateTo?: string;
};

function buildApplicationsHref(filters: FilterValues) {
  const params = new URLSearchParams();

  if (filters.search.trim()) {
    params.set("search", filters.search.trim());
  }
  if (filters.status && filters.status !== ALL_VALUE) {
    params.set("status", filters.status);
  }
  if (
    filters.applicationSourceId &&
    filters.applicationSourceId !== ALL_VALUE
  ) {
    params.set("applicationSourceId", filters.applicationSourceId);
  }
  if (filters.dateFrom) {
    params.set("dateFrom", filters.dateFrom);
  }
  if (filters.dateTo) {
    params.set("dateTo", filters.dateTo);
  }

  const query = params.toString();
  return query ? `/applications?${query}` : "/applications";
}

export function ApplicationFilters({
  applicationSources,
  search: initialSearch = "",
  status: initialStatus,
  applicationSourceId: initialSourceId,
  dateFrom: initialDateFrom = "",
  dateTo: initialDateTo = "",
}: ApplicationFiltersProps) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState(initialStatus ?? ALL_VALUE);
  const [applicationSourceId, setApplicationSourceId] = useState(
    initialSourceId ?? ALL_VALUE,
  );
  const [dateFrom, setDateFrom] = useState(initialDateFrom);
  const [dateTo, setDateTo] = useState(initialDateTo);

  const statusItems = useMemo(
    () => ({
      [ALL_VALUE]: "Svi statusi",
      ...Object.fromEntries(
        APPLICATION_STATUSES.map((value) => [
          value,
          getApplicationStatusLabel(value),
        ]),
      ),
    }),
    [],
  );

  const sourceItems = useMemo(
    () => ({
      [ALL_VALUE]: "Svi izvori",
      ...Object.fromEntries(
        applicationSources.map((source) => [source.id, source.name]),
      ),
    }),
    [applicationSources],
  );

  const hasActiveFilters = Boolean(
    search.trim() ||
    status !== ALL_VALUE ||
    applicationSourceId !== ALL_VALUE ||
    dateFrom ||
    dateTo,
  );

  const navigateToFilters = useCallback(
    (next: FilterValues) => {
      router.push(buildApplicationsHref(next), { scroll: false });
    },
    [router],
  );

  useEffect(() => {
    if (search.trim() === initialSearch.trim()) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      navigateToFilters({
        search,
        status,
        applicationSourceId,
        dateFrom,
        dateTo,
      });
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [
    search,
    status,
    applicationSourceId,
    dateFrom,
    dateTo,
    initialSearch,
    navigateToFilters,
  ]);

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:min-w-48">
        <Label htmlFor="search" className="text-muted-foreground">
          Pretraga
        </Label>
        <Input
          id="search"
          type="text"
          placeholder="Kompanija ili pozicija..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5 sm:w-48">
        <Label htmlFor="status" className="text-muted-foreground">
          Status
        </Label>
        <Select
          value={status}
          onValueChange={(value) => {
            if (typeof value !== "string") {
              return;
            }
            setStatus(value);
            navigateToFilters({
              search,
              status: value,
              applicationSourceId,
              dateFrom,
              dateTo,
            });
          }}
          items={statusItems}
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="Svi statusi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>Svi statusi</SelectItem>
            {APPLICATION_STATUSES.map((value) => (
              <SelectItem key={value} value={value}>
                {getApplicationStatusLabel(value)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5 sm:w-48">
        <Label htmlFor="applicationSourceId" className="text-muted-foreground">
          Izvor
        </Label>
        <Select
          value={applicationSourceId}
          onValueChange={(value) => {
            if (typeof value !== "string") {
              return;
            }
            setApplicationSourceId(value);
            navigateToFilters({
              search,
              status,
              applicationSourceId: value,
              dateFrom,
              dateTo,
            });
          }}
          items={sourceItems}
        >
          <SelectTrigger id="applicationSourceId">
            <SelectValue placeholder="Svi izvori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>Svi izvori</SelectItem>
            {applicationSources.map((source) => (
              <SelectItem key={source.id} value={source.id}>
                {source.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5 sm:w-40">
        <Label htmlFor="dateFrom" className="text-muted-foreground">
          Od datuma
        </Label>
        <Input
          id="dateFrom"
          type="date"
          value={dateFrom}
          onChange={(event) => {
            const value = event.target.value;
            setDateFrom(value);
            navigateToFilters({
              search,
              status,
              applicationSourceId,
              dateFrom: value,
              dateTo,
            });
          }}
        />
      </div>

      <div className="flex flex-col gap-1.5 sm:w-40">
        <Label htmlFor="dateTo" className="text-muted-foreground">
          Do datuma
        </Label>
        <Input
          id="dateTo"
          type="date"
          value={dateTo}
          onChange={(event) => {
            const value = event.target.value;
            setDateTo(value);
            navigateToFilters({
              search,
              status,
              applicationSourceId,
              dateFrom,
              dateTo: value,
            });
          }}
        />
      </div>

      {hasActiveFilters ? (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            nativeButton={false}
            render={<Link href="/applications" />}
          >
            Obriši filtere
          </Button>
        </div>
      ) : null}
    </div>
  );
}
