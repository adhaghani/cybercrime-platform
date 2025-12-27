

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

  return (
        <>
        <div onClick={() => setOpenDetail(true)} className="cursor-pointer hover:opacity-90 transition-opacity">
          <div className=" relative aspect-video w-full bg-accent rounded-lg mb-4 flex items-center justify-center overflow-hidden">
            {announcement.PHOTO_PATH ? (
              <Image
                width={400}
                height={225} 
                src={announcement.PHOTO_PATH} 
                alt={announcement.TITLE}
                className="w-full h-full object-cover"
              />
            ) : (
              <p className="text-sm text-muted-foreground">No photo uploaded</p>
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