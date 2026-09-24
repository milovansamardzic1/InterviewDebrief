import { RejectionInsightsView } from "@/features/rejection-insights/components/rejection-insights-view";
import { rejectionInsightsApi } from "@/lib/api/rejection-insights";

export const dynamic = "force-dynamic";

export default async function RejectionInsightsPage() {
  const insights = await rejectionInsightsApi.get();

  return (
    <main className="flex min-w-0 flex-1 flex-col gap-6 p-4 sm:p-6">
      <header>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Uvidi odbijanja
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Prepoznaj obrasce zbog kojih prijave ne prolaze dalje.
        </p>
      </header>

      <RejectionInsightsView insights={insights} />
    </main>
  );
}
