
import { Calendar} from "lucide-react";
import { Dialog, DialogHeader, DialogContent, DialogDescription, DialogTitle } from "../ui/dialog";
import { Announcement } from "@/lib/types";
import { format } from "date-fns";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

import { AnnouncementPriorityBadge, AnnouncementStatusBadge, AnnouncementTypeBadge } from "./announcementBadge";

interface AnnouncementCardProps {
    announcement: Announcement;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const AnnouncementDialog = ({announcement, open, onOpenChange} : AnnouncementCardProps) => {

  return (
    <Dialog open={open} onOpenChange={onOpenChange}> 
      <DialogContent className="!max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <DialogTitle className="text-2xl">{announcement.TITLE}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 flex-wrap">
                <AnnouncementTypeBadge AnnouncementType={announcement.TYPE} />
                <AnnouncementPriorityBadge priority={announcement.PRIORITY} />
                <AnnouncementStatusBadge status={announcement.STATUS} />
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-6  mt-4">
          <div className=" space-y-6">
            {announcement.PHOTO_PATH && (
              <div className="aspect-video w-full bg-accent rounded-lg flex items-center justify-center overflow-hidden">
                <Image
                  width={800}
                  height={450}
                  src={announcement.PHOTO_PATH}
                  alt={announcement.TITLE}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle>Announcement Message</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <p className="text-base leading-7">{announcement.MESSAGE}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
              <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Display Period
                  </div>
                  <div className="flex gap-4 items-center flex-wrap">
                  <div className="text-sm">
                    <div className="font-medium">Start Date</div>
                    <div className="text-muted-foreground">
                      {format(new Date(announcement.START_DATE), "PPP")}
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">End Date</div>
                    <div className="text-muted-foreground">
                      {format(new Date(announcement.END_DATE), "PPP")}
                    </div>
                  </div>
                  </div>
              </div>  


                {announcement.UPDATED_AT && (
                  
                                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    Last Updated At
                  </div>
                  <div className="flex gap-4 items-center flex-wrap">
                  <div className="text-sm">
                    <div className="font-medium">{format(new Date(announcement.UPDATED_AT), "PPP")}</div>
                    <div className="text-muted-foreground">
                      announcement created by {announcement.CREATED_BY}
                    </div>
                  </div>
                  </div>
              </div>  
                  
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AnnouncementDialog