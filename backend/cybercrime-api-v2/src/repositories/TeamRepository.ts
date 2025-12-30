/* eslint-disable @typescript-eslint/no-explicit-any */
import { Team } from '../models/Team';
import { BaseRepository } from './base/BaseRepository';
import oracledb from 'oracledb';

export class TeamRepository extends BaseRepository<Team> {
  protected tableName = 'TEAM';

  constructor() {
    super('TEAM', 'TEAM_ID');
  }

  protected toModel(row: any): Team {
    return new Team({
      TEAM_ID: row.TEAM_ID,
      TEAM_NAME: row.TEAM_NAME,
      TEAM_LEAD_ID: row.TEAM_LEAD_ID,
      DESCRIPTION: row.DESCRIPTION,
      CREATED_AT: row.CREATED_AT,
      UPDATED_AT: row.UPDATED_AT,
      // Include team lead info from JOIN
      TEAM_LEAD_NAME: row.TEAM_LEAD_NAME,
      TEAM_LEAD_EMAIL: row.TEAM_LEAD_EMAIL
    });
  }

  async findAll(): Promise<Team[]> {
    const sql = `
      SELECT t.*,
             a.NAME as TEAM_LEAD_NAME,
             a.EMAIL as TEAM_LEAD_EMAIL
      FROM ${this.tableName} t
      LEFT JOIN ACCOUNT a ON t.TEAM_LEAD_ID = a.ACCOUNT_ID
      ORDER BY t.TEAM_NAME
    `;

    const result: any = await this.execute(sql);
    return result.rows.map((row: any) => this.toModel(row));
  }

  async findById(id: string | number): Promise<Team | null> {
    const sql = `
      SELECT t.*,
             a.NAME as TEAM_LEAD_NAME,
             a.EMAIL as TEAM_LEAD_EMAIL
      FROM ${this.tableName} t
      LEFT JOIN ACCOUNT a ON t.TEAM_LEAD_ID = a.ACCOUNT_ID
      WHERE t.TEAM_ID = :id
    `;
    const result: any = await this.execute(sql, { id });
    
    if (result.rows.length === 0) return null;
    return this.toModel(result.rows[0]);
  }

  async findByTeamLead(leadId: number): Promise<Team[]> {
    const sql = `
      SELECT t.*,
             a.NAME as TEAM_LEAD_NAME,
             a.EMAIL as TEAM_LEAD_EMAIL
      FROM ${this.tableName} t
      LEFT JOIN ACCOUNT a ON t.TEAM_LEAD_ID = a.ACCOUNT_ID
      WHERE t.TEAM_LEAD_ID = :leadId
      ORDER BY t.TEAM_NAME
    `;

    const result: any = await this.execute(sql, { leadId });
    return result.rows.map((row: any) => this.toModel(row));
  }

  async findByName(name: string): Promise<Team | null> {
    const sql = `
      SELECT t.*,
             a.NAME as TEAM_LEAD_NAME,
             a.EMAIL as TEAM_LEAD_EMAIL
      FROM ${this.tableName} t
      LEFT JOIN ACCOUNT a ON t.TEAM_LEAD_ID = a.ACCOUNT_ID
      WHERE UPPER(t.TEAM_NAME) = :name
    `;

    const result: any = await this.execute(sql, { name: name.toUpperCase() });
    
    if (result.rows.length === 0) return null;
    return this.toModel(result.rows[0]);
  }

  async create(team: Team): Promise<Team> {
    const sql = `
      INSERT INTO ${this.tableName} (
        TEAM_ID, TEAM_NAME, TEAM_LEAD_ID, DESCRIPTION, CREATED_AT, UPDATED_AT
      ) VALUES (
        team_seq.NEXTVAL, :teamName, :teamLeadId, :description,
        SYSTIMESTAMP, SYSTIMESTAMP
      ) RETURNING TEAM_ID INTO :id
    `;

    const binds = {
      teamName: team.getTeamName(),
      teamLeadId: team.getTeamLeadId() || null,
      description: team.getDescription() || null,
      id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
    };

    const result: any = await this.execute(sql, binds, { autoCommit: true });
    const newId = result.outBinds.id[0];

    const created = await this.findById(newId);
    if (!created) {
      throw new Error('Failed to create team');
    }
    return created;
  }

  async update(id: number, updates: any): Promise<Team> {
    const setClauses: string[] = [];
    const binds: any = { id };

    if (updates.TEAM_NAME) {
      setClauses.push('TEAM_NAME = :teamName');
      binds.teamName = updates.TEAM_NAME;
    }
    if (updates.TEAM_LEAD_ID !== undefined) {
      setClauses.push('TEAM_LEAD_ID = :teamLeadId');
      binds.teamLeadId = updates.TEAM_LEAD_ID;
    }
    if (updates.DESCRIPTION !== undefined) {
      setClauses.push('DESCRIPTION = :description');
      binds.description = updates.DESCRIPTION;
    }

    if (setClauses.length === 0) {
      throw new Error('No fields to update');
    }

    setClauses.push('UPDATED_AT = SYSTIMESTAMP');

    const sql = `
      UPDATE ${this.tableName}
      SET ${setClauses.join(', ')}
      WHERE TEAM_ID = :id
    `;

    await this.execute(sql, binds, { autoCommit: true });

    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('Failed to update team');
    }
    return updated;
  }

  async getTeamMembers(teamId: number): Promise<any[]> {
    const sql = `
      SELECT tm.*, a.NAME, a.EMAIL, a.CONTACT_NUMBER, s.ROLE, s.POSITION
      FROM TEAM_MEMBER tm
      JOIN ACCOUNT a ON tm.MEMBER_ID = a.ACCOUNT_ID
      LEFT JOIN STAFF s ON tm.MEMBER_ID = s.ACCOUNT_ID
      WHERE tm.TEAM_ID = :teamId
      ORDER BY a.NAME
    `;

    const result: any = await this.execute(sql, { teamId });
    return result.rows;
  }

  async addMember(teamId: number, memberId: number): Promise<boolean> {
    const sql = `
      INSERT INTO TEAM_MEMBER (TEAM_ID, MEMBER_ID, JOINED_AT)
      VALUES (:teamId, :memberId, SYSTIMESTAMP)
    `;

    try {
      await this.execute(sql, { teamId, memberId }, { autoCommit: true });
      return true;
    } catch (error: any) {
      // Handle duplicate member error
      if (error.errorNum === 1) { // ORA-00001: unique constraint violated
        return false;
      }
      throw error;
    }
  }

  async removeMember(teamId: number, memberId: number): Promise<boolean> {
    const sql = `
      DELETE FROM TEAM_MEMBER
      WHERE TEAM_ID = :teamId AND MEMBER_ID = :memberId
    `;

    const result: any = await this.execute(sql, { teamId, memberId }, { autoCommit: true });
    return result.rowsAffected > 0;
  }

  async search(query: string): Promise<Team[]> {
    const sql = `
      SELECT t.*,
             a.NAME as TEAM_LEAD_NAME,
             a.EMAIL as TEAM_LEAD_EMAIL
      FROM ${this.tableName} t
      LEFT JOIN ACCOUNT a ON t.TEAM_LEAD_ID = a.ACCOUNT_ID
      WHERE UPPER(t.TEAM_NAME) LIKE :search
         OR UPPER(t.DESCRIPTION) LIKE :search
      ORDER BY t.TEAM_NAME
    `;

    const result: any = await this.execute(sql, { search: `%${query.toUpperCase()}%` });
    return result.rows.map((row: any) => this.toModel(row));
  }
}
