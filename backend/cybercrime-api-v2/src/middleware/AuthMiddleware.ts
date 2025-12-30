/* eslint-disable @typescript-eslint/no-explicit-any */import { Request, Response, NextFunction } from 'express';
import { JwtManager } from '../utils/JwtManager';

export class AuthMiddleware {
  private jwtManager: JwtManager;

  constructor(jwtManager: JwtManager = new JwtManager()) {
    this.jwtManager = jwtManager;
  }

  /**
   * Authenticate JWT token
   */
  authenticate = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'No token provided' });
        return;
      }

      const token = authHeader.substring(7);
      const payload = this.jwtManager.verifyToken(token);

      if (!payload) {
        res.status(401).json({ error: 'Invalid or expired token' });
        return;
      }

      // Attach user info to request
      (req as any).user = payload;
      next();
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(401).json({ error: 'Authentication failed' });
    }
  };

  /**
   * Authorize based on roles
   */
  authorize = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      const user = (req as any).user;

      if (!user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const userRole = user.role || user.accountType;

      if (!allowedRoles.includes(userRole)) {
        res.status(403).json({ error: 'Insufficient permissions' });
        return;
      }

      next();
    };
  };
}
