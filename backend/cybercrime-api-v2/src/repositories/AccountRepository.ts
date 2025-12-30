/* eslint-disable @typescript-eslint/no-explicit-any */
import oracledb from 'oracledb';
import { BaseRepository } from './base/BaseRepository';
import { Account, AccountData } from '../models/Account';

export class AccountRepository extends BaseRepository<Account> {
  constructor() {
    super('ACCOUNT', 'ACCOUNT_ID');
  }

  protected toModel(row: any): Account {
    return new Account(row);
  }

  /**
   * Find account by email with student/staff details
   */
  async findByEmail(email: string): Promise<Account | null> {
    const sql = `
      SELECT 
        a.*,
        s.STUDENT_ID, s.PROGRAM, s.SEMESTER, s.YEAR_OF_STUDY,
        st.STAFF_ID, st.DEPARTMENT, st.POSITION, st.ROLE
      FROM ${this.tableName} a
      LEFT JOIN STUDENT s ON a.ACCOUNT_ID = s.ACCOUNT_ID
      LEFT JOIN STAFF st ON a.ACCOUNT_ID = st.ACCOUNT_ID
      WHERE UPPER(a.EMAIL) = UPPER(:email)
    `;
    const result: any = await this.execute(sql, { email });
    
    if (result.rows.length === 0) return null;
    
    // Create Account with extended data
    const row = result.rows[0];
    const account = this.toModel(row);
    
    // Add student/staff details to the account's internal data
    if (row.STUDENT_ID) {
      (account as any)._data.STUDENT_ID = row.STUDENT_ID;
      (account as any)._data.PROGRAM = row.PROGRAM;
      (account as any)._data.SEMESTER = row.SEMESTER;
      (account as any)._data.YEAR_OF_STUDY = row.YEAR_OF_STUDY;
    }
    
    if (row.STAFF_ID) {
      (account as any)._data.STAFF_ID = row.STAFF_ID;
      (account as any)._data.DEPARTMENT = row.DEPARTMENT;
      (account as any)._data.POSITION = row.POSITION;
      (account as any)._data.ROLE = row.ROLE;
    }
    
    return account;
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    const sql = `SELECT 1 FROM ${this.tableName} WHERE UPPER(EMAIL) = UPPER(:email)`;
    const result: any = await this.execute(sql, { email });
    return result.rows.length > 0;
  }

  /**
   * Create new account
   */
  async create(account: Account): Promise<Account> {
    const sql = `
      INSERT INTO ${this.tableName} (
        ACCOUNT_ID, NAME, EMAIL, PASSWORD_HASH, CONTACT_NUMBER, 
        ACCOUNT_TYPE, AVATAR_URL, CREATED_AT, UPDATED_AT
      ) VALUES (
        account_seq.NEXTVAL, :name, :email, :password, :contact,
        :type, :avatar, SYSTIMESTAMP, SYSTIMESTAMP
      ) RETURNING ACCOUNT_ID INTO :id
    `;

    const binds = {
      name: account.getName(),
      email: account.getEmail(),
      password: account.getPasswordHash(),
      contact: account.getContactNumber() || null,
      type: account.getAccountType(),
      avatar: account.getAvatarUrl() || null,
      id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
    };

    const result: any = await this.execute(sql, binds, { autoCommit: true });
    
    // Fetch and return the created account
    const createdAccount = await this.findById(result.outBinds.id[0]);
    if (!createdAccount) {
      throw new Error('Failed to create account');
    }
    return createdAccount;
  }

