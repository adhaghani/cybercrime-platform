/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { GeneratedReportRepository } from '../repositories/GeneratedReportRepository';
import { Logger } from '../utils/Logger';

const logger = new Logger('GeneratedReportController');

export class GeneratedReportController {
  private reportRepo: GeneratedReportRepository;

  constructor() {
    this.reportRepo = new GeneratedReportRepository();
  }

  /**
   * GET /api/v2/generated-reports
   * Get all generated reports with optional filters
   */
  getAllReports = async (req: Request, res: Response): Promise<void> => {
    try {
      const { category, date_from, date_to } = req.query;

      const filters: any = {};
      if (category) filters.category = category as string;
      if (date_from) filters.dateFrom = date_from as string;
      if (date_to) filters.dateTo = date_to as string;

      const reports = await this.reportRepo.findAllWithDetails(filters);
      res.status(200).json({ success: true, data: reports });
    } catch (error: any) {
      logger.error('Get generated reports error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/generated-reports/:id
   * Get generated report by ID with full data
   */
  getReportById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const report = await this.reportRepo.findByIdWithData(Number(id));

      if (!report) {
        res.status(404).json({ success: false, error: 'Generated report not found' });
        return;
      }

      res.status(200).json({ success: true, data: report });
    } catch (error: any) {
      logger.error('Get generated report error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  };

  /**
   * POST /api/v2/generated-reports
   * Create new generated report
   */
  createReport = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        title,
        summary,
        date_range_start,
        date_range_end,
        report_category,
        report_data_type,
        report_data,
        generated_by
      } = req.body;

      if (!title || !summary || !date_range_start || !date_range_end || !report_category || !generated_by) {
        res.status(400).json({
          success: false,
          error: 'Title, summary, date range, category, and generated_by are required'
        });
        return;
      }

      const generateId = await this.reportRepo.createReport({
        GENERATED_BY: generated_by,
        TITLE: title,
        SUMMARY: summary,
        DATE_RANGE_START: date_range_start,
        DATE_RANGE_END: date_range_end,
        REPORT_CATEGORY: report_category,
        REPORT_DATA_TYPE: report_data_type,
        REPORT_DATA: report_data
      });

      res.status(201).json({
        success: true,
        message: 'Generated report created successfully',
        generate_id: generateId
      });
    } catch (error: any) {
      logger.error('Create generated report error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  };

  /**
   * DELETE /api/v2/generated-reports/:id
   * Delete generated report
   */
  deleteReport = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.reportRepo.delete(Number(id));

      res.status(200).json({
        success: true,
        message: 'Generated report deleted successfully'
      });
    } catch (error: any) {
      logger.error('Delete generated report error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  };
}
