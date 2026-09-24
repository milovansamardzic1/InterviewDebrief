"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Plus } from "lucide-react";
import type {
  ApplicationDetail,
  ApplicationSourceItem,
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
  createApplicationAction,
  updateApplicationAction,
} from "@/features/job-applications/actions/application-mutations";
import { ApplicationForm } from "@/features/job-applications/components/application-form";
import {
  applicationDetailToFormValues,
  buildEmptyApplicationFormValues,
  toApplicationRequestPayload,
  type ApplicationFormValues,
} from "@/features/job-applications/lib/application-form-schema";
import { useControllableOpen } from "@/features/job-applications/lib/use-controllable-open";

type ApplicationFormSheetProps = (
  | {
      mode: "create";
      applicationSources: ApplicationSourceItem[];
    }
  | {
      mode: "edit";
      application: ApplicationDetail;
      applicationSources: ApplicationSourceItem[];
    }
) & {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
  /** Where to go after a successful create. Default: new application detail. */
  redirectOnCreate?: "detail" | "home" | "none";
};

export function ApplicationFormSheet(props: ApplicationFormSheetProps) {
  const router = useRouter();
  const { open, setOpen } = useControllableOpen({
    open: props.open,
    onOpenChange: props.onOpenChange,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = props.mode === "edit";
  const formId = isEdit
    ? `edit-application-form-${props.application.id}`
    : "create-application-form";

  const currentApplicationSourceId = isEdit
    ? (props.applicationSources.find(
        (source) => source.name === props.application.sourceName,
      )?.id ?? "")
    : "";

  const defaultValues: ApplicationFormValues = isEdit
    ? applicationDetailToFormValues(
        props.application,
        currentApplicationSourceId,
      )
    : buildEmptyApplicationFormValues();

  async function handleSubmit(values: ApplicationFormValues) {
    setIsSubmitting(true);
    const payload = toApplicationRequestPayload(values);

    const result = isEdit
      ? await updateApplicationAction(props.application.id, payload)
      : await createApplicationAction(payload);

    if (!result.success) {
      toast.error(
        isEdit ? "Izmena prijave nije uspela" : "Kreiranje prijave nije uspelo",
        result.error,
      );
      setIsSubmitting(false);
      return;
    }

    toast.success(isEdit ? "Prijava je sačuvana." : "Prijava je kreirana.");
    setOpen(false);
    setIsSubmitting(false);

    if (isEdit) {
      router.refresh();
      return;
    }

    const redirect = props.redirectOnCreate ?? "detail";
    if (redirect === "detail") {
      router.push(`/applications/${result.application.id}`);
    } else if (redirect === "home") {
      router.push("/");
    }
    router.refresh();
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {props.hideTrigger ? null : (
        <SheetTrigger
          render={isEdit ? <Button variant="outline" size="sm" /> : <Button />}
        >
          {isEdit ? (
            <>
              <Pencil />
              Izmeni
            </>
          ) : (
            <>
              <Plus />
              Nova prijava
            </>
          )}
        </SheetTrigger>
      )}

      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Izmena prijave" : "Nova prijava"}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Ažuriraj podatke o prijavi."
              : "Unesi podatke o novoj prijavi na poziciju."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-2">
          <ApplicationForm
            formId={formId}
            defaultValues={defaultValues}
            applicationSources={props.applicationSources}
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
            {isEdit ? "Sačuvaj izmene" : "Kreiraj prijavu"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
