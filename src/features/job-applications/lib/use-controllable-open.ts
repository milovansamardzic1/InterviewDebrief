"use client";

import { useState } from "react";

type ControllableOpenArgs = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

/** Controlled when `open` is passed; otherwise local sheet state. */
export function useControllableOpen({
  open,
  onOpenChange,
}: ControllableOpenArgs) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = open !== undefined;

  return {
    open: isControlled ? open : uncontrolledOpen,
    setOpen(next: boolean) {
      if (!isControlled) {
        setUncontrolledOpen(next);
      }
      onOpenChange?.(next);
    },
  };
}
