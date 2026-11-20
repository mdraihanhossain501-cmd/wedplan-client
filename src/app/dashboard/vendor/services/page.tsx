"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Loader2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthData } from "@/hooks/useAuthData";
import { authFetch } from "@/lib/auth-fetch";
import { formatDate, formatPrice } from "@/lib/format";
import { toastServiceError } from "@/lib/service-errors";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PageHeader from "@/components/dashboard/PageHeader";
import ServiceForm from "@/components/dashboard/ServiceForm";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/dashboard/States";
import type { Service } from "@/types";

export default function VendorServicesPage() {
  const router = useRouter();
  const { data, loading, error, reload } = useAuthData<{ services: Service[] }>(
    "/api/services/mine"
  );

  const [info, setInfo] = useState<Service | null>(null);
  const [editing, setEditing] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState<Service | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const goToUpgrade = () => router.push("/dashboard/vendor/subscription");

  async function toggleActive(service: Service, value: boolean) {
    setBusyId(service._id);
    try {
      const result = await authFetch<{ message: string }>(
        `/api/services/${service._id}/availability`,
        { method: "PATCH", body: JSON.stringify({ isActive: value }) }
      );
      toast.success(result.message);
      reload();
    } catch (err) {
      toastServiceError(err, goToUpgrade);
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setDeleteLoading(true);
    try {
      await authFetch(`/api/services/${deleting._id}`, { method: "DELETE" });
      toast.success("Service deleted");
      setDeleting(null);
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete service");
    } finally {
      setDeleteLoading(false);
    }
  }

  const services = data?.services ?? [];

  return (
    <>
      <PageHeader
        title="My Services"
        description="Manage the services you offer and see their approval status."
        action={
          <Button asChild className="rounded-full">
            <Link href="/dashboard/vendor/add-service">Add Service</Link>
          </Button>
        }
      />

      {loading ? (
        <ListSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : services.length === 0 ? (
        <EmptyState
          title="You have not added any services yet"
          description="Add your first service to start receiving booking requests."
          action={
            <Button asChild className="rounded-full">
              <Link href="/dashboard/vendor/add-service">Add Service</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {services.map((service) => (
            <div
              key={service._id}
              className="flex flex-col gap-4 rounded-2xl border bg-card p-4 lg:flex-row lg:items-center"
            >
              <div className="h-28 w-full shrink-0 overflow-hidden rounded-xl bg-muted lg:h-24 lg:w-32">
                {service.images?.[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={service.images[0]}
                    alt={service.serviceName}
                    className="h-full w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                )}
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-xl font-bold">{service.serviceName}</h3>
                  <StatusBadge status={service.status} />
                </div>
                <p className="text-sm text-muted-foreground">
                  {service.category} · {formatPrice(service.price)} · {service.location}
                </p>
                {service.status === "rejected" && (
                  <p className="text-xs text-destructive">
                    Rejected by an admin. Update the service to send it for review again.
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <Switch
                    checked={service.isActive}
                    disabled={busyId === service._id || service.status === "rejected"}
                    onCheckedChange={(value) => toggleActive(service, value)}
                    aria-label="Service availability"
                  />
                  {service.isActive ? "Active" : "Inactive"}
                </label>
                <Button variant="outline" size="icon" onClick={() => setInfo(service)} aria-label="View service">
                  <Eye className="size-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setEditing(service)} aria-label="Update service">
                  <Pencil className="size-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => setDeleting(service)} aria-label="Delete service">
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={Boolean(info)} onOpenChange={(open) => !open && setInfo(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl">{info?.serviceName}</DialogTitle>
            <DialogDescription>
              {info?.category} · {info && formatPrice(info.price)} · {info?.location}
            </DialogDescription>
          </DialogHeader>
          {info && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {info.images.map((src, index) => (
                  <div key={`${src}-${index}`} className="aspect-square overflow-hidden rounded-lg bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <StatusBadge status={info.status} />
                <span className="text-muted-foreground">
                  {info.isActive ? "Active" : "Inactive"} · Added {formatDate(info.createdAt)}
                </span>
              </div>
              <p className="whitespace-pre-line text-sm text-muted-foreground">{info.description}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(editing)} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl">Update service</DialogTitle>
            <DialogDescription>Change the details and save.</DialogDescription>
          </DialogHeader>
          {editing && (
            <ServiceForm
              key={editing._id}
              service={editing}
              onSuccess={() => {
                setEditing(null);
                reload();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(deleting)} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this service?</DialogTitle>
            <DialogDescription>
              &quot;{deleting?.serviceName}&quot; will be removed permanently. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Keep it
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteLoading}>
              {deleteLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}