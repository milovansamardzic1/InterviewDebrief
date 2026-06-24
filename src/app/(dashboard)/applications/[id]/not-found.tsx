import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ApplicationNotFound() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col items-start gap-4 p-6">
      <Link
        href="/applications"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" strokeWidth={2} />
        Nazad na prijave
      </Link>

      <div className="rounded-xl border border-dashed px-6 py-16 text-center sm:w-full">
        <h1 className="text-2xl font-semibold tracking-tight">
          Prijava nije pronađena
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Proveri da li je link ispravan ili se vrati na listu prijava.
        </p>
      </div>
    </main>
  );
}
