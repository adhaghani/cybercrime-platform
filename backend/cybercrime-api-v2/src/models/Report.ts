import { BaseModel } from './base/BaseModel';
import { ReportStatus, ReportType } from '../types/enums';

export interface ReportData {
  REPORT_ID?: number;
  SUBMITTED_BY: number;
  TITLE: string;
  DESCRIPTION: string;
  LOCATION: string;
  STATUS: ReportStatus;
  TYPE: ReportType;
  ATTACHMENT_PATH?: string | string[];
  SUBMITTED_AT?: Date;
  UPDATED_AT?: Date;
  SUBMITTED_BY_NAME?: string;
  SUBMITTED_BY_EMAIL?: string;
}

export class Report extends BaseModel {
  constructor(data: ReportData) {
    super(data);
  }

  protected validate(): void {
    if (!this.getTitle()) {
      throw new Error('Report title is required');
    }
    if (!this.getDescription()) {
      throw new Error('Report description is required');
    }
    if (!this.getLocation()) {
      throw new Error('Report location is required');
    }
    if (!this.getType()) {
      throw new Error('Report type is required');
    }
  }

  // Getters
  getId(): number | undefined {
    return this.get<number>('REPORT_ID');
  }

  getReportId(): number | undefined {
    return this.get<number>('REPORT_ID');
  }

  getSubmittedBy(): number {
    return this.get<number>('SUBMITTED_BY');
  }

  getSubmitterId(): number {
    return this.get<number>('SUBMITTED_BY');
  }

  getTitle(): string {
    return this.get<string>('TITLE');
  }

  getDescription(): string {
    return this.get<string>('DESCRIPTION');
  }

  getLocation(): string {
    return this.get<string>('LOCATION');
  }

  getStatus(): ReportStatus {
    return this.get<ReportStatus>('STATUS') || 'PENDING';
  }

  getType(): ReportType {
    return this.get<ReportType>('TYPE');
  }

  getReportType(): ReportType {
    return this.get<ReportType>('TYPE');
  }

  getAttachmentPath(): string[] {
    const path = this.get<string | string[]>('ATTACHMENT_PATH');
    if (!path) return [];
    if (Array.isArray(path)) return path;
    try {
      const parsed = JSON.parse(path);
      return Array.isArray(parsed) ? parsed : [path];
    } catch {
      return [path];
    }
  }

  getSubmittedAt(): Date | undefined {
    return this.get<Date>('SUBMITTED_AT');
  }

  getIncidentDate(): Date | undefined {
    return this.get<Date>('SUBMITTED_AT');
  }

  getUpdatedAt(): Date | undefined {
    return this.get<Date>('UPDATED_AT');
  }

  getAnonymous(): boolean {
    return false; // Default implementation
  }

  getSubmittedByName(): string | undefined {
    return this.get<string>('SUBMITTED_BY_NAME');
  }

  // Setters
  setTitle(title: string): void {
    this.set('TITLE', title);
  }

  setDescription(description: string): void {
    this.set('DESCRIPTION', description);
  }

  setLocation(location: string): void {
    this.set('LOCATION', location);
  }

  setStatus(status: ReportStatus): void {
    this.set('STATUS', status);
  }

  setAttachmentPath(paths: string[]): void {
    this.set('ATTACHMENT_PATH', JSON.stringify(paths));
  }

  addAttachment(path: string): void {
    const current = this.getAttachmentPath();
    current.push(path);
    this.setAttachmentPath(current);
  }
}
