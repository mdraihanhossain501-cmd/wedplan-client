"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { uploadImage } from "@/lib/upload";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileForm() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [loading, setLoading] = useState(false);

  if (isPending || !session) {
    return <Skeleton className="h-96 w-full max-w-xl rounded-2xl" />;
  }

  const user = session.user;
  const role = user.role ?? "customer";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const businessName = String(form.get("businessName") || "").trim();
    const file = form.get("image");

    if (name.length < 2) {
      toast.error("Please enter your name");
      return;
    }

    setLoading(true);
    try {
      let image: string | undefined;
      if (file instanceof File && file.size > 0) {
        try {
          image = await uploadImage(file);
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Image upload failed");
          return;
        }
      }

      const { error } = await authClient.updateUser({
        name,
        ...(image ? { image } : {}),
        ...(role === "vendor" ? { businessName } : {}),
      });

      if (error) {
        toast.error(error.message || "Could not update your profile");
        return;
      }

      toast.success("Profile updated successfully");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5 rounded-2xl border bg-card p-6">
      <div className="flex items-center gap-4">
        <Avatar className="size-16">
          <AvatarImage src={user.image ?? undefined} alt={user.name} />
          <AvatarFallback className="text-xl">
            {user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{user.name}</p>
          <p className="text-sm capitalize text-muted-foreground">{role}</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" defaultValue={user.name} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={user.email} disabled readOnly />
        <p className="text-xs text-muted-foreground">
          Email and role cannot be changed here.
        </p>
      </div>

      {role === "vendor" && (
        <div className="space-y-2">
          <Label htmlFor="businessName">Business name</Label>
          <Input
            id="businessName"
            name="businessName"
            defaultValue={user.businessName ?? ""}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="image">Profile image</Label>
        <Input id="image" name="image" type="file" accept="image/*" />
      </div>

      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
        {loading ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}