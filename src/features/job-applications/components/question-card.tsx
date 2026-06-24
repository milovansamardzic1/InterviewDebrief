import { MessageSquare, Star } from "lucide-react";

import { formatDifficulty } from "@/features/job-applications/lib/format";
import type { ApplicationDetailQuestion } from "@interwjuer/contracts";

type QuestionCardProps = {
  index: number;
  question: ApplicationDetailQuestion;
};

export function QuestionCard({ index, question }: QuestionCardProps) {
  return (
    <article className="rounded-lg border border-border bg-muted/20 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="text-sm font-medium text-foreground">
          {index}. {question.question}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {question.topic ? (
            <span className="rounded-full bg-background px-2 py-0.5 text-xs text-muted-foreground ring-1 ring-border">
              {question.topic}
            </span>
          ) : null}
          {question.difficulty != null ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-background px-2 py-0.5 text-xs text-muted-foreground ring-1 ring-border">
              <Star className="size-3" strokeWidth={2} />
              {formatDifficulty(question.difficulty)}
            </span>
          ) : null}
        </div>
      </div>

      {question.myAnswer ? (
        <div className="mt-3 space-y-1">
          <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <MessageSquare className="size-3" strokeWidth={2} />
            Moj odgovor
          </p>
          <p className="text-sm whitespace-pre-wrap text-foreground/90">
            {question.myAnswer}
          </p>
        </div>
      ) : null}

      {question.notes ? (
        <p className="mt-3 text-sm whitespace-pre-wrap text-muted-foreground">
          {question.notes}
        </p>
      ) : null}
    </article>
  );
}
