import { Router } from 'express';
import { ReportAssignmentController } from '../controllers/ReportAssignmentController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { Role } from '../types/enums';

const router = Router();
const assignmentController = new ReportAssignmentController();

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/v2/report-assignments
 * Get all assignments
 */
router.get('/', assignmentController.getAllAssignments);

/**
 * GET /api/v2/report-assignments/my-assignments
 * Get current user's assignments
 */
router.get('/my-assignments', assignmentController.getMyAssignments);

/**
 * GET /api/v2/report-assignments/by-staff/:staffId
 * Get assignments by staff ID
 */
router.get('/by-staff/:staffId', assignmentController.getAssignmentsByStaff);

/**
 * GET /api/v2/report-assignments/by-report/:reportId
 * Get assignments by report ID
 */
router.get('/by-report/:reportId', assignmentController.getAssignmentsByReport);

/**
 * POST /api/v2/report-assignments
 * Create new assignment (Staff/Admin only)
 */
router.post('/', authorize([Role.STAFF, Role.ADMIN, Role.SUPERADMIN]), assignmentController.createAssignment);

/**
 * PUT /api/v2/report-assignments/bulk-update
 * Bulk update assignments (Staff/Admin only)
 */
router.put('/bulk-update', authorize([Role.STAFF, Role.ADMIN, Role.SUPERADMIN]), assignmentController.bulkUpdateAssignments);

/**
 * PUT /api/v2/report-assignments/:id
 * Update assignment
 */
router.put('/:id', assignmentController.updateAssignment);

/**
 * DELETE /api/v2/report-assignments/:id
 * Delete assignment (Admin only)
 */
router.delete('/:id', authorize([Role.ADMIN, Role.SUPERADMIN]), assignmentController.deleteAssignment);

export default router;
