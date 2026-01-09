"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Search} from "lucide-react";
import Link from "next/link";
import { Facility, ReportStatus, SeverityLevel } from "@/lib/types";
import ReportCard from "@/components/report/reportCard";
import { generateMetadata } from "@/lib/seo";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { Skeleton } from "@/components/ui/loading";
import { toast } from "sonner";

export default function AllReportsPage() {
  const [reports, setReports] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "ALL">("ALL");
  const [severityFilter, setSeverityFilter] = useState<SeverityLevel | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  useEffect(() => {
    const fetchFacilityReports = async () => {
      try {
        const response = await fetch('/api/reports/with-details?type=FACILITY');
        if (!response.ok) throw new Error('Failed to fetch reports');
        const data = await response.json();
        // Backend returns { success, data, reports } - extract the array
        const reportsArray = Array.isArray(data?.data) ? data.data : Array.isArray(data?.reports) ? data.reports : Array.isArray(data) ? data : [];
        setReports(reportsArray as Facility[]);
      } catch (error) {
        toast.error("Failed to fetch facility reports. Please try again.");
        console.error('Error fetching facility reports:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFacilityReports();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter, severityFilter]);

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesSearch = 
        searchQuery === "" ||
        report.TITLE.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.LOCATION.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "ALL" || report.STATUS === statusFilter;
      const matchesSeverity = severityFilter === "ALL" || report.SEVERITY_LEVEL === severityFilter;

      return matchesSearch && matchesStatus && matchesSeverity;
    });
  }, [reports, searchQuery, statusFilter, severityFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredReports.length / ITEMS_PER_PAGE));

  useEffect(() => {
    setPage((prev) => Math.min(Math.max(prev, 1), totalPages));
  }, [totalPages]);

  const paginatedReports = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredReports.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredReports, page, ITEMS_PER_PAGE]);

   if (loading) {
    return (
      <>
        <div className="space-y-4">
          <Skeleton className="h-12 w-1/3 rounded-md" />
          <Skeleton className="h-8 w-1/2 rounded-md" />
          <Skeleton className="h-32 w-full rounded-md" />
          <Skeleton className="h-[400px] w-full rounded-md" />
        </div>
      </>
    );
  }

  generateMetadata({
    title: "All Facility Reports - Cybercrime Reporting Platform",
    description: "Browse all facility reports submitted across campus on the Cybercrime Reporting Platform.",
    canonical: "/dashboard/facility/reports",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/facility">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Facility Reports</h1>
          <p className="text-muted-foreground">
            Browse all facility reports across campus.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or location..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ReportStatus | "ALL")}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="RESOLVED">Resolved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select value={severityFilter} onValueChange={(v) => setSeverityFilter(v as SeverityLevel | "ALL")}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Severity</SelectItem>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
            <SelectItem value="CRITICAL">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {paginatedReports.map((report) => (
          <ReportCard key={report.REPORT_ID} report={report} />
        ))}
      </div>

      {filteredReports.length > 0 && totalPages > 1 && (
        <PaginationControls 
          currentPage={page} 
          totalPages={totalPages} 
          onPageChange={(p) => setPage(p)} 
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={filteredReports.length}
        />
      )}

      {filteredReports.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No reports found matching your filters.
        </div>
      )}
    </div>
  );
}

