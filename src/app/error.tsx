"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <Link href="/" className="font-display text-4xl font-bold">
        Wed<span className="text-primary">Plan</span>
      </Link>

      <h1 className="font-display mt-10 text-5xl font-bold">Something went wrong</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        An unexpected error happened on our side. Please try again, and if the
        problem continues, come back in a few minutes.
      </p>
      {error.digest && (
        <p className="mt-2 text-xs text-muted-foreground">
          Reference: {error.digest}
        </p>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button className="rounded-full px-6" onClick={() => reset()}>
          Try again
        </Button>
        <Button asChild variant="outline" className="rounded-full px-6">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </main>
  );
}