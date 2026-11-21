"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { getDashboardPath } from "@/lib/roles";
import { Button } from "@/components/ui/button";

const accounts = [
  {
    label: "Customer",
    email: "customer@wedplan.com",
    password: process.env.NEXT_PUBLIC_DEMO_CUSTOMER_PASSWORD,
  },
  {
    label: "Vendor",
    email: "vendor@wedplan.com",
    password: process.env.NEXT_PUBLIC_DEMO_VENDOR_PASSWORD,
  },
];

export default function DemoAccounts() {
  const router = useRouter();
  const [loadingEmail, setLoadingEmail] = useState<string | null>(null);

  const available = accounts.filter((account) => account.password);
  if (available.length === 0) return null;

  async function signInAs(email: string, password: string) {
    setLoadingEmail(email);
    try {
      const { data, error } = await authClient.signIn.email({ email, password });
      if (error || !data) {
        toast.error(error?.message || "Could not sign in to the demo account");
        return;
      }
      toast.success("Signed in with a demo account");
      const role = (data.user as { role?: string }).role;
      router.push(getDashboardPath(role));
      router.refresh();
    } finally {
      setLoadingEmail(null);
    }
  }

  return (
    <div className="mt-6 rounded-2xl border border-dashed bg-card p-6 text-center">
      <p className="text-sm font-semibold">Just looking around?</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Try WedPlan with a demo account. No sign up needed.
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        {available.map((account) => (
          <Button
            key={account.email}
            variant="outline"
            className="rounded-full"
            disabled={loadingEmail !== null}
            onClick={() => signInAs(account.email, account.password as string)}
          >
            {loadingEmail === account.email && (
              <Loader2 className="mr-2 size-4 animate-spin" />
            )}
            Demo {account.label}
          </Button>
        ))}
      </div>
    </div>
  );
}