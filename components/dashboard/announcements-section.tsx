"use client";

import { Announcement } from "@/lib/types";
import AnnouncementCard from "../announcement/announcementCard";
interface AnnouncementsSectionProps {
  announcements: Announcement[];
}

export function AnnouncementsSection({ announcements }: AnnouncementsSectionProps) {

  if (announcements.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {announcements.map((announcement) => (
        <AnnouncementCard key={announcement.ANNOUNCEMENT_ID} announcement={announcement} />
      ))}
    </div>
  );
}
