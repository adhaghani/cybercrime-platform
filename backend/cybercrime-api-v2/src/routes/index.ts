import { Router } from 'express';
import authRoutes from './auth.routes';
import accountRoutes from './account.routes';
import emergencyRoutes from './emergency.routes';
import studentRoutes from './student.routes';
import staffRoutes from './staff.routes';
import announcementRoutes from './announcement.routes';
import reportRoutes from './report.routes';
import reportAssignmentRoutes from './report-assignment.routes';
import resolutionRoutes from './resolution.routes';
import generatedReportRoutes from './generated-report.routes';
import crimeRoutes from './crime.routes';
import facilityRoutes from './facility.routes';
import teamRoutes from './team.routes';
import policeRoutes from './police.routes';
import uploadRoutes from './upload.routes';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/accounts', accountRoutes);
router.use('/emergency', emergencyRoutes);
router.use('/students', studentRoutes);
router.use('/staff', staffRoutes);
router.use('/announcements', announcementRoutes);
router.use('/reports', reportRoutes);
router.use('/report-assignments', reportAssignmentRoutes);
router.use('/resolutions', resolutionRoutes);
router.use('/generated-reports', generatedReportRoutes);
router.use('/crimes', crimeRoutes);
router.use('/facilities', facilityRoutes);
router.use('/teams', teamRoutes);
router.use('/police', policeRoutes);
router.use('/upload', uploadRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Cybercrime API v2 is running',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

export default router;
