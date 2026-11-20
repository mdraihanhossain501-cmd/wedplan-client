import { Badge } from "@/components/ui/badge";

const styles: Record<string, string> = {
  pending: "bg-[#f1e4cc] text-[#6b4f12] hover:bg-[#f1e4cc]",
  accepted: "bg-[#dce6df] text-[#2f4a3b] hover:bg-[#dce6df]",
  approved: "bg-[#dce6df] text-[#2f4a3b] hover:bg-[#dce6df]",
  rejected: "bg-[#f6e6e9] text-[#7a2e41] hover:bg-[#f6e6e9]",
  cancelled: "bg-[#e8e4e1] text-[#4a3f43] hover:bg-[#e8e4e1]",
  success: "bg-[#dce6df] text-[#2f4a3b] hover:bg-[#dce6df]",
  paid: "bg-[#dce6df] text-[#2f4a3b] hover:bg-[#dce6df]",
  failed: "bg-[#f6e6e9] text-[#7a2e41] hover:bg-[#f6e6e9]",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      className={`border-0 capitalize ${
        styles[status] ?? "bg-muted text-foreground hover:bg-muted"
      }`}
    >
      {status}
    </Badge>
  );
}