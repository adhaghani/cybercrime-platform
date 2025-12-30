/* eslint-disable @typescript-eslint/no-explicit-any */
import { Report } from '../models/Report';
import { ReportRepository } from '../repositories/ReportRepository';
import { ReportStatus, ReportType } from '../types/enums';

export class ReportService {
  private reportRepo: ReportRepository;

  constructor() {
    this.reportRepo = new ReportRepository();
  }

  async getAllReports(filters?: {
    type?: ReportType;
    status?: ReportStatus;
    submitterId?: number;
    startDate?: Date;
    endDate?: Date;
  }): Promise<Report[]> {
    return await this.reportRepo.findAll(filters);
  }

  async getReportById(id: number): Promise<Report> {
    const report = await this.reportRepo.findById(id);
    if (!report) {
      throw new Error('Report not found');
    }
    return report;
  }

  async getReportsBySubmitter(submitterId: number): Promise<Report[]> {
    return await this.reportRepo.findBySubmitter(submitterId);
  }

  async getReportsByStatus(status: ReportStatus): Promise<Report[]> {
    return await this.reportRepo.findByStatus(status);
  }

  async getReportsByType(type: ReportType): Promise<Report[]> {
    return await this.reportRepo.findByType(type);
  }

  async createReport(reportData: any): Promise<Report> {
    // Validate required fields
    if (!reportData.REPORT_TYPE || !reportData.TITLE || !reportData.DESCRIPTION) {
      throw new Error('Report type, title, and description are required');
    }

    if (!reportData.INCIDENT_DATE) {
      throw new Error('Incident date is required');
    }

    // Validate incident date is not in the future
    if (new Date(reportData.INCIDENT_DATE) > new Date()) {
      throw new Error('Incident date cannot be in the future');
    }

    // Validate report type
    if (!Object.values(ReportType).includes(reportData.REPORT_TYPE)) {
      throw new Error('Invalid report type');
    }

    const report = new Report({
      SUBMITTED_BY: reportData.SUBMITTER_ID,
      TITLE: reportData.TITLE,
      DESCRIPTION: reportData.DESCRIPTION,
      LOCATION: reportData.LOCATION || '',
      STATUS: ReportStatus.PENDING,
      TYPE: reportData.REPORT_TYPE
    });

    // Create the report with crime/facility specific data
    const crimeOrFacilityData = reportData.REPORT_TYPE === 'CRIME' 
      ? {
          CRIME_CATEGORY: reportData.CRIME_CATEGORY,
          SUSPECT_DESCRIPTION: reportData.SUSPECT_DESCRIPTION,
          VICTIM_INVOLVED: reportData.VICTIM_INVOLVED,
          WEAPON_INVOLVED: reportData.WEAPON_INVOLVED,
          INJURY_LEVEL: reportData.INJURY_LEVEL,
          EVIDENCE_DETAILS: reportData.EVIDENCE_DETAILS
        }
      : {
          FACILITY_TYPE: reportData.FACILITY_TYPE,
          SEVERITY_LEVEL: reportData.SEVERITY_LEVEL,
          AFFECTED_EQUIPMENT: reportData.AFFECTED_EQUIPMENT
        };

    return await this.reportRepo.create(report, crimeOrFacilityData);
  }

  async updateReport(id: number, updates: {
    TITLE?: string;
    DESCRIPTION?: string;
    INCIDENT_DATE?: Date;
    LOCATION?: string;
    ANONYMOUS?: boolean;
  }): Promise<Report> {
    const report = await this.getReportById(id);

    // Validate incident date if provided
    if (updates.INCIDENT_DATE) {
      if (new Date(updates.INCIDENT_DATE) > new Date()) {
        throw new Error('Incident date cannot be in the future');
      }
    }

    // Only allow updates if report is in PENDING status
    if (report.getStatus() !== ReportStatus.PENDING) {
      throw new Error('Can only update reports in PENDING status');
    }

    return await this.reportRepo.update(id, updates);
  }

  async updateReportStatus(id: number, status: ReportStatus): Promise<Report> {
    // Validate status
    if (!Object.values(ReportStatus).includes(status)) {
      throw new Error('Invalid report status');
    }

    const report = await this.getReportById(id);
    const currentStatus = report.getStatus();

    // Validate status transitions
    const validTransitions: Record<ReportStatus, ReportStatus[]> = {
      [ReportStatus.PENDING]: [ReportStatus.UNDER_REVIEW, ReportStatus.REJECTED],
      [ReportStatus.UNDER_REVIEW]: [ReportStatus.IN_PROGRESS, ReportStatus.REJECTED],
      [ReportStatus.IN_PROGRESS]: [ReportStatus.RESOLVED, ReportStatus.UNDER_REVIEW],
      [ReportStatus.RESOLVED]: [ReportStatus.CLOSED],
      [ReportStatus.REJECTED]: [],
      [ReportStatus.CLOSED]: []
    };

    if (!validTransitions[currentStatus].includes(status)) {
      throw new Error(`Cannot transition from ${currentStatus} to ${status}`);
    }

    return await this.reportRepo.updateStatus(id, status);
  }

  async deleteReport(id: number): Promise<boolean> {
    const report = await this.getReportById(id);

    // Only allow deletion of reports in PENDING or REJECTED status
    if (![ReportStatus.PENDING, ReportStatus.REJECTED].includes(report.getStatus())) {
      throw new Error('Can only delete reports in PENDING or REJECTED status');
    }

    return await this.reportRepo.delete(id);
  }

  async searchReports(query: string, filters?: {
    type?: ReportType;
    status?: ReportStatus;
  }): Promise<Report[]> {
    return await this.reportRepo.search(query, filters);
  }

  async getReportStatistics(options?: {
    startDate?: Date;
    endDate?: Date;
  }): Promise<any> {
    return await this.reportRepo.getStatistics(options);
  }

  async getRecentReports(limit: number = 10): Promise<Report[]> {
    const allReports = await this.reportRepo.findAll();
    return allReports.slice(0, limit);
  }

  async getPendingReports(): Promise<Report[]> {
    return await this.reportRepo.findByStatus(ReportStatus.PENDING);
  }

  async getActiveReports(): Promise<Report[]> {
    const activeStatuses = [
      ReportStatus.PENDING,
      ReportStatus.UNDER_REVIEW,
      ReportStatus.IN_PROGRESS
    ];

    const filters: any = {};
    const allReports: Report[] = [];

    for (const status of activeStatuses) {
      const reports = await this.reportRepo.findByStatus(status);
      allReports.push(...reports);
    }

    return allReports;
  }

  async getReportsByDateRange(startDate: Date, endDate: Date): Promise<Report[]> {
    // Validate date range
    if (startDate > endDate) {
      throw new Error('Start date must be before end date');
    }

    return await this.reportRepo.findAll({
      startDate,
      endDate
    });
  }

  async bulkUpdateStatus(reportIds: number[], status: ReportStatus): Promise<number> {
    let updatedCount = 0;

    for (const id of reportIds) {
      try {
        await this.updateReportStatus(id, status);
        updatedCount++;
      } catch (error) {
        // Continue with other reports if one fails
        console.error(`Failed to update report ${id}:`, error);
      }
    }

    return updatedCount;
  }

  async getReportsWithDetails(type: 'CRIME' | 'FACILITY'): Promise<any[]> {
    return await this.reportRepo.findReportsWithDetails(type);
  }

  async getUserReportsWithDetails(submitterId: number, type?: 'CRIME' | 'FACILITY'): Promise<any[]> {
    return await this.reportRepo.findUserReportsWithDetails(submitterId, type);
  }
}
