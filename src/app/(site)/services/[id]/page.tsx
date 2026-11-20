import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, MapPin, TriangleAlert } from "lucide-react";
import { auth } from "@/lib/auth";
import { apiFetch, ApiError } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ServiceGallery from "@/components/services/ServiceGallery";
import BookingDialog from "@/components/services/BookingDialog";
import type { Service } from "@/types";

export const metadata: Metadata = { title: "Service Details" };

export default async function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect(`/sign-in?callbackUrl=${encodeURIComponent(`/services/${id}`)}`);
  }

  const user = {
    id: session.user.id,
    role: (session.user as { role?: string }).role ?? "customer",
  };

  let service: Service | null = null;
  let errorMessage = "";
  try {
    const data = await apiFetch<{ service: Service }>(`/api/services/${id}`, {
      cache: "no-store",
    });
    service = data.service;
  } catch (error) {
    errorMessage =
      error instanceof ApiError
        ? error.message
        : "Could not reach the server. Please try again later.";
  }

  if (!service) {
    return (
      <section className="mx-auto max-w-xl px-6 py-24 text-center">
        <TriangleAlert className="mx-auto size-12 text-primary" />
        <h1 className="mt-4 font-display text-4xl font-bold">
          Service unavailable
        </h1>
        <p className="mt-3 text-muted-foreground">{errorMessage}</p>
        <Button asChild className="mt-6 rounded-full">
          <Link href="/services">Browse all services</Link>
        </Button>
      </section>
    );
  }

  const vendorName =
    service.vendor?.businessName || service.vendor?.name || "Vendor";

  let disabledReason: string | null = null;
  if (user.role === "admin") {
    disabledReason = "Admins cannot submit booking requests.";
  } else if (service.vendorId === user.id) {
    disabledReason = "This is your own service, so you cannot book it.";
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <Link
        href="/services"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Back to services
      </Link>

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <ServiceGallery images={service.images} name={service.serviceName} />

          <div className="space-y-3">
            <h2 className="font-display text-3xl font-bold">
              About this service
            </h2>
            <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
              {service.description}
            </p>
          </div>
        </div>

        <aside className="h-fit space-y-6 rounded-2xl border bg-card p-6 shadow-sm lg:sticky lg:top-24">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-primary">
              {service.category}
            </span>
            <h1 className="font-display text-4xl font-bold leading-tight">
              {service.serviceName}
            </h1>
            <p className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="size-4" />
              {service.location}
            </p>
          </div>

          <p className="text-3xl font-semibold">{formatPrice(service.price)}</p>

          <div className="flex items-center gap-3 rounded-xl bg-muted p-4">
            <Avatar className="size-12">
              <AvatarImage src={service.vendor?.image ?? undefined} alt={vendorName} />
              <AvatarFallback>{vendorName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Offered by</p>
              <p className="font-semibold leading-none">{vendorName}</p>
              {service.isPremium && (
                <Badge className="border-0 bg-[#f1e4cc] text-[#6b4f12] hover:bg-[#f1e4cc]">
                  Premium Vendor
                </Badge>
              )}
            </div>
          </div>

          <BookingDialog
            serviceId={service._id}
            serviceName={service.serviceName}
            disabledReason={disabledReason}
          />
        </aside>
      </div>
    </section>
  );
}