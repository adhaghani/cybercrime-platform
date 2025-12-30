/* eslint-disable @typescript-eslint/no-explicit-any */
import { Crime } from '../models/Crime';
import { ReportRepository } from './ReportRepository';
import { CrimeCategory, SeverityLevel, ReportStatus } from '../types/enums';

export interface CrimeFilters {
  category?: CrimeCategory;
  severity?: SeverityLevel;
  weapon_involved?: boolean;
  victim_involved?: boolean;
  status?: ReportStatus;
}

export class CrimeRepository extends ReportRepository {
  protected tableName = 'CRIME';

  constructor() {
    super();
  }

  protected toModel(row: any): Crime {
    return new Crime({
      REPORT_ID: row.REPORT_ID,
      SUBMITTED_BY: row.SUBMITTED_BY,
      TITLE: row.TITLE,
      DESCRIPTION: row.DESCRIPTION,
      LOCATION: row.LOCATION,
      STATUS: row.STATUS,
      TYPE: row.TYPE,
      ATTACHMENT_PATH: row.ATTACHMENT_PATH,
      SUBMITTED_AT: row.SUBMITTED_AT,
      UPDATED_AT: row.UPDATED_AT,
      SUBMITTED_BY_NAME: row.SUBMITTER_NAME,
      SUBMITTED_BY_EMAIL: row.SUBMITTER_EMAIL,
      // Crime-specific fields
      CRIME_CATEGORY: row.CRIME_CATEGORY as CrimeCategory,
      SUSPECT_DESCRIPTION: row.SUSPECT_DESCRIPTION,
      VICTIM_INVOLVED: row.VICTIM_INVOLVED ? String(row.VICTIM_INVOLVED) : undefined,
      INJURY_LEVEL: row.INJURY_LEVEL as SeverityLevel,
      WEAPON_INVOLVED: row.WEAPON_INVOLVED ? String(row.WEAPON_INVOLVED) : undefined,
      EVIDENCE_DETAILS: row.EVIDENCE_DETAILS
    });
  }

  async findAll(filters?: CrimeFilters): Promise<Crime[]> {
    let whereClauses: string[] = [];
    const binds: any = {};

    if (filters?.category) {
      whereClauses.push('c.CRIME_CATEGORY = :category');
      binds.category = filters.category;
    }
    if (filters?.severity) {
      whereClauses.push('c.SEVERITY = :severity');
      binds.severity = filters.severity;
    }
    if (filters?.victim_involved !== undefined) {
      whereClauses.push('c.VICTIM_INVOLVED = :victimInvolved');
      binds.victimInvolved = filters.victim_involved ? 1 : 0;
    }
    if (filters?.weapon_involved !== undefined) {
      whereClauses.push('c.WEAPON_INVOLVED = :weaponInvolved');
      binds.weaponInvolved = filters.weapon_involved ? 1 : 0;
    }

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const sql = `
      SELECT c.*, r.*,
             a.NAME as SUBMITTER_NAME,
             a.EMAIL as SUBMITTER_EMAIL
      FROM ${this.tableName} c
      JOIN REPORT r ON c.REPORT_ID = r.REPORT_ID
      JOIN ACCOUNT a ON r.SUBMITTED_BY = a.ACCOUNT_ID
      ${whereClause}
      ORDER BY r.SUBMITTED_AT DESC
    `;

    const result: any = await this.execute(sql, binds);
    return result.rows.map((row: any) => this.toModel(row));
  }

  async findById(id: string | number): Promise<Crime | null> {
    const sql = `
      SELECT c.*, r.*,
             a.NAME as SUBMITTER_NAME,
             a.EMAIL as SUBMITTER_EMAIL
      FROM ${this.tableName} c
      JOIN REPORT r ON c.REPORT_ID = r.REPORT_ID
      JOIN ACCOUNT a ON r.SUBMITTED_BY = a.ACCOUNT_ID
      WHERE c.REPORT_ID = :id
    `;
    const result: any = await this.execute(sql, { id });
    
    if (result.rows.length === 0) return null;
    return this.toModel(result.rows[0]);
  }

  async findByCategory(category: CrimeCategory): Promise<Crime[]> {
    return this.findAll({ category });
  }

  async findBySeverity(severity: SeverityLevel): Promise<Crime[]> {
    return this.findAll({ severity });
  }

  async findWithWeapons(): Promise<Crime[]> {
    return this.findAll({ weapon_involved: true });
  }

  async findWithVictims(): Promise<Crime[]> {
    return this.findAll({ victim_involved: true });
  }

  async getStatisticsByCategory(): Promise<Record<CrimeCategory, number>> {
    const sql = `
      SELECT CRIME_CATEGORY, COUNT(*) as COUNT
      FROM ${this.tableName}
      GROUP BY CRIME_CATEGORY
    `;

    const result: any = await this.execute(sql);
    const stats: any = {};

    result.rows.forEach((row: any) => {
      stats[row.CRIME_CATEGORY] = row.COUNT;
    });

    return stats;
  }

  async getStatisticsBySeverity(): Promise<Record<SeverityLevel, number>> {
    const sql = `
      SELECT SEVERITY, COUNT(*) as COUNT
      FROM ${this.tableName}
      GROUP BY SEVERITY
    `;

    const result: any = await this.execute(sql);
    const stats: any = {};

    result.rows.forEach((row: any) => {
      stats[row.SEVERITY] = row.COUNT;
    });

    return stats;
  }

  async create(crime: Crime): Promise<Crime> {
    // Crime creation is handled via service layer
    // This is a placeholder - actual implementation would insert into CRIME table
    throw new Error('Use CrimeService.createCrime() instead');
  }

  async update(id: number, updates: any): Promise<Crime> {
    // Crime update is handled via service layer
    // This is a placeholder - actual implementation would update CRIME table
    throw new Error('Use CrimeService.updateCrime() instead');
  }
}
