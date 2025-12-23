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
import { Crime, Facility,  ReportAssignment } from "@/lib/types";
import { format } from "date-fns";
import StatusBadge from "@/components/ui/statusBadge";
import { notFound, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/context/auth-provider";
import { ResolveReportDialog } from "@/components/report/resolve-report-dialog";
import { AssignStaffDialog } from "@/components/report/assign-staff-dialog";
import { useHasAnyRole } from "@/hooks/use-user-role";

export default function ReportDetailsPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const showAssignDialog = searchParams.get("action") === "assign";
  const { claims } = useAuth();
  const [report, setReport] = useState<Crime | Facility | null>(null);
  const [loading, setLoading] = useState(true);

  const isSupervisorOrAdmin = useHasAnyRole()(["SUPERVISOR", "ADMIN", "SUPERADMIN"]);

  useEffect(() => {
    fetchReport();
  }, [params.id]);

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
      setReport(data.report);
    } catch (error) {
      console.error('Failed to fetch report:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(showAssignDialog);
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [updateActionTaken, setUpdateActionTaken] = useState("");
  const [updateFeedback, setUpdateFeedback] = useState("");
  // Get current user info for auto-fill
  const currentUserName = claims?.user_metadata?.name || "Current User";
  const currentUserId = claims?.sub || "user-1";

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

  const isCrimeReport = report.type === "CRIME";
  const crimeData = isCrimeReport ? (report as Crime) : null;
  const facilityData = !isCrimeReport ? (report as Facility) : null;

  const handleUpdateReport = () => {
    // TODO: Implement API call to update assignment
    const updateData: Partial<ReportAssignment> = {
      reportId: params.id,
      accountId: currentUserId,
      actionTaken: updateActionTaken,
      additionalFeedback: updateFeedback,
    };
    
    console.log("Updating report:", updateData);
    setIsUpdateDialogOpen(false);
    setUpdateActionTaken("");
    setUpdateFeedback("");
  };

  return (
    <div className="space-y-6 mx-auto w-full max-w-7xl">
      {/* Header */}
      
        <div className="w-full flex gap-2 justify-end">
          {report.status !== "RESOLVED" && (
            <>
            {isSupervisorOrAdmin ? <>
              <Button variant="outline" onClick={() => setIsAssignDialogOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Assign Staff
              </Button>

              <AssignStaffDialog
                reportId={report.reportId}
                reportTitle={report.title}
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
                reportTitle={report.title} 
                onSuccess={() => {
                  fetchReport(); // Refresh report data
                }}
                reportId={report.reportId}
              />
              </> : null}
              
              <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <FileText className="h-4 w-4 mr-2" />
                    Update Assignment
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
              </Dialog>
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
            <h1 className="text-3xl font-bold tracking-tight">{report.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge status={report.status} />
              <Badge variant="outline">
                {report.type}
              </Badge>
            </div>
          </div>
        </div>
      </div>

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
                <p className="mt-1">{report.description}</p>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </Label>
                  <p className="mt-1 font-medium">{report.location}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Submitted At
                  </Label>
                  <p className="mt-1 font-medium">
                    {format(new Date(report.submittedAt), "PPP 'at' p")}
                  </p>
                </div>
              </div>

              {report.attachmentPath && (
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
                    <p className="mt-1 font-medium">{crimeData.crimeCategory}</p>
                  </div>
                  {crimeData.injuryLevel && (
                    <div>
                      <Label className="text-muted-foreground">Injury Level</Label>
                      <p className="mt-1 font-medium">{crimeData.injuryLevel}</p>
                    </div>
                  )}
                </div>
                {crimeData.suspectDescription && (
                  <div>
                    <Label className="text-muted-foreground">Suspect Description</Label>
                    <p className="mt-1">{crimeData.suspectDescription}</p>
                  </div>
                )}
                {crimeData.victimInvolved && (
                  <div>
                    <Label className="text-muted-foreground">Victim Information</Label>
                    <p className="mt-1">{crimeData.victimInvolved}</p>
                  </div>
                )}
                {crimeData.weaponInvolved && (
                  <div>
                    <Label className="text-muted-foreground">Weapon Involved</Label>
                    <p className="mt-1">{crimeData.weaponInvolved}</p>
                  </div>
                )}
                {crimeData.evidenceDetails && (
                  <div>
                    <Label className="text-muted-foreground">Evidence Details</Label>
                    <p className="mt-1">{crimeData.evidenceDetails}</p>
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
                    <p className="mt-1 font-medium">{facilityData.facilityType}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Severity Level</Label>
                    <Badge variant={
                      facilityData.severityLevel === "CRITICAL" ? "destructive" : 
                      facilityData.severityLevel === "HIGH" ? "default" : "outline"
                    }>
                      {facilityData.severityLevel}
                    </Badge>
                  </div>
                </div>
                {facilityData.affectedEquipment && (
                  <div>
                    <Label className="text-muted-foreground">Affected Equipment</Label>
                    <p className="mt-1">{facilityData.affectedEquipment}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
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
                <p className="text-sm text-muted-foreground">ID: {report.submittedBy}</p>
              </div>
              <Separator />
              <div>
                <Label className="text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Last Updated
                </Label>
                <p className="mt-1 font-medium">
                  {format(new Date(report.updatedAt), "PPP")}
                </p>
              </div>
              <Separator />
              <div>
                <Label className="text-muted-foreground">Report ID</Label>
                <p className="mt-1 font-mono text-sm">{report.reportId}</p>
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
                <div className="flex items-center gap-2 p-2 rounded-lg bg-accent/50">
                  <User className="h-4 w-4" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">No assignments yet</p>
                    <p className="text-xs text-muted-foreground">Click &quot;Assign Staff&quot; to assign</p>
                  </div>
                </div>
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
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="w-px h-full bg-border mt-2" />
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="font-medium text-sm">Report Submitted</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(report.submittedAt), "PPP 'at' p")}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}