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
 * Get all teams (all supervisors with their team members)
 */
router.get('/', authorize([Role.STAFF, Role.ADMIN, Role.SUPERADMIN]), teamController.getAllTeams);

/**
 * GET /api/v2/teams/my-team
 * Get the current user's team
 */
router.get('/my-team', authorize([Role.STAFF, Role.ADMIN, Role.SUPERADMIN]), teamController.getMyTeam);

/**
 * GET /api/v2/teams/search
 * Search teams by supervisor name, department, or position
 */
router.get('/search', authorize([Role.STAFF, Role.ADMIN, Role.SUPERADMIN]), teamController.searchTeams);

/**
 * GET /api/v2/teams/statistics/all
 * Get statistics for all teams
 */
router.get('/statistics/all', authorize([Role.ADMIN, Role.SUPERADMIN]), teamController.getAllTeamsStatistics);

/**
 * GET /api/v2/teams/lead/:leadId
 * Get all teams led by a specific supervisor
 */
router.get('/lead/:leadId', authorize([Role.STAFF, Role.ADMIN, Role.SUPERADMIN]), teamController.getTeamsByLead);

/**
 * GET /api/v2/teams/:id
 * Get a specific team by supervisor ID
 */
router.get('/:id', authorize([Role.STAFF, Role.ADMIN, Role.SUPERADMIN]), teamController.getTeamById);

/**
 * GET /api/v2/teams/:id/members
 * Get all members of a team (by supervisor ID)
 */
router.get('/:id/members', authorize([Role.STAFF, Role.ADMIN, Role.SUPERADMIN]), teamController.getTeamMembers);

/**
 * GET /api/v2/teams/:id/statistics
 * Get statistics for a specific team
 */
router.get('/:id/statistics', authorize([Role.STAFF, Role.ADMIN, Role.SUPERADMIN]), teamController.getTeamStatistics);

/** GET /api/v2/teams/performance-metrics/all
 * Get performance metrics for all teams
 */
router.get('/performance-metrics/all', authorize([Role.ADMIN, Role.SUPERADMIN]), teamController.getAllTeamPerformanceMetrics);

export default router;
