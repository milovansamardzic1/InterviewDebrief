"use client";

import type { DashboardStats } from "@interwjuer/contracts";
import { Check, Circle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import {
  buildGettingStartedSteps,
  type GettingStartedStepId,
} from "@/features/dashboard/lib/dashboard-phase";
import {
  pickTargetRoundId,
  type GettingStartedActionContext,
} from "@/features/dashboard/lib/getting-started-actions";
import { ApplicationFormSheet } from "@/features/job-applications/components/application-form-sheet";
import { QuestionFormSheet } from "@/features/job-applications/components/question-form-sheet";
import { RoundFormSheet } from "@/features/job-applications/components/round-form-sheet";
import { SkillEvaluationFormSheet } from "@/features/job-applications/components/skill-evaluation-form-sheet";

type OpenSheet = GettingStartedStepId | null;

type GettingStartedChecklistProps = {
  stats: DashboardStats;
  actionContext: GettingStartedActionContext | null;
};

export function GettingStartedChecklist({
  stats,
  actionContext,
}: GettingStartedChecklistProps) {
  const router = useRouter();
  const [openSheet, setOpenSheet] = useState<OpenSheet>(null);

  const primaryApplicationId =
    actionContext?.primaryApplication?.id ??
    stats.activeApplications[0]?.id ??
    stats.upcomingRound?.applicationId ??
    null;

  const steps = buildGettingStartedSteps(stats, primaryApplicationId);
  const completedCount = steps.filter((step) => step.done).length;
  const nextStep = steps.find((step) => !step.done) ?? null;

  const targetRoundId = pickTargetRoundId(
    actionContext?.primaryApplication ?? null,
    stats.upcomingRound?.id ?? null,
  );

  function closeSheet() {
    setOpenSheet(null);
  }

  function handleStepActivate(stepId: GettingStartedStepId, href: string) {
    const step = steps.find((item) => item.id === stepId);
    if (!step) {
      return;
    }

    if (step.done) {
      router.push(href);
      return;
    }

    if (!actionContext) {
      router.push(href);
      return;
    }

    if (stepId === "application") {
      setOpenSheet("application");
      return;
    }

    if (!actionContext.primaryApplication) {
      toast.error(
        "Prijava nije učitana",
        "Otvori stranicu prijave i nastavi odatle.",
      );
      router.push(href);
      return;
    }

    if (stepId === "round") {
      setOpenSheet("round");
      return;
    }

    if (!targetRoundId) {
      setOpenSheet("round");
      return;
    }

    if (stepId === "questions") {
      setOpenSheet("questions");
      return;
    }

    if (stepId === "evaluations") {
      setOpenSheet("evaluations");
    }
  }

  const canOpenRound = Boolean(actionContext?.primaryApplication);
  const canOpenRoundChildren = Boolean(
    actionContext?.primaryApplication && targetRoundId,
  );

  return (
    <>
      <ol className="mt-3 min-h-0 flex-1 space-y-2 overflow-y-auto">
        {steps.map((step, index) => {
          const isNext = nextStep?.id === step.id;

          return (
            <li key={step.id}>
              <button
                type="button"
                onClick={() => handleStepActivate(step.id, step.href)}
                className={[
                  "flex w-full items-start gap-3 rounded-md border px-3 py-2.5 text-left transition-colors",
                  step.done
                    ? "border-border bg-muted/30"
                    : isNext
                      ? "border-primary/40 bg-primary/5 hover:bg-primary/10"
                      : "border-border hover:bg-muted/50",
                ].join(" ")}
              >
                <span
                  className={[
                    "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                    step.done
                      ? "bg-primary text-primary-foreground"
                      : isNext
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground",
                  ].join(" ")}
                >
                  {step.done ? (
                    <Check className="size-3.5" strokeWidth={2.5} />
                  ) : (
                    index + 1
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span
                      className={[
                        "text-sm font-medium",
                        step.done ? "text-muted-foreground line-through" : "",
                      ].join(" ")}
                    >
                      {step.title}
                    </span>
                    {isNext ? (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary">
                        Sledeće
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {step.description}
                  </span>
                </span>
                {!step.done ? (
                  <Circle className="mt-1 size-3.5 shrink-0 text-muted-foreground/50" />
                ) : null}
              </button>
            </li>
          );
        })}
      </ol>

      {nextStep ? (
        <div className="mt-3 shrink-0">
          <Button
            className="w-full sm:w-auto"
            onClick={() => handleStepActivate(nextStep.id, nextStep.href)}
          >
            {nextStep.title}
          </Button>
        </div>
      ) : (
        <div className="mt-3 shrink-0">
          <Button
            className="w-full sm:w-auto"
            variant="outline"
            nativeButton={false}
            render={<Link href="/applications" />}
          >
            Idi na prijave
          </Button>
        </div>
      )}

      {actionContext ? (
        <>
          <ApplicationFormSheet
            mode="create"
            applicationSources={actionContext.applicationSources}
            hideTrigger
            redirectOnCreate="home"
            open={openSheet === "application"}
            onOpenChange={(open) => {
              if (!open) {
                closeSheet();
              }
            }}
          />

          {canOpenRound ? (
            <RoundFormSheet
              mode="create"
              applicationId={actionContext.primaryApplication!.id}
              existingRoundCount={
                actionContext.primaryApplication!.rounds.length
              }
              interviewTypes={actionContext.interviewTypes}
              hideTrigger
              open={openSheet === "round"}
              onOpenChange={(open) => {
                if (!open) {
                  closeSheet();
                }
              }}
            />
          ) : null}

          {canOpenRoundChildren && targetRoundId ? (
            <>
              <QuestionFormSheet
                mode="create"
                applicationId={actionContext.primaryApplication!.id}
                roundId={targetRoundId}
                hideTrigger
                open={openSheet === "questions"}
                onOpenChange={(open) => {
                  if (!open) {
                    closeSheet();
                  }
                }}
              />
              <SkillEvaluationFormSheet
                mode="create"
                applicationId={actionContext.primaryApplication!.id}
                roundId={targetRoundId}
                skills={actionContext.skills}
                hideTrigger
                open={openSheet === "evaluations"}
                onOpenChange={(open) => {
                  if (!open) {
                    closeSheet();
                  }
                }}
              />
            </>
          ) : null}
        </>
      ) : null}
    </>
  );
}
