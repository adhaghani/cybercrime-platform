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

interface ReportTypeData {
  NAME: string;
  VALUE: number;
}

interface ReportTypePieChartProps {
  data: ReportTypeData[];
}

const chartConfig = {
  VALUE: {
    label: "Reports",
  },
  CRIME: {
    label: "Crime",
    color: "var(--chart-1)",
  },
  FACILITY: {
    label: "Facility",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ReportTypePieChart({ data }: ReportTypePieChartProps) {
  const chartData = data.map((item, index) => ({
    name: item.NAME,
    report: item.VALUE,
    fill: `var(--color-${item.NAME})`
  }));
  
  const total = data.reduce((acc, curr) => acc + curr.VALUE, 0);
  
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Type of Reports</CardTitle>
        <CardDescription>Past 30 Days</CardDescription>
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
            <Pie data={chartData} dataKey="report" nameKey="name" />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Breakdown of Crime and Facility Reports
        </div>
        <div className="text-muted-foreground leading-none">
          for a total of {total} reports for the past 30 days
        </div>
      </CardFooter>
    </Card>
  )
}
