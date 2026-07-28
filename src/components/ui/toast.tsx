"use client";

import type { ReactNode } from "react";
import { Toast as ToastPrimitive } from "@base-ui/react/toast";
import { CheckCircle2Icon, XCircleIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const toastManager = ToastPrimitive.createToastManager();

export const toast = {
  success(title: string, description?: string) {
    toastManager.add({ title, description, type: "success" });
  },
  error(title: string, description?: string) {
    toastManager.add({ title, description, type: "error" });
  },
};

function ToastViewport({ children }: { children: ReactNode }) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      className="fixed right-4 bottom-4 z-[100] flex w-full max-w-sm flex-col gap-2 outline-none"
    >
      {children}
    </ToastPrimitive.Viewport>
  );
}

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager();

  return (
    <>
      {toasts.map((item) => {
        const isError = item.type === "error";

        return (
          <ToastPrimitive.Root
            key={item.id}
            toast={item}
            className={cn(
              "relative flex w-full items-start gap-3 rounded-lg border bg-popover bg-clip-padding p-4 text-sm text-popover-foreground shadow-lg transition-[transform,opacity] duration-200 ease-out data-ending-style:opacity-0 data-starting-style:translate-y-2 data-starting-style:opacity-0",
              isError ? "border-destructive/30" : "border-border",
            )}
          >
            {isError ? (
              <XCircleIcon
                className="mt-0.5 size-4 shrink-0 text-destructive"
                strokeWidth={2}
              />
            ) : (
              <CheckCircle2Icon
                className="mt-0.5 size-4 shrink-0 text-primary"
                strokeWidth={2}
              />
            )}

            <div className="min-w-0 flex-1 space-y-1">
              <ToastPrimitive.Title className="font-medium text-foreground" />
              <ToastPrimitive.Description className="text-muted-foreground" />
            </div>

            <ToastPrimitive.Close
              className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Zatvori obaveštenje"
            >
              <XIcon className="size-4" strokeWidth={2} />
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        );
      })}
    </>
  );
}

export function Toaster() {
  return (
    <ToastPrimitive.Provider toastManager={toastManager}>
      <ToastPrimitive.Portal>
        <ToastViewport>
          <ToastList />
        </ToastViewport>
      </ToastPrimitive.Portal>
    </ToastPrimitive.Provider>
  );
}
