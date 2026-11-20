"use client";

import { CalendarCheck, CheckCircle2, Clock, XCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useAuthData } from "@/hooks/useAuthData";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import { ErrorState } from "@/components/dashboard/States";

type Stats = {
  stats: { total: number; pending: number; accepted: number; rejected: number };
};

export default function CustomerOverviewPage() {
  const { data: session } = authClient.useSession();
  const { data, loading, error, reload } = useAuthData<Stats>("/api/stats/customer");

  return (
    <>
      <PageHeader
        title={`Welcome${session?.user.name ? `, ${session.user.name.split(" ")[0]}` : ""}`}
        description="Here is a summary of your booking requests."
      />

      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Booking Requests" value={data?.stats.total ?? 0} icon={CalendarCheck} loading={loading} />
          <StatCard label="Pending Bookings" value={data?.stats.pending ?? 0} icon={Clock} loading={loading} />
          <StatCard label="Accepted Bookings" value={data?.stats.accepted ?? 0} icon={CheckCircle2} loading={loading} />
          <StatCard label="Rejected Bookings" value={data?.stats.rejected ?? 0} icon={XCircle} loading={loading} />
        </div>
      )}
    </>
  );
}