import { Router } from 'express';
import { GeneratedReportController } from '../controllers/GeneratedReportController';
import { authenticate } from '../middleware/auth';

const router = Router();
const reportController = new GeneratedReportController();

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/v2/generated-reports
 * Get all generated reports with optional filters
 */
router.get('/', reportController.getAllReports);

/**
 * GET /api/v2/generated-reports/:id
 * Get generated report by ID
 */
router.get('/:id', reportController.getReportById);

/**
 * POST /api/v2/generated-reports
 * Create new generated report
 */
router.post('/', reportController.createReport);

/**
 * DELETE /api/v2/generated-reports/:id
 * Delete generated report
 */
router.delete('/:id', reportController.deleteReport);

export default router;
