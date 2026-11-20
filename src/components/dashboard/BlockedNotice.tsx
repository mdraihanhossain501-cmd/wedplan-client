"use client";

import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function BlockedNotice() {
  const router = useRouter();

  async function handleLogout() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="max-w-md space-y-4 text-center">
        <ShieldAlert className="mx-auto size-14 text-primary" />
        <h1 className="font-display text-4xl font-bold">Account blocked</h1>
        <p className="text-muted-foreground">
          Your account has been blocked by an administrator, so you cannot use
          WedPlan features right now.
        </p>
        <Button onClick={handleLogout} className="rounded-full">
          Log out
        </Button>
      </div>
    </div>
  );
}