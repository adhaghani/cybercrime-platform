import { Announcement, AnnouncementData } from '../models/Announcement';
import { AnnouncementRepository } from '../repositories/AnnouncementRepository';
import { Logger } from '../utils/Logger';
import { AnnouncementAudience, AnnouncementType, AnnouncementPriority, AnnouncementStatus } from '../types/enums';

const logger = new Logger('AnnouncementService');

export interface CreateAnnouncementDTO {
  created_by: number;
  title: string;
  message: string;
  audience?: AnnouncementAudience;
  type?: AnnouncementType;
  priority?: AnnouncementPriority;
  status?: AnnouncementStatus;
  photo_path?: string;
  start_date?: Date;
  end_date?: Date;
}

export interface UpdateAnnouncementDTO {
  title?: string;
  message?: string;
  audience?: AnnouncementAudience;
  type?: AnnouncementType;
  priority?: AnnouncementPriority;
  status?: AnnouncementStatus;
  photo_path?: string;
  start_date?: Date;
  end_date?: Date;
}

export interface AnnouncementSearchFilters {
  status?: AnnouncementStatus;
  audience?: AnnouncementAudience;
  type?: AnnouncementType;
}

export class AnnouncementService {
  private announcementRepo: AnnouncementRepository;

  constructor(announcementRepo: AnnouncementRepository = new AnnouncementRepository()) {
    this.announcementRepo = announcementRepo;
  }

  /**
   * Get all announcements with optional filters
   */
  async getAll(filters?: AnnouncementSearchFilters): Promise<Announcement[]> {
    try {
      return await this.announcementRepo.findAll(filters);
    } catch (error) {
      logger.error('Error getting all announcements:', error);
      throw error;
    }
  }

