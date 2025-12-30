import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

const router = Router();
const authController = new AuthController();
const authMiddleware = new AuthMiddleware();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/me', authMiddleware.authenticate, authController.getCurrentUser);
router.put('/update-profile', authMiddleware.authenticate, authController.updateProfile);

export default router;
