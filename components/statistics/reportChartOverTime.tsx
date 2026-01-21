"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

interface ReportOverTimeData {
  REPORT_DATE: string;
  DESKTOP: number;
  // MOBILE: number;
}

interface ReportChartOverTimeProps {
  data: ReportOverTimeData[];
}

const chartConfig = {
  views: {
    label: "Reports",
  },
  DESKTOP: {
    label: "Crime",
    color: "var(--chart-2)",
  },
  // MOBILE: {
  //   label: "Facility",
  //   color: "var(--chart-1)",
  // },
} satisfies ChartConfig

export function ReportChartOverTime({ data }: ReportChartOverTimeProps) {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("DESKTOP")

  // Add null check to prevent undefined error
  if (!data || !Array.isArray(data)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reports Over Time</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            No report data available to display
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map(item => ({
    date: item.REPORT_DATE,
    DESKTOP: Number(item.DESKTOP),
    // MOBILE: Number(item.MOBILE)
  }));

  const total = React.useMemo(
    () => ({
      DESKTOP: chartData.reduce((acc, curr) => acc + Number(curr.DESKTOP), 0),
      // MOBILE: chartData.reduce((acc, curr) => acc + Number(curr.MOBILE), 0),
    }),
    [chartData]
  )

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
          <CardTitle>Reports Over Time</CardTitle>
          <CardDescription>
            Showing total Reports in the past 30 days
          </CardDescription>
        </div>
        <div className="flex">
          {["DESKTOP"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
