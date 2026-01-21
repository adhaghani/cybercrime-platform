'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Clock, TrendingUp, Users, AlertTriangle, Building2, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { PaginationControls } from "@/components/ui/pagination-controls";

interface UnassignedReport {
  REPORT_ID: number;
  TITLE: string;
  DESCRIPTION: string;
  TYPE: 'CRIME' | 'FACILITY';
  STATUS: string;
  LOCATION: string;
  SUBMITTED_AT: string;
  SUBMITTER_NAME: string;
  ASSIGNMENT_COUNT: number;
  WAITING_DAYS: number;
  SEVERITY_SCORE: number;
  PRIORITY_SCORE: number;
  AVAILABLE_STAFF_COUNT: number;
}

export default function UnassignedReportsPage() {
  const [reports, setReports] = useState<UnassignedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'ALL' | 'CRIME' | 'FACILITY'>('ALL');
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 4;

  const fetchReports = async (type?: 'CRIME' | 'FACILITY') => {
    setLoading(true);
    setError(null);
    
    try {
      const url = type 
        ? `/api/reports/unassigned-priority?type=${type}`
        : '/api/reports/unassigned-priority';
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch unassigned reports');
      }
      
      const data = await response.json();
      setReports(data.data.filter((report: UnassignedReport) => report.TYPE === 'CRIME') || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setReports([]);
    } finally {
      setLoading(false);
    }
  };
  
  const filterCrime = () => {
    setReports(reports.filter(report => report.TYPE === 'CRIME'));
  }

  useEffect(() => {
    const type = selectedType === 'ALL' ? undefined : selectedType;
    fetchReports(type);
    setPage(1); // Reset to first page when changing filters
  }, [selectedType]);

  const getSeverityColor = (score: number) => {
    if (score >= 5) return 'destructive';
    if (score >= 4) return 'destructive';
    if (score >= 3) return 'default';
    return 'secondary';
  };

  const getSeverityLabel = (score: number) => {
    if (score >= 5) return 'Critical';
    if (score >= 4) return 'Severe';
    if (score >= 3) return 'Moderate';
    if (score >= 2) return 'Minor';
    return 'Low';
  };

  const getPriorityColor = (score: number) => {
    if (score >= 60) return 'text-red-600 font-bold';
    if (score >= 40) return 'text-orange-600 font-semibold';
    if (score >= 20) return 'text-yellow-600';
    return 'text-gray-600';
  };

  // Pagination
  const totalPages = Math.ceil(reports.length / ITEMS_PER_PAGE);
  const paginatedReports = reports.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const stats = {
    total: reports.length,
    highPriority: reports.filter(r => r.PRIORITY_SCORE >= 60).length,
    criticalSeverity: reports.filter(r => r.SEVERITY_SCORE >= 5).length,
    avgWaitingDays: reports.length > 0 
      ? (reports.reduce((sum, r) => sum + r.WAITING_DAYS, 0) / reports.length).toFixed(1)
      : '0',
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Unassigned Reports</h1>
          <p className="text-muted-foreground mt-1">
            Priority-ranked reports awaiting assignment with complex analytics
          </p>
        </div>
        <Button onClick={() => fetchReports(selectedType === 'ALL' ? undefined : selectedType)}>
          Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Unassigned</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Reports pending assignment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.highPriority}</div>
            <p className="text-xs text-muted-foreground">Priority score ≥ 60</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Severity</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.criticalSeverity}</div>
            <p className="text-xs text-muted-foreground">Severity level 5</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Wait Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgWaitingDays}</div>
            <p className="text-xs text-muted-foreground">Days waiting</p>
          </CardContent>
        </Card>
      </div>

      {/* Type Filter Tabs */}
      <Tabs value={selectedType} onValueChange={(v) => setSelectedType(v as typeof selectedType)}>
        <TabsList>
          <TabsTrigger value="ALL">All Reports ({reports.length})</TabsTrigger>
          {/* <TabsTrigger value="CRIME">
            <Shield className="h-4 w-4 mr-2" />
            Crime Reports
          </TabsTrigger>
          <TabsTrigger value="FACILITY">
            <Building2 className="h-4 w-4 mr-2" />
            Facility Reports
          </TabsTrigger> */}
        </TabsList>

        <TabsContent value={selectedType} className="space-y-4">
          {/* Error State */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : reports.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-xl font-semibold">No Unassigned Reports</p>
                <p className="text-muted-foreground mt-2">
                  All reports have been assigned to staff members
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Reports List */}
              <div className="space-y-4 grid lg:grid-cols-2 gap-4">
                {paginatedReports.map((report) => (
                <Card key={report.REPORT_ID} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-xl">
                            #{report.REPORT_ID} - {report.TITLE}
                          </CardTitle>
                          <Badge variant={report.TYPE === 'CRIME' ? 'destructive' : 'default'}>
                            {report.TYPE}
                          </Badge>
                        </div>
                        <CardDescription className="flex flex-col items-start gap-4 text-sm">
                          <span>📍 {report.LOCATION}</span>
                          <span>👤 {report.SUBMITTER_NAME}</span>
                          <span>🗓️ {format(new Date(report.SUBMITTED_AT), 'PPp')}</span>
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className={`text-3xl font-bold ${getPriorityColor(report.PRIORITY_SCORE)}`}>
                          {report.PRIORITY_SCORE}
                        </div>
                        <p className="text-xs text-muted-foreground">Priority Score</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {report.DESCRIPTION}
                    </p>

                    {/* Analytics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-muted rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{report.WAITING_DAYS}</div>
                        <div className="text-xs text-muted-foreground">Days Waiting</div>
                      </div>
                      
                      <div className="text-center">
                        <Badge variant={getSeverityColor(report.SEVERITY_SCORE)}>
                          {getSeverityLabel(report.SEVERITY_SCORE)}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">Severity</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold">{report.ASSIGNMENT_COUNT}</div>
                        <div className="text-xs text-muted-foreground">Assignments</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{report.AVAILABLE_STAFF_COUNT}</div>
                        <div className="text-xs text-muted-foreground">Available Staff</div>
                      </div>

                      <div className="text-center">
                        <Badge variant="outline">{report.STATUS}</Badge>
                        <div className="text-xs text-muted-foreground mt-1">Status</div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-4 flex gap-2">
                      <Button 
                        className="flex-1"
                        asChild
                      >
                        <Link href={`/dashboard/reports/${report.REPORT_ID}`}>
                        View Details
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6">
                <PaginationControls
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  itemsPerPage={ITEMS_PER_PAGE}
                  totalItems={reports.length}
                />
              </div>
            )}
            </div>
          </>
            
          )}
        </TabsContent>
      </Tabs>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            About Priority Scoring
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>Priority Score</strong> is calculated using complex subqueries that consider:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><strong>Waiting Time:</strong> Days since submission (weighted 2x)</li>
            <li><strong>Severity Level:</strong> Based on injury level (Crime) or severity (Facility)</li>
            <li><strong>Report Type:</strong> Crime reports may receive higher priority</li>
            <li><strong>Staff Availability:</strong> Number of staff not currently overloaded</li>
          </ul>
          <p className="mt-4">
            Reports with <span className="font-semibold text-red-600">Priority Score ≥ 60</span> require immediate attention.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
