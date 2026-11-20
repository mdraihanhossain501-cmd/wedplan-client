import Link from "next/link";
import {
  Camera,
  Flower2,
  Landmark,
  Shirt,
  Sparkles,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import Reveal from "@/components/home/Reveal";
import SectionHeading from "@/components/home/SectionHeading";

const icons: Record<string, LucideIcon> = {
  "Photography & Videography": Camera,
  "Wedding Venues": Landmark,
  "Decoration & Florist": Flower2,
  "Catering Services": UtensilsCrossed,
  "Makeup & Styling": Sparkles,
  "Wedding Fashion": Shirt,
};

const tints = ["#ebd8dc", "#dce6df", "#f1e4cc", "#d9dee8", "#eadfea", "#e7e0d3"];

export default function Categories() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <SectionHeading
        eyebrow="Categories"
        title="Everything for your big day"
        description="Pick a category and see approved vendors ready to make your wedding unforgettable."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((category, index) => {
          const Icon = icons[category] ?? Sparkles;
          return (
            <Reveal key={category} delay={index * 0.07}>
              <Link
                href={`/services?category=${encodeURIComponent(category)}`}
                className="group flex items-center gap-4 rounded-2xl border bg-card p-5 transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <span
                  className="flex size-14 shrink-0 items-center justify-center rounded-xl text-primary"
                  style={{ backgroundColor: tints[index % tints.length] }}
                >
                  <Icon className="size-6" />
                </span>
                <span>
                  <span className="font-display block text-2xl font-bold leading-tight">
                    {category}
                  </span>
                  <span className="text-sm text-primary group-hover:underline">
                    Browse vendors
                  </span>
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}