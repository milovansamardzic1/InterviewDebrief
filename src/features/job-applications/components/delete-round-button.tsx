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
import { deleteInterviewRoundAction } from "@/features/job-applications/actions/round-mutations";

type DeleteRoundButtonProps = {
  applicationId: string;
  roundId: string;
  roundLabel: string;
};

export function DeleteRoundButton({
  applicationId,
  roundId,
  roundLabel,
}: DeleteRoundButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    const result = await deleteInterviewRoundAction(applicationId, roundId);

    if (!result.success) {
      toast.error("Brisanje runde nije uspelo", result.error);
      setIsDeleting(false);
      return;
    }

    toast.success("Runda je obrisana.");
    router.refresh();
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="destructive" size="sm" />}>
        <Trash2 />
        Obriši
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Obriši {roundLabel}?</AlertDialogTitle>
          <AlertDialogDescription>
            Ova akcija je nepovratna. Sva pitanja i skill evaluacije vezane za
            ovu rundu će takođe biti obrisane.
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
