
import { Calendar} from "lucide-react";
import { Dialog, DialogHeader, DialogContent, DialogDescription, DialogTrigger, DialogTitle } from "../ui/dialog";
import { Announcement } from "@/lib/types";
import { format } from "date-fns";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { AnnouncementPriorityBadge, AnnouncementStatusBadge, AnnouncementTypeBadge } from "./announcementBadge";

interface AnnouncementCardProps {
    announcement: Announcement;
}

const AnnouncementCard = ({announcement} : AnnouncementCardProps) => {


  return (
    <Dialog> 
      <DialogTrigger asChild>
        <div className="cursor-pointer hover:opacity-90 transition-opacity">
          <div className=" relative aspect-video w-full bg-accent rounded-lg mb-4 flex items-center justify-center overflow-hidden">
            {announcement.photoPath ? (
              <Image
                width={400}
                height={225} 
                src={announcement.photoPath} 
                alt={announcement.title}
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
            <h3 className="font-semibold hover:underline">{announcement.title}</h3>
            <AnnouncementTypeBadge AnnouncementType={announcement.type} />
            <AnnouncementPriorityBadge priority={announcement.priority} />
          </div>
        </div>
      </DialogTrigger>
      
      <DialogContent className="!max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <DialogTitle className="text-2xl">{announcement.title}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 flex-wrap">
                <AnnouncementTypeBadge AnnouncementType={announcement.type} />
                <AnnouncementPriorityBadge priority={announcement.priority} />
                <AnnouncementStatusBadge status={announcement.status} />
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-6  mt-4">
          {/* Main Content */}
          <div className=" space-y-6">
            {announcement.photoPath && (
              <div className="aspect-video w-full bg-accent rounded-lg flex items-center justify-center overflow-hidden">
                <Image
                  width={800}
                  height={450}
                  src={announcement.photoPath}
                  alt={announcement.title}
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
                  <p className="text-base leading-7">{announcement.message}</p>
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
                      {format(new Date(announcement.startDate), "PPP")}
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">End Date</div>
                    <div className="text-muted-foreground">
                      {format(new Date(announcement.endDate), "PPP")}
                    </div>
                  </div>
                  </div>
              </div>  


                {announcement.updatedAt && (
                  
                                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    Last Updated At
                  </div>
                  <div className="flex gap-4 items-center flex-wrap">
                  <div className="text-sm">
                    <div className="font-medium">{format(new Date(announcement.updatedAt), "PPP")}</div>
                    <div className="text-muted-foreground">
                      announcement created by {announcement.createdBy}
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

export default AnnouncementCard