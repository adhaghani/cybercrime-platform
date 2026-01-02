/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Report } from '../models/Report';
import { BaseRepository } from './base/BaseRepository';
import { ReportStatus, ReportType } from '../types/enums';
import oracledb from 'oracledb';

export interface ReportFilters {
  type?: ReportType;
  status?: ReportStatus;
  submitterId?: number;
  startDate?: Date;
  start_date?: Date;
  endDate?: Date;
  end_date?: Date;
}

export class ReportRepository extends BaseRepository<Report> {
  protected tableName = 'REPORT';

  constructor() {
    super('REPORT', 'REPORT_ID');
  }

  protected toModel(row: any): Report {
    return new Report({
      REPORT_ID: row.REPORT_ID,
      SUBMITTED_BY: row.SUBMITTED_BY,
      TITLE: row.TITLE,
      DESCRIPTION: row.DESCRIPTION,
      LOCATION: row.LOCATION,
      STATUS: row.STATUS as ReportStatus,
      TYPE: row.TYPE as ReportType,
      ATTACHMENT_PATH: row.ATTACHMENT_PATH,
      SUBMITTED_AT: row.SUBMITTED_AT,
      UPDATED_AT: row.UPDATED_AT,
      // Include submitter info from JOIN
      SUBMITTED_BY_NAME: row.SUBMITTER_NAME,
      SUBMITTED_BY_EMAIL: row.SUBMITTER_EMAIL
    });
  }

  async findAll(filters?: ReportFilters): Promise<Report[]> {
    let whereClauses: string[] = [];
    const binds: any = {};

    if (filters?.type) {
      whereClauses.push('r.TYPE = :type');
      binds.type = filters.type;
    }
    if (filters?.status) {
      whereClauses.push('r.STATUS = :status');
      binds.status = filters.status;
    }
    if (filters?.submitterId) {
      whereClauses.push('r.SUBMITTED_BY = :submitterId');
      binds.submitterId = filters.submitterId;
    }
    if (filters?.startDate || filters?.start_date) {
      whereClauses.push('r.SUBMITTED_AT >= :startDate');
      binds.startDate = filters.startDate || filters.start_date ;
    }
    if (filters?.endDate  || filters?.end_date) {
      whereClauses.push('r.SUBMITTED_AT <= :endDate');
      binds.endDate = filters.endDate || filters.end_date;
    }

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const sql = `
      SELECT r.*, 
             a.NAME as SUBMITTER_NAME,
             a.EMAIL as SUBMITTER_EMAIL
      FROM ${this.tableName} r
      JOIN ACCOUNT a ON r.SUBMITTED_BY = a.ACCOUNT_ID
      ${whereClause}
      ORDER BY r.SUBMITTED_AT DESC
    `;

    const result: any = await this.execute(sql, binds);
    return result.rows.map((row: any) => this.toModel(row));
  }

