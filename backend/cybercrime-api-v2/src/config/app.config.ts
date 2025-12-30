import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  database: {
    user: process.env.DB_USER || 'CC_APP',
    password: process.env.DB_PASSWORD || 'CC_APP',
    connectString: process.env.DB_CONNECT_STRING || 'localhost:1522/FREEPDB1',
    poolMin: parseInt(process.env.DB_POOL_MIN || '2'),
    poolMax: parseInt(process.env.DB_POOL_MAX || '10'),
    poolIncrement: parseInt(process.env.DB_POOL_INCREMENT || '1'),
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  }
};
