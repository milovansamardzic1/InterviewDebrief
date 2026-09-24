import type { LearningPlanItem } from "@interwjuer/contracts";
import Link from "next/link";

type LearningPreviewProps = {
  items: LearningPlanItem[];
};

const PREVIEW_LIMIT = 3;

export function LearningPreview({ items }: LearningPreviewProps) {
  const preview = items.slice(0, PREVIEW_LIMIT);

  if (preview.length === 0) {
    return null;
  }

  return (
    <section className="min-w-0 rounded-lg border border-border border-l-4 border-l-primary bg-card p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold">Plan učenja</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Top veštine za vežbu na osnovu evaluacija.
          </p>
        </div>
        <Link
          href="/learning"
          className="shrink-0 text-xs text-primary hover:underline"
        >
          Vidi ceo plan
        </Link>
      </div>
      <ul className="mt-2 grid gap-1.5 sm:grid-cols-3">
        {preview.map((item, index) => (
          <li
            key={item.skillId}
            className="flex min-w-0 items-start gap-2 rounded-md border border-border px-2.5 py-1.5"
          >
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="truncate text-sm font-medium">{item.skillName}</p>
                <p className="shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
                  {item.averageScore}/5
                </p>
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {item.focusHint}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
