import type { MonthlyProgress } from "@interwjuer/contracts";

type ProgressOverTimeProps = {
  progress: MonthlyProgress[];
};

const MAX_SCORE = 5;

function formatMonthLabel(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);

  if (!year || !monthNumber) {
    return month;
  }

  return new Intl.DateTimeFormat("sr-Latn-RS", {
    month: "short",
    year: "numeric",
  }).format(new Date(Date.UTC(year, monthNumber - 1, 1)));
}

export function ProgressOverTime({ progress }: ProgressOverTimeProps) {
  if (progress.length === 0) {
    return null;
  }

  const maxCompletedRounds = Math.max(
    ...progress.map((entry) => entry.completedRounds),
    1,
  );

  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <h2 className="text-lg font-semibold">Napredak kroz vreme</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Broj završenih intervju rundi i prosečna skill ocena po mesecu.
      </p>

      <ul className="mt-4 space-y-3">
        {progress.map((entry) => (
          <li key={entry.month} className="flex items-center gap-4 text-sm">
            <span className="w-20 shrink-0 text-muted-foreground">
              {formatMonthLabel(entry.month)}
            </span>

            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${(entry.completedRounds / maxCompletedRounds) * 100}%`,
                    }}
                  />
                </div>
                <span className="w-24 shrink-0 text-right text-muted-foreground">
                  {entry.completedRounds} runde
                </span>
              </div>

              {entry.averageSkillScore !== null ? (
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-amber-500"
                      style={{
                        width: `${(entry.averageSkillScore / MAX_SCORE) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="w-24 shrink-0 text-right font-medium">
                    {entry.averageSkillScore}/{MAX_SCORE} skill
                  </span>
                </div>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
