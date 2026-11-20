"use client";

import { useRouter } from "next/navigation";
import PageHeader from "@/components/dashboard/PageHeader";
import ServiceForm from "@/components/dashboard/ServiceForm";

export default function AddServicePage() {
  const router = useRouter();

  return (
    <>
      <PageHeader
        title="Add Service"
        description="New services are reviewed by an admin before customers can see them."
      />
      <div className="max-w-3xl rounded-2xl border bg-card p-6">
        <ServiceForm onSuccess={() => router.push("/dashboard/vendor/services")} />
      </div>
    </>
  );
}