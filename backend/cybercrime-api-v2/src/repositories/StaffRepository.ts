/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseRepository } from './base/BaseRepository';
import { Staff } from '../models/Staff';

export class StaffRepository extends BaseRepository<Staff> {
  constructor() {
    super('STAFF', 'ACCOUNT_ID');
  }

  protected toModel(row: any): Staff {
    return new Staff(row, true); // Skip validation for database records
  }

  async findAll(filters?: Record<string, any>): Promise<Staff[]> {
    let sql = `
      SELECT s.ACCOUNT_ID, s.STAFF_ID, s.ROLE, s.DEPARTMENT, s.POSITION, 
             s.SUPERVISOR_ID, s.CREATED_AT, s.UPDATED_AT,
             a.NAME, a.EMAIL, a.CONTACT_NUMBER, a.AVATAR_URL, a.PASSWORD_HASH, a.ACCOUNT_TYPE,
             sup.NAME as SUPERVISOR_NAME
      FROM ${this.tableName} s
      JOIN ACCOUNT a ON s.ACCOUNT_ID = a.ACCOUNT_ID
      LEFT JOIN ACCOUNT sup ON s.SUPERVISOR_ID = sup.ACCOUNT_ID
    `;
    const binds: any = {};

    if (filters && Object.keys(filters).length > 0) {
      const whereClauses: string[] = [];
      if (filters.role) {
        whereClauses.push('s.ROLE = :role');
        binds.role = filters.role;
      }
      if (filters.department) {
        whereClauses.push('s.DEPARTMENT = :department');
        binds.department = filters.department;
      }
      if (whereClauses.length > 0) {
        sql += ` WHERE ${whereClauses.join(' AND ')}`;
      }
    }

    sql += ' ORDER BY s.CREATED_AT DESC';

    const result: any = await this.execute(sql, binds);
    return result.rows.map((row: any) => this.toModel(row));
  }

  async findById(id: string | number): Promise<Staff | null> {
    const sql = `
      SELECT s.ACCOUNT_ID, s.STAFF_ID, s.ROLE, s.DEPARTMENT, s.POSITION, 
             s.SUPERVISOR_ID, s.CREATED_AT, s.UPDATED_AT,
             a.NAME, a.EMAIL, a.CONTACT_NUMBER, a.AVATAR_URL, a.PASSWORD_HASH, a.ACCOUNT_TYPE,
             sup.NAME as SUPERVISOR_NAME
      FROM ${this.tableName} s
      JOIN ACCOUNT a ON s.ACCOUNT_ID = a.ACCOUNT_ID
      LEFT JOIN ACCOUNT sup ON s.SUPERVISOR_ID = sup.ACCOUNT_ID
      WHERE s.ACCOUNT_ID = :id
    `;
    const result: any = await this.execute(sql, { id });
    
    if (result.rows.length === 0) return null;
    return this.toModel(result.rows[0]);
  }

  async create(staff: Staff): Promise<Staff> {
    const sql = `
      UPDATE ${this.tableName}
      SET STAFF_ID = :staffId,
          ROLE = :role,
          DEPARTMENT = :department,
          POSITION = :position,
          SUPERVISOR_ID = :supervisorId,
          UPDATED_AT = SYSTIMESTAMP
      WHERE ACCOUNT_ID = :accountId AND STAFF_ID IS NULL
    `;

    const binds = {
      staffId: staff.getStaffId(),
      accountId: staff.getId(),
      role: staff.getRole(),
      department: staff.getDepartment(),
      position: staff.getPosition(),
      supervisorId: staff.getSupervisorId() || null
    };

    await this.execute(sql, binds, { autoCommit: true });
    
    const created = await this.findById(staff.getId()!);
    if (!created) {
      throw new Error('Failed to create staff');
    }
    return created;
  }

