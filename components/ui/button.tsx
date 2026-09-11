"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all outline-none disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--admin-focus-offset)] focus-visible:ring-neutral-400",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--admin-btn-bg)] text-[var(--admin-btn-text)] border border-[var(--admin-btn-border)] hover:bg-[var(--admin-btn-bg-hover)] active:bg-[var(--admin-btn-bg-active)]",
        destructive: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
        outline:
          "border border-[var(--admin-btn-border)] text-[var(--admin-btn-outline-text)] hover:bg-[var(--admin-btn-outline-bg-hover)] active:bg-[var(--admin-btn-outline-bg-active)]",
        secondary:
          "bg-[var(--admin-btn-secondary-bg)] text-[var(--admin-btn-secondary-text)] hover:bg-[var(--admin-btn-secondary-bg-hover)] active:bg-[var(--admin-btn-secondary-bg-active)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-11 px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  ),
);
Button.displayName = "Button";

export { Button, buttonVariants };
