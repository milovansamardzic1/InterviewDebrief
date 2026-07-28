import type { DashboardStats } from "@interwjuer/contracts";
import { ClipboardList } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ProgressOverTime } from "@/features/dashboard/components/progress-over-time";

type StatsOverviewProps = {
  stats: DashboardStats;
};

const countItems: Array<{
  key: keyof Pick<
    DashboardStats,
    | "jobApplications"
    | "interviewRounds"
    | "questions"
    | "skillEvaluations"
    | "skills"
  >;
  label: string;
}> = [
  { key: "jobApplications", label: "Prijave" },
  { key: "interviewRounds", label: "Intervju runde" },
  { key: "questions", label: "Pitanja" },
  { key: "skillEvaluations", label: "Skill evaluacije" },
  { key: "skills", label: "Skillovi (katalog)" },
];

export function StatsOverview({ stats }: StatsOverviewProps) {
  if (stats.jobApplications === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-16 text-center">
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
          <ClipboardList
            className="size-6 text-muted-foreground"
            strokeWidth={2}
          />
        </div>
        <h2 className="text-lg font-medium">Još nemaš nijednu prijavu</h2>
        <p className="mt-1 max-w-sm text-base text-muted-foreground">
          Dodaj prvu prijavu da bi počeo da pratiš status, intervju runde i
          napredak kroz proces.
        </p>
        <Button className="mt-6" render={<Link href="/applications" />}>
          Dodaj prijavu
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {countItems.map(({ key, label }) => (
          <article
            key={key}
            className="rounded-lg border border-border bg-card p-5 text-card-foreground"
          >
            <p className="text-base text-muted-foreground">{label}</p>
            <p className="mt-2 text-4xl font-semibold tracking-tight">
              {stats[key]}
            </p>
          </article>
        ))}
      </section>

      {stats.weakSkills.length > 0 ? (
        <section className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-lg font-semibold">Najslabije oblasti</h2>
          <ul className="mt-4 space-y-2">
            {stats.weakSkills.map((skill) => (
              <li
                key={skill.skillId}
                className="flex items-center justify-between text-sm"
              >
                <span>
                  {skill.skillName}
                  {skill.skillCategory ? (
                    <span className="text-muted-foreground">
                      {" "}
                      · {skill.skillCategory}
                    </span>
                  ) : null}
                </span>
                <span className="font-medium">
                  {skill.averageScore}/5 ({skill.evaluationCount})
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {stats.questionsByTopic.length > 0 ? (
        <section className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-lg font-semibold">Pitanja po temi</h2>
          <ul className="mt-4 space-y-2">
            {stats.questionsByTopic.slice(0, 8).map((topic) => (
              <li
                key={topic.topic}
                className="flex items-center justify-between text-sm"
              >
                <span>{topic.topic}</span>
                <span className="font-medium">{topic.count}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <ProgressOverTime progress={stats.progressOverTime} />
    </div>
  );
}