  /**
   * Get announcement by ID
   */
  async getById(id: number): Promise<Announcement | null> {
    try {
      return await this.announcementRepo.findById(id);
    } catch (error) {
      logger.error(`Error getting announcement by ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get active (published and within date range) announcements
   */
  async getActive(): Promise<Announcement[]> {
    try {
      return await this.announcementRepo.findActive();
    } catch (error) {
      logger.error('Error getting active announcements:', error);
      throw error;
    }
  }

  /**
   * Get announcements by audience
   */
  async getByAudience(audience: AnnouncementAudience): Promise<Announcement[]> {
    try {
      if (!Object.values(AnnouncementAudience).includes(audience)) {
        throw new Error('Invalid audience');
      }
      return await this.announcementRepo.findAll({ audience });
    } catch (error) {
      logger.error(`Error getting announcements for audience ${audience}:`, error);
      throw error;
    }
  }

  /**
   * Get announcements by type
   */
  async getByType(type: AnnouncementType): Promise<Announcement[]> {
    try {
      if (!Object.values(AnnouncementType).includes(type)) {
        throw new Error('Invalid announcement type');
      }
      return await this.announcementRepo.findAll({ type });
    } catch (error) {
      logger.error(`Error getting announcements by type ${type}:`, error);
      throw error;
    }
  }

  /**
   * Create new announcement
   */
  async create(data: CreateAnnouncementDTO): Promise<Announcement> {
    try {
      // Validate required fields
      if (!data.created_by || !data.title || !data.message) {
        throw new Error('Created by, title, and message are required');
      }

      // Set defaults
      const audience = data.audience || AnnouncementAudience.ALL;
      const type = data.type || AnnouncementType.GENERAL;
      const priority = data.priority || AnnouncementPriority.MEDIUM;
      const status = data.status || AnnouncementStatus.DRAFT;
      
      // Default to 30 days if end_date not provided
      const start_date = data.start_date || new Date();
      const end_date = data.end_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      // Validate date range
      if (end_date < start_date) {
        throw new Error('End date must be after start date');
      }

      const announcementData: AnnouncementData = {
        CREATED_BY: data.created_by,
        TITLE: data.title,
        MESSAGE: data.message,
        AUDIENCE: audience,
        TYPE: type,
        PRIORITY: priority,
        STATUS: status,
        PHOTO_PATH: data.photo_path,
        START_DATE: start_date,
        END_DATE: end_date,
        CREATED_AT: new Date(),
        UPDATED_AT: new Date()
      };

      const announcement = new Announcement(announcementData);
      const created = await this.announcementRepo.create(announcement);

      logger.info(`Announcement created: ${created.getId()}`);
      return created;
    } catch (error) {
      logger.error('Error creating announcement:', error);
      throw error;
    }
  }

  /**
   * Update announcement
   */
  async update(id: number, updates: UpdateAnnouncementDTO): Promise<Announcement> {
    try {
      // Check if announcement exists
      const existing = await this.announcementRepo.findById(id);
      if (!existing) {
        throw new Error('Announcement not found');
      }

      // Validate date range if both dates are being updated or one is provided
      if (updates.start_date || updates.end_date) {
        const startDate = updates.start_date || existing.getStartDate();
        const endDate = updates.end_date || existing.getEndDate();
        
        if (endDate < startDate) {
          throw new Error('End date must be after start date');
        }
      }

      // Validate enums if provided
      if (updates.audience && !Object.values(AnnouncementAudience).includes(updates.audience)) {
        throw new Error('Invalid audience');
      }

      if (updates.type && !Object.values(AnnouncementType).includes(updates.type)) {
        throw new Error('Invalid announcement type');
      }

      if (updates.priority && !Object.values(AnnouncementPriority).includes(updates.priority)) {
        throw new Error('Invalid priority');
      }

      if (updates.status && !Object.values(AnnouncementStatus).includes(updates.status)) {
        throw new Error('Invalid status');
      }

      const updated = await this.announcementRepo.update(id, updates);
      logger.info(`Announcement updated: ${id}`);
      return updated;
    } catch (error) {
      logger.error('Error updating announcement:', error);
      throw error;
    }
  }

  /**
   * Publish announcement (change status to PUBLISHED)
   */
  async publish(id: number): Promise<Announcement> {
    try {
      const existing = await this.announcementRepo.findById(id);
      if (!existing) {
        throw new Error('Announcement not found');
      }

      if (existing.getStatus() === AnnouncementStatus.PUBLISHED) {
        throw new Error('Announcement is already published');
      }

      const updated = await this.announcementRepo.update(id, {
        status: AnnouncementStatus.PUBLISHED
      });

      logger.info(`Announcement published: ${id}`);
      return updated;
    } catch (error) {
      logger.error('Error publishing announcement:', error);
      throw error;
    }
  }

  /**
   * Unpublish/Archive announcement
   */
  async archive(id: number): Promise<Announcement> {
    try {
      const existing = await this.announcementRepo.findById(id);
      if (!existing) {
        throw new Error('Announcement not found');
      }

      const updated = await this.announcementRepo.update(id, {
        status: AnnouncementStatus.ARCHIVE
      });

      logger.info(`Announcement archived: ${id}`);
      return updated;
    } catch (error) {
      logger.error('Error archiving announcement:', error);
      throw error;
    }
  }

  /**
   * Delete announcement
   */
  async delete(id: number): Promise<boolean> {
    try {
      const existing = await this.announcementRepo.findById(id);
      if (!existing) {
        throw new Error('Announcement not found');
      }

      const deleted = await this.announcementRepo.delete(id);
      if (deleted) {
        logger.info(`Announcement deleted: ${id}`);
      }
      return deleted;
    } catch (error) {
      logger.error('Error deleting announcement:', error);
      throw error;
    }
  }

  /**
   * Get announcements created by a specific user
   */
  async getByCreator(creatorId: number): Promise<Announcement[]> {
    try {
      const allAnnouncements = await this.announcementRepo.findAll();
      return allAnnouncements.filter(ann => ann.getCreatedBy() === creatorId);
    } catch (error) {
      logger.error(`Error getting announcements by creator ${creatorId}:`, error);
      throw error;
    }
  }

  /**
   * Get statistics about announcements
   */
  async getStatistics(): Promise<{
    total: number;
    active: number;
    byStatus: Record<AnnouncementStatus, number>;
    byType: Record<AnnouncementType, number>;
    byPriority: Record<AnnouncementPriority, number>;
  }> {
    try {
      const allAnnouncements = await this.announcementRepo.findAll();
      const activeAnnouncements = await this.announcementRepo.findActive();

      const stats = {
        total: allAnnouncements.length,
        active: activeAnnouncements.length,
        byStatus: {} as Record<AnnouncementStatus, number>,
        byType: {} as Record<AnnouncementType, number>,
        byPriority: {} as Record<AnnouncementPriority, number>
      };

      // Initialize counts
      Object.values(AnnouncementStatus).forEach(status => {
        stats.byStatus[status] = 0;
      });
      Object.values(AnnouncementType).forEach(type => {
        stats.byType[type] = 0;
      });
      Object.values(AnnouncementPriority).forEach(priority => {
        stats.byPriority[priority] = 0;
      });

      allAnnouncements.forEach(announcement => {
        const status = announcement.getStatus();
        const type = announcement.getType();
        const priority = announcement.getPriority();

        stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
        stats.byType[type] = (stats.byType[type] || 0) + 1;
        stats.byPriority[priority] = (stats.byPriority[priority] || 0) + 1;
      });

      return stats;
    } catch (error) {
      logger.error('Error getting announcement statistics:', error);
      throw error;
    }
  }
}
