"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ErrorPageProps = {
  code: string;
  title?: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  className?: string;
  onReset?: () => void; // optional for error boundary reset
};

export default function ErrorPage({
  code,
  title,
  description,
  actionHref = "/",
  actionLabel = "Back to Home",
  className,
  onReset,
}: ErrorPageProps) {
  return (
    <div className={cn("relative mx-auto max-w-3xl text-center py-16 sm:py-24", className)}>
      <BackgroundDecor />

      <div className="space-y-3">
        <div className="text-[64px] sm:text-[96px] md:text-[128px] font-extrabold leading-none tracking-tight bg-gradient-to-b from-black to-neutral-600 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">
          {code}
        </div>
        {title && (
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">{title}</h1>
        )}
        {description && (
          <p className="text-neutral-700 dark:text-neutral-300 max-w-prose mx-auto">
            {description}
          </p>
        )}
      </div>

      <div className="mt-8 flex items-center justify-center gap-3">
        <Link href={actionHref}>
          <Button size="lg">{actionLabel}</Button>
        </Link>
        {onReset && (
          <Button size="lg" variant="outline" onClick={onReset}>
            Try again
          </Button>
        )}
      </div>
    </div>
  );
}

function BackgroundDecor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[320px] w-[620px] rounded-full blur-3xl opacity-20 dark:opacity-25 bg-gradient-to-b from-black/30 to-transparent dark:from-white/30" />
    </div>
  );
}


