import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as path from 'path';
import { config } from './config/app.config';
import { DatabaseConnection } from './utils/DatabaseConnection';
import { ErrorHandler } from './middleware/ErrorHandler';
import { Logger } from './utils/Logger';
import routes from './routes';

const logger = new Logger('App');

export class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    // CORS
    this.app.use(cors({
      origin: config.frontendUrl,
      credentials: true
    }));

    // Body parsing
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Static file serving for uploads
    const uploadsPath = path.join(process.cwd(), 'public/uploads');
    this.app.use('/uploads', express.static(uploadsPath));

    // Request logging
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      logger.info(`${req.method} ${req.path}`);
      next();
    });
  }

  private initializeRoutes(): void {
    // API v2 routes
    this.app.use('/api/v2', routes);

    // Root route
    this.app.get('/', (req: Request, res: Response) => {
      res.json({
        message: 'Cybercrime Platform API v2',
        version: '2.0.0',
        documentation: '/api/v2/health'
      });
    });
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(ErrorHandler.notFound);

    // Global error handler
    this.app.use(ErrorHandler.handle);
  }

  public async initializeDatabase(): Promise<void> {
    try {
      await DatabaseConnection.getInstance().initialize({
        user: config.database.user,
        password: config.database.password,
        connectString: config.database.connectString,
        poolMin: config.database.poolMin,
        poolMax: config.database.poolMax,
        poolIncrement: config.database.poolIncrement
      });
      logger.info('Database initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize database:', error);
      throw error;
    }
  }

  public async close(): Promise<void> {
    await DatabaseConnection.getInstance().close();
    logger.info('Application closed');
  }
}
