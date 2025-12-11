"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  Pin,
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
import Image from "next/image";

export default function AnnouncementDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const hasAnyRole = useHasAnyRole();
  const hasManageAccess = hasAnyRole(['STAFF', 'ADMIN', 'SUPERADMIN']);

  const announcement = MOCK_ANNOUNCEMENTS.find((a) => a.id === params.id);

  if (!announcement) {
    notFound();
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "MEDIUM":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "LOW":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "EMERGENCY":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "EVENT":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "GENERAL":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "DRAFT":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "ARCHIVED":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const handleDelete = () => {
    // TODO: Implement API call to delete announcement
    console.log('Deleting announcement:', announcement.id);
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
            {announcement.isPinned && <Pin className="h-5 w-5 text-yellow-500" />}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>Posted by {announcement.createdByName || "Unknown"}</span>
            <span>•</span>
            <Clock className="h-4 w-4" />
            <span>{format(new Date(announcement.createdAt), "PPP")}</span>
          </div>
        </div>

        {hasManageAccess && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/announcement/${announcement.id}/update`}>
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
          {announcement.image_src && (
            <Card className="overflow-hidden">
               <div className="aspect-video w-full bg-muted relative">
                  <Image 
                                          width={200}
                        height={100}
                    src={announcement.image_src as string} 
                    alt={announcement.title}
                    className="w-full h-full object-cover"
                  />
               </div>
            </Card>
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
                <Badge className={getTypeColor(announcement.type)} variant="outline">
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
                <div className="text-sm">{announcement.createdByName || "Unknown"}</div>
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
                  <Pin className="h-4 w-4 mr-2" />
                  {announcement.isPinned ? "Unpin" : "Pin"} Announcement
                </Button>
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
