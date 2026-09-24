"use client";

import { useState } from "react";
import { Loader2, Pencil, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import type { LearningTask } from "@interwjuer/contracts";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "@/components/ui/toast";
import {
  createLearningTaskAction,
  updateLearningTaskAction,
} from "@/features/learning/actions/learning-task-mutations";
import { LearningTaskForm } from "@/features/learning/components/learning-task-form";
import {
  buildLearningTaskFormValues,
  learningTaskToFormValues,
  toLearningTaskRequestPayload,
  type LearningTaskFormValues,
} from "@/features/learning/lib/learning-task-form-schema";

type LearningTaskFormSheetProps =
  | {
      mode: "create";
      skillId: string;
      skillName: string;
    }
  | {
      mode: "edit";
      task: LearningTask;
    };

export function LearningTaskFormSheet(props: LearningTaskFormSheetProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEdit = props.mode === "edit";
  const formId = isEdit
    ? `edit-learning-task-form-${props.task.id}`
    : `create-learning-task-form-${props.skillId}`;
  const skillName = isEdit ? props.task.skillName : props.skillName;
  const defaultValues = isEdit
    ? learningTaskToFormValues(props.task)
    : buildLearningTaskFormValues(`Vežbaj: ${props.skillName}`);

  async function handleSubmit(values: LearningTaskFormValues) {
    setIsSubmitting(true);
    const payload = toLearningTaskRequestPayload(values);
    const result = isEdit
      ? await updateLearningTaskAction(props.task.id, payload)
      : await createLearningTaskAction({
          ...payload,
          skillId: props.skillId,
        });

    if (!result.success) {
      toast.error(
        isEdit ? "Izmena zadatka nije uspela" : "Dodavanje zadatka nije uspelo",
        result.error,
      );
      setIsSubmitting(false);
      return;
    }

    toast.success(isEdit ? "Zadatak je sačuvan." : "Zadatak je dodat.");
    setOpen(false);
    setIsSubmitting(false);
    router.refresh();
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          isEdit ? (
            <Button variant="ghost" size="sm" />
          ) : (
            <Button variant="outline" size="sm" />
          )
        }
      >
        {isEdit ? <Pencil /> : <Plus />}
        {isEdit ? "Izmeni" : "Dodaj zadatak"}
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Izmeni zadatak" : "Novi zadatak"}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? `Ažuriraj zadatak za ${skillName}.`
              : `Dodaj konkretan korak za ${skillName}.`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-2">
          <LearningTaskForm
            key={open ? "open" : "closed"}
            formId={formId}
            defaultValues={defaultValues}
            disabled={isSubmitting}
            onSubmit={handleSubmit}
          />
        </div>

        <SheetFooter className="flex-row justify-end gap-2 border-t border-border">
          <SheetClose render={<Button type="button" variant="outline" />}>
            Otkaži
          </SheetClose>
          <Button type="submit" form={formId} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : null}
            {isEdit ? "Sačuvaj izmene" : "Dodaj zadatak"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
