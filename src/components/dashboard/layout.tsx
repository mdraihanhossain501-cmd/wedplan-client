import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import DashboardShell from "@/components/dashboard/DashboardShell";
import BlockedNotice from "@/components/dashboard/BlockedNotice";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in?callbackUrl=%2Fdashboard");

  const user = session.user as {
    name: string;
    email: string;
    image?: string | null;
    role?: string;
    isBlocked?: boolean;
  };

  if (user.isBlocked) return <BlockedNotice />;

  return (
    <DashboardShell
      user={{
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role ?? "customer",
      }}
    >
      {children}
    </DashboardShell>
  );
}