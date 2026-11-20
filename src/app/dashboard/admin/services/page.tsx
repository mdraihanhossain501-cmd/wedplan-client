"use client";

import { useState } from "react";
import { Check, Eye, Loader2, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useAuthData } from "@/hooks/useAuthData";
import { useDebounced } from "@/hooks/useDebounced";
import { authFetch } from "@/lib/auth-fetch";
import { CATEGORIES } from "@/lib/constants";
import { formatDate, formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PageHeader from "@/components/dashboard/PageHeader";
import Pagination from "@/components/dashboard/Pagination";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { EmptyState, ErrorState } from "@/components/dashboard/States";
import type { Service, ServicesResponse } from "@/types";

export default function ManageServicesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [info, setInfo] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState<Service | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const debouncedSearch = useDebounced(search);

  const params = new URLSearchParams();
  if (debouncedSearch) params.set("search", debouncedSearch);
  if (status !== "all") params.set("status", status);
  if (category !== "all") params.set("category", category);
  params.set("page", String(page));
  params.set("limit", "10");

  const { data, loading, error, reload } = useAuthData<ServicesResponse>(
    `/api/admin/services?${params.toString()}`
  );

  async function changeStatus(service: Service, next: "approved" | "rejected") {
    setBusyId(service._id);
    try {
      await authFetch(`/api/admin/services/${service._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: next }),
      });
      toast.success(`Service ${next}`);
      setInfo(null);
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update service");
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setDeleteLoading(true);
    try {
      await authFetch(`/api/admin/services/${deleting._id}`, { method: "DELETE" });
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
        title="Manage Services"
        description="Review new services, change the status of published ones, and remove inappropriate content."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search by service name"
            aria-label="Search services"
            className="pl-9"
          />
        </div>
        <Select value={status} onValueChange={(value) => { setStatus(value); setPage(1); }}>
          <SelectTrigger className="w-full" aria-label="Filter by status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select value={category} onValueChange={(value) => { setCategory(value); setPage(1); }}>
          <SelectTrigger className="w-full" aria-label="Filter by category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORIES.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : services.length === 0 ? (
        <EmptyState title="No services found" description="Try a different search or filter." />
      ) : (
        <div className="rounded-2xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => {
                const busy = busyId === service._id;
                return (
                  <TableRow key={service._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                          {service.images?.[0] && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={service.images[0]}
                              alt=""
                              className="h-full w-full object-cover"
                              onError={(event) => {
                                event.currentTarget.style.display = "none";
                              }}
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium leading-tight">{service.serviceName}</p>
                          <p className="text-xs text-muted-foreground">{service.category}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{service.vendor?.businessName || service.vendor?.name || "-"}</TableCell>
                    <TableCell>{formatPrice(service.price)}</TableCell>
                    <TableCell>
                      <StatusBadge status={service.status} />
                    </TableCell>
                    <TableCell>{service.isActive ? "Active" : "Inactive"}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap justify-end gap-2">
                        <Button variant="outline" size="icon" onClick={() => setInfo(service)} aria-label="Review service">
                          <Eye className="size-4" />
                        </Button>
                        {service.status !== "approved" && (
                          <Button size="sm" disabled={busy} onClick={() => changeStatus(service, "approved")}>
                            <Check className="mr-1 size-4" />
                            Approve
                          </Button>
                        )}
                        {service.status !== "rejected" && (
                          <Button variant="outline" size="sm" disabled={busy} onClick={() => changeStatus(service, "rejected")}>
                            <X className="mr-1 size-4" />
                            Reject
                          </Button>
                        )}
                        <Button variant="destructive" size="icon" onClick={() => setDeleting(service)} aria-label="Delete service">
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <Pagination page={page} totalPages={data?.totalPages ?? 1} onChange={setPage} />

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
                  By {info.vendor?.businessName || info.vendor?.name || "Vendor"} · Added {formatDate(info.createdAt)}
                </span>
              </div>
              <p className="whitespace-pre-line text-sm text-muted-foreground">{info.description}</p>
              <DialogFooter>
                {info.status !== "rejected" && (
                  <Button variant="outline" onClick={() => changeStatus(info, "rejected")}>
                    Reject
                  </Button>
                )}
                {info.status !== "approved" && (
                  <Button onClick={() => changeStatus(info, "approved")}>Approve</Button>
                )}
              </DialogFooter>
            </div>
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
              Cancel
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