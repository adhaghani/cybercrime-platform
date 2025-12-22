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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  FileText,
  Calendar,
  MapPin,
  User,
  UserPlus,
  CheckCircle2,
  Clock,
  Image as ImageIcon,
  ShieldAlert,
  Wrench
} from "lucide-react";
import { useState } from "react";
import { MOCK_REPORTS } from "@/lib/api/mock-data";
import { Crime, Facility, ResolutionType, ReportAssignment } from "@/lib/types";
import { format } from "date-fns";
import StatusBadge from "@/components/ui/statusBadge";
import { notFound, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/context/auth-provider";

export default function ReportDetailsPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const showAssignDialog = searchParams.get("action") === "assign";
  const { claims } = useAuth();
  
  const report = MOCK_REPORTS.find((r) => r.reportId === params.id);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(showAssignDialog);
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [updateActionTaken, setUpdateActionTaken] = useState("");
  const [updateFeedback, setUpdateFeedback] = useState("");
  const [resolutionType, setResolutionType] = useState<ResolutionType>("RESOLVED");
  const [resolutionSummary, setResolutionSummary] = useState("");
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  
  // Get current user info for auto-fill
  const currentUserName = claims?.user_metadata?.name || "Current User";
  const currentUserId = claims?.sub || "user-1";

  if (!report) {
    notFound();
  }

  const isCrimeReport = report.type === "CRIME";
  const crimeData = isCrimeReport ? (report as Crime) : null;
  const facilityData = !isCrimeReport ? (report as Facility) : null;


  const handleAssignReport = () => {
    // TODO: Implement API call to assign report
    console.log("Assigning report to:", selectedStaff);
    setIsAssignDialogOpen(false);
    setSelectedStaff("");
  };

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

  const handleResolveReport = () => {
    // TODO: Implement API call to create resolution
    console.log("Resolving report:", {
      reportId: params.id,
      resolutionType,
      resolutionSummary,
      evidenceFile
    });
    setIsResolveDialogOpen(false);
    setResolutionType("RESOLVED");
    setResolutionSummary("");
    setEvidenceFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEvidenceFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6 mx-auto w-full max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {report.status !== "RESOLVED" && (
            <>
              <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Assign Staff
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assign Report to Staff</DialogTitle>
                    <DialogDescription>
                      Assign this report to a subordinate staff member for handling
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="staff">Select Staff Member *</Label>
                      <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                        <SelectTrigger id="staff">
                          <SelectValue placeholder="Choose a staff member" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="staff-1">John Doe (Security Officer)</SelectItem>
                          <SelectItem value="staff-2">Jane Smith (Maintenance)</SelectItem>
                          <SelectItem value="staff-3">Ahmad Ali (Security Lead)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAssignReport} disabled={!selectedStaff}>
                      Assign Report
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={isResolveDialogOpen} onOpenChange={setIsResolveDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Resolve Report
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Resolve Report</DialogTitle>
                    <DialogDescription>
                      Provide resolution details for this report
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="resolution-type">Resolution Type *</Label>
                      <Select value={resolutionType} onValueChange={(value) => setResolutionType(value as ResolutionType)}>
                        <SelectTrigger id="resolution-type">
                          <SelectValue placeholder="Select resolution type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="RESOLVED">Resolved - Issue Fixed</SelectItem>
                          <SelectItem value="ESCALATED">Escalated - Needs Higher Authority</SelectItem>
                          <SelectItem value="DISMISSED">Dismissed - Not Valid</SelectItem>
                          <SelectItem value="TRANSFERRED">Transferred - Different Department</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="resolution-summary">Resolution Summary *</Label>
                      <Textarea
                        id="resolution-summary"
                        placeholder="Describe how the issue was resolved or handled..."
                        value={resolutionSummary}
                        onChange={(e) => setResolutionSummary(e.target.value)}
                        rows={6}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="evidence">Evidence / Attachment (Optional)</Label>
                      <Input
                        id="evidence"
                        type="file"
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={handleFileChange}
                      />
                      {evidenceFile && (
                        <p className="text-sm text-muted-foreground">
                          Selected: {evidenceFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsResolveDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleResolveReport} disabled={!resolutionSummary.trim()}>
                      Submit Resolution
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
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