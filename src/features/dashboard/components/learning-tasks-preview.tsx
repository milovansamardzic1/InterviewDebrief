import type { LearningTask } from "@interwjuer/contracts";
import { CheckSquare2 } from "lucide-react";
import Link from "next/link";

type LearningTasksPreviewProps = {
  tasks: LearningTask[];
};

const PREVIEW_LIMIT = 3;

function formatDueDate(value: string) {
  return new Date(value).toLocaleDateString("sr-Latn", {
    month: "short",
    day: "numeric",
  });
}

export function LearningTasksPreview({ tasks }: LearningTasksPreviewProps) {
  const preview = tasks
    .filter((task) => task.status !== "COMPLETED")
    .slice(0, PREVIEW_LIMIT);

  if (preview.length === 0) {
    return null;
  }

  return (
    <section className="min-w-0 rounded-lg border border-border border-l-4 border-l-primary bg-card p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold">Aktivni zadaci učenja</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Sledeći konkretni koraci u pripremi.
          </p>
        </div>
        <Link
          href="/learning"
          className="shrink-0 text-xs text-primary hover:underline"
        >
          Vidi sve
        </Link>
      </div>
      <ul className="mt-2 grid gap-1.5 sm:grid-cols-3">
        {preview.map((task) => (
          <li
            key={task.id}
            className="flex min-w-0 items-start gap-2 rounded-md border border-border px-2.5 py-1.5"
          >
            <CheckSquare2 className="mt-0.5 size-4 shrink-0 text-primary" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{task.title}</p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {task.skillName}
                {task.dueDate ? ` · rok ${formatDueDate(task.dueDate)}` : ""}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
