"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authFetch } from "@/lib/auth-fetch";
import { formatDate } from "@/lib/format";

type PaymentStatus = {
  isPremium: boolean;
  expiresAt: string | null;
};

type State = "checking" | "active" | "pending" | "error";

const MAX_ATTEMPTS = 10;

export default function PaymentSuccessPage() {
  const [state, setState] = useState<State>("checking");
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  // This page never activates Premium. It only asks the server whether the
  // Stripe webhook has already done it.
  useEffect(() => {
    let cancelled = false;

    async function check(attempt: number) {
      try {
        const status = await authFetch<PaymentStatus>("/api/payments/status");
        if (cancelled) return;

        if (status.isPremium) {
          setExpiresAt(status.expiresAt);
          setState("active");
          return;
        }
        if (attempt >= MAX_ATTEMPTS) {
          setState("pending");
          return;
        }
        setTimeout(() => check(attempt + 1), 2000);
      } catch {
        if (!cancelled) setState("error");
      }
    }

    check(1);
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="mx-auto max-w-lg px-6 py-24 text-center">
      {state === "checking" && (
        <>
          <Loader2 className="mx-auto size-14 animate-spin text-primary" />
          <h1 className="font-display mt-6 text-4xl font-bold">Confirming your payment</h1>
          <p className="mt-3 text-muted-foreground">
            Please wait a moment while we confirm your payment with Stripe.
          </p>
        </>
      )}

      {state === "active" && (
        <>
          <CheckCircle2 className="mx-auto size-14 text-[#3f5c4c]" />
          <h1 className="font-display mt-6 text-4xl font-bold">You are now Premium</h1>
          <p className="mt-3 text-muted-foreground">
            Thank you! You can now publish unlimited services.
            {expiresAt && ` Your plan is active until ${formatDate(expiresAt)}.`}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild className="rounded-full">
              <Link href="/dashboard/vendor/add-service">Add a service</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/dashboard/vendor">Go to dashboard</Link>
            </Button>
          </div>
        </>
      )}

      {state === "pending" && (
        <>
          <Clock className="mx-auto size-14 text-primary" />
          <h1 className="font-display mt-6 text-4xl font-bold">Payment received</h1>
          <p className="mt-3 text-muted-foreground">
            Your payment is being processed. Premium turns on as soon as Stripe
            confirms it, which usually takes only a few seconds. Please check
            your subscription page in a moment.
          </p>
          <div className="mt-8">
            <Button asChild className="rounded-full">
              <Link href="/dashboard/vendor/subscription">View subscription</Link>
            </Button>
          </div>
        </>
      )}

      {state === "error" && (
        <>
          <h1 className="font-display text-4xl font-bold">We could not check your plan</h1>
          <p className="mt-3 text-muted-foreground">
            Please sign in and open your subscription page to see your plan.
          </p>
          <div className="mt-8">
            <Button asChild className="rounded-full">
              <Link href="/dashboard/vendor/subscription">Open subscription</Link>
            </Button>
          </div>
        </>
      )}
    </section>
  );
}