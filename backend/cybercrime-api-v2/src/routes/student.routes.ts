import { Router } from 'express';
import { StudentController } from '../controllers/StudentController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

const router = Router();
const studentController = new StudentController();
const authMiddleware = new AuthMiddleware();

// All student routes require authentication
router.use(authMiddleware.authenticate);

// GET /api/v2/students - Get all students with optional filters
router.get('/', studentController.getAll);

// GET /api/v2/students/search - Search students
router.get('/search', studentController.search);

// GET /api/v2/students/statistics - Get student statistics
router.get('/statistics', studentController.getStatistics);

// GET /api/v2/students/program/:program - Get students by program
router.get('/program/:program', studentController.getByProgram);

// GET /api/v2/students/semester/:semester - Get students by semester
router.get('/semester/:semester', studentController.getBySemester);

// GET /api/v2/students/year/:year - Get students by year of study
router.get('/year/:year', studentController.getByYear);

// GET /api/v2/students/:id - Get student by ID
router.get('/:id', studentController.getById);

// POST /api/v2/students - Create new student (admin only)
router.post(
  '/',
  authMiddleware.authorize('ADMIN', 'SUPERADMIN'),
  studentController.create
);

// PUT /api/v2/students/:id - Update student
router.put(
  '/:id',
  authMiddleware.authorize('ADMIN', 'SUPERADMIN'),
  studentController.update
);

// DELETE /api/v2/students/:id - Delete student (admin only)
router.delete(
  '/:id',
  authMiddleware.authorize('ADMIN', 'SUPERADMIN'),
  studentController.delete
);

export default router;
