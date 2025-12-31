import { Router } from 'express';
import { EmergencyController } from '../controllers/EmergencyController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

const router = Router();
const emergencyController = new EmergencyController();
const authMiddleware = new AuthMiddleware();

// Public routes (can view emergency contacts)
router.get('/', emergencyController.getAllContacts);
router.get('/national', emergencyController.getNationalContacts);
router.get('/grouped/state', emergencyController.getContactsGroupedByState);
router.get('/grouped/type', emergencyController.getContactsGroupedByType);
router.get('/state/:state', emergencyController.getContactsByState);
router.get('/type/:type', emergencyController.getContactsByType);
router.get('/:id', emergencyController.getContactById);

// Protected routes (require authentication)
router.post('/', authMiddleware.authenticate, emergencyController.createContact);
router.put('/:id', authMiddleware.authenticate, emergencyController.updateContact);
router.delete('/:id', authMiddleware.authenticate, emergencyController.deleteContact);

export default router;
