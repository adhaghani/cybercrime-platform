"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { getPriorityColor, getAnnouncementTypeColor, getStatusColor } from "@/lib/utils/badge-helpers";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Bell,
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  User,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useHasAnyRole } from "@/hooks/use-user-role";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { useState, useEffect } from "react";
import { Announcement } from "@/lib/types";
import { generateMetadata } from "@/lib/seo";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnnouncementDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const hasAnyRole = useHasAnyRole();
  const hasManageAccess = hasAnyRole(['STAFF', 'ADMIN', 'SUPERVISOR' ,'SUPERADMIN']);
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await fetch(`/api/announcements/${params.id}`);
        if (!response.ok) throw new Error('Not found');
        const data = await response.json();
        setAnnouncement(data);
      } catch (error) {
        console.error('Error fetching announcement:', error);
        setAnnouncement(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncement();
  }, [params.id]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/announcements/${params.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete');
      router.push('/dashboard/announcement');
    } catch (error) {
      console.error('Error deleting announcement:', error);
      alert('Failed to delete announcement');
    }
  };

   if (loading) {
    return (
      <>
        <div className="space-y-4 max-w-3xl mx-auto">
          <Skeleton className="h-12 w-1/3 rounded-md" />
          <Skeleton className="w-full aspect-video rounded-md" />
          <Skeleton className="h-12 w-full rounded-md" />
          <Skeleton className="h-24 w-full rounded-md" />
        </div>
      </>
    );
  }

  if (!announcement) {
    notFound();
  }

  generateMetadata({
    title: announcement ? `${announcement.TITLE} - Cybercrime Reporting Platform` : "Announcement Not Found - Cybercrime Reporting Platform",
    description: announcement ? announcement.MESSAGE.slice(0, 160) : "The requested announcement could not be found.",
    canonical: `/dashboard/announcement/${params.id}`,
  });

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/announcement">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Announcements
          </Link>
        </Button>
                {hasManageAccess && (
          <div className="flex items-center gap-2">
            <Tooltip>
            <TooltipTrigger asChild>
            <Button variant="outline" size="icon-sm" asChild>
              <Link href={`/dashboard/announcement/${announcement.ANNOUNCEMENT_ID}/update`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit this announcement</p>
            </TooltipContent>
            </Tooltip>
            <Dialog>
              <DialogTrigger asChild>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon-sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete this announcement</p>
                  </TooltipContent>
                </Tooltip>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete the announcement.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={handleDelete} variant="destructive">
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
      {
       imageError ? 
       <>
        <div className="aspect-video w-full grid place-items-center bg-muted rounded-lg border">
        <p>no image available</p>
        </div>
       </> : announcement.PHOTO_PATH && (
          <div className="aspect-video w-full ">
            <Image
            width={500}
            height={248}
              src={announcement.PHOTO_PATH}
              alt="Announcement Photo"
              className="w-full aspect-video object-cover rounded-lg"
              onError={() => setImageError(true)}
            />
          </div>
        )
      }
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex justify-between items-center gap-2 flex-wrap">
            <div className="flex-1 flex">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Bell className="h-8 w-8" />
              {announcement.TITLE}
            </h1>
            </div>
            <div className="flex flex-1 items-center gap-2">
            <Badge className={getStatusColor(announcement.STATUS)} variant="outline">
                  {announcement.STATUS}
                </Badge>
                <Badge className={getAnnouncementTypeColor(announcement.TYPE)} variant="outline">
                  {announcement.TYPE}
                </Badge>
                <Badge className={getPriorityColor(announcement.PRIORITY)} variant="outline">
                  {announcement.PRIORITY}
                </Badge>
              </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>Posted by {announcement.CREATED_BY || "Unknown"}</span>
            <span>•</span>
            <Clock className="h-4 w-4" />
            <span>{format(new Date(announcement.CREATED_AT), "PPP")}</span>
          </div>
        </div>


      </div>

      <div className="space-y-4">
        {/* Main Content */}
        <div >
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
        <div className="space-y-6" >

              <div className="flex items-start gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Created By</div>
                <div className="text-sm">{announcement.CREATED_BY || "Unknown"}</div>
              </div>

              {announcement.UPDATED_AT && (
                <>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Last Updated</div>
                    <div className="text-sm">
                      {format(new Date(announcement.UPDATED_AT), "PPP")}
                    </div>
                  </div>
                </>
              )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Display Period
                </div>
                <div className="flex items-center gap-4">
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

        </div>
      </div>
    </div>
  );
}
