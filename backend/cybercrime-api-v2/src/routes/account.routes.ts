import { Router } from 'express';
import { AccountController } from '../controllers/AccountController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { Role } from '../types/enums';

const router = Router();
const accountController = new AccountController();

/**
 * GET /api/v2/accounts
 * Get all accounts (requires authentication)
 */
router.get('/', authenticate, accountController.getAllAccounts);

/**
 * GET /api/v2/accounts/count
 * Get account counts by type
 */
router.get('/count', authenticate, accountController.getAccountsCount);

/**
 * GET /api/v2/accounts/:id
 * Get account by ID
 */
router.get('/:id', authenticate, accountController.getAccountById);

/**
 * PUT /api/v2/accounts/:id
 * Update account (requires authentication)
 */
router.put('/:id', authenticate, accountController.updateAccount);

/**
 * DELETE /api/v2/accounts/:id
 * Delete account (Admin only)
 */
router.delete('/:id', authenticate, authorize([Role.ADMIN, Role.SUPERADMIN]), accountController.deleteAccount);

export default router;
