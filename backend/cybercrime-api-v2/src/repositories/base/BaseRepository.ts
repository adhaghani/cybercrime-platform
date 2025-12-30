/* eslint-disable @typescript-eslint/no-explicit-any */
import oracledb, { Connection } from 'oracledb';
import { DatabaseConnection } from '../../utils/DatabaseConnection';
import { IRepository } from './IRepository';

export abstract class BaseRepository<T> implements IRepository<T> {
  protected tableName: string;
  protected primaryKey: string;

  constructor(tableName: string, primaryKey: string = 'ID') {
    this.tableName = tableName;
    this.primaryKey = primaryKey;
  }

  /**
   * Get database connection
   */
  protected async getConnection(): Promise<Connection> {
    return DatabaseConnection.getInstance().getConnection();
  }

  /**
   * Execute SQL with automatic connection management
   */
  protected async execute<R = any>(
    sql: string,
    binds: Record<string, any> = {},
    options: Record<string, any> = {}
  ): Promise<R> {
    const conn = await this.getConnection();
    try {
      const result = await conn.execute(sql, binds, {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        ...options
      });
      return result as R;
    } finally {
      await conn.close();
    }
  }

  /**
   * Abstract method to convert DB row to model
   */
  protected abstract toModel(row: any): T;

  /**
   * Find by ID
   */
  async findById(id: string | number): Promise<T | null> {
    const sql = `SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = :id`;
    const result: any = await this.execute(sql, { id });
    
    if (result.rows.length === 0) return null;
    return this.toModel(result.rows[0]);
  }

  /**
   * Find all with optional filters
   */
  async findAll(filters?: Record<string, any>): Promise<T[]> {
    let sql = `SELECT * FROM ${this.tableName}`;
    const binds: Record<string, any> = {};

    if (filters && Object.keys(filters).length > 0) {
      const whereClauses = Object.keys(filters).map((key, index) => {
        binds[`filter${index}`] = filters[key];
        return `${key} = :filter${index}`;
      });
      sql += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    const result: any = await this.execute(sql, binds);
    return result.rows.map((row: any) => this.toModel(row));
  }

  /**
   * Check if record exists
   */
  async exists(id: string | number): Promise<boolean> {
    const sql = `SELECT 1 FROM ${this.tableName} WHERE ${this.primaryKey} = :id`;
    const result: any = await this.execute(sql, { id });
    return result.rows.length > 0;
  }

  /**
   * Create - must be implemented by child classes
   */
  abstract create(entity: T): Promise<T>;

  /**
   * Update - must be implemented by child classes
   */
  abstract update(id: string | number, entity: any): Promise<T>;

  /**
   * Delete
   */
  async delete(id: string | number): Promise<boolean> {
    const sql = `DELETE FROM ${this.tableName} WHERE ${this.primaryKey} = :id`;
    const result: any = await this.execute(sql, { id }, { autoCommit: true });
    return result.rowsAffected > 0;
  }
}
