import { cn } from "@/lib/utils";
import {
  abbreviateInterviewType,
  getCompletedRoundCount,
  getNextRound,
  getRoundStatusLabel,
} from "@/features/job-applications/lib/format";
import type { ApplicationListRound } from "@interwjuer/contracts";

type InterviewRoundProgressProps = {
  rounds: ApplicationListRound[];
};

function RoundDot({ status }: { status: ApplicationListRound["status"] }) {
  return (
    <span
      className={cn(
        "relative z-10 size-3.5 shrink-0 rounded-full border-2 bg-background transition-colors",
        status === "COMPLETED" && "border-primary bg-primary",
        status === "IN_PROGRESS" && "border-primary bg-primary/30",
        status === "SCHEDULED" && "border-muted-foreground/40 bg-background",
        status === "CANCELLED" && "border-muted-foreground/30 bg-muted",
        status === "NO_SHOW" && "border-destructive/50 bg-destructive/20",
      )}
      aria-hidden
    />
  );
}

export function InterviewRoundProgress({
  rounds,
}: InterviewRoundProgressProps) {
  if (rounds.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nema evidentiranih intervju rundi.
      </p>
    );
  }

  const completedCount = getCompletedRoundCount(rounds);
  const nextRound = getNextRound(rounds);
  const totalQuestions = rounds.reduce(
    (sum, round) => sum + round.questionCount,
    0,
  );

  return (
    <div className="space-y-3">
      <div className="-mx-1 overflow-x-auto px-1 pb-1">
        <div
          className="flex min-w-full items-start"
          style={{ minWidth: `${Math.max(rounds.length * 72, 280)}px` }}
        >
          {rounds.map((round, index) => (
            <div
              key={round.id}
              className="flex min-w-[4.5rem] flex-1 flex-col items-center gap-2"
              title={`${round.interviewTypeName} — ${getRoundStatusLabel(round.status)}`}
            >
              <div className="relative flex w-full items-center justify-center py-1">
                {index > 0 ? (
                  <span
                    className={cn(
                      "absolute right-1/2 left-0 top-1/2 h-0.5 -translate-y-1/2",
                      rounds[index - 1]?.status === "COMPLETED"
                        ? "bg-primary"
                        : "bg-border",
                    )}
                    aria-hidden
                  />
                ) : null}
                <RoundDot status={round.status} />
                {index < rounds.length - 1 ? (
                  <span
                    className={cn(
                      "absolute right-0 left-1/2 top-1/2 h-0.5 -translate-y-1/2",
                      round.status === "COMPLETED" ? "bg-primary" : "bg-border",
                    )}
                    aria-hidden
                  />
                ) : null}
              </div>
              <span className="max-w-[4.5rem] truncate px-0.5 text-center text-xs leading-tight text-muted-foreground">
                {abbreviateInterviewType(round.interviewTypeName)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        {completedCount}/{rounds.length} rundi završeno
        {nextRound
          ? ` · Sledeća: ${nextRound.interviewTypeName}`
          : completedCount === rounds.length
            ? " · Proces završen"
            : null}
        {totalQuestions > 0
          ? ` · ${totalQuestions} ${totalQuestions === 1 ? "pitanje" : "pitanja"}`
          : null}
      </p>
    </div>
  );
}
