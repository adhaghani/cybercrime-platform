import { Request, Response } from 'express';
import { AnnouncementService, CreateAnnouncementDTO, UpdateAnnouncementDTO, AnnouncementSearchFilters } from '../services/AnnouncementService';
import { AnnouncementAudience, AnnouncementType, AnnouncementStatus } from '../types/enums';
import { Logger } from '../utils/Logger';

const logger = new Logger('AnnouncementController');

export class AnnouncementController {
  private announcementService: AnnouncementService;

  constructor(announcementService: AnnouncementService = new AnnouncementService()) {
    this.announcementService = announcementService;
  }

  /**
   * GET /api/v2/announcements
   * Get all announcements with optional filters
   */
  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const filters: AnnouncementSearchFilters = {
        status: req.query.status as AnnouncementStatus | undefined,
        audience: req.query.audience as AnnouncementAudience | undefined,
        type: req.query.type as AnnouncementType | undefined
      };

      const announcements = await this.announcementService.getAll(filters);
      res.status(200).json(announcements.map(a => a.toJSON()));
    } catch (error) {
      logger.error('Get all announcements error:', error);
      res.status(500).json({
        error: 'Failed to get announcements',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * GET /api/v2/announcements/active
   * Get active (published and within date range) announcements
   */
  getActive = async (req: Request, res: Response): Promise<void> => {
    try {
      const announcements = await this.announcementService.getActive();
      res.status(200).json(announcements.map(a => a.toJSON()));
    } catch (error) {
      logger.error('Get active announcements error:', error);
      res.status(500).json({
        error: 'Failed to get active announcements',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * GET /api/v2/announcements/:id
   * Get announcement by ID
   */
  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid announcement ID' });
        return;
      }

      const announcement = await this.announcementService.getById(id);
      if (!announcement) {
        res.status(404).json({ error: 'Announcement not found' });
        return;
      }

      res.status(200).json(announcement.toJSON());
    } catch (error) {
      logger.error('Get announcement by ID error:', error);
      res.status(500).json({
        error: 'Failed to get announcement',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * GET /api/v2/announcements/by-audience/:audience
   * Get announcements by audience
   */
  getByAudience = async (req: Request, res: Response): Promise<void> => {
    try {
      const audience = req.params.audience as AnnouncementAudience;
      if (!audience || !Object.values(AnnouncementAudience).includes(audience)) {
        res.status(400).json({ error: 'Invalid audience' });
        return;
      }

      const announcements = await this.announcementService.getByAudience(audience);
      res.status(200).json(announcements.map(a => a.toJSON()));
    } catch (error) {
      logger.error('Get announcements by audience error:', error);
      res.status(500).json({
        error: 'Failed to get announcements by audience',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * GET /api/v2/announcements/by-type/:type
   * Get announcements by type
   */
  getByType = async (req: Request, res: Response): Promise<void> => {
    try {
      const type = req.params.type as AnnouncementType;
      if (!type || !Object.values(AnnouncementType).includes(type)) {
        res.status(400).json({ error: 'Invalid announcement type' });
        return;
      }

      const announcements = await this.announcementService.getByType(type);
      res.status(200).json(announcements.map(a => a.toJSON()));
    } catch (error) {
      logger.error('Get announcements by type error:', error);
      res.status(500).json({
        error: 'Failed to get announcements by type',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * GET /api/v2/announcements/creator/:creatorId
   * Get announcements by creator
   */
  getByCreator = async (req: Request, res: Response): Promise<void> => {
    try {
      const creatorId = parseInt(req.params.creatorId);
      if (isNaN(creatorId)) {
        res.status(400).json({ error: 'Invalid creator ID' });
        return;
      }

      const announcements = await this.announcementService.getByCreator(creatorId);
      res.status(200).json(announcements.map(a => a.toJSON()));
    } catch (error) {
      logger.error('Get announcements by creator error:', error);
      res.status(500).json({
        error: 'Failed to get announcements by creator',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * POST /api/v2/announcements
   * Create new announcement
   */
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const data: CreateAnnouncementDTO = {
        ...req.body,
        created_by: req.user!.accountId // From auth middleware
      };

      // Validate required fields
      if (!data.title) {
        res.status(400).json({ error: 'Title is required' });
        return;
      }

      if (!data.message) {
        res.status(400).json({ error: 'Message is required' });
        return;
      }

      // Parse dates if provided as strings
      if (req.body.start_date && typeof req.body.start_date === 'string') {
        data.start_date = new Date(req.body.start_date);
      }
      if (req.body.end_date && typeof req.body.end_date === 'string') {
        data.end_date = new Date(req.body.end_date);
      }

      const announcement = await this.announcementService.create(data);
      res.status(201).json({
        message: 'Announcement created successfully',
        announcement: announcement.toJSON()
      });
    } catch (error) {
      logger.error('Create announcement error:', error);

      if (error instanceof Error && error.message.includes('required')) {
        res.status(400).json({ error: error.message });
        return;
      }

      if (error instanceof Error && error.message.includes('End date must be after')) {
        res.status(400).json({ error: error.message });
        return;
      }

      res.status(500).json({
        error: 'Failed to create announcement',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * PUT /api/v2/announcements/:id
   * Update announcement
   */
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid announcement ID' });
        return;
      }

      const updates: UpdateAnnouncementDTO = { ...req.body };

      // Parse dates if provided as strings
      if (req.body.start_date && typeof req.body.start_date === 'string') {
        updates.start_date = new Date(req.body.start_date);
      }
      if (req.body.end_date && typeof req.body.end_date === 'string') {
        updates.end_date = new Date(req.body.end_date);
      }

      const announcement = await this.announcementService.update(id, updates);
      res.status(200).json({
        message: 'Announcement updated successfully',
        announcement: announcement.toJSON()
      });
    } catch (error) {
      logger.error('Update announcement error:', error);

      if (error instanceof Error) {
        if (error.message === 'Announcement not found') {
          res.status(404).json({ error: error.message });
          return;
        }
        if (error.message.includes('Invalid') || error.message.includes('End date must be after')) {
          res.status(400).json({ error: error.message });
          return;
        }
      }

      res.status(500).json({
        error: 'Failed to update announcement',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * POST /api/v2/announcements/:id/publish
   * Publish announcement
   */
  publish = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid announcement ID' });
        return;
      }

      const announcement = await this.announcementService.publish(id);
      res.status(200).json({
        message: 'Announcement published successfully',
        announcement: announcement.toJSON()
      });
    } catch (error) {
      logger.error('Publish announcement error:', error);

      if (error instanceof Error) {
        if (error.message === 'Announcement not found') {
          res.status(404).json({ error: error.message });
          return;
        }
        if (error.message === 'Announcement is already published') {
          res.status(400).json({ error: error.message });
          return;
        }
      }

      res.status(500).json({
        error: 'Failed to publish announcement',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * POST /api/v2/announcements/:id/archive
   * Archive announcement
   */
  archive = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid announcement ID' });
        return;
      }

      const announcement = await this.announcementService.archive(id);
      res.status(200).json({
        message: 'Announcement archived successfully',
        announcement: announcement.toJSON()
      });
    } catch (error) {
      logger.error('Archive announcement error:', error);

      if (error instanceof Error && error.message === 'Announcement not found') {
        res.status(404).json({ error: error.message });
        return;
      }

      res.status(500).json({
        error: 'Failed to archive announcement',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * DELETE /api/v2/announcements/:id
   * Delete announcement
   */
  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid announcement ID' });
        return;
      }

      const deleted = await this.announcementService.delete(id);
      if (!deleted) {
        res.status(404).json({ error: 'Announcement not found' });
        return;
      }

      res.status(200).json({ message: 'Announcement deleted successfully' });
    } catch (error) {
      logger.error('Delete announcement error:', error);

      if (error instanceof Error && error.message === 'Announcement not found') {
        res.status(404).json({ error: error.message });
        return;
      }

      res.status(500).json({
        error: 'Failed to delete announcement',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * GET /api/v2/announcements/statistics
   * Get announcement statistics
   */
  getStatistics = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.announcementService.getStatistics();
      res.status(200).json(stats);
    } catch (error) {
      logger.error('Get announcement statistics error:', error);
      res.status(500).json({
        error: 'Failed to get announcement statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}
