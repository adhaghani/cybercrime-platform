import { Badge } from "./badge";
import { ReportStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  status: ReportStatus;
  className?: string;
};

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusColor = () => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "IN_PROGRESS":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "RESOLVED":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "REJECTED":
        return "bg-red-500/10 text-red-500 border-red-500/20";
    }
  };

  return <Badge className={cn(getStatusColor(), className)}>{status.replace("_", " ")}</Badge>;
}