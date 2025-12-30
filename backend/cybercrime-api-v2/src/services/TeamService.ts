/* eslint-disable @typescript-eslint/no-explicit-any */
import { Team } from '../models/Team';
import { TeamRepository } from '../repositories/TeamRepository';

export class TeamService {
  private teamRepo: TeamRepository;

  constructor() {
    this.teamRepo = new TeamRepository();
  }

  async getAllTeams(): Promise<Team[]> {
    return await this.teamRepo.findAll();
  }

  async getTeamById(id: number): Promise<Team> {
    const team = await this.teamRepo.findById(id);
    if (!team) {
      throw new Error('Team not found');
    }
    return team;
  }

  async getTeamsByLead(leadId: number): Promise<Team[]> {
    return await this.teamRepo.findByTeamLead(leadId);
  }

  async createTeam(teamData: {
    TEAM_NAME: string;
    TEAM_LEAD_ID?: number;
    DESCRIPTION?: string;
  }): Promise<Team> {
    // Validate required fields
    if (!teamData.TEAM_NAME || teamData.TEAM_NAME.trim() === '') {
      throw new Error('Team name is required');
    }

    // Check if team name already exists
    const existingTeam = await this.teamRepo.findByName(teamData.TEAM_NAME);
    if (existingTeam) {
      throw new Error('A team with this name already exists');
    }

    const team = new Team({
      TEAM_NAME: teamData.TEAM_NAME,
      TEAM_LEAD_ID: teamData.TEAM_LEAD_ID,
      DESCRIPTION: teamData.DESCRIPTION
    });

    return await this.teamRepo.create(team);
  }

  async updateTeam(id: number, updates: {
    TEAM_NAME?: string;
    TEAM_LEAD_ID?: number;
    DESCRIPTION?: string;
  }): Promise<Team> {
    const team = await this.getTeamById(id);

    // Check if new name conflicts with existing team
    if (updates.TEAM_NAME) {
      const existingTeam = await this.teamRepo.findByName(updates.TEAM_NAME);
      if (existingTeam && existingTeam.getTeamId() !== id) {
        throw new Error('A team with this name already exists');
      }
    }

    return await this.teamRepo.update(id, updates);
  }

  async deleteTeam(id: number): Promise<boolean> {
    await this.getTeamById(id); // Verify team exists
    return await this.teamRepo.delete(id);
  }

  async getTeamMembers(teamId: number): Promise<any[]> {
    await this.getTeamById(teamId); // Verify team exists
    return await this.teamRepo.getTeamMembers(teamId);
  }

  async addMember(teamId: number, memberId: number): Promise<boolean> {
    // Verify team exists
    await this.getTeamById(teamId);

    // Add member
    const added = await this.teamRepo.addMember(teamId, memberId);
    if (!added) {
      throw new Error('Member is already part of this team');
    }

    return true;
  }

  async removeMember(teamId: number, memberId: number): Promise<boolean> {
    // Verify team exists
    const team = await this.getTeamById(teamId);

    // Don't allow removing team lead
    if (team.getTeamLeadId() === memberId) {
      throw new Error('Cannot remove team lead from team members');
    }

    const removed = await this.teamRepo.removeMember(teamId, memberId);
    if (!removed) {
      throw new Error('Member is not part of this team');
    }

    return true;
  }

  async searchTeams(query: string): Promise<Team[]> {
    if (!query || query.trim() === '') {
      return await this.getAllTeams();
    }
    return await this.teamRepo.search(query);
  }

  async getTeamStatistics(teamId: number): Promise<any> {
    const team = await this.getTeamById(teamId);
    const members = await this.getTeamMembers(teamId);

    return {
      teamId: team.getTeamId(),
      teamName: team.getTeamName(),
      leadName: team.getTeamLeadName(),
      memberCount: members.length,
      members: members.map(m => ({
        memberId: m.MEMBER_ID,
        name: m.NAME,
        email: m.EMAIL,
        role: m.ROLE,
        position: m.POSITION,
        joinedAt: m.JOINED_AT
      }))
    };
  }

  async getAllTeamsStatistics(): Promise<any> {
    const teams = await this.getAllTeams();
    
    const statistics = await Promise.all(
      teams.map(async (team) => {
        const members = await this.getTeamMembers(team.getTeamId()!);
        return {
          teamId: team.getTeamId(),
          teamName: team.getTeamName(),
          leadName: team.getTeamLeadName(),
          memberCount: members.length
        };
      })
    );

    return {
      totalTeams: teams.length,
      totalMembers: statistics.reduce((sum, team) => sum + team.memberCount, 0),
      averageTeamSize: teams.length > 0
        ? statistics.reduce((sum, team) => sum + team.memberCount, 0) / teams.length
        : 0,
      teams: statistics
    };
  }

  async changeTeamLead(teamId: number, newLeadId: number): Promise<Team> {
    const team = await this.getTeamById(teamId);
    const members = await this.getTeamMembers(teamId);

    // Check if new lead is a member of the team
    const isMember = members.some(m => m.MEMBER_ID === newLeadId);
    if (!isMember) {
      throw new Error('New lead must be a member of the team');
    }

    return await this.teamRepo.update(teamId, { TEAM_LEAD_ID: newLeadId });
  }

  async bulkAddMembers(teamId: number, memberIds: number[]): Promise<{
    added: number[];
    failed: number[];
  }> {
    await this.getTeamById(teamId); // Verify team exists

    const added: number[] = [];
    const failed: number[] = [];

    for (const memberId of memberIds) {
      try {
        const success = await this.teamRepo.addMember(teamId, memberId);
        if (success) {
          added.push(memberId);
        } else {
          failed.push(memberId);
        }
      } catch (error) {
        failed.push(memberId);
      }
    }

    return { added, failed };
  }
}
