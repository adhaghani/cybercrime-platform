/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

export class UploadController {
  /**
   * POST /api/v2/upload/report-evidence
   * Upload evidence file for a report
   */
  uploadReportEvidence = async (req: Request, res: Response): Promise<void> => {
    try {
      // Check if file was uploaded
      if (!req.file) {
        res.status(400).json({ success: false, error: 'No file provided' });
        return;
      }

      // Validate file type
      const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
      if (!allowedMimes.includes(req.file.mimetype)) {
        // Delete the uploaded file
        fs.unlinkSync(req.file.path);
        res.status(400).json({ success: false, error: 'Invalid file type. Only images and PDFs are allowed.' });
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (req.file.size > maxSize) {
        fs.unlinkSync(req.file.path);
        res.status(400).json({ success: false, error: 'File size exceeds 5MB limit' });
        return;
      }

      // Store file info in database would go here
      // For now, return the path and file info
      const relativePath = `/uploads/${req.file.filename}`;
      const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000';
      const fullUrl = `${backendUrl}${relativePath}`;

      res.status(200).json({
        success: true,
        path: fullUrl,
        relativePath: relativePath,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  /**
   * POST /api/v2/upload/profile-picture
   * Upload profile picture
   */
  uploadProfilePicture = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, error: 'No file provided' });
        return;
      }

      // Validate image type only
      const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedMimes.includes(req.file.mimetype)) {
        fs.unlinkSync(req.file.path);
        res.status(400).json({ success: false, error: 'Invalid file type. Only images are allowed.' });
        return;
      }

      // Validate file size (max 2MB for profile pictures)
      const maxSize = 2 * 1024 * 1024;
      if (req.file.size > maxSize) {
        fs.unlinkSync(req.file.path);
        res.status(400).json({ success: false, error: 'File size exceeds 2MB limit' });
        return;
      }

      const relativePath = `/uploads/${req.file.filename}`;
      const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000';
      const fullUrl = `${backendUrl}${relativePath}`;

      res.status(200).json({
        success: true,
        path: fullUrl,
        relativePath: relativePath,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  /**
   * POST /api/v2/upload/announcement-photo
   * Upload announcement photo
   */
  uploadAnnouncementPhoto = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, error: 'No file provided' });
        return;
      }

      // Validate image type only
      const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedMimes.includes(req.file.mimetype)) {
        fs.unlinkSync(req.file.path);
        res.status(400).json({ success: false, error: 'Invalid file type. Only images are allowed.' });
        return;
      }

      // Validate file size (max 3MB for announcement photos)
      const maxSize = 3 * 1024 * 1024;
      if (req.file.size > maxSize) {
        fs.unlinkSync(req.file.path);
        res.status(400).json({ success: false, error: 'File size exceeds 3MB limit' });
        return;
      }

      const relativePath = `/uploads/${req.file.filename}`;
      const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000';
      const fullUrl = `${backendUrl}${relativePath}`;

      res.status(200).json({
        success: true,
        path: fullUrl,
        relativePath: relativePath,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
}
