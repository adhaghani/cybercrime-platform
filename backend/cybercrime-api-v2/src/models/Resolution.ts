import { BaseModel } from './base/BaseModel';
import { ResolutionType } from '../types/enums';

export interface ResolutionData {
  RESOLUTION_ID?: number;
  REPORT_ID: number;
  RESOLVED_BY: number;
  RESOLUTION_TYPE: ResolutionType;
  RESOLUTION_NOTES?: string;
  RESOLVED_AT?: Date;
  CREATED_AT?: Date;
  RESOLVED_BY_NAME?: string;
  REPORT_TITLE?: string;
}

export class Resolution extends BaseModel {
  constructor(data: ResolutionData) {
    super(data);
  }

  protected validate(): void {
    if (!this.getReportId()) {
      throw new Error('Report ID is required');
    }
    if (!this.getResolvedBy()) {
      throw new Error('Resolved by is required');
    }
    if (!this.getResolutionType()) {
      throw new Error('Resolution type is required');
    }
  }

  getId(): number | undefined {
    return this.get<number>('RESOLUTION_ID');
  }

  getReportId(): number {
    return this.get<number>('REPORT_ID');
  }

  getResolvedBy(): number {
    return this.get<number>('RESOLVED_BY');
  }

  getResolutionType(): ResolutionType {
    return this.get<ResolutionType>('RESOLUTION_TYPE');
  }

  getResolutionNotes(): string | undefined {
    return this.get<string>('RESOLUTION_NOTES');
  }

  getResolvedAt(): Date | undefined {
    return this.get<Date>('RESOLVED_AT');
  }

  getCreatedAt(): Date | undefined {
    return this.get<Date>('CREATED_AT');
  }

  getResolvedByName(): string | undefined {
    return this.get<string>('RESOLVED_BY_NAME');
  }

  setResolutionNotes(notes: string): void {
    this.set('RESOLUTION_NOTES', notes);
  }

  setResolutionType(type: ResolutionType): void {
    this.set('RESOLUTION_TYPE', type);
  }
}
