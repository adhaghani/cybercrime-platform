/* eslint-disable @typescript-eslint/no-explicit-any */import { Request, Response, NextFunction } from 'express';
import { Logger } from '../utils/Logger';

const logger = new Logger('ErrorHandler');

export class ErrorHandler {
  /**
   * Global error handling middleware
   */
  static handle(err: any, req: Request, res: Response, next: NextFunction): void {
    logger.error('Unhandled error:', err);

    // Default error
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Handle specific error types
    if (err.name === 'ValidationError') {
      statusCode = 400;
      message = err.message;
    } else if (err.name === 'UnauthorizedError') {
      statusCode = 401;
      message = 'Unauthorized';
    } else if (err.name === 'ForbiddenError') {
      statusCode = 403;
      message = 'Forbidden';
    } else if (err.name === 'NotFoundError') {
      statusCode = 404;
      message = 'Resource not found';
    }

    res.status(statusCode).json({
      error: message,
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack,
        details: err
      })
    });
  }

  /**
   * Handle 404 errors
   */
  static notFound(req: Request, res: Response): void {
    res.status(404).json({
      error: 'Route not found',
      path: req.originalUrl
    });
  }
}
