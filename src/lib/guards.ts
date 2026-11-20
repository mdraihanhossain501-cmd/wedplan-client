import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getDashboardPath } from "@/lib/roles";

export async function requireRole(role: "admin" | "vendor" | "customer") {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const userRole = (session.user as { role?: string }).role ?? "customer";
  if (userRole !== role) redirect(getDashboardPath(userRole));

  return session;
}