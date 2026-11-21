import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import FeaturedServices from "@/components/home/FeaturedServices";
import WhyChoose from "@/components/home/WhyChoose";
import HowItWorks from "@/components/home/HowItWorks";
import PlanningTimeline from "@/components/home/PlanningTimeline";
import CallToAction from "@/components/home/CallToAction";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "WedPlan | Plan your dream wedding",
  description:
    "Find and book trusted wedding photographers, venues, decorators, caterers, stylists and fashion across Bangladesh.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedServices />
      <WhyChoose />
      <HowItWorks />
      <PlanningTimeline />
      <CallToAction />
    </>
  );
}