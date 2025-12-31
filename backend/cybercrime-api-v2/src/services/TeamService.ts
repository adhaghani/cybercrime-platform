/* eslint-disable @typescript-eslint/no-explicit-any */
import { Team } from '../models/Team';
import { StaffData } from '../models/Staff';
import { TeamRepository } from '../repositories/TeamRepository';

/**
 * TeamService - Business logic for team operations
 * Teams are based on hierarchical Staff relationships (supervisor -> team members)
 */
export class TeamService {
  private teamRepo: TeamRepository;

  constructor() {
    this.teamRepo = new TeamRepository();
  }

  /**
   * Get all teams (all supervisors with their team members)
   */
  async getAllTeams(): Promise<Team[]> {
    return await this.teamRepo.getAllTeams();
  }

  /**
   * Get a team by supervisor ID
   */
  async getTeamById(supervisorId: number): Promise<Team> {
    const team = await this.teamRepo.getTeamBySupervisorId(supervisorId);
    if (!team) {
      throw new Error('Team not found');
    }
    return team;
  }

  /**
   * Get teams led by a specific supervisor (alias for getTeamById for API compatibility)
   */
  async getTeamsByLead(leadId: number): Promise<Team[]> {
    const team = await this.teamRepo.getTeamBySupervisorId(leadId);
    return team ? [team] : [];
  }

  /**
   * Get the current user's team
   */
  async getMyTeam(accountId: number): Promise<any> {
    const myTeam = await this.teamRepo.getMyTeam(accountId);
    if (!myTeam) {
      throw new Error('User not found');
    }
    return myTeam;
  }

  /**
   * Get all members of a team (by supervisor ID)
   */
  async getTeamMembers(supervisorId: number): Promise<StaffData[]> {
    return await this.teamRepo.getTeamMembers(supervisorId);
  }

  /**
   * Search teams by supervisor name, department, or position
   */
  async searchTeams(query: string): Promise<Team[]> {
    if (!query || query.trim() === '') {
      return await this.getAllTeams();
    }
    return await this.teamRepo.searchTeams(query);
  }

  /**
   * Get statistics for all teams
   */
  async getAllTeamsStatistics(): Promise<any> {
    const teams = await this.getAllTeams();
    
    const stats = {
      totalTeams: teams.length,
      totalMembers: 0,
      averageTeamSize: 0,
      largestTeam: { supervisor: '', size: 0 },
      smallestTeam: { supervisor: '', size: Number.MAX_SAFE_INTEGER },
      teamsByDepartment: {} as Record<string, number>
    };

    teams.forEach(team => {
      const teamSize = team.getTeamSize();
      stats.totalMembers += teamSize;

      if (teamSize > stats.largestTeam.size) {
        stats.largestTeam = {
          supervisor: team.getSupervisorName(),
          size: teamSize
        };
      }

      if (teamSize < stats.smallestTeam.size) {
        stats.smallestTeam = {
          supervisor: team.getSupervisorName(),
          size: teamSize
        };
      }

      const department = team.getSupervisor().getDepartment();
      stats.teamsByDepartment[department] = (stats.teamsByDepartment[department] || 0) + 1;
    });

    stats.averageTeamSize = teams.length > 0 ? stats.totalMembers / teams.length : 0;

    // Handle case where no teams exist
    if (teams.length === 0) {
      stats.smallestTeam = { supervisor: 'N/A', size: 0 };
    }

    return stats;
  }

  /**
   * Get statistics for a specific team
   */
  async getTeamStatistics(supervisorId: number): Promise<any> {
    const team = await this.getTeamById(supervisorId);
    const members = team.getMembers();

    const stats = {
      supervisorId,
      supervisorName: team.getSupervisorName(),
      teamSize: team.getTeamSize(),
      membersByRole: {} as Record<string, number>,
      membersByDepartment: {} as Record<string, number>
    };

    members.forEach(member => {
      // Count by role
      const role = member.getRole();
      stats.membersByRole[role] = (stats.membersByRole[role] || 0) + 1;

      // Count by department
      const department = member.getDepartment();
      stats.membersByDepartment[department] = (stats.membersByDepartment[department] || 0) + 1;
    });

    return stats;
  }
}
