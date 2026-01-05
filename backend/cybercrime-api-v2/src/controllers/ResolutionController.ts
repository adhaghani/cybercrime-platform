/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { ResolutionRepository } from '../repositories/ResolutionRepository';
import { ReportRepository } from '../repositories/ReportRepository';
import { Logger } from '../utils/Logger';
import { ResolutionType, ReportStatus } from '../types/enums';

const logger = new Logger('ResolutionController');

export class ResolutionController {
  private resolutionRepo: ResolutionRepository;
  private reportRepo: ReportRepository;

  constructor() {
    this.resolutionRepo = new ResolutionRepository();
    this.reportRepo = new ReportRepository();
  }

  /**
   * POST /api/v2/resolutions
   * Create a new resolution and update report status
   */
  createResolution = async (req: Request, res: Response): Promise<void> => {
    try {
      const { reportId, resolutionType, resolutionSummary, evidencePath } = req.body;
      const resolvedBy = (req as any).user?.accountId;

      console.log('Create resolution called:', { reportId, resolutionType, resolutionSummary, evidencePath, resolvedBy });

      if (!reportId || !resolutionType || !resolutionSummary) {
        res.status(400).json({ 
          success: false, 
          error: 'Report ID, resolution type, and resolution summary are required' 
        });
        return;
      }

      if (!resolvedBy) {
        res.status(401).json({ success: false, error: 'Not authenticated' });
        return;
      }

      // Validate resolution type
      if (!Object.values(ResolutionType).includes(resolutionType)) {
        res.status(400).json({ 
          success: false, 
          error: `Invalid resolution type. Valid types: ${Object.values(ResolutionType).join(', ')}` 
        });
        return;
      }

      // Check if report exists
      const report = await this.reportRepo.findById(Number(reportId));
      if (!report) {
        res.status(404).json({ success: false, error: 'Report not found' });
        return;
      }

      // Create resolution with minimal required fields
      const resolutionData = {
        REPORT_ID: Number(reportId),
        RESOLVED_BY: resolvedBy,
        RESOLUTION_TYPE: resolutionType,
        EVIDENCE_PATH: evidencePath,
        RESOLUTION_SUMMARY: resolutionSummary
      };

      console.log('Creating resolution with data:', resolutionData);

      const resolutionId = await this.resolutionRepo.createResolution(resolutionData);

      // Update report status to RESOLVED
      await this.reportRepo.updateStatus(Number(reportId), ReportStatus.RESOLVED);

      res.status(201).json({
        success: true,
        message: 'Report resolved successfully',
        resolution_id: resolutionId
      });
    } catch (error: any) {
      console.error('Create resolution error:', error);
      logger.error('Create resolution error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/resolutions
   * Get all resolutions
   */
  getAllResolutions = async (req: Request, res: Response): Promise<void> => {
    try {
      const resolutions = await this.resolutionRepo.findAll();
      res.status(200).json({ success: true, data: resolutions });
    } catch (error: any) {
      logger.error('Get all resolutions error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/resolutions/:reportId
   * Get resolutions for a specific report
   */
  getResolutionsByReport = async (req: Request, res: Response): Promise<void> => {
    try {
      const { reportId } = req.params;
      const resolutions = await this.resolutionRepo.findByReportId(Number(reportId));
      res.status(200).json({ success: true, data: resolutions });
    } catch (error: any) {
      logger.error('Get resolutions by report error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  };
}
