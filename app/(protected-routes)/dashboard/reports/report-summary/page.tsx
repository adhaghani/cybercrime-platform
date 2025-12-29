"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCategoryColor, getGeneratedReportTypeColor } from "@/lib/utils/badge-helpers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Download, Eye, Calendar, Filter } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { GeneratedReport, GeneratedReportCategory, GeneratedReportDataType } from "@/lib/types";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { generateMetadata } from "@/lib/seo";
import { Skeleton } from "@/components/ui/skeleton";
const ITEMS_PER_PAGE = 10;

export default function AllGeneratedReportsPage() {
  const [reports, setReports] = useState<GeneratedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<GeneratedReportCategory | "ALL">("ALL");
  const [typeFilter, setTypeFilter] = useState<GeneratedReportDataType | "ALL">("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchGeneratedReports = async () => {
      try {
        const response = await fetch('/api/generated-reports');
        if (!response.ok) throw new Error('Failed to fetch generated reports');
        const data = await response.json();
        setReports(data);
      } catch (error) {
        console.error('Error fetching generated reports:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGeneratedReports();
  }, []);

  // Filter reports
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.TITLE.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.SUMMARY.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "ALL" || report.REPORT_CATEGORY === categoryFilter;
    const matchesType =
      typeFilter === "ALL" || report.REPORT_DATA_TYPE === typeFilter;
    return matchesSearch && matchesCategory && matchesType;
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

  const handleDownload = (report: GeneratedReport) => {
    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${report.GENERATE_ID}-${report.TITLE.replace(/\s+/g, "-").toLowerCase()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const stats = {
    total: reports.length,
    crime: reports.filter((r) => r.REPORT_CATEGORY === "CRIME").length,
    facility: reports.filter((r) => r.REPORT_CATEGORY === "FACILITY").length,
    all: reports.filter((r) => r.REPORT_CATEGORY === "ALL REPORTS").length,
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
          <Skeleton className="h-32 w-full rounded-md" />
          <Skeleton className="h-[400px] w-full rounded-md" />
        </div>
      </>
    );
  }

  generateMetadata({
    title: "AI-Generated Reports - Cybercrime Reporting Platform",
    description: "View and download all AI-generated analytical reports on the Cybercrime Reporting Platform.",
    canonical: "/dashboard/reports/report-summary",
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="h-8 w-8" />
          AI-Generated Reports
        </h1>
        <p className="text-muted-foreground">
          View and download all AI-generated analytical reports
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All generated reports</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crime Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.crime}</div>
            <p className="text-xs text-muted-foreground">Crime analysis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Facility Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{stats.facility}</div>
            <p className="text-xs text-muted-foreground">Facility analysis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overview Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">{stats.all}</div>
            <p className="text-xs text-muted-foreground">Comprehensive reports</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Reports</CardTitle>
          <CardDescription>Search and filter AI-generated reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title or summary..."
                  value={searchQuery}
                  onChange={(e) => handleFilterChange(() => setSearchQuery(e.target.value))}
                  className="pl-8"
                />
              </div>
            </div>
            <Select
              value={categoryFilter}
              onValueChange={(value) =>
                handleFilterChange(() =>
                  setCategoryFilter(value as GeneratedReportCategory | "ALL")
                )
              }
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Categories</SelectItem>
                <SelectItem value="CRIME">Crime</SelectItem>
                <SelectItem value="FACILITY">Facility</SelectItem>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="ALL REPORTS">All Reports</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={typeFilter}
              onValueChange={(value) =>
                handleFilterChange(() =>
                  setTypeFilter(value as GeneratedReportDataType | "ALL")
                )
              }
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="SUMMARY">Summary</SelectItem>
                <SelectItem value="DETAILED">Detailed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Reports ({filteredReports.length})</CardTitle>
          <CardDescription className="flex justify-between gap-2 items-center f">
            {filteredReports.length === reports.length
              ? "Showing all AI-generated reports"
              : `Showing ${filteredReports.length} of ${reports.length} reports`}
              {totalPages > 1 && (
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  itemsPerPage={ITEMS_PER_PAGE}
                  totalItems={filteredReports.length}
                />
              )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {paginatedReports.length > 0 ? (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date Range</TableHead>
                      
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedReports.map((report) => (
                      <TableRow key={report.GENERATE_ID}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{report.TITLE}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getCategoryColor(report.REPORT_CATEGORY)}>
                            {report.REPORT_CATEGORY}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getGeneratedReportTypeColor(report.REPORT_DATA_TYPE)}>
                            {report.REPORT_DATA_TYPE}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {format(new Date(report.DATE_RANGE_START), "MMM d")} -{" "}
                              {format(new Date(report.DATE_RANGE_END), "MMM d, yyyy")}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                            <Button variant="outline" size="icon-sm" asChild>
                              <Link href={`/dashboard/reports/report-summary/${report.GENERATE_ID}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              View Report Summary
                            </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon-sm"
                              onClick={() => handleDownload(report)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Download Report JSON
                            </TooltipContent>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No generated reports found matching your filters.</p>
              <p className="text-sm mt-2">Try adjusting your search criteria.</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/dashboard/reports/report-summary/generate">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate New Report
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}