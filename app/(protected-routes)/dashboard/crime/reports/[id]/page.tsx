"use client";

import { use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MapPin, Calendar, Clock, ShieldAlert, FileText, Loader2 } from "lucide-react";
import Link from "next/link";
import { Crime } from "@/lib/types";
import { format } from "date-fns";
import StatusBadge from "@/components/ui/statusBadge";
import CrimeCategoryBadge from "@/components/ui/crimeCategoryBadge";
import { useState, useEffect } from "react";
export default function CrimeReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [report, setReport] = useState<Crime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        console.log('Fetching report with ID:', id);
        const response = await fetch(`/api/reports/${id}`);
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          
          // Try to parse as JSON
          try {
            const errorData = JSON.parse(errorText);
            throw new Error(errorData.error || errorData.message || 'Failed to fetch report');
          } catch (parseError) {
            throw new Error(errorText || `HTTP ${response.status}: ${response.statusText}`);
          }
        }
        const data = await response.json();
        console.log('Report data:', data);
        
        if (data.type === 'CRIME' || data.TYPE === 'CRIME') {
          setReport(data as Crime);
        } else {
          throw new Error('Report is not a crime report');
        }
      } catch (error) {
        console.error('Error fetching report:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
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
          <p className="text-muted-foreground">Report ID: {report.reportId}</p>
        </div>
        <div className="flex gap-2">
          <StatusBadge status={report.status} />
          <CrimeCategoryBadge category={report.crimeCategory} />
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
                <StatusBadge status={report.status} />
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Category</p>
                <CrimeCategoryBadge category={report.crimeCategory} />
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
                <Link href="/dashboard/crime/reports">Back to Reports</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
