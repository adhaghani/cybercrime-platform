"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Shield, 
  MapPin,
  Calendar,
  Clock,
  Users
} from "lucide-react";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  Line, 
  LineChart, 
  Pie, 
  PieChart, 
  XAxis, 
  YAxis,
  Cell,
  ResponsiveContainer
} from "recharts";
import { MOCK_REPORTS } from "@/lib/api/mock-data";
import { CrimeReport } from "@/lib/types";

export default function CrimeStatisticsPage() {
  const crimeReports = MOCK_REPORTS.filter((r) => r.type === "CRIME") as CrimeReport[];

  // Category distribution
  const categoryData = [
    { category: "Theft", count: crimeReports.filter(r => r.crimeCategory === "THEFT").length, fill: "hsl(var(--chart-1))" },
    { category: "Assault", count: crimeReports.filter(r => r.crimeCategory === "ASSAULT").length, fill: "hsl(var(--chart-2))" },
    { category: "Vandalism", count: crimeReports.filter(r => r.crimeCategory === "VANDALISM").length, fill: "hsl(var(--chart-3))" },
    { category: "Harassment", count: crimeReports.filter(r => r.crimeCategory === "HARASSMENT").length, fill: "hsl(var(--chart-4))" },
    { category: "Other", count: crimeReports.filter(r => r.crimeCategory === "OTHER").length, fill: "hsl(var(--chart-5))" },
  ];

  // Status distribution
  const statusData = [
    { status: "Pending", count: crimeReports.filter(r => r.status === "PENDING").length },
    { status: "In Progress", count: crimeReports.filter(r => r.status === "IN_PROGRESS").length },
    { status: "Resolved", count: crimeReports.filter(r => r.status === "RESOLVED").length },
    { status: "Rejected", count: crimeReports.filter(r => r.status === "REJECTED").length },
  ];

  // Monthly trend (mock data for visualization)
  const monthlyData = [
    { month: "Jan", reports: 12, resolved: 8 },
    { month: "Feb", reports: 15, resolved: 10 },
    { month: "Mar", reports: 18, resolved: 14 },
    { month: "Apr", reports: 14, resolved: 11 },
    { month: "May", reports: 20, resolved: 15 },
    { month: "Jun", reports: 16, resolved: 12 },
    { month: "Jul", reports: 22, resolved: 18 },
    { month: "Aug", reports: 19, resolved: 16 },
    { month: "Sep", reports: 17, resolved: 14 },
    { month: "Oct", reports: 25, resolved: 20 },
  ];

  // Location hotspots (mock data)
  const locationData = [
    { location: "Library", count: 8 },
    { location: "Parking Lot", count: 12 },
    { location: "Cafeteria", count: 5 },
    { location: "Dormitory", count: 10 },
    { location: "Sports Complex", count: 4 },
  ];

  const totalReports = crimeReports.length;
  const resolvedReports = crimeReports.filter(r => r.status === "RESOLVED").length;
  const pendingReports = crimeReports.filter(r => r.status === "PENDING").length;
  const resolutionRate = totalReports > 0 ? ((resolvedReports / totalReports) * 100).toFixed(1) : 0;

  const chartConfig = {
    reports: {
      label: "Reports",
      color: "hsl(var(--chart-1))",
    },
    resolved: {
      label: "Resolved",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Crime Statistics</h1>
        <p className="text-muted-foreground">
          Comprehensive analytics and trends of crime reports.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReports}</div>
            <p className="text-xs text-muted-foreground">
              All time submissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{pendingReports}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting action
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{resolvedReports}</div>
            <p className="text-xs text-muted-foreground">
              Successfully closed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolutionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {resolvedReports} of {totalReports} reports
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Crime Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Crime Categories</CardTitle>
                <CardDescription>Distribution by type</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{
                  count: {
                    label: "Reports",
                    color: "hsl(var(--chart-1))",
                  },
                }} className="h-[300px]">
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Pie
                      data={categoryData}
                      dataKey="count"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Status Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Report Status</CardTitle>
                <CardDescription>Current status breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{
                  count: {
                    label: "Reports",
                    color: "hsl(var(--chart-2))",
                  },
                }} className="h-[300px]">
                  <BarChart data={statusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Category Details */}
          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>Detailed view of each crime type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryData.map((item) => (
                  <div key={item.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.fill }} />
                      <span className="font-medium">{item.category}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">{item.count} reports</Badge>
                      <span className="text-sm text-muted-foreground">
                        {totalReports > 0 ? ((item.count / totalReports) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
              <CardDescription>Crime reports and resolution over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="reports" 
                    stroke="hsl(var(--chart-1))" 
                    strokeWidth={2}
                    name="Reports"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="resolved" 
                    stroke="hsl(var(--chart-2))" 
                    strokeWidth={2}
                    name="Resolved"
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Trend Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm">+15% reports this month</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-sm">-5% resolution rate</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Peak Period</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">October (25 reports)</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Highest activity month</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Average Response</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">2.5 days</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Time to resolution</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Location Hotspots</CardTitle>
              <CardDescription>Areas with highest crime reports</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{
                count: {
                  label: "Reports",
                  color: "hsl(var(--chart-3))",
                },
              }} className="h-[400px]">
                <BarChart data={locationData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="location" type="category" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="hsl(var(--chart-3))" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location Details</CardTitle>
              <CardDescription>Breakdown by area</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {locationData.map((item, index) => (
                  <div key={item.location} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{item.location}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">{item.count} reports</Badge>
                      {index === 0 && (
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          High Risk
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
