"use client";

import ErrorPage from "@/components/ErrorPage";

export default function GlobalRootError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body>
        <ErrorPage
          code="500"
          title="Something went wrong"
          description="An unexpected error occurred. You can go back home or try the action again."
          onReset={reset}
        />
      </body>
    </html>
  );
}


