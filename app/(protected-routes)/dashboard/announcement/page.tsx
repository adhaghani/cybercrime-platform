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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Bell, Plus, Search, MoreVertical, Eye, Edit, Trash2, Loader2, List } from "lucide-react";
import {Tabs, TabsList, TabsTrigger, TabsContent} from "@/components/ui/tabs";
import Link from "next/link";
import { Announcement } from "@/lib/types";
import { useHasAnyRole } from "@/hooks/use-user-role";
import { useState, useEffect } from "react";
import { PaginationControls } from "@/components/ui/pagination-controls";
import AnnouncementCard from "@/components/announcement/announcementCard";
import DeleteAnnouncementDialog from "@/components/announcement/deleteAnnouncementDialog";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;

export default function AnnouncementsPage() {
  const hasAnyRole = useHasAnyRole();
  const hasManageAccess = hasAnyRole(['STAFF','SUPERVISOR', 'ADMIN', 'SUPERADMIN']);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [Page, setPage] = useState(1);
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
      setAnnouncements(data.announcements as Announcement[]);
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
    setPage(1);
  };

  const handleDeleteClick = (id: string, title: string) => {
    setDeleteDialog({ open: true, id, title });
  };

  const handleDeleteSuccess = () => {
    fetchAnnouncements();
  };

  // Filter announcements based on search query
  const filteredAnnouncements = announcements.filter((announcement) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      announcement.TITLE.toLowerCase().includes(searchLower) ||
      announcement.MESSAGE.toLowerCase().includes(searchLower) ||
      announcement.TYPE.toLowerCase().includes(searchLower) ||
      announcement.AUDIENCE.toLowerCase().includes(searchLower)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredAnnouncements.length / ITEMS_PER_PAGE);
  const startIndex = (Page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedAnnouncements = filteredAnnouncements.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
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
          <TableHead>Created By</TableHead>
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
              <TableCell className="text-sm">{announcement.CREATED_BY}</TableCell>
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
                        <Link href={`/dashboard/announcement/${announcement.ANNOUNCEMENT_ID}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/announcement/${announcement.ANNOUNCEMENT_ID}/update`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => handleDeleteClick(announcement.ANNOUNCEMENT_ID, announcement.TITLE)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
        totalItems={announcements.length}
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


          <h4>All Announcements</h4>
          <p>Browse and manage campus announcements</p>

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

      {filteredAnnouncements.length > 0 ? <Tabs defaultValue="TABLE">
        <TabsList defaultValue={"TABLE"} className="w-fit mb-4 bg-secondary/50 rounded-full p-1">
          <TabsTrigger 
            value="TABLE"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full"
          >
            Table View
          </TabsTrigger>
          <TabsTrigger 
            value="CARD"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full"
          >
            Card View
          </TabsTrigger>
        </TabsList>
        <TabsContent value="TABLE">
            <Card>
                <CardContent>
                  <AnnouncementTable 
                    announcements={paginatedAnnouncements}
                    currentPage={Page}
                    onPageChange={setPage}
                    totalPages={totalPages}
                    />
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="CARD">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {
              paginatedAnnouncements.map((announcement) => (
                <AnnouncementCard 
                  key={announcement.ANNOUNCEMENT_ID} 
                  announcement={announcement} 
                />
              ))
            }
          </div>
          {totalPages > 1 && (
            <div className="mt-6">
              <PaginationControls
                currentPage={Page}
                totalPages={totalPages}
                onPageChange={setPage}
                itemsPerPage={ITEMS_PER_PAGE}
                totalItems={filteredAnnouncements.length}
              />
            </div>
          )}
        </TabsContent>
      </Tabs> : <Empty className="border border-dashed">
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
