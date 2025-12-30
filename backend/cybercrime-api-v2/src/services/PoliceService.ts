import { Police, PoliceData } from '../models/Police';
import { PoliceRepository } from '../repositories/PoliceRepository';
import { Logger } from '../utils/Logger';

const logger = new Logger('PoliceService');

export class PoliceService {
  private policeRepo: PoliceRepository;

  constructor(policeRepo: PoliceRepository = new PoliceRepository()) {
    this.policeRepo = policeRepo;
  }

  /**
   * Get all police stations
   */
  async getAllPoliceStations(state?: string): Promise<Police[]> {
    try {
      const filters = state ? { state } : undefined;
      return await this.policeRepo.findAll(filters);
    } catch (error) {
      logger.error('Get all police stations error:', error);
      throw error;
    }
  }

  /**
   * Get police station by ID
   */
  async getPoliceStationById(id: number): Promise<Police | null> {
    try {
      return await this.policeRepo.findById(id);
    } catch (error) {
      logger.error('Get police station by ID error:', error);
      throw error;
    }
  }

  /**
   * Create new police station
   */
  async createPoliceStation(data: PoliceData): Promise<Police> {
    try {
      const police = new Police({
        ...data,
        OPERATING_HOURS: data.OPERATING_HOURS || '24 Hours'
      });
      return await this.policeRepo.create(police);
    } catch (error) {
      logger.error('Create police station error:', error);
      throw error;
    }
  }

  /**
   * Update police station
   */
  async updatePoliceStation(id: number, updates: Partial<PoliceData>): Promise<Police> {
    try {
      const police = await this.policeRepo.findById(id);
      if (!police) {
        throw new Error('Police station not found');
      }
      return await this.policeRepo.update(id, updates);
    } catch (error) {
      logger.error('Update police station error:', error);
      throw error;
    }
  }

  /**
   * Delete police station
   */
  async deletePoliceStation(id: number): Promise<boolean> {
    try {
      const police = await this.policeRepo.findById(id);
      if (!police) {
        throw new Error('Police station not found');
      }
      return await this.policeRepo.delete(id);
    } catch (error) {
      logger.error('Delete police station error:', error);
      throw error;
    }
  }
}
