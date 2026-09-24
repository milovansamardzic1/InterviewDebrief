import { ChevronDown, HelpCircle, MessageSquare, Star } from "lucide-react";
import Link from "next/link";

import { formatDifficulty } from "@/features/job-applications/lib/format";
import type { QuestionHistoryItem } from "@interwjuer/contracts";

type QuestionHistoryListProps = {
  items: QuestionHistoryItem[];
  hasActiveFilters?: boolean;
  groupByTopic?: boolean;
};

function QuestionRows({
  items,
  showTopic = true,
}: {
  items: QuestionHistoryItem[];
  showTopic?: boolean;
}) {
  return (
    <ol className="divide-y divide-border border-y border-border">
      {items.map((item) => (
        <li key={item.id}>
          <details className="group">
            <summary className="flex cursor-pointer list-none items-center gap-4 py-4 marker:hidden">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground">{item.question}</p>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {item.company} · {item.position} · {item.interviewTypeName}
                </p>
              </div>
              <div className="hidden shrink-0 items-center gap-2 sm:flex">
                {showTopic && item.topic ? (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {item.topic}
                  </span>
                ) : null}
                {item.difficulty != null ? (
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="size-3" strokeWidth={2} />
                    {formatDifficulty(item.difficulty)}
                  </span>
                ) : null}
              </div>
              <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
            </summary>

            <div className="pb-5 sm:pr-10">
              <div className="rounded-md bg-muted/35 px-4 py-3">
                <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <MessageSquare className="size-3" strokeWidth={2} />
                  Moj odgovor
                </p>
                {item.myAnswer ? (
                  <p className="mt-1.5 max-w-4xl text-sm whitespace-pre-wrap text-foreground/90">
                    {item.myAnswer}
                  </p>
                ) : (
                  <p className="mt-1.5 text-sm text-muted-foreground italic">
                    Odgovor nije zabeležen.
                  </p>
                )}
                {item.notes ? (
                  <p className="mt-3 border-l-2 border-border pl-3 text-sm whitespace-pre-wrap text-muted-foreground">
                    {item.notes}
                  </p>
                ) : null}
              </div>
              <Link
                href={`/applications/${item.applicationId}#round-${item.roundId}-questions`}
                className="mt-2 inline-block text-xs text-primary hover:underline"
              >
                Otvori pitanje u prijavi
              </Link>
            </div>
          </details>
        </li>
      ))}
    </ol>
  );
}

export function QuestionHistoryList({
  items,
  hasActiveFilters = false,
  groupByTopic = false,
}: QuestionHistoryListProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-16 text-center">
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
          <HelpCircle
            className="size-6 text-muted-foreground"
            strokeWidth={2}
          />
        </div>
        <h2 className="text-lg font-medium">
          {hasActiveFilters
            ? "Nema pitanja koja odgovaraju filterima"
            : "Nema evidentiranih pitanja"}
        </h2>
        <p className="mt-1 max-w-sm text-base text-muted-foreground">
          {hasActiveFilters
            ? "Probaj druge kriterijume ili obriši filtere da vidiš sva pitanja."
            : "Kada dodaš pitanja u okviru intervju rundi, ovde ćeš videti njihovu istoriju."}
        </p>
        {hasActiveFilters ? (
          <Link
            href="/questions"
            className="mt-4 text-sm text-primary hover:underline"
          >
            Obriši filtere
          </Link>
        ) : null}
      </div>
    );
  }

  if (!groupByTopic) {
    return <QuestionRows items={items} />;
  }

  const groups = new Map<string, QuestionHistoryItem[]>();
  for (const item of items) {
    const topic = item.topic?.trim() || "Bez teme";
    groups.set(topic, [...(groups.get(topic) ?? []), item]);
  }
  const sortedGroups = [...groups.entries()].sort(([left], [right]) => {
    if (left === "Bez teme") return 1;
    if (right === "Bez teme") return -1;
    return left.localeCompare(right, "sr-Latn");
  });

  return (
    <div className="space-y-8">
      {sortedGroups.map(([topic, topicItems]) => (
        <section key={topic} aria-label={`Tema: ${topic}`}>
          <div className="mb-2 flex items-baseline justify-between gap-3">
            <h2 className="text-lg font-semibold tracking-tight">{topic}</h2>
            <span className="text-sm text-muted-foreground">
              {topicItems.length}{" "}
              {topicItems.length === 1 ? "pitanje" : "pitanja"}
            </span>
          </div>
          <QuestionRows items={topicItems} showTopic={false} />
        </section>
      ))}
    </div>
  );
}
