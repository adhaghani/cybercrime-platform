import { Badge } from "./badge";
import { CrimeCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

type CrimeCategoryBadgeProps = {
  category: CrimeCategory;
  className?: string;
};

export default function CrimeCategoryBadge({ category, className }: CrimeCategoryBadgeProps) {
  const getCategoryColor = () => {
    switch (category) {
      case "THEFT":
        return "bg-orange-500/10 text-orange-500 border-yellow-500/20";
      case "ASSAULT":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "VANDALISM":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "HARASSMENT":
        return "bg-pink-500/10 text-pink-500 border-pink-500/20";
      case "OTHER":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return <Badge className={cn(getCategoryColor(), className)}>{category.replace("_", " ")}</Badge>;
}