"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Wrench, 
  Search, 
  Filter,
  Eye,
  UserPlus,
  Calendar,
  MapPin,
  ArrowLeft,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { MOCK_REPORTS } from "@/lib/api/mock-data";
import { Facility } from "@/lib/types";
import { format } from "date-fns";
import FacilitySeverityBadge from "@/components/ui/facilitySeverityBadge";
import StatusBadge from "@/components/ui/statusBadge";
import { PaginationControls } from "@/components/ui/pagination-controls";

const ITEMS_PER_PAGE = 10;

export default function FacilityReportsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter only facility reports
  const facilityReports = MOCK_REPORTS.filter((r) => r.type === "FACILITY") as Facility[];

  const filteredReports = facilityReports.filter((report) => {
    const matchesSearch = 
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || report.status === statusFilter;
    const matchesType = typeFilter === "ALL" || report.facilityType === typeFilter;
    const matchesSeverity = severityFilter === "ALL" || report.severityLevel === severityFilter;

    return matchesSearch && matchesStatus && matchesType && matchesSeverity;
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

  const stats = {
    total: facilityReports.length,
    pending: facilityReports.filter(r => r.status === "PENDING").length,
    inProgress: facilityReports.filter(r => r.status === "IN_PROGRESS").length,
    resolved: facilityReports.filter(r => r.status === "RESOLVED").length,
    critical: facilityReports.filter(r => r.severityLevel === "CRITICAL").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/reports">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Reports
          </Link>
        </Button>
      </div>

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

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Facility Reports</CardTitle>
          <CardDescription>Search and filter facility reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by title, description, or location..."
                    value={searchQuery}
                    onChange={(e) => handleFilterChange(() => setSearchQuery(e.target.value))}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={(v) => handleFilterChange(() => setStatusFilter(v))}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
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
            <div className="flex flex-col md:flex-row gap-4">
              <Select value={typeFilter} onValueChange={(v) => handleFilterChange(() => setTypeFilter(v))}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Facility Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  <SelectItem value="ELECTRICAL">Electrical</SelectItem>
                  <SelectItem value="PLUMBING">Plumbing</SelectItem>
                  <SelectItem value="FURNITURE">Furniture</SelectItem>
                  <SelectItem value="INFRASTRUCTURE">Infrastructure</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
              <Select value={severityFilter} onValueChange={(v) => handleFilterChange(() => setSeverityFilter(v))}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
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
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Facility Reports ({filteredReports.length})</CardTitle>
          <CardDescription>
            {filteredReports.length === facilityReports.length 
              ? "Showing all facility reports"
              : `Showing ${filteredReports.length} of ${facilityReports.length} facility reports`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredReports.length > 0 ? (
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedReports.map((report) => (
                    <TableRow key={report.reportId}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{report.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {report.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {report.facilityType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <FacilitySeverityBadge severityLevel={report.severityLevel} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3" />
                          {report.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(report.submittedAt), "MMM d, yyyy")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={report.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/dashboard/reports/${report.reportId}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          {report.status !== "RESOLVED" && (
                            <Button asChild variant="ghost" size="sm">
                              <Link href={`/dashboard/reports/${report.reportId}?action=assign`}>
                                <UserPlus className="h-4 w-4" />
                              </Link>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {totalPages > 1 && paginatedReports.length > 0 ? (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={ITEMS_PER_PAGE}
                totalItems={filteredReports.length}
              />): (            <div className="text-center py-12 text-muted-foreground">
              <Wrench className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No facility reports found matching your filters.</p>
              <p className="text-sm mt-2">Try adjusting your search criteria.</p>
            </div>)}
            </div>

        ): (
          <>No Data</>)
        }
        
        </CardContent>
      </Card>
    </div>
  );
}