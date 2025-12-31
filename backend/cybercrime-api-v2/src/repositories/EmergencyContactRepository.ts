/* eslint-disable @typescript-eslint/no-explicit-any */
import oracledb from 'oracledb';
import { BaseRepository } from './base/BaseRepository';
import { EmergencyContact, EmergencyContactData } from '../models/EmergencyContact';

export class EmergencyContactRepository extends BaseRepository<EmergencyContact> {
  constructor() {
    super('EMERGENCY_INFO', 'EMERGENCY_ID');
  }

  protected toModel(row: any): EmergencyContact {
    // Skip validation when creating from DB rows - trust what's already in DB
    return new EmergencyContact(row, true);
  }

  /**
   * Find emergency contacts by state
   */
  async findByState(state: string): Promise<EmergencyContact[]> {
    const sql = `
      SELECT * FROM ${this.tableName} 
      WHERE STATE = :state AND TYPE IS NOT NULL AND NAME IS NOT NULL
      ORDER BY NAME
    `;
    const result: any = await this.execute(sql, { state });
    return result.rows.map((row: any) => this.toModel(row));
  }

  /**
   * Find emergency contacts by type
   */
  async findByType(type: string): Promise<EmergencyContact[]> {
    const sql = `
      SELECT * FROM ${this.tableName} 
      WHERE TYPE = :type AND NAME IS NOT NULL
      ORDER BY STATE, NAME
    `;
    const result: any = await this.execute(sql, { type });
    return result.rows.map((row: any) => this.toModel(row));
  }

  /**
   * Find emergency contacts with filters
   */
  async findWithFilters(filters: {
    state?: string;
    type?: string;
  }): Promise<EmergencyContact[]> {
    let sql = `SELECT * FROM ${this.tableName} WHERE TYPE IS NOT NULL AND NAME IS NOT NULL`;
    const binds: any = {};

    if (filters.state) {
      sql += ' AND STATE = :state';
      binds.state = filters.state;
    }

    if (filters.type) {
      sql += ' AND TYPE = :type';
      binds.type = filters.type;
    }

    sql += ' ORDER BY STATE, NAME';

    const result: any = await this.execute(sql, binds);
    return result.rows.map((row: any) => this.toModel(row));
  }

  /**
   * Create new emergency contact
   */
  async create(contact: EmergencyContact): Promise<EmergencyContact> {
    const sql = `
      INSERT INTO ${this.tableName} (
        EMERGENCY_ID, NAME, ADDRESS, PHONE, EMAIL, STATE, TYPE, HOTLINE,
        CREATED_AT, UPDATED_AT
      ) VALUES (
        emergency_seq.NEXTVAL, :name, :address, :phone, :email, :state, :type, :hotline,
        SYSTIMESTAMP, SYSTIMESTAMP
      ) RETURNING EMERGENCY_ID INTO :id
    `;

    const binds = {
      name: contact.getName(),
      address: contact.getAddress(),
      phone: contact.getPhone(),
      email: contact.getEmail() || null,
      state: contact.getState(),
      type: contact.getType(),
      hotline: contact.getHotline() || null,
      id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
    };

    const result: any = await this.execute(sql, binds, { autoCommit: true });
    
    const createdContact = await this.findById(result.outBinds.id[0]);
    if (!createdContact) {
      throw new Error('Failed to create emergency contact');
    }
    return createdContact;
  }

  /**
   * Update emergency contact
   */
  async update(id: string | number, updates: any): Promise<EmergencyContact> {
    const setClauses: string[] = [];
    const binds: Record<string, any> = { id };

    if (updates.NAME || updates.name) {
      setClauses.push('NAME = :name');
      binds.name = updates.NAME || updates.name;
    }
    if (updates.ADDRESS || updates.address) {
      setClauses.push('ADDRESS = :address');
      binds.address = updates.ADDRESS || updates.address;
    }
    if (updates.PHONE || updates.phone) {
      setClauses.push('PHONE = :phone');
      binds.phone = updates.PHONE || updates.phone;
    }
    if (updates.EMAIL !== undefined || updates.email !== undefined) {
      setClauses.push('EMAIL = :email');
      binds.email = updates.EMAIL !== undefined ? updates.EMAIL : updates.email;
    }
    if (updates.STATE || updates.state) {
      setClauses.push('STATE = :state');
      binds.state = updates.STATE || updates.state;
    }
    if (updates.TYPE || updates.type) {
      setClauses.push('TYPE = :type');
      binds.type = updates.TYPE || updates.type;
    }
    if (updates.HOTLINE !== undefined || updates.hotline !== undefined) {
      setClauses.push('HOTLINE = :hotline');
      binds.hotline = updates.HOTLINE !== undefined ? updates.HOTLINE : updates.hotline;
    }

    if (setClauses.length === 0) {
      throw new Error('No fields to update');
    }

    setClauses.push('UPDATED_AT = SYSTIMESTAMP');

    const sql = `
      UPDATE ${this.tableName}
      SET ${setClauses.join(', ')}
      WHERE ${this.primaryKey} = :id
    `;

    await this.execute(sql, binds, { autoCommit: true });
    
    const updatedContact = await this.findById(id);
    if (!updatedContact) {
      throw new Error('Failed to update emergency contact');
    }
    return updatedContact;
  }

  /**
   * Get all emergency contacts (override to filter out null types)
   */
  async findAll(filters?: Record<string, any>): Promise<EmergencyContact[]> {
    let sql = `SELECT * FROM ${this.tableName} WHERE TYPE IS NOT NULL AND NAME IS NOT NULL`;
    const binds: Record<string, any> = {};

    if (filters && Object.keys(filters).length > 0) {
      const whereClauses = Object.keys(filters).map((key, index) => {
        binds[`filter${index}`] = filters[key];
        return `${key} = :filter${index}`;
      });
      sql += ` AND ${whereClauses.join(' AND ')}`;
    }

    sql += ' ORDER BY STATE, NAME';

    const result: any = await this.execute(sql, binds);
    return result.rows.map((row: any) => this.toModel(row));
  }

  /**
   * Get national emergency contacts (excluding UiTM AP specific contacts)
   */
  async findNationalContacts(): Promise<EmergencyContact[]> {
    const sql = `
      SELECT * FROM ${this.tableName} 
      WHERE TYPE IS NOT NULL 
        AND NAME IS NOT NULL
        AND NAME NOT LIKE '%UiTM%'
      ORDER BY TYPE, NAME
    `;
    const result: any = await this.execute(sql, {});
    return result.rows.map((row: any) => this.toModel(row));
  }
}
