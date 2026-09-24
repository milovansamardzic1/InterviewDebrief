import { notFound } from "next/navigation";

import { PreviewChrome } from "@/features/preview/components/preview-chrome";
import {
  EMPTY_REJECTION_INSIGHTS,
  FILLED_REJECTION_INSIGHTS,
} from "@/features/preview/lib/demo-fixtures";
import { RejectionInsightsView } from "@/features/rejection-insights/components/rejection-insights-view";

type PageProps = {
  params: Promise<{ mode: string }>;
};

export default async function PreviewRejectionInsightsPage({
  params,
}: PageProps) {
  const { mode } = await params;

  if (mode !== "empty" && mode !== "filled") {
    notFound();
  }

  const insights =
    mode === "empty" ? EMPTY_REJECTION_INSIGHTS : FILLED_REJECTION_INSIGHTS;

  return (
    <PreviewChrome
      title={`Uvidi odbijanja · ${mode === "empty" ? "Empty" : "Filled"}`}
      description="Fixture podaci — ne diraju pravi nalog."
    >
      <header className="mb-4">
        <h1 className="text-xl font-semibold sm:text-2xl">Uvidi odbijanja</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Prepoznaj obrasce zbog kojih prijave ne prolaze dalje.
        </p>
      </header>
      <RejectionInsightsView insights={insights} />
    </PreviewChrome>
  );
}
