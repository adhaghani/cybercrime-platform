/* eslint-disable @typescript-eslint/no-explicit-any */
import { Resolution } from '../models/Resolution';
import { BaseRepository } from './base/BaseRepository';
import { ResolutionType } from '../types/enums';
import oracledb from 'oracledb';

export class ResolutionRepository extends BaseRepository<Resolution> {
  protected tableName = 'RESOLUTION';

  constructor() {
    super('RESOLUTION', 'RESOLUTION_ID');
  }

  protected toModel(row: any): Resolution {
    return new Resolution({
      RESOLUTION_ID: row.RESOLUTION_ID,
      REPORT_ID: row.REPORT_ID,
      RESOLVED_BY: row.RESOLVED_BY,
      RESOLUTION_TYPE: row.RESOLUTION_TYPE as ResolutionType,
      RESOLUTION_NOTES: row.RESOLUTION_NOTES,
      RESOLVED_AT: row.RESOLVED_AT,
      // Include related data from JOINs
      REPORT_TITLE: row.REPORT_TITLE,
      RESOLVED_BY_NAME: row.RESOLVED_BY_NAME
    });
  }

  async findAll(): Promise<Resolution[]> {
    const sql = `
      SELECT res.*,
             r.TITLE as REPORT_TITLE,
             a.NAME as RESOLVED_BY_NAME
      FROM ${this.tableName} res
      JOIN REPORT r ON res.REPORT_ID = r.REPORT_ID
      JOIN ACCOUNT a ON res.RESOLVED_BY = a.ACCOUNT_ID
      ORDER BY res.RESOLVED_AT DESC
    `;

    const result: any = await this.execute(sql);
    return result.rows.map((row: any) => this.toModel(row));
  }

  async findById(id: string | number): Promise<Resolution | null> {
    const sql = `
      SELECT res.*,
             r.TITLE as REPORT_TITLE,
             a.NAME as RESOLVED_BY_NAME
      FROM ${this.tableName} res
      JOIN REPORT r ON res.REPORT_ID = r.REPORT_ID
      JOIN ACCOUNT a ON res.RESOLVED_BY = a.ACCOUNT_ID
      WHERE res.RESOLUTION_ID = :id
    `;
    const result: any = await this.execute(sql, { id });
    
    if (result.rows.length === 0) return null;
    return this.toModel(result.rows[0]);
  }

  async findByReport(reportId: number): Promise<Resolution | null> {
    const sql = `
      SELECT res.*,
             r.TITLE as REPORT_TITLE,
             a.NAME as RESOLVED_BY_NAME
      FROM ${this.tableName} res
      JOIN REPORT r ON res.REPORT_ID = r.REPORT_ID
      JOIN ACCOUNT a ON res.RESOLVED_BY = a.ACCOUNT_ID
      WHERE res.REPORT_ID = :reportId
    `;
    const result: any = await this.execute(sql, { reportId });
    
    if (result.rows.length === 0) return null;
    return this.toModel(result.rows[0]);
  }

  async findByResolvedBy(staffId: number): Promise<Resolution[]> {
    const sql = `
      SELECT res.*,
             r.TITLE as REPORT_TITLE,
             a.NAME as RESOLVED_BY_NAME
      FROM ${this.tableName} res
      JOIN REPORT r ON res.REPORT_ID = r.REPORT_ID
      JOIN ACCOUNT a ON res.RESOLVED_BY = a.ACCOUNT_ID
      WHERE res.RESOLVED_BY = :staffId
      ORDER BY res.RESOLVED_AT DESC
    `;

    const result: any = await this.execute(sql, { staffId });
    return result.rows.map((row: any) => this.toModel(row));
  }

  async findByType(type: ResolutionType): Promise<Resolution[]> {
    const sql = `
      SELECT res.*,
             r.TITLE as REPORT_TITLE,
             a.NAME as RESOLVED_BY_NAME
      FROM ${this.tableName} res
      JOIN REPORT r ON res.REPORT_ID = r.REPORT_ID
      JOIN ACCOUNT a ON res.RESOLVED_BY = a.ACCOUNT_ID
      WHERE res.RESOLUTION_TYPE = :type
      ORDER BY res.RESOLVED_AT DESC
    `;

    const result: any = await this.execute(sql, { type });
    return result.rows.map((row: any) => this.toModel(row));
  }

  async create(resolution: Resolution): Promise<Resolution> {
    const sql = `
      INSERT INTO ${this.tableName} (
        RESOLUTION_ID, REPORT_ID, RESOLVED_BY, RESOLUTION_TYPE, 
        RESOLUTION_NOTES, RESOLVED_AT
      ) VALUES (
        resolution_seq.NEXTVAL, :reportId, :resolvedBy, :resolutionType,
        :resolutionNotes, SYSTIMESTAMP
      ) RETURNING RESOLUTION_ID INTO :id
    `;

    const binds = {
      reportId: resolution.getReportId(),
      resolvedBy: resolution.getResolvedBy(),
      resolutionType: resolution.getResolutionType(),
      resolutionNotes: resolution.getResolutionNotes(),
      id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
    };

    const result: any = await this.execute(sql, binds, { autoCommit: true });
    const newId = result.outBinds.id[0];

    const created = await this.findById(newId);
    if (!created) {
      throw new Error('Failed to create resolution');
    }
    return created;
  }

  async update(id: number, updates: any): Promise<Resolution> {
    const setClauses: string[] = [];
    const binds: any = { id };

    if (updates.RESOLUTION_TYPE) {
      setClauses.push('RESOLUTION_TYPE = :resolutionType');
      binds.resolutionType = updates.RESOLUTION_TYPE;
    }
    if (updates.RESOLUTION_NOTES !== undefined) {
      setClauses.push('RESOLUTION_NOTES = :resolutionNotes');
      binds.resolutionNotes = updates.RESOLUTION_NOTES;
    }

    if (setClauses.length === 0) {
      throw new Error('No fields to update');
    }

    const sql = `
      UPDATE ${this.tableName}
      SET ${setClauses.join(', ')}
      WHERE RESOLUTION_ID = :id
    `;

    await this.execute(sql, binds, { autoCommit: true });

    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('Failed to update resolution');
    }
    return updated;
  }

  async getStatisticsByType(): Promise<Record<ResolutionType, number>> {
    const sql = `
      SELECT RESOLUTION_TYPE, COUNT(*) as COUNT
      FROM ${this.tableName}
      GROUP BY RESOLUTION_TYPE
    `;

    const result: any = await this.execute(sql);
    const stats: any = {};

    result.rows.forEach((row: any) => {
      stats[row.RESOLUTION_TYPE] = row.COUNT;
    });

    return stats;
  }
}
