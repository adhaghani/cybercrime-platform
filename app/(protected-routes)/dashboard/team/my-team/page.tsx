'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, Mail, Phone } from 'lucide-react';
import { Staff } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { generateMetadata } from '@/lib/seo';

interface MyTeamResponse {
  currentUser: Staff;
  supervisor: Staff | null;
  teamMembers: Staff[];
  teamSize: number;
}

export default function MyTeamPage() {
  const [currentUser, setCurrentUser] = useState<Staff | null>(null);
  const [supervisor, setSupervisor] = useState<Staff | null>(null);
  const [teamMembers, setTeamMembers] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyTeam();
  }, []);

  const fetchMyTeam = async () => {
    try {
      const response = await fetch('/api/teams/my-team');
      if (!response.ok) throw new Error('Failed to fetch team');
      
      const data: MyTeamResponse = await response.json();
      setCurrentUser(data.currentUser);
      setSupervisor(data.supervisor);
      setTeamMembers(data.teamMembers || []);
    } catch (error) {
      console.error('Failed to fetch team:', error);
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

  if (!currentUser?.SUPERVISOR_ID && currentUser?.ROLE !== 'SUPERVISOR') {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No Team Assigned</p>
            <p className="text-sm text-muted-foreground">You are not assigned to any team yet</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  generateMetadata({
    title: "My Team - Cybercrime Reporting Platform",
    description: "View your team members and supervisor on the Cybercrime Reporting Platform.",
    canonical: "/dashboard/team/my-team",
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Team</h1>
          <p className="text-muted-foreground">
            {currentUser?.ROLE === 'SUPERVISOR'
              ? 'Team members under your supervision'
              : `Your team members under ${supervisor?.NAME || 'your supervisor'}`}
          </p>
        </div>
        {currentUser?.ROLE === 'SUPERVISOR' && (
          <Link href="/dashboard/user-management/staff/add">
            <Button>Add Team Member</Button>
          </Link>
        )}
      </div>

      {/* Supervisor Card */}
      {supervisor && currentUser?.ROLE !== 'SUPERVISOR' && (
        <Card>
          <CardHeader>
            <CardTitle>Supervisor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={supervisor.AVATAR_URL} />
                <AvatarFallback>{getInitials(supervisor.NAME)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{supervisor.NAME}</h3>
                <p className="text-sm text-muted-foreground">{supervisor.POSITION}</p>
                <p className="text-sm text-muted-foreground">{supervisor.DEPARTMENT}</p>
                <div className="flex gap-4 mt-2">
                  {supervisor.EMAIL && (
                    <div className="flex items-center gap-1 text-sm">
                      <Mail className="h-3 w-3" />
                      <span>{supervisor.EMAIL}</span>
                    </div>
                  )}
                  {supervisor.CONTACT_NUMBER && (
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3" />
                      <span>{supervisor.CONTACT_NUMBER}</span>
                    </div>
                  )}
                </div>
              </div>
              <Badge>{supervisor.ROLE}</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            {teamMembers.length} {teamMembers.length === 1 ? 'member' : 'members'} in your team
          </CardDescription>
        </CardHeader>
        <CardContent>
          {teamMembers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">
                {currentUser?.ROLE === 'SUPERVISOR'
                  ? 'No team members yet. Add members to get started.'
                  : 'No other team members yet'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member) => (
                <Card key={member.ACCOUNT_ID}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={member.AVATAR_URL} />
                        <AvatarFallback>{getInitials(member.NAME)}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <h4 className="font-semibold">{member.NAME}</h4>
                        <p className="text-sm text-muted-foreground">{member.POSITION}</p>
                        <p className="text-xs text-muted-foreground">{member.DEPARTMENT}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline">{member.ROLE}</Badge>
                      </div>
                      {(member.EMAIL || member.CONTACT_NUMBER) && (
                        <div className="space-y-1 pt-2 text-xs text-muted-foreground">
                          {member.EMAIL && (
                            <div className="flex items-center gap-1 justify-center">
                              <Mail className="h-3 w-3" />
                              <span>{member.EMAIL}</span>
                            </div>
                          )}
                          {member.CONTACT_NUMBER && (
                            <div className="flex items-center gap-1 justify-center">
                              <Phone className="h-3 w-3" />
                              <span>{member.CONTACT_NUMBER}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}