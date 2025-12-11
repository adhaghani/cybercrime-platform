"use client";

import { use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MapPin, Calendar, Clock, AlertTriangle, ShieldAlert, FileText, Pencil } from "lucide-react";
import Link from "next/link";
import { MOCK_REPORTS } from "@/lib/api/mock-data";
import { CrimeReport, ReportStatus, CrimeCategory } from "@/lib/types";
import { format } from "date-fns";
import { useHasAnyRole } from "@/hooks/use-user-role";


export default function CrimeReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const hasAnyRole = useHasAnyRole();
  const isAuthorizedForEdit = hasAnyRole(['ADMIN', 'SUPERADMIN', 'STAFF']);
  const { id } = use(params);
  const report = MOCK_REPORTS.find((r) => r.id === id && r.type === "CRIME") as CrimeReport | undefined;

  if (!report) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/crime/reports">
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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/crime/reports">
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
          <Badge className={getCategoryColor(report.crimeCategory)}>
            <AlertTriangle className="h-3 w-3 mr-1" />
            {report.crimeCategory}
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
                <ShieldAlert className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Crime Category</p>
                  <p className="text-sm text-muted-foreground">{report.crimeCategory}</p>
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

            {report.suspectDescription && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Suspect Description</h3>
                  <p className="text-muted-foreground">{report.suspectDescription}</p>
                </div>
              </>
            )}

            {report.victimInvolved && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Victim Information</h3>
                  <p className="text-muted-foreground">{report.victimInvolved}</p>
                </div>
              </>
            )}

            {report.weaponInvolved && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Weapon Involved</h3>
                  <p className="text-muted-foreground">{report.weaponInvolved}</p>
                </div>
              </>
            )}

            {report.injuryLevel && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Injury Level</h3>
                  <p className="text-muted-foreground">{report.injuryLevel}</p>
                </div>
              </>
            )}

            {report.evidenceDetails && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Evidence Details</h3>
                  <p className="text-muted-foreground">{report.evidenceDetails}</p>
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
                <p className="text-sm font-medium mb-1">Category</p>
                <Badge className={getCategoryColor(report.crimeCategory)}>
                  {report.crimeCategory}
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
                        <CardContent className="flex items-center gap-2 flex-col">
                              {isAuthorizedForEdit ? <Button className="w-full" asChild>
                  <Link href={`/dashboard/facility/reports/${report.id}/update`}>
                 <Pencil size={10} /> Update Report
                 </Link>
                </Button> : null}
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/crime/reports">Back to Reports</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
