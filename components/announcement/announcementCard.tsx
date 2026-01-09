import { Announcement } from "@/lib/types";
import Image from "next/image";
import { Button } from "../ui/button";
import { AnnouncementPriorityBadge, AnnouncementTypeBadge } from "./announcementBadge";
import AnnouncementDialog from "./announcementDialog";
import { useState } from "react";

interface AnnouncementCardProps {
  announcement: Announcement;
}

const AnnouncementCard = ({announcement} : AnnouncementCardProps) => {
  const [OpenDetail, setOpenDetail] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  
  const truncateMessage = (message: string, maxLength: number = 120) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength).trim() + "...";
  };
  
  return (
    <>
      <div onClick={() => setOpenDetail(true)} className="cursor-pointer hover:opacity-90 transition-opacity">
        <div className="relative aspect-video w-full bg-accent rounded-lg mb-4 flex items-center justify-center overflow-hidden">
          {announcement.PHOTO_PATH && !imageError ? (
            <Image
              width={400}
              height={225} 
              src={announcement.PHOTO_PATH} 
              alt={announcement.TITLE}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full p-6 flex flex-col justify-center">
              <h4 className="font-semibold text-lg mb-2 line-clamp-2">
                {announcement.TITLE}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {truncateMessage(announcement.MESSAGE)}
              </p>
            </div>
          )}
          <Button className="absolute right-4 bottom-4 cursor-pointer" variant={"secondary"}>
            View More
          </Button>
        </div>
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <h3 className="font-semibold hover:underline">{announcement.TITLE}</h3>
          <AnnouncementTypeBadge AnnouncementType={announcement.TYPE} />
          <AnnouncementPriorityBadge priority={announcement.PRIORITY} />
        </div>
      </div>
      <AnnouncementDialog 
        announcement={announcement} 
        open={OpenDetail} 
        onOpenChange={setOpenDetail} 
      />
    </>   
  )
}

export default AnnouncementCard