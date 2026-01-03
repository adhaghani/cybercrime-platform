"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Search, MapPin, LayoutGrid, Table2, Eye } from "lucide-react";
import Link from "next/link";
import { Crime, ReportStatus, CrimeCategory } from "@/lib/types";
import { format } from "date-fns";
import CrimeCategoryBadge from "@/components/ui/crimeCategoryBadge";
import StatusBadge from "@/components/ui/statusBadge";
import { PaginationControls } from "@/components/ui/pagination-controls";
import ReportCard from "@/components/report/reportCard";
import { generateMetadata } from "@/lib/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

export default function AllCrimeReportsPage() {


  const [reports, setReports] = useState<Crime[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "ALL">("ALL");
  const [categoryFilter, setCategoryFilter] = useState<CrimeCategory | "ALL">("ALL");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [page, setPage] = useState(1);

  const ITEMS_PER_PAGE = viewMode === "card" ? 6 : 10;

  generateMetadata({
    title: "All Crime Reports - Cybercrime Reporting Platform",
    description: "Browse all crime reports submitted across campus on the Cybercrime Reporting Platform.",
    canonical: "/dashboard/crime/reports",
  });

  useEffect(() => {
    const fetchCrimeReports = async () => {
      try {
        const response = await fetch('/api/reports/with-details?type=CRIME');
        if (!response.ok) throw new Error('Failed to fetch reports');
        const data = await response.json();
        // Backend returns { success, data, reports } - extract the array
        const reportsArray = Array.isArray(data?.data) ? data.data : Array.isArray(data?.reports) ? data.reports : Array.isArray(data) ? data : [];
        setReports(reportsArray as Crime[]);
      } catch (error) {
        toast.error("Failed to fetch crime reports. Please try again.");
        console.error('Error fetching crime reports:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCrimeReports();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter, categoryFilter]);

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesSearch = 
        searchQuery === "" ||
        report.TITLE.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.LOCATION.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "ALL" || report.STATUS === statusFilter;
      const matchesCategory = categoryFilter === "ALL" || report.CRIME_CATEGORY === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [reports, searchQuery, statusFilter, categoryFilter]);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/crime">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Crime Reports</h1>
          <p className="text-muted-foreground">
            Browse all crime reports across campus.
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
        <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as CrimeCategory | "ALL")}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Categories</SelectItem>
            <SelectItem value="THEFT">Theft</SelectItem>
            <SelectItem value="ASSAULT">Assault</SelectItem>
            <SelectItem value="VANDALISM">Vandalism</SelectItem>
            <SelectItem value="HARASSMENT">Harassment</SelectItem>
            <SelectItem value="OTHER">Other</SelectItem>
          </SelectContent>
        </Select>
                        <div className="flex gap-2">
          <Button
            variant={viewMode === "card" ? "default" : "outline"}
            size="icon-sm"
            onClick={() => setViewMode("card")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="icon-sm"
            onClick={() => setViewMode("table")}
          >
            <Table2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {viewMode === "card" ? (
        <div className="grid gap-4 md:grid-cols-2">
          {paginatedReports.map((report) => (
            <ReportCard key={report.REPORT_ID} report={report} />
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Crime Reports ({filteredReports.length})</CardTitle>
          </CardHeader>
          <CardContent>
          <Table className="border">
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedReports.map((report) => (
                <TableRow key={report.REPORT_ID} className="hover:bg-accent/50">
                  <TableCell className="font-medium">{report.TITLE}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3" />
                      {report.LOCATION}
                    </span>
                  </TableCell>
                  <TableCell>
                    <CrimeCategoryBadge category={report.CRIME_CATEGORY} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={report.STATUS} />
                  </TableCell>
                  <TableCell className="text-sm">
                    {format(new Date(report.SUBMITTED_AT), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon-sm" asChild>
                            <Link href={`/dashboard/crime/reports/${report.REPORT_ID}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>View Report</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </CardContent>
          </Card>
      )}

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
