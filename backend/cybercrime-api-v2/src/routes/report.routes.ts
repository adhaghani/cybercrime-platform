import { Router } from 'express';
import { ReportController } from '../controllers/ReportController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { Role } from '../types/enums';

const router = Router();
const reportController = new ReportController();

// Public routes (none for reports - all require authentication)

// Protected routes
router.use(authenticate); // All routes below require authentication

/**
 * GET /api/v2/reports
 * Get all reports with optional filters
 */
router.get('/', reportController.getAllReports);

/**
 * GET /api/v2/reports/pending
 * Get all pending reports
 */
router.get('/pending', reportController.getPendingReports);

/**
 * GET /api/v2/reports/active
 * Get all active reports
 */
router.get('/active', reportController.getActiveReports);

/**
 * GET /api/v2/reports/recent
 * Get recent reports
 */
router.get('/recent', reportController.getRecentReports);

/**
 * GET /api/v2/reports/search
 * Search reports
 */
router.get('/search', reportController.searchReports);

/**
 * GET /api/v2/reports/with-details
 * Get reports with type-specific details (CRIME or FACILITY)
 * Query params: type (CRIME or FACILITY)
 */
router.get('/with-details', reportController.getReportsWithDetails);

/**
 * GET /api/v2/reports/statistics
 * Get report statistics
 */
router.get('/statistics', authorize([Role.STAFF, Role.ADMIN, Role.SUPERADMIN]), reportController.getReportStatistics);

/**
 * GET /api/v2/reports/status/:status
 * Get all reports with a specific status
 */
router.get('/status/:status', reportController.getReportsByStatus);

/**
 * GET /api/v2/reports/type/:type
 * Get all reports of a specific type
 */
router.get('/type/:type', reportController.getReportsByType);

/**
 * GET /api/v2/reports/submitter/:submitterId
 * Get all reports by a specific submitter
 */
router.get('/submitter/:submitterId', reportController.getReportsBySubmitter);

/**
 * GET /api/v2/reports/:id
 * Get a specific report by ID
 */
router.get('/:id', reportController.getReportById);

/**
 * POST /api/v2/reports
 * Create a new report
 */
router.post('/', reportController.createReport);

/**
 * POST /api/v2/reports/bulk-update-status
 * Bulk update report statuses
 */
router.post('/bulk-update-status', authorize([Role.STAFF, Role.ADMIN, Role.SUPERADMIN]), reportController.bulkUpdateStatus);

/**
 * PUT /api/v2/reports/:id
 * Update a report
 */
router.put('/:id', reportController.updateReport);

/**
 * PATCH /api/v2/reports/:id/status
 * Update report status
 */
router.patch('/:id/status', authorize([Role.STAFF, Role.ADMIN, Role.SUPERADMIN]), reportController.updateReportStatus);

/**
 * DELETE /api/v2/reports/:id
 * Delete a report
 */
router.delete('/:id', authorize([Role.ADMIN, Role.SUPERADMIN]), reportController.deleteReport);

export default router;
