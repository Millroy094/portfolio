"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all outline-none disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 focus-visible:ring-neutral-400",
  {
    variants: {
      variant: {
        default:
          "bg-neutral-700 text-neutral-100 border border-neutral-600 hover:bg-neutral-600 hover:border-neutral-500 active:bg-neutral-500",
        destructive: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
        outline:
          "border border-neutral-600 text-neutral-100 hover:bg-neutral-900/70 hover:border-neutral-500 active:bg-neutral-900",
        secondary: "bg-neutral-800 text-neutral-100 hover:bg-neutral-700 active:bg-neutral-600",
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
