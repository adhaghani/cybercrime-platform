
"use client";
import { generateMetadata,  } from "@/lib/seo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ClipboardList, 
  CheckCircle2,
} from "lucide-react";

import { useState, useEffect } from "react";

import { Report } from "@/lib/types";
import { useAuth } from "@/lib/context/auth-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { createColumns } from "@/components/staff/my-assignment/columns";
import { DataTable } from "@/components/ui/data-table/data-table";

export default function MyAssignmentsPage() {
  const { claims } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAssignedReports = async () => {
      try {
        
        // Fetch report assignments to find reports assigned to current user
        const assignmentsResponse = await fetch('/api/report-assignments/my-assignments');
        if (!assignmentsResponse.ok) throw new Error('Failed to fetch assignments');
        const assignments = await assignmentsResponse.json();
        setReports(assignments.data);
      } catch (error) {
        console.error('Error fetching assigned reports:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignedReports();
  }, [claims]);

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.STATUS === "PENDING").length,
    inProgress: reports.filter(r => r.STATUS === "IN_PROGRESS").length,
    resolved: reports.filter(r => r.STATUS === "RESOLVED").length,
  };

  const filterableColumns = [
    {
      id: 'STATUS',
      title: 'Status',
      options: [{
        label: 'Pending', value: 'PENDING'
      },
      {
        label: 'In Progress', value: 'IN_PROGRESS'
      },
      {
        label: 'Resolved', value: 'RESOLVED'
      },
      {
        label: 'Rejected', value: 'REJECTED'
      }],
    },
    {
      id: 'TYPE',
      title: 'Type',
      options: [
        { label: 'Crime', value: 'CRIME' },
        { label: 'Facility', value: 'FACILITY' },
      ],
    }
  ]

  if (loading) {
    return (
      <>
        <div className="space-y-4">
          <Skeleton className="h-12 w-1/3 rounded-md" />
          <Skeleton className="h-8 w-1/2 rounded-md" />
          <div className="grid gap-4 md:grid-cols-4">
            <Skeleton className="h-32 w-full rounded-md" />
            <Skeleton className="h-32 w-full rounded-md" />
            <Skeleton className="h-32 w-full rounded-md" />
            <Skeleton className="h-32 w-full rounded-md" />
          </div>
          <Skeleton className="h-32 w-full rounded-md" />
          <Skeleton className="h-[400px] w-full rounded-md" />
        </div>
      </>
    );
  }

  generateMetadata({
    title: "My Assignments - Cybercrime Reporting Platform",
    description: "View and manage reports assigned to you on the Cybercrime Reporting Platform.",
    canonical: "/dashboard/reports/my-assignments",
  });


  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <ClipboardList className="h-8 w-8" />
          My Assignments
        </h1>
        <p className="text-muted-foreground">
          View and manage reports assigned to you
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Assignments</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Assigned to me</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Not started</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">Working on</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.resolved}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}% completion
            </p>
          </CardContent>
        </Card>
      </div>
      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Assigned Reports ({reports.length})</CardTitle>
          <CardDescription className="flex justify-between items-center gap-2 flex-wrap">
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reports.length > 0 ? (
            <DataTable 
              columns={createColumns()} 
              data={reports}
              searchKey="TITLE"
              searchPlaceholder="Search by report Title..."
              filterableColumns={filterableColumns}
            />
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No assigned reports found matching your filters.</p>
              <p className="text-sm mt-2">Try adjusting your search criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}