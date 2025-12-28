"use client"

import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts"

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

interface UserGrowthData {
  MONTH_NAME: string;
  DESKTOP: number;
}

interface UserGrowthLineChartProps {
  data: UserGrowthData[];
}

const chartConfig = {
  desktop: {
    label: "New Users",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function UserGrowthLineChart({ data }: UserGrowthLineChartProps) {
  const chartData = data.map(item => ({
    month: item.MONTH_NAME?.trim() || '',
    desktop: Number(item.DESKTOP)
  }));
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Growth Chart</CardTitle>
        <CardDescription>monthly for the past 12 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="desktop"
              type="natural"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-desktop)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
           System User Growth
        </div>
        <div className="text-muted-foreground leading-none">
          Showing trend of account creation over the past year
        </div>
      </CardFooter>
    </Card>
  )
}
