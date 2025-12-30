import { Router } from 'express';
import { AnnouncementController } from '../controllers/AnnouncementController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

const router = Router();
const announcementController = new AnnouncementController();
const authMiddleware = new AuthMiddleware();

// Public routes (no authentication required)
router.get('/active', announcementController.getActive);

// Protected routes (authentication required)
router.get('/', authMiddleware.authenticate, announcementController.getAll);

router.get('/statistics', authMiddleware.authenticate, announcementController.getStatistics);

router.get('/by-audience/:audience', authMiddleware.authenticate, announcementController.getByAudience);

router.get('/by-type/:type', authMiddleware.authenticate, announcementController.getByType);

router.get('/creator/:creatorId', authMiddleware.authenticate, announcementController.getByCreator);

router.get('/:id', authMiddleware.authenticate, announcementController.getById);

// Admin/Staff only routes
router.post(
  '/',
  authMiddleware.authenticate,
  authMiddleware.authorize('ADMIN', 'SUPERADMIN', 'STAFF'),
  announcementController.create
);

router.put(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorize('ADMIN', 'SUPERADMIN', 'STAFF'),
  announcementController.update
);

router.post(
  '/:id/publish',
  authMiddleware.authenticate,
  authMiddleware.authorize('ADMIN', 'SUPERADMIN', 'STAFF'),
  announcementController.publish
);

router.post(
  '/:id/archive',
  authMiddleware.authenticate,
  authMiddleware.authorize('ADMIN', 'SUPERADMIN', 'STAFF'),
  announcementController.archive
);

router.delete(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorize('ADMIN', 'SUPERADMIN'),
  announcementController.delete
);

export default router;
