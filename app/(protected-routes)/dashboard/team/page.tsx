'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users } from 'lucide-react';
import { Staff } from '@/lib/types';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

interface Team {
  supervisor: Staff;
  members: Staff[];
  teamSize: number;
}

interface TeamsResponse {
  teams: Team[];
}

export default function AllTeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams');
      if (!response.ok) throw new Error('Failed to fetch teams');
      
      const data: TeamsResponse = await response.json();
      setTeams(data.teams || []);
    } catch (error) {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

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
        <div className="grid gap-6 md:grid-cols-2">
          {teams.map((team) => (
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
      )}
    </div>
  );
}