"use client";

import { use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MapPin, Calendar, Clock, Wrench, FileText, Loader2 } from "lucide-react";
import Link from "next/link";
import { Facility } from "@/lib/types";
import { format } from "date-fns";
import FacilitySeverityBadge from "@/components/ui/facilitySeverityBadge";
import StatusBadge from "@/components/ui/statusBadge";
import { useState, useEffect } from "react";
export default function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [report, setReport] = useState<Facility | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchReport = async () => {
    try {
      const response = await fetch(`/api/reports/${id}`);
      if (!response.ok) throw new Error('Not found');
      const data = await response.json();
      
      console.log('Fetched report data:', data); // Debug log
      
      if (data.TYPE === 'FACILITY' || data.type === 'FACILITY') {
        // Transform Oracle column names to camelCase
        const transformedReport: Facility = {
          REPORT_ID: data.REPORT_ID || data.reportId,
          TITLE: data.TITLE || data.title,
          DESCRIPTION: data.DESCRIPTION || data.description,
          LOCATION: data.LOCATION || data.location,
          STATUS: data.STATUS || data.status,
          TYPE: 'FACILITY',
          SUBMITTED_BY: data.SUBMITTED_BY || data.submittedBy,
          SUBMITTED_AT: data.SUBMITTED_AT || data.submittedAt,
          UPDATED_AT: data.UPDATED_AT || data.updatedAt,
          FACILITY_TYPE: data.FACILITY_TYPE || data.facilityType,
          SEVERITY_LEVEL: data.SEVERITY_LEVEL || data.severityLevel,
          AFFECTED_EQUIPMENT: data.AFFECTED_EQUIPMENT || data.affectedEquipment,
        };
        
        console.log('Transformed report:', transformedReport); // Debug log
        setReport(transformedReport);
      } else {
        throw new Error('Report is not a facility report');
      }
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };
  fetchReport();
}, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

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
            <p className="text-muted-foreground">The report you&apos;re looking for doesn&apos;t exist.</p>
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/facility/reports">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{report.TITLE}</h1>
          <p className="text-muted-foreground">Report ID: {report.REPORT_ID}</p>
        </div>
        <div className="flex gap-2">
          <StatusBadge status={report.STATUS} />
          <FacilitySeverityBadge severityLevel={report.SEVERITY_LEVEL} />
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
              <p className="text-muted-foreground">{report.DESCRIPTION}</p>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{report.LOCATION}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Wrench className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Facility Type</p>
                  <p className="text-sm text-muted-foreground">{report.FACILITY_TYPE}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Submitted</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(report.SUBMITTED_AT), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(report.UPDATED_AT), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              </div>
            </div>

            {report.AFFECTED_EQUIPMENT && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Affected Equipment</h3>
                  <p className="text-muted-foreground">{report.AFFECTED_EQUIPMENT}</p>
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
                <StatusBadge status={report.STATUS} />
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Severity Level</p>
               <FacilitySeverityBadge severityLevel={report.SEVERITY_LEVEL} />
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
            <CardContent className="flex items-center gap-2 flex-col">
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
