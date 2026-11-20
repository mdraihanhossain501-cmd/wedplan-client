"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, BadgeCheck, CalendarHeart, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const highlights = [
  { icon: BadgeCheck, label: "Approved vendors" },
  { icon: CalendarHeart, label: "Easy booking requests" },
  { icon: ShieldCheck, label: "Secure payments" },
];

export default function Hero() {
  const reduce = useReducedMotion();

  const item = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: "easeOut" as const },
        };

  return (
    <section className="relative overflow-hidden bg-[#f6e6e9]">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <motion.p
            {...item(0)}
            className="text-sm font-semibold uppercase tracking-widest text-primary"
          >
            Wedding planning, made simple
          </motion.p>
          <motion.h1
            {...item(0.1)}
            className="font-display mt-3 text-5xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl"
          >
            Plan your dream wedding with vendors you can trust
          </motion.h1>
          <motion.p
            {...item(0.2)}
            className="mt-6 max-w-xl text-lg text-muted-foreground"
          >
            Discover photographers, venues, decorators, caterers, stylists and
            wedding fashion across Bangladesh, all in one place.
          </motion.p>

          <motion.div {...item(0.3)} className="mt-8 flex flex-wrap gap-4">
            <Button asChild size="lg" className="rounded-full px-8">
              <Link href="/services">
                Explore Wedding Services
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8">
              <Link href="/sign-up">Join as a Vendor</Link>
            </Button>
          </motion.div>

          <motion.ul
            {...item(0.4)}
            className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground"
          >
            {highlights.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon className="size-4 text-primary" />
                {label}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="aspect-[4/5] overflow-hidden rounded-t-full bg-gradient-to-b from-[#ebd8dc] to-[#f1e4cc] shadow-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero.jpg"
              alt="A beautifully decorated wedding ceremony"
              className="h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          </div>

          <motion.div
            animate={reduce ? undefined : { y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-4 bottom-10 rounded-2xl border bg-card px-5 py-4 shadow-lg"
          >
            <p className="font-display text-3xl font-bold leading-none">6</p>
            <p className="text-sm text-muted-foreground">Service categories</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}