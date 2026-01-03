'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, ChevronLeft, ChevronRight, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Staff } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { generateMetadata } from '@/lib/seo';
import { toast } from 'sonner';
interface Team {
  supervisor: Staff;
  members: Staff[];
  teamSize: number;
  statistics?: {
    totalReports: number;
    assignedReports: number;
    resolvedReports: number;
    pendingReports: number;
    inProgressReports: number;
  };
}

interface TeamsResponse {
  teams: Team[];
}

export default function AllTeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const teamsPerPage = 6;

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/teams');
      if (!response.ok) throw new Error('Failed to fetch teams');
      
      const data: TeamsResponse = await response.json();
      setTeams(data.teams || []);
    } catch (error) {
      toast.error("Failed to fetch teams. Please try again.");
      console.error('Failed to fetch teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Pagination calculations
  const totalPages = Math.ceil(teams.length / teamsPerPage);
  const startIndex = (currentPage - 1) * teamsPerPage;
  const endIndex = startIndex + teamsPerPage;
  const currentTeams = teams.slice(startIndex, endIndex);

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (loading) {
    return (
      <>
      <div className="space-y-4">
        <Skeleton className="h-12 w-1/3 rounded-md" />
        <Skeleton className="h-8 w-1/2 rounded-md" />
        <Skeleton className="h-32 w-full rounded-md" />
        <Skeleton className="h-[400px] w-full rounded-md" />
      </div>
      </>
    );
  }

  generateMetadata({
    title: "Teams - Cybercrime Reporting Platform",
    description: "View all teams and their members organized by supervisor on the Cybercrime Reporting Platform.",
    canonical: "/dashboard/team",
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">All Teams</h1>
        <p className="text-muted-foreground">View all teams and their members organized by supervisor</p>
      </div>

      {teams.length === 0 ? (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Users />
        </EmptyMedia>
        <EmptyTitle>No Teams currently available</EmptyTitle>
        <EmptyDescription>
          The system currently has no teams. try adding staff and assigning them to supervisor to form a team.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            {currentTeams.map((team) => (
            <Card key={team.supervisor.ACCOUNT_ID}>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={team.supervisor.AVATAR_URL} />
                    <AvatarFallback>{getInitials(team.supervisor.NAME)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{team.supervisor.NAME}&apos;s Team</CardTitle>
                    <CardDescription>{team.supervisor.DEPARTMENT}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Badge variant="secondary">
                    <Users className="h-3 w-3 mr-1" />
                    {team.teamSize} {team.teamSize === 1 ? 'Member' : 'Members'}
                  </Badge>
                </div>

                {/* Team Statistics */}
                {team.statistics && (
                  <div className="grid grid-cols-2 gap-2 pt-4 border-t mt-4">
                    <Card className="flex  gap-2 text-sm">
                      
                      <CardContent className='flex items-center gap-4 '>
                        <FileText className="size-5 text-muted-foreground" />
                        <div className=''>
                        <p className="text-lg font-semibold">{team.statistics.totalReports}</p>
                        <p className="text-muted-foreground">Total Reports</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="flex  gap-2 text-sm">
        
                      <CardContent className='flex items-center gap-4  '>
                          <CheckCircle className="size-5 text-green-600" />
                        <div>
                        <p className="text-lg font-semibold">{team.statistics.resolvedReports}</p>
                        <p className="text-muted-foreground">Resolved</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="flex  gap-2 text-sm">
                      
                      <CardContent className='flex items-center gap-4 '>
                        <Clock className="size-5 text-blue-600" />
                        <div>
                        <p className="text-lg font-semibold">{team.statistics.inProgressReports}</p>
                        <p className="text-muted-foreground">In Progress</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="flex  gap-2 text-sm">
                      
                      <CardContent className='flex items-center gap-4 '>
                        <AlertCircle className="size-5 text-yellow-600" />
                        <div>
                        <p className="text-lg font-semibold">{team.statistics.pendingReports}</p>
                        <p className="text-muted-foreground">Pending</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {team.members.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No team members yet</p>
                ) : (
                  <div className="space-y-3">
                    {team.members.map((member) => (
                      <div key={member.ACCOUNT_ID} className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.AVATAR_URL} />
                          <AvatarFallback className="text-xs">
                            {getInitials(member.NAME)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{member.NAME}</p>
                          <p className="text-xs text-muted-foreground truncate">{member.POSITION}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {member.ROLE}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t pt-4">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, teams.length)} of {teams.length} teams
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(page)}
                    className="w-9"
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
        </>
      )}
    </div>
  );
}