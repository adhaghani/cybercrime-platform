import { Router } from 'express';
import { PoliceController } from '../controllers/PoliceController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

const router = Router();
const policeController = new PoliceController();
const authMiddleware = new AuthMiddleware();

// Public routes (anyone can view police stations)
router.get('/', policeController.getAll);
router.get('/:id', policeController.getById);

// Protected routes (only authenticated staff can modify)
router.post(
  '/',
  authMiddleware.authenticate,
  authMiddleware.authorize('ADMIN', 'SUPERADMIN', 'STAFF'),
  policeController.create
);

router.put(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorize('ADMIN', 'SUPERADMIN', 'STAFF'),
  policeController.update
);

router.delete(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorize('ADMIN', 'SUPERADMIN'),
  policeController.delete
);

export default router;
