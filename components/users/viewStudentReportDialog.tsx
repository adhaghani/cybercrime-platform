'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, FileText, MapPin, Calendar, AlertCircle, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatusBadge from '@/components/ui/statusBadge';
import Link from 'next/link';
import { ReportStatus } from '@/lib/types';

interface ViewStudentReportDialogProps {
  accountId: string | null;
  studentName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Report {
  REPORT_ID: string;
  TITLE: string;
  DESCRIPTION?: string;
  LOCATION: string;
  TYPE: string;
  STATUS: string;
  SUBMITTED_AT: string;
  UPDATED_AT: string;
}

export function ViewStudentReportDialog({ 
  accountId, 
  studentName = 'this student',
  open, 
  onOpenChange 
}: ViewStudentReportDialogProps) {
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    if (open && accountId) {
      fetchReports();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, accountId]);

  const fetchReports = async () => {
    if (!accountId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/reports?submitted_by=${accountId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }
      
      const data = await response.json();
      // Handle both response formats (data.reports or data.data)
      setReports(data.reports || data.data || []);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      toast.error('Failed to load student reports');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeBadgeColor = (type: string) => {
    return type === 'CRIME' 
      ? 'bg-red-500/10 text-red-500 border-red-500/20' 
      : 'bg-blue-500/10 text-blue-500 border-blue-500/20';
  };

  const getStatusSummary = () => {
    const pending = reports.filter(r => r.STATUS === 'PENDING').length;
    const inProgress = reports.filter(r => r.STATUS === 'IN_PROGRESS').length;
    const resolved = reports.filter(r => r.STATUS === 'RESOLVED').length;
    const rejected = reports.filter(r => r.STATUS === 'REJECTED').length;

    return { pending, inProgress, resolved, rejected };
  };

  const statusSummary = reports.length > 0 ? getStatusSummary() : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl! w-full! max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Student Reports
          </DialogTitle>
          <DialogDescription>
            View all reports submitted by {studentName}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : reports.length > 0 ? (
          <div className="space-y-4">
            {/* Summary Stats */}
            {statusSummary && (
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{statusSummary.pending}</p>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{statusSummary.inProgress}</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">{statusSummary.resolved}</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{statusSummary.rejected}</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Total Reports: <span className="font-semibold text-foreground">{reports.length}</span>
              </p>
            </div>

            <Separator />

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.REPORT_ID}>
                    <TableCell>
                      <Link 
                        href={`/dashboard/reports/${report.REPORT_ID}`}
                        className="hover:underline font-medium text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          {report.TITLE}
                        </div>
                      </Link>
                      {report.DESCRIPTION && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          {report.DESCRIPTION}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getTypeBadgeColor(report.TYPE)}>
                        {report.TYPE}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3" />
                        <span className="line-clamp-1">{report.LOCATION}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={report.STATUS as ReportStatus} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {formatDate(report.SUBMITTED_AT)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              No reports found for this student
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}