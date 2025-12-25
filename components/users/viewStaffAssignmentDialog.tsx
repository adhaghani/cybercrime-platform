'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, FileText, Calendar, AlertCircle, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatusBadge from '@/components/ui/statusBadge';
import Link from 'next/link';
import { ReportStatus } from '@/lib/types';

interface ViewStaffAssignmentDialogProps {
  accountId: string | null;
  staffName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Assignment {
  ASSIGNMENT_ID: string;
  REPORT_ID: string;
  REPORT_TITLE: string;
  REPORT_TYPE: string;
  REPORT_STATUS: string;
  ASSIGNED_AT: string;
  ACTION_TAKEN?: string;
  ADDITIONAL_FEEDBACK?: string;
  UPDATED_AT: string;
}

export function ViewStaffAssignmentDialog({ 
  accountId, 
  staffName = 'this staff member',
  open, 
  onOpenChange 
}: ViewStaffAssignmentDialogProps) {
  const [loading, setLoading] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    if (open && accountId) {
      fetchAssignments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, accountId]);

  const fetchAssignments = async () => {
    if (!accountId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/report-assignments/by-staff/${accountId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch assignments');
      }
      
      const data = await response.json();
      setAssignments(data);
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
      toast.error('Failed to load staff assignments');
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Staff Assignments
          </DialogTitle>
          <DialogDescription>
            View all report assignments for {staffName}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : assignments.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Total Assignments: <span className="font-semibold text-foreground">{assignments.length}</span>
              </p>
            </div>

            <Separator />

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.map((assignment) => (
                  <TableRow key={assignment.ASSIGNMENT_ID}>
                    <TableCell>
                      <Link 
                        href={`/dashboard/reports/${assignment.REPORT_ID}`}
                        className="hover:underline font-medium text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          {assignment.REPORT_TITLE}
                        </div>
                      </Link>
                      <p className="text-xs text-muted-foreground mt-1">
                        ID: {assignment.REPORT_ID}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getTypeBadgeColor(assignment.REPORT_TYPE)}>
                        {assignment.REPORT_TYPE}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={assignment.REPORT_STATUS as ReportStatus} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {formatDate(assignment.ASSIGNED_AT)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {assignment.ACTION_TAKEN ? (
                        <div className="text-sm">
                          <p className="font-medium line-clamp-1">{assignment.ACTION_TAKEN}</p>
                          {assignment.ADDITIONAL_FEEDBACK && (
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {assignment.ADDITIONAL_FEEDBACK}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">No action taken</span>
                      )}
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
              No assignments found for this staff member
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}