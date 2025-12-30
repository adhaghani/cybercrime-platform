import { BaseModel } from './base/BaseModel';
import { MalaysianState } from '../types/enums';

export interface PoliceData {
  EMERGENCY_ID?: number;
  CAMPUS: string;
  STATE: string;
  ADDRESS: string;
  PHONE: string;
  HOTLINE: string;
  EMAIL?: string;
  OPERATING_HOURS?: string;
  CREATED_AT?: Date;
  UPDATED_AT?: Date;
}

export class Police extends BaseModel {
  constructor(data: PoliceData) {
    super(data);
  }

  protected validate(): void {
    if (!this.getCampus()) {
      throw new Error('Campus is required');
    }
    if (!this.getState()) {
      throw new Error('State is required');
    }
    if (!this.getAddress()) {
      throw new Error('Address is required');
    }
    if (!this.getPhone()) {
      throw new Error('Phone is required');
    }
    if (!this.getHotline()) {
      throw new Error('Hotline is required');
    }
  }

  // Getters
  getId(): number | undefined {
    return this.get<number>('EMERGENCY_ID');
  }

  getCampus(): string {
    return this.get<string>('CAMPUS');
  }

  getState(): string {
    return this.get<string>('STATE');
  }

  getAddress(): string {
    return this.get<string>('ADDRESS');
  }

  getPhone(): string {
    return this.get<string>('PHONE');
  }

  getHotline(): string {
    return this.get<string>('HOTLINE');
  }

  getEmail(): string | undefined {
    return this.get<string>('EMAIL');
  }

  getOperatingHours(): string {
    return this.get<string>('OPERATING_HOURS') || '24 Hours';
  }

  getCreatedAt(): Date | undefined {
    return this.get<Date>('CREATED_AT');
  }

  getUpdatedAt(): Date | undefined {
    return this.get<Date>('UPDATED_AT');
  }

  // Setters
  setCampus(campus: string): void {
    this.set('CAMPUS', campus);
  }

  setState(state: MalaysianState): void {
    this.set('STATE', state);
  }

  setAddress(address: string): void {
    this.set('ADDRESS', address);
  }

  setPhone(phone: string): void {
    this.set('PHONE', phone);
  }

  setHotline(hotline: string): void {
    this.set('HOTLINE', hotline);
  }

  setEmail(email: string): void {
    this.set('EMAIL', email);
  }

  setOperatingHours(hours: string): void {
    this.set('OPERATING_HOURS', hours);
  }
}
