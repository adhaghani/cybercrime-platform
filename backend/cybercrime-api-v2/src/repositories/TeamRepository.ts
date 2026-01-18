/* eslint-disable @typescript-eslint/no-explicit-any */
import { Team, TeamData } from '../models/Team';
import { StaffData } from '../models/Staff';
import { BaseRepository } from './base/BaseRepository';
import { AccountType } from '../types/enums';

/**
 * TeamRepository - Manages team queries based on the hierarchical Staff structure
 * Teams are formed by the SUPERVISOR_ID relationship in the STAFF table
 */
export class TeamRepository extends BaseRepository<Team> {
  constructor() {
    super('STAFF', 'ACCOUNT_ID');
  }

  protected toModel(row: any): Team {
    throw new Error('Not implemented - use specific methods that build Team objects');
  }

  // Override abstract methods (not used for Team since it's a DTO)
  async create(team: Team): Promise<Team> {
    throw new Error('Teams cannot be created directly - they are formed by staff supervisor relationships');
  }

  async update(id: number, updates: any): Promise<Team> {
    throw new Error('Teams cannot be updated directly - update staff supervisor relationships instead');
  }

  /**
   * Convert database row to StaffData
   */
  private rowToStaffData(row: any): StaffData {
    return {
      ACCOUNT_ID: row.ACCOUNT_ID,
      STAFF_ID: row.STAFF_ID,
      ROLE: row.ROLE,
      DEPARTMENT: row.DEPARTMENT,
      POSITION: row.POSITION,
      SUPERVISOR_ID: row.SUPERVISOR_ID,
      NAME: row.NAME,
      EMAIL: row.EMAIL,
      CONTACT_NUMBER: row.CONTACT_NUMBER,
      AVATAR_URL: row.AVATAR_URL,
      ACCOUNT_TYPE: row.ACCOUNT_TYPE,
      PASSWORD_HASH: '',
      CREATED_AT: row.CREATED_AT,
      UPDATED_AT: row.UPDATED_AT
    };
  }

  /**
   * Get report statistics for a team (supervisor and members)
   */
  private async getTeamStatistics(supervisorId: number, memberIds: number[]): Promise<any> {
    // Combine supervisor and all member IDs
    const allStaffIds = [supervisorId, ...memberIds];
    
    if (allStaffIds.length === 0) {
      return {
        totalReports: 0,
        assignedReports: 0,
        resolvedReports: 0,
        pendingReports: 0,
        inProgressReports: 0
      };
    }

    // Build parameterized query placeholders for SQL IN clause
    // Example: [1, 2, 3] becomes ':id0, :id1, :id2'
    const placeholders = allStaffIds.map((_, index) => `:id${index}`).join(', ');
    
    // Create bindings object mapping each placeholder to its actual value
    // Example: { id0: 1, id1: 2, id2: 3 }
    const binds: any = {};
    allStaffIds.forEach((staffId, index) => {
      binds[`id${index}`] = staffId;
    });

    const sql = `
      SELECT 
        COUNT(*) as TOTAL_REPORTS,
        COUNT(ra.ASSIGNMENT_ID) as ASSIGNED_REPORTS,
        SUM(CASE WHEN r.STATUS = 'RESOLVED' THEN 1 ELSE 0 END) as RESOLVED_REPORTS,
        SUM(CASE WHEN r.STATUS = 'PENDING' THEN 1 ELSE 0 END) as PENDING_REPORTS,
        SUM(CASE WHEN r.STATUS = 'IN_PROGRESS' THEN 1 ELSE 0 END) as IN_PROGRESS_REPORTS
      FROM REPORT_ASSIGNMENT ra
      JOIN REPORT r ON ra.REPORT_ID = r.REPORT_ID
      WHERE ra.ACCOUNT_ID IN (${placeholders})
    `;

    const result: any = await this.execute(sql, binds);
    const stats = result.rows[0];

    return {
      totalReports: Number(stats.TOTAL_REPORTS) || 0,
      assignedReports: Number(stats.ASSIGNED_REPORTS) || 0,
      resolvedReports: Number(stats.RESOLVED_REPORTS) || 0,
      pendingReports: Number(stats.PENDING_REPORTS) || 0,
      inProgressReports: Number(stats.IN_PROGRESS_REPORTS) || 0
    };
  }

