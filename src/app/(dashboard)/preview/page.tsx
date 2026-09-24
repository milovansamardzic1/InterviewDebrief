import Link from "next/link";

import { DEMO_PAGES } from "@/features/preview/lib/demo-fixtures";

const GROUPS = ["Dashboard", "Prijave", "Učenje", "Uvidi"] as const;

export default function PreviewHubPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-4 sm:p-6">
      <header>
        <p className="text-xs font-medium uppercase tracking-wide text-amber-700 dark:text-amber-400">
          Demo / testni podaci
        </p>
        <h1 className="mt-1 text-2xl font-semibold">Preview stranice</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Fiksirani UI sa fixture podacima — ne dira tvoj pravi nalog. Koristi
          ovo da proveriš empty, sparse i full stanja.
        </p>
      </header>

      {GROUPS.map((group) => {
        const pages = DEMO_PAGES.filter((page) => page.group === group);

        return (
          <section key={group} className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground">
              {group}
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {pages.map((page) => (
                <li key={page.href}>
                  <Link
                    href={page.href}
                    className="block h-full rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-muted/40"
                  >
                    <p className="font-medium">{page.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {page.description}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <p className="text-xs text-muted-foreground">
        Pravi podaci:{" "}
        <Link href="/" className="text-primary hover:underline">
          Dashboard
        </Link>
      </p>
    </main>
  );
}
