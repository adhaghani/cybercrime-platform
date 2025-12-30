import { Request, Response, NextFunction } from 'express';
import { JwtManager } from '../utils/JwtManager';
import { Logger } from '../utils/Logger';

const jwtManager = new JwtManager();
const logger = new Logger('AuthMiddleware');

/**
 * Authenticate JWT token
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.error(`No token provided for ${req.method} ${req.path}`);
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const token = authHeader.substring(7);
    const payload = jwtManager.verifyToken(token);

    if (!payload) {
      logger.error(`Invalid or expired token for ${req.method} ${req.path}`);
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }

    // Attach user to request
    req.user = payload;
    logger.info(`User authenticated: ${payload.email} (${payload.role})`);
    next();
  } catch (error) {
    logger.error('Authentication failed:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};
