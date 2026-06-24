import type { ReactNode } from "react";
import { Calendar, Star } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RoundStatusBadge } from "@/features/job-applications/components/round-status-badge";
import { formatDateTime } from "@/features/job-applications/lib/format";
import type { ApplicationDetailRound } from "@interwjuer/contracts";

type InterviewRoundDetailProps = {
  round: ApplicationDetailRound;
};

function DetailSection({
  title,
  emptyMessage,
  children,
}: {
  title: string;
  emptyMessage: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h4 className="text-sm font-medium text-foreground">{title}</h4>
      {children ?? (
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      )}
    </section>
  );
}

export function InterviewRoundDetail({ round }: InterviewRoundDetailProps) {
  const scheduleItems = [
    round.scheduledAt
      ? { label: "Zakazano", value: formatDateTime(round.scheduledAt) }
      : null,
    round.completedAt
      ? { label: "Završeno", value: formatDateTime(round.completedAt) }
      : null,
  ].filter(Boolean);

  return (
    <Card>
      <CardHeader className="gap-3 pb-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <CardTitle className="text-lg">
              Runda {round.sortOrder} · {round.interviewTypeName}
            </CardTitle>
            {round.interviewTypeDescription ? (
              <CardDescription className="text-sm">
                {round.interviewTypeDescription}
              </CardDescription>
            ) : null}
          </div>
          <RoundStatusBadge status={round.status} />
        </div>

        {scheduleItems.length > 0 ? (
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {scheduleItems.map((item) =>
              item ? (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-1.5"
                >
                  <Calendar className="size-4 shrink-0" strokeWidth={2} />
                  {item.label}: {item.value}
                </span>
              ) : null,
            )}
          </div>
        ) : null}
      </CardHeader>

      <Separator />

      <CardContent className="space-y-6 pt-4">
        {round.notes ? (
          <section className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Napomene</h4>
            <p className="text-sm whitespace-pre-wrap text-muted-foreground">
              {round.notes}
            </p>
          </section>
        ) : null}

        {round.questions.length > 0 ? (
          <p className="text-sm text-muted-foreground">
            {round.questions.length}{" "}
            {round.questions.length === 1 ? "pitanje" : "pitanja"} ·{" "}
            <a
              href={`#round-${round.id}-questions`}
              className="font-medium text-primary hover:underline"
            >
              Pogledaj pitanja
            </a>
          </p>
        ) : null}

        <DetailSection
          title={`Skill evaluacije (${round.skillEvaluations.length})`}
          emptyMessage="Nema skill evaluacija za ovu rundu."
        >
          {round.skillEvaluations.length > 0 ? (
            <ul className="grid gap-3 sm:grid-cols-2">
              {round.skillEvaluations.map((evaluation) => (
                <li
                  key={evaluation.id}
                  className="rounded-lg border border-border bg-muted/20 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {evaluation.skillName}
                      </p>
                      {evaluation.skillCategory ? (
                        <p className="text-xs text-muted-foreground">
                          {evaluation.skillCategory}
                        </p>
                      ) : null}
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-background px-2 py-0.5 text-xs font-medium text-foreground ring-1 ring-border">
                      <Star className="size-3" strokeWidth={2} />
                      {evaluation.score}/5
                    </span>
                  </div>
                  {evaluation.notes ? (
                    <p className="mt-2 text-sm whitespace-pre-wrap text-muted-foreground">
                      {evaluation.notes}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}
        </DetailSection>
      </CardContent>
    </Card>
  );
}
