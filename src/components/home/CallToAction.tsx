import Link from "next/link";
import { Button } from "@/components/ui/button";
import Reveal from "@/components/home/Reveal";

export default function CallToAction() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <Reveal>
        <div className="rounded-3xl bg-[#f6e6e9] px-6 py-14 text-center sm:px-12">
          <h2 className="font-display text-4xl font-bold sm:text-5xl">
            Ready to start planning?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Create a free account to book vendors, or list your own wedding
            services and reach couples across Bangladesh.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="rounded-full px-8">
              <Link href="/sign-up">Create an account</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8">
              <Link href="/services">Explore services</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}