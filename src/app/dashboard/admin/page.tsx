"use client";

import { Briefcase, Clock, Heart, Package, Receipt, Users } from "lucide-react";
import { useAuthData } from "@/hooks/useAuthData";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import { ErrorState } from "@/components/dashboard/States";

type AdminStats = {
  stats: {
    totalUsers: number;
    totalVendors: number;
    totalCustomers: number;
    totalServices: number;
    pendingServices: number;
    totalTransactions: number;
  };
  servicesByCategory: { category: string; count: number }[];
  bookingsByStatus: { status: string; count: number }[];
};

function BarList({
  title,
  items,
}: {
  title: string;
  items: { label: string; value: number }[];
}) {
  const max = Math.max(1, ...items.map((item) => item.value));

  return (
    <div className="rounded-2xl border bg-card p-6">
      <h2 className="font-display text-2xl font-bold">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No data yet.</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {items.map((item) => (
            <li key={item.label}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="capitalize">{item.label}</span>
                <span className="font-semibold">{item.value}</span>
              </div>
              <div className="h-2.5 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${(item.value / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function AdminOverviewPage() {
  const { data, loading, error, reload } = useAuthData<AdminStats>("/api/admin/stats");
  const stats = data?.stats;

  return (
    <>
      <PageHeader
        title="Admin Overview"
        description="A snapshot of everything happening on WedPlan."
      />

      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard label="Total Registered Users" value={stats?.totalUsers ?? 0} icon={Users} loading={loading} />
            <StatCard label="Total Vendors" value={stats?.totalVendors ?? 0} icon={Briefcase} loading={loading} />
            <StatCard label="Total Customers" value={stats?.totalCustomers ?? 0} icon={Heart} loading={loading} />
            <StatCard label="Total Services" value={stats?.totalServices ?? 0} icon={Package} loading={loading} />
            <StatCard label="Pending Services" value={stats?.pendingServices ?? 0} icon={Clock} loading={loading} />
            <StatCard label="Total Transactions" value={stats?.totalTransactions ?? 0} icon={Receipt} loading={loading} />
          </div>

          {!loading && data && (
            <div className="grid gap-6 lg:grid-cols-2">
              <BarList
                title="Services by category"
                items={data.servicesByCategory.map((item) => ({
                  label: item.category,
                  value: item.count,
                }))}
              />
              <BarList
                title="Bookings by status"
                items={data.bookingsByStatus.map((item) => ({
                  label: item.status,
                  value: item.count,
                }))}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}