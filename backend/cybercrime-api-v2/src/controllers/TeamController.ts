/* eslint-disable @typescript-eslint/no-explicit-any */import { Request, Response } from 'express';
import { TeamService } from '../services/TeamService';

export class TeamController {
  private teamService: TeamService;

  constructor() {
    this.teamService = new TeamService();
  }

  /**
   * GET /api/v2/teams
   * Get all teams
   */
  getAllTeams = async (req: Request, res: Response): Promise<void> => {
    try {
      const teams = await this.teamService.getAllTeams();
      res.status(200).json({ success: true, data: teams });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/teams/:id
   * Get a specific team by ID
   */
  getTeamById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const team = await this.teamService.getTeamById(Number(id));
      res.status(200).json({ success: true, data: team });
    } catch (error: any) {
      res.status(404).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/teams/lead/:leadId
   * Get all teams led by a specific person
   */
  getTeamsByLead = async (req: Request, res: Response): Promise<void> => {
    try {
      const { leadId } = req.params;
      const teams = await this.teamService.getTeamsByLead(Number(leadId));
      res.status(200).json({ success: true, data: teams });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/teams/:id/members
   * Get all members of a team
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
   * Search teams
   */
  searchTeams = async (req: Request, res: Response): Promise<void> => {
    try {
      const { q } = req.query;

      if (!q) {
        res.status(400).json({ success: false, error: 'Search query is required' });
        return;
      }

      const teams = await this.teamService.searchTeams(q as string);
      res.status(200).json({ success: true, data: teams });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * POST /api/v2/teams
   * Create a new team
   */
  createTeam = async (req: Request, res: Response): Promise<void> => {
    try {
      const team = await this.teamService.createTeam(req.body);
      res.status(201).json({ success: true, data: team });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * PUT /api/v2/teams/:id
   * Update a team
   */
  updateTeam = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const team = await this.teamService.updateTeam(Number(id), req.body);
      res.status(200).json({ success: true, data: team });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * DELETE /api/v2/teams/:id
   * Delete a team
   */
  deleteTeam = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.teamService.deleteTeam(Number(id));
      res.status(200).json({ success: true, message: 'Team deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * POST /api/v2/teams/:id/members
   * Add a member to a team
   */
  addMember = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { memberId } = req.body;

      if (!memberId) {
        res.status(400).json({ success: false, error: 'Member ID is required' });
        return;
      }

      await this.teamService.addMember(Number(id), Number(memberId));
      res.status(200).json({ success: true, message: 'Member added successfully' });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * DELETE /api/v2/teams/:id/members/:memberId
   * Remove a member from a team
   */
  removeMember = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, memberId } = req.params;
      await this.teamService.removeMember(Number(id), Number(memberId));
      res.status(200).json({ success: true, message: 'Member removed successfully' });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * PATCH /api/v2/teams/:id/lead
   * Change team lead
   */
  changeTeamLead = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { newLeadId } = req.body;

      if (!newLeadId) {
        res.status(400).json({ success: false, error: 'New lead ID is required' });
        return;
      }

      const team = await this.teamService.changeTeamLead(Number(id), Number(newLeadId));
      res.status(200).json({ success: true, data: team });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * POST /api/v2/teams/:id/members/bulk
   * Bulk add members to a team
   */
  bulkAddMembers = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { memberIds } = req.body;

      if (!memberIds || !Array.isArray(memberIds) || memberIds.length === 0) {
        res.status(400).json({ success: false, error: 'Member IDs array is required' });
        return;
      }

      const result = await this.teamService.bulkAddMembers(Number(id), memberIds);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };
}
