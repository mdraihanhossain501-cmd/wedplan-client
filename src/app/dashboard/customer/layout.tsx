import { requireRole } from "@/lib/guards";

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  await requireRole("customer");
  return <>{children}</>;
}