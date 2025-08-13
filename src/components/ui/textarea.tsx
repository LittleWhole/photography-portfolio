import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex w-full rounded-md border border-black/15 bg-white/60 dark:bg-white/5 px-3 py-2 text-sm outline-none ring-0 placeholder:text-neutral-500 focus:border-black/30 dark:focus:border-white/30",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";


