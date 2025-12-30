/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseRepository } from './base/BaseRepository';
import { Student } from '../models/Student';

export class StudentRepository extends BaseRepository<Student> {
  constructor() {
    super('STUDENT', 'ACCOUNT_ID');
  }

  protected toModel(row: any): Student {
    return new Student(row);
  }

  async findAll(filters?: Record<string, any>): Promise<Student[]> {
    let sql = `
      SELECT st.ACCOUNT_ID, st.STUDENT_ID, st.PROGRAM, st.SEMESTER, 
             st.YEAR_OF_STUDY, st.CREATED_AT, st.UPDATED_AT,
             a.NAME, a.EMAIL, a.CONTACT_NUMBER, a.AVATAR_URL, a.PASSWORD_HASH, a.ACCOUNT_TYPE
      FROM ${this.tableName} st
      JOIN ACCOUNT a ON st.ACCOUNT_ID = a.ACCOUNT_ID
    `;
    const binds: any = {};

    if (filters && Object.keys(filters).length > 0) {
      const whereClauses: string[] = [];
      if (filters.PROGRAM) {
        whereClauses.push('st.PROGRAM = :program');
        binds.program = filters.PROGRAM;
      }
      if (filters.SEMESTER) {
        whereClauses.push('st.SEMESTER = :semester');
        binds.semester = filters.SEMESTER;
      }
      if (filters.YEAR_OF_STUDY) {
        whereClauses.push('st.YEAR_OF_STUDY = :year');
        binds.year = filters.YEAR_OF_STUDY;
      }
      if (whereClauses.length > 0) {
        sql += ` WHERE ${whereClauses.join(' AND ')}`;
      }
    }

    sql += ' ORDER BY st.CREATED_AT DESC';

    const result: any = await this.execute(sql, binds);
    return result.rows.map((row: any) => this.toModel(row));
  }

  async findById(id: string | number): Promise<Student | null> {
    const sql = `
      SELECT st.ACCOUNT_ID, st.STUDENT_ID, st.PROGRAM, st.SEMESTER, 
             st.YEAR_OF_STUDY, st.CREATED_AT, st.UPDATED_AT,
             a.NAME, a.EMAIL, a.CONTACT_NUMBER, a.AVATAR_URL, a.PASSWORD_HASH, a.ACCOUNT_TYPE
      FROM ${this.tableName} st
      JOIN ACCOUNT a ON st.ACCOUNT_ID = a.ACCOUNT_ID
      WHERE st.ACCOUNT_ID = :id
    `;
    const result: any = await this.execute(sql, { id });
    
    if (result.rows.length === 0) return null;
    return this.toModel(result.rows[0]);
  }

  async create(student: Student): Promise<Student> {
    const sql = `
      UPDATE ${this.tableName}
      SET STUDENT_ID = :studentId,
          PROGRAM = :program,
          SEMESTER = :semester,
          YEAR_OF_STUDY = :year,
          UPDATED_AT = SYSTIMESTAMP
      WHERE ACCOUNT_ID = :accountId AND STUDENT_ID IS NULL
    `;

    const binds = {
      studentId: student.getStudentId(),
      accountId: student.getId(),
      program: student.getProgram(),
      semester: student.getSemester(),
      year: student.getYearOfStudy()
    };

    await this.execute(sql, binds, { autoCommit: true });
    
    const created = await this.findById(student.getId()!);
    if (!created) {
      throw new Error('Failed to create student');
    }
    return created;
  }

  async update(id: string | number, updates: any): Promise<Student> {
    const setClauses: string[] = [];
    const binds: Record<string, any> = { id };

    if (updates.STUDENT_ID) {
      setClauses.push('STUDENT_ID = :studentId');
      binds.studentId = updates.STUDENT_ID;
    }
    if (updates.PROGRAM) {
      setClauses.push('PROGRAM = :program');
      binds.program = updates.PROGRAM;
    }
    if (updates.SEMESTER !== undefined) {
      setClauses.push('SEMESTER = :semester');
      binds.semester = updates.SEMESTER;
    }
    if (updates.YEAR_OF_STUDY !== undefined) {
      setClauses.push('YEAR_OF_STUDY = :year');
      binds.year = updates.YEAR_OF_STUDY;
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
      throw new Error('Failed to update student');
    }
    return updated;
  }

  async search(query: string): Promise<Student[]> {
    const sql = `
      SELECT st.ACCOUNT_ID, st.STUDENT_ID, st.PROGRAM, st.SEMESTER, 
             st.YEAR_OF_STUDY, st.CREATED_AT, st.UPDATED_AT,
             a.NAME, a.EMAIL, a.CONTACT_NUMBER, a.AVATAR_URL, a.PASSWORD_HASH, a.ACCOUNT_TYPE
      FROM ${this.tableName} st
      JOIN ACCOUNT a ON st.ACCOUNT_ID = a.ACCOUNT_ID
      WHERE UPPER(a.NAME) LIKE :search 
         OR UPPER(a.EMAIL) LIKE :search
         OR UPPER(st.STUDENT_ID) LIKE :search
      ORDER BY a.NAME
    `;
    
    const result: any = await this.execute(sql, { search: `%${query.toUpperCase()}%` });
    return result.rows.map((row: any) => this.toModel(row));
  }
}
