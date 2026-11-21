import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Reveal from "@/components/home/Reveal";
import SectionHeading from "@/components/home/SectionHeading";

const faqs = [
  {
    question: "Do I need an account to browse services?",
    answer:
      "No. You can browse and search all approved services without an account. You need to sign in to view full details and to send a booking request.",
  },
  {
    question: "How does booking work?",
    answer:
      "Open a service, choose your event date, add your location and a short message, then send the request. The vendor can accept or reject it, and you can follow the status from your dashboard.",
  },
  {
    question: "Can I cancel a booking request?",
    answer:
      "Yes. You can cancel any request while it is still pending. Once a vendor has accepted or rejected it, the status can no longer be changed.",
  },
  {
    question: "Who approves the services I see?",
    answer:
      "Every new service is reviewed by a WedPlan admin before it appears in the public listings, so you only see approved services.",
  },
  {
    question: "What is the difference between Free and Premium vendors?",
    answer:
      "Free vendors can keep up to 3 active services. Premium vendors can publish unlimited services, show a Premium Vendor badge and are listed before other vendors.",
  },
  {
    question: "How are Premium payments handled?",
    answer:
      "Payments are processed securely by Stripe Checkout. This project runs in test mode, so use the test card 4242 4242 4242 4242 with any future date and any CVC.",
  },
];

export default function FaqSection() {
  return (
    <section className="bg-[#f6e6e9]/50">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently Asked Questions"
          description="Quick answers about booking, vendors and plans."
        />

        <Reveal>
          <Accordion
            type="single"
            collapsible
            className="rounded-2xl border bg-card px-6"
          >
            {faqs.map((item, index) => (
              <AccordionItem key={item.question} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-base font-semibold">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}