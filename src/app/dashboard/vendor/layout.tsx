import { requireRole } from "@/lib/guards";

export default async function VendorLayout({ children }: { children: React.ReactNode }) {
  await requireRole("vendor");
  return <>{children}</>;
}