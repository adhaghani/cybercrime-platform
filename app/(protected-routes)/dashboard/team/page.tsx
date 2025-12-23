'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users } from 'lucide-react';
import { Staff } from '@/lib/types';

interface Team {
  supervisor: Staff;
  members: Staff[];
}

export default function AllTeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/staff');
      if (!response.ok) throw new Error('Failed to fetch staff');
      
      const data = await response.json();
      const allStaff: Staff[] = data.staff || [];

      // Group staff by supervisor
      const supervisors = allStaff.filter(s => s.role === 'SUPERVISOR');
      const teamsData: Team[] = supervisors.map(supervisor => ({
        supervisor,
        members: allStaff.filter(s => s.supervisorId === supervisor.accountId && s.accountId !== supervisor.accountId),
      }));

      setTeams(teamsData);
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
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No teams found</p>
            <p className="text-sm text-muted-foreground">Teams will appear here once supervisors are assigned</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <Card key={team.supervisor.accountId}>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={team.supervisor.avatarUrl} />
                    <AvatarFallback>{getInitials(team.supervisor.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{team.supervisor.name}</CardTitle>
                    <CardDescription>{team.supervisor.department}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Badge variant="secondary">
                    <Users className="h-3 w-3 mr-1" />
                    {team.members.length} {team.members.length === 1 ? 'Member' : 'Members'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {team.members.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No team members yet</p>
                ) : (
                  <div className="space-y-3">
                    {team.members.map((member) => (
                      <div key={member.accountId} className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatarUrl} />
                          <AvatarFallback className="text-xs">
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{member.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{member.position}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {member.role}
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