/* eslint-disable react-hooks/set-state-in-effect -- loading state is reset when the request changes */
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ServiceCard from "@/components/services/ServiceCard";
import { useDebounced } from "@/hooks/useDebounced";
import { apiFetch } from "@/lib/api";
import { CATEGORIES } from "@/lib/constants";
import type { ServicesResponse } from "@/types";

export default function ServicesBrowser() {
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [retry, setRetry] = useState(0);

  const [data, setData] = useState<ServicesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounced(search);
  const debouncedLocation = useDebounced(location);

  useEffect(() => {
    const controller = new AbortController();

    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (debouncedLocation) params.set("location", debouncedLocation);
    if (category !== "all") params.set("category", category);
    if (sort !== "newest") params.set("sort", sort);
    params.set("page", String(page));
    params.set("limit", "9");

    setLoading(true);
    setError(null);

    apiFetch<ServicesResponse>(`/api/services?${params.toString()}`, {
      signal: controller.signal,
    })
      .then(setData)
      .catch((err: Error) => {
        if (err.name !== "AbortError") setError(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [debouncedSearch, debouncedLocation, category, sort, page, retry]);

  function changePage(next: number) {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetFilters() {
    setSearch("");
    setLocation("");
    setCategory("all");
    setSort("newest");
    setPage(1);
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 rounded-2xl border bg-card p-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search by name"
            aria-label="Search services by name"
            className="pl-9"
          />
        </div>

        <Select
          value={category}
          onValueChange={(value) => {
            setCategory(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full" aria-label="Filter by category">
            <SelectValue placeholder="Category" />
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

        <Input
          value={location}
          onChange={(event) => {
            setLocation(event.target.value);
            setPage(1);
          }}
          placeholder="Filter by location"
          aria-label="Filter by location"
        />

        <Select
          value={sort}
          onValueChange={(value) => {
            setSort(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full" aria-label="Sort services">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Featured first</SelectItem>
            <SelectItem value="price_asc">Price: low to high</SelectItem>
            <SelectItem value="price_desc">Price: high to low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-2xl border bg-card">
              <Skeleton className="h-52 w-full rounded-none" />
              <div className="space-y-3 p-5">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-9 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-destructive/30 bg-card p-10 text-center">
          <p className="font-semibold">Could not load services</p>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          <Button className="mt-4" onClick={() => setRetry((value) => value + 1)}>
            Try again
          </Button>
        </div>
      ) : data && data.services.length > 0 ? (
        <>
          <p className="text-sm text-muted-foreground">
            Showing {data.services.length} of {data.total} services
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>

          {data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() => changePage(page - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {data.page} of {data.totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page >= data.totalPages}
                onClick={() => changePage(page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-2xl border bg-card p-12 text-center">
          <SearchX className="mx-auto size-10 text-muted-foreground" />
          <p className="mt-4 text-lg font-semibold">No services found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different search or clear the filters.
          </p>
          <Button variant="outline" className="mt-4" onClick={resetFilters}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}