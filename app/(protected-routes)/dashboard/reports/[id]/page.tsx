/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  FileText,
  Calendar,
  MapPin,
  User,
  UserPlus,
  Clock,
  Image as ImageIcon,
  ShieldAlert,
  Wrench,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { Crime, Facility, ReportWithAssignedStaffDetails } from "@/lib/types";
import { format } from "date-fns";
import StatusBadge from "@/components/ui/statusBadge";
import { notFound, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/context/auth-provider";
import { ResolveReportDialog } from "@/components/report/resolve-report-dialog";
import { AssignStaffDialog } from "@/components/report/assign-staff-dialog";
import { useHasAnyRole } from "@/hooks/use-user-role";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export default function ReportDetailsPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const showAssignDialog = searchParams.get("action") === "assign";
  const { claims } = useAuth();
  const [report, setReport] = useState<ReportWithAssignedStaffDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const isSupervisorOrAdmin = useHasAnyRole()(["SUPERVISOR", "ADMIN", "SUPERADMIN"]);


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
  
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(showAssignDialog);
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [updateActionTaken, setUpdateActionTaken] = useState("");
  const [updateFeedback, setUpdateFeedback] = useState("");
  // Get current user info for auto-fill
  const currentUserName = claims?.NAME|| "Current User";
  const currentUserId = claims?.ACCOUNT_ID || "-";

  const isCurrentUserAssignedToThisReport = report?.STAFF_ASSIGNED?.some(assignment => 
    assignment.ACCOUNT_ID === currentUserId
  );

  const isCurrentUserCompletedAssignment = report?.STAFF_ASSIGNED?.some(assignment =>
    assignment.ACCOUNT_ID === currentUserId && assignment.ACTION_TAKEN && assignment.ACTION_TAKEN.trim() !== ""
  );

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

  const handleUpdateReport = async () => {
    try {
      // Find the current user's assignment for this report
      const currentUserAssignment = report?.STAFF_ASSIGNED?.find(
        assignment => assignment.ACCOUNT_ID === currentUserId
      );

      if (!currentUserAssignment) {
        console.error("No assignment found for current user");
        return;
      }

      const response = await fetch(`/api/report-assignments/${currentUserAssignment.ASSIGNMENT_ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action_taken: updateActionTaken,
          additional_feedback: updateFeedback,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update assignment');
      }

      // Close dialog and reset form
      setIsUpdateDialogOpen(false);
      setUpdateActionTaken("");
      setUpdateFeedback("");

      // Refresh report data to show updated information
      await fetchReport();
    } catch (error) {
      console.error("Failed to update assignment:", error);
    }
  };

  return (
    <div className="space-y-6 mx-auto w-full max-w-7xl">
      {/* Header */}
      
        <div className="w-full flex gap-2 justify-end">
          {report.STATUS !== "RESOLVED" && (
            <>
            {isSupervisorOrAdmin ? <>
              <Button variant="outline" onClick={() => setIsAssignDialogOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Assign Staff
              </Button>

              <AssignStaffDialog
                reportId={report.REPORT_ID}
                reportTitle={report.TITLE}
                open={isAssignDialogOpen}
                onOpenChange={setIsAssignDialogOpen}
                onSuccess={() => {
                  fetchReport(); // Refresh report data
                }}
              />

              <Button variant="outline" onClick={() => setIsResolveDialogOpen(true)}>
                Create Report Resolution
              </Button>

              <ResolveReportDialog 
                open={isResolveDialogOpen} 
                onOpenChange={setIsResolveDialogOpen} 
                reportTitle={report.TITLE} 
                onSuccess={() => {
                  fetchReport(); // Refresh report data
                }}
                reportId={report.REPORT_ID}
              />
              </> : null}
              
              {isCurrentUserAssignedToThisReport && <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                <DialogTrigger asChild>
                  <Button disabled={isCurrentUserCompletedAssignment} variant={isCurrentUserCompletedAssignment ? "ghost" : "default"}>
                    <FileText className="h-4 w-4 mr-2" />
                    {isCurrentUserCompletedAssignment ? "Assignment Completed" : "Update Assignment"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Update Assignment</DialogTitle>
                    <DialogDescription>
                      Update the progress and provide feedback on this report
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Assigned Staff Member</Label>
                      <Input
                        value={currentUserName}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="action-taken">Action Taken *</Label>
                      <Textarea
                        id="action-taken"
                        placeholder="Describe the actions you have taken on this report..."
                        value={updateActionTaken}
                        onChange={(e) => setUpdateActionTaken(e.target.value)}
                        rows={4}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="additional-feedback">Additional Feedback</Label>
                      <Textarea
                        id="additional-feedback"
                        placeholder="Add any additional notes or feedback..."
                        value={updateFeedback}
                        onChange={(e) => setUpdateFeedback(e.target.value)}
                        rows={4}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateReport} disabled={!updateActionTaken.trim()}>
                      Update Assignment
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>}
            </>
          )}
        </div>
    

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
        report.STATUS === "RESOLVED" && report.RESOLUTIONS && (
      <div className="grid w-full items-start gap-4">
      <Alert className="bg-green-500/10 border-green-500/20 text-green-500">
        <AlertTitle>This report has been resolved</AlertTitle>
        <AlertDescription>
          This report was resolved on {format(new Date(report.RESOLUTIONS.RESOLVED_AT), "PPP 'at' p")} with the following summary:
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

              {report.ATTACHMENT_PATH && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-muted-foreground flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Attachment
                    </Label>
                    <div className="mt-2">
                      <Button variant="outline" size="sm">
                        View Attachment
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

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
                )) : <p className="text-sm text-muted-foreground">No staff have been assigned to this report yet.</p>
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
                : <div className="flex items-center gap-2 p-2 rounded-lg bg-accent/50">
                  <User className="h-4 w-4" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">No assignments yet</p>
                    <p className="text-xs text-muted-foreground">Click &quot;Assign Staff&quot; to assign</p>
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