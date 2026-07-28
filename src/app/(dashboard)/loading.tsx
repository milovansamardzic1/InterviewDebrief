import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <main className="flex min-h-0 flex-1 flex-col gap-6 p-6">
      <header className="flex shrink-0 items-center justify-between">
        <Skeleton className="h-8 w-40" />
      </header>

      <div className="flex flex-col gap-8">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="rounded-lg border border-border bg-card p-5"
            >
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-3 h-9 w-14" />
            </div>
          ))}
        </section>

        <Skeleton className="h-48 w-full rounded-lg" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    </main>
  );
}
