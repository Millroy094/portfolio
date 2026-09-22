"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type AlertVariant = "default" | "info" | "warning" | "error";

const variantStyles: Record<AlertVariant, string> = {
  default:
    "border-[var(--admin-border-strong)] bg-[var(--admin-surface-muted)] text-[var(--admin-text)]",
  info: "border-[var(--admin-alert-info-border)] bg-[var(--admin-alert-info-bg)] text-[var(--admin-alert-info-text)]",
  warning:
    "border-[var(--admin-alert-warning-border)] bg-[var(--admin-alert-warning-bg)] text-[var(--admin-alert-warning-text)]",
  error:
    "border-[var(--admin-alert-error-border)] bg-[var(--admin-alert-error-bg)] text-[var(--admin-alert-error-text)]",
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
