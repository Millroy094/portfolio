"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type FieldProps = {
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactElement<{ "aria-describedby"?: string; "aria-invalid"?: boolean }>;
};

export function Field({ label, error, required, className, children }: FieldProps) {
  const errorId = React.useId();
  const child = React.isValidElement(children)
    ? React.cloneElement(children, {
        "aria-describedby": error ? errorId : undefined,
        "aria-invalid": !!error,
        ...(required ? { "aria-required": true } : {}),
      })
    : children;

  return (
    <div className={cn("w-full relative", className)}>
      <label className="relative block">
        {child}
        <span className="pointer-events-none absolute left-3.5 -top-2 rounded-sm bg-[var(--admin-field-label-bg)] px-1 text-xs font-medium text-[var(--admin-field-label-text)] transition-colors">
          {label}
          {required && (
            <>
              <span aria-hidden="true"> *</span>
              <span className="sr-only"> (required)</span>
            </>
          )}
        </span>
      </label>
      <span
        id={errorId}
        role={error ? "alert" : undefined}
        aria-live="polite"
        className={cn(
          "mt-1.5 block min-h-4 text-xs transition-colors",
          error ? "text-red-400" : "text-transparent",
        )}
      >
        {error ?? "."}
      </span>
    </div>
  );
}
