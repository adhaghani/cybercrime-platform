import { Request, Response } from 'express';
import { PoliceService } from '../services/PoliceService';
import { Logger } from '../utils/Logger';

const logger = new Logger('PoliceController');

export class PoliceController {
  private policeService: PoliceService;

  constructor(policeService: PoliceService = new PoliceService()) {
    this.policeService = policeService;
  }

  /**
   * GET /api/v2/police
   * Get all police stations (optionally filter by state)
   */
  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const { state } = req.query;
      const policeStations = await this.policeService.getAllPoliceStations(state as string);
      res.json(policeStations.map(p => p.toJSON()));
    } catch (error) {
      logger.error('Get all police stations error:', error);
      res.status(500).json({
        error: 'Failed to get police stations',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * GET /api/v2/police/:id
   * Get police station by ID
   */
  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const policeStation = await this.policeService.getPoliceStationById(id);

      if (!policeStation) {
        res.status(404).json({ error: 'Police station not found' });
        return;
      }

      res.json(policeStation.toJSON());
    } catch (error) {
      logger.error('Get police station by ID error:', error);
      res.status(500).json({
        error: 'Failed to get police station',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * POST /api/v2/police
   * Create new police station (requires authentication)
   */
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { campus, state, address, phone, hotline, email, operating_hours } = req.body;

      logger.info(`Creating police station with data: ${JSON.stringify({ campus, state, address, phone, hotline, email, operating_hours })}`);

      // Validate required fields
      if (!campus || !state || !address || !phone || !hotline) {
        logger.warn(`Missing required fields: campus=${campus}, state=${state}, address=${address}, phone=${phone}, hotline=${hotline}`);
        res.status(400).json({
          error: 'Campus, state, address, phone, and hotline are required'
        });
        return;
      }

      const policeStation = await this.policeService.createPoliceStation({
        CAMPUS: campus,
        STATE: state,
        ADDRESS: address,
        PHONE: phone,
        HOTLINE: hotline,
        EMAIL: email,
        OPERATING_HOURS: operating_hours
      });

      logger.info(`Police station created successfully: ${policeStation.getId()}`);

      res.status(201).json({
        message: 'Police station created successfully',
        data: policeStation.toJSON()
      });
    } catch (error) {
      logger.error('Create police station error:', error);
      res.status(500).json({
        error: 'Failed to create police station',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * PUT /api/v2/police/:id
   * Update police station (requires authentication)
   */
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const { campus, state, address, phone, hotline, email, operating_hours } = req.body;

      logger.info(`Updating police station ${id} with data: ${JSON.stringify({ campus, state, address, phone, hotline, email, operating_hours })}`);

      // Transform lowercase keys to uppercase keys expected by the repository
      const updates: Record<string, any> = {};
      if (campus !== undefined) updates.CAMPUS = campus;
      if (state !== undefined) updates.STATE = state;
      if (address !== undefined) updates.ADDRESS = address;
      if (phone !== undefined) updates.PHONE = phone;
      if (hotline !== undefined) updates.HOTLINE = hotline;
      if (email !== undefined) updates.EMAIL = email;
      if (operating_hours !== undefined) updates.OPERATING_HOURS = operating_hours;

      const policeStation = await this.policeService.updatePoliceStation(id, updates);

      logger.info(`Police station ${id} updated successfully`);

      res.json({
        message: 'Police station updated successfully',
        data: policeStation.toJSON()
      });
    } catch (error) {
      logger.error('Update police station error:', error);
      
      if (error instanceof Error && error.message === 'Police station not found') {
        res.status(404).json({ error: error.message });
        return;
      }

      res.status(500).json({
        error: 'Failed to update police station',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * DELETE /api/v2/police/:id
   * Delete police station (requires authentication)
   */
  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await this.policeService.deletePoliceStation(id);

      if (!deleted) {
        res.status(404).json({ error: 'Police station not found' });
        return;
      }

      res.json({ message: 'Police station deleted successfully' });
    } catch (error) {
      logger.error('Delete police station error:', error);
      
      if (error instanceof Error && error.message === 'Police station not found') {
        res.status(404).json({ error: error.message });
        return;
      }

      res.status(500).json({
        error: 'Failed to delete police station',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}
