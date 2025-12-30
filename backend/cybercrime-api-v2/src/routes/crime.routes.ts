import { Router } from 'express';
import { CrimeController } from '../controllers/CrimeController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { Role } from '../types/enums';

const router = Router();
const crimeController = new CrimeController();

// Protected routes
router.use(authenticate); // All routes require authentication

/**
 * GET /api/v2/crimes
 * Get all crime reports with optional filters
 */
router.get('/', crimeController.getAllCrimes);

/**
 * GET /api/v2/crimes/with-weapons
 * Get all crimes involving weapons
 */
router.get('/with-weapons', authorize([Role.STAFF, Role.ADMIN, Role.SUPERADMIN]), crimeController.getCrimesWithWeapons);

/**
 * GET /api/v2/crimes/with-victims
 * Get all crimes with identified victims
 */
router.get('/with-victims', authorize([Role.STAFF, Role.ADMIN, Role.SUPERADMIN]), crimeController.getCrimesWithVictims);

/**
 * GET /api/v2/crimes/high-severity
 * Get all high/critical severity crimes
 */
router.get('/high-severity', authorize([Role.STAFF, Role.ADMIN, Role.SUPERADMIN]), crimeController.getHighSeverityCrimes);

/**
 * GET /api/v2/crimes/active
 * Get all active crimes
 */
router.get('/active', authorize([Role.STAFF, Role.ADMIN, Role.SUPERADMIN]), crimeController.getActiveCrimes);

/**
 * GET /api/v2/crimes/statistics/category
 * Get crime statistics by category
 */
router.get('/statistics/category', authorize([Role.STAFF, Role.ADMIN, Role.SUPERADMIN]), crimeController.getCrimeStatisticsByCategory);

/**
 * GET /api/v2/crimes/statistics/severity
 * Get crime statistics by severity
 */
router.get('/statistics/severity', authorize([Role.STAFF, Role.ADMIN, Role.SUPERADMIN]), crimeController.getCrimeStatisticsBySeverity);

/**
 * GET /api/v2/crimes/category/:category
 * Get all crimes of a specific category
 */
router.get('/category/:category', crimeController.getCrimesByCategory);

/**
 * GET /api/v2/crimes/severity/:severity
 * Get all crimes with a specific severity level
 */
router.get('/severity/:severity', crimeController.getCrimesBySeverity);

/**
 * GET /api/v2/crimes/:id
 * Get a specific crime report by ID
 */
router.get('/:id', crimeController.getCrimeById);

/**
 * POST /api/v2/crimes
 * Create a new crime report
 */
router.post('/', crimeController.createCrime);

/**
 * PUT /api/v2/crimes/:id
 * Update a crime report
 */
router.put('/:id', crimeController.updateCrime);

/**
 * DELETE /api/v2/crimes/:id
 * Delete a crime report
 */
router.delete('/:id', authorize([Role.ADMIN, Role.SUPERADMIN]), crimeController.deleteCrime);

export default router;
