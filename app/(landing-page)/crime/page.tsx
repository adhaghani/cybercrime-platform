"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Calendar, AlertTriangle, Filter } from "lucide-react";
import Link from "next/link";
import { MOCK_REPORTS } from "@/lib/api/mock-data";
import { CrimeReport, ReportStatus, CrimeCategory } from "@/lib/types";
import { format } from "date-fns";

export default function PublicCrimeFeedPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CrimeCategory | "ALL">("ALL");

  // Filter only crime reports
  const crimeReports = MOCK_REPORTS.filter((r) => r.type === "CRIME") as CrimeReport[];

  const filteredReports = crimeReports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "ALL" || report.crimeCategory === categoryFilter;
    return matchesSearch && matchesCategory;
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
      case "SOCIAL MEDIA BULLY": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "ONLINE THREAT": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "ONLINE DEFAMATION": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "HARASSMENT": return "bg-pink-500/10 text-pink-500 border-pink-500/20";
      case "OTHER": return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Public Crime Feed</h1>
          <p className="text-muted-foreground">
            Stay informed about recent incidents reported by the community.
          </p>
        </div>
        <Button asChild>
          <Link href="/auth/login">Report an Incident</Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or location..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as CrimeCategory | "ALL")}>
          <SelectTrigger className="w-full md:w-[200px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Categories</SelectItem>
            <SelectItem value="SOCIAL MEDIA BULLY">Social Media Bully</SelectItem>
            <SelectItem value="ONLINE THREAT">Online Threat</SelectItem>
            <SelectItem value="ONLINE DEFAMATION">Online Defamation</SelectItem>
            <SelectItem value="HARASSMENT">Harassment</SelectItem>
            <SelectItem value="OTHER">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredReports.map((report) => (
          <Card key={report.id} className="flex flex-col hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start gap-2">
                <Badge className={getCategoryColor(report.crimeCategory)}>
                  {report.crimeCategory}
                </Badge>
                <Badge variant="outline" className={getStatusColor(report.status)}>
                  {report.status.replace("_", " ")}
                </Badge>
              </div>
              <CardTitle className="line-clamp-1 mt-2">{report.title}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                {format(new Date(report.submittedAt), "MMM d, yyyy")}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                {report.description}
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <MapPin className="h-4 w-4" />
                {report.location}
              </div>
              <Button variant="outline" className="w-full mt-auto" asChild>
                <Link href={`/crime/${report.id}`}>
                  View Details
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <AlertTriangle className="h-10 w-10 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium">No reports found</h3>
          <p>Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
