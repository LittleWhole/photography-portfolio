import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-md border border-black/15 bg-white/60 dark:bg-white/5 px-3 text-sm outline-none ring-0 placeholder:text-neutral-500 focus:border-black/30 dark:focus:border-white/30",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";


