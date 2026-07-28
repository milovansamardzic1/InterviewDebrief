import type {
  ApplicationSourceItem,
  ApplicationStatus,
} from "@interwjuer/contracts";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const nativeSelectClassName =
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30";

type ApplicationFiltersProps = {
  applicationSources: ApplicationSourceItem[];
  search?: string;
  status?: ApplicationStatus;
  applicationSourceId?: string;
  dateFrom?: string;
  dateTo?: string;
};

export function ApplicationFilters({
  applicationSources,
  search,
  status,
  applicationSourceId,
  dateFrom,
  dateTo,
}: ApplicationFiltersProps) {
  const hasActiveFilters = Boolean(
    search || status || applicationSourceId || dateFrom || dateTo,
  );

  return (
    <form
      action="/applications"
      className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:flex-wrap sm:items-end"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:min-w-48">
        <label htmlFor="search" className="text-sm text-muted-foreground">
          Pretraga
        </label>
        <Input
          id="search"
          type="text"
          name="search"
          placeholder="Kompanija ili pozicija..."
          defaultValue={search ?? ""}
        />
      </div>

      <div className="flex flex-col gap-1.5 sm:w-44">
        <label htmlFor="status" className="text-sm text-muted-foreground">
          Status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={status ?? ""}
          className={nativeSelectClassName}
        >
          <option value="">Svi statusi</option>
          {APPLICATION_STATUSES.map((value) => (
            <option key={value} value={value}>
              {getApplicationStatusLabel(value)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5 sm:w-44">
        <label
          htmlFor="applicationSourceId"
          className="text-sm text-muted-foreground"
        >
          Izvor
        </label>
        <select
          id="applicationSourceId"
          name="applicationSourceId"
          defaultValue={applicationSourceId ?? ""}
          className={nativeSelectClassName}
        >
          <option value="">Svi izvori</option>
          {applicationSources.map((source) => (
            <option key={source.id} value={source.id}>
              {source.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5 sm:w-40">
        <label htmlFor="dateFrom" className="text-sm text-muted-foreground">
          Od datuma
        </label>
        <Input
          id="dateFrom"
          type="date"
          name="dateFrom"
          defaultValue={dateFrom ?? ""}
        />
      </div>

      <div className="flex flex-col gap-1.5 sm:w-40">
        <label htmlFor="dateTo" className="text-sm text-muted-foreground">
          Do datuma
        </label>
        <Input
          id="dateTo"
          type="date"
          name="dateTo"
          defaultValue={dateTo ?? ""}
        />
      </div>

      <div className="flex items-center gap-2">
        <Button type="submit" variant="secondary">
          Filtriraj
        </Button>
        {hasActiveFilters ? (
          <Button variant="ghost" render={<Link href="/applications" />}>
            Obriši filtere
          </Button>
        ) : null}
      </div>
    </form>
  );
}
