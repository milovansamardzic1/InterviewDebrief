import { HelpCircle, MessageSquare, Star } from "lucide-react";
import Link from "next/link";

import { formatDifficulty } from "@/features/job-applications/lib/format";
import type { QuestionHistoryItem } from "@interwjuer/contracts";

type QuestionHistoryListProps = {
  items: QuestionHistoryItem[];
  topic?: string;
};

export function QuestionHistoryList({ items, topic }: QuestionHistoryListProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-16 text-center">
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
          <HelpCircle className="size-6 text-muted-foreground" strokeWidth={2} />
        </div>
        <h2 className="text-lg font-medium">
          {topic ? "Nema pitanja za ovu temu" : "Nema evidentiranih pitanja"}
        </h2>
        <p className="mt-1 max-w-sm text-base text-muted-foreground">
          {topic
            ? "Probaj drugu temu ili obriši filter da vidiš sva pitanja."
            : "Kada dodaš pitanja u okviru intervju rundi, ovde ćeš videti njihovu istoriju."}
        </p>
      </div>
    );
  }

  return (
    <ol className="grid gap-3">
      {items.map((item) => (
        <li key={item.id}>
          <article className="rounded-lg border border-border bg-card p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="text-sm font-medium text-foreground">
                {item.question}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {item.topic ? (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground ring-1 ring-border">
                    {item.topic}
                  </span>
                ) : null}
                {item.difficulty != null ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground ring-1 ring-border">
                    <Star className="size-3" strokeWidth={2} />
                    {formatDifficulty(item.difficulty)}
                  </span>
                ) : null}
              </div>
            </div>

            {item.myAnswer ? (
              <div className="mt-3 space-y-1">
                <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <MessageSquare className="size-3" strokeWidth={2} />
                  Moj odgovor
                </p>
                <p className="text-sm whitespace-pre-wrap text-foreground/90">
                  {item.myAnswer}
                </p>
              </div>
            ) : null}

            {item.notes ? (
              <p className="mt-3 text-sm whitespace-pre-wrap text-muted-foreground">
                {item.notes}
              </p>
            ) : null}

            <Link
              href={`/applications/${item.applicationId}#round-${item.roundId}-questions`}
              className="mt-3 inline-block text-sm text-primary hover:underline"
            >
              {item.company} · {item.position} · {item.interviewTypeName}
            </Link>
          </article>
        </li>
      ))}
    </ol>
  );
}
