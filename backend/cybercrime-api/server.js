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
const reportAssignmentsRoutes = require('./routes/report-assignments');
const staffRoutes = require('./routes/staff');
const studentsRoutes = require('./routes/students');
const emergencyRoutes = require('./routes/emergency');
const policeRoutes = require('./routes/police');
const generatedReportsRoutes = require('./routes/generated-reports');
const dashboardRoutes = require('./routes/dashboard');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountsRoutes);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/crimes', crimesRoutes);
app.use('/api/facilities', facilitiesRoutes);
app.use('/api/report-assignments', reportAssignmentsRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/police', policeRoutes);
app.use('/api/generated-reports', generatedReportsRoutes);
app.use('/api/dashboard', dashboardRoutes);

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
      reportAssignments: 10,
      staff: 7,
      students: 7,
      emergency: 5,
      police: 5,
      generatedReports: 4,
      dashboard: 4,
      total: '84+'
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
  console.log(`DB_USER: ${process.env.DB_USER || 'PDBADMIN'}`);
  console.log(`DB_PASSWORD: ${process.env.DB_PASSWORD ? 'Configured' : 'Using default'}`);
  console.log(`🔒 JWT: ${process.env.JWT_SECRET ? 'Configured' : 'Using default'}`);
  console.log(`🌐 CORS: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`🗄️  Database: ${process.env.DB_CONNECT_STRING || 'localhost:1521/CYBERCRIME'}`);
  console.log('========================================');
  console.log('📋 Available Routes:');
  console.log('   - /api/test (GET)');
  console.log('   - /api/auth/* (7 endpoints)');
  console.log('   - /api/accounts/* (5 endpoints)');
  console.log('   - /api/announcements/* (9 endpoints)');
  console.log('   - /api/reports/* (11 endpoints)');
  console.log('   - /api/crimes/* (5 endpoints)');
  console.log('   - /api/facilities/* (5 endpoints)');
  console.log('   - /api/report-assignments/* (10 endpoints)');
  console.log('   - /api/staff/* (7 endpoints)');
  console.log('   - /api/students/* (7 endpoints)');
  console.log('   - /api/emergency/* (5 endpoints)');
  console.log('   - /api/police/* (5 endpoints)');
  console.log('   - /api/generated-reports/* (4 endpoints)');
  console.log('   - /api/dashboard/* (4 endpoints)');
  console.log('========================================');
});
