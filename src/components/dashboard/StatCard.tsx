import type { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function StatCard({
  label,
  value,
  icon: Icon,
  loading,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  loading?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border bg-card p-5">
      <div className="flex size-12 items-center justify-center rounded-xl bg-secondary text-primary">
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        {loading ? (
          <Skeleton className="mt-1 h-7 w-16" />
        ) : (
          <p className="font-display text-3xl font-bold capitalize leading-tight">
            {value}
          </p>
        )}
      </div>
    </div>
  );
}