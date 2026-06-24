import { Skeleton } from "@/components/ui/skeleton";

export default function ApplicationDetailLoading() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
      <Skeleton className="h-5 w-36" />

      <div className="space-y-3">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-80" />
      </div>

      <Skeleton className="h-28 w-full rounded-xl" />

      <div className="space-y-4">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    </main>
  );
}
