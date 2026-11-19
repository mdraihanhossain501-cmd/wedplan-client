"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { uploadImage } from "@/lib/upload";
import { getDashboardPath } from "@/lib/roles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import GoogleButton from "@/components/auth/GoogleButton";

const passwordRule = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

export default function SignUpForm() {
  const router = useRouter();
  const [role, setRole] = useState<"customer" | "vendor">("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

    const rawCallback = searchParams.get("callbackUrl");
  const googleCallback =
    rawCallback && rawCallback.startsWith("/") && !rawCallback.startsWith("//")
      ? rawCallback
      : "/dashboard";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    const businessName = String(form.get("businessName") || "").trim();
    const file = form.get("image");

    if (!name) {
      toast.error("Please enter your full name");
      return;
    }
    if (!passwordRule.test(password)) {
      toast.error(
        "Password needs at least 6 characters, one uppercase and one lowercase letter"
      );
      return;
    }

    setLoading(true);
    try {
      let image: string | undefined;
      if (file instanceof File && file.size > 0) {
        try {
          image = await uploadImage(file);
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "Image upload failed"
          );
          return;
        }
      }

      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        image,
        role,
        businessName: businessName || undefined,
      });

      if (error) {
        toast.error(error.message || "Could not create your account");
        return;
      }

      toast.success("Account created successfully!");
      router.push(getDashboardPath(role));
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border bg-card p-8 shadow-sm">
      <h1 className="font-display text-4xl font-bold">Create your account</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Join WedPlan as a customer or a vendor.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" placeholder="Your full name" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="you@example.com" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 6 characters"
              className="pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            6+ characters, with one uppercase and one lowercase letter.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Account role</Label>
          <Select value={role} onValueChange={(value) => setRole(value as "customer" | "vendor")}>
            <SelectTrigger id="role" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="customer">Customer</SelectItem>
              <SelectItem value="vendor">Vendor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {role === "vendor" && (
          <div className="space-y-2">
            <Label htmlFor="businessName">Business name</Label>
            <Input id="businessName" name="businessName" placeholder="Your business name" />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="image">Profile image (optional)</Label>
          <Input id="image" name="image" type="file" accept="image/*" />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
          {loading ? "Creating account..." : "Sign Up"}
        </Button>
      </form>

            <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        OR
        <span className="h-px flex-1 bg-border" />
      </div>
      <GoogleButton callbackURL={googleCallback} />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-semibold text-primary hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}