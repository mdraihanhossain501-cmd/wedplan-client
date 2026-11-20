"use client";

import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { useAuthData } from "@/hooks/useAuthData";
import { useDebounced } from "@/hooks/useDebounced";
import { authFetch } from "@/lib/auth-fetch";
import { formatDate } from "@/lib/format";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { EmptyState, ErrorState } from "@/components/dashboard/States";
import type { AdminUser } from "@/types";

type UsersResponse = {
  users: AdminUser[];
  total: number;
  page: number;
  totalPages: number;
};

type UserDetails = {
  user: AdminUser;
  stats: { serviceCount: number; bookingsMade: number; bookingsReceived: number };
};

export default function ManageUsersPage() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [page, setPage] = useState(1);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [blockTarget, setBlockTarget] = useState<AdminUser | null>(null);
  const [saving, setSaving] = useState(false);

  const debouncedSearch = useDebounced(search);

  const params = new URLSearchParams();
  if (debouncedSearch) params.set("search", debouncedSearch);
  if (role !== "all") params.set("role", role);
  params.set("page", String(page));
  params.set("limit", "10");

  const { data, loading, error, reload } = useAuthData<UsersResponse>(
    `/api/admin/users?${params.toString()}`
  );
  const details = useAuthData<UserDetails>(
    detailsId ? `/api/admin/users/${detailsId}` : null
  );

  async function confirmBlock() {
    if (!blockTarget) return;
    const block = !blockTarget.isBlocked;
    setSaving(true);
    try {
      await authFetch(`/api/admin/users/${blockTarget._id}/block`, {
        method: "PATCH",
        body: JSON.stringify({ isBlocked: block }),
      });
      toast.success(block ? "User blocked" : "User unblocked");
      setBlockTarget(null);
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update user");
    } finally {
      setSaving(false);
    }
  }

  const users = data?.users ?? [];

  return (
    <>
      <PageHeader
        title="Manage Users"
        description="View registered users and block accounts that break the rules."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-[1fr_200px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search by name or email"
            aria-label="Search users"
            className="pl-9"
          />
        </div>
        <Select
          value={role}
          onValueChange={(value) => {
            setRole(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full" aria-label="Filter by role">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="customer">Customers</SelectItem>
            <SelectItem value="vendor">Vendors</SelectItem>
            <SelectItem value="admin">Admins</SelectItem>
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
      ) : users.length === 0 ? (
        <EmptyState title="No users found" description="Try a different search or filter." />
      ) : (
        <div className="rounded-2xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.image ?? undefined} alt="" />
                        <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium leading-tight">{user.name}</p>
                        {user.businessName && (
                          <p className="text-xs text-muted-foreground">{user.businessName}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.isBlocked ? (
                      <Badge className="border-0 bg-[#f6e6e9] text-[#7a2e41] hover:bg-[#f6e6e9]">Blocked</Badge>
                    ) : (
                      <Badge className="border-0 bg-[#dce6df] text-[#2f4a3b] hover:bg-[#dce6df]">Active</Badge>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setDetailsId(user._id)}>
                        Details
                      </Button>
                      {user.role !== "admin" && (
                        <Button
                          variant={user.isBlocked ? "outline" : "destructive"}
                          size="sm"
                          onClick={() => setBlockTarget(user)}
                        >
                          {user.isBlocked ? "Unblock" : "Block"}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Pagination page={page} totalPages={data?.totalPages ?? 1} onChange={setPage} />

      <Dialog open={Boolean(detailsId)} onOpenChange={(open) => !open && setDetailsId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display text-3xl">User details</DialogTitle>
            <DialogDescription>{details.data?.user.email}</DialogDescription>
          </DialogHeader>
          {details.loading ? (
            <Skeleton className="h-40 w-full" />
          ) : details.error ? (
            <p className="text-sm text-destructive">{details.error}</p>
          ) : details.data ? (
            <dl className="space-y-3 text-sm">
              {[
                ["Name", details.data.user.name],
                ["Role", details.data.user.role],
                ["Business", details.data.user.businessName],
                ["Plan", details.data.user.subscriptionPlan],
                ["Status", details.data.user.isBlocked ? "Blocked" : "Active"],
                ["Joined", formatDate(details.data.user.createdAt)],
                ["Services created", String(details.data.stats.serviceCount)],
                ["Bookings made", String(details.data.stats.bookingsMade)],
                ["Bookings received", String(details.data.stats.bookingsReceived)],
              ].map(([label, value]) => (
                <div key={label} className="grid grid-cols-3 gap-3">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="col-span-2 font-medium capitalize">{value || "-"}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(blockTarget)} onOpenChange={(open) => !open && setBlockTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {blockTarget?.isBlocked ? "Unblock" : "Block"} {blockTarget?.name}?
            </DialogTitle>
            <DialogDescription>
              {blockTarget?.isBlocked
                ? "They will be able to use WedPlan again."
                : "They will be logged out and lose access to protected features."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBlockTarget(null)}>
              Cancel
            </Button>
            <Button
              variant={blockTarget?.isBlocked ? "default" : "destructive"}
              onClick={confirmBlock}
              disabled={saving}
            >
              {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
              {blockTarget?.isBlocked ? "Unblock" : "Block"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}