  /**
   * Get all teams - returns all supervisors with their team members and statistics
   */
  async getAllTeams(): Promise<Team[]> {
    // First, get all supervisors
    const supervisorsSql = `
      SELECT 
        s.ACCOUNT_ID as SUPERVISOR_ID,
        a.NAME as SUPERVISOR_NAME,
        a.EMAIL as SUPERVISOR_EMAIL,
        a.CONTACT_NUMBER as SUPERVISOR_CONTACT,
        a.AVATAR_URL as SUPERVISOR_AVATAR_URL,
        s.STAFF_ID as SUPERVISOR_STAFF_ID,
        s.ROLE as SUPERVISOR_ROLE,
        s.DEPARTMENT as SUPERVISOR_DEPARTMENT,
        s.POSITION as SUPERVISOR_POSITION,
        COUNT(team.ACCOUNT_ID) as TEAM_SIZE
      FROM STAFF s
      JOIN ACCOUNT a ON s.ACCOUNT_ID = a.ACCOUNT_ID
      LEFT JOIN STAFF team ON team.SUPERVISOR_ID = s.ACCOUNT_ID AND team.ACCOUNT_ID != s.ACCOUNT_ID
      WHERE s.ROLE = 'SUPERVISOR'
      GROUP BY s.ACCOUNT_ID, a.NAME, a.EMAIL, a.CONTACT_NUMBER, a.AVATAR_URL, 
               s.STAFF_ID, s.ROLE, s.DEPARTMENT, s.POSITION
      ORDER BY TEAM_SIZE DESC, a.NAME
    `;

    const supervisorResult: any = await this.execute(supervisorsSql);
    const supervisors = supervisorResult.rows;

    // For each supervisor, get their team members and statistics
    const teams: Team[] = [];
    for (const supervisor of supervisors) {
      const membersSql = `
        SELECT 
          s.ACCOUNT_ID,
          s.STAFF_ID,
          s.ROLE,
          s.DEPARTMENT,
          s.POSITION,
          s.SUPERVISOR_ID,
          a.NAME,
          a.AVATAR_URL,
          a.EMAIL,
          a.CONTACT_NUMBER,
          a.ACCOUNT_TYPE,
          a.CREATED_AT,
          a.UPDATED_AT
        FROM STAFF s
        JOIN ACCOUNT a ON s.ACCOUNT_ID = a.ACCOUNT_ID
        WHERE s.SUPERVISOR_ID = :supervisorId AND s.ACCOUNT_ID != :supervisorId
        ORDER BY a.NAME
      `;

      const membersResult: any = await this.execute(membersSql, { 
        supervisorId: supervisor.SUPERVISOR_ID 
      });

      const supervisorData: StaffData = {
        ACCOUNT_ID: supervisor.SUPERVISOR_ID,
        STAFF_ID: supervisor.SUPERVISOR_STAFF_ID,
        ROLE: supervisor.SUPERVISOR_ROLE,
        DEPARTMENT: supervisor.SUPERVISOR_DEPARTMENT,
        POSITION: supervisor.SUPERVISOR_POSITION,
        NAME: supervisor.SUPERVISOR_NAME,
        EMAIL: supervisor.SUPERVISOR_EMAIL,
        CONTACT_NUMBER: supervisor.SUPERVISOR_CONTACT,
        AVATAR_URL: supervisor.SUPERVISOR_AVATAR_URL,
        ACCOUNT_TYPE: AccountType.STAFF,
        PASSWORD_HASH: ''
      };

      const members: StaffData[] = membersResult.rows.map((row: any) => this.rowToStaffData(row));
      const memberIds = members.map(m => m.ACCOUNT_ID).filter((id): id is number => id !== undefined);

      // Get team statistics
      const statistics = await this.getTeamStatistics(supervisor.SUPERVISOR_ID, memberIds);

      const teamData: TeamData = {
        supervisor: supervisorData,
        members,
        teamSize: supervisor.TEAM_SIZE,
        statistics
      };

      teams.push(new Team(teamData));
    }

    return teams;
  }

