"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Plus } from "lucide-react";
import type {
  ApplicationDetailSkillEvaluation,
  SkillItem,
} from "@interwjuer/contracts";

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
  createSkillEvaluationAction,
  updateSkillEvaluationAction,
} from "@/features/job-applications/actions/skill-evaluation-mutations";
import { SkillEvaluationForm } from "@/features/job-applications/components/skill-evaluation-form";
import {
  buildEmptySkillEvaluationFormValues,
  skillEvaluationDetailToFormValues,
  toSkillEvaluationRequestPayload,
  type SkillEvaluationFormValues,
} from "@/features/job-applications/lib/skill-evaluation-form-schema";
import { useControllableOpen } from "@/features/job-applications/lib/use-controllable-open";

type SkillEvaluationFormSheetProps = (
  | {
      mode: "create";
      applicationId: string;
      roundId: string;
      skills: SkillItem[];
    }
  | {
      mode: "edit";
      applicationId: string;
      roundId: string;
      evaluation: ApplicationDetailSkillEvaluation;
      skills: SkillItem[];
    }
) & {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
};

export function SkillEvaluationFormSheet(props: SkillEvaluationFormSheetProps) {
  const router = useRouter();
  const { open, setOpen } = useControllableOpen({
    open: props.open,
    onOpenChange: props.onOpenChange,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = props.mode === "edit";
  const formId = isEdit
    ? `edit-skill-evaluation-form-${props.evaluation.id}`
    : `create-skill-evaluation-form-${props.roundId}`;

  const currentSkillId = isEdit
    ? (props.skills.find((skill) => skill.name === props.evaluation.skillName)
        ?.id ?? "")
    : "";

  const defaultValues: SkillEvaluationFormValues = isEdit
    ? skillEvaluationDetailToFormValues(props.evaluation, currentSkillId)
    : buildEmptySkillEvaluationFormValues();

  async function handleSubmit(values: SkillEvaluationFormValues) {
    setIsSubmitting(true);
    const payload = toSkillEvaluationRequestPayload(values);

    const result = isEdit
      ? await updateSkillEvaluationAction(
          props.applicationId,
          props.roundId,
          props.evaluation.id,
          { score: payload.score, notes: payload.notes },
        )
      : await createSkillEvaluationAction(
          props.applicationId,
          props.roundId,
          payload,
        );

    if (!result.success) {
      toast.error(
        isEdit
          ? "Izmena skill evaluacije nije uspela"
          : "Dodavanje skill evaluacije nije uspelo",
        result.error,
      );
      setIsSubmitting(false);
      return;
    }

    toast.success(
      isEdit ? "Skill evaluacija je sačuvana." : "Skill evaluacija je dodata.",
    );
    setOpen(false);
    setIsSubmitting(false);
    router.refresh();
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {props.hideTrigger ? null : (
        <SheetTrigger
          render={
            isEdit ? (
              <Button variant="ghost" size="sm" />
            ) : (
              <Button variant="outline" size="sm" />
            )
          }
        >
          {isEdit ? (
            <>
              <Pencil />
              Izmeni
            </>
          ) : (
            <>
              <Plus />
              Dodaj evaluaciju
            </>
          )}
        </SheetTrigger>
      )}

      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>
            {isEdit ? "Izmena skill evaluacije" : "Nova skill evaluacija"}
          </SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Ažuriraj ocenu i napomene."
              : "Oceni veštinu na osnovu ove runde intervjua."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-2">
          <SkillEvaluationForm
            formId={formId}
            defaultValues={defaultValues}
            skills={props.skills}
            allowSkillChange={!isEdit}
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
            {isEdit ? "Sačuvaj izmene" : "Dodaj evaluaciju"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
