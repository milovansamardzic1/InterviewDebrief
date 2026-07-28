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
import { deleteSkillEvaluationAction } from "@/features/job-applications/actions/skill-evaluation-mutations";

type DeleteSkillEvaluationButtonProps = {
  applicationId: string;
  roundId: string;
  evaluationId: string;
};

export function DeleteSkillEvaluationButton({
  applicationId,
  roundId,
  evaluationId,
}: DeleteSkillEvaluationButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    const result = await deleteSkillEvaluationAction(
      applicationId,
      roundId,
      evaluationId,
    );

    if (!result.success) {
      toast.error("Brisanje skill evaluacije nije uspelo", result.error);
      setIsDeleting(false);
      return;
    }

    toast.success("Skill evaluacija je obrisana.");
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
          <AlertDialogTitle>Obriši skill evaluaciju?</AlertDialogTitle>
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
