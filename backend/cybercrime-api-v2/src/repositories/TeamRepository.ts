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

    const placeholders = allStaffIds.map((_, i) => `:id${i}`).join(', ');
    const binds: any = {};
    allStaffIds.forEach((id, i) => {
      binds[`id${i}`] = id;
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
}
