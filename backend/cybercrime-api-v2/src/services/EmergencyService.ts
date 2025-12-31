/* eslint-disable @typescript-eslint/no-explicit-any */
import { EmergencyContact, EmergencyContactData } from '../models/EmergencyContact';
import { EmergencyContactRepository } from '../repositories/EmergencyContactRepository';
import { Logger } from '../utils/Logger';

const logger = new Logger('EmergencyService');

export interface CreateEmergencyContactDTO {
  name: string;
  address: string;
  phone: string;
  email?: string;
  state: string;
  type: string;
  hotline?: string;
}

export interface EmergencyContactFilters {
  state?: string;
  type?: string;
}

export class EmergencyService {
  private emergencyRepo: EmergencyContactRepository;

  constructor(emergencyRepo: EmergencyContactRepository = new EmergencyContactRepository()) {
    this.emergencyRepo = emergencyRepo;
  }

  /**
   * Get all emergency contacts with optional filters
   */
  async getAllContacts(filters?: EmergencyContactFilters): Promise<EmergencyContact[]> {
    try {
      if (filters && (filters.state || filters.type)) {
        return this.emergencyRepo.findWithFilters(filters);
      }
      return this.emergencyRepo.findAll();
    } catch (error) {
      logger.error('Error getting emergency contacts:', error);
      throw error;
    }
  }

  /**
   * Get emergency contact by ID
   */
  async getContactById(id: number): Promise<EmergencyContact | null> {
    try {
      return this.emergencyRepo.findById(id);
    } catch (error) {
      logger.error('Error getting emergency contact by ID:', error);
      throw error;
    }
  }

  /**
   * Get emergency contacts by state
   */
  async getContactsByState(state: string): Promise<EmergencyContact[]> {
    try {
      return this.emergencyRepo.findByState(state);
    } catch (error) {
      logger.error('Error getting emergency contacts by state:', error);
      throw error;
    }
  }

  /**
   * Get emergency contacts by type
   */
  async getContactsByType(type: string): Promise<EmergencyContact[]> {
    try {
      return this.emergencyRepo.findByType(type);
    } catch (error) {
      logger.error('Error getting emergency contacts by type:', error);
      throw error;
    }
  }

  /**
   * Create new emergency contact
   */
  async createContact(data: CreateEmergencyContactDTO): Promise<EmergencyContact> {
    try {
      const contactData: EmergencyContactData = {
        NAME: data.name,
        ADDRESS: data.address,
        PHONE: data.phone,
        EMAIL: data.email,
        STATE: data.state as any,
        TYPE: data.type as any,
        HOTLINE: data.hotline
      };

      const contact = new EmergencyContact(contactData);
      const createdContact = await this.emergencyRepo.create(contact);

      logger.info(`Emergency contact created: ${createdContact.getName()} (${createdContact.getType()})`);

      return createdContact;
    } catch (error) {
      logger.error('Error creating emergency contact:', error);
      throw error;
    }
  }

  /**
   * Update emergency contact
   */
  async updateContact(id: number, updates: Partial<EmergencyContactData>): Promise<EmergencyContact> {
    try {
      // Check if contact exists
      const existingContact = await this.emergencyRepo.findById(id);
      if (!existingContact) {
        throw new Error('Emergency contact not found');
      }

      const updatedContact = await this.emergencyRepo.update(id, updates);

      logger.info(`Emergency contact updated: ${updatedContact.getName()}`);

      return updatedContact;
    } catch (error) {
      logger.error('Error updating emergency contact:', error);
      throw error;
    }
  }

  /**
   * Delete emergency contact
   */
  async deleteContact(id: number): Promise<boolean> {
    try {
      // Check if contact exists
      const existingContact = await this.emergencyRepo.findById(id);
      if (!existingContact) {
        throw new Error('Emergency contact not found');
      }

      const deleted = await this.emergencyRepo.delete(id);

      if (deleted) {
        logger.info(`Emergency contact deleted: ${existingContact.getName()}`);
      }

      return deleted;
    } catch (error) {
      logger.error('Error deleting emergency contact:', error);
      throw error;
    }
  }

  /**
   * Get emergency contacts grouped by state
   */
  async getContactsGroupedByState(): Promise<Record<string, EmergencyContact[]>> {
    try {
      const allContacts = await this.emergencyRepo.findAll();
      
      const grouped: Record<string, EmergencyContact[]> = {};
      
      allContacts.forEach(contact => {
        const state = contact.getState();
        if (!grouped[state]) {
          grouped[state] = [];
        }
        grouped[state].push(contact);
      });

      return grouped;
    } catch (error) {
      logger.error('Error getting grouped emergency contacts:', error);
      throw error;
    }
  }

  /**
   * Get emergency contacts grouped by type
   */
  async getContactsGroupedByType(): Promise<Record<string, EmergencyContact[]>> {
    try {
      const allContacts = await this.emergencyRepo.findAll();
      
      const grouped: Record<string, EmergencyContact[]> = {};
      
      allContacts.forEach(contact => {
        const type = contact.getType();
        if (!grouped[type]) {
          grouped[type] = [];
        }
        grouped[type].push(contact);
      });

      return grouped;
    } catch (error) {
      logger.error('Error getting grouped emergency contacts:', error);
      throw error;
    }
  }

  /**
   * Get national emergency contacts (excluding UiTM AP specific contacts)
   */
  async getNationalContacts(): Promise<EmergencyContact[]> {
    try {
      return this.emergencyRepo.findNationalContacts();
    } catch (error) {
      logger.error('Error getting national emergency contacts:', error);
      throw error;
    }
  }
}
