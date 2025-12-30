/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReportAssignment } from '../models/ReportAssignment';
import { BaseRepository } from './base/BaseRepository';
import oracledb from 'oracledb';

export class ReportAssignmentRepository extends BaseRepository<ReportAssignment> {
  protected tableName = 'REPORT_ASSIGNMENT';

  constructor() {
    super('REPORT_ASSIGNMENT', 'ASSIGNMENT_ID');
  }

  protected toModel(row: any): ReportAssignment {
    return new ReportAssignment({
      ASSIGNMENT_ID: row.ASSIGNMENT_ID,
      REPORT_ID: row.REPORT_ID,
      ACCOUNT_ID: row.ACCOUNT_ID,
      ASSIGNED_AT: row.ASSIGNED_AT,
      ACTION_TAKEN: row.ACTION_TAKEN,
      ADDITIONAL_FEEDBACK: row.ADDITIONAL_FEEDBACK,
      // Include related data from JOINs
      REPORT_TITLE: row.REPORT_TITLE,
      STAFF_NAME: row.STAFF_NAME,
      STAFF_EMAIL: row.STAFF_EMAIL
    });
  }

  async findAll(): Promise<ReportAssignment[]> {
    const sql = `
      SELECT ra.*,
             r.TITLE as REPORT_TITLE,
             assigned.NAME as ASSIGNED_TO_NAME,
             assigner.NAME as ASSIGNED_BY_NAME
      FROM ${this.tableName} ra
      JOIN REPORT r ON ra.REPORT_ID = r.REPORT_ID
      JOIN ACCOUNT assigned ON ra.ASSIGNED_TO = assigned.ACCOUNT_ID
      JOIN ACCOUNT assigner ON ra.ASSIGNED_BY = assigner.ACCOUNT_ID
      ORDER BY ra.ASSIGNED_AT DESC
    `;

    const result: any = await this.execute(sql);
    return result.rows.map((row: any) => this.toModel(row));
  }

  async findById(id: string | number): Promise<ReportAssignment | null> {
    const sql = `
      SELECT ra.*,
             r.TITLE as REPORT_TITLE,
             assigned.NAME as ASSIGNED_TO_NAME,
             assigner.NAME as ASSIGNED_BY_NAME
      FROM ${this.tableName} ra
      JOIN REPORT r ON ra.REPORT_ID = r.REPORT_ID
      JOIN ACCOUNT assigned ON ra.ASSIGNED_TO = assigned.ACCOUNT_ID
      JOIN ACCOUNT assigner ON ra.ASSIGNED_BY = assigner.ACCOUNT_ID
      WHERE ra.ASSIGNMENT_ID = :id
    `;
    const result: any = await this.execute(sql, { id });
    
    if (result.rows.length === 0) return null;
    return this.toModel(result.rows[0]);
  }

  async findByReport(reportId: number): Promise<ReportAssignment[]> {
    const sql = `
      SELECT ra.*,
             r.TITLE as REPORT_TITLE,
             assigned.NAME as ASSIGNED_TO_NAME,
             assigner.NAME as ASSIGNED_BY_NAME
      FROM ${this.tableName} ra
      JOIN REPORT r ON ra.REPORT_ID = r.REPORT_ID
      JOIN ACCOUNT assigned ON ra.ASSIGNED_TO = assigned.ACCOUNT_ID
      JOIN ACCOUNT assigner ON ra.ASSIGNED_BY = assigner.ACCOUNT_ID
      WHERE ra.REPORT_ID = :reportId
      ORDER BY ra.ASSIGNED_AT DESC
    `;

    const result: any = await this.execute(sql, { reportId });
    return result.rows.map((row: any) => this.toModel(row));
  }

  async findByAssignedTo(staffId: number): Promise<ReportAssignment[]> {
    const sql = `
      SELECT ra.*,
             r.TITLE as REPORT_TITLE,
             assigned.NAME as ASSIGNED_TO_NAME,
             assigner.NAME as ASSIGNED_BY_NAME
      FROM ${this.tableName} ra
      JOIN REPORT r ON ra.REPORT_ID = r.REPORT_ID
      JOIN ACCOUNT assigned ON ra.ASSIGNED_TO = assigned.ACCOUNT_ID
      JOIN ACCOUNT assigner ON ra.ASSIGNED_BY = assigner.ACCOUNT_ID
      WHERE ra.ASSIGNED_TO = :staffId
      ORDER BY ra.ASSIGNED_AT DESC
    `;

    const result: any = await this.execute(sql, { staffId });
    return result.rows.map((row: any) => this.toModel(row));
  }