  /**
   * Get a team by supervisor ID
   */
  async getTeamBySupervisorId(supervisorId: number): Promise<Team | null> {
    // Get supervisor info
    const supervisorSql = `
      SELECT 
        s.ACCOUNT_ID,
        s.STAFF_ID,
        s.ROLE,
        s.DEPARTMENT,
        s.POSITION,
        s.SUPERVISOR_ID,
        a.NAME,
        a.EMAIL,
        a.CONTACT_NUMBER,
        a.AVATAR_URL,
        a.ACCOUNT_TYPE,
        a.CREATED_AT,
        a.UPDATED_AT
      FROM STAFF s
      JOIN ACCOUNT a ON s.ACCOUNT_ID = a.ACCOUNT_ID
      WHERE s.ACCOUNT_ID = :supervisorId AND s.ROLE = 'SUPERVISOR'
    `;

    const supervisorResult: any = await this.execute(supervisorSql, { supervisorId });
    
    if (supervisorResult.rows.length === 0) {
      return null;
    }

    const supervisorData = this.rowToStaffData(supervisorResult.rows[0]);

    // Get team members
    const membersSql = `
      SELECT 
        s.ACCOUNT_ID,
        s.STAFF_ID,
        s.ROLE,
        s.DEPARTMENT,
        s.POSITION,
        s.SUPERVISOR_ID,
        a.NAME,
        a.AVATAR_URL,
        a.EMAIL,
        a.CONTACT_NUMBER,
        a.ACCOUNT_TYPE,
        a.CREATED_AT,
        a.UPDATED_AT
      FROM STAFF s
      JOIN ACCOUNT a ON s.ACCOUNT_ID = a.ACCOUNT_ID
      WHERE s.SUPERVISOR_ID = :supervisorId AND s.ACCOUNT_ID != :supervisorId
      ORDER BY a.NAME
    `;

    const membersResult: any = await this.execute(membersSql, { supervisorId });
    const members: StaffData[] = membersResult.rows.map((row: any) => this.rowToStaffData(row));

    const teamData: TeamData = {
      supervisor: supervisorData,
      members,
      teamSize: members.length
    };

    return new Team(teamData);
  }

  /**
   * Get the current user's team (whether they are a supervisor or a team member)
   */
  async getMyTeam(accountId: number): Promise<any> {
    // Get current user's details
    const userSql = `
      SELECT 
        s.ACCOUNT_ID,
        s.STAFF_ID,
        s.ROLE,
        s.DEPARTMENT,
        s.POSITION,
        s.SUPERVISOR_ID,
        a.NAME,
        a.EMAIL,
        a.AVATAR_URL,
        a.CONTACT_NUMBER,
        a.ACCOUNT_TYPE,
        a.CREATED_AT,
        a.UPDATED_AT
      FROM STAFF s
      JOIN ACCOUNT a ON s.ACCOUNT_ID = a.ACCOUNT_ID
      WHERE s.ACCOUNT_ID = :accountId
    `;

    const userResult: any = await this.execute(userSql, { accountId });
    
    if (userResult.rows.length === 0) {
      return null;
    }

    const currentUser = this.rowToStaffData(userResult.rows[0]);
    let supervisor: StaffData | null = null;
    let teamMembers: StaffData[] = [];

    // If user is a supervisor, get their team
    if (currentUser.ROLE === 'SUPERVISOR') {
      const teamSql = `
        SELECT 
          s.ACCOUNT_ID,
          s.STAFF_ID,
          s.ROLE,
          s.DEPARTMENT,
          s.POSITION,
          s.SUPERVISOR_ID,
          a.AVATAR_URL,
          a.NAME,
          a.EMAIL,
          a.CONTACT_NUMBER,
          a.ACCOUNT_TYPE,
          a.CREATED_AT,
          a.UPDATED_AT
        FROM STAFF s
        JOIN ACCOUNT a ON s.ACCOUNT_ID = a.ACCOUNT_ID
        WHERE s.SUPERVISOR_ID = :supervisorId AND s.ACCOUNT_ID != :supervisorId
        ORDER BY a.NAME
      `;

      const teamResult: any = await this.execute(teamSql, { supervisorId: accountId });
      teamMembers = teamResult.rows.map((row: any) => this.rowToStaffData(row));
    } else if (currentUser.SUPERVISOR_ID) {
      // If user has a supervisor, get supervisor details
      const supervisorSql = `
        SELECT 
          s.ACCOUNT_ID,
          s.STAFF_ID,
          s.ROLE,
          s.DEPARTMENT,
          s.POSITION,
          s.SUPERVISOR_ID,
          a.NAME,
          a.AVATAR_URL,
          a.EMAIL,
          a.CONTACT_NUMBER,
          a.ACCOUNT_TYPE,
          a.CREATED_AT,
          a.UPDATED_AT
        FROM STAFF s
        JOIN ACCOUNT a ON s.ACCOUNT_ID = a.ACCOUNT_ID
        WHERE s.ACCOUNT_ID = :supervisorId
      `;

      const supervisorResult: any = await this.execute(supervisorSql, { 
        supervisorId: currentUser.SUPERVISOR_ID 
      });
      
      if (supervisorResult.rows.length > 0) {
        supervisor = this.rowToStaffData(supervisorResult.rows[0]);
      }

      // Get other team members with same supervisor
      const teamSql = `
        SELECT 
          s.ACCOUNT_ID,
          s.STAFF_ID,
          s.ROLE,
          s.DEPARTMENT,
          s.POSITION,
          s.SUPERVISOR_ID,
          a.NAME,
          a.EMAIL,
          a.AVATAR_URL,
          a.CONTACT_NUMBER,
          a.ACCOUNT_TYPE,
          a.CREATED_AT,
          a.UPDATED_AT
        FROM STAFF s
        JOIN ACCOUNT a ON s.ACCOUNT_ID = a.ACCOUNT_ID
        WHERE s.SUPERVISOR_ID = :supervisorId AND s.ACCOUNT_ID != :currentUserId
        ORDER BY a.NAME
      `;

      const teamResult: any = await this.execute(teamSql, { 
        supervisorId: currentUser.SUPERVISOR_ID,
        currentUserId: accountId
      });
      teamMembers = teamResult.rows.map((row: any) => this.rowToStaffData(row));
    }

    return {
      currentUser,
      supervisor,
      teamMembers,
      teamSize: teamMembers.length
    };
  }

