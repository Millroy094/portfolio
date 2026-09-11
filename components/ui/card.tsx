"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text)] shadow-lg transition-all",
        className,
      )}
      {...props}
    />
  );
}

export { Card };
