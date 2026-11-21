import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/home/Reveal";
import SectionHeading from "@/components/home/SectionHeading";

const steps = [
  {
    when: "12 months before",
    title: "Set the date and budget",
    text: "Agree on a budget and guest list, then book your venue first. Popular dates go quickly.",
    category: "Wedding Venues",
  },
  {
    when: "9 months before",
    title: "Lock in your photographer",
    text: "The best photographers and videographers get booked early, so reserve yours soon.",
    category: "Photography & Videography",
  },
  {
    when: "6 months before",
    title: "Plan decor and catering",
    text: "Choose your theme, flowers and menu. Ask each vendor about tasting sessions and setup.",
    category: "Decoration & Florist",
  },
  {
    when: "3 months before",
    title: "Choose your wedding outfits",
    text: "Leave enough time for fittings and alterations so everything fits perfectly.",
    category: "Wedding Fashion",
  },
  {
    when: "1 month before",
    title: "Book makeup and styling",
    text: "Schedule a trial session so you feel confident about your look on the day.",
    category: "Makeup & Styling",
  },
  {
    when: "Wedding week",
    title: "Confirm every detail",
    text: "Check your booking statuses in your dashboard and confirm times with each vendor.",
    category: null,
  },
];

export default function PlanningTimeline() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <SectionHeading
        eyebrow="Plan ahead"
        title="Your Wedding Planning Timeline"
        description="A simple guide to what to book and when, with shortcuts to the right vendors."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, index) => (
          <Reveal key={step.title} delay={(index % 3) * 0.08}>
            <div className="flex h-full flex-col rounded-2xl border bg-card p-6">
              <span className="w-fit rounded-full bg-[#f1e4cc] px-3 py-1 text-xs font-semibold text-[#6b4f12]">
                {step.when}
              </span>
              <h3 className="font-display mt-4 text-2xl font-bold">{step.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{step.text}</p>
              {step.category && (
                <Link
                  href={`/services?category=${encodeURIComponent(step.category)}`}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                >
                  Find {step.category.toLowerCase()}
                  <ArrowRight className="size-4" />
                </Link>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}