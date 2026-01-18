"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function LoadingSpinner({ className, ...props }: LoadingSpinnerProps) {
  return (
    <div {...props}>
      <Loader2 className={cn("h-4 w-4 animate-spin text-navy-600", className)} />
    </div>
  );
}
