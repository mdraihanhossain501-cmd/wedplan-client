"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthData } from "@/hooks/useAuthData";
import { authFetch } from "@/lib/auth-fetch";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PageHeader from "@/components/dashboard/PageHeader";
import StatusBadge from "@/components/dashboard/StatusBadge";
import BookingDetailsDialog from "@/components/dashboard/BookingDetailsDialog";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/dashboard/States";
import type { Booking } from "@/types";

const FILTERS = ["all", "pending", "accepted", "rejected", "cancelled"];

export default function CustomerBookingsPage() {
  const { data, loading, error, reload } = useAuthData<{ bookings: Booking[] }>(
    "/api/bookings/mine"
  );
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const bookings = (data?.bookings ?? []).filter(
    (booking) => filter === "all" || booking.status === filter
  );

  async function confirmCancel() {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      await authFetch(`/api/bookings/${cancelTarget._id}/cancel`, {
        method: "PATCH",
      });
      toast.success("Booking cancelled");
      setCancelTarget(null);
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not cancel booking");
    } finally {
      setCancelling(false);
    }
  }

  return (
    <>
      <PageHeader
        title="My Bookings"
        description="Track the booking requests you have sent to vendors."
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
          title="No bookings here yet"
          description="Find a service you like and send your first request."
          action={
            <Button asChild className="rounded-full">
              <Link href="/services">Browse services</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="flex flex-col gap-4 rounded-2xl border bg-card p-4 sm:flex-row sm:items-center"
            >
              <div className="h-28 w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:h-24 sm:w-32">
                {booking.service?.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={booking.service.image}
                    alt={booking.service.serviceName ?? "Service"}
                    className="h-full w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                )}
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-xl font-bold">
                    {booking.service?.serviceName ?? "Service no longer available"}
                  </h3>
                  <StatusBadge status={booking.status} />
                </div>
                <p className="text-sm text-muted-foreground">
                  Vendor:{" "}
                  <span className="font-medium text-foreground">
                    {booking.vendor?.businessName || booking.vendor?.name || "Vendor"}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Event: {formatDate(booking.eventDate)} · {booking.eventLocation}
                </p>
                <p className="text-xs text-muted-foreground">
                  Requested on {formatDate(booking.createdAt)}
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelected(booking)}>
                  View Details
                </Button>
                {booking.status === "pending" && (
                  <Button variant="destructive" size="sm" onClick={() => setCancelTarget(booking)}>
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <BookingDetailsDialog
        booking={selected}
        viewer="customer"
        onClose={() => setSelected(null)}
      />

      <Dialog open={Boolean(cancelTarget)} onOpenChange={(open) => !open && setCancelTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel this booking request?</DialogTitle>
            <DialogDescription>
              The vendor will no longer see this request as pending. You can
              send a new request later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelTarget(null)}>
              Keep request
            </Button>
            <Button variant="destructive" onClick={confirmCancel} disabled={cancelling}>
              {cancelling && <Loader2 className="mr-2 size-4 animate-spin" />}
              Yes, cancel it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}