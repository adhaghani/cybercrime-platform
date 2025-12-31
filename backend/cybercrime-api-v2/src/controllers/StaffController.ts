import { Request, Response } from 'express';
import { StaffService, CreateStaffDTO, UpdateStaffDTO, StaffSearchFilters } from '../services/StaffService';
import { Role } from '../types/enums';
import { Logger } from '../utils/Logger';

const logger = new Logger('StaffController');

export class StaffController {
  private staffService: StaffService;

  constructor(staffService: StaffService = new StaffService()) {
    this.staffService = staffService;
  }

  /**
   * GET /api/v2/staff
   * Get all staff with optional filters
   */
  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const filters: StaffSearchFilters = {
        role: req.query.role as Role | undefined,
        department: req.query.department as string | undefined
      };
      const staff = await this.staffService.getAll(filters);
      res.status(200).json({
        staff: staff.map(s => s.toJSON())
      });
    } catch (error) {
      logger.error('Get all staff error:', error);
      res.status(500).json({
        error: 'Failed to get staff',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * GET /api/v2/staff/:id
   * Get staff by account ID
   */
  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid account ID' });
        return;
      }

      const staff = await this.staffService.getById(id);
      if (!staff) {
        res.status(404).json({ error: 'Staff not found' });
        return;
      }

      res.status(200).json(staff.toJSON());
    } catch (error) {
      logger.error('Get staff by ID error:', error);
      res.status(500).json({
        error: 'Failed to get staff',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * GET /api/v2/staff/search
   * Search staff by query
   */
  search = async (req: Request, res: Response): Promise<void> => {
    try {
      const query = req.query.q as string;
      if (!query || query.trim() === '') {
        res.status(400).json({ error: 'Search query is required' });
        return;
      }

      const filters: Omit<StaffSearchFilters, 'query'> = {
        role: req.query.role as Role | undefined,
        department: req.query.department as string | undefined
      };

      const staff = await this.staffService.search(query, filters);
      res.status(200).json(staff.map(s => s.toJSON()));
    } catch (error) {
      logger.error('Search staff error:', error);
      res.status(500).json({
        error: 'Failed to search staff',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * POST /api/v2/staff
   * Create new staff record
   */
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const data: CreateStaffDTO = req.body;

      // Validate required fields
      if (!data.account_id) {
        res.status(400).json({ error: 'Account ID is required' });
        return;
      }

      if (!data.role) {
        res.status(400).json({ error: 'Role is required' });
        return;
      }

      if (!data.department) {
        res.status(400).json({ error: 'Department is required' });
        return;
      }

      if (!data.position) {
        res.status(400).json({ error: 'Position is required' });
        return;
      }

      const staff = await this.staffService.create(data);
      res.status(201).json({
        message: 'Staff created successfully',
        staff: staff.toJSON()
      });
    } catch (error) {
      logger.error('Create staff error:', error);

      if (error instanceof Error) {
        if (error.message.includes('required') || error.message.includes('Invalid')) {
          res.status(400).json({ error: error.message });
          return;
        }
        if (error.message === 'Supervisor not found') {
          res.status(404).json({ error: error.message });
          return;
        }
      }

      res.status(500).json({
        error: 'Failed to create staff',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * PUT /api/v2/staff/:id
   * Update staff information
   */
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid account ID' });
        return;
      }

      const updates: UpdateStaffDTO = req.body;

      const staff = await this.staffService.update(id, updates);
      res.status(200).json({
        message: 'Staff updated successfully',
        staff: staff.toJSON()
      });
    } catch (error) {
      logger.error('Update staff error:', error);

      if (error instanceof Error) {
        if (error.message === 'Staff not found') {
          res.status(404).json({ error: error.message });
          return;
        }
        if (error.message.includes('Invalid') || error.message.includes('Cannot set')) {
          res.status(400).json({ error: error.message });
          return;
        }
        if (error.message === 'Supervisor not found') {
          res.status(404).json({ error: error.message });
          return;
        }
      }

      res.status(500).json({
        error: 'Failed to update staff',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * DELETE /api/v2/staff/:id
   * Delete staff record
   */
  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid account ID' });
        return;
      }

      const deleted = await this.staffService.delete(id);
      if (!deleted) {
        res.status(404).json({ error: 'Staff not found' });
        return;
      }

      res.status(200).json({ message: 'Staff deleted successfully' });
    } catch (error) {
      logger.error('Delete staff error:', error);

      if (error instanceof Error && error.message === 'Staff not found') {
        res.status(404).json({ error: error.message });
        return;
      }

      res.status(500).json({
        error: 'Failed to delete staff',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * GET /api/v2/staff/role/:role
   * Get staff by role
   */
  getByRole = async (req: Request, res: Response): Promise<void> => {
    try {
      const role = req.params.role as Role;
      if (!role || !Object.values(Role).includes(role)) {
        res.status(400).json({ error: 'Invalid role' });
        return;
      }

      const staff = await this.staffService.getByRole(role);
      res.status(200).json(staff.map(s => s.toJSON()));
    } catch (error) {
      logger.error('Get staff by role error:', error);
      res.status(500).json({
        error: 'Failed to get staff by role',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * GET /api/v2/staff/department/:department
   * Get staff by department
   */
  getByDepartment = async (req: Request, res: Response): Promise<void> => {
    try {
      const department = req.params.department;
      if (!department) {
        res.status(400).json({ error: 'Department is required' });
        return;
      }

      const staff = await this.staffService.getByDepartment(department);
      res.status(200).json(staff.map(s => s.toJSON()));
    } catch (error) {
      logger.error('Get staff by department error:', error);
      res.status(500).json({
        error: 'Failed to get staff by department',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * GET /api/v2/staff/:id/subordinates
   * Get staff members supervised by this staff member
   */
  getSubordinates = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid account ID' });
        return;
      }

      const subordinates = await this.staffService.getSubordinates(id);
      res.status(200).json(subordinates.map(s => s.toJSON()));
    } catch (error) {
      logger.error('Get subordinates error:', error);
      res.status(500).json({
        error: 'Failed to get subordinates',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * GET /api/v2/staff/statistics
   * Get staff statistics
   */
  getStatistics = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.staffService.getStatistics();
      res.status(200).json(stats);
    } catch (error) {
      logger.error('Get staff statistics error:', error);
      res.status(500).json({
        error: 'Failed to get staff statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * GET /api/v2/staff/departments
   * Get all available departments
   */
  getDepartments = async (req: Request, res: Response): Promise<void> => {
    try {
      const departments = await this.staffService.getDepartments();
      res.status(200).json({ departments });
    } catch (error) {
      logger.error('Get departments error:', error);
      res.status(500).json({
        error: 'Failed to get departments',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}
