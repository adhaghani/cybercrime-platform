import { BaseModel } from './base/BaseModel';
import { EmergencyServiceType, MalaysianState } from '../types/enums';

export interface EmergencyContactData {
  EMERGENCY_ID?: number;
  NAME: string;
  ADDRESS: string;
  PHONE: string;
  EMAIL?: string;
  STATE: MalaysianState;
  TYPE: EmergencyServiceType;
  HOTLINE?: string;
  CREATED_AT?: Date;
  UPDATED_AT?: Date;
}

export class EmergencyContact extends BaseModel {
  constructor(data: EmergencyContactData, skipValidation: boolean = false) {
    super(data, skipValidation);
  }

  protected validate(): void {
    if (!this.getName()) {
      throw new Error('Emergency contact name is required');
    }
    if (!this.getAddress()) {
      throw new Error('Emergency contact address is required');
    }
    if (!this.getPhone()) {
      throw new Error('Emergency contact phone is required');
    }
    if (!this.getState()) {
      throw new Error('Emergency contact state is required');
    }
    if (!this.getType()) {
      throw new Error('Emergency contact type is required');
    }
  }

  // Getters
  getId(): number | undefined {
    return this.get<number>('EMERGENCY_ID');
  }

  getName(): string {
    return this.get<string>('NAME');
  }

  getAddress(): string {
    return this.get<string>('ADDRESS');
  }

  getPhone(): string {
    return this.get<string>('PHONE');
  }

  getEmail(): string | undefined {
    return this.get<string>('EMAIL');
  }

  getState(): MalaysianState {
    return this.get<MalaysianState>('STATE');
  }

  getType(): EmergencyServiceType {
    return this.get<EmergencyServiceType>('TYPE');
  }

  getHotline(): string | undefined {
    return this.get<string>('HOTLINE');
  }

  getCreatedAt(): Date | undefined {
    return this.get<Date>('CREATED_AT');
  }

  getUpdatedAt(): Date | undefined {
    return this.get<Date>('UPDATED_AT');
  }

  // Setters
  setName(name: string): void {
    this.set('NAME', name);
  }

  setAddress(address: string): void {
    this.set('ADDRESS', address);
  }

  setPhone(phone: string): void {
    this.set('PHONE', phone);
  }

  setEmail(email: string): void {
    this.set('EMAIL', email);
  }

  setState(state: MalaysianState): void {
    this.set('STATE', state);
  }

  setType(type: EmergencyServiceType): void {
    this.set('TYPE', type);
  }

  setHotline(hotline: string): void {
    this.set('HOTLINE', hotline);
  }
}
