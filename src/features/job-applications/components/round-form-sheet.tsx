"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Plus } from "lucide-react";
import type {
  ApplicationDetailRound,
  InterviewTypeItem,
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
  createInterviewRoundAction,
  updateInterviewRoundAction,
} from "@/features/job-applications/actions/round-mutations";
import { RoundForm } from "@/features/job-applications/components/round-form";
import {
  buildEmptyRoundFormValues,
  roundDetailToFormValues,
  toInterviewRoundRequestPayload,
  type RoundFormValues,
} from "@/features/job-applications/lib/round-form-schema";

type RoundFormSheetProps =
  | {
      mode: "create";
      applicationId: string;
      existingRoundCount: number;
      interviewTypes: InterviewTypeItem[];
    }
  | {
      mode: "edit";
      applicationId: string;
      round: ApplicationDetailRound;
      interviewTypes: InterviewTypeItem[];
    };

export function RoundFormSheet(props: RoundFormSheetProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = props.mode === "edit";
  const formId = isEdit
    ? `edit-round-form-${props.round.id}`
    : `create-round-form-${props.applicationId}`;

  const currentInterviewTypeId = isEdit
    ? (props.interviewTypes.find(
        (type) => type.name === props.round.interviewTypeName,
      )?.id ?? "")
    : "";

  const defaultValues: RoundFormValues = isEdit
    ? roundDetailToFormValues(props.round, currentInterviewTypeId)
    : buildEmptyRoundFormValues();

  async function handleSubmit(values: RoundFormValues) {
    setIsSubmitting(true);
    const payload = toInterviewRoundRequestPayload(values);

    const result = isEdit
      ? await updateInterviewRoundAction(
          props.applicationId,
          props.round.id,
          payload,
        )
      : await createInterviewRoundAction(props.applicationId, {
          ...payload,
          sortOrder: props.existingRoundCount + 1,
        });

    if (!result.success) {
      toast.error(
        isEdit ? "Izmena runde nije uspela" : "Kreiranje runde nije uspelo",
        result.error,
      );
      setIsSubmitting(false);
      return;
    }

    toast.success(isEdit ? "Runda je sačuvana." : "Runda je dodata.");
    setOpen(false);
    setIsSubmitting(false);
    router.refresh();
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          isEdit ? <Button variant="outline" size="sm" /> : <Button size="sm" />
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
            Dodaj rundu
          </>
        )}
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Izmena runde" : "Nova runda"}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Ažuriraj podatke o intervju rundi."
              : "Dodaj novu rundu u intervju proces."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-2">
          <RoundForm
            formId={formId}
            defaultValues={defaultValues}
            interviewTypes={props.interviewTypes}
            currentStatus={isEdit ? props.round.status : undefined}
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
            {isEdit ? "Sačuvaj izmene" : "Dodaj rundu"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
