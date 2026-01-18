import { Router } from 'express';
import { StaffController } from '../controllers/StaffController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

const router = Router();
const staffController = new StaffController();
const authMiddleware = new AuthMiddleware();

// All staff routes require authentication
router.use(authMiddleware.authenticate);

// GET /api/v2/staff - Get all staff with optional filters
// QUERY PARAMS: ROLE, DEPARTMENT, STATUS
router.get('/', staffController.getAll);

// GET /api/v2/staff/search - Search staff
router.get('/search', staffController.search);

// GET /api/v2/staff/statistics - Get staff statistics
router.get('/statistics', staffController.getStatistics);

// GET /api/v2/staff/departments - Get all departments
router.get('/departments', staffController.getDepartments);

// GET /api/v2/staff/export - Export staff as CSV
router.get('/export', staffController.exportCSV);

// GET /api/v2/staff/role/:role - Get staff by role
router.get('/role/:role', staffController.getByRole);

// GET /api/v2/staff/department/:department - Get staff by department
router.get('/department/:department', staffController.getByDepartment);

// GET /api/v2/staff/:id - Get staff by ID
router.get('/:id', staffController.getById);

// GET /api/v2/staff/:id/subordinates - Get subordinates
router.get('/:id/subordinates', staffController.getSubordinates);

// POST /api/v2/staff - Create new staff (admin only)
router.post(
  '/',
  authMiddleware.authorize('ADMIN', 'SUPERADMIN'),
  staffController.create
);

// PUT /api/v2/staff/:id - Update staff
router.put(
  '/:id',
  authMiddleware.authorize('ADMIN', 'SUPERADMIN'),
  staffController.update
);

// DELETE /api/v2/staff/:id - Delete staff (admin only)
router.delete(
  '/:id',
  authMiddleware.authorize('ADMIN', 'SUPERADMIN'),
  staffController.delete
);

// GET /api/v2/staff/:id/workload - Get current workload of a staff member
router.get(
  '/:id/workload',
  staffController.getStaffCurrentWorkload
);

export default router;
