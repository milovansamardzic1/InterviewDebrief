import type { WeakSkillStat } from "@interwjuer/contracts";
import Link from "next/link";

type WeakSkillsPreviewProps = {
  weakSkills: WeakSkillStat[];
};

const PREVIEW_LIMIT = 4;

export function WeakSkillsPreview({ weakSkills }: WeakSkillsPreviewProps) {
  const preview = weakSkills.slice(0, PREVIEW_LIMIT);

  if (preview.length === 0) {
    return (
      <section className="flex h-full min-h-0 min-w-0 flex-col rounded-lg border border-dashed border-border bg-card p-3">
        <h2 className="text-sm font-semibold">Najslabije oblasti</h2>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Dodaj skill evaluacije posle intervjua da vidiš gde najviše grešiš.
        </p>
      </section>
    );
  }

  return (
    <section className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-card p-3">
      <div className="flex shrink-0 flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold">Najslabije oblasti</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Prosečna ocena po veštini (niže = prioritet).
          </p>
        </div>
        <Link
          href="/learning"
          className="shrink-0 text-xs text-primary hover:underline"
        >
          Plan učenja
        </Link>
      </div>

      <ul className="mt-2 min-h-0 flex-1 space-y-1.5 overflow-y-auto">
        {preview.map((skill) => (
          <li
            key={skill.skillId}
            className="flex min-w-0 items-center justify-between gap-3 rounded-md border border-border px-2.5 py-1.5 text-sm"
          >
            <span className="min-w-0 truncate font-medium">
              {skill.skillName}
              {skill.skillCategory ? (
                <span className="ml-1.5 font-normal text-muted-foreground">
                  · {skill.skillCategory}
                </span>
              ) : null}
            </span>
            <span className="shrink-0 tabular-nums text-muted-foreground">
              {skill.averageScore.toFixed(1)}/5
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