  async findById(id: string | number): Promise<Report | null> {
    // Get basic report with submitter info
    const sql = `
      SELECT r.*,
             a.NAME as SUBMITTER_NAME,
             a.EMAIL as SUBMITTER_EMAIL
      FROM ${this.tableName} r
      JOIN ACCOUNT a ON r.SUBMITTED_BY = a.ACCOUNT_ID
      WHERE r.REPORT_ID = :id
    `;
    const result: any = await this.execute(sql, { id });
    
    if (result.rows.length === 0) return null;
    
    const reportRow = result.rows[0];
    const report = this.toModel(reportRow);

    // Get type-specific details (CRIME or FACILITY)
    if (reportRow.TYPE === 'CRIME') {
      const crimeSql = `SELECT * FROM CRIME WHERE REPORT_ID = :id`;
      const crimeResult: any = await this.execute(crimeSql, { id });
      if (crimeResult.rows.length > 0) {
        const crimeData = crimeResult.rows[0];
        // Add crime-specific fields to report's extended data
        Object.assign(report['_data'], {
          CRIME_CATEGORY: crimeData.CRIME_CATEGORY,
          SUSPECT_DESCRIPTION: crimeData.SUSPECT_DESCRIPTION,
          VICTIM_INVOLVED: crimeData.VICTIM_INVOLVED,
          WEAPON_INVOLVED: crimeData.WEAPON_INVOLVED,
          INJURY_LEVEL: crimeData.INJURY_LEVEL,
          EVIDENCE_DETAILS: crimeData.EVIDENCE_DETAILS
        });
      }
    } else if (reportRow.TYPE === 'FACILITY') {
      const facilitySql = `SELECT * FROM FACILITY WHERE REPORT_ID = :id`;
      const facilityResult: any = await this.execute(facilitySql, { id });
      if (facilityResult.rows.length > 0) {
        const facilityData = facilityResult.rows[0];
        // Add facility-specific fields to report's extended data
        Object.assign(report['_data'], {
          FACILITY_TYPE: facilityData.FACILITY_TYPE,
          SEVERITY_LEVEL: facilityData.SEVERITY_LEVEL,
          AFFECTED_EQUIPMENT: facilityData.AFFECTED_EQUIPMENT
        });
      }
    }

    // Get assignments with staff details
    const assignmentsSql = `
      SELECT 
        RA.ASSIGNMENT_ID, RA.ACCOUNT_ID, RA.REPORT_ID, 
        RA.ASSIGNED_AT, RA.ACTION_TAKEN, RA.ADDITIONAL_FEEDBACK, RA.UPDATED_AT,
        A.NAME, A.EMAIL, A.CONTACT_NUMBER, A.ACCOUNT_TYPE,
        S.STAFF_ID, S.ROLE, S.DEPARTMENT, S.POSITION
      FROM REPORT_ASSIGNMENT RA
      INNER JOIN ACCOUNT A ON RA.ACCOUNT_ID = A.ACCOUNT_ID
      LEFT JOIN STAFF S ON A.ACCOUNT_ID = S.ACCOUNT_ID
      WHERE RA.REPORT_ID = :id
      ORDER BY RA.ASSIGNED_AT DESC
    `;
    const assignmentsResult: any = await this.execute(assignmentsSql, { id });
    report['_data'].STAFF_ASSIGNED = assignmentsResult.rows;

    // Get resolutions
    const resolutionsSql = `
      SELECT * FROM RESOLUTION WHERE REPORT_ID = :id ORDER BY RESOLVED_AT DESC
    `;
    const resolutionsResult: any = await this.execute(resolutionsSql, { id });
    report['_data'].RESOLUTIONS = resolutionsResult.rows.length > 0 ? resolutionsResult.rows[0] : null;

    return report;
  }

  async findBySubmitter(submitterId: number): Promise<Report[]> {
    return this.findAll({ submitterId });
  }

  async findByStatus(status: ReportStatus): Promise<Report[]> {
    return this.findAll({ status });
  }

  async findByType(type: ReportType): Promise<Report[]> {
    return this.findAll({ type });
  }

