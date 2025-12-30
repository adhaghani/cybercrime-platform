import { Request, Response, NextFunction } from 'express';
import { Role } from '../types/enums';
import { Logger } from '../utils/Logger';

const logger = new Logger('AuthorizeMiddleware');

/**
 * Authorize user based on roles
 */
export const authorize = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      logger.error(`No user in request for ${req.method} ${req.path}`);
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const userRole = req.user.role as Role;
    logger.info(`Authorizing user with role: ${userRole}, allowed roles: ${allowedRoles.join(', ')}`);

    if (!allowedRoles.includes(userRole)) {
      logger.error(`User ${req.user.email} with role ${userRole} denied access to ${req.method} ${req.path}`);
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
  };
};
