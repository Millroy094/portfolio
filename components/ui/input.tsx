"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-lg border border-[var(--admin-border-strong)] bg-[var(--admin-input-bg)] px-4 py-3 text-sm text-[var(--admin-text)] placeholder:text-[var(--admin-text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--admin-focus-offset)] disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-[var(--admin-input-disabled-bg)] disabled:border-[var(--admin-border)] transition-colors",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
