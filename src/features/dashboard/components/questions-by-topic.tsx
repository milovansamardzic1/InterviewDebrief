"use client";

import type { TopicCount } from "@interwjuer/contracts";
import Link from "next/link";

type QuestionsByTopicProps = {
  topics: TopicCount[];
};

const TOP_LIMIT = 6;

const BAR_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--muted-foreground)",
] as const;

export function QuestionsByTopic({ topics }: QuestionsByTopicProps) {
  if (topics.length === 0) {
    return null;
  }

  const topTopics = topics.slice(0, TOP_LIMIT);
  const restCount = topics
    .slice(TOP_LIMIT)
    .reduce((sum, topic) => sum + topic.count, 0);

  const data = [
    ...topTopics.map((topic) => ({
      name: topic.topic,
      value: topic.count,
    })),
    ...(restCount > 0 ? [{ name: "Ostalo", value: restCount }] : []),
  ];

  const maxCount = Math.max(...data.map((entry) => entry.value), 1);
  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <section className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-card p-3">
      <div className="flex shrink-0 flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold">Pitanja po temi</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {total} {total === 1 ? "pitanje" : "pitanja"} · {data.length}{" "}
            {data.length === 1 ? "tema" : data.length < 5 ? "teme" : "tema"}
          </p>
        </div>
        <Link
          href="/questions"
          className="shrink-0 text-xs text-primary hover:underline"
        >
          Sva pitanja
        </Link>
      </div>

      <ul className="mt-2 flex min-h-0 flex-1 flex-col justify-center gap-2 overflow-y-auto">
        {data.map((entry, index) => {
          const widthPercent = (entry.value / maxCount) * 100;
          const sharePercent =
            total > 0 ? Math.round((entry.value / total) * 100) : 0;

          return (
            <li key={entry.name} className="min-w-0 space-y-1">
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="min-w-0 truncate font-medium">
                  {entry.name}
                </span>
                <span className="shrink-0 tabular-nums text-muted-foreground">
                  {entry.value}
                  <span className="ml-1 text-xs">({sharePercent}%)</span>
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-[width]"
                  style={{
                    width: `${widthPercent}%`,
                    backgroundColor: BAR_COLORS[index % BAR_COLORS.length],
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
