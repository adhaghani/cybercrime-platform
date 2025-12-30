import { App } from './app';
import { config } from './config/app.config';
import { Logger } from './utils/Logger';

const logger = new Logger('Server');

async function startServer() {
  try {
    // Create app instance
    const appInstance = new App();

    // Initialize database
    await appInstance.initializeDatabase();

    // Start server
    const server = appInstance.app.listen(config.port, () => {
      logger.info(`🚀 Server running on port ${config.port}`);
      logger.info(`📝 Environment: ${config.nodeEnv}`);
      logger.info(`🌐 API v2 available at: http://localhost:${config.port}/api/v2`);
      logger.info(`❤️  Health check: http://localhost:${config.port}/api/v2/health`);
    });

    // Graceful shutdown
    const gracefulShutdown = async () => {
      logger.info('Shutting down gracefully...');
      
      server.close(() => {
        logger.info('HTTP server closed');
      });

      await appInstance.close();
      process.exit(0);
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
