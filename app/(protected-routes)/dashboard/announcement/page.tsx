"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, Plus, List } from "lucide-react";
import { DataTable } from "@/components/ui/data-table/data-table";
import { createColumns } from "@/components/announcement/columns";
import Link from "next/link";
import { Announcement } from "@/lib/types";
import { useHasAnyRole } from "@/hooks/use-user-role";
import { useState, useEffect, useMemo } from "react";
import DeleteAnnouncementDialog from "@/components/announcement/deleteAnnouncementDialog";
import { toast } from "sonner";
import { generateMetadata } from "@/lib/seo";

export default function AnnouncementsPage() {
  const hasAnyRole = useHasAnyRole();
  const hasManageAccess = hasAnyRole(['STAFF','SUPERVISOR', 'ADMIN', 'SUPERADMIN']);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
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

  const handleDeleteClick = (id: string, title: string) => {
    setDeleteDialog({ open: true, id, title });
  };

  const handleDeleteSuccess = () => {
    fetchAnnouncements();
  };

  // Get unique values for filters
  const types = Array.from(new Set(announcements.map(a => a.TYPE)));
  const audiences = Array.from(new Set(announcements.map(a => a.AUDIENCE)));
  const priorities = Array.from(new Set(announcements.map(a => a.PRIORITY)));
  const statuses = Array.from(new Set(announcements.map(a => a.STATUS)));

  // Create columns with handlers
  const columns = useMemo(
    () => createColumns({
      onDelete: handleDeleteClick,
      hasManageAccess,
    }),
    [hasManageAccess]
  );

  // Prepare filterable columns
  const filterableColumns = [
    {
      id: "TYPE",
      title: "Type",
      options: types.map(type => ({ label: type, value: type })),
    },
    {
      id: "AUDIENCE",
      title: "Audience",
      options: audiences.map(audience => ({ label: audience, value: audience })),
    },
    {
      id: "PRIORITY",
      title: "Priority",
      options: priorities.map(priority => ({ label: priority, value: priority })),
    },
    {
      id: "STATUS",
      title: "Status",
      options: statuses.map(status => ({ label: status, value: status })),
    },
  ];
  
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

      {announcements.length === 0 ? (
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
        </Empty>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Announcements List ({announcements.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={announcements}
              searchKey="TITLE"
              searchPlaceholder="Search by title, message, type, or audience..."
              filterableColumns={filterableColumns}
            />
          </CardContent>
        </Card>
      )}

    </div>
  );
}
