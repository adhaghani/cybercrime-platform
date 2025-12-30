import { Router } from 'express';
import { ResolutionController } from '../controllers/ResolutionController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { Role } from '../types/enums';

const router = Router();
const resolutionController = new ResolutionController();

// All routes require authentication
router.use(authenticate);

/**
 * POST /api/v2/resolutions
 * Create a new resolution (Staff/Admin only)
 */
router.post('/', authorize([Role.STAFF, Role.ADMIN, Role.SUPERADMIN]), resolutionController.createResolution);

/**
 * GET /api/v2/resolutions
 * Get all resolutions (Admin only)
 */
router.get('/', authorize([Role.ADMIN, Role.SUPERADMIN]), resolutionController.getAllResolutions);

/**
 * GET /api/v2/resolutions/:reportId
 * Get resolutions for a specific report
 */
router.get('/:reportId', resolutionController.getResolutionsByReport);

export default router;
