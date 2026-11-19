import { Suspense } from "react";
import type { Metadata } from "next";
import ServicesBrowser from "@/components/services/ServicesBrowser";

export const metadata: Metadata = { title: "Browse Services" };

export default function ServicesPage() {
  return (
    <>
      <section className="bg-secondary">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <h1 className="font-display text-5xl font-bold">
            Browse Wedding Services
          </h1>
          <p className="mt-3 max-w-xl text-lg text-muted-foreground">
            Explore approved vendors. You can look around without an account.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <Suspense fallback={null}>
          <ServicesBrowser />
        </Suspense>
      </section>
    </>
  );
}