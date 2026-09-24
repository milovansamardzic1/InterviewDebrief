import { ApplicationList } from "@/features/job-applications/components/application-list";
import { PreviewChrome } from "@/features/preview/components/preview-chrome";

export default function PreviewApplicationsEmptyPage() {
  return (
    <PreviewChrome
      title="Prijave · Prazna lista"
      description="Testni podaci: nema prijava."
    >
      <header className="mb-4 shrink-0">
        <h1 className="text-xl font-semibold sm:text-2xl">Prijave</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pregled prijava, statusa i napretka kroz intervju proces.
        </p>
      </header>
      <ApplicationList applications={[]} />
    </PreviewChrome>
  );
}
