"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPriorityColor, getAnnouncementTypeColor } from "@/lib/utils/badge-helpers";
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
import { Bell, Plus, Search, MoreVertical, Eye, Edit, Trash2, Archive } from "lucide-react";
import Link from "next/link";
import { MOCK_ANNOUNCEMENTS } from "@/lib/api/mock-data";
import { Announcement } from "@/lib/types";
import { format } from "date-fns";
import { useHasAnyRole } from "@/hooks/use-user-role";
import { useState } from "react";
import { PaginationControls } from "@/components/ui/pagination-controls";

const ITEMS_PER_PAGE = 10;

export default function AnnouncementsPage() {
  const hasAnyRole = useHasAnyRole();
  const hasManageAccess = hasAnyRole(['STAFF', 'ADMIN', 'SUPERADMIN']);
  const [searchQuery, setSearchQuery] = useState("");
  const [publishedPage, setPublishedPage] = useState(1);
  const [draftPage, setDraftPage] = useState(1);
  const [archivedPage, setArchivedPage] = useState(1);

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

  // Reset pagination when search changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPublishedPage(1);
    setDraftPage(1);
    setArchivedPage(1);
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

  const AnnouncementTable = ({ 
    announcements, 
    currentPage, 
    onPageChange 
  }: { 
    announcements: Announcement[]; 
    currentPage: number;
    onPageChange: (page: number) => void;
  }) => {
    // Pagination
    const totalPages = Math.ceil(announcements.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedAnnouncements = announcements.slice(startIndex, endIndex);

    return (
      <div className="space-y-4">
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
        {paginatedAnnouncements.length === 0 ? (
          <TableRow>
            <TableCell colSpan={hasManageAccess ? 7 : 6} className="text-center text-muted-foreground">
              No announcements found
            </TableCell>
          </TableRow>
        ) : (
          paginatedAnnouncements.map((announcement) => (
            <TableRow key={announcement.announcementId}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/announcement/${announcement.announcementId}`}
                    className="font-medium hover:underline"
                  >
                    {announcement.title}
                  </Link>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getAnnouncementTypeColor(announcement.type)} variant="outline">
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
              <TableCell className="text-sm">Staff</TableCell>
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
                        <Link href={`/dashboard/announcement/${announcement.announcementId}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/announcement/${announcement.announcementId}/update`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
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
    {totalPages > 1 && paginatedAnnouncements.length > 0 && (
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        itemsPerPage={ITEMS_PER_PAGE}
        totalItems={announcements.length}
      />
    )}
    </div>
  );
  };

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
      <div className="grid gap-4 md:grid-cols-3">
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
                onChange={(e) => handleSearchChange(e.target.value)}
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
              <AnnouncementTable 
                announcements={publishedAnnouncements}
                currentPage={publishedPage}
                onPageChange={setPublishedPage}
              />
            </TabsContent>

            {hasManageAccess && (
              <>
                <TabsContent value="drafts" className="mt-4">
                  <AnnouncementTable 
                    announcements={draftAnnouncements}
                    currentPage={draftPage}
                    onPageChange={setDraftPage}
                  />
                </TabsContent>
                <TabsContent value="archived" className="mt-4">
                  <AnnouncementTable 
                    announcements={archivedAnnouncements}
                    currentPage={archivedPage}
                    onPageChange={setArchivedPage}
                  />
                </TabsContent>
              </>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
