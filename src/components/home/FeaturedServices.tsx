import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ServiceCard from "@/components/services/ServiceCard";
import Reveal from "@/components/home/Reveal";
import SectionHeading from "@/components/home/SectionHeading";
import { apiFetch } from "@/lib/api";
import type { ServicesResponse } from "@/types";

async function getFeatured() {
  try {
    const data = await apiFetch<ServicesResponse>("/api/services?limit=6", {
      cache: "no-store",
    });
    return data.services;
  } catch {
    return null;
  }
}

export default async function FeaturedServices() {
  const services = await getFeatured();

  return (
    <section className="bg-[#f6e6e9]/50">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading
          eyebrow="Featured"
          title="Featured Wedding Services"
          description="Hand-picked, approved services. Premium vendors appear first."
        />

        {services === null ? (
          <p className="text-center text-muted-foreground">
            We could not load services right now. Please try again in a moment.
          </p>
        ) : services.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No services are published yet. Check back soon.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <Reveal key={service._id} delay={(index % 3) * 0.08}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Button asChild size="lg" variant="outline" className="rounded-full px-8">
            <Link href="/services">
              View all services
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}