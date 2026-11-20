import { CalendarCheck, Crown, ShieldCheck, Wallet } from "lucide-react";
import Reveal from "@/components/home/Reveal";
import SectionHeading from "@/components/home/SectionHeading";

const reasons = [
  {
    icon: ShieldCheck,
    title: "Approved vendors",
    text: "Every service is reviewed by our team before it appears on WedPlan.",
  },
  {
    icon: Wallet,
    title: "Clear pricing",
    text: "See each price up front and compare services without any surprises.",
  },
  {
    icon: CalendarCheck,
    title: "Simple booking",
    text: "Send a booking request in a minute and track its status from your dashboard.",
  },
  {
    icon: Crown,
    title: "Premium vendors",
    text: "Premium vendors are listed first, so you meet the most active professionals.",
  },
];

export default function WhyChoose() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <SectionHeading
        eyebrow="Why WedPlan"
        title="Why Choose WedPlan?"
        description="We keep planning calm, so you can focus on the celebration."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {reasons.map(({ icon: Icon, title, text }, index) => (
          <Reveal key={title} delay={index * 0.08}>
            <div className="h-full rounded-2xl border bg-card p-6 transition-shadow hover:shadow-md">
              <span className="flex size-12 items-center justify-center rounded-full bg-[#f6e6e9] text-primary">
                <Icon className="size-5" />
              </span>
              <h3 className="font-display mt-4 text-2xl font-bold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}