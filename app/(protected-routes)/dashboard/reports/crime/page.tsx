"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  ShieldAlert, 
  Search, 
  Filter,
  Eye,
  UserPlus,
  Calendar,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Crime } from "@/lib/types";
import { format } from "date-fns";
import StatusBadge from "@/components/ui/statusBadge";
import CrimeCategoryBadge from "@/components/ui/crimeCategoryBadge";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { useHasAnyRole } from "@/hooks/use-user-role";
import { Loader2 } from "lucide-react";
import { generateMetadata } from "@/lib/seo";

const ITEMS_PER_PAGE = 10;

export default function CrimeReportsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [crimeReports, setCrimeReports] = useState<Crime[]>([]);
  const [loading, setLoading] = useState(true);
  const isSupervisorOrAdmin = useHasAnyRole()(["SUPERVISOR", "ADMIN", "SUPERADMIN"]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/reports/with-details?type=CRIME');
      if (response.ok) {
        const data = await response.json();
        setCrimeReports(data || []);
      }
    } catch (error) {
      console.error('Failed to fetch crime reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = crimeReports.filter((report) => {
    const matchesSearch = 
      report.TITLE.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.DESCRIPTION.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.LOCATION.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || report.STATUS === statusFilter;
    const matchesCategory = categoryFilter === "ALL" || report.CRIME_CATEGORY === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
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
    total: crimeReports.length,
    pending: crimeReports.filter(r => r.STATUS === "PENDING").length,
    inProgress: crimeReports.filter(r => r.STATUS === "IN_PROGRESS").length,
    resolved: crimeReports.filter(r => r.STATUS === "RESOLVED").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
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

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Crime Reports</CardTitle>
          <CardDescription>Search and filter crime reports</CardDescription>
        </CardHeader>
        <CardContent>
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
            <Select value={categoryFilter} onValueChange={(v) => handleFilterChange(() => setCategoryFilter(v))}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
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
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Crime Reports ({filteredReports.length})</CardTitle>
          <CardDescription className="flex  items-center justify-between gap-2 flex-wrap">
            {filteredReports.length === crimeReports.length 
              ? "Showing all crime reports"
              : `Showing ${filteredReports.length} of ${crimeReports.length} crime reports`
            }
            {totalPages > 1 && paginatedReports.length > 0 && (
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
        <CardContent>
          {filteredReports.length > 0 ? (
            <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedReports.map((report) => (
                    <TableRow key={report.REPORT_ID}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{report.TITLE}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <CrimeCategoryBadge category={report.CRIME_CATEGORY} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3" />
                          {report.LOCATION}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(report.SUBMITTED_AT), "MMM d, yyyy")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={report.STATUS} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/dashboard/reports/${report.REPORT_ID}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          {isSupervisorOrAdmin && (report.STATUS !== "RESOLVED" && report.STATUS !== "REJECTED") && (
                            <Button asChild variant="ghost" size="sm">
                              <Link href={`/dashboard/reports/${report.REPORT_ID}?action=assign`}>
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
                         
            </div>

            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <ShieldAlert className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No crime reports found matching your filters.</p>
              <p className="text-sm mt-2">Try adjusting your search criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}