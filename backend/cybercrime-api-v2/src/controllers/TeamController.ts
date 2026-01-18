/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { TeamService } from '../services/TeamService';

/**
 * TeamController - Handles team-related HTTP requests
 * Teams are based on hierarchical Staff relationships (supervisor -> team members)
 */
export class TeamController {
  private teamService: TeamService;

  constructor() {
    this.teamService = new TeamService();
  }

  /**
   * GET /api/v2/teams
   * Get all teams (all supervisors with their team members)
   */
  getAllTeams = async (req: Request, res: Response): Promise<void> => {
    try {
      const teams = await this.teamService.getAllTeams();
      res.status(200).json({ success: true, teams: teams.map(t => t.toJSON()) });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/teams/:id
   * Get a specific team by supervisor ID
   */
  getTeamById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const team = await this.teamService.getTeamById(Number(id));
      res.status(200).json({ success: true, data: team.toJSON() });
    } catch (error: any) {
      res.status(404).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/teams/lead/:leadId
   * Get all teams led by a specific supervisor
   */
  getTeamsByLead = async (req: Request, res: Response): Promise<void> => {
    try {
      const { leadId } = req.params;
      const teams = await this.teamService.getTeamsByLead(Number(leadId));
      res.status(200).json({ success: true, teams: teams.map(t => t.toJSON()) });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/teams/my-team
   * Get the current user's team
   */
  getMyTeam = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.accountId || (req as any).user?.ACCOUNT_ID || (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({ success: false, error: 'User not authenticated' });
        return;
      }

      const myTeam = await this.teamService.getMyTeam(userId);
      res.status(200).json({ success: true, ...myTeam });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/teams/:id/members
   * Get all members of a team (by supervisor ID)
   */
  getTeamMembers = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const members = await this.teamService.getTeamMembers(Number(id));
      res.status(200).json({ success: true, data: members });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/teams/:id/statistics
   * Get statistics for a specific team
   */
  getTeamStatistics = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const statistics = await this.teamService.getTeamStatistics(Number(id));
      res.status(200).json({ success: true, data: statistics });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/teams/statistics/all
   * Get statistics for all teams
   */
  getAllTeamsStatistics = async (req: Request, res: Response): Promise<void> => {
    try {
      const statistics = await this.teamService.getAllTeamsStatistics();
      res.status(200).json({ success: true, data: statistics });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/teams/search
   * Search teams by supervisor name, department, or position
   */
  searchTeams = async (req: Request, res: Response): Promise<void> => {
    try {
      const { q } = req.query;

      if (!q) {
        res.status(400).json({ success: false, error: 'Search query is required' });
        return;
      }

      const teams = await this.teamService.searchTeams(q as string);
      res.status(200).json({ success: true, teams: teams.map(t => t.toJSON()) });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /** GET /api/v2/teams/performance-metrics/all
   * Get performance metrics for all teams
   */
  getAllTeamPerformanceMetrics = async (req: Request, res: Response): Promise<void> => {
    try {
      const metrics = await this.teamService.getAllTeamPerformanceMetrics();
      res.status(200).json({ success: true, data: metrics });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
}
