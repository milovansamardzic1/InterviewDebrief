import { QuestionHistoryList } from "@/features/questions/components/question-history-list";
import { QuestionTopicFilter } from "@/features/questions/components/question-topic-filter";
import { questionsApi } from "@/lib/api/questions";

export const dynamic = "force-dynamic";

type QuestionsPageProps = {
  searchParams: Promise<{ topic?: string }>;
};

export default async function QuestionsPage({
  searchParams,
}: QuestionsPageProps) {
  const { topic } = await searchParams;
  const { items } = await questionsApi.history({ topic });

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Pitanja</h1>
          <p className="mt-1 text-base text-muted-foreground">
            Istorija svih pitanja kroz sve prijave — pretraži po temi da se
            pripremiš za sledeći intervju.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">Ukupno: {items.length}</p>
      </header>

      <QuestionTopicFilter topic={topic} />

      <QuestionHistoryList items={items} topic={topic} />
    </main>
  );
}
