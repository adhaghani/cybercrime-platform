/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Briefcase, AlertTriangle, Clock, CheckCircle2, TrendingUp, Calendar, Hourglass, AlertCircle } from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface StaffWorkloadDialogProps {
  staffId: string;
  staffName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type workloadDataType = {
    ACCOUNT_ID: number;
    STAFF_NAME: string;
    ROLE: string;
    DEPARTMENT: string;
    ACTIVE_CASES: number;
    NO_ACTION_CASES: number;
    OVERDUE_CASES: number;
    URGENT_CASES: number;
    RECENT_ASSIGNMENTS: number;
    AVG_CASE_AGE_DAYS: number;
    OLDEST_CASE_DAYS: number;
    AVG_DAYS_SINCE_ASSIGNMENT: number;
    STALE_NO_ACTION_CASES: number;
    WORKLOAD_PRESSURE_SCORE: number;
    WORKLOAD_STATUS: string;
}

export function StaffWorkloadDialog({
  staffId,
  staffName,
  open,
  onOpenChange,
}: StaffWorkloadDialogProps) {
  const [loading, setLoading] = useState(false);
  const [workloadData, setWorkloadData] = useState<workloadDataType | null>(null);

  useEffect(() => {
    if (open) {
      fetchWorkloadData();
    }
  }, [open]);

  const fetchWorkloadData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/staff/${staffId}/workload`);
      if (response.ok) {
        const data = await response.json();
        setWorkloadData(data[0]);
      } else {
        toast.error('Failed to fetch workload data.');
      }
    } catch (error) {
      toast.error('An error occurred while fetching workload data.');
    } finally {
      setLoading(false);
    }
  };


  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'CRITICAL':
        return 'destructive';
      case 'HIGH':
        return 'default';
      case 'MODERATE':
        return 'secondary';
      case 'LOW':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const MetricCard = ({ icon: Icon, label, value, className = '' }: { icon: any; label: string; value: number | string; className?: string }) => (
    <div className={`flex items-start space-x-3 p-4 rounded-lg border bg-card ${className}`}>
      <div className="mt-0.5">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Workload for {staffName}</DialogTitle>
          <DialogDescription>
            Review the current workload metrics for this staff member.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
            </div>
          ) : workloadData ? (
            <div className="space-y-6">
              {/* Status Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Overall Status</span>
                    <Badge variant={getStatusColor(workloadData.WORKLOAD_STATUS)} className="text-sm">
                      {workloadData.WORKLOAD_STATUS}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Workload Pressure Score</span>
                      <span className="font-semibold">{workloadData.WORKLOAD_PRESSURE_SCORE}/100</span>
                    </div>
                    <Progress value={workloadData.WORKLOAD_PRESSURE_SCORE} className="h-3" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Role</p>
                      <p className="font-medium">{workloadData.ROLE}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Department</p>
                      <p className="font-medium">{workloadData.DEPARTMENT}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Active Cases Grid */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Case Overview</h3>
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                  <MetricCard 
                    icon={Briefcase} 
                    label="Active Cases" 
                    value={workloadData.ACTIVE_CASES}
                  />
                  <MetricCard 
                    icon={AlertTriangle} 
                    label="Urgent Cases" 
                    value={workloadData.URGENT_CASES}
                    className={workloadData.URGENT_CASES > 0 ? 'border-orange-500/50 bg-orange-50 dark:bg-orange-950/20' : ''}
                  />
                  <MetricCard 
                    icon={AlertCircle} 
                    label="Overdue Cases" 
                    value={workloadData.OVERDUE_CASES}
                    className={workloadData.OVERDUE_CASES > 0 ? 'border-red-500/50 bg-red-50 dark:bg-red-950/20' : ''}
                  />
                  <MetricCard 
                    icon={Clock} 
                    label="No Action Cases" 
                    value={workloadData.NO_ACTION_CASES}
                  />
                </div>
              </div>

              {/* Time Metrics */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Time Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                  <MetricCard 
                    icon={Calendar} 
                    label="Avg Case Age" 
                    value={`${workloadData.AVG_CASE_AGE_DAYS} days`}
                  />
                  <MetricCard 
                    icon={Hourglass} 
                    label="Oldest Case" 
                    value={`${workloadData.OLDEST_CASE_DAYS} days`}
                  />
                  <MetricCard 
                    icon={TrendingUp} 
                    label="Avg Since Assignment" 
                    value={`${workloadData.AVG_DAYS_SINCE_ASSIGNMENT} days`}
                  />
                  <MetricCard 
                    icon={CheckCircle2} 
                    label="Recent Assignments" 
                    value={workloadData.RECENT_ASSIGNMENTS}
                  />
                </div>
              </div>

              {/* Additional Metrics */}
              {workloadData.STALE_NO_ACTION_CASES > 0 && (
                <Card className="border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                      <div>
                        <p className="font-medium">Stale No Action Cases</p>
                        <p className="text-2xl font-bold">{workloadData.STALE_NO_ACTION_CASES}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Cases pending action for an extended period
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No workload data available</p>
              <p className="text-sm text-muted-foreground mt-1">
                Unable to retrieve workload metrics for this staff member.
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}