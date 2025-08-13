"use client";

import ErrorPage from "@/components/ErrorPage";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <ErrorPage
      code="500"
      title="Something went wrong"
      description="An unexpected error occurred. You can go back home or try the action again."
      onReset={reset}
    />
  );
}