  /**
   * Get team members for a specific supervisor
   */
  async getTeamMembers(supervisorId: number): Promise<StaffData[]> {
    const sql = `
      SELECT 
        s.ACCOUNT_ID,
        s.STAFF_ID,
        s.ROLE,
        s.DEPARTMENT,
        s.POSITION,
        s.SUPERVISOR_ID,
        a.NAME,
        a.EMAIL,
        a.CONTACT_NUMBER,
        a.AVATAR_URL,
        a.ACCOUNT_TYPE,
        a.CREATED_AT,
        a.UPDATED_AT
      FROM STAFF s
      JOIN ACCOUNT a ON s.ACCOUNT_ID = a.ACCOUNT_ID
      WHERE s.SUPERVISOR_ID = :supervisorId
      ORDER BY a.NAME
    `;

    const result: any = await this.execute(sql, { supervisorId });
    return result.rows.map((row: any) => this.rowToStaffData(row));
  }

  /**
   * Search teams by supervisor name, department, or position
   */
  async searchTeams(query: string): Promise<Team[]> {
    const sql = `
      SELECT 
        s.ACCOUNT_ID as SUPERVISOR_ID,
        a.NAME as SUPERVISOR_NAME,
        a.EMAIL as SUPERVISOR_EMAIL,
        a.CONTACT_NUMBER as SUPERVISOR_CONTACT,
        a.AVATAR_URL as SUPERVISOR_AVATAR_URL,
        s.STAFF_ID as SUPERVISOR_STAFF_ID,
        s.ROLE as SUPERVISOR_ROLE,
        s.DEPARTMENT as SUPERVISOR_DEPARTMENT,
        s.POSITION as SUPERVISOR_POSITION,
        COUNT(team.ACCOUNT_ID) as TEAM_SIZE
      FROM STAFF s
      JOIN ACCOUNT a ON s.ACCOUNT_ID = a.ACCOUNT_ID
      LEFT JOIN STAFF team ON team.SUPERVISOR_ID = s.ACCOUNT_ID AND team.ACCOUNT_ID != s.ACCOUNT_ID
      WHERE s.ROLE = 'SUPERVISOR'
        AND (
          UPPER(a.NAME) LIKE :search
          OR UPPER(s.DEPARTMENT) LIKE :search
          OR UPPER(s.POSITION) LIKE :search
        )
      GROUP BY s.ACCOUNT_ID, a.NAME, a.EMAIL, a.CONTACT_NUMBER, a.AVATAR_URL, 
               s.STAFF_ID, s.ROLE, s.DEPARTMENT, s.POSITION
      ORDER BY a.NAME
    `;

    const result: any = await this.execute(sql, { search: `%${query.toUpperCase()}%` });
    const supervisors = result.rows;

    const teams: Team[] = [];
    for (const supervisor of supervisors) {
      const team = await this.getTeamBySupervisorId(supervisor.SUPERVISOR_ID);
      if (team) {
        teams.push(team);
      }
    }

    return teams;
  }

