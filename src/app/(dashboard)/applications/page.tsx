import type { ApplicationStatus } from "@interwjuer/contracts";

import { ApplicationFilters } from "@/features/job-applications/components/application-filters";
import { ApplicationFormSheet } from "@/features/job-applications/components/application-form-sheet";
import { ApplicationList } from "@/features/job-applications/components/application-list";
import { applicationsApi } from "@/lib/api/applications";
import { referenceDataApi } from "@/lib/api/reference-data";

export const dynamic = "force-dynamic";

const APPLICATIONS_PAGE_SIZE = 12;

type ApplicationsPageProps = {
  searchParams: Promise<{
    search?: string;
    status?: string;
    applicationSourceId?: string;
    dateFrom?: string;
    dateTo?: string;
  }>;
};

export default async function ApplicationsPage({
  searchParams,
}: ApplicationsPageProps) {
  const { search, status, applicationSourceId, dateFrom, dateTo } =
    await searchParams;
  const hasActiveFilters = Boolean(
    search || status || applicationSourceId || dateFrom || dateTo,
  );
  const listOptions = {
    limit: APPLICATIONS_PAGE_SIZE,
    search,
    status: status as ApplicationStatus | undefined,
    applicationSourceId,
    dateFrom,
    dateTo,
  };

  const [applicationsPage, applicationSources] = await Promise.all([
    applicationsApi.list(listOptions),
    referenceDataApi.applicationSources(),
  ]);

  return (
    <main className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 overflow-x-hidden p-4 sm:gap-6 sm:p-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Prijave
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Pregled prijava, statusa i napretka kroz intervju proces.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          <ApplicationFormSheet
            mode="create"
            applicationSources={applicationSources}
          />
        </div>
      </header>

      <ApplicationFilters
        key={[search, status, applicationSourceId, dateFrom, dateTo].join("|")}
        applicationSources={applicationSources}
        search={search}
        status={status as ApplicationStatus | undefined}
        applicationSourceId={applicationSourceId}
        dateFrom={dateFrom}
        dateTo={dateTo}
      />

      <ApplicationList
        key={[search, status, applicationSourceId, dateFrom, dateTo].join("|")}
        applications={applicationsPage.items}
        hasActiveFilters={hasActiveFilters}
        nextCursor={applicationsPage.nextCursor}
        listOptions={listOptions}
      />
    </main>
  );
}
