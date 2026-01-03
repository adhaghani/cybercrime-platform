"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Crime } from "@/lib/types";
import { generateMetadata } from "@/lib/seo";
import { DataTable } from "@/components/ui/data-table/data-table";
import { createColumns } from "@/components/report/crime/columns";
import { Skeleton } from "@/components/ui/skeleton";

export default function CrimeReportsPage() {
  const [crimeReports, setCrimeReports] = useState<Crime[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/reports/with-details?type=CRIME');
      const data = await response.json();
      
      if (response.ok && data.success) {
        const reports = Array.isArray(data.data) ? data.data : [];
        setCrimeReports(reports);
      } else {
        console.error('Error fetching crime reports:', data.error || 'Unknown error');
        setCrimeReports([]);
      }
    } catch (error) {
      console.error('Failed to fetch crime reports:', error);
      setCrimeReports([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo(() => {
    return createColumns({
      onViewDetails: (id) => {
        window.location.href = `/dashboard/reports/${id}`;
      },
      onAssign: (id) => {
        window.location.href = `/dashboard/reports/${id}?action=assign`;
      },
    });
  }, []);

  const filterableColumns = useMemo(() => {
    const statuses = Array.from(new Set(crimeReports.map((r) => r.STATUS)));
    const categories = Array.from(new Set(crimeReports.map((r) => r.CRIME_CATEGORY)));

    return [
      {
        id: "STATUS",
        title: "Status",
        options: statuses.map((s) => ({ label: s, value: s })),
      },
      {
        id: "CRIME_CATEGORY",
        title: "Category",
        options: categories.map((c) => ({ label: c, value: c })),
      },
    ];
  }, [crimeReports]);

  const stats = {
    total: crimeReports.length,
    pending: crimeReports.filter(r => r.STATUS === "PENDING").length,
    inProgress: crimeReports.filter(r => r.STATUS === "IN_PROGRESS").length,
    resolved: crimeReports.filter(r => r.STATUS === "RESOLVED").length,
  };

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
          <Skeleton className="h-[400px] w-full rounded-md" />
        </div>
      </>
    );
  }

  generateMetadata({
    title: "Crime Reports - Cybercrime Reporting Platform",
    description: "View and manage all crime-related reports on the Cybercrime Reporting Platform.",
    canonical: "/dashboard/reports/crime",
  });

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <ShieldAlert className="h-8 w-8" />
          Crime Reports
        </h1>
        <p className="text-muted-foreground">
          View and manage all crime-related reports
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Crime Reports</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Crime incidents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">Being handled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.resolved}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}% resolution rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Crime Reports</CardTitle>
          <CardDescription>View and manage all crime-related reports</CardDescription>
        </CardHeader>
        <CardContent>
          {crimeReports.length > 0 ? (
            <DataTable
              columns={columns}
              data={crimeReports}
              searchKey="TITLE"
              searchPlaceholder="Search reports by title..."
              filterableColumns={filterableColumns}
            />
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <ShieldAlert className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No crime reports found.</p>
              <p className="text-sm mt-2">Crime reports will appear here once submitted.</p>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}