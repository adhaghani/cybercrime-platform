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

interface CrimeCategoryData {
  NAME: string;
  VALUE: number;
}

interface CrimeReportCategoryPieChartProps {
  data: CrimeCategoryData[];
}

const chartConfig = {
  value: {
    label: "Reports",
  },
  THEFT: {
    label: "Theft",
    color: "var(--chart-1)",
  },
  ASSAULT: {
    label: "Assault",
    color: "var(--chart-2)",
  },
  VANDALISM: {
    label: "Vandalism",
    color: "var(--chart-3)",
  },
  HARASSMENT: {
    label: "Harassment",
    color: "var(--chart-4)",
  },
  OTHER: {
    label: "Other",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

export function CrimeReportCategoryPieChart({ data }: CrimeReportCategoryPieChartProps) {
  // Add null check to prevent undefined error
  if (!data || !Array.isArray(data)) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Type of Reports</CardTitle>
          <CardDescription>Past 30 Days</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="text-center text-muted-foreground py-8">
            No report data available to display
          </div>
        </CardContent>
      </Card>
    );
  }
  const chartData = data.map((item) => ({
    browser: item.NAME,
    visitors: item.VALUE,
    fill: `var(--color-${item.NAME})`
  }));
  
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Crime Report Category</CardTitle>
        <CardDescription>for the past 30 days</CardDescription>
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
            <Pie data={chartData} dataKey="visitors" nameKey="browser" />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Breakdown of all Crime Report Categories
        </div>
        <div className="text-muted-foreground leading-none">
          Showing all crime reports for the past 30 days
        </div>
      </CardFooter>
    </Card>
  )
}
