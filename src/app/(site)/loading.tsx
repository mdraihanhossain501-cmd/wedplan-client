import { Skeleton } from "@/components/ui/skeleton";

export default function SiteLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 py-16">
      <div className="mx-auto max-w-xl space-y-3 text-center">
        <Skeleton className="mx-auto h-4 w-32" />
        <Skeleton className="mx-auto h-12 w-full" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-80 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}