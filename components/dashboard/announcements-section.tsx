"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import Link from "next/link";
import { Announcement } from "@/lib/types";
import { format } from "date-fns";
import Image from "next/image";

interface AnnouncementsSectionProps {
  announcements: Announcement[];
}

export function AnnouncementsSection({ announcements }: AnnouncementsSectionProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "EMERGENCY": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "EVENT": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "GENERAL": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "MEDIUM": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "LOW": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  if (announcements.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {announcements.map((announcement) => (
        <div
          key={announcement.announcementId}
          className="flex h-full relative items-start gap-4 rounded-lg border p-4 hover:bg-accent/50 transition-colors"
        >
          <div className="flex-1 space-y-2">
            <div className="aspect-video w-full bg-accent rounded-lg mb-4 flex items-center justify-center overflow-hidden">
              {announcement.photoPath ? (
                <Image
                  width={200}
                  height={100} 
                  src={announcement.photoPath} 
                  alt={announcement.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <p className="text-sm text-muted-foreground">No photo uploaded</p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href={`/dashboard/announcement/${announcement.announcementId}`}
                className="font-semibold hover:underline"
              >
                {announcement.title}
              </Link>
              <Badge className={getTypeColor(announcement.type)} variant="outline">
                {announcement.type}
              </Badge>
              <Badge className={getPriorityColor(announcement.priority)} variant="outline">
                {announcement.priority}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {announcement.message}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(announcement.startDate), "MMM d")} -{" "}
                {format(new Date(announcement.endDate), "MMM d, yyyy")}
              </span>
              <span>Posted by Staff</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" asChild className="absolute right-4 top-4">
            <Link href={`/dashboard/announcement/${announcement.announcementId}`}>
              View
            </Link>
          </Button>
        </div>
      ))}
    </div>
  );
}
