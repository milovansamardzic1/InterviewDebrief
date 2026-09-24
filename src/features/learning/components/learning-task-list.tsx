"use client";

import { useState, useTransition } from "react";
import { Check, CirclePlay, Loader2, RotateCcw, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type {
  LearningTask,
  LearningTaskPriority,
  LearningTaskStatus,
} from "@interwjuer/contracts";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import {
  deleteLearningTaskAction,
  updateLearningTaskAction,
} from "@/features/learning/actions/learning-task-mutations";
import { LearningTaskFormSheet } from "@/features/learning/components/learning-task-form-sheet";

const priorityLabels: Record<LearningTaskPriority, string> = {
  LOW: "Nizak prioritet",
  MEDIUM: "Srednji prioritet",
  HIGH: "Visok prioritet",
};

const statusLabels: Record<LearningTaskStatus, string> = {
  PLANNED: "Planirano",
  IN_PROGRESS: "U toku",
  COMPLETED: "Završeno",
};

function formatDueDate(value: string) {
  return new Date(value).toLocaleDateString("sr-Latn", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function LearningTaskRow({ task }: { task: LearningTask }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function updateStatus(status: LearningTaskStatus) {
    startTransition(async () => {
      const result = await updateLearningTaskAction(task.id, { status });

      if (!result.success) {
        toast.error("Promena statusa nije uspela", result.error);
        return;
      }

      toast.success("Status zadatka je promenjen.");
      router.refresh();
    });
  }

  function deleteTask() {
    startTransition(async () => {
      const result = await deleteLearningTaskAction(task.id);

      if (!result.success) {
        toast.error("Brisanje zadatka nije uspelo", result.error);
        return;
      }

      toast.success("Zadatak je obrisan.");
      router.refresh();
    });
  }

  return (
    <li>
      <article className="rounded-lg border border-border bg-card p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-2">
            <div>
              <h3 className="font-semibold tracking-tight">{task.title}</h3>
              <p className="text-sm text-muted-foreground">
                {task.skillName}
                {task.skillCategory ? ` · ${task.skillCategory}` : ""}
              </p>
            </div>
            <div
              className="flex flex-wrap items-center gap-2"
              aria-label="Detalji zadatka"
            >
              <Badge
                variant={task.priority === "HIGH" ? "destructive" : "outline"}
              >
                {priorityLabels[task.priority]}
              </Badge>
              <Badge
                variant={
                  task.status === "IN_PROGRESS" ? "secondary" : "outline"
                }
              >
                {statusLabels[task.status]}
              </Badge>
              {task.dueDate ? (
                <span className="text-xs text-muted-foreground">
                  Rok: {formatDueDate(task.dueDate)}
                </span>
              ) : null}
            </div>
            {task.notes ? (
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                {task.notes}
              </p>
            ) : null}
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-1">
            {isPending ? (
              <Loader2
                className="mx-2 size-4 animate-spin text-muted-foreground"
                aria-label="Čuvanje izmene"
              />
            ) : task.status === "PLANNED" ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => updateStatus("IN_PROGRESS")}
              >
                <CirclePlay />
                Započni
              </Button>
            ) : null}

            {!isPending && task.status !== "COMPLETED" ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => updateStatus("COMPLETED")}
              >
                <Check />
                Završi
              </Button>
            ) : null}

            {!isPending && task.status === "COMPLETED" ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => updateStatus("IN_PROGRESS")}
              >
                <RotateCcw />
                Ponovo otvori
              </Button>
            ) : null}

            <LearningTaskFormSheet mode="edit" task={task} />

            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Obriši zadatak ${task.title}`}
                    disabled={isPending}
                  />
                }
              >
                <Trash2 />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Obriši zadatak?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Zadatak „{task.title}” biće trajno obrisan. Ova radnja se ne
                    može poništiti.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Otkaži</AlertDialogCancel>
                  <AlertDialogAction onClick={deleteTask}>
                    Obriši
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </article>
    </li>
  );
}

type LearningTaskListProps = {
  tasks: LearningTask[];
};

export function LearningTaskList({ tasks }: LearningTaskListProps) {
  const [showCompleted, setShowCompleted] = useState(false);
  const activeTasks = tasks.filter((task) => task.status !== "COMPLETED");
  const completedTasks = tasks.filter((task) => task.status === "COMPLETED");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {activeTasks.length}{" "}
          {activeTasks.length === 1 ? "aktivan zadatak" : "aktivnih zadataka"}
        </p>
        {completedTasks.length > 0 ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-expanded={showCompleted}
            aria-controls="completed-learning-tasks"
            onClick={() => setShowCompleted((current) => !current)}
          >
            {showCompleted ? "Sakrij završene" : "Prikaži završene"} (
            {completedTasks.length})
          </Button>
        ) : null}
      </div>

      {activeTasks.length > 0 ? (
        <ul className="grid gap-3">
          {activeTasks.map((task) => (
            <LearningTaskRow key={task.id} task={task} />
          ))}
        </ul>
      ) : (
        <div className="rounded-lg border border-dashed px-5 py-8 text-center">
          <p className="font-medium">Nema aktivnih zadataka.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Dodaj zadatak iz preporučenih fokusa ispod.
          </p>
        </div>
      )}

      {showCompleted ? (
        <section id="completed-learning-tasks" className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Završeni zadaci
          </h3>
          <ul className="grid gap-3">
            {completedTasks.map((task) => (
              <LearningTaskRow key={task.id} task={task} />
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
