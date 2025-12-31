import { Router } from 'express';
import { AIController } from '../controllers/AIController';

const router = Router();
const aiController = new AIController();

/**
 * POST /api/v2/ai/generate
 * Generate AI responses using LM Studio
 */
router.post('/generate', aiController.generate);

export default router;
