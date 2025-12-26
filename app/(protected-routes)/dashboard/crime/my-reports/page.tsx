"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Search, PlusCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Crime, ReportStatus } from "@/lib/types";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { useAuth } from "@/lib/context/auth-provider";
import ReportCard from "@/components/report/reportCard";

const ITEMS_PER_PAGE = 6;

export default function MyCrimeReportsPage() {
  const { claims } = useAuth();
  const [reports, setReports] = useState<Crime[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "ALL">("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchMyReports = async () => {
      try {
        const response = await fetch(`/api/reports/my-reports?type=CRIME`);
        if (!response.ok) throw new Error('Failed to fetch reports');
        const data = await response.json();
        setReports(data);
      } catch (error) {
        console.error('Error fetching my reports:', error);
      } finally {
        setLoading(false);
      }
    };
    if (claims?.ACCOUNT_ID) fetchMyReports();
  }, []);

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.TITLE.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.LOCATION.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || report.STATUS === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedReports = filteredReports.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = (callback: () => void) => {
    callback();
    setCurrentPage(1);
  };

  const statusCounts = {
    total: reports.length,
    pending: reports.filter(r => r.STATUS === "PENDING").length,
    inProgress: reports.filter(r => r.STATUS === "IN_PROGRESS").length,
    resolved: reports.filter(r => r.STATUS === "RESOLVED").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/crime">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">My Crime Reports</h1>
          <p className="text-muted-foreground">
            Track the status of your submitted reports.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Reports</CardDescription>
            <CardTitle className="text-3xl">{statusCounts.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-3xl text-yellow-500">{statusCounts.pending}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>In Progress</CardDescription>
            <CardTitle className="text-3xl text-blue-500">{statusCounts.inProgress}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Resolved</CardDescription>
            <CardTitle className="text-3xl text-green-500">{statusCounts.resolved}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or location..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => handleFilterChange(() => setSearchQuery(e.target.value))}
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => handleFilterChange(() => setStatusFilter(v as ReportStatus | "ALL"))}>
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
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {paginatedReports.map((report) => (
          <ReportCard key={report.REPORT_ID} report={report} />
        ))}
      </div>

      {totalPages > 1 && filteredReports.length > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={filteredReports.length}
        />
      )}

      {filteredReports.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                {reports.length === 0
                  ? "You haven't submitted any crime reports yet."
                  : "No reports found matching your filters."}
              </p>
              {reports.length === 0 && (
                <Button asChild>
                  <Link href="/dashboard/crime/submit-report">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Submit Your First Report
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
