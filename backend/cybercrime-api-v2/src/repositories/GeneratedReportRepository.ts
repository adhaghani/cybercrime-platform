/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseRepository } from './base/BaseRepository';
import { GeneratedReport, GeneratedReportData } from '../models/GeneratedReport';
import oracledb from 'oracledb';

export class GeneratedReportRepository extends BaseRepository<GeneratedReport> {
  constructor() {
    super('GENERATED_REPORT', 'GENERATE_ID');
  }

  protected toModel(row: any): GeneratedReport {
    return new GeneratedReport(row);
  }

  /**
   * Find all generated reports with filters
   */
  async findAllWithDetails(filters?: {
    category?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<any[]> {
    const whereClauses: string[] = [];
    const binds: any = {};

    if (filters?.category) {
      whereClauses.push('gr.REPORT_CATEGORY = :category');
      binds.category = filters.category;
    }
    if (filters?.dateFrom) {
      whereClauses.push('gr.REQUESTED_AT >= TO_TIMESTAMP(:date_from, \'YYYY-MM-DD\')');
      binds.date_from = filters.dateFrom;
    }
    if (filters?.dateTo) {
      whereClauses.push('gr.REQUESTED_AT <= TO_TIMESTAMP(:date_to, \'YYYY-MM-DD\')');
      binds.date_to = filters.dateTo;
    }

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const sql = `
      SELECT gr.GENERATE_ID, gr.GENERATED_BY, gr.TITLE, gr.SUMMARY, 
             gr.DATE_RANGE_START, gr.DATE_RANGE_END, gr.REPORT_CATEGORY, 
             gr.REPORT_DATA_TYPE, gr.REQUESTED_AT,
             a.NAME as GENERATED_BY_NAME, a.EMAIL as GENERATED_BY_EMAIL
      FROM ${this.tableName} gr
      JOIN ACCOUNT a ON gr.GENERATED_BY = a.ACCOUNT_ID
      ${whereClause}
      ORDER BY gr.REQUESTED_AT DESC
    `;

    const result: any = await this.execute(sql, binds);
    return result.rows;
  }

  /**
   * Find generated report by ID with full details including data
   */
  async findByIdWithData(id: number): Promise<any> {
    const sql = `
      SELECT gr.GENERATE_ID, gr.GENERATED_BY, gr.TITLE, gr.SUMMARY, 
             gr.DATE_RANGE_START, gr.DATE_RANGE_END, gr.REPORT_CATEGORY, 
             gr.REPORT_DATA_TYPE, gr.REPORT_DATA, gr.REQUESTED_AT,
             a.NAME as GENERATED_BY_NAME, a.EMAIL as GENERATED_BY_EMAIL
      FROM ${this.tableName} gr
      JOIN ACCOUNT a ON gr.GENERATED_BY = a.ACCOUNT_ID
      WHERE gr.GENERATE_ID = :id
    `;

    const result: any = await this.execute(sql, { id });

    if (result.rows.length === 0) return null;

    const report = result.rows[0];

    // Parse JSON data if present
    if (report.REPORT_DATA) {
      try {
        report.REPORT_DATA = JSON.parse(report.REPORT_DATA);
      } catch (e) {
        // Keep as string if not valid JSON
      }
    }

    return report;
  }

  /**
   * Create new generated report
   */
  async createReport(data: GeneratedReportData): Promise<number> {
    const sql = `
      INSERT INTO ${this.tableName} (
        GENERATE_ID, GENERATED_BY, TITLE, SUMMARY, DATE_RANGE_START, 
        DATE_RANGE_END, REPORT_CATEGORY, REPORT_DATA_TYPE, REPORT_DATA, REQUESTED_AT
      ) VALUES (
        generate_seq.NEXTVAL, :generated_by, :title, :summary, 
        TO_TIMESTAMP(:date_start, 'YYYY-MM-DD'), 
        TO_TIMESTAMP(:date_end, 'YYYY-MM-DD'),
        :category, :data_type, :data, SYSTIMESTAMP
      ) RETURNING GENERATE_ID INTO :id
    `;

    const reportDataString = data.REPORT_DATA ? JSON.stringify(data.REPORT_DATA) : null;

    const binds = {
      generated_by: data.GENERATED_BY,
      title: data.TITLE,
      summary: data.SUMMARY,
      date_start: data.DATE_RANGE_START instanceof Date 
        ? data.DATE_RANGE_START.toISOString().split('T')[0]
        : data.DATE_RANGE_START,
      date_end: data.DATE_RANGE_END instanceof Date
        ? data.DATE_RANGE_END.toISOString().split('T')[0]
        : data.DATE_RANGE_END,
      category: data.REPORT_CATEGORY,
      data_type: data.REPORT_DATA_TYPE || 'JSON',
      data: reportDataString ? { val: reportDataString, type: oracledb.CLOB } : null,
      id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
    };

    const result: any = await this.execute(sql, binds, { autoCommit: true });
    return result.outBinds.id[0];
  }

  /**
   * Create method (required by BaseRepository)
   */
  async create(report: GeneratedReport): Promise<GeneratedReport> {
    const id = await this.createReport({
      GENERATED_BY: report.getGeneratedBy(),
      TITLE: report.getTitle(),
      SUMMARY: report.getSummary(),
      DATE_RANGE_START: report.getDateRangeStart(),
      DATE_RANGE_END: report.getDateRangeEnd(),
      REPORT_CATEGORY: report.getReportCategory(),
      REPORT_DATA_TYPE: report.getReportDataType(),
      REPORT_DATA: report.getReportData()
    });

    const created = await this.findById(id);
    if (!created) {
      throw new Error('Failed to create generated report');
    }
    return created;
  }

  /**
   * Update method (required by BaseRepository)
   */
  async update(id: string | number, updates: Partial<GeneratedReportData>): Promise<GeneratedReport> {
    const setClauses: string[] = [];
    const binds: any = { id };

    if (updates.TITLE) {
      setClauses.push('TITLE = :title');
      binds.title = updates.TITLE;
    }
    if (updates.SUMMARY) {
      setClauses.push('SUMMARY = :summary');
      binds.summary = updates.SUMMARY;
    }

    if (setClauses.length === 0) {
      const existing = await this.findById(id);
      if (!existing) {
        throw new Error('Generated report not found');
      }
      return existing;
    }

    const sql = `
      UPDATE ${this.tableName}
      SET ${setClauses.join(', ')}
      WHERE ${this.primaryKey} = :id
    `;

    await this.execute(sql, binds, { autoCommit: true });

    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('Failed to update generated report');
    }
    return updated;
  }
}
