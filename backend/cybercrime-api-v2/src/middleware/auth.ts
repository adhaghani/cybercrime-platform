import { Request, Response, NextFunction } from 'express';
import { JwtManager } from '../utils/JwtManager';

const jwtManager = new JwtManager();

/**
 * Authenticate JWT token
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const token = authHeader.substring(7);
    const payload = jwtManager.verifyToken(token);

    if (!payload) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }

    // Attach user to request
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};
