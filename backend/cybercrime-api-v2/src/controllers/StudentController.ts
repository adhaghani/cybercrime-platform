import { Request, Response } from 'express';
import { StudentService, CreateStudentDTO, UpdateStudentDTO, StudentSearchFilters } from '../services/StudentService';
import { Logger } from '../utils/Logger';

const logger = new Logger('StudentController');

export class StudentController {
  private studentService: StudentService;

  constructor(studentService: StudentService = new StudentService()) {
    this.studentService = studentService;
  }

  /**
   * GET /api/v2/students
   * Get all students with optional filters
   */
  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const filters: StudentSearchFilters = {
        program: req.query.program as string | undefined,
        semester: req.query.semester ? parseInt(req.query.semester as string) : undefined,
        year_of_study: req.query.year_of_study ? parseInt(req.query.year_of_study as string) : undefined
      };

      const students = await this.studentService.getAll(filters);
      res.status(200).json({
        students: students.map(s => s.toJSON())
      });
    } catch (error) {
      logger.error('Get all students error:', error);
      res.status(500).json({
        error: 'Failed to get students',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * GET /api/v2/students/:id
   * Get student by account ID
   */
  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid account ID' });
        return;
      }

      const student = await this.studentService.getById(id);
      if (!student) {
        res.status(404).json({ error: 'Student not found' });
        return;
      }

      res.status(200).json(student.toJSON());
    } catch (error) {
      logger.error('Get student by ID error:', error);
      res.status(500).json({
        error: 'Failed to get student',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * GET /api/v2/students/search
   * Search students by query
   */
  search = async (req: Request, res: Response): Promise<void> => {
    try {
      const query = req.query.q as string;
      if (!query || query.trim() === '') {
        res.status(400).json({ error: 'Search query is required' });
        return;
      }

      const filters: Omit<StudentSearchFilters, 'query'> = {
        program: req.query.program as string | undefined,
        semester: req.query.semester ? parseInt(req.query.semester as string) : undefined,
        year_of_study: req.query.year_of_study ? parseInt(req.query.year_of_study as string) : undefined
      };

      const students = await this.studentService.search(query, filters);
      res.status(200).json(students.map(s => s.toJSON()));
    } catch (error) {
      logger.error('Search students error:', error);
      res.status(500).json({
        error: 'Failed to search students',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * POST /api/v2/students
   * Create new student record
   */
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const data: CreateStudentDTO = req.body;

      // Validate required fields
      if (!data.account_id) {
        res.status(400).json({ error: 'Account ID is required' });
        return;
      }

      if (!data.program) {
        res.status(400).json({ error: 'Program is required' });
        return;
      }

      if (!data.semester || isNaN(data.semester)) {
        res.status(400).json({ error: 'Valid semester is required' });
        return;
      }

      if (!data.year_of_study || isNaN(data.year_of_study)) {
        res.status(400).json({ error: 'Valid year of study is required' });
        return;
      }

      const student = await this.studentService.create(data);
      res.status(201).json({
        message: 'Student created successfully',
        student: student.toJSON()
      });
    } catch (error) {
      logger.error('Create student error:', error);

      if (error instanceof Error && error.message.includes('required')) {
        res.status(400).json({ error: error.message });
        return;
      }

      res.status(500).json({
        error: 'Failed to create student',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * PUT /api/v2/students/:id
   * Update student information
   */
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid account ID' });
        return;
      }

      const updates: UpdateStudentDTO = req.body;

      // Validate numeric fields if provided
      if (updates.semester !== undefined && isNaN(updates.semester)) {
        res.status(400).json({ error: 'Invalid semester value' });
        return;
      }

      if (updates.year_of_study !== undefined && isNaN(updates.year_of_study)) {
        res.status(400).json({ error: 'Invalid year of study value' });
        return;
      }

      const student = await this.studentService.update(id, updates);
      res.status(200).json({
        message: 'Student updated successfully',
        student: student.toJSON()
      });
    } catch (error) {
      logger.error('Update student error:', error);

      if (error instanceof Error && error.message === 'Student not found') {
        res.status(404).json({ error: error.message });
        return;
      }

      if (error instanceof Error && error.message.includes('must be at least')) {
        res.status(400).json({ error: error.message });
        return;
      }

      res.status(500).json({
        error: 'Failed to update student',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * DELETE /api/v2/students/:id
   * Delete student record
   */
  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid account ID' });
        return;
      }

      const deleted = await this.studentService.delete(id);
      if (!deleted) {
        res.status(404).json({ error: 'Student not found' });
        return;
      }

      res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
      logger.error('Delete student error:', error);

      if (error instanceof Error && error.message === 'Student not found') {
        res.status(404).json({ error: error.message });
        return;
      }

      res.status(500).json({
        error: 'Failed to delete student',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * GET /api/v2/students/program/:program
   * Get students by program
   */
  getByProgram = async (req: Request, res: Response): Promise<void> => {
    try {
      const program = req.params.program;
      if (!program) {
        res.status(400).json({ error: 'Program is required' });
        return;
      }

      const students = await this.studentService.getByProgram(program);
      res.status(200).json(students.map(s => s.toJSON()));
    } catch (error) {
      logger.error('Get students by program error:', error);
      res.status(500).json({
        error: 'Failed to get students by program',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * GET /api/v2/students/semester/:semester
   * Get students by semester
   */
  getBySemester = async (req: Request, res: Response): Promise<void> => {
    try {
      const semester = parseInt(req.params.semester);
      if (isNaN(semester)) {
        res.status(400).json({ error: 'Invalid semester' });
        return;
      }

      const students = await this.studentService.getBySemester(semester);
      res.status(200).json(students.map(s => s.toJSON()));
    } catch (error) {
      logger.error('Get students by semester error:', error);
      res.status(500).json({
        error: 'Failed to get students by semester',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * GET /api/v2/students/year/:year
   * Get students by year of study
   */
  getByYear = async (req: Request, res: Response): Promise<void> => {
    try {
      const year = parseInt(req.params.year);
      if (isNaN(year)) {
        res.status(400).json({ error: 'Invalid year' });
        return;
      }

      const students = await this.studentService.getByYearOfStudy(year);
      res.status(200).json(students.map(s => s.toJSON()));
    } catch (error) {
      logger.error('Get students by year error:', error);
      res.status(500).json({
        error: 'Failed to get students by year',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * GET /api/v2/students/statistics
   * Get student statistics
   */
  getStatistics = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.studentService.getStatistics();
      res.status(200).json(stats);
    } catch (error) {
      logger.error('Get student statistics error:', error);
      res.status(500).json({
        error: 'Failed to get student statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}
