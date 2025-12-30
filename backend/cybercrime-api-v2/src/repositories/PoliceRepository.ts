/* eslint-disable @typescript-eslint/no-explicit-any */
import oracledb from 'oracledb';
import { BaseRepository } from './base/BaseRepository';
import { Police, PoliceData } from '../models/Police';

export class PoliceRepository extends BaseRepository<Police> {
  constructor() {
    super('UITM_AUXILIARY_POLICE', 'EMERGENCY_ID');
  }

  protected toModel(row: any): Police {
    return new Police(row);
  }

  /**
   * Get all police stations with emergency info joined
   */
  async findAll(filters?: Record<string, any>): Promise<Police[]> {
    let sql = `
      SELECT 
        e.EMERGENCY_ID, p.CAMPUS, e.STATE, e.ADDRESS, 
        e.PHONE, e.HOTLINE, e.EMAIL, p.OPERATING_HOURS,
        e.CREATED_AT, e.UPDATED_AT
      FROM UITM_AUXILIARY_POLICE p
      INNER JOIN EMERGENCY_INFO e ON p.EMERGENCY_ID = e.EMERGENCY_ID
    `;

    const binds: any = {};

    if (filters?.state) {
      sql += ' WHERE e.STATE = :state';
      binds.state = filters.state;
    }

    sql += ' ORDER BY e.STATE, p.CAMPUS';

    const result: any = await this.execute(sql, binds);
    return result.rows.map((row: any) => this.toModel(row));
  }

  /**
   * Get police station by ID with emergency info
   */
  async findById(id: number): Promise<Police | null> {
    const sql = `
      SELECT 
        e.EMERGENCY_ID, p.CAMPUS, e.STATE, e.ADDRESS, 
        e.PHONE, e.HOTLINE, e.EMAIL, p.OPERATING_HOURS,
        e.CREATED_AT, e.UPDATED_AT
      FROM UITM_AUXILIARY_POLICE p
      INNER JOIN EMERGENCY_INFO e ON p.EMERGENCY_ID = e.EMERGENCY_ID
      WHERE e.EMERGENCY_ID = :id
    `;

    const result: any = await this.execute(sql, { id });
    if (result.rows.length === 0) return null;
    return this.toModel(result.rows[0]);
  }

  /**
   * Create new police station (with emergency info)
   */
  async create(police: Police): Promise<Police> {
    try {
      // First, insert into EMERGENCY_INFO with autoCommit: true to ensure it's committed
      const emergencySql = `
        INSERT INTO EMERGENCY_INFO (
          EMERGENCY_ID, STATE, ADDRESS, PHONE, HOTLINE, EMAIL, 
          TYPE, CREATED_AT, UPDATED_AT
        ) VALUES (
          emergency_seq.NEXTVAL, :state, :address, :phone, :hotline, :email,
          'Police', SYSTIMESTAMP, SYSTIMESTAMP
        ) RETURNING EMERGENCY_ID INTO :id
      `;

      const emergencyBinds = {
        state: police.getState(),
        address: police.getAddress(),
        phone: police.getPhone(),
        hotline: police.getHotline(),
        email: police.getEmail() || null,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      };

      const emergencyResult: any = await this.execute(emergencySql, emergencyBinds, { autoCommit: true });
      const emergencyId = emergencyResult.outBinds.id[0];

      // Then, insert into UITM_AUXILIARY_POLICE
      const policeSql = `
        INSERT INTO UITM_AUXILIARY_POLICE (
          EMERGENCY_ID, CAMPUS, OPERATING_HOURS
        ) VALUES (
          :emergency_id, :campus, :operating_hours
        )
      `;

      const policeBinds = {
        emergency_id: emergencyId,
        campus: police.getCampus(),
        operating_hours: police.getOperatingHours()
      };

      await this.execute(policeSql, policeBinds, { autoCommit: true });

      return this.findById(emergencyId) as Promise<Police>;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update police station
   */
  async update(id: number, updates: Partial<PoliceData>): Promise<Police> {
    const updateFields: string[] = [];
    const binds: any = { id };

    // Update EMERGENCY_INFO fields
    const emergencyFields: string[] = [];
    if (updates.STATE !== undefined) {
      emergencyFields.push('STATE = :state');
      binds.state = updates.STATE;
    }
    if (updates.ADDRESS !== undefined) {
      emergencyFields.push('ADDRESS = :address');
      binds.address = updates.ADDRESS;
    }
    if (updates.PHONE !== undefined) {
      emergencyFields.push('PHONE = :phone');
      binds.phone = updates.PHONE;
    }
    if (updates.HOTLINE !== undefined) {
      emergencyFields.push('HOTLINE = :hotline');
      binds.hotline = updates.HOTLINE;
    }
    if (updates.EMAIL !== undefined) {
      emergencyFields.push('EMAIL = :email');
      binds.email = updates.EMAIL;
    }

    if (emergencyFields.length > 0) {
      emergencyFields.push('UPDATED_AT = SYSTIMESTAMP');
      const emergencySql = `
        UPDATE EMERGENCY_INFO 
        SET ${emergencyFields.join(', ')} 
        WHERE EMERGENCY_ID = :id
      `;
      await this.execute(emergencySql, binds, { autoCommit: false });
    }

    // Update UITM_AUXILIARY_POLICE fields
    const policeFields: string[] = [];
    const policeBinds: any = { id };
    
    if (updates.CAMPUS !== undefined) {
      policeFields.push('CAMPUS = :campus');
      policeBinds.campus = updates.CAMPUS;
    }
    if (updates.OPERATING_HOURS !== undefined) {
      policeFields.push('OPERATING_HOURS = :operating_hours');
      policeBinds.operating_hours = updates.OPERATING_HOURS;
    }

    if (policeFields.length > 0) {
      const policeSql = `
        UPDATE UITM_AUXILIARY_POLICE 
        SET ${policeFields.join(', ')} 
        WHERE EMERGENCY_ID = :id
      `;
      await this.execute(policeSql, policeBinds, { autoCommit: true });
    }

    return this.findById(id) as Promise<Police>;
  }

  /**
   * Delete police station
   */
  async delete(id: number): Promise<boolean> {
    // Deleting from EMERGENCY_INFO will cascade to UITM_AUXILIARY_POLICE
    const sql = 'DELETE FROM EMERGENCY_INFO WHERE EMERGENCY_ID = :id';
    const result: any = await this.execute(sql, { id }, { autoCommit: true });
    return result.rowsAffected > 0;
  }
}
