import { Wallet } from "lucide-react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ApplicationStatusBadge } from "@/features/job-applications/components/application-status-badge";
import { InterviewRoundProgress } from "@/features/job-applications/components/interview-round-progress";
import {
  formatApplicationDate,
  formatSalaryRange,
} from "@/features/job-applications/lib/format";
import type { ApplicationListItem } from "@interwjuer/contracts";

type ApplicationCardProps = {
  application: ApplicationListItem;
};

export function ApplicationCard({ application }: ApplicationCardProps) {
  const salary = formatSalaryRange(
    application.salaryMin,
    application.salaryMax,
  );

  const metaItems = [
    application.sourceName,
    application.location,
    formatApplicationDate(application.applicationDate),
  ].filter(Boolean);

  return (
    <Link href={`/applications/${application.id}`} className="block">
      <Card className="transition-colors hover:bg-muted/20">
        <CardHeader className="gap-3 pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 space-y-1">
              <CardTitle className="text-xl">{application.company}</CardTitle>
              <CardDescription className="text-base text-foreground/80">
                {application.position}
              </CardDescription>
            </div>
            <ApplicationStatusBadge status={application.applicationStatus} />
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span>{metaItems.join(" · ")}</span>
            {salary ? (
              <span className="inline-flex items-center gap-1.5">
                <Wallet className="size-4 shrink-0" strokeWidth={2} />
                {salary}
              </span>
            ) : null}
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-4">
          <p className="mb-3 text-sm font-medium text-foreground">
            Intervju proces
          </p>
          <InterviewRoundProgress rounds={application.rounds} />
        </CardContent>
      </Card>
    </Link>
  );
}
