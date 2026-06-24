import { ClipboardList } from "lucide-react";

import { ApplicationCard } from "@/features/job-applications/components/application-card";
import type { ApplicationListItem } from "@interwjuer/contracts";

type ApplicationListProps = {
  applications: ApplicationListItem[];
};

export function ApplicationList({ applications }: ApplicationListProps) {
  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-16 text-center">
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
          <ClipboardList
            className="size-6 text-muted-foreground"
            strokeWidth={2}
          />
        </div>
        <h2 className="text-lg font-medium">Nema prijava</h2>
        <p className="mt-1 max-w-sm text-base text-muted-foreground">
          Kada dodaš prvu prijavu, ovde ćeš videti status, izvor i napredak kroz
          intervju runde.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {applications.map((application) => (
        <ApplicationCard key={application.id} application={application} />
      ))}
    </div>
  );
}