  async updateStatus(id: number, status: ReportStatus): Promise<Report> {
    const sql = `
      UPDATE ${this.tableName}
      SET STATUS = :status,
          UPDATED_AT = SYSTIMESTAMP
      WHERE REPORT_ID = :id
    `;

    await this.execute(sql, { id, status }, { autoCommit: true });

    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('Failed to update report status');
    }
    return updated;
  }

  async create(report: Report, crimeOrFacilityData?: any, attachmentPath?: string | string[] | null): Promise<Report> {
    const sql = `
      INSERT INTO ${this.tableName} (
        REPORT_ID, SUBMITTED_BY, TITLE, DESCRIPTION, LOCATION, 
        STATUS, TYPE, ATTACHMENT_PATH, SUBMITTED_AT, UPDATED_AT
      ) VALUES (
        report_seq.NEXTVAL, :submittedBy, :title, :description, :location,
        :status, :type, :attachmentPath, SYSTIMESTAMP, SYSTIMESTAMP
      ) RETURNING REPORT_ID INTO :id
    `;

    // Handle attachment path - convert array to JSON string if needed
    let attachmentPathValue: string | null = null;
    const reportAttachmentPath = report.getAttachmentPath();
    
    if (attachmentPath) {
      attachmentPathValue = Array.isArray(attachmentPath) 
        ? JSON.stringify(attachmentPath) 
        : attachmentPath;
    } else if (reportAttachmentPath) {
      attachmentPathValue = Array.isArray(reportAttachmentPath)
        ? JSON.stringify(reportAttachmentPath)
        : reportAttachmentPath;
    }

    const binds = {
      submittedBy: report.getSubmittedBy(),
      title: report.getTitle(),
      description: report.getDescription(),
      location: report.getLocation(),
      status: report.getStatus(),
      type: report.getType(),
      attachmentPath: attachmentPathValue,
      id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
    };

    const result: any = await this.execute(sql, binds, { autoCommit: true });
    const newId = result.outBinds.id[0];

    // Create crime or facility specific record if provided
    if (crimeOrFacilityData) {
      if (report.getType() === 'CRIME') {
        // Use MERGE to handle duplicate inserts gracefully (idempotent operation)
        const crimeSql = `
          MERGE INTO CRIME c
          USING (SELECT :reportId as REPORT_ID FROM dual) src
          ON (c.REPORT_ID = src.REPORT_ID)
          WHEN NOT MATCHED THEN
            INSERT (REPORT_ID, CRIME_CATEGORY, SUSPECT_DESCRIPTION, 
                    VICTIM_INVOLVED, WEAPON_INVOLVED, INJURY_LEVEL, EVIDENCE_DETAILS)
            VALUES (:reportId, :crimeCategory, :suspectDescription,
                    :victimInvolved, :weaponInvolved, :injuryLevel, :evidenceDetails)
          WHEN MATCHED THEN
            UPDATE SET 
              CRIME_CATEGORY = :crimeCategory,
              SUSPECT_DESCRIPTION = :suspectDescription,
              VICTIM_INVOLVED = :victimInvolved,
              WEAPON_INVOLVED = :weaponInvolved,
              INJURY_LEVEL = :injuryLevel,
              EVIDENCE_DETAILS = :evidenceDetails
        `;
        const crimeBinds = {
          reportId: newId,
          crimeCategory: crimeOrFacilityData.CRIME_CATEGORY || null,
          suspectDescription: crimeOrFacilityData.SUSPECT_DESCRIPTION || null,
          victimInvolved: crimeOrFacilityData.VICTIM_INVOLVED || null,
          weaponInvolved: crimeOrFacilityData.WEAPON_INVOLVED || null,
          injuryLevel: crimeOrFacilityData.INJURY_LEVEL || null,
          evidenceDetails: crimeOrFacilityData.EVIDENCE_DETAILS || null
        };
        await this.execute(crimeSql, crimeBinds, { autoCommit: true });
      } else if (report.getType() === 'FACILITY') {
        // Use MERGE to handle duplicate inserts gracefully (idempotent operation)
        const facilitySql = `
          MERGE INTO FACILITY f
          USING (SELECT :reportId as REPORT_ID FROM dual) src
          ON (f.REPORT_ID = src.REPORT_ID)
          WHEN NOT MATCHED THEN
            INSERT (REPORT_ID, FACILITY_TYPE, SEVERITY_LEVEL, AFFECTED_EQUIPMENT)
            VALUES (:reportId, :facilityType, :severityLevel, :affectedEquipment)
          WHEN MATCHED THEN
            UPDATE SET 
              FACILITY_TYPE = :facilityType,
              SEVERITY_LEVEL = :severityLevel,
              AFFECTED_EQUIPMENT = :affectedEquipment
        `;
        const facilityBinds = {
          reportId: newId,
          facilityType: crimeOrFacilityData.FACILITY_TYPE || null,
          severityLevel: crimeOrFacilityData.SEVERITY_LEVEL || null,
          affectedEquipment: crimeOrFacilityData.AFFECTED_EQUIPMENT || null
        };
        await this.execute(facilitySql, facilityBinds, { autoCommit: true });
      }
    }

    const created = await this.findById(newId);
    if (!created) {
      throw new Error('Failed to create report');
    }
    return created;
  }

  async update(id: number, updates: any): Promise<Report> {
    const setClauses: string[] = [];
    const binds: any = { id };

    if (updates.TITLE) {
      setClauses.push('TITLE = :title');
      binds.title = updates.TITLE;
    }
    if (updates.DESCRIPTION) {
      setClauses.push('DESCRIPTION = :description');
      binds.description = updates.DESCRIPTION;
    }
    if (updates.LOCATION) {
      setClauses.push('LOCATION = :location');
      binds.location = updates.LOCATION;
    }

    if (setClauses.length === 0) {
      throw new Error('No fields to update');
    }

    setClauses.push('UPDATED_AT = SYSTIMESTAMP');

    const sql = `
      UPDATE ${this.tableName}
      SET ${setClauses.join(', ')}
      WHERE REPORT_ID = :id
    `;

    await this.execute(sql, binds, { autoCommit: true });

    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('Failed to update report');
    }
    return updated;
  }

  async getStatistics(options?: {
    startDate?: Date;
    endDate?: Date;
  }): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byType: Record<string, number>;
    byCrimeCategory: Record<string, number>;
    byFacilitySeverity: Record<string, number>;
    overTime: Array<{ report_date: string; desktop: number; mobile: number }>;
    userGrowth: Array<{ month_name: string; desktop: number }>;
  }> {
    const sql = `
      SELECT 
        COUNT(*) as TOTAL,
        STATUS,
        TYPE
      FROM ${this.tableName}
      WHERE (:startDate IS NULL OR SUBMITTED_AT >= :startDate)
      AND (:endDate IS NULL OR SUBMITTED_AT <= :endDate)
      GROUP BY STATUS, TYPE
    `;

    const binds: any = {
      startDate: options?.startDate || null,
      endDate: options?.endDate || null,
    }

    const result: any = await this.execute(sql, binds);
    
    const stats = {
      total: 0,
      byStatus: {} as Record<string, number>,
      byType: {} as Record<string, number>,
      byCrimeCategory: {} as Record<string, number>,
      byFacilitySeverity: {} as Record<string, number>,
      overTime: [] as Array<{ report_date: string; desktop: number; mobile: number }>,
      userGrowth: [] as Array<{ month_name: string; desktop: number }>
    };

    result.rows.forEach((row: any) => {
      stats.total += row.TOTAL;
      stats.byStatus[row.STATUS] = (stats.byStatus[row.STATUS] || 0) + row.TOTAL;
      stats.byType[row.TYPE] = (stats.byType[row.TYPE] || 0) + row.TOTAL;
    });

    // Get crime categories for CRIME reports
    const crimeSql = `
      SELECT c.CRIME_CATEGORY, COUNT(*) as COUNT
      FROM ${this.tableName} r
      JOIN CRIME c ON r.REPORT_ID = c.REPORT_ID
      WHERE r.TYPE = 'CRIME'
      GROUP BY c.CRIME_CATEGORY
    `;
    
    try {
      const crimeResult: any = await this.execute(crimeSql);
      crimeResult.rows.forEach((row: any) => {
        stats.byCrimeCategory[row.CRIME_CATEGORY] = row.COUNT;
      });
    } catch (err) {
      console.log('No crime data found:', err);
    }

    // Get facility severities for FACILITY reports  
    const facilitySql = `
      SELECT f.SEVERITY_LEVEL, COUNT(*) as COUNT
      FROM ${this.tableName} r
      JOIN FACILITY f ON r.REPORT_ID = f.REPORT_ID
      WHERE r.TYPE = 'FACILITY'
      GROUP BY f.SEVERITY_LEVEL
    `;
    
    try {
      const facilityResult: any = await this.execute(facilitySql);
      facilityResult.rows.forEach((row: any) => {
        stats.byFacilitySeverity[row.SEVERITY_LEVEL] = row.COUNT;
      });
    } catch (err) {
      console.log('No facility data found:', err);
    }

    // Get reports over time (last 30 days)
    const overTimeSql = `
      SELECT 
        TO_CHAR(r.SUBMITTED_AT, 'YYYY-MM-DD') as "report_date",
        COUNT(CASE WHEN r.TYPE = 'CRIME' THEN 1 END) as "desktop",
        COUNT(CASE WHEN r.TYPE = 'FACILITY' THEN 1 END) as "mobile"
      FROM ${this.tableName} r
      WHERE r.SUBMITTED_AT >= SYSDATE - 30
      GROUP BY TO_CHAR(r.SUBMITTED_AT, 'YYYY-MM-DD')
      ORDER BY "report_date"
    `;
    
    try {
      const overTimeResult: any = await this.execute(overTimeSql);
      stats.overTime = overTimeResult.rows.map((row: any) => ({
        report_date: row["report_date"],
        desktop: Number(row["desktop"]),
        mobile: Number(row["mobile"])
      }));
    } catch (err) {
      console.log('No overTime data found:', err);
    }

    // Get user growth (last 12 months)
    const userGrowthSql = `
      SELECT 
        TO_CHAR(a.CREATED_AT, 'YYYY-MM') as "month_name",
        COUNT(*) as "desktop"
      FROM ACCOUNT a
      WHERE a.ACCOUNT_TYPE = 'STUDENT'
        AND a.CREATED_AT >= ADD_MONTHS(SYSDATE, -12)
      GROUP BY TO_CHAR(a.CREATED_AT, 'YYYY-MM')
      ORDER BY "month_name"
    `;
    
    try {
      const userGrowthResult: any = await this.execute(userGrowthSql);
      stats.userGrowth = userGrowthResult.rows.map((row: any) => ({
        month_name: row["month_name"],
        desktop: Number(row["desktop"])
      }));
    } catch (err) {
      console.log('No user growth data found:', err);
    }

    return stats;
  }

  async search(query: string, filters?: {
    type?: ReportType;
    status?: ReportStatus;
  }): Promise<Report[]> {
    let whereClauses: string[] = [
      '(UPPER(r.TITLE) LIKE :search OR UPPER(r.DESCRIPTION) LIKE :search OR UPPER(r.LOCATION) LIKE :search)'
    ];
    const binds: any = { search: `%${query.toUpperCase()}%` };

    if (filters?.type) {
      whereClauses.push('r.TYPE = :type');
      binds.type = filters.type;
    }
    if (filters?.status) {
      whereClauses.push('r.STATUS = :status');
      binds.status = filters.status;
    }

    const sql = `
      SELECT r.*,
             a.NAME as SUBMITTER_NAME,
             a.EMAIL as SUBMITTER_EMAIL
      FROM ${this.tableName} r
      JOIN ACCOUNT a ON r.SUBMITTED_BY = a.ACCOUNT_ID
      WHERE ${whereClauses.join(' AND ')}
      ORDER BY r.SUBMITTED_AT DESC
    `;

    const result: any = await this.execute(sql, binds);
    return result.rows.map((row: any) => this.toModel(row));
  }

  async findReportsWithDetails(type: 'CRIME' | 'FACILITY'): Promise<any[]> {
    let sql: string;
    const binds: any = { type };

    if (type === 'CRIME') {
      sql = `
        SELECT 
          TO_NUMBER(R.REPORT_ID) as REPORT_ID, 
          TO_NUMBER(R.SUBMITTED_BY) as SUBMITTED_BY, 
          R.TITLE, R.DESCRIPTION, R.LOCATION, 
          R.STATUS, R.TYPE, R.SUBMITTED_AT, R.UPDATED_AT, R.ATTACHMENT_PATH,
          C.CRIME_CATEGORY, C.SUSPECT_DESCRIPTION, C.VICTIM_INVOLVED,
          C.WEAPON_INVOLVED, C.INJURY_LEVEL, C.EVIDENCE_DETAILS
        FROM REPORT R
        LEFT JOIN CRIME C ON R.REPORT_ID = C.REPORT_ID
        WHERE R.TYPE = :type
        ORDER BY R.SUBMITTED_AT DESC
      `;
    } else {
      sql = `
        SELECT 
          TO_NUMBER(R.REPORT_ID) as REPORT_ID, 
          TO_NUMBER(R.SUBMITTED_BY) as SUBMITTED_BY, 
          R.TITLE, R.DESCRIPTION, R.LOCATION,
          R.STATUS, R.TYPE, R.SUBMITTED_AT, R.UPDATED_AT, R.ATTACHMENT_PATH,
          F.FACILITY_TYPE, F.SEVERITY_LEVEL, F.AFFECTED_EQUIPMENT
        FROM REPORT R
        LEFT JOIN FACILITY F ON R.REPORT_ID = F.REPORT_ID
        WHERE R.TYPE = :type
        ORDER BY R.SUBMITTED_AT DESC
      `;
    }

    const result: any = await this.execute(sql, binds);
    return result.rows;
  }

  /**
   * Find user's reports with type-specific details
   */
  async findUserReportsWithDetails(submitterId: number, type?: 'CRIME' | 'FACILITY'): Promise<any[]> {
    let sql: string;
    const binds: any = { submitterId };

    if (type === 'CRIME') {
      sql = `
        SELECT 
          TO_NUMBER(R.REPORT_ID) as REPORT_ID, 
          TO_NUMBER(R.SUBMITTED_BY) as SUBMITTED_BY, 
          R.TITLE, R.DESCRIPTION, R.LOCATION, 
          R.STATUS, R.TYPE, R.SUBMITTED_AT, R.UPDATED_AT, R.ATTACHMENT_PATH,
          C.CRIME_CATEGORY, C.SUSPECT_DESCRIPTION, C.VICTIM_INVOLVED,
          C.WEAPON_INVOLVED, C.INJURY_LEVEL, C.EVIDENCE_DETAILS
        FROM REPORT R
        LEFT JOIN CRIME C ON R.REPORT_ID = C.REPORT_ID
        WHERE R.SUBMITTED_BY = :submitterId AND R.TYPE = :type
        ORDER BY R.SUBMITTED_AT DESC
      `;
      binds.type = type;
    } else if (type === 'FACILITY') {
      sql = `
        SELECT 
          TO_NUMBER(R.REPORT_ID) as REPORT_ID, 
          TO_NUMBER(R.SUBMITTED_BY) as SUBMITTED_BY, 
          R.TITLE, R.DESCRIPTION, R.LOCATION,
          R.STATUS, R.TYPE, R.SUBMITTED_AT, R.UPDATED_AT, R.ATTACHMENT_PATH,
          F.FACILITY_TYPE, F.SEVERITY_LEVEL, F.AFFECTED_EQUIPMENT
        FROM REPORT R
        LEFT JOIN FACILITY F ON R.REPORT_ID = F.REPORT_ID
        WHERE R.SUBMITTED_BY = :submitterId AND R.TYPE = :type
        ORDER BY R.SUBMITTED_AT DESC
      `;
      binds.type = type;
    } else {
      // Get all user's reports with details
      sql = `
        SELECT 
          TO_NUMBER(R.REPORT_ID) as REPORT_ID, 
          TO_NUMBER(R.SUBMITTED_BY) as SUBMITTED_BY, 
          R.TITLE, R.DESCRIPTION, R.LOCATION, 
          R.STATUS, R.TYPE, R.SUBMITTED_AT, R.UPDATED_AT, R.ATTACHMENT_PATH,
          C.CRIME_CATEGORY, C.SUSPECT_DESCRIPTION, C.VICTIM_INVOLVED,
          C.WEAPON_INVOLVED, C.INJURY_LEVEL, C.EVIDENCE_DETAILS,
          F.FACILITY_TYPE, F.SEVERITY_LEVEL, F.AFFECTED_EQUIPMENT
        FROM REPORT R
        LEFT JOIN CRIME C ON R.REPORT_ID = C.REPORT_ID AND R.TYPE = 'CRIME'
        LEFT JOIN FACILITY F ON R.REPORT_ID = F.REPORT_ID AND R.TYPE = 'FACILITY'
        WHERE R.SUBMITTED_BY = :submitterId
        ORDER BY R.SUBMITTED_AT DESC
      `;
    }

    const result: any = await this.execute(sql, binds);
    return result.rows;
  }
}
