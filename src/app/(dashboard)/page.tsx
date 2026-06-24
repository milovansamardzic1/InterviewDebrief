import { StatsOverview } from "@/features/dashboard/components/stats-overview";
import { dashboardApi } from "@/lib/api/dashboard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const stats = await dashboardApi.stats();

  return (
    <main className="flex min-h-0 flex-1 flex-col gap-6 p-6">
      <header className="flex shrink-0 items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
      </header>

      <StatsOverview stats={stats} />
    </main>
  );
}
