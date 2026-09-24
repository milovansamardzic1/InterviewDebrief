"use client";

import Link from "next/link";
import { MessageSquareText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ALL_VALUE = "__all__";
const SEARCH_DEBOUNCE_MS = 300;
const DIFFICULTIES = [1, 2, 3, 4, 5] as const;
const DIFFICULTY_ITEMS = {
  [ALL_VALUE]: "Sve težine",
  "1": "1/5",
  "2": "2/5",
  "3": "3/5",
  "4": "4/5",
  "5": "5/5",
};

type FilterValues = {
  search: string;
  company: string;
  topic: string;
  difficulty: string;
  answeredOnly: boolean;
  view: "latest" | "topic";
};

type QuestionHistoryFiltersProps = {
  search?: string;
  company?: string;
  topic?: string;
  difficulty?: number;
  answeredOnly?: boolean;
  view?: "latest" | "topic";
};

function buildQuestionsHref(filters: FilterValues) {
  const params = new URLSearchParams();

  if (filters.search.trim()) {
    params.set("search", filters.search.trim());
  }
  if (filters.company.trim()) {
    params.set("company", filters.company.trim());
  }
  if (filters.topic.trim()) {
    params.set("topic", filters.topic.trim());
  }
  if (filters.difficulty !== ALL_VALUE) {
    params.set("difficulty", filters.difficulty);
  }
  if (filters.answeredOnly) {
    params.set("answeredOnly", "true");
  }
  if (filters.view === "topic") {
    params.set("view", "topic");
  }

  const query = params.toString();
  return query ? `/questions?${query}` : "/questions";
}

export function QuestionHistoryFilters({
  search: initialSearch = "",
  company: initialCompany = "",
  topic: initialTopic = "",
  difficulty: initialDifficulty,
  answeredOnly = false,
  view = "latest",
}: QuestionHistoryFiltersProps) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [company, setCompany] = useState(initialCompany);
  const [topic, setTopic] = useState(initialTopic);
  const [difficulty, setDifficulty] = useState(
    initialDifficulty?.toString() ?? ALL_VALUE,
  );

  const hasActiveFilters = Boolean(
    search.trim() ||
    company.trim() ||
    topic.trim() ||
    difficulty !== ALL_VALUE ||
    answeredOnly,
  );

  const navigateToFilters = useCallback(
    (next: FilterValues) => {
      router.push(buildQuestionsHref(next), { scroll: false });
    },
    [router],
  );

  useEffect(() => {
    const textFiltersChanged =
      search.trim() !== initialSearch.trim() ||
      company.trim() !== initialCompany.trim() ||
      topic.trim() !== initialTopic.trim();

    if (!textFiltersChanged) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      navigateToFilters({
        search,
        company,
        topic,
        difficulty,
        answeredOnly,
        view,
      });
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [
    search,
    company,
    topic,
    difficulty,
    initialSearch,
    initialCompany,
    initialTopic,
    answeredOnly,
    view,
    navigateToFilters,
  ]);

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:min-w-64">
        <Label htmlFor="question-search" className="text-muted-foreground">
          Pretraga
        </Label>
        <Input
          id="question-search"
          type="search"
          placeholder="Pitanje, odgovor, beleška..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5 sm:w-48">
        <Label htmlFor="question-company" className="text-muted-foreground">
          Kompanija
        </Label>
        <Input
          id="question-company"
          type="search"
          placeholder="Naziv kompanije..."
          value={company}
          onChange={(event) => setCompany(event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5 sm:w-48">
        <Label htmlFor="question-topic" className="text-muted-foreground">
          Tema
        </Label>
        <Input
          id="question-topic"
          type="search"
          placeholder="npr. JavaScript"
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5 sm:w-40">
        <Label htmlFor="question-difficulty" className="text-muted-foreground">
          Težina
        </Label>
        <Select
          value={difficulty}
          onValueChange={(value) => {
            if (typeof value !== "string") {
              return;
            }
            setDifficulty(value);
            navigateToFilters({
              search,
              company,
              topic,
              difficulty: value,
              answeredOnly,
              view,
            });
          }}
          items={DIFFICULTY_ITEMS}
        >
          <SelectTrigger id="question-difficulty">
            <SelectValue placeholder="Sve težine" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>Sve težine</SelectItem>
            {DIFFICULTIES.map((value) => (
              <SelectItem key={value} value={String(value)}>
                {value}/5
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        type="button"
        variant={answeredOnly ? "secondary" : "outline"}
        aria-pressed={answeredOnly}
        onClick={() =>
          navigateToFilters({
            search,
            company,
            topic,
            difficulty,
            answeredOnly: !answeredOnly,
            view,
          })
        }
      >
        <MessageSquareText />
        Samo sa odgovorima
      </Button>

      {hasActiveFilters ? (
        <Button
          variant="ghost"
          nativeButton={false}
          render={
            <Link
              href={view === "topic" ? "/questions?view=topic" : "/questions"}
            />
          }
        >
          Obriši filtere
        </Button>
      ) : null}
    </div>
  );
}
