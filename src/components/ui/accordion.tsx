"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Implémentation légère d'un accordéon sans dépendance externe,
// suffisante pour la FAQ.

interface AccordionProps {
  children: React.ReactNode;
  className?: string;
}

export function Accordion({ children, className }: AccordionProps) {
  return <div className={cn(className)}>{children}</div>;
}

interface AccordionItemContextValue {
  open: boolean;
  toggle: () => void;
}

const AccordionItemContext = React.createContext<AccordionItemContextValue | null>(null);

interface AccordionItemProps {
  children: React.ReactNode;
  className?: string;
  value?: string; // présent pour compatibilité API, non utilisé
}

export function AccordionItem({ children, className }: AccordionItemProps) {
  const [open, setOpen] = React.useState(false);

  const toggle = React.useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  return (
    <AccordionItemContext.Provider value={{ open, toggle }}>
      <div className={cn("border-b border-navy-700", className)}>{children}</div>
    </AccordionItemContext.Provider>
  );
}

interface AccordionTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionTriggerProps) {
  const ctx = React.useContext(AccordionItemContext);
  if (!ctx) {
    throw new Error("AccordionTrigger must be used within an AccordionItem");
  }

  const { open, toggle } = ctx;

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "w-full flex items-center justify-between py-4 font-medium transition-all hover:underline",
        className,
      )}
      aria-expanded={open}
      {...props}
    >
      <span>{children}</span>
      <ChevronDown
        className={cn(
          "h-4 w-4 shrink-0 transition-transform duration-200",
          open && "rotate-180",
        )}
      />
    </button>
  );
}

interface AccordionContentProps {
  className?: string;
  children: React.ReactNode;
}

export function AccordionContent({ className, children }: AccordionContentProps) {
  const ctx = React.useContext(AccordionItemContext);
  if (!ctx) {
    throw new Error("AccordionContent must be used within an AccordionItem");
  }

  const { open } = ctx;

  if (!open) return null;

  return (
    <div className={cn("pb-4 pt-0 text-sm text-slate-600", className)}>
      {children}
    </div>
  );
}










