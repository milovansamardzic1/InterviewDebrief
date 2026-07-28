"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

type DashboardErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 items-center justify-center p-6">
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-16 text-center">
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
          <AlertTriangle
            className="size-6 text-muted-foreground"
            strokeWidth={2}
          />
        </div>
        <h2 className="text-lg font-medium">Nešto je pošlo po zlu</h2>
        <p className="mt-1 max-w-sm text-base text-muted-foreground">
          Došlo je do neočekivane greške prilikom učitavanja podataka. Pokušaj
          ponovo, a ako se problem nastavi proveri da li API radi.
        </p>
        <Button className="mt-6" onClick={reset}>
          Pokušaj ponovo
        </Button>
      </div>
    </main>
  );
}
