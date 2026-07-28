import type { ApplicationStatus } from "@interwjuer/contracts";

import { ApplicationFilters } from "@/features/job-applications/components/application-filters";
import { ApplicationFormSheet } from "@/features/job-applications/components/application-form-sheet";
import { ApplicationList } from "@/features/job-applications/components/application-list";
import { applicationsApi } from "@/lib/api/applications";
import { referenceDataApi } from "@/lib/api/reference-data";

export const dynamic = "force-dynamic";

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

  const [{ items: applications }, applicationSources] = await Promise.all([
    applicationsApi.list({
      search,
      status: status as ApplicationStatus | undefined,
      applicationSourceId,
      dateFrom,
      dateTo,
    }),
    referenceDataApi.applicationSources(),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Prijave</h1>
          <p className="mt-1 text-base text-muted-foreground">
            Pregled prijava, statusa i napretka kroz intervju proces.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Ukupno: {applications.length}
          </p>
          <ApplicationFormSheet
            mode="create"
            applicationSources={applicationSources}
          />
        </div>
      </header>

      <ApplicationFilters
        applicationSources={applicationSources}
        search={search}
        status={status as ApplicationStatus | undefined}
        applicationSourceId={applicationSourceId}
        dateFrom={dateFrom}
        dateTo={dateTo}
      />

      <ApplicationList
        applications={applications}
        hasActiveFilters={hasActiveFilters}
      />
    </main>
  );
}
