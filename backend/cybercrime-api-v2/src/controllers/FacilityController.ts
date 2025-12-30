/* eslint-disable @typescript-eslint/no-explicit-any */import { Request, Response } from 'express';
import { FacilityService } from '../services/FacilityService';
import { FacilityType, SeverityLevel, ReportStatus } from '../types/enums';

export class FacilityController {
  private facilityService: FacilityService;

  constructor() {
    this.facilityService = new FacilityService();
  }

  /**
   * GET /api/v2/facilities
   * Get all facility reports with optional filters
   */
  getAllFacilities = async (req: Request, res: Response): Promise<void> => {
    try {
      const { facilityType, urgency, maintenanceRequired, status, submitterId, startDate, endDate } = req.query;

      const filters: any = {};
      if (facilityType) filters.facilityType = facilityType as FacilityType;
      if (urgency) filters.urgency = urgency as SeverityLevel;
      if (maintenanceRequired) filters.maintenanceRequired = maintenanceRequired === 'true';
      if (status) filters.status = status as ReportStatus;
      if (submitterId) filters.submitterId = Number(submitterId);
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);

      const facilities = await this.facilityService.getAllFacilities(filters);
      res.status(200).json({ success: true, data: facilities });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/facilities/:id
   * Get a specific facility report by ID
   */
  getFacilityById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const facility = await this.facilityService.getFacilityById(Number(id));
      res.status(200).json({ success: true, data: facility });
    } catch (error: any) {
      res.status(404).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/facilities/type/:facilityType
   * Get all facilities of a specific type
   */
  getFacilitiesByType = async (req: Request, res: Response): Promise<void> => {
    try {
      const { facilityType } = req.params;
      const facilities = await this.facilityService.getFacilitiesByType(facilityType as FacilityType);
      res.status(200).json({ success: true, data: facilities });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/facilities/urgency/:urgency
   * Get all facilities with a specific urgency level
   */
  getFacilitiesByUrgency = async (req: Request, res: Response): Promise<void> => {
    try {
      const { urgency } = req.params;
      const facilities = await this.facilityService.getFacilitiesByUrgency(urgency as SeverityLevel);
      res.status(200).json({ success: true, data: facilities });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/facilities/building/:building
   * Get all facilities in a specific building
   */
  getFacilitiesByBuilding = async (req: Request, res: Response): Promise<void> => {
    try {
      const { building } = req.params;
      const facilities = await this.facilityService.getFacilitiesByBuilding(building);
      res.status(200).json({ success: true, data: facilities });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/facilities/maintenance-required
   * Get all facilities requiring maintenance
   */
  getFacilitiesRequiringMaintenance = async (req: Request, res: Response): Promise<void> => {
    try {
      const facilities = await this.facilityService.getFacilitiesRequiringMaintenance();
      res.status(200).json({ success: true, data: facilities });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/facilities/urgent
   * Get all urgent facilities
   */
  getUrgentFacilities = async (req: Request, res: Response): Promise<void> => {
    try {
      const facilities = await this.facilityService.getUrgentFacilities();
      res.status(200).json({ success: true, data: facilities });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/facilities/active
   * Get all active facilities
   */
  getActiveFacilities = async (req: Request, res: Response): Promise<void> => {
    try {
      const facilities = await this.facilityService.getActiveFacilities();
      res.status(200).json({ success: true, data: facilities });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/facilities/maintenance-backlog
   * Get maintenance backlog
   */
  getMaintenanceBacklog = async (req: Request, res: Response): Promise<void> => {
    try {
      const facilities = await this.facilityService.getMaintenanceBacklog();
      res.status(200).json({ success: true, data: facilities });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/facilities/statistics/type
   * Get facility statistics by type
   */
  getFacilityStatisticsByType = async (req: Request, res: Response): Promise<void> => {
    try {
      const statistics = await this.facilityService.getFacilityStatisticsByType();
      res.status(200).json({ success: true, data: statistics });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/facilities/statistics/urgency
   * Get facility statistics by urgency
   */
  getFacilityStatisticsByUrgency = async (req: Request, res: Response): Promise<void> => {
    try {
      const statistics = await this.facilityService.getFacilityStatisticsByUrgency();
      res.status(200).json({ success: true, data: statistics });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/facilities/cost-summary
   * Get cost summary
   */
  getCostSummary = async (req: Request, res: Response): Promise<void> => {
    try {
      const summary = await this.facilityService.getCostSummary();
      res.status(200).json({ success: true, data: summary });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/facilities/total-cost
   * Get total estimated cost
   */
  getTotalEstimatedCost = async (req: Request, res: Response): Promise<void> => {
    try {
      const { facilityType, urgency } = req.query;

      const filters: any = {};
      if (facilityType) filters.facilityType = facilityType as FacilityType;
      if (urgency) filters.urgency = urgency as SeverityLevel;

      const totalCost = await this.facilityService.getTotalEstimatedCost(filters);
      res.status(200).json({ success: true, data: { totalCost } });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * POST /api/v2/facilities
   * Create a new facility report
   */
  createFacility = async (req: Request, res: Response): Promise<void> => {
    try {
      const facilityData = {
        ...req.body,
        SUBMITTER_ID: req.user?.accountId || req.body.SUBMITTER_ID
      };

      const facility = await this.facilityService.createFacility(facilityData);
      res.status(201).json({ success: true, data: facility });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * PUT /api/v2/facilities/:id
   * Update a facility report
   */
  updateFacility = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const facility = await this.facilityService.updateFacility(Number(id), req.body);
      res.status(200).json({ success: true, data: facility });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * DELETE /api/v2/facilities/:id
   * Delete a facility report
   */
  deleteFacility = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.facilityService.deleteFacility(Number(id));
      res.status(200).json({ success: true, message: 'Facility report deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };
}
