import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <section className="mx-auto max-w-lg px-6 py-24 text-center">
      <XCircle className="mx-auto size-14 text-primary" />
      <h1 className="font-display mt-6 text-4xl font-bold">Payment cancelled</h1>
      <p className="mt-3 text-muted-foreground">
        No payment was made and your plan has not changed. You can upgrade
        whenever you are ready.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild className="rounded-full">
          <Link href="/dashboard/vendor/subscription">Try again</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/dashboard/vendor">Back to dashboard</Link>
        </Button>
      </div>
    </section>
  );
}