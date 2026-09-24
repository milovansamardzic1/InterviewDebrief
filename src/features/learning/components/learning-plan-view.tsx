import { BookOpen, GraduationCap } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { LearningTaskFormSheet } from "@/features/learning/components/learning-task-form-sheet";
import type { LearningPlanItem } from "@interwjuer/contracts";

type LearningPlanViewProps = {
  items: LearningPlanItem[];
};

function formatEvaluatedAt(iso: string) {
  return new Date(iso).toLocaleDateString("sr-Latn", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function LearningPlanView({ items }: LearningPlanViewProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-16 text-center">
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
          <GraduationCap
            className="size-6 text-muted-foreground"
            strokeWidth={2}
          />
        </div>
        <h2 className="text-lg font-medium">Još nemaš slabih oblasti</h2>
        <p className="mt-1 max-w-sm text-base text-muted-foreground">
          Dodaj skill evaluacije posle intervjua. Kada prosečna ocena padne
          ispod 3/5, ovde će se pojaviti fokusiran plan vežbanja.
        </p>
        <Button
          className="mt-6"
          nativeButton={false}
          render={<Link href="/applications" />}
        >
          Idi na prijave
        </Button>
      </div>
    );
  }

  return (
    <ol className="grid gap-3">
      {items.map((item, index) => (
        <li key={item.skillId}>
          <article className="rounded-lg border border-border bg-card p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <h2 className="font-semibold tracking-tight">
                    {item.skillName}
                  </h2>
                  {item.skillCategory ? (
                    <p className="text-xs text-muted-foreground">
                      {item.skillCategory}
                    </p>
                  ) : null}
                </div>
              </div>
              <p className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium tabular-nums">
                {item.averageScore}/5 · {item.evaluationCount} eval.
              </p>
            </div>

            <p className="mt-3 text-sm font-medium text-foreground">
              {item.focusHint}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Poslednja evaluacija: {formatEvaluatedAt(item.lastEvaluatedAt)}
            </p>

            {item.relatedQuestions.length > 0 ? (
              <details className="group mt-3">
                <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
                  <BookOpen className="size-3" strokeWidth={2} />
                  Povezana pitanja ({item.relatedQuestions.length})
                </summary>
                <ul className="mt-2 space-y-1.5">
                  {item.relatedQuestions.slice(0, 2).map((question) => (
                    <li key={question.id}>
                      <Link
                        href={`/applications/${question.applicationId}#round-${question.roundId}-questions`}
                        className="block rounded-md bg-muted/40 px-2.5 py-2 text-xs hover:bg-muted"
                      >
                        <span className="font-medium text-foreground">
                          {question.questionText}
                        </span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {question.company}
                          {question.topic ? ` · ${question.topic}` : ""}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            ) : (
              <p className="mt-3 text-xs text-muted-foreground">
                Nema povezanih pitanja.{" "}
                <Link
                  href="/questions"
                  className="text-primary hover:underline"
                >
                  Pregledaj pitanja
                </Link>
              </p>
            )}

            <div className="mt-3 border-t border-border pt-3">
              <LearningTaskFormSheet
                mode="create"
                skillId={item.skillId}
                skillName={item.skillName}
              />
            </div>
          </article>
        </li>
      ))}
    </ol>
  );
}
