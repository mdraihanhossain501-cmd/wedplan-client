"use client";

import { useState } from "react";
import { useAuthData } from "@/hooks/useAuthData";
import { formatDate, formatMoney } from "@/lib/format";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
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
import type { Transaction } from "@/types";

type Response = {
  transactions: Transaction[];
  total: number;
  page: number;
  totalPages: number;
};

export default function TransactionsPage() {
  const [page, setPage] = useState(1);
  const { data, loading, error, reload } = useAuthData<Response>(
    `/api/admin/transactions?page=${page}&limit=10`
  );
  const transactions = data?.transactions ?? [];

  return (
    <>
      <PageHeader
        title="Transactions"
        description="Subscription payments recorded from Stripe. This list is read-only."
      />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : transactions.length === 0 ? (
        <EmptyState
          title="No transactions yet"
          description="Payments will appear here after vendors upgrade to Premium."
        />
      ) : (
        <div className="rounded-2xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={item.vendor?.image ?? undefined} alt="" />
                        <AvatarFallback>
                          {(item.vendor?.name ?? "V").charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium leading-tight">
                          {item.vendor?.businessName || item.vendor?.name || "Unknown vendor"}
                        </p>
                        <p className="text-xs text-muted-foreground">{item.vendor?.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{item.plan}</TableCell>
                  <TableCell className="font-medium">
                    {formatMoney(item.amount, item.currency)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={item.status} />
                  </TableCell>
                  <TableCell>{formatDate(item.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Pagination page={page} totalPages={data?.totalPages ?? 1} onChange={setPage} />
    </>
  );
}