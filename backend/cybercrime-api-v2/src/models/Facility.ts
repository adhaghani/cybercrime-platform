import { Report, ReportData } from './Report';
import { FacilityType, SeverityLevel } from '../types/enums';

export interface FacilityData extends ReportData {
  FACILITY_TYPE: FacilityType;
  ASSET_TAG?: string;
  ESTIMATED_COST?: number;
  URGENCY_LEVEL?: SeverityLevel;
  MAINTENANCE_REQUIRED?: string;
}

export class Facility extends Report {
  constructor(data: FacilityData) {
    super(data);
  }

  protected validate(): void {
    super.validate();
    if (!this.getFacilityType()) {
      throw new Error('Facility type is required');
    }
  }

  // Facility-specific getters
  getFacilityType(): FacilityType {
    return this.get<FacilityType>('FACILITY_TYPE');
  }

  getAssetTag(): string | undefined {
    return this.get<string>('ASSET_TAG');
  }

  getEstimatedCost(): number | undefined {
    return this.get<number>('ESTIMATED_COST');
  }

  getUrgencyLevel(): SeverityLevel | undefined {
    return this.get<SeverityLevel>('URGENCY_LEVEL');
  }

  getMaintenanceRequired(): string | undefined {
    return this.get<string>('MAINTENANCE_REQUIRED');
  }

  // Facility-specific setters
  setFacilityType(type: FacilityType): void {
    this.set('FACILITY_TYPE', type);
  }

  setAssetTag(tag: string): void {
    this.set('ASSET_TAG', tag);
  }

  setEstimatedCost(cost: number): void {
    if (cost < 0) {
      throw new Error('Estimated cost cannot be negative');
    }
    this.set('ESTIMATED_COST', cost);
  }

  setUrgencyLevel(level: SeverityLevel): void {
    this.set('URGENCY_LEVEL', level);
  }

  setMaintenanceRequired(maintenance: string): void {
    this.set('MAINTENANCE_REQUIRED', maintenance);
  }
}
