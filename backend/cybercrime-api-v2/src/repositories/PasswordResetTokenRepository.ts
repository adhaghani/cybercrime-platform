/* eslint-disable @typescript-eslint/no-explicit-any */
import oracledb from 'oracledb';
import { BaseRepository } from './base/BaseRepository';
import { Logger } from '../utils/Logger';

const logger = new Logger('PasswordResetTokenRepository');

export interface PasswordResetToken {
  id?: number;
  email: string;
  token: string;
  expiresAt: Date;
  createdAt?: Date;
  used?: boolean;
}

export class PasswordResetTokenRepository extends BaseRepository<PasswordResetToken> {
  constructor() {
    super('PASSWORD_RESET_TOKENS', 'ID');
  }

  protected toModel(row: any): PasswordResetToken {
    return {
      id: row.ID,
      email: row.EMAIL,
      token: row.TOKEN_HASH,
      expiresAt: row.EXPIRES_AT,
      createdAt: row.CREATED_AT,
      used: row.USED === 1
    };
  }

  /**
   * Create a new password reset token
   */
  async create(data: PasswordResetToken): Promise<PasswordResetToken> {
    const sql = `
      INSERT INTO PASSWORD_RESET_TOKENS (EMAIL, TOKEN_HASH, EXPIRES_AT, USED)
      VALUES (:email, :token, :expiresAt, 0)
      RETURNING ID INTO :id
    `;
    
    const result: any = await this.execute(sql, {
      email: data.email,
      token: data.token,
      expiresAt: data.expiresAt,
      id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
    }, { autoCommit: true });

    const id = result.outBinds.id[0];
    logger.info(`Created password reset token for ${data.email}`);

    return {
      id,
      ...data
    };
  }

  /**
   * Find valid token by token hash
   */
  async findValidToken(tokenHash: string): Promise<PasswordResetToken | null> {
    const sql = `
      SELECT ID, EMAIL, TOKEN_HASH, EXPIRES_AT, CREATED_AT, USED
      FROM PASSWORD_RESET_TOKENS
      WHERE TOKEN_HASH = :tokenHash
        AND EXPIRES_AT > SYSDATE
        AND USED = 0
    `;
    
    const result: any = await this.execute(sql, { tokenHash });
    
    if (!result.rows || result.rows.length === 0) {
      return null;
    }

    return this.toModel(result.rows[0]);
  }

  /**
   * Mark token as used
   */
  async markAsUsed(id: number): Promise<void> {
    const sql = `
      UPDATE PASSWORD_RESET_TOKENS
      SET USED = 1
      WHERE ID = :id
    `;
    
    await this.execute(sql, { id }, { autoCommit: true });
    logger.info(`Marked password reset token ${id} as used`);
  }

  /**
   * Delete old/expired tokens
   */
  async cleanupExpiredTokens(): Promise<number> {
    const sql = `
      DELETE FROM PASSWORD_RESET_TOKENS
      WHERE EXPIRES_AT < SYSDATE OR USED = 1
    `;
    
    const result: any = await this.execute(sql, {}, { autoCommit: true });
    const deletedCount = result.rowsAffected || 0;
    logger.info(`Cleaned up ${deletedCount} expired/used password reset tokens`);
    
    return deletedCount;
  }

  /**
   * Delete all tokens for an email
   */
  async deleteByEmail(email: string): Promise<void> {
    const sql = `DELETE FROM PASSWORD_RESET_TOKENS WHERE EMAIL = :email`;
    await this.execute(sql, { email }, { autoCommit: true });
    logger.info(`Deleted all password reset tokens for ${email}`);
  }

  /**
   * Find all valid tokens (for password reset validation)
   */
  async findAllValidTokens(): Promise<PasswordResetToken[]> {
    const sql = `
      SELECT ID, EMAIL, TOKEN_HASH, EXPIRES_AT, CREATED_AT, USED
      FROM PASSWORD_RESET_TOKENS
      WHERE EXPIRES_AT > SYSDATE AND USED = 0
    `;
    
    const result: any = await this.execute(sql, {});
    return result.rows.map((row: any) => this.toModel(row));
  }

  // Required abstract methods (not used, but need to be implemented)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update(_id: string | number, _entity: Partial<PasswordResetToken>): Promise<PasswordResetToken> {
    throw new Error('Update method not supported for password reset tokens');
  }
}
