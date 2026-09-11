"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

function Badge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg border border-neutral-700 px-2.5 py-1 text-xs font-medium text-neutral-300 bg-neutral-900/60 transition-colors",
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
