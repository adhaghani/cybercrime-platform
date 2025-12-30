/* eslint-disable @typescript-eslint/no-explicit-any */
import { Crime } from '../models/Crime';
import { CrimeRepository } from '../repositories/CrimeRepository';
import { ReportService } from './ReportService';
import { ReportType, ReportStatus, CrimeCategory, SeverityLevel } from '../types/enums';

export class CrimeService {
  private crimeRepo: CrimeRepository;
  private reportService: ReportService;

  constructor() {
    this.crimeRepo = new CrimeRepository();
    this.reportService = new ReportService();
  }

  async getAllCrimes(filters?: {
    category?: CrimeCategory;
    severity?: SeverityLevel;
    hasWeapon?: boolean;
    hasVictim?: boolean;
    status?: ReportStatus;
    submitterId?: number;
    startDate?: Date;
    endDate?: Date;
  }): Promise<Crime[]> {
    return await this.crimeRepo.findAll(filters);
  }

  async getCrimeById(id: number): Promise<Crime> {
    const crime = await this.crimeRepo.findById(id);
    if (!crime) {
      throw new Error('Crime report not found');
    }
    return crime;
  }

  async getCrimesByCategory(category: CrimeCategory): Promise<Crime[]> {
    if (!Object.values(CrimeCategory).includes(category)) {
      throw new Error('Invalid crime category');
    }
    return await this.crimeRepo.findByCategory(category);
  }

  async getCrimesBySeverity(severity: SeverityLevel): Promise<Crime[]> {
    if (!Object.values(SeverityLevel).includes(severity)) {
      throw new Error('Invalid severity level');
    }
    return await this.crimeRepo.findBySeverity(severity);
  }

  async getCrimesWithWeapons(): Promise<Crime[]> {
    return await this.crimeRepo.findWithWeapons();
  }

  async getCrimesWithVictims(): Promise<Crime[]> {
    return await this.crimeRepo.findWithVictims();
  }

  async createCrime(crimeData: {
    // Report fields
    TITLE: string;
    DESCRIPTION: string;
    INCIDENT_DATE: Date;
    LOCATION?: string;
    ANONYMOUS: boolean;
    SUBMITTER_ID: number;
    // Crime-specific fields
    CRIME_CATEGORY: CrimeCategory;
    SEVERITY_LEVEL: SeverityLevel;
    SUSPECT_DESCRIPTION?: string;
    WITNESS_COUNT?: number;
    EVIDENCE_DESCRIPTION?: string;
    WEAPON_INVOLVED?: boolean;
    WEAPON_DESCRIPTION?: string;
    VICTIM_NAME?: string;
    VICTIM_CONTACT?: string;
    INJURIES_SUSTAINED?: boolean;
    INJURY_DESCRIPTION?: string;
  }): Promise<Crime> {
    // Validate crime category
    if (!Object.values(CrimeCategory).includes(crimeData.CRIME_CATEGORY)) {
      throw new Error('Invalid crime category');
    }

    // Validate severity level
    if (!Object.values(SeverityLevel).includes(crimeData.SEVERITY_LEVEL)) {
      throw new Error('Invalid severity level');
    }

    // Validate witness count
    if (crimeData.WITNESS_COUNT !== undefined && crimeData.WITNESS_COUNT < 0) {
      throw new Error('Witness count cannot be negative');
    }

    // Validate weapon-related fields
    if (crimeData.WEAPON_INVOLVED && !crimeData.WEAPON_DESCRIPTION) {
      throw new Error('Weapon description is required when weapon is involved');
    }

    // Validate victim-related fields
    if (crimeData.VICTIM_NAME && !crimeData.VICTIM_CONTACT) {
      throw new Error('Victim contact is required when victim name is provided');
    }

    // Validate injury-related fields
    if (crimeData.INJURIES_SUSTAINED && !crimeData.INJURY_DESCRIPTION) {
      throw new Error('Injury description is required when injuries are sustained');
    }

    // Create the base report first
    const report = await this.reportService.createReport({
      REPORT_TYPE: ReportType.CRIME,
      TITLE: crimeData.TITLE,
      DESCRIPTION: crimeData.DESCRIPTION,
      INCIDENT_DATE: crimeData.INCIDENT_DATE,
      LOCATION: crimeData.LOCATION,
      ANONYMOUS: crimeData.ANONYMOUS,
      SUBMITTER_ID: crimeData.SUBMITTER_ID
    });

    // Now create the crime-specific record
    const crime = new Crime({
      CRIME_CATEGORY: crimeData.CRIME_CATEGORY,
      SUSPECT_DESCRIPTION: crimeData.SUSPECT_DESCRIPTION,
      VICTIM_INVOLVED: crimeData.VICTIM_NAME ? '1' : '0',
      INJURY_LEVEL: crimeData.INJURIES_SUSTAINED ? SeverityLevel.HIGH : undefined,
      WEAPON_INVOLVED: crimeData.WEAPON_INVOLVED ? '1' : '0',
      EVIDENCE_DETAILS: crimeData.EVIDENCE_DESCRIPTION,
      // Include report data
      SUBMITTED_BY: report.getSubmittedBy()!,
      TITLE: report.getTitle(),
      DESCRIPTION: report.getDescription(),
      LOCATION: report.getLocation(),
      STATUS: report.getStatus(),
      TYPE: report.getType()
    });

    return await this.crimeRepo.create(crime);
  }

