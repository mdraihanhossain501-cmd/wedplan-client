import type { Metadata } from "next";
import { requireRole } from "@/lib/guards";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole("admin");
  return <>{children}</>;
}