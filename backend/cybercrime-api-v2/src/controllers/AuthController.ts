/* eslint-disable @typescript-eslint/no-explicit-any */import { Request, Response } from 'express';
import { AuthService, RegisterDTO, LoginDTO } from '../services/AuthService';
import { Logger } from '../utils/Logger';

const logger = new Logger('AuthController');

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService = new AuthService()) {
    this.authService = authService;
  }

  /**
   * POST /api/v2/auth/register
   */
  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const registerData: RegisterDTO = req.body;

      // Validate required fields
      if (!registerData.name || !registerData.email || !registerData.password) {
        res.status(400).json({
          error: 'Name, email, and password are required'
        });
        return;
      }

      if (!registerData.account_type) {
        registerData.account_type = 'STUDENT';
      }

      const result = await this.authService.register(registerData);

      if (!result.success) {
        res.status(400).json({ error: result.message });
        return;
      }

      res.status(201).json({
        message: result.message,
        token: result.token,
        account: result.account?.toJSON()
      });
    } catch (error) {
      logger.error('Register controller error:', error);
      res.status(500).json({
        error: 'Registration failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * POST /api/v2/auth/login
   */
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const loginData: LoginDTO = req.body;

      // Validate required fields
      if (!loginData.email || !loginData.password) {
        res.status(400).json({
          error: 'email and password are required'
        });
        return;
      }

      const result = await this.authService.login(loginData);

      if (!result.success) {
        res.status(401).json({ error: result.message });
        return;
      }

      res.status(200).json({
        message: result.message,
        token: result.token,
        account: result.account?.toJSON()
      });
    } catch (error) {
      logger.error('Login controller error:', error);
      res.status(500).json({
        error: 'Login failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * GET /api/v2/auth/me
   */
  getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
      // Account ID should be set by auth middleware
      const accountId = (req as any).user?.accountId;

      if (!accountId) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const account = await this.authService.getAccountById(accountId);

      if (!account) {
        res.status(404).json({ error: 'Account not found' });
        return;
      }

      res.status(200).json(account.toJSON());
    } catch (error) {
      logger.error('Get current user error:', error);
      res.status(500).json({
        error: 'Failed to get current user',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * PUT /api/v2/auth/update-profile
   */
  updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const accountId = (req as any).user?.accountId;

      if (!accountId) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const updates = req.body;
      const updatedAccount = await this.authService.updateAccount(accountId, updates);

      res.status(200).json({
        message: 'Profile updated successfully',
        account: updatedAccount.toJSON()
      });
    } catch (error) {
      logger.error('Update profile error:', error);
      res.status(500).json({
        error: 'Failed to update profile',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * POST /api/v2/auth/forgot-password
   */
  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({ error: 'Email is required' });
        return;
      }

      const result = await this.authService.requestPasswordReset(email);

      res.status(200).json({
        message: result.message
      });
    } catch (error) {
      logger.error('Forgot password error:', error);
      res.status(500).json({
        error: 'Failed to process password reset request',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * POST /api/v2/auth/reset-password
   */
  resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token, password } = req.body;

      if (!token || !password) {
        res.status(400).json({ error: 'Token and password are required' });
        return;
      }

      const result = await this.authService.resetPassword(token, password);

      if (!result.success) {
        res.status(400).json({ error: result.message });
        return;
      }

      res.status(200).json({
        message: result.message
      });
    } catch (error) {
      logger.error('Reset password error:', error);
      res.status(500).json({
        error: 'Failed to reset password',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}
