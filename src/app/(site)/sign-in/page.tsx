import { Suspense } from "react";
import type { Metadata } from "next";
import SignInForm from "@/components/auth/SignInForm";

export const metadata: Metadata = { title: "Sign In" };

export default function SignInPage() {
  return (
    <section className="mx-auto max-w-md px-6 py-14">
      <Suspense fallback={null}>
        <SignInForm />
      </Suspense>
    </section>
  );
}