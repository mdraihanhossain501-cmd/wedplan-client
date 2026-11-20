"use client";

import { useState } from "react";
import { Check, Crown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthData } from "@/hooks/useAuthData";
import { authFetch } from "@/lib/auth-fetch";
import { FREE_ACTIVE_LIMIT, PREMIUM_PRICE_USD } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/dashboard/PageHeader";
import { ErrorState } from "@/components/dashboard/States";

type PaymentStatus = {
  isPremium: boolean;
  plan: string;
  expiresAt: string | null;
};

const freeFeatures = [
  `Up to ${FREE_ACTIVE_LIMIT} active services`,
  "Appear in browse and search",
  "Receive booking requests",
];

const premiumFeatures = [
  "Unlimited active services",
  "Premium Vendor badge on every service",
  "Listed before Free vendors",
  "Receive booking requests",
];

export default function SubscriptionPage() {
  const { data, loading, error, reload } =
    useAuthData<PaymentStatus>("/api/payments/status");
  const [redirecting, setRedirecting] = useState(false);

  async function upgrade() {
    setRedirecting(true);
    try {
      const result = await authFetch<{ url: string | null }>(
        "/api/payments/checkout-session",
        { method: "POST" }
      );
      if (!result.url) throw new Error("Could not start checkout");
      window.location.href = result.url;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not start checkout");
      setRedirecting(false);
    }
  }

  const premium = Boolean(data?.isPremium);

  return (
    <>
      <PageHeader
        title="Subscription"
        description="Choose the plan that fits your business."
      />

      {loading ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : (
        <div className="space-y-6">
          <div className="rounded-2xl bg-[#f1e4cc] p-6">
            <p className="text-sm text-[#4a3a12]">Your current plan</p>
            <p className="font-display text-4xl font-bold capitalize">
              {premium ? "Premium" : "Free"}
            </p>
            {premium && data?.expiresAt && (
              <p className="mt-1 text-sm text-[#4a3a12]">
                Active until {formatDate(data.expiresAt)}. It renews automatically
                each month.
              </p>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="flex flex-col rounded-2xl border bg-card p-6">
              <h2 className="font-display text-3xl font-bold">Free</h2>
              <p className="mt-1 text-4xl font-bold">
                $0<span className="text-base font-normal text-muted-foreground"> / month</span>
              </p>
              <ul className="mt-6 flex-1 space-y-3 text-sm">
                {freeFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="mt-8" disabled>
                {premium ? "Included" : "Current plan"}
              </Button>
            </div>

            <div className="flex flex-col rounded-2xl border-2 border-primary bg-card p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-3xl font-bold">Premium</h2>
                <Badge className="border-0 bg-[#f1e4cc] text-[#6b4f12] hover:bg-[#f1e4cc]">
                  <Crown className="mr-1 size-3" />
                  Premium Vendor
                </Badge>
              </div>
              <p className="mt-1 text-4xl font-bold">
                ${PREMIUM_PRICE_USD}
                <span className="text-base font-normal text-muted-foreground"> / month</span>
              </p>
              <ul className="mt-6 flex-1 space-y-3 text-sm">
                {premiumFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className="mt-8"
                onClick={upgrade}
                disabled={premium || redirecting}
              >
                {redirecting && <Loader2 className="mr-2 size-4 animate-spin" />}
                {premium ? "You are Premium" : "Upgrade to Premium"}
              </Button>
              {!premium && (
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Secure payment by Stripe. Test mode: use card 4242 4242 4242 4242
                  with any future date and any CVC.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}