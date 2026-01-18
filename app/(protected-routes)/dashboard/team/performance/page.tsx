"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { TeamPerformanceBarChart } from '@/components/statistics/teamPerformanceBarChart'
import { 
  Users, 
  Target, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Activity,
  Trophy,
  BarChart3
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface TeamPerformanceMetrics {
  TEAM_ID: number
  SUPERVISOR_NAME: string
  DEPARTMENT: string
  POSITION: string
  SUPERVISOR_EMAIL: string
  TEAM_SIZE: number
  TOTAL_CASES: number
  RESOLVED_CASES: number
  ACTIVE_CASES: number
  RESOLUTION_RATE_PCT: number
  AVG_RESOLUTION_DAYS: number
  AVG_RESPONSE_DAYS: number
  WORKLOAD_PER_MEMBER: number
  PERFORMANCE_SCORE: number
  FIRST_ASSIGNMENT_DATE: string
  LAST_ASSIGNMENT_DATE: string
  TEAM_STATUS: 'OVERLOADED' | 'BUSY' | 'MODERATE' | 'LIGHT' | 'AVAILABLE'
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'OVERLOADED':
      return 'bg-red-500 text-white'
    case 'BUSY':
      return 'bg-orange-500 text-white'
    case 'MODERATE':
      return 'bg-yellow-500 text-white'
    case 'LIGHT':
      return 'bg-blue-500 text-white'
    case 'AVAILABLE':
      return 'bg-green-500 text-white'
    default:
      return 'bg-gray-500 text-white'
  }
}

const getPerformanceLevel = (score: number) => {
  if (score >= 80) return { label: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-50' }
  if (score >= 60) return { label: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-50' }
  if (score >= 40) return { label: 'Average', color: 'text-yellow-600', bgColor: 'bg-yellow-50' }
  return { label: 'Needs Improvement', color: 'text-red-600', bgColor: 'bg-red-50' }
}

export default function TeamPerformancePage() {
  const [metrics, setMetrics] = useState<TeamPerformanceMetrics[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPerformanceMetrics()
  }, [])

  const fetchPerformanceMetrics = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/teams/performance-metrics')
      
      if (!response.ok) {
        throw new Error('Failed to fetch team performance metrics')
      }

      const data = await response.json()
      setMetrics(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const topPerformers = metrics.slice(0, 3)
  const totalTeams = metrics.length
  const avgPerformanceScore = metrics.reduce((sum, m) => sum + m.PERFORMANCE_SCORE, 0) / (totalTeams || 1)
  const totalActiveCases = metrics.reduce((sum, m) => sum + m.ACTIVE_CASES, 0)
  const avgResolutionRate = metrics.reduce((sum, m) => sum + m.RESOLUTION_RATE_PCT, 0) / (totalTeams || 1)

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Data</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Team Performance Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive performance analytics and metrics for all teams
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTeams}</div>
            <p className="text-xs text-muted-foreground">Active teams monitored</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgPerformanceScore.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Out of 100 points</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActiveCases}</div>
            <p className="text-xs text-muted-foreground">Across all teams</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Resolution Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgResolutionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Success rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      {topPerformers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Top Performing Teams
            </CardTitle>
            <CardDescription>Teams with the highest performance scores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((team, index) => {
                const perfLevel = getPerformanceLevel(team.PERFORMANCE_SCORE)
                return (
                  <div
                    key={team.TEAM_ID}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-lg border",
                      perfLevel.bgColor
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border-2">
                        <span className="text-sm font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-semibold">{team.SUPERVISOR_NAME}</div>
                        <div className="text-sm text-muted-foreground">
                          {team.DEPARTMENT} • {team.TEAM_SIZE} members
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={cn("text-2xl font-bold", perfLevel.color)}>
                        {team.PERFORMANCE_SCORE.toFixed(1)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {team.RESOLUTION_RATE_PCT.toFixed(0)}% resolved
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Chart */}
      <TeamPerformanceBarChart data={metrics} />

      {/* Detailed Team Cards */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          <h2 className="text-2xl font-bold">All Teams</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {metrics.map((team) => {
            const perfLevel = getPerformanceLevel(team.PERFORMANCE_SCORE)
            return (
              <Card key={team.TEAM_ID} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{team.SUPERVISOR_NAME}</CardTitle>
                      <CardDescription>{team.POSITION}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(team.TEAM_STATUS)}>
                      {team.TEAM_STATUS}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Performance Score */}
                  <div className={cn("p-3 rounded-lg", perfLevel.bgColor)}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Performance Score</span>
                      <span className={cn("text-2xl font-bold", perfLevel.color)}>
                        {team.PERFORMANCE_SCORE.toFixed(1)}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {perfLevel.label}
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>Team Size</span>
                      </div>
                      <div className="font-semibold">{team.TEAM_SIZE} members</div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Activity className="h-3 w-3" />
                        <span>Active Cases</span>
                      </div>
                      <div className="font-semibold">{team.ACTIVE_CASES}</div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Resolved</span>
                      </div>
                      <div className="font-semibold">{team.RESOLUTION_RATE_PCT.toFixed(0)}%</div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Avg Resolution</span>
                      </div>
                      <div className="font-semibold">{team.AVG_RESOLUTION_DAYS.toFixed(1)} days</div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <TrendingUp className="h-3 w-3" />
                        <span>Workload/Member</span>
                      </div>
                      <div className="font-semibold">{team.WORKLOAD_PER_MEMBER.toFixed(1)}</div>
                    </div>
                  </div>

                  {/* Department Badge */}
                  <div className="pt-2 border-t">
                    <Badge variant="outline">{team.DEPARTMENT}</Badge>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}