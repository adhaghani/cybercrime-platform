"use client";

import { use } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MapPin, Calendar, Clock, AlertCircle, Wrench, FileText } from "lucide-react";
import Link from "next/link";
import { MOCK_REPORTS } from "@/lib/api/mock-data";
import { FacilityReport, ReportStatus, SeverityLevel } from "@/lib/types";
import { format } from "date-fns";

export default function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const report = MOCK_REPORTS.find((r) => r.id === id && r.type === "FACILITY") as FacilityReport | undefined;

  if (!report) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/facility/reports">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Report Not Found</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">The report you're looking for doesn't exist.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case "PENDING": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "IN_PROGRESS": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "RESOLVED": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "REJECTED": return "bg-red-500/10 text-red-500 border-red-500/20";
    }
  };

  const getSeverityColor = (severity: SeverityLevel) => {
    switch (severity) {
      case "LOW": return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      case "MEDIUM": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "HIGH": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "CRITICAL": return "bg-red-500/10 text-red-500 border-red-500/20";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/facility/reports">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{report.title}</h1>
          <p className="text-muted-foreground">Report ID: {report.id}</p>
        </div>
        <div className="flex gap-2">
          <Badge className={getStatusColor(report.status)}>
            {report.status.replace("_", " ")}
          </Badge>
          <Badge className={getSeverityColor(report.severityLevel)}>
            <AlertCircle className="h-3 w-3 mr-1" />
            {report.severityLevel}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Report Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{report.description}</p>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{report.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Wrench className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Facility Type</p>
                  <p className="text-sm text-muted-foreground">{report.facilityType}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Submitted</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(report.submittedAt), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(report.updatedAt), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              </div>
            </div>

            {report.affectedEquipment && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Affected Equipment</h3>
                  <p className="text-muted-foreground">{report.affectedEquipment}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Current Status</p>
                <Badge className={getStatusColor(report.status)}>
                  {report.status.replace("_", " ")}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Severity Level</p>
                <Badge className={getSeverityColor(report.severityLevel)}>
                  {report.severityLevel}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/facility/reports">Back to Reports</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
