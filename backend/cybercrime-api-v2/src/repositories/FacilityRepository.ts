/* eslint-disable @typescript-eslint/no-explicit-any */
import { Facility } from '../models/Facility';
import { ReportRepository } from './ReportRepository';
import { FacilityType, SeverityLevel, ReportStatus } from '../types/enums';

export interface FacilityFilters {
  facilityType?: FacilityType;
  urgency?: SeverityLevel;
  maintenanceRequired?: boolean;
  status?: ReportStatus;
}

export class FacilityRepository extends ReportRepository {
  protected tableName = 'FACILITY';

  constructor() {
    super();
  }

  protected toModel(row: any): Facility {
    return new Facility({
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
      // Facility-specific fields
      FACILITY_TYPE: row.FACILITY_TYPE as FacilityType,
      ASSET_TAG: row.ASSET_TAG,
      ESTIMATED_COST: row.ESTIMATED_COST,
      URGENCY_LEVEL: row.URGENCY_LEVEL as SeverityLevel,
      MAINTENANCE_REQUIRED: row.MAINTENANCE_REQUIRED ? String(row.MAINTENANCE_REQUIRED) : undefined
    });
  }

  async findAll(filters?: FacilityFilters): Promise<Facility[]> {
    let whereClauses: string[] = [];
    const binds: any = {};

    if (filters?.facilityType) {
      whereClauses.push('f.FACILITY_TYPE = :facilityType');
      binds.facilityType = filters.facilityType;
    }
    if (filters?.urgency) {
      whereClauses.push('f.URGENCY = :urgency');
      binds.urgency = filters.urgency;
    }
    if (filters?.maintenanceRequired !== undefined) {
      whereClauses.push('f.MAINTENANCE_REQUIRED = :maintenanceRequired');
      binds.maintenanceRequired = filters.maintenanceRequired ? 1 : 0;
    }

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const sql = `
      SELECT f.*, r.*,
             a.NAME as SUBMITTER_NAME,
             a.EMAIL as SUBMITTER_EMAIL
      FROM ${this.tableName} f
      JOIN REPORT r ON f.REPORT_ID = r.REPORT_ID
      JOIN ACCOUNT a ON r.SUBMITTED_BY = a.ACCOUNT_ID
      ${whereClause}
      ORDER BY f.URGENCY DESC, r.SUBMITTEED_AT DESC
    `;

    const result: any = await this.execute(sql, binds);
    return result.rows.map((row: any) => this.toModel(row));
  }

  async findById(id: string | number): Promise<Facility | null> {
    const sql = `
      SELECT f.*, r.*,
             a.NAME as SUBMITTER_NAME,
             a.EMAIL as SUBMITTER_EMAIL
      FROM ${this.tableName} f
      JOIN REPORT r ON f.REPORT_ID = r.REPORT_ID
      JOIN ACCOUNT a ON r.SUBMITTED_BY = a.ACCOUNT_ID
      WHERE f.REPORT_ID = :id
    `;
    const result: any = await this.execute(sql, { id });
    
    if (result.rows.length === 0) return null;
    return this.toModel(result.rows[0]);
  }

  async findByFacilityType(type: FacilityType): Promise<Facility[]> {
    return this.findAll({ facilityType: type });
  }

  async findByUrgency(urgency: SeverityLevel): Promise<Facility[]> {
    return this.findAll({ urgency });
  }

  async findByBuilding(buildingName: string): Promise<Facility[]> {
    const sql = `
      SELECT f.*, r.*,
             a.NAME as SUBMITTER_NAME,
             a.EMAIL as SUBMITTER_EMAIL
      FROM ${this.tableName} f
      JOIN REPORT r ON f.REPORT_ID = r.REPORT_ID
      JOIN ACCOUNT a ON r.SUBMITTED_BY = a.ACCOUNT_ID
      WHERE UPPER(f.BUILDING_NAME) = :buildingName
      ORDER BY f.URGENCY DESC, r.CREATED_AT DESC
    `;

    const result: any = await this.execute(sql, { buildingName: buildingName.toUpperCase() });
    return result.rows.map((row: any) => this.toModel(row));
  }

  async findRequiringMaintenance(): Promise<Facility[]> {
    return this.findAll({ maintenanceRequired: true });
  }

  async getStatisticsByType(): Promise<Record<FacilityType, number>> {
    const sql = `
      SELECT FACILITY_TYPE, COUNT(*) as COUNT
      FROM ${this.tableName}
      GROUP BY FACILITY_TYPE
    `;

    const result: any = await this.execute(sql);
    const stats: any = {};

    result.rows.forEach((row: any) => {
      stats[row.FACILITY_TYPE] = row.COUNT;
    });

    return stats;
  }

  async getStatisticsByUrgency(): Promise<Record<SeverityLevel, number>> {
    const sql = `
      SELECT URGENCY, COUNT(*) as COUNT
      FROM ${this.tableName}
      GROUP BY URGENCY
    `;

    const result: any = await this.execute(sql);
    const stats: any = {};

    result.rows.forEach((row: any) => {
      stats[row.URGENCY] = row.COUNT;
    });

    return stats;
  }

  async getTotalEstimatedCost(filters?: {
    facilityType?: FacilityType;
    urgency?: SeverityLevel;
  }): Promise<number> {
    let whereClauses: string[] = [];
    const binds: any = {};

    if (filters?.facilityType) {
      whereClauses.push('FACILITY_TYPE = :facilityType');
      binds.facilityType = filters.facilityType;
    }
    if (filters?.urgency) {
      whereClauses.push('URGENCY_LEVEL = :urgency');
      binds.urgency = filters.urgency;
    }

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const sql = `
      SELECT NVL(SUM(ESTIMATED_COST), 0) as TOTAL_COST
      FROM ${this.tableName}
      ${whereClause}
    `;

    const result: any = await this.execute(sql, binds);
    return result.rows[0]?.TOTAL_COST || 0;
  }

  async create(facility: Facility): Promise<Facility> {
    // Facility creation is handled via service layer
    throw new Error('Use FacilityService.createFacility() instead');
  }

  async update(id: number, updates: any): Promise<Facility> {
    // Facility update is handled via service layer
    throw new Error('Use FacilityService.updateFacility() instead');
  }
}
