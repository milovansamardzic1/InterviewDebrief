import { Skeleton } from "@/components/ui/skeleton";

export default function LearningLoading() {
  return (
    <main className="flex min-w-0 flex-1 flex-col gap-6 p-4 sm:p-6">
      <header className="space-y-2">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-5 w-full max-w-md" />
      </header>

      <div className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(23rem,0.7fr)]">
        <section className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-4 w-72" />
            </div>
            <Skeleton className="h-4 w-36" />
          </div>
          <div className="grid gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-32 w-full rounded-lg" />
            ))}
          </div>
        </section>

        <section className="space-y-4 xl:border-l xl:border-border xl:pl-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-4 w-56" />
          </div>
          <div className="grid gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-48 w-full rounded-lg" />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
