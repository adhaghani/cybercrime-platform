import { Router } from 'express';
import { FacilityController } from '../controllers/FacilityController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { Role } from '../types/enums';

const router = Router();
const facilityController = new FacilityController();

// Protected routes
router.use(authenticate); // All routes require authentication

/**
 * GET /api/v2/facilities
 * Get all facility reports with optional filters
 */
router.get('/', facilityController.getAllFacilities);

/**
 * GET /api/v2/facilities/maintenance-required
 * Get all facilities requiring maintenance
 */
router.get('/maintenance-required', authorize([Role.STAFF, Role.ADMIN, Role.SUPERADMIN]), facilityController.getFacilitiesRequiringMaintenance);

/**
 * GET /api/v2/facilities/urgent
 * Get all urgent facilities
 */
router.get('/urgent', authorize([Role.STAFF, Role.ADMIN, Role.SUPERADMIN]), facilityController.getUrgentFacilities);

/**
 * GET /api/v2/facilities/active
 * Get all active facilities
 */
router.get('/active', authorize([Role.STAFF, Role.ADMIN, Role.SUPERADMIN]), facilityController.getActiveFacilities);

/**
 * GET /api/v2/facilities/maintenance-backlog
 * Get maintenance backlog
 */
router.get('/maintenance-backlog', authorize([Role.STAFF, Role.ADMIN, Role.SUPERADMIN]), facilityController.getMaintenanceBacklog);

/**
 * GET /api/v2/facilities/statistics/type
 * Get facility statistics by type
 */
router.get('/statistics/type', authorize([Role.STAFF, Role.ADMIN, Role.SUPERADMIN]), facilityController.getFacilityStatisticsByType);

/**
 * GET /api/v2/facilities/statistics/urgency
 * Get facility statistics by urgency
 */
router.get('/statistics/urgency', authorize([Role.STAFF, Role.ADMIN, Role.SUPERADMIN]), facilityController.getFacilityStatisticsByUrgency);

/**
 * GET /api/v2/facilities/cost-summary
 * Get cost summary
 */
router.get('/cost-summary', authorize([Role.ADMIN, Role.SUPERADMIN]), facilityController.getCostSummary);

/**
 * GET /api/v2/facilities/total-cost
 * Get total estimated cost
 */
router.get('/total-cost', authorize([Role.ADMIN, Role.SUPERADMIN]), facilityController.getTotalEstimatedCost);

/**
 * GET /api/v2/facilities/type/:facilityType
 * Get all facilities of a specific type
 */
router.get('/type/:facilityType', facilityController.getFacilitiesByType);

/**
 * GET /api/v2/facilities/urgency/:urgency
 * Get all facilities with a specific urgency level
 */
router.get('/urgency/:urgency', facilityController.getFacilitiesByUrgency);

/**
 * GET /api/v2/facilities/building/:building
 * Get all facilities in a specific building
 */
router.get('/building/:building', facilityController.getFacilitiesByBuilding);

/**
 * GET /api/v2/facilities/:id
 * Get a specific facility report by ID
 */
router.get('/:id', facilityController.getFacilityById);

/**
 * POST /api/v2/facilities
 * Create a new facility report
 */
router.post('/', facilityController.createFacility);

/**
 * PUT /api/v2/facilities/:id
 * Update a facility report
 */
router.put('/:id', facilityController.updateFacility);

/**
 * DELETE /api/v2/facilities/:id
 * Delete a facility report
 */
router.delete('/:id', authorize([Role.ADMIN, Role.SUPERADMIN]), facilityController.deleteFacility);

export default router;
