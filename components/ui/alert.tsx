"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type AlertVariant = "default" | "info" | "warning" | "error";

const variantStyles: Record<AlertVariant, string> = {
  default:
    "border-[var(--admin-border-strong)] bg-[var(--admin-surface-muted)] text-[var(--admin-text)]",
  info: "border-blue-500 bg-blue-100 text-blue-900 dark:border-blue-500/40 dark:bg-blue-500/20 dark:text-blue-200",
  warning:
    "border-amber-500 bg-amber-100 text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/20 dark:text-amber-200",
  error:
    "border-red-700/50 dark:border-red-700/50 bg-red-100/80 dark:bg-red-950/30 text-red-900 dark:text-red-100",
};

function Alert({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & { variant?: AlertVariant }) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-lg border px-4 py-3 text-sm transition-colors",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}

export { Alert };