  async update(id: string | number, updates: any): Promise<Staff> {
    const setClauses: string[] = [];
    const binds: Record<string, any> = { id };

    if (updates.STAFF_ID) {
      setClauses.push('STAFF_ID = :staffId');
      binds.staffId = updates.STAFF_ID;
    }
    if (updates.ROLE || updates.role) {
      setClauses.push('ROLE = :role');
      binds.role = updates.ROLE || updates.role;
    }
    if (updates.DEPARTMENT || updates.department) {
      setClauses.push('DEPARTMENT = :department');
      binds.department = updates.DEPARTMENT || updates.department;
    }
    if (updates.POSITION || updates.position) {
      setClauses.push('POSITION = :position');
      binds.position = updates.POSITION || updates.position;
    }
    if (updates.SUPERVISOR_ID !== undefined || updates.supervisor_id !== undefined) {
      setClauses.push('SUPERVISOR_ID = :supervisorId');
      binds.supervisorId = updates.SUPERVISOR_ID !== undefined ? updates.SUPERVISOR_ID : updates.supervisor_id;
    }

    if (setClauses.length === 0) {
      throw new Error('No fields to update');
    }

    setClauses.push('UPDATED_AT = SYSTIMESTAMP');

    const sql = `
      UPDATE ${this.tableName}
      SET ${setClauses.join(', ')}
      WHERE ACCOUNT_ID = :id
    `;

    await this.execute(sql, binds, { autoCommit: true });
    
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('Failed to update staff');
    }
    return updated;
  }

  async search(query: string, filters?: {department?: string, role?: string}): Promise<Staff[]> {
    let sql = `
      SELECT s.ACCOUNT_ID, s.STAFF_ID, s.ROLE, s.DEPARTMENT, s.POSITION,
             a.NAME, a.EMAIL, a.CONTACT_NUMBER, a.AVATAR_URL, a.PASSWORD_HASH, a.ACCOUNT_TYPE
      FROM ${this.tableName} s
      JOIN ACCOUNT a ON s.ACCOUNT_ID = a.ACCOUNT_ID
      WHERE (UPPER(a.NAME) LIKE :search OR UPPER(a.EMAIL) LIKE :search)
    `;
    const binds: any = { search: `%${query.toUpperCase()}%` };

    if (filters?.department) {
      sql += ' AND s.DEPARTMENT = :department';
      binds.department = filters.department;
    }
    if (filters?.role) {
      sql += ' AND s.ROLE = :role';
      binds.role = filters.role;
    }

    sql += ' ORDER BY a.NAME';
    
    const result: any = await this.execute(sql, binds);
    return result.rows.map((row: any) => this.toModel(row));
  }

  // ============================================================================
// 6. STAFF CURRENT WORKLOAD WITH DATE-BASED URGENCY
// ============================================================================

/**
 * Get current workload for all staff members with date-aware metrics
 * Uses: JOIN, subquery in SELECT, WHERE with AND, date calculations
 */
