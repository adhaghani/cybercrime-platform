"use client"

import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

interface ReportStatusData {
  NAME: string;
  VALUE: number;
}

interface ReportStatusPieChartProps {
  data: ReportStatusData[];
}

const chartConfig = {
  value: {
    label: "Reports",
  },
  PENDING: {
    label: "Pending",
    color: "var(--chart-1)",
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "var(--chart-2)",
  },
  RESOLVED: {
    label: "Resolved",
    color: "var(--chart-3)",
  },
  REJECTED: {
    label: "Rejected",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig

export function ReportStatusPieChart({ data }: ReportStatusPieChartProps) {
  const chartData = data.map((item) => ({
    browser: item.NAME,
    reports: item.VALUE,
    fill: `var(--color-${item.NAME})`
  }));
  
  const total = data.reduce((acc, curr) => acc + curr.VALUE, 0);
  
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Report Status Breakdown</CardTitle>
        <CardDescription>past 30 days</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie data={chartData} dataKey="reports" nameKey="browser" />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Breakdown of all Report Status
        </div>
        <div className="text-muted-foreground leading-none">
            for a total of {total} reports for the past 30 days
        </div>
      </CardFooter>
    </Card>
  )
}
