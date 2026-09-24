import type { ReactNode } from "react";
import Link from "next/link";

import { DEMO_PAGES } from "@/features/preview/lib/demo-fixtures";

type PreviewChromeProps = {
  title: string;
  description: string;
  children: ReactNode;
  /** Match dashboard viewport lock when previewing home layouts. */
  lockHeight?: boolean;
};

export function PreviewChrome({
  title,
  description,
  children,
  lockHeight = false,
}: PreviewChromeProps) {
  return (
    <main
      className={[
        "flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden p-3 lg:p-4",
        lockHeight ? "lg:h-[calc(100svh-3.5rem)] lg:overflow-hidden" : "",
      ].join(" ")}
    >
      <div className="mb-3 shrink-0 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="min-w-0">
            <p className="font-medium text-foreground">{title}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <Link
            href="/preview"
            className="shrink-0 text-xs font-medium text-primary hover:underline"
          >
            Sve demo stranice
          </Link>
        </div>
        <nav className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {DEMO_PAGES.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="hover:text-primary hover:underline"
            >
              {page.title}
            </Link>
          ))}
        </nav>
      </div>

      {children}
    </main>
  );
}
