/* eslint-disable @typescript-eslint/no-explicit-any */import { Request, Response } from 'express';
import { CrimeService } from '../services/CrimeService';
import { CrimeCategory, SeverityLevel, ReportStatus } from '../types/enums';

export class CrimeController {
  private crimeService: CrimeService;

  constructor() {
    this.crimeService = new CrimeService();
  }

  /**
   * GET /api/v2/crimes
   * Get all crime reports with optional filters
   */
  getAllCrimes = async (req: Request, res: Response): Promise<void> => {
    try {
      const { category, severity, hasWeapon, hasVictim, status, submitterId, startDate, endDate } = req.query;

      const filters: any = {};
      if (category) filters.category = category as CrimeCategory;
      if (severity) filters.severity = severity as SeverityLevel;
      if (hasWeapon) filters.hasWeapon = hasWeapon === 'true';
      if (hasVictim) filters.hasVictim = hasVictim === 'true';
      if (status) filters.status = status as ReportStatus;
      if (submitterId) filters.submitterId = Number(submitterId);
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);

      const crimes = await this.crimeService.getAllCrimes(filters);
      res.status(200).json({ success: true, data: crimes });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/crimes/:id
   * Get a specific crime report by ID
   */
  getCrimeById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const crime = await this.crimeService.getCrimeById(Number(id));
      res.status(200).json({ success: true, data: crime });
    } catch (error: any) {
      res.status(404).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/crimes/category/:category
   * Get all crimes of a specific category
   */
  getCrimesByCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { category } = req.params;
      const crimes = await this.crimeService.getCrimesByCategory(category as CrimeCategory);
      res.status(200).json({ success: true, data: crimes });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/crimes/severity/:severity
   * Get all crimes with a specific severity level
   */
  getCrimesBySeverity = async (req: Request, res: Response): Promise<void> => {
    try {
      const { severity } = req.params;
      const crimes = await this.crimeService.getCrimesBySeverity(severity as SeverityLevel);
      res.status(200).json({ success: true, data: crimes });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/crimes/with-weapons
   * Get all crimes involving weapons
   */
  getCrimesWithWeapons = async (req: Request, res: Response): Promise<void> => {
    try {
      const crimes = await this.crimeService.getCrimesWithWeapons();
      res.status(200).json({ success: true, data: crimes });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/crimes/with-victims
   * Get all crimes with identified victims
   */
  getCrimesWithVictims = async (req: Request, res: Response): Promise<void> => {
    try {
      const crimes = await this.crimeService.getCrimesWithVictims();
      res.status(200).json({ success: true, data: crimes });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/crimes/high-severity
   * Get all high/critical severity crimes
   */
  getHighSeverityCrimes = async (req: Request, res: Response): Promise<void> => {
    try {
      const crimes = await this.crimeService.getHighSeverityCrimes();
      res.status(200).json({ success: true, data: crimes });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/crimes/active
   * Get all active crimes
   */
  getActiveCrimes = async (req: Request, res: Response): Promise<void> => {
    try {
      const crimes = await this.crimeService.getActiveCrimes();
      res.status(200).json({ success: true, data: crimes });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/crimes/statistics/category
   * Get crime statistics by category
   */
  getCrimeStatisticsByCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const statistics = await this.crimeService.getCrimeStatisticsByCategory();
      res.status(200).json({ success: true, data: statistics });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/crimes/statistics/severity
   * Get crime statistics by severity
   */
  getCrimeStatisticsBySeverity = async (req: Request, res: Response): Promise<void> => {
    try {
      const statistics = await this.crimeService.getCrimeStatisticsBySeverity();
      res.status(200).json({ success: true, data: statistics });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * POST /api/v2/crimes
   * Create a new crime report
   */
  createCrime = async (req: Request, res: Response): Promise<void> => {
    try {
      const crimeData = {
        ...req.body,
        SUBMITTER_ID: req.user?.accountId || req.body.SUBMITTER_ID
      };

      const crime = await this.crimeService.createCrime(crimeData);
      res.status(201).json({ success: true, data: crime });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * PUT /api/v2/crimes/:id
   * Update a crime report
   */
  updateCrime = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const crime = await this.crimeService.updateCrime(Number(id), req.body);
      res.status(200).json({ success: true, data: crime });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * DELETE /api/v2/crimes/:id
   * Delete a crime report
   */
  deleteCrime = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.crimeService.deleteCrime(Number(id));
      res.status(200).json({ success: true, message: 'Crime report deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };
}
