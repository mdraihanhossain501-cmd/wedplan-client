"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import type { Service } from "@/types";

export default function ServiceCard({ service }: { service: Service }) {
  const image = service.images?.[0];
  const vendorName =
    service.vendor?.businessName || service.vendor?.name || "Vendor";

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-52 bg-muted">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={service.serviceName}
            loading="lazy"
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        ) : null}
        {service.isPremium && (
          <Badge className="absolute left-3 top-3 border-0 bg-[#f1e4cc] text-[#6b4f12] hover:bg-[#f1e4cc]">
            Premium Vendor
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="text-xs font-semibold uppercase tracking-wide text-primary">
          {service.category}
        </span>
        <h3 className="font-display text-2xl font-bold leading-tight">
          {service.serviceName}
        </h3>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4" />
          {service.location}
        </p>
        <p className="text-sm text-muted-foreground">
          Vendor:{" "}
          <span className="font-medium text-foreground">{vendorName}</span>
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 border-t pt-4">
          <span className="text-lg font-semibold">
            {formatPrice(service.price)}
          </span>
          <Button asChild size="sm" className="rounded-full">
            <Link href={`/services/${service._id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}