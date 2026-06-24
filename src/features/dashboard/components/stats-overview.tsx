import type { DashboardStats } from "@interwjuer/contracts";

type StatsOverviewProps = {
  stats: DashboardStats;
};

const countItems: Array<{ key: keyof Pick<DashboardStats, "jobApplications" | "interviewRounds" | "questions" | "skillEvaluations" | "skills">; label: string }> = [
  { key: "jobApplications", label: "Prijave" },
  { key: "interviewRounds", label: "Intervju runde" },
  { key: "questions", label: "Pitanja" },
  { key: "skillEvaluations", label: "Skill evaluacije" },
  { key: "skills", label: "Skillovi (katalog)" },
];

export function StatsOverview({ stats }: StatsOverviewProps) {
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
    </div>
  );
}
