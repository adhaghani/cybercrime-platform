"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
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

interface TeamPerformanceData {
  TEAM_ID: number
  SUPERVISOR_NAME: string
  DEPARTMENT: string
  PERFORMANCE_SCORE: number
  RESOLUTION_RATE_PCT: number
  TEAM_STATUS: string
}

interface TeamPerformanceBarChartProps {
  data: TeamPerformanceData[]
  title?: string
  description?: string
}

const chartConfig = {
  performanceScore: {
    label: "Performance Score",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function TeamPerformanceBarChart({ 
  data, 
  title = "Team Performance Scores",
  description = "Overall performance ranking of all teams"
}: TeamPerformanceBarChartProps) {
  const chartData = data.slice(0, 10).map((team) => ({
    name: team.SUPERVISOR_NAME,
    performanceScore: Number(team.PERFORMANCE_SCORE),
    department: team.DEPARTMENT,
    status: team.TEAM_STATUS,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              right: 12,
              left: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                const parts = value.split(' ')
                return parts.length > 2 ? `${parts[0]} ${parts[1]}` : value
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, 100]}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="performanceScore"
              fill="var(--color-performanceScore)"
              radius={8}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
