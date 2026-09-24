"use client";

import type { ApplicationSourceItem } from "@interwjuer/contracts";
import {
  ClipboardList,
  GraduationCap,
  CalendarDays,
  type LucideIcon,
  PieChart,
  Target,
} from "lucide-react";

import { MetricStrip } from "@/features/dashboard/components/metric-strip";
import { ApplicationFormSheet } from "@/features/job-applications/components/application-form-sheet";

function PlaceholderCard({
  icon: Icon,
  title,
  description,
  centered = false,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  centered?: boolean;
}) {
  return (
    <section className="flex h-full min-h-0 min-w-0 flex-col justify-center rounded-lg border border-dashed border-border bg-card/50 p-3">
      <div
        className={
          centered
            ? "flex flex-col items-center justify-center gap-2 text-center"
            : "flex items-start gap-3"
        }
      >
        <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
          <Icon className="size-4 text-muted-foreground" strokeWidth={2} />
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold">{title}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
    </section>
  );
}

type DashboardEmptyStateProps = {
  applicationSources: ApplicationSourceItem[];
};

export function DashboardEmptyState({
  applicationSources,
}: DashboardEmptyStateProps) {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2.5 lg:gap-3">
      <div className="shrink-0">
        <MetricStrip
          jobApplications={0}
          interviewRounds={0}
          questions={0}
          skillEvaluations={0}
        />
      </div>

      <div className="grid min-h-0 min-w-0 shrink gap-2.5 lg:grid-cols-2 lg:gap-3">
        <PlaceholderCard
          icon={ClipboardList}
          title="Status prijava"
          description="Kad dodaš prijave, ovde vidiš koliko ih je u svakom statusu."
        />
        <PlaceholderCard
          icon={CalendarDays}
          title="Sledeći intervju i aktivne"
          description="Zakazane runde i prijave u toku pojaviće se ovde."
        />
      </div>

      <section className="flex min-w-0 flex-col items-center justify-center gap-3 rounded-lg border border-border border-l-4 border-l-primary bg-card px-4 py-5 text-center sm:py-6">
        <div className="flex size-11 items-center justify-center rounded-full bg-primary/10">
          <ClipboardList className="size-5 text-primary" strokeWidth={2} />
        </div>
        <div className="max-w-md">
          <h2 className="text-base font-semibold sm:text-lg">
            Počni sa prvom prijavom
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Dashboard se puni kako beležiš intervjue: status, pitanja, slabosti
            i plan učenja. Prvi korak je jedna prijava.
          </p>
        </div>
        <div className="mt-1">
          <ApplicationFormSheet
            mode="create"
            applicationSources={applicationSources}
            redirectOnCreate="home"
          />
        </div>
      </section>

      <div className="grid min-h-0 min-w-0 flex-1 gap-2.5 lg:grid-cols-2 lg:gap-3">
        <PlaceholderCard
          icon={PieChart}
          title="Pitanja po temi"
          description="Udeo tema iz pitanja koja zabeležiš na intervjuima."
          centered
        />
        <PlaceholderCard
          icon={Target}
          title="Najslabije oblasti"
          description="Posle skill evaluacija vidiš gde treba da vežbaš."
          centered
        />
      </div>

      <p className="flex shrink-0 items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
        <GraduationCap className="size-3.5" strokeWidth={2} />
        Plan učenja se generiše automatski iz evaluacija.
      </p>
    </div>
  );
}
