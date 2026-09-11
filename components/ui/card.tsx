"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-lg border border-neutral-800/40 bg-neutral-950 text-neutral-100 shadow-lg transition-all",
        className,
      )}
      {...props}
    />
  );
}

export { Card };
