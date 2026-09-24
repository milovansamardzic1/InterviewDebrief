"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Plus } from "lucide-react";
import type { ApplicationDetailQuestion } from "@interwjuer/contracts";

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
  createQuestionAction,
  updateQuestionAction,
} from "@/features/job-applications/actions/question-mutations";
import { QuestionForm } from "@/features/job-applications/components/question-form";
import {
  buildEmptyQuestionFormValues,
  questionDetailToFormValues,
  toQuestionRequestPayload,
  type QuestionFormValues,
} from "@/features/job-applications/lib/question-form-schema";
import { useControllableOpen } from "@/features/job-applications/lib/use-controllable-open";

type QuestionFormSheetProps = (
  | {
      mode: "create";
      applicationId: string;
      roundId: string;
    }
  | {
      mode: "edit";
      applicationId: string;
      roundId: string;
      question: ApplicationDetailQuestion;
    }
) & {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
};

export function QuestionFormSheet(props: QuestionFormSheetProps) {
  const router = useRouter();
  const { open, setOpen } = useControllableOpen({
    open: props.open,
    onOpenChange: props.onOpenChange,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = props.mode === "edit";
  const formId = isEdit
    ? `edit-question-form-${props.question.id}`
    : `create-question-form-${props.roundId}`;

  const defaultValues: QuestionFormValues = isEdit
    ? questionDetailToFormValues(props.question)
    : buildEmptyQuestionFormValues();

  async function handleSubmit(values: QuestionFormValues) {
    setIsSubmitting(true);
    const payload = toQuestionRequestPayload(values);

    const result = isEdit
      ? await updateQuestionAction(
          props.applicationId,
          props.roundId,
          props.question.id,
          payload,
        )
      : await createQuestionAction(props.applicationId, props.roundId, payload);

    if (!result.success) {
      toast.error(
        isEdit ? "Izmena pitanja nije uspela" : "Dodavanje pitanja nije uspelo",
        result.error,
      );
      setIsSubmitting(false);
      return;
    }

    toast.success(isEdit ? "Pitanje je sačuvano." : "Pitanje je dodato.");
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
              Dodaj pitanje
            </>
          )}
        </SheetTrigger>
      )}

      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Izmena pitanja" : "Novo pitanje"}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Ažuriraj pitanje i odgovor."
              : "Evidentiraj pitanje postavljeno u ovoj rundi."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-2">
          <QuestionForm
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
            {isEdit ? "Sačuvaj izmene" : "Dodaj pitanje"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
