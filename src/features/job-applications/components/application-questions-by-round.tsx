import { HelpCircle } from "lucide-react";

import { RoundQuestionsList } from "@/features/job-applications/components/round-questions-list";
import type { ApplicationDetailRound } from "@interwjuer/contracts";

type ApplicationQuestionsByRoundProps = {
  rounds: ApplicationDetailRound[];
};

export function ApplicationQuestionsByRound({
  rounds,
}: ApplicationQuestionsByRoundProps) {
  const totalQuestions = rounds.reduce(
    (sum, round) => sum + round.questions.length,
    0,
  );
  const roundsWithQuestions = rounds.filter(
    (round) => round.questions.length > 0,
  );

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Pitanja po rundama
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Sva pitanja grupisana po intervju rundama.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          {totalQuestions} {totalQuestions === 1 ? "pitanje" : "pitanja"} ·{" "}
          {roundsWithQuestions.length}/{rounds.length} rundi
        </p>
      </div>

      {rounds.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-16 text-center">
          <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
            <HelpCircle
              className="size-6 text-muted-foreground"
              strokeWidth={2}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Nema intervju rundi za prikaz pitanja.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {rounds.map((round) => (
            <RoundQuestionsList key={round.id} round={round} />
          ))}
        </div>
      )}
    </section>
  );
}
