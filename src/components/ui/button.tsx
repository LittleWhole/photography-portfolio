"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
    const variants = {
      default:
        "bg-black text-white dark:bg-white dark:text-black hover:opacity-90 border border-black/15",
      outline:
        "bg-transparent text-black dark:text-white border border-black/15 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10",
      ghost: "bg-transparent text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10",
    } as const;
    const sizes = {
      sm: "h-9 px-3 text-sm",
      md: "h-10 px-4 text-sm",
      lg: "h-11 px-5 text-base",
    } as const;

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";


