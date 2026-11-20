"use client";

import Link from "next/link";
import { CalendarCheck, CheckCircle2, Clock, Crown, Package } from "lucide-react";
import { useAuthData } from "@/hooks/useAuthData";
import { FREE_ACTIVE_LIMIT } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import { ErrorState } from "@/components/dashboard/States";

type Stats = {
  stats: {
    totalServices: number;
    activeServices: number;
    pendingServices: number;
    pendingRequests: number;
    acceptedBookings: number;
    subscriptionPlan: "free" | "premium";
  };
};

export default function VendorOverviewPage() {
  const { data, loading, error, reload } = useAuthData<Stats>("/api/stats/vendor");
  const stats = data?.stats;

  return (
    <>
      <PageHeader
        title="Vendor Overview"
        description="A quick look at your services and booking requests."
        action={
          <Button asChild className="rounded-full">
            <Link href="/dashboard/vendor/add-service">Add Service</Link>
          </Button>
        }
      />

      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard label="Total Services" value={stats?.totalServices ?? 0} icon={Package} loading={loading} />
            <StatCard label="Active Services" value={stats?.activeServices ?? 0} icon={CheckCircle2} loading={loading} />
            <StatCard label="Pending Booking Requests" value={stats?.pendingRequests ?? 0} icon={Clock} loading={loading} />
            <StatCard label="Accepted Bookings" value={stats?.acceptedBookings ?? 0} icon={CalendarCheck} loading={loading} />
            <StatCard label="Current Plan" value={stats?.subscriptionPlan ?? "free"} icon={Crown} loading={loading} />
          </div>

          {stats?.subscriptionPlan === "free" && (
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-secondary p-6">
              <div>
                <p className="font-display text-2xl font-bold">
                  {stats.activeServices} of {FREE_ACTIVE_LIMIT} active services used
                </p>
                <p className="text-sm text-muted-foreground">
                  Upgrade to Premium for unlimited services and the Premium Vendor badge.
                </p>
              </div>
              <Button asChild className="rounded-full">
                <Link href="/dashboard/vendor/subscription">Upgrade to Premium</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
}