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
import { deleteApplicationAction } from "@/features/job-applications/actions/application-mutations";

type DeleteApplicationButtonProps = {
  applicationId: string;
  company: string;
};

export function DeleteApplicationButton({
  applicationId,
  company,
}: DeleteApplicationButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    const result = await deleteApplicationAction(applicationId);

    if (!result.success) {
      toast.error("Brisanje prijave nije uspelo", result.error);
      setIsDeleting(false);
      return;
    }

    toast.success("Prijava je obrisana.");
    router.push("/applications");
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
          <AlertDialogTitle>Obriši prijavu za {company}?</AlertDialogTitle>
          <AlertDialogDescription>
            Ova akcija je nepovratna. Sve intervju runde, pitanja i skill
            evaluacije vezane za ovu prijavu će takođe biti obrisane.
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
