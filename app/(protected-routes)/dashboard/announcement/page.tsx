"use client";

import { Card, CardContent } from "@/components/ui/card";
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, Plus, Search, Eye, Edit, Trash2, List } from "lucide-react";
import Link from "next/link";
import { Announcement } from "@/lib/types";
import { useHasAnyRole } from "@/hooks/use-user-role";
import { useState, useEffect } from "react";
import { PaginationControls } from "@/components/ui/pagination-controls";
import DeleteAnnouncementDialog from "@/components/announcement/deleteAnnouncementDialog";
import { toast } from "sonner";
import { generateMetadata } from "@/lib/seo";

const ITEMS_PER_PAGE = 10;

export default function AnnouncementsPage() {
  const hasAnyRole = useHasAnyRole();
  const hasManageAccess = hasAnyRole(['STAFF','SUPERVISOR', 'ADMIN', 'SUPERADMIN']);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string; title: string }>({ 
    open: false, 
    id: '', 
    title: '' 
  });

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/announcements');
      if (!response.ok) throw new Error('Failed to fetch announcements');
      const data = await response.json();
      setAnnouncements(data as Announcement[]);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast.error('Failed to fetch announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Reset pagination when search changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleDeleteClick = (id: string, title: string) => {
    setDeleteDialog({ open: true, id, title });
  };

  const handleDeleteSuccess = () => {
    fetchAnnouncements();
  };

  // Client-side filtering
  const filteredAnnouncements = announcements.filter((announcement) => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      announcement.TITLE.toLowerCase().includes(searchLower) ||
      announcement.MESSAGE.toLowerCase().includes(searchLower) ||
      announcement.TYPE.toLowerCase().includes(searchLower) ||
      announcement.AUDIENCE.toLowerCase().includes(searchLower)
    );
  });

  // Client-side pagination
  const totalPages = Math.ceil(filteredAnnouncements.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedAnnouncements = filteredAnnouncements.slice(startIndex, endIndex);
  
  generateMetadata({
    title: "Announcements - Cybercrime Reporting Platform",
    description: "Stay updated with the latest campus announcements and notifications.",
    canonical: "/dashboard/announcement",
  });

   if (loading) {
    return (
      <>
        <div className="space-y-4">
          <Skeleton className="h-12 w-1/3 rounded-md" />
          <Skeleton className="h-8 w-1/2 rounded-md" />
          <Skeleton className="h-8 w-1/4 rounded-md" />
          <Skeleton className="h-[500px] w-full rounded-md" />
        </div>
      </>
    );
  }

  const AnnouncementTable = ({ 
    announcements, 
    currentPage,
    totalPages,
    onPageChange 
  }: { 
    announcements: Announcement[]; 
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }) => {
    return (
      <div className="space-y-4 ">
   <Table className="overflow-hidden border shadow-md">
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Audience</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Date Range</TableHead>
          <TableHead>Status</TableHead>
          {hasManageAccess && <TableHead className="text-right">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>

          {announcements.map((announcement) => (
            <TableRow key={announcement.ANNOUNCEMENT_ID}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/announcement/${announcement.ANNOUNCEMENT_ID}`}
                    className="font-medium hover:underline"
                  >
                    {announcement.TITLE}
                  </Link>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getAnnouncementTypeColor(announcement.TYPE)} variant="outline">
                  {announcement.TYPE}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{announcement.AUDIENCE}</Badge>
              </TableCell>
              <TableCell>
                <Badge className={getPriorityColor(announcement.PRIORITY)} variant="outline">
                  {announcement.PRIORITY}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(announcement.START_DATE).toLocaleDateString()} - 
                {new Date(announcement.END_DATE).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-sm">
                <Badge className={announcement.STATUS === 'PUBLISHED' ? "bg-green-500/10 border-green-700 text-green-700" : ""} variant="outline">{announcement.STATUS}</Badge>
              </TableCell>
              {hasManageAccess && (
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link href={`/dashboard/announcement/${announcement.ANNOUNCEMENT_ID}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      View Details
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link href={`/dashboard/announcement/${announcement.ANNOUNCEMENT_ID}/update`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Edit Announcement
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-red-500/10 text-red-500 border-red-300 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500"
                      size="sm"
                      onClick={() => handleDeleteClick(announcement.ANNOUNCEMENT_ID, announcement.TITLE)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Delete Announcement
                    </TooltipContent>
                  </Tooltip>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        
      </TableBody>
    </Table> 
    {totalPages > 1 && (
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        itemsPerPage={ITEMS_PER_PAGE}
        totalItems={filteredAnnouncements.length}
      />
    )}
    </div>
  );
  };

  return (
    <div className="space-y-6">
      <DeleteAnnouncementDialog
        announcementId={deleteDialog.id}
        announcementTitle={deleteDialog.title}
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        onSuccess={handleDeleteSuccess}
      />
      
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
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search announcements..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 max-w-2xl"
              />
            </div>
          </div>

      {filteredAnnouncements.length > 0 ?           
              <Card>
                <CardContent>
                  <AnnouncementTable 
                    announcements={paginatedAnnouncements}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    totalPages={totalPages}
                    />
                </CardContent>
            </Card>: 
            <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <List />
        </EmptyMedia>
        <EmptyTitle>No Announcements</EmptyTitle>
        <EmptyDescription>
          The system currently has no announcements. Try adding new announcements to keep everyone informed.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>}
      {/* Search and Filters */}

    </div>
  );
}
