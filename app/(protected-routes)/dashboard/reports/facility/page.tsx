"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { generateMetadata } from "@/lib/seo";
import { Wrench, AlertTriangle } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Facility } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/ui/data-table/data-table";
import { createColumns } from "@/components/report/facility/columns";

export default function FacilityReportsPage() {
  const [facilityReports, setFacilityReports] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/reports/with-details?type=FACILITY');
      const data = await response.json();
      
      if (response.ok && data.success) {
        const reports = Array.isArray(data.data) ? data.data : [];
        setFacilityReports(reports);
      } else {
        console.error('Error fetching facility reports:', data.error || 'Unknown error');
        setFacilityReports([]);
      }
    } catch (error) {
      console.error('Failed to fetch facility reports:', error);
      setFacilityReports([]);
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
    const types = Array.from(new Set(facilityReports.map((r) => r.FACILITY_TYPE)));
    const severities = Array.from(new Set(facilityReports.map((r) => r.SEVERITY_LEVEL)));

    return [
      {
        id: "FACILITY_TYPE",
        title: "Type",
        options: types.map((t) => ({ label: t, value: t })),
      },
      {
        id: "SEVERITY_LEVEL",
        title: "Severity",
        options: severities.map((s) => ({ label: s, value: s })),
      },
    ];
  }, [facilityReports]);

  const stats = {
    total: facilityReports.length,
    pending: facilityReports.filter(r => r.STATUS === "PENDING").length,
    inProgress: facilityReports.filter(r => r.STATUS === "IN_PROGRESS").length,
    resolved: facilityReports.filter(r => r.STATUS === "RESOLVED").length,
    critical: facilityReports.filter(r => r.SEVERITY_LEVEL === "CRITICAL").length,
  };

  if (loading) {
    return (
      <>
        <div className="space-y-4">
          <Skeleton className="h-12 w-1/3 rounded-md" />
          <Skeleton className="h-8 w-1/2 rounded-md" />
          <div className="grid gap-4 md:grid-cols-5">
            <Skeleton className="h-32 w-full rounded-md" />
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
    title: "Facility Reports - Cybercrime Reporting Platform",
    description: "View and manage all facility maintenance reports on the Cybercrime Reporting Platform.",
    canonical: "/dashboard/reports/facility",
  });

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Wrench className="h-8 w-8" />
          Facility Reports
        </h1>
        <p className="text-muted-foreground">
          View and manage all facility maintenance reports
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Facility issues</p>
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
              {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.critical}</div>
            <p className="text-xs text-muted-foreground">Urgent issues</p>
          </CardContent>
        </Card>
      </div>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Facility Reports</CardTitle>
          <CardDescription>View and manage all facility maintenance reports</CardDescription>
        </CardHeader>
        <CardContent>
          {facilityReports.length > 0 ? (
            <DataTable
              columns={columns}
              data={facilityReports}
              searchKey="TITLE"
              searchPlaceholder="Search reports by title..."
              filterableColumns={filterableColumns}
            />
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Wrench className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No facility reports found.</p>
              <p className="text-sm mt-2">Facility reports will appear here once submitted.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
