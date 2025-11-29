"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Search, MapPin, Calendar, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { MOCK_REPORTS } from "@/lib/api/mock-data";
import { CrimeReport, ReportStatus, CrimeCategory } from "@/lib/types";
import { format } from "date-fns";

export default function AllCrimeReportsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "ALL">("ALL");
  const [categoryFilter, setCategoryFilter] = useState<CrimeCategory | "ALL">("ALL");

  const crimeReports = MOCK_REPORTS.filter((r) => r.type === "CRIME") as CrimeReport[];

  const filteredReports = crimeReports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || report.status === statusFilter;
    const matchesCategory = categoryFilter === "ALL" || report.crimeCategory === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case "PENDING": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "IN_PROGRESS": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "RESOLVED": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "REJECTED": return "bg-red-500/10 text-red-500 border-red-500/20";
    }
  };

  const getCategoryColor = (category: CrimeCategory) => {
    switch (category) {
      case "THEFT": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "ASSAULT": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "VANDALISM": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "HARASSMENT": return "bg-pink-500/10 text-pink-500 border-pink-500/20";
      case "OTHER": return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <div className="space-y-6 p-6">
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
      </div>

      <div className="grid gap-4">
        {filteredReports.map((report) => (
          <Card key={report.id} className="hover:bg-accent/50 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-xl">{report.title}</CardTitle>
                  <CardDescription className="mt-2 flex flex-wrap items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {report.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(report.submittedAt), "MMM d, yyyy")}
                    </span>
                  </CardDescription>
                </div>
                <div className="flex flex-col gap-2">
                  <Badge className={getStatusColor(report.status)}>
                    {report.status.replace("_", " ")}
                  </Badge>
                  <Badge className={getCategoryColor(report.crimeCategory)}>
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {report.crimeCategory}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {report.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Category: {report.crimeCategory}
                </span>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/crime/reports/${report.id}`}>
                    View Details
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No reports found matching your filters.
        </div>
      )}
    </div>
  );
}
