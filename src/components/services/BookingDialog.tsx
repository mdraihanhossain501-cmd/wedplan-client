/* eslint-disable react-hooks/set-state-in-effect -- loading state is reset when the request changes */
"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { authFetch } from "@/lib/auth-fetch";

type Props = {
  serviceId: string;
  serviceName: string;
  disabledReason: string | null;
};

export default function BookingDialog({
  serviceId,
  serviceName,
  disabledReason,
}: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [minDate, setMinDate] = useState<string | undefined>(undefined);

  // Set after mount so the server and browser time zones cannot cause a mismatch.
  useEffect(() => {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    setMinDate(local.toISOString().slice(0, 10));
  }, []);

  if (disabledReason) {
    return (
      <div className="rounded-xl border bg-muted p-4 text-sm text-muted-foreground">
        {disabledReason}
      </div>
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const eventDate = String(form.get("eventDate") || "");
    const eventLocation = String(form.get("eventLocation") || "").trim();
    const message = String(form.get("message") || "").trim();

    if (!eventDate) {
      toast.error("Please choose your event date");
      return;
    }
    if (eventLocation.length < 3) {
      toast.error("Please enter your event location");
      return;
    }
    if (message.length > 500) {
      toast.error("Message must be 500 characters or fewer");
      return;
    }

    setLoading(true);
    try {
      const result = await authFetch<{ message: string }>("/api/bookings", {
        method: "POST",
        body: JSON.stringify({ serviceId, eventDate, eventLocation, message }),
      });
      toast.success(result.message);
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not send your request"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full rounded-full">
          Request Booking
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display text-3xl">
            Request a booking
          </DialogTitle>
          <DialogDescription>
            Send your event details to the vendor for {serviceName}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="eventDate">Event date</Label>
            <Input
              id="eventDate"
              name="eventDate"
              type="date"
              min={minDate}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventLocation">Event location</Label>
            <Input
              id="eventLocation"
              name="eventLocation"
              placeholder="Venue or city"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Additional message (optional)</Label>
            <Textarea
              id="message"
              name="message"
              rows={4}
              maxLength={500}
              placeholder="Tell the vendor about your plans"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
            {loading ? "Sending request..." : "Send Request"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}