  async findByAssignedBy(staffId: number): Promise<ReportAssignment[]> {
    const sql = `
      SELECT ra.*,
             r.TITLE as REPORT_TITLE,
             assigned.NAME as ASSIGNED_TO_NAME,
             assigner.NAME as ASSIGNED_BY_NAME
      FROM ${this.tableName} ra
      JOIN REPORT r ON ra.REPORT_ID = r.REPORT_ID
      JOIN ACCOUNT assigned ON ra.ASSIGNED_TO = assigned.ACCOUNT_ID
      JOIN ACCOUNT assigner ON ra.ASSIGNED_BY = assigner.ACCOUNT_ID
      WHERE ra.ASSIGNED_BY = :staffId
      ORDER BY ra.ASSIGNED_AT DESC
    `;

    const result: any = await this.execute(sql, { staffId });
    return result.rows.map((row: any) => this.toModel(row));
  }

  async create(assignment: ReportAssignment): Promise<ReportAssignment> {
    const sql = `
      INSERT INTO ${this.tableName} (
        ASSIGNMENT_ID, REPORT_ID, ACCOUNT_ID, ASSIGNED_AT, ACTION_TAKEN
      ) VALUES (
        assignment_seq.NEXTVAL, :reportId, :accountId, 
        SYSTIMESTAMP, :actionTaken
      ) RETURNING ASSIGNMENT_ID INTO :id
    `;

    const binds = {
      reportId: assignment.getReportId(),
      accountId: assignment.getAccountId(),
      actionTaken: assignment.getActionTaken() || null,
      id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
    };

    const result: any = await this.execute(sql, binds, { autoCommit: true });
    const newId = result.outBinds.id[0];

    const created = await this.findById(newId);
    if (!created) {
      throw new Error('Failed to create assignment');
    }
    return created;
  }

