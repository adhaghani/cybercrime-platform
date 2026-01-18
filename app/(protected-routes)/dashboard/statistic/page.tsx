/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from 'react';
import { CrimeReportCategoryPieChart } from '@/components/statistics/crimeReportCategoryPieChart';
import { FacilitySeverityPieChart } from '@/components/statistics/facilitySeverityPieChart';
import { ReportChartOverTime } from '@/components/statistics/reportChartOverTime';
import { ReportStatusPieChart } from '@/components/statistics/reportStatusPieChart';
import { ReportTypePieChart } from '@/components/statistics/reportTypePieChart';
import { UserGrowthLineChart } from '@/components/statistics/userGrowthLineChart';
import { DepartmentAssignmentEfficiencyRadarChart } from '@/components/statistics/departmentAssignmentEfficiencyRadarChart';
import { LocationHotspotBySeverityStackedChart } from '@/components/statistics/locationHotspotBySeverityStackedChart';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useHasAnyRole } from '@/hooks/use-user-role';
import { toast } from 'sonner';

interface StatisticsData {
  reportTypes: Array<{ NAME: string; VALUE: number }>;
  reportStatus: Array<{ NAME: string; VALUE: number }>;
  crimeCategories: Array<{ NAME: string; VALUE: number }>;
  facilitySeverities: Array<{ NAME: string; VALUE: number }>;
  reportsOverTime: Array<{ REPORT_DATE: string; DESKTOP: number; MOBILE: number }>;
  userGrowth: Array<{ MONTH_NAME: string; DESKTOP: number }>;
  departmentEfficiency: Array<{
    department: string;
    responseSpeed: number;
    actionRate: number;
    resolutionRate: number;
    workloadCapacity: number;
    efficiencyScore: number;
    sameDayAssignment: number;
  }>;
  locationHotspots: Array<{
    location: string;
    critical: number;
    high: number;
    medium: number;
    low: number;
    total: number;
  }>;
}

const StatisticsPage = () => {
  const [data, setData] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasAnyRole = useHasAnyRole();
  const isAdmin = hasAnyRole(['ADMIN', 'SUPERADMIN']);


  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/reports/statistics?days=30&months=12');
        
        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }
        
        const result = await response.json();
        
        // Transform backend data to frontend format
        const transformedData = {
          reportTypes: result.data?.byType ? 
            Object.entries(result.data.byType).map(([name, value]) => ({ NAME: name, VALUE: Number(value) })) : [],
          reportStatus: result.data?.byStatus ? 
            Object.entries(result.data.byStatus).map(([name, value]) => ({ NAME: name, VALUE: Number(value) })) : [],
          crimeCategories: result.data?.byCrimeCategory ? 
            Object.entries(result.data.byCrimeCategory).map(([name, value]) => ({ NAME: name, VALUE: Number(value) })) : [],
          facilitySeverities: result.data?.byFacilitySeverity ? 
            Object.entries(result.data.byFacilitySeverity).map(([name, value]) => ({ NAME: name, VALUE: Number(value) })) : [],
          reportsOverTime: result.data?.overTime?.map((item: any) => ({
            REPORT_DATE: item.report_date,
            DESKTOP: Number(item.desktop),
            MOBILE: Number(item.mobile)
          })) || [],
          userGrowth: result.data?.userGrowth?.map((item: any) => ({
            MONTH_NAME: item.month_name,
            DESKTOP: Number(item.desktop)
          })) || [],
          departmentEfficiency: result.data?.departmentEfficiency || [],
          locationHotspots: result.data?.locationHotspots || []
        };
        
        setData(transformedData);
        console.log('Statistics data fetched:', result);
        console.log('Transformed data:', transformedData);
      } catch (err) {
        toast.error("Failed to load statistics data. Please try again.");
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

      
      <DepartmentAssignmentEfficiencyRadarChart data={data.departmentEfficiency} />
      
      <LocationHotspotBySeverityStackedChart data={data.locationHotspots} />
    </div>
  );
};

export default StatisticsPage;