import type { Metadata } from "next";
import SignUpForm from "@/components/auth/SignUpForm";

export const metadata: Metadata = { title: "Sign Up" };

export default function SignUpPage() {
  return (
    <section className="mx-auto max-w-md px-6 py-14">
      <SignUpForm />
    </section>
  );
}