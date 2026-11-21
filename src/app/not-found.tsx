import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <Link href="/" className="font-display text-4xl font-bold">
        Wed<span className="text-primary">Plan</span>
      </Link>

      <p className="font-display mt-10 text-8xl font-bold text-primary/80">404</p>
      <h1 className="font-display mt-2 text-4xl font-bold">
        This page could not be found
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        The page you are looking for may have moved or may not exist. Let us get
        you back to planning.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild className="rounded-full px-6">
          <Link href="/">Back to home</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full px-6">
          <Link href="/services">Browse services</Link>
        </Button>
      </div>
    </main>
  );
}