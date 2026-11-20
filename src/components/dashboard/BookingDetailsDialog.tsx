"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { formatDate, formatPrice } from "@/lib/format";
import type { Booking } from "@/types";

function Row({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-3 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="col-span-2 font-medium">{value || "-"}</dd>
    </div>
  );
}

export default function BookingDetailsDialog({
  booking,
  viewer,
  onClose,
}: {
  booking: Booking | null;
  viewer: "customer" | "vendor";
  onClose: () => void;
}) {
  const party = viewer === "customer" ? booking?.vendor : booking?.customer;
  const partyLabel = viewer === "customer" ? "Vendor" : "Customer";

  return (
    <Dialog open={Boolean(booking)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display text-3xl">
            Booking details
          </DialogTitle>
          <DialogDescription>
            {booking?.service?.serviceName ?? "Service no longer available"}
          </DialogDescription>
        </DialogHeader>

        {booking && (
          <dl className="space-y-3">
            <Row label="Status" value={<StatusBadge status={booking.status} />} />
            <Row label="Category" value={booking.service?.category} />
            <Row
              label="Price"
              value={booking.service?.price ? formatPrice(booking.service.price) : undefined}
            />
            <Row label="Event date" value={formatDate(booking.eventDate)} />
            <Row label="Event location" value={booking.eventLocation} />
            <Row
              label={partyLabel}
              value={party?.businessName || party?.name}
            />
            <Row label={`${partyLabel} email`} value={party?.email} />
            <Row label="Requested on" value={formatDate(booking.createdAt)} />
            <Row
              label="Message"
              value={
                booking.message ? (
                  <span className="whitespace-pre-line">{booking.message}</span>
                ) : undefined
              }
            />
          </dl>
        )}
      </DialogContent>
    </Dialog>
  );
}