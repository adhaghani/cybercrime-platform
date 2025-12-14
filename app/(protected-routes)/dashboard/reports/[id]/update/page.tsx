"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, FileText, Calendar, User, MapPin, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { MOCK_REPORTS, MOCK_ASSIGNMENTS, MOCK_STAFF } from "@/lib/api/mock-data";
import { ReportStatus } from "@/lib/types";
import { format } from "date-fns";
import { notFound, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Type for mock assignment data (temporary until mock data is updated)
type MockAssignment = {
  id: string;
  reportId: string;
  assignedTo: string;
  assignedAt: string;
  status?: string;
  actionTaken?: string;
  additionalFeedback?: string;
};

type MockStaff = {
  id: string;
  name: string;
  position: string;
  department: string;
  role: string;
};

export default function UpdateReportProgressPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  
  // Find the report
  const report = MOCK_REPORTS.find((r) => r.reportId === params.id);
  
  // Find assignment for current staff (using staff-1 as current user)
  const currentStaffId = "staff-1";
  const assignment = (MOCK_ASSIGNMENTS as unknown as MockAssignment[]).find(
    (a) => a.reportId === params.id && a.assignedTo === currentStaffId
  );

  // Get staff details
  const currentStaff = (MOCK_STAFF as unknown as MockStaff[]).find((s) => s.id === currentStaffId);

  // Form state
  const [actionTaken, setActionTaken] = useState("");
  const [additionalFeedback, setAdditionalFeedback] = useState("");
  const [reportStatus, setReportStatus] = useState<ReportStatus>("PENDING");
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form with existing assignment data
  useEffect(() => {
    if (assignment) {
      setActionTaken(assignment.actionTaken || "");
      setAdditionalFeedback(assignment.additionalFeedback || "");
    }
    if (report) {
      setReportStatus(report.status);
    }
  }, [assignment, report]);

  // Handle not found cases
  if (!report) {
    notFound();
  }

  // TODO: Re-enable access control in production
  // if (!assignment) {
  //   return (
  //     <div className="space-y-6">
  //       <Card>
  //         <CardHeader>
  //           <CardTitle>Access Denied</CardTitle>
  //           <CardDescription>
  //             You are not assigned to this report. Only assigned staff members can update progress.
  //           </CardDescription>
  //         </CardHeader>
  //         <CardContent>
  //           <Button asChild>
  //             <Link href="/dashboard/reports">
  //               <ArrowLeft className="h-4 w-4 mr-2" />
  //               Back to Reports
  //             </Link>
  //           </Button>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   );
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // TODO: Implement API call to update assignment
      console.log("Updating assignment:", {
        assignmentId: assignment?.id || "N/A",
        actionTaken,
        additionalFeedback,
        reportStatus,
      });

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect back to report detail page
      router.push(`/dashboard/reports/${params.id}`);
    } catch (error) {
      console.error("Error updating progress:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "IN_PROGRESS":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "RESOLVED":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "REJECTED":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/dashboard/reports/${params.id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Report
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="h-8 w-8" />
          Update Report Progress
        </h1>
        <p className="text-muted-foreground">
          Update your progress and provide feedback on this assigned report
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Report Information */}
            <Card>
              <CardHeader>
                <CardTitle>Report Information</CardTitle>
                <CardDescription>Details of the report you&apos;re working on</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Report ID</Label>
                    <p className="font-mono text-sm">{report.reportId}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Status</Label>
                    <div>
                      <Badge className={getStatusColor(report.status)} variant="outline">
                        {report.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">Title</Label>
                  <p className="font-medium">{report.title}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="text-sm">{report.description}</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Location
                    </Label>
                    <p className="text-sm">{report.location}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Submitted At
                    </Label>
                    <p className="text-sm">{format(new Date(report.submittedAt), "PPp")}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">Type</Label>
                  <Badge variant="outline">
                    {report.type === "CRIME" ? "Crime Report" : "Facility Issue"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Progress Update Form */}
            <Card>
              <CardHeader>
                <CardTitle>Update Progress</CardTitle>
                <CardDescription>
                  Provide details about the actions taken and current status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reportStatus">Report Status *</Label>
                  <Select value={reportStatus} onValueChange={(value) => setReportStatus(value as ReportStatus)}>
                    <SelectTrigger id="reportStatus">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="RESOLVED">Resolved</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Update the current status of this report
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="actionTaken">Action Taken *</Label>
                  <Textarea
                    id="actionTaken"
                    placeholder="Describe the actions you have taken to address this report..."
                    value={actionTaken}
                    onChange={(e) => setActionTaken(e.target.value)}
                    rows={6}
                    required
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Detail the steps and actions taken so far
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalFeedback">Additional Feedback</Label>
                  <Textarea
                    id="additionalFeedback"
                    placeholder="Any additional notes, observations, or recommendations..."
                    value={additionalFeedback}
                    onChange={(e) => setAdditionalFeedback(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional: Add any relevant observations or recommendations
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Assignment Info */}
            <Card>
              <CardHeader>
                <CardTitle>Assignment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-1">
                    <User className="h-3 w-3" />
                    Assigned To
                  </Label>
                  <p className="font-medium">{currentStaff?.name || "Unknown"}</p>
                  <p className="text-xs text-muted-foreground">{currentStaff?.position || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Assigned At
                  </Label>
                  <p className="text-sm">
                    {assignment ? format(new Date(assignment.assignedAt), "PPp") : "Not assigned"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">Assignment ID</Label>
                  <p className="font-mono text-xs">{assignment?.id || "N/A"}</p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button type="submit" className="w-full" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Progress
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" className="w-full" asChild>
                  <Link href={`/dashboard/reports/${params.id}`}>Cancel</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Help Text */}
            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900">
              <CardHeader>
                <CardTitle className="text-blue-900 dark:text-blue-100 text-sm">
                  Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-blue-800 dark:text-blue-200 space-y-2">
                <ul className="list-disc list-inside space-y-1">
                  <li>Provide clear and detailed action descriptions</li>
                  <li>Update status to reflect current progress</li>
                  <li>Include timestamps for major actions</li>
                  <li>Mention any challenges or blockers</li>
                  <li>Add recommendations for future prevention</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}