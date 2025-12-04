"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Plus, Search, MoreVertical, Eye, Edit, Trash2, Pin, Archive } from "lucide-react";
import Link from "next/link";
import { MOCK_ANNOUNCEMENTS } from "@/lib/api/mock-data";
import { Announcement } from "@/lib/types";
import { format } from "date-fns";
import { useHasAnyRole, useUserRole } from "@/hooks/use-user-role";
import { useState } from "react";

export default function AnnouncementsPage() {
  const hasAnyRole = useHasAnyRole();
  const hasManageAccess = hasAnyRole(['STAFF', 'ADMIN']);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter announcements based on search
  const filteredAnnouncements = (announcements: Announcement[]) => {
    if (!searchQuery) return announcements;
    const query = searchQuery.toLowerCase();
    return announcements.filter(
      (ann) =>
        ann.title.toLowerCase().includes(query) ||
        ann.message.toLowerCase().includes(query)
    );
  };

  const publishedAnnouncements = filteredAnnouncements(
    MOCK_ANNOUNCEMENTS.filter((a) => a.status === "PUBLISHED")
  );
  const draftAnnouncements = filteredAnnouncements(
    MOCK_ANNOUNCEMENTS.filter((a) => a.status === "DRAFT")
  );
  const archivedAnnouncements = filteredAnnouncements(
    MOCK_ANNOUNCEMENTS.filter((a) => a.status === "ARCHIVED")
  );

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

  const AnnouncementTable = ({ announcements }: { announcements: Announcement[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Audience</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Date Range</TableHead>
          <TableHead>Created By</TableHead>
          {hasManageAccess && <TableHead className="text-right">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {announcements.length === 0 ? (
          <TableRow>
            <TableCell colSpan={hasManageAccess ? 7 : 6} className="text-center text-muted-foreground">
              No announcements found
            </TableCell>
          </TableRow>
        ) : (
          announcements.map((announcement) => (
            <TableRow key={announcement.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {announcement.isPinned && <Pin className="h-4 w-4 text-yellow-500" />}
                  <Link
                    href={`/dashboard/announcement/${announcement.id}`}
                    className="font-medium hover:underline"
                  >
                    {announcement.title}
                  </Link>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getTypeColor(announcement.type)} variant="outline">
                  {announcement.type}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{announcement.audience}</Badge>
              </TableCell>
              <TableCell>
                <Badge className={getPriorityColor(announcement.priority)} variant="outline">
                  {announcement.priority}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {format(new Date(announcement.startDate), "MMM d")} -{" "}
                {format(new Date(announcement.endDate), "MMM d, yyyy")}
              </TableCell>
              <TableCell className="text-sm">{announcement.createdByName || "Unknown"}</TableCell>
              {hasManageAccess && (
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/announcement/${announcement.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/announcement/${announcement.id}/update`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Pin className="h-4 w-4 mr-2" />
                        {announcement.isPinned ? "Unpin" : "Pin"}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Archive className="h-4 w-4 mr-2" />
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="h-8 w-8" />
            Announcements
          </h1>
          <p className="text-muted-foreground">
            {hasManageAccess
              ? "Manage campus announcements and notifications"
              : "View important campus announcements and updates"}
          </p>
        </div>
        {hasManageAccess && (
          <Button asChild>
            <Link href="/dashboard/announcement/new-announcement">
              <Plus className="h-4 w-4 mr-2" />
              Create Announcement
            </Link>
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{MOCK_ANNOUNCEMENTS.length}</div>
            <p className="text-xs text-muted-foreground">All announcements</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Bell className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{publishedAnnouncements.length}</div>
            <p className="text-xs text-muted-foreground">Active announcements</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <Bell className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{draftAnnouncements.length}</div>
            <p className="text-xs text-muted-foreground">Pending publication</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pinned</CardTitle>
            <Pin className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {MOCK_ANNOUNCEMENTS.filter((a) => a.isPinned).length}
            </div>
            <p className="text-xs text-muted-foreground">Highlighted items</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>All Announcements</CardTitle>
          <CardDescription>Browse and manage campus announcements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search announcements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Tabs defaultValue="published" className="w-full">
            <TabsList>
              <TabsTrigger value="published">
                Published ({publishedAnnouncements.length})
              </TabsTrigger>
              {hasManageAccess && (
                <>
                  <TabsTrigger value="drafts">Drafts ({draftAnnouncements.length})</TabsTrigger>
                  <TabsTrigger value="archived">
                    Archived ({archivedAnnouncements.length})
                  </TabsTrigger>
                </>
              )}
            </TabsList>

            <TabsContent value="published" className="mt-4">
              <AnnouncementTable announcements={publishedAnnouncements} />
            </TabsContent>

            {hasManageAccess && (
              <>
                <TabsContent value="drafts" className="mt-4">
                  <AnnouncementTable announcements={draftAnnouncements} />
                </TabsContent>
                <TabsContent value="archived" className="mt-4">
                  <AnnouncementTable announcements={archivedAnnouncements} />
                </TabsContent>
              </>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
