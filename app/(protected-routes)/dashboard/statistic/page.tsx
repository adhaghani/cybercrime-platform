"use client";

import React, { useEffect, useState } from 'react';
import { CrimeReportCategoryPieChart } from '@/components/statistics/crimeReportCategoryPieChart';
import { FacilitySeverityPieChart } from '@/components/statistics/facilitySeverityPieChart';
import { ReportChartOverTime } from '@/components/statistics/reportChartOverTime';
import { ReportStatusPieChart } from '@/components/statistics/reportStatusPieChart';
import { ReportTypePieChart } from '@/components/statistics/reportTypePieChart';
import { UserGrowthLineChart } from '@/components/statistics/userGrowthLineChart';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useHasAnyRole } from '@/hooks/use-user-role';

interface StatisticsData {
  reportTypes: Array<{ name: string; value: number }>;
  reportStatus: Array<{ name: string; value: number }>;
  crimeCategories: Array<{ name: string; value: number }>;
  facilitySeverities: Array<{ name: string; value: number }>;
  reportsOverTime: Array<{ report_date: string; desktop: number; mobile: number }>;
  userGrowth: Array<{ month_name: string; desktop: number }>;
}

const StatisticsPage = () => {
  const [data, setData] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasAnyRole = useHasAnyRole();
  const isAdmin = hasAnyRole(['ADMIN', 'SUPERADMIN']);
  const isSupervisor = hasAnyRole(['SUPERVISOR']);


  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/reports/statistics?days=30&months=12');
        
        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }
        
        const result = await response.json();
        setData(result);
        console.log('Statistics data fetched:', result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[300px] w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-[350px]" />
          <Skeleton className="h-[350px]" />
        </div>
        <Skeleton className="h-[300px] w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-[350px]" />
          <Skeleton className="h-[350px]" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || 'Failed to load statistics data. Please try again later.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Statistics Dashboard</h1>
      
      <ReportChartOverTime data={data.reportsOverTime} />
      
      {/* Pie Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ReportTypePieChart data={data.reportTypes} />
        <ReportStatusPieChart data={data.reportStatus} />
      </div>
      
      {isAdmin ? <UserGrowthLineChart data={data.userGrowth} /> : null}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CrimeReportCategoryPieChart data={data.crimeCategories} />
        <FacilitySeverityPieChart data={data.facilitySeverities} />
      </div>
    </div>
  );
};

export default StatisticsPage;