async getStaffCurrentWorkload(accountId: number): Promise<any[]> {
  const sql = `
    SELECT 
      s.ACCOUNT_ID,
      a.NAME as STAFF_NAME,
      s.ROLE,
      s.DEPARTMENT,
      -- Subquery: Count active assignments
      (SELECT COUNT(*)
       FROM REPORT_ASSIGNMENT ra
       JOIN REPORT r ON ra.REPORT_ID = r.REPORT_ID
       WHERE ra.ACCOUNT_ID = s.ACCOUNT_ID
       AND r.STATUS IN ('PENDING', 'UNDER_INVESTIGATION')) as ACTIVE_CASES,
      -- Subquery: Count cases with no action taken
      (SELECT COUNT(*)
       FROM REPORT_ASSIGNMENT ra
       JOIN REPORT r ON ra.REPORT_ID = r.REPORT_ID
       WHERE ra.ACCOUNT_ID = s.ACCOUNT_ID
       AND r.STATUS IN ('PENDING', 'UNDER_INVESTIGATION')
       AND ra.ACTION_TAKEN IS NULL) as NO_ACTION_CASES,
      -- Subquery: Count overdue cases (>7 days old)
      (SELECT COUNT(*)
       FROM REPORT_ASSIGNMENT ra
       JOIN REPORT r ON ra.REPORT_ID = r.REPORT_ID
       WHERE ra.ACCOUNT_ID = s.ACCOUNT_ID
       AND r.STATUS IN ('PENDING', 'UNDER_INVESTIGATION')
       AND CAST(SYSDATE AS DATE) - CAST(r.SUBMITTED_AT AS DATE) > 7) as OVERDUE_CASES,
      -- Subquery: Count urgent cases (>5 days old)
      (SELECT COUNT(*)
       FROM REPORT_ASSIGNMENT ra
       JOIN REPORT r ON ra.REPORT_ID = r.REPORT_ID
       WHERE ra.ACCOUNT_ID = s.ACCOUNT_ID
       AND r.STATUS IN ('PENDING', 'UNDER_INVESTIGATION')
       AND CAST(SYSDATE AS DATE) - CAST(r.SUBMITTED_AT AS DATE) > 5) as URGENT_CASES,
      -- Subquery: Count recent assignments (last 48 hours)
      (SELECT COUNT(*)
       FROM REPORT_ASSIGNMENT ra
       JOIN REPORT r ON ra.REPORT_ID = r.REPORT_ID
       WHERE ra.ACCOUNT_ID = s.ACCOUNT_ID
       AND r.STATUS IN ('PENDING', 'UNDER_INVESTIGATION')
       AND CAST(SYSDATE AS DATE) - CAST(ra.ASSIGNED_AT AS DATE) <= 2) as RECENT_ASSIGNMENTS,
      -- Subquery: Average age of all active cases
      NVL((SELECT ROUND(AVG(CAST(SYSDATE AS DATE) - CAST(r.SUBMITTED_AT AS DATE)), 1)
       FROM REPORT_ASSIGNMENT ra
       JOIN REPORT r ON ra.REPORT_ID = r.REPORT_ID
       WHERE ra.ACCOUNT_ID = s.ACCOUNT_ID
       AND r.STATUS IN ('PENDING', 'UNDER_INVESTIGATION')), 0) as AVG_CASE_AGE_DAYS,
      -- Subquery: Oldest pending case days
      NVL((SELECT MAX(ROUND(CAST(SYSDATE AS DATE) - CAST(r.SUBMITTED_AT AS DATE), 1))
       FROM REPORT_ASSIGNMENT ra
       JOIN REPORT r ON ra.REPORT_ID = r.REPORT_ID
       WHERE ra.ACCOUNT_ID = s.ACCOUNT_ID
       AND r.STATUS IN ('PENDING', 'UNDER_INVESTIGATION')), 0) as OLDEST_CASE_DAYS,
      -- Subquery: Average time since assignment
      NVL((SELECT ROUND(AVG(CAST(SYSDATE AS DATE) - CAST(ra.ASSIGNED_AT AS DATE)), 1)
       FROM REPORT_ASSIGNMENT ra
       JOIN REPORT r ON ra.REPORT_ID = r.REPORT_ID
       WHERE ra.ACCOUNT_ID = s.ACCOUNT_ID
       AND r.STATUS IN ('PENDING', 'UNDER_INVESTIGATION')), 0) as AVG_DAYS_SINCE_ASSIGNMENT,
      -- Subquery: Cases assigned but no action for >3 days
      (SELECT COUNT(*)
       FROM REPORT_ASSIGNMENT ra
       JOIN REPORT r ON ra.REPORT_ID = r.REPORT_ID
       WHERE ra.ACCOUNT_ID = s.ACCOUNT_ID
       AND r.STATUS IN ('PENDING', 'UNDER_INVESTIGATION')
       AND ra.ACTION_TAKEN IS NULL
       AND CAST(SYSDATE AS DATE) - CAST(ra.ASSIGNED_AT AS DATE) > 3) as STALE_NO_ACTION_CASES,
      -- Calculated: Workload pressure score (considers count + age + overdue)
      (SELECT COUNT(*)
       FROM REPORT_ASSIGNMENT ra
       JOIN REPORT r ON ra.REPORT_ID = r.REPORT_ID
       WHERE ra.ACCOUNT_ID = s.ACCOUNT_ID
       AND r.STATUS IN ('PENDING', 'UNDER_INVESTIGATION')) * 10 +
      NVL((SELECT SUM(
         CASE 
           WHEN CAST(SYSDATE AS DATE) - CAST(r.SUBMITTED_AT AS DATE) > 7 THEN 15
           WHEN CAST(SYSDATE AS DATE) - CAST(r.SUBMITTED_AT AS DATE) > 5 THEN 10
           WHEN CAST(SYSDATE AS DATE) - CAST(r.SUBMITTED_AT AS DATE) > 3 THEN 5
           ELSE 2
         END
       )
       FROM REPORT_ASSIGNMENT ra
       JOIN REPORT r ON ra.REPORT_ID = r.REPORT_ID
       WHERE ra.ACCOUNT_ID = s.ACCOUNT_ID
       AND r.STATUS IN ('PENDING', 'UNDER_INVESTIGATION')), 0) as WORKLOAD_PRESSURE_SCORE,
      -- Enhanced workload status (considers count, age, and overdue)
      CASE 
        WHEN (SELECT COUNT(*)
              FROM REPORT_ASSIGNMENT ra
              JOIN REPORT r ON ra.REPORT_ID = r.REPORT_ID
              WHERE ra.ACCOUNT_ID = s.ACCOUNT_ID
              AND r.STATUS IN ('PENDING', 'UNDER_INVESTIGATION')) >= 10 
        THEN 'CRITICAL_OVERLOADED'
        WHEN (SELECT COUNT(*)
              FROM REPORT_ASSIGNMENT ra
              JOIN REPORT r ON ra.REPORT_ID = r.REPORT_ID
              WHERE ra.ACCOUNT_ID = s.ACCOUNT_ID
              AND r.STATUS IN ('PENDING', 'UNDER_INVESTIGATION')
              AND CAST(SYSDATE AS DATE) - CAST(r.SUBMITTED_AT AS DATE) > 7) >= 3
        THEN 'CRITICAL_OVERDUE'
        WHEN (SELECT COUNT(*)
              FROM REPORT_ASSIGNMENT ra
              JOIN REPORT r ON ra.REPORT_ID = r.REPORT_ID
              WHERE ra.ACCOUNT_ID = s.ACCOUNT_ID
              AND r.STATUS IN ('PENDING', 'UNDER_INVESTIGATION')) >= 8 
        THEN 'OVERLOADED'
        WHEN (SELECT COUNT(*)
              FROM REPORT_ASSIGNMENT ra
              JOIN REPORT r ON ra.REPORT_ID = r.REPORT_ID
              WHERE ra.ACCOUNT_ID = s.ACCOUNT_ID
              AND r.STATUS IN ('PENDING', 'UNDER_INVESTIGATION')) >= 5 
             OR (SELECT COUNT(*)
                 FROM REPORT_ASSIGNMENT ra
                 JOIN REPORT r ON ra.REPORT_ID = r.REPORT_ID
                 WHERE ra.ACCOUNT_ID = s.ACCOUNT_ID
                 AND r.STATUS IN ('PENDING', 'UNDER_INVESTIGATION')
                 AND CAST(SYSDATE AS DATE) - CAST(r.SUBMITTED_AT AS DATE) > 7) >= 2
        THEN 'BUSY'
        WHEN (SELECT COUNT(*)
              FROM REPORT_ASSIGNMENT ra
              JOIN REPORT r ON ra.REPORT_ID = r.REPORT_ID
              WHERE ra.ACCOUNT_ID = s.ACCOUNT_ID
              AND r.STATUS IN ('PENDING', 'UNDER_INVESTIGATION')) >= 2 
        THEN 'MODERATE'
        WHEN (SELECT COUNT(*)
              FROM REPORT_ASSIGNMENT ra
              JOIN REPORT r ON ra.REPORT_ID = r.REPORT_ID
              WHERE ra.ACCOUNT_ID = s.ACCOUNT_ID
              AND r.STATUS IN ('PENDING', 'UNDER_INVESTIGATION')) >= 1 
        THEN 'LIGHT'
        ELSE 'AVAILABLE'
      END as WORKLOAD_STATUS
    FROM STAFF s
    JOIN ACCOUNT a ON s.ACCOUNT_ID = a.ACCOUNT_ID
    WHERE a.ACCOUNT_TYPE = 'STAFF'
    AND s.ACCOUNT_ID = :accountId
    ORDER BY WORKLOAD_PRESSURE_SCORE DESC
  `;
  const bind = { accountId };
  const result: any = await this.execute(sql, bind);
  return result.rows;
}
}

