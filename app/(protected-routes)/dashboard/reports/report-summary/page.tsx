"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import Link from "next/link";
import { GeneratedReport } from "@/lib/types";
import { generateMetadata } from "@/lib/seo";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/ui/data-table/data-table";
import { createColumns } from "@/components/generated-report/columns";
import { format } from "date-fns";
import { toast } from "sonner";

export default function AllGeneratedReportsPage() {
  const [reports, setReports] = useState<GeneratedReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGeneratedReports = async () => {
      try {
        const response = await fetch('/api/generated-reports');
        if (!response.ok) throw new Error('Failed to fetch generated reports');
        const data = await response.json();
        setReports(data.data);
      } catch (error) {
        toast.error("Failed to fetch generated reports. Please try again.");
        console.error('Error fetching generated reports:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGeneratedReports();
  }, []);

  const handleDownload = (report: GeneratedReport) => {
    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${report.GENERATE_ID}-${report.TITLE.replace(/\s+/g, "-").toLowerCase()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

    const handleDownloadTXT = (report: GeneratedReport) => {
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

  // Get unique values for filters
  const categories = Array.from(
    new Set(
      reports
        .map((r) => r.REPORT_CATEGORY)
    )
  );
  const types = Array.from(new Set(reports.map((r) => r.REPORT_DATA_TYPE)));

  // Create columns with handlers
  const columns = useMemo(
    () => createColumns({
      onDownload: handleDownload,
      onDownloadTXT: handleDownloadTXT,
    }),
    []
  );

  // Prepare filterable columns
  const filterableColumns = [
    {
      id: "REPORT_CATEGORY",
      title: "Category",
      options: categories.map((cat) => ({ label: cat, value: cat })),
    },
    {
      id: "REPORT_DATA_TYPE",
      title: "Type",
      options: types.map((type) => ({ label: type, value: type })),
    },
  ];

  const stats = {
    total: reports.length,
    facility: reports.filter((r) => r.REPORT_CATEGORY === "FACILITY").length,
    crime: reports.filter((r) => r.REPORT_CATEGORY === "CRIME").length,
    all: reports.filter((r) => r.REPORT_CATEGORY === "ALL REPORTS").length,
  };

  if (loading) {
    return (
      <>
        <div className="space-y-4">
          <Skeleton className="h-12 w-1/3 rounded-md" />
          <Skeleton className="h-8 w-1/2 rounded-md" />
          <div className="grid gap-4 md:grid-cols-4">
            <Skeleton className="h-32 w-full rounded-md" />
            <Skeleton className="h-32 w-full rounded-md" />
            <Skeleton className="h-32 w-full rounded-md" />
            <Skeleton className="h-32 w-full rounded-md" />
          </div>
          <Skeleton className="h-32 w-full rounded-md" />
          <Skeleton className="h-[400px] w-full rounded-md" />
        </div>
      </>
    );
  }

  generateMetadata({
    title: "AI-Generated Reports - Cybercrime Reporting Platform",
    description: "View and download all AI-generated analytical reports on the Cybercrime Reporting Platform.",
    canonical: "/dashboard/reports/report-summary",
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="h-8 w-8" />
          AI-Generated Reports
        </h1>
        <p className="text-muted-foreground">
          View and download all AI-generated analytical reports
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All generated reports</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crime Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.crime}</div>
            <p className="text-xs text-muted-foreground">Crime analysis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Facility Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{stats.facility}</div>
            <p className="text-xs text-muted-foreground">Facility analysis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overview Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">{stats.all}</div>
            <p className="text-xs text-muted-foreground">Comprehensive reports</p>
          </CardContent>
        </Card>
      </div>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Reports ({reports.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {reports.length > 0 ? (
            <DataTable
              columns={columns}
              data={reports}
              searchKey="TITLE"
              searchPlaceholder="Search by title or summary..."
              filterableColumns={filterableColumns}
            />
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No generated reports found.</p>
              <p className="text-sm mt-2">Try generating a new report.</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/dashboard/reports/report-summary/generate">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate New Report
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}