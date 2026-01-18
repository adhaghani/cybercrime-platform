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
        // CREATE if data didn't exist or UPDATE if it did
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
    departmentEfficiency: Array<{ 
      department: string; 
      responseSpeed: number; 
      actionRate: number; 
      resolutionRate: number; 
      workloadCapacity: number; 
      efficiencyScore: number; 
      sameDayAssignment: number; 
    }>;
    locationHotspots: Array<{
      location: string;
      critical: number;
      high: number;
      medium: number;
      low: number;
      total: number;
    }>;
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
      userGrowth: [] as Array<{ month_name: string; desktop: number }>,
      departmentEfficiency: [] as Array<{ 
        department: string; 
        responseSpeed: number; 
        actionRate: number; 
        resolutionRate: number; 
        workloadCapacity: number; 
        efficiencyScore: number; 
        sameDayAssignment: number; 
      }>,
      locationHotspots: [] as Array<{
        location: string;
        critical: number;
        high: number;
        medium: number;
        low: number;
        total: number;
      }>
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

    // Get department efficiency metrics
    const departmentEfficiencySql = `
      SELECT 
        s.DEPARTMENT as "department",
        -- Response Speed: Inverse of avg hours to assignment (normalized to 0-100)
        NVL(ROUND(100 - (
          (SELECT AVG(CAST(ra.ASSIGNED_AT AS DATE) - CAST(r.SUBMITTED_AT AS DATE)) * 24
           FROM REPORT_ASSIGNMENT ra
           JOIN REPORT r ON ra.REPORT_ID = r.REPORT_ID
           JOIN STAFF st ON ra.ACCOUNT_ID = st.ACCOUNT_ID
           WHERE st.DEPARTMENT = s.DEPARTMENT
           AND ra.ASSIGNED_AT = (SELECT MIN(ra2.ASSIGNED_AT) FROM REPORT_ASSIGNMENT ra2 WHERE ra2.REPORT_ID = r.REPORT_ID)
          ) * 2
        ), 2), 0) as "responseSpeed",
        -- Action Rate: Percentage of cases with action taken
        NVL(ROUND(
          (SELECT COUNT(DISTINCT ra.REPORT_ID)
           FROM REPORT_ASSIGNMENT ra
           JOIN STAFF st ON ra.ACCOUNT_ID = st.ACCOUNT_ID
           WHERE st.DEPARTMENT = s.DEPARTMENT
           AND ra.ACTION_TAKEN IS NOT NULL) * 100.0 /
          NULLIF((SELECT COUNT(DISTINCT ra.REPORT_ID)
           FROM REPORT_ASSIGNMENT ra
           JOIN STAFF st ON ra.ACCOUNT_ID = st.ACCOUNT_ID
           WHERE st.DEPARTMENT = s.DEPARTMENT), 0)
        , 2), 0) as "actionRate",
        -- Resolution Rate: Percentage resolved
        NVL(ROUND(
          (SELECT COUNT(DISTINCT r.REPORT_ID)
           FROM REPORT_ASSIGNMENT ra
           JOIN REPORT r ON ra.REPORT_ID = r.REPORT_ID
           JOIN STAFF st ON ra.ACCOUNT_ID = st.ACCOUNT_ID
           WHERE st.DEPARTMENT = s.DEPARTMENT
           AND r.STATUS = 'RESOLVED') * 100.0 /
          NULLIF((SELECT COUNT(DISTINCT ra.REPORT_ID)
           FROM REPORT_ASSIGNMENT ra
           JOIN STAFF st ON ra.ACCOUNT_ID = st.ACCOUNT_ID
           WHERE st.DEPARTMENT = s.DEPARTMENT), 0)
        , 2), 0) as "resolutionRate",
        -- Workload Capacity: Inverse of average active cases per staff (normalized)
        NVL(ROUND(100 - (
          (SELECT AVG(active_count) FROM (
            SELECT COUNT(*) as active_count
            FROM REPORT_ASSIGNMENT ra
            JOIN REPORT r ON ra.REPORT_ID = r.REPORT_ID
            JOIN STAFF st ON ra.ACCOUNT_ID = st.ACCOUNT_ID
            WHERE st.DEPARTMENT = s.DEPARTMENT
            AND r.STATUS IN ('PENDING', 'UNDER_INVESTIGATION')
            GROUP BY st.ACCOUNT_ID
          )) * 10
        ), 2), 100) as "workloadCapacity",
        -- Same Day Assignment Rate: % assigned within 24 hours
        NVL(ROUND(
          (SELECT COUNT(DISTINCT ra.REPORT_ID)
           FROM REPORT_ASSIGNMENT ra
           JOIN REPORT r ON ra.REPORT_ID = r.REPORT_ID
           JOIN STAFF st ON ra.ACCOUNT_ID = st.ACCOUNT_ID
           WHERE st.DEPARTMENT = s.DEPARTMENT
           AND CAST(ra.ASSIGNED_AT AS DATE) - CAST(r.SUBMITTED_AT AS DATE) <= 1
           AND ra.ASSIGNED_AT = (SELECT MIN(ra2.ASSIGNED_AT) FROM REPORT_ASSIGNMENT ra2 WHERE ra2.REPORT_ID = r.REPORT_ID)) * 100.0 /
          NULLIF((SELECT COUNT(DISTINCT ra.REPORT_ID)
           FROM REPORT_ASSIGNMENT ra
           JOIN STAFF st ON ra.ACCOUNT_ID = st.ACCOUNT_ID
           WHERE st.DEPARTMENT = s.DEPARTMENT), 0)
        , 2), 0) as "sameDayAssignment",
        -- Efficiency Score: Weighted combination
        NVL(ROUND(
          (
            -- Response speed component (30%)
            (100 - ((SELECT AVG(CAST(ra.ASSIGNED_AT AS DATE) - CAST(r.SUBMITTED_AT AS DATE)) * 24
                     FROM REPORT_ASSIGNMENT ra
                     JOIN REPORT r ON ra.REPORT_ID = r.REPORT_ID
                     JOIN STAFF st ON ra.ACCOUNT_ID = st.ACCOUNT_ID
                     WHERE st.DEPARTMENT = s.DEPARTMENT) * 2)) * 0.3 +
            -- Action rate component (20%)
            ((SELECT COUNT(DISTINCT ra.REPORT_ID)
              FROM REPORT_ASSIGNMENT ra
              JOIN STAFF st ON ra.ACCOUNT_ID = st.ACCOUNT_ID
              WHERE st.DEPARTMENT = s.DEPARTMENT
              AND ra.ACTION_TAKEN IS NOT NULL) * 100.0 /
             NULLIF((SELECT COUNT(DISTINCT ra.REPORT_ID)
              FROM REPORT_ASSIGNMENT ra
              JOIN STAFF st ON ra.ACCOUNT_ID = st.ACCOUNT_ID
              WHERE st.DEPARTMENT = s.DEPARTMENT), 0)) * 0.2 +
            -- Resolution rate component (30%)
            ((SELECT COUNT(DISTINCT r.REPORT_ID)
              FROM REPORT_ASSIGNMENT ra
              JOIN REPORT r ON ra.REPORT_ID = r.REPORT_ID
              JOIN STAFF st ON ra.ACCOUNT_ID = st.ACCOUNT_ID
              WHERE st.DEPARTMENT = s.DEPARTMENT
              AND r.STATUS = 'RESOLVED') * 100.0 /
             NULLIF((SELECT COUNT(DISTINCT ra.REPORT_ID)
              FROM REPORT_ASSIGNMENT ra
              JOIN STAFF st ON ra.ACCOUNT_ID = st.ACCOUNT_ID
              WHERE st.DEPARTMENT = s.DEPARTMENT), 0)) * 0.3 +
            -- Workload capacity component (20%)
            (100 - ((SELECT AVG(active_count) FROM (
              SELECT COUNT(*) as active_count
              FROM REPORT_ASSIGNMENT ra
              JOIN REPORT r ON ra.REPORT_ID = r.REPORT_ID
              JOIN STAFF st ON ra.ACCOUNT_ID = st.ACCOUNT_ID
              WHERE st.DEPARTMENT = s.DEPARTMENT
              AND r.STATUS IN ('PENDING', 'UNDER_INVESTIGATION')
              GROUP BY st.ACCOUNT_ID
            )) * 10)) * 0.2
          )
        , 2), 0) as "efficiencyScore"
      FROM STAFF s
      WHERE EXISTS (
        SELECT 1 FROM REPORT_ASSIGNMENT ra WHERE ra.ACCOUNT_ID = s.ACCOUNT_ID
      )
      GROUP BY s.DEPARTMENT
      ORDER BY "efficiencyScore" DESC
    `;

    try {
      const deptEfficiencyResult: any = await this.execute(departmentEfficiencySql);
      stats.departmentEfficiency = deptEfficiencyResult.rows.map((row: any) => ({
        department: row["department"],
        responseSpeed: Math.max(0, Math.min(100, Number(row["responseSpeed"]))),
        actionRate: Number(row["actionRate"]),
        resolutionRate: Number(row["resolutionRate"]),
        workloadCapacity: Math.max(0, Math.min(100, Number(row["workloadCapacity"]))),
        efficiencyScore: Math.max(0, Math.min(100, Number(row["efficiencyScore"]))),
        sameDayAssignment: Number(row["sameDayAssignment"])
      }));
    } catch (err) {
      console.log('No department efficiency data found:', err);
    }

    // Get location hotspots by severity
    const locationHotspotsSql = `
      SELECT 
        r.LOCATION as "location",
        -- Subquery: Count critical severity reports
        (SELECT COUNT(*)
         FROM REPORT r2
         LEFT JOIN CRIME c ON r2.REPORT_ID = c.REPORT_ID AND r2.TYPE = 'CRIME'
         LEFT JOIN FACILITY f ON r2.REPORT_ID = f.REPORT_ID AND r2.TYPE = 'FACILITY'
         WHERE r2.LOCATION = r.LOCATION
         AND (c.INJURY_LEVEL = 'CRITICAL' OR f.SEVERITY_LEVEL = 'CRITICAL')) as "critical",
        -- Subquery: Count high/severe reports
        (SELECT COUNT(*)
         FROM REPORT r3
         LEFT JOIN CRIME c ON r3.REPORT_ID = c.REPORT_ID AND r3.TYPE = 'CRIME'
         LEFT JOIN FACILITY f ON r3.REPORT_ID = f.REPORT_ID AND r3.TYPE = 'FACILITY'
         WHERE r3.LOCATION = r.LOCATION
         AND (c.INJURY_LEVEL = 'SEVERE' OR f.SEVERITY_LEVEL = 'HIGH')) as "high",
        -- Subquery: Count medium/moderate reports
        (SELECT COUNT(*)
         FROM REPORT r4
         LEFT JOIN CRIME c ON r4.REPORT_ID = c.REPORT_ID AND r4.TYPE = 'CRIME'
         LEFT JOIN FACILITY f ON r4.REPORT_ID = f.REPORT_ID AND r4.TYPE = 'FACILITY'
         WHERE r4.LOCATION = r.LOCATION
         AND (c.INJURY_LEVEL = 'MODERATE' OR f.SEVERITY_LEVEL = 'MEDIUM')) as "medium",
        -- Subquery: Count low/minor reports
        (SELECT COUNT(*)
         FROM REPORT r5
         LEFT JOIN CRIME c ON r5.REPORT_ID = c.REPORT_ID AND r5.TYPE = 'CRIME'
         LEFT JOIN FACILITY f ON r5.REPORT_ID = f.REPORT_ID AND r5.TYPE = 'FACILITY'
         WHERE r5.LOCATION = r.LOCATION
         AND (c.INJURY_LEVEL = 'MINOR' OR f.SEVERITY_LEVEL = 'LOW')) as "low",
        COUNT(*) as "total"
      FROM REPORT r
      GROUP BY r.LOCATION
      HAVING COUNT(*) >= 3
      ORDER BY "critical" DESC, "total" DESC
      FETCH FIRST 10 ROWS ONLY
    `;

    try {
      const locationHotspotsResult: any = await this.execute(locationHotspotsSql);
      stats.locationHotspots = locationHotspotsResult.rows.map((row: any) => ({
        location: row["location"],
        critical: Number(row["critical"]),
        high: Number(row["high"]),
        medium: Number(row["medium"]),
        low: Number(row["low"]),
        total: Number(row["total"])
      }));
    } catch (err) {
      console.log('No location hotspots data found:', err);
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

  // SUBQUERY REPORTS
  /**
   * Find unassigned reports with calculated priority score
   * Priority based on: waiting time, report type, crime severity/facility severity
   */
  async findUnassignedReportsWithPriority(filters?: {
    type?: 'CRIME' | 'FACILITY';
  }): Promise<any[]> {
    const binds: any = {};
    let typeCondition = '';
    
    if (filters?.type) {
      typeCondition = 'AND r.TYPE = :type';
      binds.type = filters.type;
    }

    const sql = `
      SELECT 
        r.REPORT_ID,
        r.TITLE,
        r.DESCRIPTION,
        r.TYPE,
        r.STATUS,
        r.LOCATION,
        r.SUBMITTED_AT,
        a.NAME as SUBMITTER_NAME,
        -- Subquery 1: Check if report is unassigned
        (SELECT COUNT(*) 
         FROM REPORT_ASSIGNMENT ra 
         WHERE ra.REPORT_ID = r.REPORT_ID) as ASSIGNMENT_COUNT,
        -- Subquery 2: Calculate waiting time in days
        ROUND(CAST(SYSDATE AS DATE) - CAST(r.SUBMITTED_AT AS DATE), 2) as WAITING_DAYS,
        -- Direct join: Get severity level (from CRIME or FACILITY)
        CASE 
          WHEN r.TYPE = 'CRIME' AND c.INJURY_LEVEL IS NOT NULL THEN 
            CASE c.INJURY_LEVEL
              WHEN 'CRITICAL' THEN 5
              WHEN 'SEVERE' THEN 4
              WHEN 'MODERATE' THEN 3
              WHEN 'MINOR' THEN 2
              ELSE 1
            END
          WHEN r.TYPE = 'FACILITY' AND f.SEVERITY_LEVEL IS NOT NULL THEN
            CASE f.SEVERITY_LEVEL
              WHEN 'CRITICAL' THEN 5
              WHEN 'HIGH' THEN 4
              WHEN 'MEDIUM' THEN 3
              WHEN 'LOW' THEN 2
              ELSE 1
            END
          ELSE 1
        END as SEVERITY_SCORE,
        -- Direct join: Calculate priority score (weighted formula)
        (ROUND(CAST(SYSDATE AS DATE) - CAST(r.SUBMITTED_AT AS DATE), 2) * 2) + 
        CASE 
          WHEN r.TYPE = 'CRIME' AND c.INJURY_LEVEL IS NOT NULL THEN 
            CASE c.INJURY_LEVEL
              WHEN 'CRITICAL' THEN 50
              WHEN 'SEVERE' THEN 40
              WHEN 'MODERATE' THEN 30
              WHEN 'MINOR' THEN 20
              ELSE 10
            END
          WHEN r.TYPE = 'FACILITY' AND f.SEVERITY_LEVEL IS NOT NULL THEN
            CASE f.SEVERITY_LEVEL
              WHEN 'CRITICAL' THEN 50
              WHEN 'HIGH' THEN 40
              WHEN 'MEDIUM' THEN 30
              WHEN 'LOW' THEN 20
              ELSE 10
            END
          ELSE 10
        END as PRIORITY_SCORE,
        -- Subquery 5: Count available staff (not overloaded)
        NVL((SELECT COUNT(DISTINCT s.ACCOUNT_ID)
         FROM STAFF s
         WHERE s.ACCOUNT_ID NOT IN (
           SELECT ra.ACCOUNT_ID
           FROM REPORT_ASSIGNMENT ra
           JOIN REPORT rpt ON ra.REPORT_ID = rpt.REPORT_ID
           WHERE rpt.STATUS IN ('PENDING', 'UNDER_INVESTIGATION')
           GROUP BY ra.ACCOUNT_ID
           HAVING COUNT(*) >= 5
         )), 0) as AVAILABLE_STAFF_COUNT
      FROM REPORT r
      JOIN ACCOUNT a ON r.SUBMITTED_BY = a.ACCOUNT_ID
      LEFT JOIN CRIME c ON r.REPORT_ID = c.REPORT_ID AND r.TYPE = 'CRIME'
      LEFT JOIN FACILITY f ON r.REPORT_ID = f.REPORT_ID AND r.TYPE = 'FACILITY'
      WHERE NOT EXISTS (
        SELECT 1 FROM REPORT_ASSIGNMENT ra WHERE ra.REPORT_ID = r.REPORT_ID
      )
      AND r.STATUS = 'PENDING'
      ${typeCondition}
      ORDER BY PRIORITY_SCORE DESC, r.SUBMITTED_AT ASC
    `;

    const result: any = await this.execute(sql, binds);
    return result.rows;
  }


}
