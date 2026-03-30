"use client";

import { useState } from "react";
import {
  Collapsible as UICollapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { ComponentProps } from "react";

interface CollapsibleProps
  extends Omit<ComponentProps<typeof UICollapsible>, "open" | "onOpenChange"> {
  /** Chave única no localStorage para persistir o estado aberto/fechado */
  storageKey: string;
  defaultOpen?: boolean;
}

export default function Collapsible({
  storageKey,
  defaultOpen = true,
  children,
  ...props
}: CollapsibleProps) {
  const [open, setOpen] = useState<boolean>(() => {
    if (typeof window === "undefined") return defaultOpen;
    const stored = localStorage.getItem(storageKey);
    return stored !== null ? stored === "true" : defaultOpen;
  });

  function handleOpenChange(next: boolean) {
    setOpen(next);
    localStorage.setItem(storageKey, String(next));
  }

  return (
    <UICollapsible open={open} onOpenChange={handleOpenChange} {...props}>
      {children}
    </UICollapsible>
  );
}

export { CollapsibleContent, CollapsibleTrigger };
