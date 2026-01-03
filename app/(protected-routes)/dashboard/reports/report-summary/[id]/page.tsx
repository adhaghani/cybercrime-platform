"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getCategoryColor, getGeneratedReportTypeColor } from "@/lib/utils/badge-helpers";
import { 
  ArrowLeft, 
  Download, 
  Calendar, 
  User, 
  FileText, 
  MapPin
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { GeneratedReport } from "@/lib/types";
import { generateMetadata } from "@/lib/seo";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function ReportSummaryDetailPage() {
  const params = useParams();
  const reportId = params.id as string;
  const [report, setReport] = useState<GeneratedReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/generated-reports/${reportId}`);
        if (!response.ok) throw new Error('Not found');
        const data = await response.json();
        setReport(data.data);
      } catch (error) {
        toast.error ("Failed to fetch report. Please try again.");
        console.error('Error fetching report:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [reportId]);

  const handleDownload = () => {
    if (!report) return;

    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${report.GENERATE_ID}-${report.TITLE.replace(/\s+/g, "-").toLowerCase()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadTXT = () => {
    if (!report) return;
    
    // Create a formatted text version for download
    let content = `${report.TITLE}\n`;
    content += `${"=".repeat(report.TITLE.length)}\n\n`;
    content += `Generated: ${format(new Date(report.REQUESTED_AT), "PPP")}\n`;
    content += `Period: ${format(new Date(report.DATE_RANGE_START), "PP")} - ${format(new Date(report.DATE_RANGE_END), "PP")}\n`;
    content += `Category: ${report.REPORT_CATEGORY}\n`;
    content += `Type: ${report.REPORT_DATA_TYPE}\n\n`;
    content += `Summary\n${"=".repeat(50)}\n${report.SUMMARY}\n\n`;
    
    if (report.REPORT_DATA?.executiveSummary) {
      content += `Executive Summary\n${"=".repeat(50)}\n${report.REPORT_DATA.executiveSummary}\n\n`;
    }
    
    if (report.REPORT_DATA?.detailedAnalysis) {
      content += `Detailed Analysis\n${"=".repeat(50)}\n${report.REPORT_DATA.detailedAnalysis}\n\n`;
    }
    
    if (report.REPORT_DATA?.riskAssessment) {
      content += `Risk Assessment\n${"=".repeat(50)}\n`;
      content += `Level: ${report.REPORT_DATA.riskAssessment.level}\n\n`;
      if (report.REPORT_DATA.riskAssessment.factors) {
        content += `Key Factors:\n`;
        report.REPORT_DATA.riskAssessment.factors.forEach((factor: string, i: number) => {
          content += `${i + 1}. ${factor}\n`;
        });
        content += `\n`;
      }
    }
    
    if (report.REPORT_DATA?.recommendations) {
      content += `Recommendations\n${"=".repeat(50)}\n`;
      report.REPORT_DATA.recommendations.forEach((rec: string, i: number) => {
        content += `${i + 1}. ${rec}\n`;
      });
      content += `\n`;
    }
    
    if (report.REPORT_DATA?.conclusion) {
      content += `Conclusion\n${"=".repeat(50)}\n${report.REPORT_DATA.conclusion}\n`;
    }
    
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${report.GENERATE_ID}-report.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

   if (loading) {
    return (
      <>
        <div className="space-y-4">
          <Skeleton className="h-12 w-1/3 rounded-md" />
          <Skeleton className="h-8 w-1/2 rounded-md" />
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-40 w-full rounded-md" />
              <Skeleton className="h-[500px] w-full rounded-md" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-40 w-full rounded-md" />
              <Skeleton className="h-40 w-full rounded-md" />
              <Skeleton className="h-40 w-full rounded-md" />
            </div>
          </div>
        </div>
      </>
    );
  }

  generateMetadata({
    title: report ? `Report Summary - ${report.TITLE} - Cybercrime Reporting Platform` : "Report Not Found - Cybercrime Reporting Platform",
    description: report ? `Detailed summary of the report titled "${report.TITLE}" on the Cybercrime Reporting Platform.` : "The requested report could not be found on the Cybercrime Reporting Platform.",
    canonical: `/dashboard/reports/report-summary/${reportId}`,
  });

  if (!report) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/reports/all-generated-report">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reports
          </Link>
        </Button>
        
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
              <div>
                <h2 className="text-2xl font-bold">Report Not Found</h2>
                <p className="text-muted-foreground mt-2">
                  The report you&apos;re looking for doesn&apos;t exist or has been removed.
                </p>
              </div>
              <Button asChild>
                <Link href="/dashboard/reports/all-generated-report">
                  View All Reports
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/reports/report-summary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="h-8 w-8" />
          Report Summary
        </h1>
        <p className="text-muted-foreground">
          AI-powered analytical report details
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Header Card */}
          <Card>
            <CardHeader>
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className={getCategoryColor(report.REPORT_CATEGORY)}>
                    {report.REPORT_CATEGORY}
                  </Badge>
                  <Badge variant="outline" className={getGeneratedReportTypeColor(report.REPORT_DATA_TYPE)}>
                    {report.REPORT_DATA_TYPE}
                  </Badge>
                </div>
                
                <div>
                  <CardTitle className="text-2xl">{report.TITLE}</CardTitle>
                  <CardDescription className="mt-2">
                    {report.SUMMARY}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Generated Report Display - Matching generate page style */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Generated Report</CardTitle>
                  <CardDescription>
                    AI-powered analysis of {report.REPORT_CATEGORY.toLowerCase()} data
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Executive Summary */}
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Executive Summary</h3>
                <p className="text-sm text-muted-foreground">
                  {report.REPORT_DATA?.executiveSummary || report.SUMMARY}
                </p>
              </div>

              {/* Key Statistics */}
              {report.REPORT_DATA?.keyStatistics && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Key Statistics</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border p-4">
                      <p className="text-sm text-muted-foreground">Total Incidents</p>
                      <p className="text-2xl font-bold">
                        {report.REPORT_DATA.keyStatistics.totalIncidents || 
                         report.REPORT_DATA.keyStatistics.totalReports || 0}
                      </p>
                    </div>
                    {report.REPORT_DATA.keyStatistics.byStatus && (
                      <>
                        <div className="rounded-lg border p-4 bg-yellow-50 dark:bg-yellow-950">
                          <p className="text-sm text-muted-foreground">Pending</p>
                          <p className="text-2xl font-bold text-yellow-600">
                            {report.REPORT_DATA.keyStatistics.byStatus.pending}
                          </p>
                        </div>
                        <div className="rounded-lg border p-4 bg-blue-50 dark:bg-blue-950">
                          <p className="text-sm text-muted-foreground">In Progress</p>
                          <p className="text-2xl font-bold text-blue-600">
                            {report.REPORT_DATA.keyStatistics.byStatus.inProgress}
                          </p>
                        </div>
                        <div className="rounded-lg border p-4 bg-green-50 dark:bg-green-950">
                          <p className="text-sm text-muted-foreground">Resolved</p>
                          <p className="text-2xl font-bold text-green-600">
                            {report.REPORT_DATA.keyStatistics.byStatus.resolved}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Detailed Analysis */}
              {report.REPORT_DATA?.detailedAnalysis && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Detailed Analysis</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {report.REPORT_DATA.detailedAnalysis}
                  </p>
                </div>
              )}

              {/* Risk Assessment */}
              {report.REPORT_DATA?.riskAssessment && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Risk Assessment</h3>
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground mb-2">Risk Level</p>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        report.REPORT_DATA.riskAssessment.level === 'CRITICAL' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        report.REPORT_DATA.riskAssessment.level === 'HIGH' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                        report.REPORT_DATA.riskAssessment.level === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      }`}>
                        {report.REPORT_DATA.riskAssessment.level}
                      </span>
                    </div>
                    {report.REPORT_DATA.riskAssessment.factors && (
                      <div className="mt-4">
                        <p className="text-sm text-muted-foreground mb-2">Key Factors:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {report.REPORT_DATA.riskAssessment.factors.map((factor: string, index: number) => (
                            <li key={index} className="text-sm">{factor}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {report.REPORT_DATA?.recommendations && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Recommendations</h3>
                  <ul className="list-decimal list-inside space-y-2">
                    {report.REPORT_DATA.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="text-sm text-muted-foreground">{rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Conclusion */}
              {report.REPORT_DATA?.conclusion && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Conclusion</h3>
                  <p className="text-sm text-muted-foreground">
                    {report.REPORT_DATA.conclusion}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Report Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Generated</p>
                <p className="font-mono text-xs">{format(new Date(report.REQUESTED_AT), "PPp")}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground mb-1">Report ID</p>
                <p className="font-mono text-xs">{report.GENERATE_ID}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground mb-1">Period</p>
                <p className="flex items-center gap-1 text-xs">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(report.DATE_RANGE_START), "PP")} - {format(new Date(report.DATE_RANGE_END), "PP")}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground mb-1">Generated By</p>
                <p className="flex items-center gap-1 text-xs">
                  <User className="h-3 w-3" />
                  {report.GENERATED_BY_NAME}
                </p>
                <p className="text-xs text-muted-foreground">{report.GENERATED_BY_EMAIL}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full" onClick={handleDownloadTXT}>
                <Download className="h-4 w-4 mr-2" />
                Download as TXT
              </Button>
              <Button variant="outline" size="sm" className="w-full" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download as JSON
              </Button>
            </CardContent>
          </Card>

          {/* Top Locations - Sidebar version */}
          {report.REPORT_DATA?.topLocations && report.REPORT_DATA.topLocations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Top Locations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {report.REPORT_DATA.topLocations.slice(0, 5).map((location: { location: string; count: number }, index: number) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {index + 1}
                        </div>
                        <span className="text-xs">{location.location}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">{location.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900">
            <CardHeader>
              <CardTitle className="text-blue-900 dark:text-blue-100 text-sm">
                About This Report
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-blue-800 dark:text-blue-200 space-y-2">
              <p>This report was generated using AI analysis of campus safety data within the specified date range.</p>
              <p className="mt-2">
                The analysis includes incident trends, risk assessments, and actionable recommendations for improving campus safety.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}