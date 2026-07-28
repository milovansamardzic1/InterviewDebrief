import { HelpCircle } from "lucide-react";

import { RoundStatusBadge } from "@/features/job-applications/components/round-status-badge";
import { QuestionCard } from "@/features/job-applications/components/question-card";
import { QuestionFormSheet } from "@/features/job-applications/components/question-form-sheet";
import { DeleteQuestionButton } from "@/features/job-applications/components/delete-question-button";
import { formatDateTime } from "@/features/job-applications/lib/format";
import type { ApplicationDetailRound } from "@interwjuer/contracts";

type RoundQuestionsListProps = {
  applicationId: string;
  round: ApplicationDetailRound;
};

export function RoundQuestionsList({
  applicationId,
  round,
}: RoundQuestionsListProps) {
  const roundLabel = `Runda ${round.sortOrder} · ${round.interviewTypeName}`;

  return (
    <section
      id={`round-${round.id}-questions`}
      className="scroll-mt-24 rounded-xl border border-border bg-card"
    >
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-4">
        <div className="min-w-0 space-y-1">
          <h3 className="text-base font-semibold text-foreground">
            {roundLabel}
          </h3>
          {round.scheduledAt ? (
            <p className="text-sm text-muted-foreground">
              {formatDateTime(round.scheduledAt)}
            </p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <RoundStatusBadge status={round.status} />
          <QuestionFormSheet
            mode="create"
            applicationId={applicationId}
            roundId={round.id}
          />
        </div>
      </header>

      <div className="p-5">
        {round.questions.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-4 py-10 text-center">
            <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-muted">
              <HelpCircle
                className="size-5 text-muted-foreground"
                strokeWidth={2}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Nema evidentiranih pitanja za ovu rundu.
            </p>
          </div>
        ) : (
          <ol className="grid gap-3">
            {round.questions.map((question, index) => (
              <li key={question.id} className="space-y-2">
                <QuestionCard index={index + 1} question={question} />
                <div className="flex items-center justify-end gap-1">
                  <QuestionFormSheet
                    mode="edit"
                    applicationId={applicationId}
                    roundId={round.id}
                    question={question}
                  />
                  <DeleteQuestionButton
                    applicationId={applicationId}
                    roundId={round.id}
                    questionId={question.id}
                  />
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
