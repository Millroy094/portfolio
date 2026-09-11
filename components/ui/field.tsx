"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type FieldProps = {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
};

export function Field({ label, error, className, children }: FieldProps) {
  return (
    <div className={cn("w-full relative", className)}>
      <label className="relative block">
        {children}
        <span className="pointer-events-none absolute left-3.5 -top-2 rounded-sm bg-[var(--admin-field-label-bg)] px-1 text-xs font-medium text-[var(--admin-field-label-text)] transition-colors">
          {label}
        </span>
      </label>
      <span
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
