import { BaseModel } from './base/BaseModel';
import { AnnouncementAudience, AnnouncementType, AnnouncementPriority, AnnouncementStatus } from '../types/enums';

export interface AnnouncementData {
  ANNOUNCEMENT_ID?: number;
  CREATED_BY: number;
  TITLE: string;
  MESSAGE: string;
  AUDIENCE: AnnouncementAudience;
  TYPE: AnnouncementType;
  PRIORITY: AnnouncementPriority;
  STATUS: AnnouncementStatus;
  PHOTO_PATH?: string;
  START_DATE: Date;
  END_DATE: Date;
  CREATED_AT?: Date;
  UPDATED_AT?: Date;
  CREATED_BY_NAME?: string;
  CREATED_BY_EMAIL?: string;
}

export class Announcement extends BaseModel {
  constructor(data: AnnouncementData) {
    super(data);
  }

  protected validate(): void {
    if (!this.getTitle()) {
      throw new Error('Announcement title is required');
    }
    if (!this.getMessage()) {
      throw new Error('Announcement message is required');
    }
    if (!this.getCreatedBy()) {
      throw new Error('Created by is required');
    }
  }

  // Getters
  getId(): number | undefined {
    return this.get<number>('ANNOUNCEMENT_ID');
  }

  getCreatedBy(): number {
    return this.get<number>('CREATED_BY');
  }

  getTitle(): string {
    return this.get<string>('TITLE');
  }

  getMessage(): string {
    return this.get<string>('MESSAGE');
  }

  getAudience(): AnnouncementAudience {
    return this.get<AnnouncementAudience>('AUDIENCE');
  }

  getType(): AnnouncementType {
    return this.get<AnnouncementType>('TYPE');
  }

  getPriority(): AnnouncementPriority {
    return this.get<AnnouncementPriority>('PRIORITY');
  }

  getStatus(): AnnouncementStatus {
    return this.get<AnnouncementStatus>('STATUS');
  }

  getPhotoPath(): string | undefined {
    return this.get<string>('PHOTO_PATH');
  }

  getStartDate(): Date {
    return this.get<Date>('START_DATE');
  }

  getEndDate(): Date {
    return this.get<Date>('END_DATE');
  }

  getCreatedAt(): Date | undefined {
    return this.get<Date>('CREATED_AT');
  }

  getUpdatedAt(): Date | undefined {
    return this.get<Date>('UPDATED_AT');
  }

  getCreatedByName(): string | undefined {
    return this.get<string>('CREATED_BY_NAME');
  }

  // Setters
  setTitle(title: string): void {
    this.set('TITLE', title);
  }

  setMessage(message: string): void {
    this.set('MESSAGE', message);
  }

  setAudience(audience: AnnouncementAudience): void {
    this.set('AUDIENCE', audience);
  }

  setType(type: AnnouncementType): void {
    this.set('TYPE', type);
  }

  setPriority(priority: AnnouncementPriority): void {
    this.set('PRIORITY', priority);
  }

  setStatus(status: AnnouncementStatus): void {
    this.set('STATUS', status);
  }

  setPhotoPath(path: string): void {
    this.set('PHOTO_PATH', path);
  }

  setStartDate(date: Date): void {
    this.set('START_DATE', date);
  }

  setEndDate(date: Date): void {
    this.set('END_DATE', date);
  }

  /**
   * Check if announcement is currently active
   */
  isActive(): boolean {
    const now = new Date();
    const start = new Date(this.getStartDate());
    const end = new Date(this.getEndDate());
    return now >= start && now <= end && this.getStatus() === 'PUBLISHED';
  }
}