  async updateCrime(id: number, updates: {
    // Report fields
    TITLE?: string;
    DESCRIPTION?: string;
    INCIDENT_DATE?: Date;
    LOCATION?: string;
    ANONYMOUS?: boolean;
    // Crime-specific fields
    CRIME_CATEGORY?: CrimeCategory;
    SEVERITY_LEVEL?: SeverityLevel;
    SUSPECT_DESCRIPTION?: string;
    WITNESS_COUNT?: number;
    EVIDENCE_DESCRIPTION?: string;
    WEAPON_INVOLVED?: boolean;
    WEAPON_DESCRIPTION?: string;
    VICTIM_NAME?: string;
    VICTIM_CONTACT?: string;
    INJURIES_SUSTAINED?: boolean;
    INJURY_DESCRIPTION?: string;
  }): Promise<Crime> {
    const crime = await this.getCrimeById(id);

    // Only allow updates if report is in PENDING status
    if (crime.getStatus() !== ReportStatus.PENDING) {
      throw new Error('Can only update crime reports in PENDING status');
    }

    // Validate crime category if provided
    if (updates.CRIME_CATEGORY && !Object.values(CrimeCategory).includes(updates.CRIME_CATEGORY)) {
      throw new Error('Invalid crime category');
    }

    // Validate severity level if provided
    if (updates.SEVERITY_LEVEL && !Object.values(SeverityLevel).includes(updates.SEVERITY_LEVEL)) {
      throw new Error('Invalid severity level');
    }

    // Validate witness count if provided
    if (updates.WITNESS_COUNT !== undefined && updates.WITNESS_COUNT < 0) {
      throw new Error('Witness count cannot be negative');
    }

    return await this.crimeRepo.update(id, updates);
  }

  async deleteCrime(id: number): Promise<boolean> {
    const crime = await this.getCrimeById(id);

    // Only allow deletion of crimes in PENDING or REJECTED status
    if (![ReportStatus.PENDING, ReportStatus.REJECTED].includes(crime.getStatus())) {
      throw new Error('Can only delete crime reports in PENDING or REJECTED status');
    }

    return await this.crimeRepo.delete(id);
  }

  async getCrimeStatisticsByCategory(): Promise<any> {
    return await this.crimeRepo.getStatisticsByCategory();
  }

  async getCrimeStatisticsBySeverity(): Promise<any> {
    return await this.crimeRepo.getStatisticsBySeverity();
  }

  async getHighSeverityCrimes(): Promise<Crime[]> {
    const highSeverityCrimes = await this.crimeRepo.findBySeverity(SeverityLevel.HIGH);
    const criticalCrimes = await this.crimeRepo.findBySeverity(SeverityLevel.CRITICAL);
    return [...criticalCrimes, ...highSeverityCrimes];
  }

  async getActiveCrimes(): Promise<Crime[]> {
    const activeStatuses = [
      ReportStatus.PENDING,
      ReportStatus.UNDER_REVIEW,
      ReportStatus.IN_PROGRESS
    ];

    const allCrimes: Crime[] = [];

    for (const status of activeStatuses) {
      const crimes = await this.crimeRepo.findAll({ status });
      allCrimes.push(...crimes);
    }

    return allCrimes;
  }
}
