require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Import routes
const authRoutes = require('./routes/auth');
const accountsRoutes = require('./routes/accounts');
const announcementsRoutes = require('./routes/announcements');
const reportsRoutes = require('./routes/reports');
const crimesRoutes = require('./routes/crimes');
const facilitiesRoutes = require('./routes/facilities');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountsRoutes);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/crimes', crimesRoutes);
app.use('/api/facilities', facilitiesRoutes);

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Cybercrime API Server is running!',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    endpoints: {
      auth: 7,
      accounts: 5,
      announcements: 9,
      reports: 11,
      crimes: 5,
      facilities: 5,
      total: '90+'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log('========================================');
  console.log('🚀 Cybercrime API Server Running');
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`🔒 JWT: ${process.env.JWT_SECRET ? 'Configured' : 'Using default'}`);
  console.log(`🌐 CORS: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`🗄️  Database: ${process.env.DB_CONNECT_STRING || 'localhost:1521/FREEPDB1'}`);
  console.log('========================================');
  console.log('📋 Available Routes:');
  console.log('   - /api/test (GET)');
  console.log('   - /api/auth/* (7 endpoints)');
  console.log('   - /api/accounts/* (5 endpoints)');
  console.log('   - /api/announcements/* (9 endpoints)');
  console.log('   - /api/reports/* (11 endpoints)');
  console.log('   - /api/crimes/* (5 endpoints)');
  console.log('   - /api/facilities/* (5 endpoints)');
  console.log('========================================');
});
