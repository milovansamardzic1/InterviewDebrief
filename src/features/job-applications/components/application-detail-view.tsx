import { ArrowLeft, ExternalLink, Wallet } from "lucide-react";
import Link from "next/link";

import { ApplicationQuestionsByRound } from "@/features/job-applications/components/application-questions-by-round";
import { ApplicationStatusBadge } from "@/features/job-applications/components/application-status-badge";
import { InterviewRoundDetail } from "@/features/job-applications/components/interview-round-detail";
import { InterviewRoundProgress } from "@/features/job-applications/components/interview-round-progress";
import {
  formatApplicationDate,
  formatSalaryRange,
} from "@/features/job-applications/lib/format";
import type { ApplicationDetail } from "@interwjuer/contracts";
import type { ApplicationListRound } from "@interwjuer/contracts";

type ApplicationDetailViewProps = {
  application: ApplicationDetail;
};

function toProgressRounds(
  rounds: ApplicationDetail["rounds"],
): ApplicationListRound[] {
  return rounds.map((round) => ({
    id: round.id,
    sortOrder: round.sortOrder,
    status: round.status,
    scheduledAt: round.scheduledAt,
    interviewTypeName: round.interviewTypeName,
    questionCount: round.questions.length,
  }));
}

export function ApplicationDetailView({
  application,
}: ApplicationDetailViewProps) {
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
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
      <Link
        href="/applications"
        className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" strokeWidth={2} />
        Nazad na prijave
      </Link>

      <header className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight">
              {application.company}
            </h1>
            <p className="text-lg text-muted-foreground">
              {application.position}
            </p>
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
          {application.jobPostingUrl ? (
            <a
              href={application.jobPostingUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-primary hover:underline"
            >
              Oglas
              <ExternalLink className="size-3.5" strokeWidth={2} />
            </a>
          ) : null}
        </div>
      </header>

      {application.rejectionReason ? (
        <section className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
          <h2 className="text-sm font-medium text-destructive">
            Razlog odbijanja
          </h2>
          <p className="mt-1 text-sm whitespace-pre-wrap text-foreground/90">
            {application.rejectionReason}
          </p>
        </section>
      ) : null}

      {application.notes ? (
        <section className="rounded-xl border border-border bg-muted/20 p-4">
          <h2 className="text-sm font-medium text-foreground">Napomene</h2>
          <p className="mt-1 text-sm whitespace-pre-wrap text-muted-foreground">
            {application.notes}
          </p>
        </section>
      ) : null}

      {application.jobDescription ? (
        <section className="rounded-xl border border-border bg-muted/20 p-4">
          <h2 className="text-sm font-medium text-foreground">Opis pozicije</h2>
          <p className="mt-1 text-sm whitespace-pre-wrap text-muted-foreground">
            {application.jobDescription}
          </p>
        </section>
      ) : null}

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="mb-4 text-sm font-medium text-foreground">
          Intervju proces
        </h2>
        <InterviewRoundProgress rounds={toProgressRounds(application.rounds)} />

        {application.rounds.length > 0 ? (
          <nav
            aria-label="Brza navigacija do pitanja po rundama"
            className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4"
          >
            {application.rounds.map((round) => (
              <a
                key={round.id}
                href={`#round-${round.id}-questions`}
                className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
              >
                Runda {round.sortOrder}: {round.interviewTypeName}
                {round.questions.length > 0
                  ? ` (${round.questions.length})`
                  : ""}
              </a>
            ))}
          </nav>
        ) : null}
      </section>

      <ApplicationQuestionsByRound rounds={application.rounds} />

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Detalji rundi
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Napomene i skill evaluacije po rundi.
          </p>
        </div>

        {application.rounds.length === 0 ? (
          <div className="rounded-xl border border-dashed px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Nema evidentiranih intervju rundi za ovu prijavu.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {application.rounds.map((round) => (
              <InterviewRoundDetail key={round.id} round={round} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
