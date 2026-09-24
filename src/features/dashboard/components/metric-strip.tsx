type MetricStripProps = {
  jobApplications: number;
  interviewRounds: number;
  questions: number;
  skillEvaluations: number;
};

const metrics: Array<{
  key: keyof MetricStripProps;
  label: string;
}> = [
  { key: "jobApplications", label: "Prijave" },
  { key: "interviewRounds", label: "Runde" },
  { key: "questions", label: "Pitanja" },
  { key: "skillEvaluations", label: "Evaluacije" },
];

export function MetricStrip(props: MetricStripProps) {
  return (
    <section className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-4">
      {metrics.map(({ key, label }) => (
        <article
          key={key}
          className="min-w-0 overflow-hidden rounded-lg border border-border border-l-4 border-l-primary bg-card px-3 py-1.5 text-card-foreground"
        >
          <p className="truncate text-xs text-muted-foreground">{label}</p>
          <p className="text-lg font-semibold tabular-nums tracking-tight">
            {props[key]}
          </p>
        </article>
      ))}
    </section>
  );
}
