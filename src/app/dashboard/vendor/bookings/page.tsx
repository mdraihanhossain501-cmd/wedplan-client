"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthData } from "@/hooks/useAuthData";
import { authFetch } from "@/lib/auth-fetch";
import { formatDate } from "@/lib/format";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/dashboard/PageHeader";
import StatusBadge from "@/components/dashboard/StatusBadge";
import BookingDetailsDialog from "@/components/dashboard/BookingDetailsDialog";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/dashboard/States";
import type { Booking } from "@/types";

const FILTERS = ["all", "pending", "accepted", "rejected", "cancelled"];

export default function VendorBookingsPage() {
  const { data, loading, error, reload } = useAuthData<{ bookings: Booking[] }>(
    "/api/bookings/vendor"
  );
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [busy, setBusy] = useState<{ id: string; status: string } | null>(null);

  const bookings = (data?.bookings ?? []).filter(
    (booking) => filter === "all" || booking.status === filter
  );

  async function respond(booking: Booking, status: "accepted" | "rejected") {
    setBusy({ id: booking._id, status });
    try {
      await authFetch(`/api/bookings/${booking._id}/respond`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      toast.success(`Booking ${status}`);
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update booking");
      reload();
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <PageHeader
        title="Booking Requests"
        description="Review requests from customers and accept or reject them."
      />

      <Tabs value={filter} onValueChange={setFilter} className="mb-6">
        <TabsList className="h-auto flex-wrap">
          {FILTERS.map((item) => (
            <TabsTrigger key={item} value={item} className="capitalize">
              {item}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {loading ? (
        <ListSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : bookings.length === 0 ? (
        <EmptyState
          title="No booking requests here"
          description="Requests from customers will show up here."
        />
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const working = busy?.id === booking._id;
            return (
              <div key={booking._id} className="space-y-4 rounded-2xl border bg-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={booking.customer?.image ?? undefined} alt="" />
                      <AvatarFallback>
                        {(booking.customer?.name ?? "C").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold leading-tight">
                        {booking.customer?.name ?? "Customer"}
                      </p>
                      <p className="text-sm text-muted-foreground">{booking.customer?.email}</p>
                    </div>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>

                <div className="grid gap-3 text-sm sm:grid-cols-3">
                  <div>
                    <p className="text-muted-foreground">Service</p>
                    <p className="font-medium">
                      {booking.service?.serviceName ?? "Service no longer available"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Event date</p>
                    <p className="font-medium">{formatDate(booking.eventDate)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Event location</p>
                    <p className="font-medium">{booking.eventLocation}</p>
                  </div>
                </div>

                {booking.message && (
                  <p className="line-clamp-2 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                    {booking.message}
                  </p>
                )}

                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelected(booking)}>
                    View Details
                  </Button>
                  {booking.status === "pending" && (
                    <>
                      <Button size="sm" disabled={working} onClick={() => respond(booking, "accepted")}>
                        {working && busy?.status === "accepted" && (
                          <Loader2 className="mr-2 size-4 animate-spin" />
                        )}
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={working}
                        onClick={() => respond(booking, "rejected")}
                      >
                        {working && busy?.status === "rejected" && (
                          <Loader2 className="mr-2 size-4 animate-spin" />
                        )}
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <BookingDetailsDialog
        booking={selected}
        viewer="vendor"
        onClose={() => setSelected(null)}
      />
    </>
  );
}