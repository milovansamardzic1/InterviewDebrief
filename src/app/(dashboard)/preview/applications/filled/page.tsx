import { ApplicationList } from "@/features/job-applications/components/application-list";
import { PreviewChrome } from "@/features/preview/components/preview-chrome";
import { DEMO_APPLICATIONS_FILLED } from "@/features/preview/lib/demo-fixtures";

export default function PreviewApplicationsFilledPage() {
  return (
    <PreviewChrome
      title="Prijave · Popunjena lista"
      description="Testni podaci: 3 prijave sa rundama."
    >
      <header className="mb-4 flex shrink-0 flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold sm:text-2xl">Prijave</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Pregled prijava, statusa i napretka kroz intervju proces.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Ukupno: {DEMO_APPLICATIONS_FILLED.length}
        </p>
      </header>
      <ApplicationList applications={DEMO_APPLICATIONS_FILLED} />
    </PreviewChrome>
  );
}
