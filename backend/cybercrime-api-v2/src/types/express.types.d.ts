import 'express';
import { JwtPayload } from '../utils/JwtManager';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export {};