  async update(id: number, updates: any): Promise<ReportAssignment> {
    const setClauses: string[] = [];
    const binds: any = { id };

    if (updates.NOTES !== undefined) {
      setClauses.push('NOTES = :notes');
      binds.notes = updates.NOTES;
    }

    if (setClauses.length === 0) {
      throw new Error('No fields to update');
    }

    const sql = `
      UPDATE ${this.tableName}
      SET ${setClauses.join(', ')}
      WHERE ASSIGNMENT_ID = :id
    `;

    await this.execute(sql, binds, { autoCommit: true });

    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('Failed to update assignment');
    }
    return updated;
  }

  async deleteByReport(reportId: number): Promise<boolean> {
    const sql = `DELETE FROM ${this.tableName} WHERE REPORT_ID = :reportId`;
    const result: any = await this.execute(sql, { reportId }, { autoCommit: true });
    return result.rowsAffected > 0;
  }

  /**
   * Find all assignments with report and staff details
   */
  async findAllWithDetails(): Promise<any[]> {
    const sql = `
      SELECT ra.ASSIGNMENT_ID, ra.ACCOUNT_ID, ra.REPORT_ID, ra.ASSIGNED_AT, 
             ra.ACTION_TAKEN, ra.ADDITIONAL_FEEDBACK,
             r.TITLE as REPORT_TITLE, r.TYPE as REPORT_TYPE, r.STATUS as REPORT_STATUS, 
             r.LOCATION as REPORT_LOCATION, r.SUBMITTED_AT as REPORT_SUBMITTED_AT,
             a.NAME as STAFF_NAME, a.EMAIL as STAFF_EMAIL
      FROM ${this.tableName} ra
      JOIN REPORT r ON ra.REPORT_ID = r.REPORT_ID
      JOIN ACCOUNT a ON ra.ACCOUNT_ID = a.ACCOUNT_ID
      ORDER BY ra.ASSIGNED_AT DESC
    `;
    
    const result: any = await this.execute(sql, {});
    return result.rows;
  }

  /**
   * Find assignments by staff/account ID
   */
  async findByStaffId(accountId: number): Promise<any[]> {
    const sql = `
      SELECT ra.ASSIGNMENT_ID, ra.ACCOUNT_ID, ra.REPORT_ID, ra.ASSIGNED_AT, 
             ra.ACTION_TAKEN, ra.ADDITIONAL_FEEDBACK, ra.UPDATED_AT,
             r.TITLE as REPORT_TITLE, r.TYPE as REPORT_TYPE, r.STATUS as REPORT_STATUS,
             r.LOCATION as REPORT_LOCATION, r.SUBMITTED_AT as REPORT_SUBMITTED_AT,
             r.DESCRIPTION as REPORT_DESCRIPTION
      FROM ${this.tableName} ra
      JOIN REPORT r ON ra.REPORT_ID = r.REPORT_ID
      WHERE ra.ACCOUNT_ID = :account_id
      ORDER BY ra.ASSIGNED_AT DESC
    `;
    
    const result: any = await this.execute(sql, { account_id: accountId });
    
    // Transform the data to match frontend expectations
    return result.rows.map((row: any) => ({
      ASSIGNMENT_ID: row.ASSIGNMENT_ID,
      ACCOUNT_ID: row.ACCOUNT_ID,
      REPORT_ID: row.REPORT_ID,
      ASSIGNED_AT: row.ASSIGNED_AT,
      ACTION_TAKEN: row.ACTION_TAKEN,
      ADDITIONAL_FEEDBACK: row.ADDITIONAL_FEEDBACK,
      UPDATED_AT: row.UPDATED_AT,
      // Map to frontend-expected field names
      TITLE: row.REPORT_TITLE,
      TYPE: row.REPORT_TYPE,
      STATUS: row.REPORT_STATUS,
      LOCATION: row.REPORT_LOCATION,
      SUBMITTED_AT: row.REPORT_SUBMITTED_AT,
      DESCRIPTION: row.REPORT_DESCRIPTION
    }));
  }

  /**
   * Find assignments by report ID
   */
  async findByReportId(reportId: number): Promise<any[]> {
    const sql = `
      SELECT ra.ASSIGNMENT_ID, ra.ACCOUNT_ID, ra.REPORT_ID, ra.ASSIGNED_AT, 
             ra.ACTION_TAKEN, ra.ADDITIONAL_FEEDBACK,
             a.NAME as STAFF_NAME, a.EMAIL as STAFF_EMAIL
      FROM ${this.tableName} ra
      JOIN ACCOUNT a ON ra.ACCOUNT_ID = a.ACCOUNT_ID
      WHERE ra.REPORT_ID = :report_id
      ORDER BY ra.ASSIGNED_AT DESC
    `;
    
    const result: any = await this.execute(sql, { report_id: reportId });
    return result.rows;
  }

  /**
   * Create new assignment and update report status
   */
  async createAssignment(data: any): Promise<number> {
    const sql = `
      INSERT INTO ${this.tableName} (
        ASSIGNMENT_ID, ACCOUNT_ID, REPORT_ID, ASSIGNED_AT, 
        ACTION_TAKEN, ADDITIONAL_FEEDBACK
      ) VALUES (
        assignment_seq.NEXTVAL, :account_id, :report_id, SYSTIMESTAMP, 
        :action_taken, :additional_feedback
      ) RETURNING ASSIGNMENT_ID INTO :id
    `;
    
    const binds = {
      account_id: data.ACCOUNT_ID,
      report_id: data.REPORT_ID,
      action_taken: data.ACTION_TAKEN || null,
      additional_feedback: data.ADDITIONAL_FEEDBACK || null,
      id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
    };

    const result: any = await this.execute(sql, binds, { autoCommit: true });

    // Update report status to IN_PROGRESS
    const updateSql = `
      UPDATE REPORT 
      SET STATUS = 'IN_PROGRESS', UPDATED_AT = SYSTIMESTAMP 
      WHERE REPORT_ID = :report_id
    `;
    
    await this.execute(updateSql, { report_id: data.REPORT_ID }, { autoCommit: true });

    return result.outBinds.id[0];
  }

  /**
   * Update assignment
   */
  async updateAssignment(id: number, updates: any): Promise<void> {
    const setClauses: string[] = [];
    const binds: any = { id };

    if (updates.ACTION_TAKEN !== undefined || updates.action_taken !== undefined) {
      setClauses.push('ACTION_TAKEN = :action_taken');
      binds.action_taken = updates.ACTION_TAKEN || updates.action_taken;
    }

    if (updates.ADDITIONAL_FEEDBACK !== undefined || updates.additional_feedback !== undefined) {
      setClauses.push('ADDITIONAL_FEEDBACK = :additional_feedback');
      binds.additional_feedback = updates.ADDITIONAL_FEEDBACK || updates.additional_feedback;
    }

    if (setClauses.length === 0) {
      return; // Nothing to update
    }

    const sql = `
      UPDATE ${this.tableName}
      SET ${setClauses.join(', ')}
      WHERE ASSIGNMENT_ID = :id
    `;

    await this.execute(sql, binds, { autoCommit: true });
  }

  /**
   * Bulk update assignments
   */
  async bulkUpdate(ids: number[], updates: any): Promise<number> {
    let updatedCount = 0;

    for (const id of ids) {
      try {
        await this.updateAssignment(id, updates);
        updatedCount++;
      } catch (error) {
        console.error(`Failed to update assignment ${id}:`, error);
      }
    }

    return updatedCount;
  }
}
