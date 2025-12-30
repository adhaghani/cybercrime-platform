/* eslint-disable @typescript-eslint/no-explicit-any */
import oracledb from 'oracledb';
import { BaseRepository } from './base/BaseRepository';
import { Announcement } from '../models/Announcement';

export class AnnouncementRepository extends BaseRepository<Announcement> {
  constructor() {
    super('ANNOUNCEMENT', 'ANNOUNCEMENT_ID');
  }

  protected toModel(row: any): Announcement {
    return new Announcement(row);
  }

  async findAll(filters?: Record<string, any>): Promise<Announcement[]> {
    let sql = `
      SELECT an.*, a.NAME as CREATED_BY_NAME, a.EMAIL as CREATED_BY_EMAIL
      FROM ${this.tableName} an
      JOIN ACCOUNT a ON an.CREATED_BY = a.ACCOUNT_ID
    `;
    const binds: any = {};

    if (filters && Object.keys(filters).length > 0) {
      const whereClauses: string[] = [];
      if (filters.STATUS) {
        whereClauses.push('an.STATUS = :status');
        binds.status = filters.STATUS;
      }
      if (filters.AUDIENCE) {
        whereClauses.push('an.AUDIENCE = :audience');
        binds.audience = filters.AUDIENCE;
      }
      if (filters.TYPE) {
        whereClauses.push('an.TYPE = :type');
        binds.type = filters.TYPE;
      }
      if (whereClauses.length > 0) {
        sql += ` WHERE ${whereClauses.join(' AND ')}`;
      }
    }

    sql += ' ORDER BY an.CREATED_AT DESC';

    const result: any = await this.execute(sql, binds);
    return result.rows.map((row: any) => this.toModel(row));
  }

  async findById(id: string | number): Promise<Announcement | null> {
    const sql = `
      SELECT an.*, a.NAME as CREATED_BY_NAME, a.EMAIL as CREATED_BY_EMAIL
      FROM ${this.tableName} an
      JOIN ACCOUNT a ON an.CREATED_BY = a.ACCOUNT_ID
      WHERE an.ANNOUNCEMENT_ID = :id
    `;
    const result: any = await this.execute(sql, { id });
    
    if (result.rows.length === 0) return null;
    return this.toModel(result.rows[0]);
  }

  async findActive(): Promise<Announcement[]> {
    const sql = `
      SELECT an.*, a.NAME as CREATED_BY_NAME, a.EMAIL as CREATED_BY_EMAIL
      FROM ${this.tableName} an
      JOIN ACCOUNT a ON an.CREATED_BY = a.ACCOUNT_ID
      WHERE an.STATUS = 'PUBLISHED'
        AND TRUNC(SYSDATE) BETWEEN TRUNC(an.START_DATE) AND TRUNC(an.END_DATE)
      ORDER BY an.PRIORITY DESC, an.CREATED_AT DESC
    `;
    
    const result: any = await this.execute(sql);
    return result.rows.map((row: any) => this.toModel(row));
  }

  async create(announcement: Announcement): Promise<Announcement> {
    const sql = `
      INSERT INTO ${this.tableName} (
        ANNOUNCEMENT_ID, CREATED_BY, TITLE, MESSAGE, AUDIENCE, TYPE, 
        PRIORITY, STATUS, PHOTO_PATH, START_DATE, END_DATE, CREATED_AT, UPDATED_AT
      ) VALUES (
        announcement_seq.NEXTVAL, :createdBy, :title, :message, :audience, :type,
        :priority, :status, :photo, :startDate, :endDate, SYSTIMESTAMP, SYSTIMESTAMP
      ) RETURNING ANNOUNCEMENT_ID INTO :id
    `;

    const binds = {
      createdBy: announcement.getCreatedBy(),
      title: announcement.getTitle(),
      message: announcement.getMessage(),
      audience: announcement.getAudience(),
      type: announcement.getType(),
      priority: announcement.getPriority(),
      status: announcement.getStatus(),
      photo: announcement.getPhotoPath() || null,
      startDate: announcement.getStartDate(),
      endDate: announcement.getEndDate(),
      id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
    };

    const result: any = await this.execute(sql, binds, { autoCommit: true });
    
    const created = await this.findById(result.outBinds.id[0]);
    if (!created) {
      throw new Error('Failed to create announcement');
    }
    return created;
  }

  async update(id: string | number, updates: any): Promise<Announcement> {
    const setClauses: string[] = [];
    const binds: Record<string, any> = { id };

    if (updates.TITLE) {
      setClauses.push('TITLE = :title');
      binds.title = updates.TITLE;
    }
    if (updates.MESSAGE) {
      setClauses.push('MESSAGE = :message');
      binds.message = updates.MESSAGE;
    }
    if (updates.AUDIENCE) {
      setClauses.push('AUDIENCE = :audience');
      binds.audience = updates.AUDIENCE;
    }
    if (updates.TYPE) {
      setClauses.push('TYPE = :type');
      binds.type = updates.TYPE;
    }
    if (updates.PRIORITY) {
      setClauses.push('PRIORITY = :priority');
      binds.priority = updates.PRIORITY;
    }
    if (updates.STATUS) {
      setClauses.push('STATUS = :status');
      binds.status = updates.STATUS;
    }
    if (updates.PHOTO_PATH !== undefined) {
      setClauses.push('PHOTO_PATH = :photo');
      binds.photo = updates.PHOTO_PATH;
    }
    if (updates.START_DATE) {
      setClauses.push('START_DATE = :startDate');
      binds.startDate = updates.START_DATE;
    }
    if (updates.END_DATE) {
      setClauses.push('END_DATE = :endDate');
      binds.endDate = updates.END_DATE;
    }

    if (setClauses.length === 0) {
      throw new Error('No fields to update');
    }

    setClauses.push('UPDATED_AT = SYSTIMESTAMP');

    const sql = `
      UPDATE ${this.tableName}
      SET ${setClauses.join(', ')}
      WHERE ANNOUNCEMENT_ID = :id
    `;

    await this.execute(sql, binds, { autoCommit: true });
    
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('Failed to update announcement');
    }
    return updated;
  }
}
