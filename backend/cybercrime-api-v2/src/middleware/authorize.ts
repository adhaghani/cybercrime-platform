import { Request, Response, NextFunction } from 'express';
import { Role } from '../types/enums';

/**
 * Authorize user based on roles
 */
export const authorize = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const userRole = req.user.role as Role;

    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
  };
};
