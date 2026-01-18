"use client"

import { Activity } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

interface DepartmentEfficiency {
  department: string;
  responseSpeed: number;
  actionRate: number;
  resolutionRate: number;
  workloadCapacity: number;
  efficiencyScore: number;
  sameDayAssignment: number;
}

interface Props {
  data: DepartmentEfficiency[];
}

export function DepartmentAssignmentEfficiencyRadarChart({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader className="items-center pb-4">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Department Efficiency
          </CardTitle>
          <CardDescription>
            No department efficiency data available
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Transform data for radar chart - create comparison metrics across departments
  const radarData = [
    {
      metric: "Response Speed",
      ...data.reduce((acc, dept) => ({ ...acc, [dept.department]: dept.responseSpeed }), {})
    },
    {
      metric: "Action Rate",
      ...data.reduce((acc, dept) => ({ ...acc, [dept.department]: dept.actionRate }), {})
    },
    {
      metric: "Resolution Rate",
      ...data.reduce((acc, dept) => ({ ...acc, [dept.department]: dept.resolutionRate }), {})
    },
    {
      metric: "Workload Capacity",
      ...data.reduce((acc, dept) => ({ ...acc, [dept.department]: dept.workloadCapacity }), {})
    },
    {
      metric: "Same-Day Assignment",
      ...data.reduce((acc, dept) => ({ ...acc, [dept.department]: dept.sameDayAssignment }), {})
    }
  ];

  // Create dynamic chart config for departments
  const departmentConfig = data.reduce((acc, dept, index) => ({
    ...acc,
    [dept.department]: {
      label: dept.department,
      color: `var(--chart-${index+1})`,
    }
  }), {} as ChartConfig);

  const topDepartment = data.reduce((prev, current) => 
    (current.efficiencyScore > prev.efficiencyScore) ? current : prev
  );

  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle className="flex items-center gap-2">
          Department Efficiency Comparison
        </CardTitle>
        <CardDescription>
          Comparing {data.length} departments across 5 key metrics (0-100 scale)
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={departmentConfig}
          className="mx-auto aspect-square max-h-[400px]"
        >
          <RadarChart data={radarData}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <PolarAngleAxis dataKey="metric" />
            <PolarGrid />
            <ChartLegend content={<ChartLegendContent />} />
            {data.map((dept, index) => (
              <Radar
                key={dept.department}
                dataKey={dept.department}
                stroke={`var(--chart-${(index % 5) + 1})`}
                fill={`var(--chart-${(index % 5) + 1})`}
                fillOpacity={index === 0 ? 0.6 : 0.3}
              />
            ))}
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <div className="flex-col gap-2 text-sm p-6 pt-0">
        <div className="flex items-center gap-2 leading-none font-medium text-sm">
          Top Performer: {topDepartment.department} (Efficiency: {topDepartment.efficiencyScore.toFixed(1)}%)
        </div>
        <div className="text-muted-foreground text-xs mt-2">
          Metrics: Response speed, action rate, resolution rate, workload capacity, and same-day assignments
        </div>
      </div>
    </Card>
  )
}
