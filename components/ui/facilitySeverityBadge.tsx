import { Badge } from "./badge";
import { SeverityLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

type FacilitySeverityBadgeProps = {
  severityLevel: SeverityLevel;
  className?: string;
};

export default function FacilitySeverityBadge({
  severityLevel,
  className,
}: FacilitySeverityBadgeProps) {
  const getSeverityColor = () => {
    switch (severityLevel) {
      case "LOW":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      case "MEDIUM":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "HIGH":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "CRITICAL":
        return "bg-red-500/10 text-red-500 border-red-500/20";
    }
  };

  return (
    <Badge className={cn(getSeverityColor(), className)}>
      {severityLevel.replace("_", " ")}
    </Badge>
  );
}