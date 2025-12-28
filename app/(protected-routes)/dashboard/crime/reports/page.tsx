"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Search, MapPin, LayoutGrid, Table2, Loader2 } from "lucide-react";
import Link from "next/link";
import { Crime, ReportStatus, CrimeCategory } from "@/lib/types";
import { format } from "date-fns";
import CrimeCategoryBadge from "@/components/ui/crimeCategoryBadge";
import StatusBadge from "@/components/ui/statusBadge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import ReportCard from "@/components/report/reportCard";
import { generateMetadata } from "@/lib/seo";

export default function AllCrimeReportsPage() {
  const ITEMS_PER_PAGE = 6;

  const [reports, setReports] = useState<Crime[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "ALL">("ALL");
  const [categoryFilter, setCategoryFilter] = useState<CrimeCategory | "ALL">("ALL");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [page, setPage] = useState(1);

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
        setReports(data as Crime[]);
      } catch (error) {
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

  const totalPages = Math.max(1, Math.ceil(reports.length / ITEMS_PER_PAGE));

  useEffect(() => {
    setPage((prev) => Math.min(Math.max(prev, 1), totalPages));
  }, [totalPages]);

  const paginatedReports = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return reports.slice(start, start + ITEMS_PER_PAGE);
  }, [reports, page]);

  const pageItems = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const items: Array<number | "ellipsis"> = [1];
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    if (start > 2) items.push("ellipsis");
    for (let p = start; p <= end; p += 1) items.push(p);
    if (end < totalPages - 1) items.push("ellipsis");
    items.push(totalPages);
    return items;
  }, [page, totalPages]);

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
            size="sm"
            onClick={() => setViewMode("card")}
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Cards
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
          >
            <Table2 className="h-4 w-4 mr-2" />
            Table
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
          <Table>
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
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/crime/reports/${report.REPORT_ID}`}>
                          View
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
      )}

      {reports.length > 0 && totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.max(1, p - 1));
                }}
              />
            </PaginationItem>

            {pageItems.map((item, idx) => (
              <PaginationItem key={`${item}-${idx}`}>
                {item === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href="#"
                    isActive={item === page}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(item);
                    }}
                  >
                    {item}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.min(totalPages, p + 1));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {reports.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No reports found matching your filters.
        </div>
      )}
    </div>
  );
}
