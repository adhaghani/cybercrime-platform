/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { generateMetadata } from "@/lib/seo";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { 
  FileText,
  Calendar,
  MapPin,
  User,
  Clock,
  ShieldAlert,
  Wrench,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { Crime, Facility, ReportWithAssignedStaffDetails } from "@/lib/types";
import { format } from "date-fns";
import StatusBadge from "@/components/ui/statusBadge";
import { notFound } from "next/navigation";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export default function ReportDetailsPage({ params }: { params: { id: string } }) {
  const [report, setReport] = useState<ReportWithAssignedStaffDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    try {
      const response = await fetch(`/api/reports/${params.id}`);
      if (!response.ok) {
        if (response.status === 404) {
          setReport(null);
          setLoading(false);
          return;
        }
        throw new Error('Failed to fetch report');
      }
      const data = await response.json();
      setReport(data);
    } catch (error) {
      console.error('Failed to fetch report:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchReport();
  }, [params.id]);

  const isReportResolved = report?.STATUS === "RESOLVED";
  const isReportRejected = report?.STATUS === "REJECTED";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!report) {
    notFound();
  }

  const isCrimeReport = report.TYPE === "CRIME";
  const crimeData = isCrimeReport ? (report as Crime) : null;
  const facilityData = !isCrimeReport ? (report as Facility) : null;

  generateMetadata({
    title: `Report Details - ${report.TITLE} - Cybercrime Reporting Platform`,
    description: `Detailed view of the report titled "${report.TITLE}" on the Cybercrime Reporting Platform.`,
    canonical: `/dashboard/facility/reports/${params.id}`,
  });

  return (
    <div className="space-y-6 mx-auto w-full max-w-7xl">

      {/* Report Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          {isCrimeReport ? (
            <ShieldAlert className="h-10 w-10 text-red-500" />
          ) : (
            <Wrench className="h-10 w-10 text-orange-500" />
          )}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{report.TITLE}</h1>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge status={report.STATUS} />
              <Badge variant="outline">
                {report.TYPE}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {
        report.RESOLUTIONS && (
      <div className="grid w-full items-start gap-4">
      <Alert className={isReportResolved ? "bg-green-500/10 border-green-500/20 text-green-500" : isReportRejected ? "bg-red-500/10 border-red-500/20 text-red-500" : ""}>
        <AlertTitle>This report has been {report.STATUS.toLowerCase()}</AlertTitle>
        <AlertDescription>
          This report was {report.STATUS.toLowerCase()} on {format(new Date(report.RESOLUTIONS.RESOLVED_AT), "PPP 'at' p")} with the following summary:
          <p className="mt-2 font-medium">{report.RESOLUTIONS.RESOLUTION_SUMMARY}</p>
        </AlertDescription>
      </Alert>

    </div>
        )
      }

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Details */}
          <Card>
            <CardHeader>
              <CardTitle>Report Details</CardTitle>
              <CardDescription>Detailed information about the report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Description</Label>
                <p className="mt-1">{report.DESCRIPTION}</p>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </Label>
                  <p className="mt-1 font-medium">{report.LOCATION}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Submitted At
                  </Label>
                  <p className="mt-1 font-medium">
                    {format(new Date(report.SUBMITTED_AT), "PPP 'at' p")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          {
            report.ATTACHMENT_PATH ? (
              <Card>
                <CardHeader>
                  <CardTitle>Report Image Evidence</CardTitle>
                </CardHeader>
                <CardContent>
              <Carousel className="w-4/5 mx-auto">
                <CarouselContent>
                  {
                    report.ATTACHMENT_PATH.map((path, index) => (
                      <CarouselItem className="basis-1 md:basis-1/2" key={index}>
                        <div className="w-full aspect-4/3 relative rounded-lg overflow-hidden">
                          <Image
                            src={path}
                            alt={`Attachment ${index + 1}`}
                            fill
                            className="aspect-4/3"
                          />
                        </div>
                      </CarouselItem>
                    ))
                  }
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
              </CardContent>
              </Card>
            ) : null
          }
          {/* Crime/Facility Specific Details */}
          {isCrimeReport && crimeData && (
            <Card>
              <CardHeader>
                <CardTitle>Crime Details</CardTitle>
                <CardDescription>Additional crime-specific information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-muted-foreground">Crime Category</Label>
                    <p className="mt-1 font-medium">{crimeData.CRIME_CATEGORY}</p>
                  </div>
                  {crimeData.INJURY_LEVEL && (
                    <div>
                      <Label className="text-muted-foreground">Injury Level</Label>
                      <p className="mt-1 font-medium">{crimeData.INJURY_LEVEL}</p>
                    </div>
                  )}
                </div>
                {crimeData.SUSPECT_DESCRIPTION && (
                  <div>
                    <Label className="text-muted-foreground">Suspect Description</Label>
                    <p className="mt-1">{crimeData.SUSPECT_DESCRIPTION}</p>
                  </div>
                )}
                {crimeData.VICTIM_INVOLVED && (
                  <div>
                    <Label className="text-muted-foreground">Victim Information</Label>
                    <p className="mt-1">{crimeData.VICTIM_INVOLVED}</p>
                  </div>
                )}
                {crimeData.WEAPON_INVOLVED && (
                  <div>
                    <Label className="text-muted-foreground">Weapon Involved</Label>
                    <p className="mt-1">{crimeData.WEAPON_INVOLVED}</p>
                  </div>
                )}
                {crimeData.EVIDENCE_DETAILS && (
                  <div>
                    <Label className="text-muted-foreground">Evidence Details</Label>
                    <p className="mt-1">{crimeData.EVIDENCE_DETAILS}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {!isCrimeReport && facilityData && (
            <Card>
              <CardHeader>
                <CardTitle>Facility Details</CardTitle>
                <CardDescription>Additional facility-specific information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-muted-foreground">Facility Type</Label>
                    <p className="mt-1 font-medium">{facilityData.FACILITY_TYPE}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Severity Level</Label>
                    <Badge variant={
                      facilityData.SEVERITY_LEVEL === "CRITICAL" ? "destructive" : 
                      facilityData.SEVERITY_LEVEL === "HIGH" ? "default" : "outline"
                    }>
                      {facilityData.SEVERITY_LEVEL}
                    </Badge>
                  </div>
                </div>
                {facilityData.AFFECTED_EQUIPMENT && (
                  <div>
                    <Label className="text-muted-foreground">Affected Equipment</Label>
                    <p className="mt-1">{facilityData.AFFECTED_EQUIPMENT}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Report Assignment Feedback and action Taken */}
          <Card>
            <CardHeader>
              <CardTitle>Assignments and Feedback</CardTitle>
              <CardDescription>Staff assignments and their feedback</CardDescription>
            </CardHeader>
            <CardContent className="space-y-0">
              {
                report.STAFF_ASSIGNED && report.STAFF_ASSIGNED.length > 0 ? report.STAFF_ASSIGNED.map((assignment) => (
                  <div key={assignment.ASSIGNMENT_ID} className="space-y-0 p-4 rounded-lg border border-dashed mb-2">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      <span className="font-medium text-primary">{assignment.NAME}</span>
                      <span className="text-sm text-muted-foreground">
                        (Assigned on {format(new Date(assignment.ASSIGNED_AT), "PPP")})
                      </span>
    
                    </div>
                    {
                        assignment.UPDATED_AT && assignment.ACTION_TAKEN && (
                          <span className="text-sm text-muted-foreground block mb-4">
                            - Updated on {format(new Date(assignment.UPDATED_AT), "PPP")}
                          </span>
                        )
                      }
                    <div>
                      <Label className="text-muted-foreground">Action Taken</Label>
                      <p className="mt-1">{assignment.ACTION_TAKEN || "No action taken yet."}</p>
                    </div>
                    {assignment.ADDITIONAL_FEEDBACK && (
                      <div>
                        <Label className="text-muted-foreground">Additional Feedback</Label>
                        <p className="mt-1">{assignment.ADDITIONAL_FEEDBACK}</p>
                      </div>
                    )}

                  </div>
                )) : isReportRejected ? <p className="text-sm text-muted-foreground">This report was rejected and no staff were assigned.</p> :  <p className="text-sm text-muted-foreground">No staff have been assigned to this report yet.</p>
              }
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Report Info */}
          <Card>
            <CardHeader>
              <CardTitle>Report Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-muted-foreground flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Submitted By
                </Label>
                <p className="mt-1 font-medium">Student Name</p>
                <p className="text-sm text-muted-foreground">ID: {report.SUBMITTED_BY}</p>
              </div>
              <Separator />
              <div>
                <Label className="text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Last Updated
                </Label>
                <p className="mt-1 font-medium">
                  {format(new Date(report.UPDATED_AT), "PPP")}
                </p>
              </div>
              <Separator />
              <div>
                <Label className="text-muted-foreground">Report ID</Label>
                <p className="mt-1 font-mono text-sm">{report.REPORT_ID}</p>
              </div>
            </CardContent>
          </Card>

          {/* Assignments */}
          <Card>
            <CardHeader>
              <CardTitle>Assignments</CardTitle>
              <CardDescription>Staff assigned to this report</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {report.STAFF_ASSIGNED && report.STAFF_ASSIGNED.length > 0 ?
                  report.STAFF_ASSIGNED.map((assignment) => (
                <div key={assignment.ASSIGNMENT_ID} className="flex items-center gap-2 p-2 rounded-lg bg-accent/50">
                  <User className="h-4 w-4 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{assignment.NAME}</p>
                    <p className="text-xs text-muted-foreground">
                      Assigned on {format(new Date(assignment.ASSIGNED_AT), "PPP")}
                    </p>
                  </div>
                </div>
                ))
                : isReportRejected ? <div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-red-500/10">
                  <ShieldAlert className="h-4 w-4 text-red-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">This report was rejected</p>
                    <p className="text-xs text-muted-foreground">No staff were assigned</p>
                  </div>
                </div>
                </div> : <div className="flex items-center gap-2 p-2 rounded-lg bg-accent/50">
                  <User className="h-4 w-4" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">No staff were assigned yet</p>
                  </div>
                </div>}
              </div>
            </CardContent>
          </Card>

          {/* Action History */}
          <Card>
            <CardHeader>
              <CardTitle>Action History</CardTitle>
              <CardDescription>Timeline of actions taken</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full flex items-center justify-center">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="w-px h-full bg-border mt-2" />
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="font-medium text-sm">Report Submitted</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(report.SUBMITTED_AT), "PPP 'at' p")}
                    </p>
                  </div>
                </div>
              
              {/* Combine all events and sort chronologically */}
              {report.STAFF_ASSIGNED && report.STAFF_ASSIGNED.length > 0 && (() => {
                const events: Array<{
                  type: 'assignment' | 'update';
                  timestamp: string;
                  assignment: typeof report.STAFF_ASSIGNED[0];
                }> = [];

                // Add assignment events
                report.STAFF_ASSIGNED.forEach(assignment => {
                  events.push({
                    type: 'assignment',
                    timestamp: assignment.ASSIGNED_AT,
                    assignment
                  });

                  // Add update event if action was taken
                  if (assignment.ACTION_TAKEN) {
                    events.push({
                      type: 'update',
                      timestamp: assignment.UPDATED_AT,
                      assignment
                    });
                  }
                });

                // Sort by timestamp
                events.sort((a, b) => 
                  new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                );

                return events.map((event, index) => (
                  <div key={`${event.assignment.ASSIGNMENT_ID}-${event.type}-${index}`} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 aspect-square rounded-full flex items-center justify-center">
                        {event.type === 'assignment' ? (
                          <User className="h-4 w-4 rounded-full text-primary" />
                        ) : (
                          <FileText className="h-4 w-4 rounded-full text-primary" />
                        )}
                      </div>
                      <div className="w-px h-full bg-border mt-2" />
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium text-sm">
                        {event.type === 'assignment' 
                          ? `Assigned to ${event.assignment.NAME}`
                          : `Update from ${event.assignment.NAME}`
                        }
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(event.timestamp), "PPP 'at' p")}
                      </p>
                    </div>
                  </div>
                ));
              })()}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}