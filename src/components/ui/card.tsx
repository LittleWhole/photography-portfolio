import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "group relative rounded-3xl border border-black/10 dark:border-white/10 bg-gradient-to-br from-white via-white/95 to-white/85 dark:from-neutral-900 dark:via-neutral-900/95 dark:to-neutral-900/85 ring-1 ring-black/5 dark:ring-white/10 transition-all duration-300 hover:-translate-y-1",
        "shadow-[0_2px_0_rgba(0,0,0,0.06),0_8px_16px_rgba(0,0,0,0.12),0_24px_48px_-16px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.8),inset_0_-1px_0_rgba(0,0,0,0.06)]",
        "dark:shadow-[0_2px_0_rgba(255,255,255,0.04),0_8px_16px_rgba(0,0,0,0.4),0_24px_48px_-16px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(0,0,0,0.3)]",
        "hover:shadow-[0_4px_0_rgba(0,0,0,0.08),0_12px_24px_rgba(0,0,0,0.15),0_32px_64px_-16px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(0,0,0,0.08)]",
        "hover:dark:shadow-[0_4px_0_rgba(255,255,255,0.06),0_12px_24px_rgba(0,0,0,0.5),0_32px_64px_-16px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.4)]",
        className
      )}
      {...props}
    >
      {/* Subtle gradient overlay for extra depth */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 via-transparent to-black/5 dark:from-white/5 dark:to-black/20 pointer-events-none" />
      <div className="relative z-10">{props.children}</div>
    </div>
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-6 pt-6", className)} {...props} />
  );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-6 pb-6 relative", className)} {...props} />;
}


