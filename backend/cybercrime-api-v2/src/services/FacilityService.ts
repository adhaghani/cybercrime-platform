/* eslint-disable @typescript-eslint/no-explicit-any */
import { Facility } from '../models/Facility';
import { FacilityRepository } from '../repositories/FacilityRepository';
import { ReportService } from './ReportService';
import { ReportType, ReportStatus, FacilityType, SeverityLevel } from '../types/enums';

export class FacilityService {
  private facilityRepo: FacilityRepository;
  private reportService: ReportService;

  constructor() {
    this.facilityRepo = new FacilityRepository();
    this.reportService = new ReportService();
  }

  async getAllFacilities(filters?: {
    facilityType?: FacilityType;
    urgency?: SeverityLevel;
    maintenanceRequired?: boolean;
    status?: ReportStatus;
    submitterId?: number;
    startDate?: Date;
    endDate?: Date;
  }): Promise<Facility[]> {
    return await this.facilityRepo.findAll(filters);
  }

  async getFacilityById(id: number): Promise<Facility> {
    const facility = await this.facilityRepo.findById(id);
    if (!facility) {
      throw new Error('Facility report not found');
    }
    return facility;
  }

  async getFacilitiesByType(facilityType: FacilityType): Promise<Facility[]> {
    if (!Object.values(FacilityType).includes(facilityType)) {
      throw new Error('Invalid facility type');
    }
    return await this.facilityRepo.findByFacilityType(facilityType);
  }

  async getFacilitiesByUrgency(urgency: SeverityLevel): Promise<Facility[]> {
    if (!Object.values(SeverityLevel).includes(urgency)) {
      throw new Error('Invalid urgency level');
    }
    return await this.facilityRepo.findByUrgency(urgency);
  }

  async getFacilitiesByBuilding(building: string): Promise<Facility[]> {
    return await this.facilityRepo.findByBuilding(building);
  }

  async getFacilitiesRequiringMaintenance(): Promise<Facility[]> {
    return await this.facilityRepo.findRequiringMaintenance();
  }

  async createFacility(facilityData: {
    // Report fields
    TITLE: string;
    DESCRIPTION: string;
    INCIDENT_DATE: Date;
    LOCATION?: string;
    ANONYMOUS: boolean;
    SUBMITTER_ID: number;
    // Facility-specific fields
    FACILITY_TYPE: FacilityType;
    URGENCY: SeverityLevel;
    BUILDING_NAME?: string;
    ROOM_NUMBER?: string;
    EQUIPMENT_ID?: string;
    MAINTENANCE_REQUIRED: boolean;
    ESTIMATED_COST?: number;
    AFFECTED_AREA_SIZE?: number;
  }): Promise<Facility> {
    // Validate facility type
    if (!Object.values(FacilityType).includes(facilityData.FACILITY_TYPE)) {
      throw new Error('Invalid facility type');
    }

    // Validate urgency
    if (!Object.values(SeverityLevel).includes(facilityData.URGENCY)) {
      throw new Error('Invalid urgency level');
    }

    // Validate estimated cost
    if (facilityData.ESTIMATED_COST !== undefined && facilityData.ESTIMATED_COST < 0) {
      throw new Error('Estimated cost cannot be negative');
    }

    // Validate affected area size
    if (facilityData.AFFECTED_AREA_SIZE !== undefined && facilityData.AFFECTED_AREA_SIZE < 0) {
      throw new Error('Affected area size cannot be negative');
    }

    // Validate building/room for facility types that require them
    const requiresLocation = [
      FacilityType.ELECTRICAL,
      FacilityType.PLUMBING,
      FacilityType.HVAC,
      FacilityType.STRUCTURAL
    ];

    if (requiresLocation.includes(facilityData.FACILITY_TYPE) && !facilityData.BUILDING_NAME) {
      throw new Error('Building name is required for this facility type');
    }

    // Create the base report first
    const report = await this.reportService.createReport({
      REPORT_TYPE: ReportType.FACILITY,
      TITLE: facilityData.TITLE,
      DESCRIPTION: facilityData.DESCRIPTION,
      INCIDENT_DATE: facilityData.INCIDENT_DATE,
      LOCATION: facilityData.LOCATION || `${facilityData.BUILDING_NAME} ${facilityData.ROOM_NUMBER || ''}`.trim(),
      ANONYMOUS: facilityData.ANONYMOUS,
      SUBMITTER_ID: facilityData.SUBMITTER_ID
    });

    // Now create the facility-specific record
    const facility = new Facility({
      FACILITY_TYPE: facilityData.FACILITY_TYPE,
      ASSET_TAG: facilityData.EQUIPMENT_ID,
      ESTIMATED_COST: facilityData.ESTIMATED_COST,
      URGENCY_LEVEL: facilityData.URGENCY,
      MAINTENANCE_REQUIRED: facilityData.MAINTENANCE_REQUIRED ? '1' : '0',
      // Include report data
      SUBMITTED_BY: report.getSubmittedBy()!,
      TITLE: report.getTitle(),
      DESCRIPTION: report.getDescription(),
      LOCATION: report.getLocation(),
      STATUS: report.getStatus(),
      TYPE: report.getType()
    });

    return await this.facilityRepo.create(facility);
  }

