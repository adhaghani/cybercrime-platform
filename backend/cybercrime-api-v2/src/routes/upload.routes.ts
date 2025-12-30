import { Router } from 'express';
import multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { UploadController } from '../controllers/UploadController';
import { authenticate } from '../middleware/auth';

const router = Router();
const uploadController = new UploadController();

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  }
});

// Protected routes - all require authentication
router.use(authenticate);

/**
 * POST /api/v2/upload/report-evidence
 * Upload evidence file for a report
 */
router.post('/report-evidence', upload.single('file'), uploadController.uploadReportEvidence);

/**
 * POST /api/v2/upload/profile-picture
 * Upload profile picture
 */
router.post('/profile-picture', upload.single('file'), uploadController.uploadProfilePicture);

/**
 * POST /api/v2/upload/announcement-photo
 * Upload announcement photo
 */
router.post('/announcement-photo', upload.single('file'), uploadController.uploadAnnouncementPhoto);

export default router;
