import { QuestionHistoryList } from "@/features/questions/components/question-history-list";
import { QuestionHistoryFilters } from "@/features/questions/components/question-topic-filter";
import { questionsApi } from "@/lib/api/questions";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

type QuestionsPageProps = {
  searchParams: Promise<{
    search?: string;
    company?: string;
    topic?: string;
    difficulty?: string;
    answeredOnly?: string;
    view?: string;
  }>;
};

function parseDifficulty(value: string | undefined): number | undefined {
  const difficulty = Number(value);
  return Number.isInteger(difficulty) && difficulty >= 1 && difficulty <= 5
    ? difficulty
    : undefined;
}

export default async function QuestionsPage({
  searchParams,
}: QuestionsPageProps) {
  const {
    search,
    company,
    topic,
    difficulty: difficultyParam,
    answeredOnly: answeredOnlyParam,
    view: viewParam,
  } = await searchParams;
  const difficulty = parseDifficulty(difficultyParam);
  const answeredOnly = answeredOnlyParam === "true";
  const view = viewParam === "topic" ? "topic" : "latest";
  const hasActiveFilters = Boolean(
    search || company || topic || difficulty || answeredOnly,
  );
  const { items } = await questionsApi.history({
    search,
    company,
    topic,
    difficulty,
    answeredOnly,
  });

  function viewHref(nextView: "latest" | "topic") {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (company) params.set("company", company);
    if (topic) params.set("topic", topic);
    if (difficulty) params.set("difficulty", String(difficulty));
    if (answeredOnly) params.set("answeredOnly", "true");
    if (nextView === "topic") params.set("view", "topic");
    const query = params.toString();
    return query ? `/questions?${query}` : "/questions";
  }

  return (
    <main className="flex min-w-0 flex-1 flex-col gap-6 p-4 sm:p-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Pitanja
          </h1>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground sm:text-base">
            Istorija svih pitanja kroz sve prijave — pronađi pitanja po
            sadržaju, kompaniji, temi ili težini.
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
          <p className="text-sm text-muted-foreground">
            Prikazano: {items.length}
          </p>
          <div className="flex rounded-lg border border-border p-0.5">
            <Button
              size="sm"
              variant={view === "latest" ? "secondary" : "ghost"}
              nativeButton={false}
              render={<Link href={viewHref("latest")} scroll={false} />}
            >
              Najnovije
            </Button>
            <Button
              size="sm"
              variant={view === "topic" ? "secondary" : "ghost"}
              nativeButton={false}
              render={<Link href={viewHref("topic")} scroll={false} />}
            >
              Po temama
            </Button>
          </div>
        </div>
      </header>

      <QuestionHistoryFilters
        key={`${search ?? ""}|${company ?? ""}|${topic ?? ""}|${difficulty ?? ""}|${answeredOnly}|${view}`}
        search={search}
        company={company}
        topic={topic}
        difficulty={difficulty}
        answeredOnly={answeredOnly}
        view={view}
      />

      <section aria-label="Istorija pitanja" className="min-w-0">
        <QuestionHistoryList
          items={items}
          hasActiveFilters={hasActiveFilters}
          groupByTopic={view === "topic"}
        />
      </section>
    </main>
  );
}
