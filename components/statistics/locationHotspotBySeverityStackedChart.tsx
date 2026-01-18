"use client"

import { MapPin, AlertTriangle } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

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

interface LocationHotspot {
  location: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
  total: number;
}

interface Props {
  data: LocationHotspot[];
}

const chartConfig = {
  critical: {
    label: "Critical",
    color: "hsl(var(--destructive))",
  },
  high: {
    label: "High/Severe",
    color: "hsl(var(--orange))",
  },
  medium: {
    label: "Medium/Moderate",
    color: "hsl(var(--warning))",
  },
  low: {
    label: "Low/Minor",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function LocationHotspotBySeverityStackedChart({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location Hotspots by Severity
          </CardTitle>
          <CardDescription>No location data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const criticalLocations = data.filter(loc => loc.critical > 0);
  const totalCritical = data.reduce((sum, loc) => sum + loc.critical, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Location Hotspots by Severity
        </CardTitle>
        <CardDescription>
          Top {data.length} locations with most reports (stacked by severity level)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="location"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={90}
              tickFormatter={(value) => value.length > 15 ? value.slice(0, 12) + '...' : value}
            />
            <XAxis type="number" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="critical"
              stackId="a"
              fill="#ff4d6d"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="high"
              stackId="a"
              fill="#ff914d"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="medium"
              stackId="a"
              fill="#ffd24d"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="low"
              stackId="a"
              fill="#a3d977"
              radius={[0, 0, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <div className="flex-col items-start gap-2 text-sm p-6 pt-0">
        {criticalLocations.length > 0 && (
          <div className="flex gap-2 leading-none font-medium items-center text-destructive">
            <AlertTriangle className="h-4 w-4" />
            {totalCritical} critical incident{totalCritical !== 1 ? 's' : ''} across {criticalLocations.length} location{criticalLocations.length !== 1 ? 's' : ''}
          </div>
        )}
        <div className="text-muted-foreground leading-none mt-2">
          Locations with 3+ reports. Showing severity distribution
        </div>
      </div>
    </Card>
  )
}
