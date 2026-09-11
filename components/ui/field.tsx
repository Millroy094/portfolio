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
    <label className={cn("block w-full", className)}>
      <span className="mb-2 block text-sm font-medium text-neutral-300">{label}</span>
      {children}
      <span
        className={cn(
          "mt-1.5 block min-h-4 text-xs transition-colors",
          error ? "text-red-400" : "text-transparent",
        )}
      >
        {error ?? "."}
      </span>
    </label>
  );
}
