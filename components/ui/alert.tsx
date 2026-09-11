"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type AlertVariant = "default" | "info" | "warning" | "error";

const variantStyles: Record<AlertVariant, string> = {
  default:
    "border-[var(--admin-border-strong)] bg-[var(--admin-surface-muted)] text-[var(--admin-text)]",
  info: "border-blue-700/50 bg-blue-950/30 text-blue-200",
  warning: "border-amber-700/50 bg-amber-950/30 text-amber-100",
  error: "border-red-700/50 bg-red-950/30 text-red-100",
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
