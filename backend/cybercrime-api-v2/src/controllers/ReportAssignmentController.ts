/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { ReportAssignmentRepository } from '../repositories/ReportAssignmentRepository';
import { Logger } from '../utils/Logger';

const logger = new Logger('ReportAssignmentController');

export class ReportAssignmentController {
  private assignmentRepo: ReportAssignmentRepository;

  constructor() {
    this.assignmentRepo = new ReportAssignmentRepository();
  }

  /**
   * GET /api/v2/report-assignments
   * Get all assignments with details
   */
  getAllAssignments = async (req: Request, res: Response): Promise<void> => {
    try {
      const assignments = await this.assignmentRepo.findAllWithDetails();
      res.status(200).json({ success: true, data: assignments });
    } catch (error: any) {
      logger.error('Get all assignments error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/report-assignments/by-staff/:staffId
   * Get assignments for a specific staff member
   */
  getAssignmentsByStaff = async (req: Request, res: Response): Promise<void> => {
    try {
      const { staffId } = req.params;
      const assignments = await this.assignmentRepo.findByStaffId(Number(staffId));
      res.status(200).json({ success: true, data: assignments });
    } catch (error: any) {
      logger.error('Get assignments by staff error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/report-assignments/by-report/:reportId
   * Get assignments for a specific report
   */
  getAssignmentsByReport = async (req: Request, res: Response): Promise<void> => {
    try {
      const { reportId } = req.params;
      const assignments = await this.assignmentRepo.findByReportId(Number(reportId));
      res.status(200).json({ success: true, data: assignments });
    } catch (error: any) {
      logger.error('Get assignments by report error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/report-assignments/my-assignments
   * Get assignments for the current user
   */
  getMyAssignments = async (req: Request, res: Response): Promise<void> => {
    try {
      const accountId = (req as any).user?.accountId;
      
      if (!accountId) {
        res.status(401).json({ success: false, error: 'Not authenticated' });
        return;
      }

      const assignments = await this.assignmentRepo.findByStaffId(accountId);
      res.status(200).json({ success: true, data: assignments });
    } catch (error: any) {
      logger.error('Get my assignments error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  };

  /**
   * POST /api/v2/report-assignments
   * Create new assignment
   */
  createAssignment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { account_id, report_id, action_taken, additional_feedback } = req.body;

      if (!account_id || !report_id) {
        res.status(400).json({ success: false, error: 'Account ID and Report ID are required' });
        return;
      }

      const assignmentId = await this.assignmentRepo.createAssignment({
        ACCOUNT_ID: account_id,
        REPORT_ID: report_id,
        ACTION_TAKEN: action_taken,
        ADDITIONAL_FEEDBACK: additional_feedback
      });

      res.status(201).json({
        success: true,
        message: 'Report assignment created successfully',
        assignment_id: assignmentId
      });
    } catch (error: any) {
      logger.error('Create assignment error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  };

  /**
   * PUT /api/v2/report-assignments/:id
   * Update assignment
   */
  updateAssignment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updates = req.body;

      await this.assignmentRepo.updateAssignment(Number(id), updates);
      
      res.status(200).json({
        success: true,
        message: 'Assignment updated successfully'
      });
    } catch (error: any) {
      logger.error('Update assignment error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  };

  /**
   * PUT /api/v2/report-assignments/bulk-update
   * Bulk update assignments
   */
  bulkUpdateAssignments = async (req: Request, res: Response): Promise<void> => {
    try {
      const { ids, updates } = req.body;

      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        res.status(400).json({ success: false, error: 'IDs array is required' });
        return;
      }

      const updatedCount = await this.assignmentRepo.bulkUpdate(ids, updates);
      
      res.status(200).json({
        success: true,
        message: `Updated ${updatedCount} of ${ids.length} assignments`
      });
    } catch (error: any) {
      logger.error('Bulk update assignments error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  };

  /**
   * DELETE /api/v2/report-assignments/:id
   * Delete assignment
   */
  deleteAssignment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.assignmentRepo.delete(Number(id));
      
      res.status(200).json({
        success: true,
        message: 'Assignment deleted successfully'
      });
    } catch (error: any) {
      logger.error('Delete assignment error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  };
}
