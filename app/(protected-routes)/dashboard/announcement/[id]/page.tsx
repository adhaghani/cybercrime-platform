"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  Bell,
  ArrowLeft,
  Edit,
  Trash2,

  Archive,
  Calendar,
  User,
  Clock,
  Target,
} from "lucide-react";
import Link from "next/link";
import { MOCK_ANNOUNCEMENTS } from "@/lib/api/mock-data";
import { format } from "date-fns";
import { useHasAnyRole } from "@/hooks/use-user-role";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";

export default function AnnouncementDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const hasAnyRole = useHasAnyRole();
  const hasManageAccess = hasAnyRole(['STAFF', 'ADMIN', 'SUPERADMIN']);

  const announcement = MOCK_ANNOUNCEMENTS.find((a) => a.announcementId === params.id);

  if (!announcement) {
    notFound();
  }

  const handleDelete = () => {
    // TODO: Implement API call to delete announcement
    console.log('Deleting announcement:', announcement.announcementId);
    router.push('/dashboard/announcement');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/announcement">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Announcements
          </Link>
        </Button>
      </div>

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Bell className="h-8 w-8" />
              {announcement.title}
            </h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>Posted by {announcement.createdBy || "Unknown"}</span>
            <span>•</span>
            <Clock className="h-4 w-4" />
            <span>{format(new Date(announcement.createdAt), "PPP")}</span>
          </div>
        </div>

        {hasManageAccess && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/announcement/${announcement.announcementId}/update`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
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

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
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
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Status</div>
                <Badge className={getStatusColor(announcement.status)} variant="outline">
                  {announcement.status}
                </Badge>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Type</div>
                <Badge className={getAnnouncementTypeColor(announcement.type)} variant="outline">
                  {announcement.type}
                </Badge>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Priority</div>
                <Badge className={getPriorityColor(announcement.priority)} variant="outline">
                  {announcement.priority}
                </Badge>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Target className="h-4 w-4" />
                  Target Audience
                </div>
                <Badge variant="outline">{announcement.audience}</Badge>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Display Period
                </div>
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

              <Separator />

              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Created By</div>
                <div className="text-sm">{announcement.createdBy || "Unknown"}</div>
              </div>

              {announcement.updatedAt && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Last Updated</div>
                    <div className="text-sm">
                      {format(new Date(announcement.updatedAt), "PPP")}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {hasManageAccess && (
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Archive className="h-4 w-4 mr-2" />
                  Archive Announcement
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
