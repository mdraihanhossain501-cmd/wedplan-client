import type { Metadata } from "next";
import { requireRole } from "@/lib/guards";

export const metadata: Metadata = { title: "Customer Dashboard" };

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  await requireRole("customer");
  return <>{children}</>;
}