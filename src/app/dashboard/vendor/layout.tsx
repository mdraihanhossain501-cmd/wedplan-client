import type { Metadata } from "next";
import { requireRole } from "@/lib/guards";

export const metadata: Metadata = { title: "Vendor Dashboard" };

export default async function VendorLayout({ children }: { children: React.ReactNode }) {
  await requireRole("vendor");
  return <>{children}</>;
}