import { Router } from 'express';
import { TeamController } from '../controllers/TeamController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { Role } from '../types/enums';

const router = Router();
const teamController = new TeamController();

// Protected routes
router.use(authenticate); // All routes require authentication

/**
 * GET /api/v2/teams
 * Get all teams
 */
router.get('/', authorize([Role.STAFF, Role.ADMIN, Role.SUPERADMIN]), teamController.getAllTeams);

/**
 * GET /api/v2/teams/search
 * Search teams
 */
router.get('/search', authorize([Role.STAFF, Role.ADMIN, Role.SUPERADMIN]), teamController.searchTeams);

/**
 * GET /api/v2/teams/statistics/all
 * Get statistics for all teams
 */
router.get('/statistics/all', authorize([Role.ADMIN, Role.SUPERADMIN]), teamController.getAllTeamsStatistics);

/**
 * GET /api/v2/teams/lead/:leadId
 * Get all teams led by a specific person
 */
router.get('/lead/:leadId', authorize([Role.STAFF, Role.ADMIN, Role.SUPERADMIN]), teamController.getTeamsByLead);

/**
 * GET /api/v2/teams/:id
 * Get a specific team by ID
 */
router.get('/:id', authorize([Role.STAFF, Role.ADMIN, Role.SUPERADMIN]), teamController.getTeamById);

/**
 * GET /api/v2/teams/:id/members
 * Get all members of a team
 */
router.get('/:id/members', authorize([Role.STAFF, Role.ADMIN, Role.SUPERADMIN]), teamController.getTeamMembers);

/**
 * GET /api/v2/teams/:id/statistics
 * Get statistics for a specific team
 */
router.get('/:id/statistics', authorize([Role.STAFF, Role.ADMIN, Role.SUPERADMIN]), teamController.getTeamStatistics);

/**
 * POST /api/v2/teams
 * Create a new team
 */
router.post('/', authorize([Role.ADMIN, Role.SUPERADMIN]), teamController.createTeam);

/**
 * POST /api/v2/teams/:id/members
 * Add a member to a team
 */
router.post('/:id/members', authorize([Role.ADMIN, Role.SUPERADMIN]), teamController.addMember);

/**
 * POST /api/v2/teams/:id/members/bulk
 * Bulk add members to a team
 */
router.post('/:id/members/bulk', authorize([Role.ADMIN, Role.SUPERADMIN]), teamController.bulkAddMembers);

/**
 * PUT /api/v2/teams/:id
 * Update a team
 */
router.put('/:id', authorize([Role.ADMIN, Role.SUPERADMIN]), teamController.updateTeam);

/**
 * PATCH /api/v2/teams/:id/lead
 * Change team lead
 */
router.patch('/:id/lead', authorize([Role.ADMIN, Role.SUPERADMIN]), teamController.changeTeamLead);

/**
 * DELETE /api/v2/teams/:id
 * Delete a team
 */
router.delete('/:id', authorize([Role.SUPERADMIN]), teamController.deleteTeam);

/**
 * DELETE /api/v2/teams/:id/members/:memberId
 * Remove a member from a team
 */
router.delete('/:id/members/:memberId', authorize([Role.ADMIN, Role.SUPERADMIN]), teamController.removeMember);

export default router;
