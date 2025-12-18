import { Badge } from "../ui/badge";
import { AnnouncementType } from "@/lib/types";
import { cn } from "@/lib/utils";

type AnnouncementTypeBadge = {
  AnnouncementType: AnnouncementType;
  className?: string;
};

type AnnouncementPriorityBadge = {
  priority: "HIGH" | "MEDIUM" | "LOW";
  className?: string;
};

type AnnouncementStatusBadge = {
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  className?: string;
};

export function AnnouncementTypeBadge({ AnnouncementType, className }: AnnouncementTypeBadge) {
  const getTypeColor = () => {
    switch (AnnouncementType) {
      case "EMERGENCY": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "EVENT": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "GENERAL": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return <Badge className={cn(getTypeColor(), className)}>{AnnouncementType.replace("_", " ")}</Badge>;
}

export function AnnouncementPriorityBadge({ priority, className }: AnnouncementPriorityBadge) {
  const getPriorityColor = () => {
    switch (priority) {
      case "HIGH": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "MEDIUM": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "LOW": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return <Badge className={cn(getPriorityColor(), className)}>{priority}</Badge>;
}

export function AnnouncementStatusBadge({ status, className }: AnnouncementStatusBadge) {
  const getStatusColor = () => {
    switch (status) {
      case "PUBLISHED": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "DRAFT": return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      case "ARCHIVED": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return <Badge className={cn(getStatusColor(), className)}>{status}</Badge>;
}