  /**
   * Update account
   */
  async update(id: string | number, updates: Partial<AccountData>): Promise<Account> {
    const setClauses: string[] = [];
    const binds: Record<string, any> = { id };

    if (updates.NAME) {
      setClauses.push('NAME = :name');
      binds.name = updates.NAME;
    }
    if (updates.EMAIL) {
      setClauses.push('EMAIL = :email');
      binds.email = updates.EMAIL;
    }
    if (updates.CONTACT_NUMBER !== undefined) {
      setClauses.push('CONTACT_NUMBER = :contact');
      binds.contact = updates.CONTACT_NUMBER;
    }
    if (updates.AVATAR_URL !== undefined) {
      setClauses.push('AVATAR_URL = :avatar');
      binds.avatar = updates.AVATAR_URL;
    }
    if (updates.PASSWORD_HASH) {
      setClauses.push('PASSWORD_HASH = :password');
      binds.password = updates.PASSWORD_HASH;
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
    
    const updatedAccount = await this.findById(id);
    if (!updatedAccount) {
      throw new Error('Failed to update account');
    }
    return updatedAccount;
  }

  /**
   * Get accounts by type
   */
  async findByType(accountType: string): Promise<Account[]> {
    const sql = `SELECT * FROM ${this.tableName} WHERE ACCOUNT_TYPE = :type ORDER BY CREATED_AT DESC`;
    const result: any = await this.execute(sql, { type: accountType });
    return result.rows.map((row: any) => this.toModel(row));
  }

  /**
   * Find all accounts with student/staff details
   */
  async findAllWithDetails(): Promise<any[]> {
    const sql = `
      SELECT 
        a.ACCOUNT_ID,
        a.NAME,
        a.EMAIL,
        a.CONTACT_NUMBER,
        a.AVATAR_URL,
        a.ACCOUNT_TYPE,
        a.CREATED_AT,
        a.UPDATED_AT,
        s.STUDENT_ID,
        st.STAFF_ID
      FROM ${this.tableName} a
      LEFT JOIN STUDENT s ON a.ACCOUNT_ID = s.ACCOUNT_ID
      LEFT JOIN STAFF st ON a.ACCOUNT_ID = st.ACCOUNT_ID
      ORDER BY a.CREATED_AT DESC
    `;
    const result: any = await this.execute(sql, {});
    
    // Format results to match expected structure
    return result.rows.map((row: any) => {
      const account: any = {
        ACCOUNT_ID: row.ACCOUNT_ID,
        NAME: row.NAME,
        EMAIL: row.EMAIL,
        AVATAR_URL: row.AVATAR_URL,
        CONTACT_NUMBER: row.CONTACT_NUMBER,
        ACCOUNT_TYPE: row.ACCOUNT_TYPE,
        CREATED_AT: row.CREATED_AT,
        UPDATED_AT: row.UPDATED_AT
      };
      
      if (row.ACCOUNT_TYPE === 'STUDENT' && row.STUDENT_ID) {
        account.STUDENT_ID = row.STUDENT_ID;
      } else if (row.ACCOUNT_TYPE === 'STAFF' && row.STAFF_ID) {
        account.STAFF_ID = row.STAFF_ID;
      }
      
      return account;
    });
  }

  /**
   * Get account counts by type
   */
  async getAccountCounts(): Promise<any> {
    const sql = `
      SELECT 
        COUNT(*) AS TOTAL_ACCOUNTS,
        SUM(CASE WHEN ACCOUNT_TYPE = 'STAFF' THEN 1 ELSE 0 END) AS STAFF_COUNT,
        SUM(CASE WHEN ACCOUNT_TYPE = 'STUDENT' THEN 1 ELSE 0 END) AS STUDENT_COUNT
      FROM ${this.tableName}
    `;
    const result: any = await this.execute(sql, {});
    
    return {
      totalAccounts: result.rows[0].TOTAL_ACCOUNTS,
      staffCount: result.rows[0].STAFF_COUNT,
      studentCount: result.rows[0].STUDENT_COUNT
    };
  }

  /**
   * Find account by ID with student/staff details (alias for findById)
   */
  async findByIdWithDetails(id: string | number): Promise<any> {
    const account = await this.findById(id);
    return account ? account.toJSON() : null;
  }

  async findById(id: string | number): Promise<Account | null> {
    const sql = `
      SELECT 
        a.*,
        s.STUDENT_ID, s.PROGRAM, s.SEMESTER, s.YEAR_OF_STUDY,
        st.STAFF_ID, st.DEPARTMENT, st.POSITION, st.ROLE
      FROM ${this.tableName} a
      LEFT JOIN STUDENT s ON a.ACCOUNT_ID = s.ACCOUNT_ID
      LEFT JOIN STAFF st ON a.ACCOUNT_ID = st.ACCOUNT_ID
      WHERE a.${this.primaryKey} = :id
    `;
    const result: any = await this.execute(sql, { id });
    
    if (result.rows.length === 0) return null;
    
    // Create Account with extended data
    const row = result.rows[0];
    const account = this.toModel(row);
    
    // Add student/staff details to the account's internal data
    if (row.STUDENT_ID) {
      (account as any)._data.STUDENT_ID = row.STUDENT_ID;
      (account as any)._data.PROGRAM = row.PROGRAM;
      (account as any)._data.SEMESTER = row.SEMESTER;
      (account as any)._data.YEAR_OF_STUDY = row.YEAR_OF_STUDY;
    }
    
    if (row.STAFF_ID) {
      (account as any)._data.STAFF_ID = row.STAFF_ID;
      (account as any)._data.DEPARTMENT = row.DEPARTMENT;
      (account as any)._data.POSITION = row.POSITION;
      (account as any)._data.ROLE = row.ROLE;
    }
    
    return account;
  }

  /**
   * Search accounts by name or email
   */
  async search(query: string, accountType?: string): Promise<Account[]> {
    let sql = `
      SELECT * FROM ${this.tableName} 
      WHERE (UPPER(NAME) LIKE :search OR UPPER(EMAIL) LIKE :search)
    `;
    const binds: any = { search: `%${query.toUpperCase()}%` };

    if (accountType) {
      sql += ' AND ACCOUNT_TYPE = :type';
      binds.type = accountType;
    }

    sql += ' ORDER BY NAME';

    const result: any = await this.execute(sql, binds);
    return result.rows.map((row: any) => this.toModel(row));
  }
}
