"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";

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
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { deleteQuestionAction } from "@/features/job-applications/actions/question-mutations";

type DeleteQuestionButtonProps = {
  applicationId: string;
  roundId: string;
  questionId: string;
};

export function DeleteQuestionButton({
  applicationId,
  roundId,
  questionId,
}: DeleteQuestionButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    const result = await deleteQuestionAction(
      applicationId,
      roundId,
      questionId,
    );

    if (!result.success) {
      toast.error("Brisanje pitanja nije uspelo", result.error);
      setIsDeleting(false);
      return;
    }

    toast.success("Pitanje je obrisano.");
    router.refresh();
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="ghost" size="sm" />}>
        <Trash2 />
        Obriši
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Obriši pitanje?</AlertDialogTitle>
          <AlertDialogDescription>
            Ova akcija je nepovratna.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Otkaži</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? <Loader2 className="animate-spin" /> : null}
            Obriši
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
