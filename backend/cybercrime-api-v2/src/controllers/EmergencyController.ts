/* eslint-disable @typescript-eslint/no-explicit-any */import { Request, Response } from 'express';
import { EmergencyService, CreateEmergencyContactDTO } from '../services/EmergencyService';
import { Logger } from '../utils/Logger';

const logger = new Logger('EmergencyController');

export class EmergencyController {
  private emergencyService: EmergencyService;

  constructor(emergencyService: EmergencyService = new EmergencyService()) {
    this.emergencyService = emergencyService;
  }

  /**
   * GET /api/v2/emergency
   */
  getAllContacts = async (req: Request, res: Response): Promise<void> => {
    try {
      const { state, type } = req.query;

      const filters: any = {};
      if (state) filters.state = state as string;
      if (type) filters.type = type as string;

      const contacts = await this.emergencyService.getAllContacts(filters);

      res.status(200).json(contacts.map(c => c.toJSON()));
    } catch (error) {
      logger.error('Get all contacts error:', error);
      res.status(500).json({
        error: 'Failed to get emergency contacts',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * GET /api/v2/emergency/:id
   */
  getContactById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid contact ID' });
        return;
      }

      const contact = await this.emergencyService.getContactById(id);

      if (!contact) {
        res.status(404).json({ error: 'Emergency contact not found' });
        return;
      }

      res.status(200).json(contact.toJSON());
    } catch (error) {
      logger.error('Get contact by ID error:', error);
      res.status(500).json({
        error: 'Failed to get emergency contact',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * GET /api/v2/emergency/state/:state
   */
  getContactsByState = async (req: Request, res: Response): Promise<void> => {
    try {
      const state = req.params.state;
      const contacts = await this.emergencyService.getContactsByState(state);

      res.status(200).json(contacts.map(c => c.toJSON()));
    } catch (error) {
      logger.error('Get contacts by state error:', error);
      res.status(500).json({
        error: 'Failed to get emergency contacts by state',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * GET /api/v2/emergency/type/:type
   */
  getContactsByType = async (req: Request, res: Response): Promise<void> => {
    try {
      const type = req.params.type;
      const contacts = await this.emergencyService.getContactsByType(type);

      res.status(200).json(contacts.map(c => c.toJSON()));
    } catch (error) {
      logger.error('Get contacts by type error:', error);
      res.status(500).json({
        error: 'Failed to get emergency contacts by type',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * POST /api/v2/emergency
   */
  createContact = async (req: Request, res: Response): Promise<void> => {
    try {
      const contactData: CreateEmergencyContactDTO = req.body;

      // Validate required fields
      if (!contactData.name || !contactData.address || !contactData.phone || !contactData.state || !contactData.type) {
        res.status(400).json({
          error: 'Name, address, phone, state, and type are required'
        });
        return;
      }

      const contact = await this.emergencyService.createContact(contactData);

      res.status(201).json({
        message: 'Emergency contact created successfully',
        contact: contact.toJSON()
      });
    } catch (error) {
      logger.error('Create contact error:', error);
      res.status(500).json({
        error: 'Failed to create emergency contact',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * PUT /api/v2/emergency/:id
   */
  updateContact = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid contact ID' });
        return;
      }

      const updates = req.body;
      const contact = await this.emergencyService.updateContact(id, updates);

      res.status(200).json({
        message: 'Emergency contact updated successfully',
        contact: contact.toJSON()
      });
    } catch (error) {
      logger.error('Update contact error:', error);
      
      if (error instanceof Error && error.message === 'Emergency contact not found') {
        res.status(404).json({ error: error.message });
        return;
      }

      res.status(500).json({
        error: 'Failed to update emergency contact',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * DELETE /api/v2/emergency/:id
   */
  deleteContact = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid contact ID' });
        return;
      }

      const deleted = await this.emergencyService.deleteContact(id);

      if (!deleted) {
        res.status(404).json({ error: 'Emergency contact not found' });
        return;
      }

      res.status(200).json({
        message: 'Emergency contact deleted successfully'
      });
    } catch (error) {
      logger.error('Delete contact error:', error);
      
      if (error instanceof Error && error.message === 'Emergency contact not found') {
        res.status(404).json({ error: error.message });
        return;
      }

      res.status(500).json({
        error: 'Failed to delete emergency contact',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * GET /api/v2/emergency/grouped/state
   */
  getContactsGroupedByState = async (req: Request, res: Response): Promise<void> => {
    try {
      const grouped = await this.emergencyService.getContactsGroupedByState();

      // Convert to JSON
      const result: Record<string, any[]> = {};
      for (const [state, contacts] of Object.entries(grouped)) {
        result[state] = contacts.map(c => c.toJSON());
      }

      res.status(200).json(result);
    } catch (error) {
      logger.error('Get grouped by state error:', error);
      res.status(500).json({
        error: 'Failed to get grouped emergency contacts',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * GET /api/v2/emergency/grouped/type
   */
  getContactsGroupedByType = async (req: Request, res: Response): Promise<void> => {
    try {
      const grouped = await this.emergencyService.getContactsGroupedByType();

      // Convert to JSON
      const result: Record<string, any[]> = {};
      for (const [type, contacts] of Object.entries(grouped)) {
        result[type] = contacts.map(c => c.toJSON());
      }

      res.status(200).json(result);
    } catch (error) {
      logger.error('Get grouped by type error:', error);
      res.status(500).json({
        error: 'Failed to get grouped emergency contacts',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}