  async getAllTeamPerformanceMetrics(): Promise<any[]> {
    const sql = `
      WITH TeamMembers AS (
    -- Subquery 1: Get all team members including supervisors
    SELECT 
      COALESCE(s.SUPERVISOR_ID, s.ACCOUNT_ID) as TEAM_ID,
      s.ACCOUNT_ID as MEMBER_ID,
      a.NAME as MEMBER_NAME,
      s.ROLE,
      s.DEPARTMENT
    FROM STAFF s
    JOIN ACCOUNT a ON s.ACCOUNT_ID = a.ACCOUNT_ID
    WHERE s.ROLE IN ('SUPERVISOR', 'STAFF', 'OFFICER')
  ),
  
  TeamAssignments AS (
    -- Subquery 2: Get all report assignments for team members
    SELECT 
      tm.TEAM_ID,
      ra.REPORT_ID,
      ra.ACCOUNT_ID,
      ra.ASSIGNED_AT,
      r.STATUS,
      r.SUBMITTED_AT,
      res.RESOLVED_AT,
      -- Calculate resolution time in days
      CASE 
        WHEN res.RESOLVED_AT IS NOT NULL 
        THEN ROUND((CAST(res.RESOLVED_AT AS DATE) - CAST(ra.ASSIGNED_AT AS DATE)), 2)
        ELSE NULL
      END as RESOLUTION_TIME_DAYS,
      -- Calculate time to first action (days from report creation to assignment)
      ROUND((CAST(ra.ASSIGNED_AT AS DATE) - CAST(r.SUBMITTED_AT AS DATE)), 2) as RESPONSE_TIME_DAYS
    FROM TeamMembers tm
    JOIN REPORT_ASSIGNMENT ra ON tm.MEMBER_ID = ra.ACCOUNT_ID
    JOIN REPORT r ON ra.REPORT_ID = r.REPORT_ID
    LEFT JOIN RESOLUTION res ON r.REPORT_ID = res.REPORT_ID
  ),
  
  TeamStats AS (
    -- Subquery 3: Calculate aggregate statistics per team
    SELECT 
      ta.TEAM_ID,
      COUNT(DISTINCT ta.REPORT_ID) as TOTAL_CASES,
      COUNT(DISTINCT CASE WHEN ta.STATUS = 'RESOLVED' THEN ta.REPORT_ID END) as RESOLVED_CASES,
      COUNT(DISTINCT CASE WHEN ta.STATUS IN ('PENDING', 'IN_PROGRESS') THEN ta.REPORT_ID END) as ACTIVE_CASES,
      AVG(ta.RESOLUTION_TIME_DAYS) as AVG_RESOLUTION_TIME,
      AVG(ta.RESPONSE_TIME_DAYS) as AVG_RESPONSE_TIME,
      MIN(ta.ASSIGNED_AT) as FIRST_ASSIGNMENT_DATE,
      MAX(ta.ASSIGNED_AT) as LAST_ASSIGNMENT_DATE
    FROM TeamAssignments ta
    GROUP BY ta.TEAM_ID
  ),
  
  SupervisorInfo AS (
    -- Subquery 4: Get supervisor details for each team
    SELECT 
      s.ACCOUNT_ID as TEAM_ID,
      a.NAME as SUPERVISOR_NAME,
      s.DEPARTMENT,
      s.POSITION,
      a.EMAIL as SUPERVISOR_EMAIL,
      COUNT(DISTINCT team_member.ACCOUNT_ID) as TEAM_SIZE
    FROM STAFF s
    JOIN ACCOUNT a ON s.ACCOUNT_ID = a.ACCOUNT_ID
    LEFT JOIN STAFF team_member ON team_member.SUPERVISOR_ID = s.ACCOUNT_ID 
      AND team_member.ACCOUNT_ID != s.ACCOUNT_ID
    WHERE s.ROLE = 'SUPERVISOR'
    GROUP BY s.ACCOUNT_ID, a.NAME, s.DEPARTMENT, s.POSITION, a.EMAIL
  )
  
  -- Main query: Combine all subqueries and calculate final metrics
  SELECT 
    si.TEAM_ID,
    si.SUPERVISOR_NAME,
    si.DEPARTMENT,
    si.POSITION,
    si.SUPERVISOR_EMAIL,
    si.TEAM_SIZE,
    NVL(ts.TOTAL_CASES, 0) as TOTAL_CASES,
    NVL(ts.RESOLVED_CASES, 0) as RESOLVED_CASES,
    NVL(ts.ACTIVE_CASES, 0) as ACTIVE_CASES,
    
    -- Resolution efficiency (percentage)
    CASE 
      WHEN ts.TOTAL_CASES > 0 
      THEN ROUND((ts.RESOLVED_CASES * 100.0 / ts.TOTAL_CASES), 2)
      ELSE 0
    END as RESOLUTION_RATE_PCT,
    
    -- Average resolution time
    ROUND(NVL(ts.AVG_RESOLUTION_TIME, 0), 2) as AVG_RESOLUTION_DAYS,
    
    -- Average response time
    ROUND(NVL(ts.AVG_RESPONSE_TIME, 0), 2) as AVG_RESPONSE_DAYS,
    
    -- Workload per member ratio
    CASE 
      WHEN si.TEAM_SIZE > 0 
      THEN ROUND(NVL(ts.ACTIVE_CASES, 0) * 1.0 / si.TEAM_SIZE, 2)
      ELSE 0
    END as WORKLOAD_PER_MEMBER,
    
    -- Performance score (composite metric: 40% resolution rate + 30% speed + 30% workload balance)
    -- Higher score = better performance
    CASE 
      WHEN ts.TOTAL_CASES > 0 THEN
        ROUND(
          (
            -- Resolution efficiency component (0-40 points)
            (ts.RESOLVED_CASES * 40.0 / ts.TOTAL_CASES) +
            
            -- Speed component (0-30 points, inverse of avg resolution time)
            -- Assuming 7 days is target, scores decrease after that
            (CASE 
              WHEN ts.AVG_RESOLUTION_TIME <= 7 THEN 30
              WHEN ts.AVG_RESOLUTION_TIME <= 14 THEN 20
              WHEN ts.AVG_RESOLUTION_TIME <= 30 THEN 10
              ELSE 5
            END) +
            
            -- Workload balance component (0-30 points)
            -- Lower workload per member = better (assuming 5 cases per member is ideal)
            (CASE 
              WHEN (NVL(ts.ACTIVE_CASES, 0) * 1.0 / NULLIF(si.TEAM_SIZE, 0)) <= 5 THEN 30
              WHEN (NVL(ts.ACTIVE_CASES, 0) * 1.0 / NULLIF(si.TEAM_SIZE, 0)) <= 10 THEN 20
              WHEN (NVL(ts.ACTIVE_CASES, 0) * 1.0 / NULLIF(si.TEAM_SIZE, 0)) <= 15 THEN 10
              ELSE 5
            END)
          ), 2
        )
      ELSE 0
    END as PERFORMANCE_SCORE,
    
    ts.FIRST_ASSIGNMENT_DATE,
    ts.LAST_ASSIGNMENT_DATE,
    
    -- Team activity status
    CASE 
      WHEN ts.ACTIVE_CASES > 15 THEN 'OVERLOADED'
      WHEN ts.ACTIVE_CASES > 10 THEN 'BUSY'
      WHEN ts.ACTIVE_CASES > 5 THEN 'MODERATE'
      WHEN ts.ACTIVE_CASES > 0 THEN 'LIGHT'
      ELSE 'AVAILABLE'
    END as TEAM_STATUS
    
  FROM SupervisorInfo si
  LEFT JOIN TeamStats ts ON si.TEAM_ID = ts.TEAM_ID
  ORDER BY PERFORMANCE_SCORE DESC, RESOLUTION_RATE_PCT DESC, si.SUPERVISOR_NAME
`;

    const result: any = await this.execute(sql);
    return result.rows;
  }

}
