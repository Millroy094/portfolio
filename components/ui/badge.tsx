"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

function Badge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg border border-[var(--admin-border-strong)] bg-[var(--admin-surface-muted)] px-2.5 py-1 text-xs font-medium text-[var(--admin-text-muted)] transition-colors",
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
