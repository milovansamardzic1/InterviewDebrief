import { ApplicationList } from "@/features/job-applications/components/application-list";
import { applicationsApi } from "@/lib/api/applications";

export const dynamic = "force-dynamic";

export default async function ApplicationsPage() {
  const { items: applications } = await applicationsApi.list();

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Prijave</h1>
          <p className="mt-1 text-base text-muted-foreground">
            Pregled prijava, statusa i napretka kroz intervju proces.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Ukupno: {applications.length}
        </p>
      </header>

      <ApplicationList applications={applications} />
    </main>
  );
}
