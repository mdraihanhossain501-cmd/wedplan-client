import Reveal from "@/components/home/Reveal";
import SectionHeading from "@/components/home/SectionHeading";

const steps = [
  {
    title: "Search and compare",
    text: "Browse services by category, location and price to find the right fit.",
  },
  {
    title: "Send a booking request",
    text: "Share your event date and location. The vendor accepts or declines.",
  },
  {
    title: "Celebrate with confidence",
    text: "Track every request from your dashboard and enjoy your special day.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-[#2b2326] text-[#f3eae4]">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#e9b7c2]">
            How it works
          </p>
          <h2 className="font-display mt-2 text-4xl font-bold sm:text-5xl">
            How WedPlan Works
          </h2>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.12}>
              <div className="text-center">
                <span className="font-display mx-auto flex size-16 items-center justify-center rounded-full border border-[#e9b7c2] text-3xl font-bold text-[#e9b7c2]">
                  {index + 1}
                </span>
                <h3 className="font-display mt-5 text-2xl font-bold">{step.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-[#d6c9c9]">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}