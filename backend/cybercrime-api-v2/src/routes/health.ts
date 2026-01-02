import express from 'express';
import { DatabaseConnection } from '../utils/DatabaseConnection';

const router = express.Router();

/**
 * GET /api/v2/health
 * Check system and database health status
 */
router.get('/', async (req, res) => {
  try {
    const db = DatabaseConnection.getInstance();
    const connection = await db.getConnection();
    
    // Test database connectivity with a simple query
    await connection.execute('SELECT 1 FROM DUAL');
    await connection.close();
    
    res.json({
      success: true,
      status: 'online',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({
      success: false,
      status: 'offline',
      database: 'disconnected',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed'
    });
  }
});

export default router;
