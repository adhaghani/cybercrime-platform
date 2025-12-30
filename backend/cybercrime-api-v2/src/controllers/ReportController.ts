/* eslint-disable @typescript-eslint/no-explicit-any */import { Request, Response } from 'express';
import { ReportService } from '../services/ReportService';
import { ReportStatus, ReportType } from '../types/enums';

export class ReportController {
  private reportService: ReportService;

  constructor() {
    this.reportService = new ReportService();
  }

  /**
   * GET /api/v2/reports
   * Get all reports with optional filters
   */
  getAllReports = async (req: Request, res: Response): Promise<void> => {
    try {
      const { type, status, submitterId, submitted_by, startDate, endDate } = req.query;

      const filters: any = {};
      if (type) filters.type = type as ReportType;
      if (status) filters.status = status as ReportStatus;
      // Accept both submitterId and submitted_by
      const submitter = submitterId || submitted_by;
      if (submitter) filters.submitterId = Number(submitter);
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);

      const reports = await this.reportService.getAllReports(filters);
      res.status(200).json({ success: true, data: reports, reports });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/reports/:id
   * Get a specific report by ID
   */
  getReportById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const report = await this.reportService.getReportById(Number(id));
      res.status(200).json({ success: true, data: report });
    } catch (error: any) {
      res.status(404).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/reports/submitter/:submitterId
   * Get all reports by a specific submitter
   */
  getReportsBySubmitter = async (req: Request, res: Response): Promise<void> => {
    try {
      const { submitterId } = req.params;
      const reports = await this.reportService.getReportsBySubmitter(Number(submitterId));
      res.status(200).json({ success: true, data: reports });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/reports/status/:status
   * Get all reports with a specific status
   */
  getReportsByStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { status } = req.params;
      const reports = await this.reportService.getReportsByStatus(status as ReportStatus);
      res.status(200).json({ success: true, data: reports });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/reports/type/:type
   * Get all reports of a specific type
   */
  getReportsByType = async (req: Request, res: Response): Promise<void> => {
    try {
      const { type } = req.params;
      const reports = await this.reportService.getReportsByType(type as ReportType);
      res.status(200).json({ success: true, data: reports });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/reports/pending
   * Get all pending reports
   */
  getPendingReports = async (req: Request, res: Response): Promise<void> => {
    try {
      const reports = await this.reportService.getPendingReports();
      res.status(200).json({ success: true, data: reports });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/reports/active
   * Get all active reports (pending, under review, in progress)
   */
  getActiveReports = async (req: Request, res: Response): Promise<void> => {
    try {
      const reports = await this.reportService.getActiveReports();
      res.status(200).json({ success: true, data: reports });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/reports/recent
   * Get recent reports
   */
  getRecentReports = async (req: Request, res: Response): Promise<void> => {
    try {
      const { limit } = req.query;
      const reports = await this.reportService.getRecentReports(limit ? Number(limit) : 10);
      res.status(200).json({ success: true, data: reports });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/reports/search
   * Search reports
   */
  searchReports = async (req: Request, res: Response): Promise<void> => {
    try {
      const { q, type, status } = req.query;

      if (!q) {
        res.status(400).json({ success: false, error: 'Search query is required' });
        return;
      }

      const filters: any = {};
      if (type) filters.type = type as ReportType;
      if (status) filters.status = status as ReportStatus;

      const reports = await this.reportService.searchReports(q as string, filters);
      res.status(200).json({ success: true, data: reports });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/reports/statistics
   * Get report statistics
   */
  getReportStatistics = async (req: Request, res: Response): Promise<void> => {
    try {
      const { startDate, endDate } = req.query;

      const options: any = {};
      if (startDate) options.startDate = new Date(startDate as string);
      if (endDate) options.endDate = new Date(endDate as string);

      const statistics = await this.reportService.getReportStatistics(options);
      res.status(200).json({ success: true, data: statistics });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * POST /api/v2/reports
   * Create a new report
   */
  createReport = async (req: Request, res: Response): Promise<void> => {
    try {
      const reportData = {
        ...req.body,
        SUBMITTER_ID: req.user?.accountId || req.body.SUBMITTER_ID
      };

      const report = await this.reportService.createReport(reportData);
      res.status(201).json({ success: true, data: report });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * PUT /api/v2/reports/:id
   * Update a report
   */
  updateReport = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const report = await this.reportService.updateReport(Number(id), req.body);
      res.status(200).json({ success: true, data: report });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * PATCH /api/v2/reports/:id/status
   * Update report status
   */
  updateReportStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        res.status(400).json({ success: false, error: 'Status is required' });
        return;
      }

      const report = await this.reportService.updateReportStatus(Number(id), status);
      res.status(200).json({ success: true, data: report });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * DELETE /api/v2/reports/:id
   * Delete a report
   */
  deleteReport = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.reportService.deleteReport(Number(id));
      res.status(200).json({ success: true, message: 'Report deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * POST /api/v2/reports/bulk-update-status
   * Bulk update report statuses
   */
  bulkUpdateStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { reportIds, status } = req.body;

      if (!reportIds || !Array.isArray(reportIds) || reportIds.length === 0) {
        res.status(400).json({ success: false, error: 'Report IDs array is required' });
        return;
      }

      if (!status) {
        res.status(400).json({ success: false, error: 'Status is required' });
        return;
      }

      const updatedCount = await this.reportService.bulkUpdateStatus(reportIds, status);
      res.status(200).json({
        success: true,
        message: `Updated ${updatedCount} of ${reportIds.length} reports`
      });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/reports/with-details
   * Get reports with their type-specific details (CRIME or FACILITY)
   */
  getReportsWithDetails = async (req: Request, res: Response): Promise<void> => {
    try {
      const { type } = req.query;

      if (!type || (type !== 'CRIME' && type !== 'FACILITY')) {
        res.status(400).json({ 
          success: false, 
          error: 'Type parameter is required and must be either CRIME or FACILITY' 
        });
        return;
      }

      const reports = await this.reportService.getReportsWithDetails(type as 'CRIME' | 'FACILITY');
      res.status(200).json({ success: true, data: reports });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };
}
