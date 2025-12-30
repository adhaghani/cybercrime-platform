import { Student } from '../models/Student';
import { StudentRepository } from '../repositories/StudentRepository';
import { Logger } from '../utils/Logger';

const logger = new Logger('StudentService');

export interface CreateStudentDTO {
  account_id: number;
  student_id: string;
  program: string;
  semester: number;
  year_of_study: number;
}

export interface UpdateStudentDTO {
  program?: string;
  semester?: number;
  year_of_study?: number;
}

export interface StudentSearchFilters {
  program?: string;
  semester?: number;
  year_of_study?: number;
  query?: string;
}

export class StudentService {
  private studentRepo: StudentRepository;

  constructor(studentRepo: StudentRepository = new StudentRepository()) {
    this.studentRepo = studentRepo;
  }

  /**
   * Get all students with optional filters
   */
  async getAll(filters?: StudentSearchFilters): Promise<Student[]> {
    try {
      return await this.studentRepo.findAll(filters);
    } catch (error) {
      logger.error('Error getting all students:', error);
      throw error;
    }
  }

  /**
   * Get student by ID
   */
  async getById(accountId: number): Promise<Student | null> {
    try {
      return await this.studentRepo.findById(accountId);
    } catch (error) {
      logger.error(`Error getting student by ID ${accountId}:`, error);
      throw error;
    }
  }

  /**
   * Search students by query (searches name, email, student ID)
   */
  async search(query: string, filters?: Omit<StudentSearchFilters, 'query'>): Promise<Student[]> {
    try {
      const students = await this.studentRepo.search(query);
      
      // Apply additional filters if provided
      if (!filters) {
        return students;
      }

      return students.filter(student => {
        if (filters.program && student.getProgram() !== filters.program) {
          return false;
        }
        if (filters.semester !== undefined && student.getSemester() !== filters.semester) {
          return false;
        }
        if (filters.year_of_study !== undefined && student.getYearOfStudy() !== filters.year_of_study) {
          return false;
        }
        return true;
      });
    } catch (error) {
      logger.error('Error searching students:', error);
      throw error;
    }
  }

  /**
   * Create new student record
   */
  async create(data: CreateStudentDTO): Promise<Student> {
    try {
      // Validate required fields
      if (!data.account_id || !data.program || !data.semester || !data.year_of_study) {
        throw new Error('Account ID, program, semester, and year of study are required');
      }

      // Validate semester and year
      if (data.semester < 1) {
        throw new Error('Semester must be at least 1');
      }

      if (data.year_of_study < 1) {
        throw new Error('Year of study must be at least 1');
      }

      // Fetch the account to get full data
      const account = await this.studentRepo.findById(data.account_id);
      if (account) {
        // Update existing student record
        return await this.studentRepo.update(data.account_id, {
          STUDENT_ID: data.student_id,
          PROGRAM: data.program,
          SEMESTER: data.semester,
          YEAR_OF_STUDY: data.year_of_study
        });
      }

      throw new Error('Account not found');
    } catch (error) {
      logger.error('Error creating student:', error);
      throw error;
    }
  }

  /**
   * Update student information
   */
  async update(accountId: number, updates: UpdateStudentDTO): Promise<Student> {
    try {
      // Check if student exists
      const existing = await this.studentRepo.findById(accountId);
      if (!existing) {
        throw new Error('Student not found');
      }

      // Validate updates
      if (updates.semester !== undefined && updates.semester < 1) {
        throw new Error('Semester must be at least 1');
      }

      if (updates.year_of_study !== undefined && updates.year_of_study < 1) {
        throw new Error('Year of study must be at least 1');
      }

      const updated = await this.studentRepo.update(accountId, updates);
      logger.info(`Student updated: ${accountId}`);
      return updated;
    } catch (error) {
      logger.error('Error updating student:', error);
      throw error;
    }
  }

  /**
   * Delete student record
   */
  async delete(accountId: number): Promise<boolean> {
    try {
      const existing = await this.studentRepo.findById(accountId);
      if (!existing) {
        throw new Error('Student not found');
      }

      const deleted = await this.studentRepo.delete(accountId);
      if (deleted) {
        logger.info(`Student deleted: ${accountId}`);
      }
      return deleted;
    } catch (error) {
      logger.error('Error deleting student:', error);
      throw error;
    }
  }

  /**
   * Get students by program
   */
  async getByProgram(program: string): Promise<Student[]> {
    try {
      return await this.studentRepo.findAll({ program });
    } catch (error) {
      logger.error(`Error getting students by program ${program}:`, error);
      throw error;
    }
  }

  /**
   * Get students by semester
   */
  async getBySemester(semester: number): Promise<Student[]> {
    try {
      return await this.studentRepo.findAll({ semester });
    } catch (error) {
      logger.error(`Error getting students by semester ${semester}:`, error);
      throw error;
    }
  }

  /**
   * Get students by year of study
   */
  async getByYearOfStudy(year: number): Promise<Student[]> {
    try {
      return await this.studentRepo.findAll({ year_of_study: year });
    } catch (error) {
      logger.error(`Error getting students by year ${year}:`, error);
      throw error;
    }
  }

  /**
   * Get statistics about students
   */
  async getStatistics(): Promise<{
    total: number;
    byProgram: Record<string, number>;
    bySemester: Record<number, number>;
    byYear: Record<number, number>;
  }> {
    try {
      const allStudents = await this.studentRepo.findAll();

      const stats = {
        total: allStudents.length,
        byProgram: {} as Record<string, number>,
        bySemester: {} as Record<number, number>,
        byYear: {} as Record<number, number>
      };

      allStudents.forEach(student => {
        const program = student.getProgram();
        const semester = student.getSemester();
        const year = student.getYearOfStudy();

        // Count by program
        stats.byProgram[program] = (stats.byProgram[program] || 0) + 1;

        // Count by semester
        stats.bySemester[semester] = (stats.bySemester[semester] || 0) + 1;

        // Count by year
        stats.byYear[year] = (stats.byYear[year] || 0) + 1;
      });

      return stats;
    } catch (error) {
      logger.error('Error getting student statistics:', error);
      throw error;
    }
  }
}