  async updateFacility(id: number, updates: {
    // Report fields
    TITLE?: string;
    DESCRIPTION?: string;
    INCIDENT_DATE?: Date;
    LOCATION?: string;
    ANONYMOUS?: boolean;
    // Facility-specific fields
    FACILITY_TYPE?: FacilityType;
    URGENCY?: SeverityLevel;
    BUILDING_NAME?: string;
    ROOM_NUMBER?: string;
    EQUIPMENT_ID?: string;
    MAINTENANCE_REQUIRED?: boolean;
    ESTIMATED_COST?: number;
    AFFECTED_AREA_SIZE?: number;
  }): Promise<Facility> {
    const facility = await this.getFacilityById(id);

    // Only allow updates if report is in PENDING status
    if (facility.getStatus() !== ReportStatus.PENDING) {
      throw new Error('Can only update facility reports in PENDING status');
    }

    // Validate facility type if provided
    if (updates.FACILITY_TYPE && !Object.values(FacilityType).includes(updates.FACILITY_TYPE)) {
      throw new Error('Invalid facility type');
    }

    // Validate urgency if provided
    if (updates.URGENCY && !Object.values(SeverityLevel).includes(updates.URGENCY)) {
      throw new Error('Invalid urgency level');
    }

    // Validate estimated cost if provided
    if (updates.ESTIMATED_COST !== undefined && updates.ESTIMATED_COST < 0) {
      throw new Error('Estimated cost cannot be negative');
    }

    // Validate affected area size if provided
    if (updates.AFFECTED_AREA_SIZE !== undefined && updates.AFFECTED_AREA_SIZE < 0) {
      throw new Error('Affected area size cannot be negative');
    }

    return await this.facilityRepo.update(id, updates);
  }

  async deleteFacility(id: number): Promise<boolean> {
    const facility = await this.getFacilityById(id);

    // Only allow deletion of facilities in PENDING or REJECTED status
    if (![ReportStatus.PENDING, ReportStatus.REJECTED].includes(facility.getStatus())) {
      throw new Error('Can only delete facility reports in PENDING or REJECTED status');
    }

    return await this.facilityRepo.delete(id);
  }

  async getFacilityStatisticsByType(): Promise<any> {
    return await this.facilityRepo.getStatisticsByType();
  }

  async getFacilityStatisticsByUrgency(): Promise<any> {
    return await this.facilityRepo.getStatisticsByUrgency();
  }

  async getTotalEstimatedCost(filters?: {
    facilityType?: FacilityType;
    urgency?: SeverityLevel;
  }): Promise<number> {
    return await this.facilityRepo.getTotalEstimatedCost(filters);
  }

  async getUrgentFacilities(): Promise<Facility[]> {
    const urgentFacilities = await this.facilityRepo.findByUrgency(SeverityLevel.HIGH);
    const criticalFacilities = await this.facilityRepo.findByUrgency(SeverityLevel.CRITICAL);
    return [...criticalFacilities, ...urgentFacilities];
  }

  async getActiveFacilities(): Promise<Facility[]> {
    const activeStatuses = [
      ReportStatus.PENDING,
      ReportStatus.UNDER_REVIEW,
      ReportStatus.IN_PROGRESS
    ];

    const allFacilities: Facility[] = [];

    for (const status of activeStatuses) {
      const facilities = await this.facilityRepo.findAll({ status });
      allFacilities.push(...facilities);
    }

    return allFacilities;
  }

  async getMaintenanceBacklog(): Promise<Facility[]> {
    const maintenanceRequired = await this.facilityRepo.findRequiringMaintenance();
    return maintenanceRequired.filter(f => f.getStatus() === ReportStatus.PENDING);
  }

  async getCostSummary(): Promise<{
    total: number;
    byType: Record<string, number>;
    byUrgency: Record<string, number>;
  }> {
    const total = await this.getTotalEstimatedCost();
    
    const byType: Record<string, number> = {};
    for (const type of Object.values(FacilityType)) {
      byType[type] = await this.getTotalEstimatedCost({ facilityType: type });
    }

    const byUrgency: Record<string, number> = {};
    for (const urgency of Object.values(SeverityLevel)) {
      byUrgency[urgency] = await this.getTotalEstimatedCost({ urgency });
    }

    return { total, byType, byUrgency };
  }
}
