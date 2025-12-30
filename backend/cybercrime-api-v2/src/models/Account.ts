/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseModel } from './base/BaseModel';
import { AccountType } from '../types/enums';

export interface AccountData {
  ACCOUNT_ID?: number;
  NAME: string;
  EMAIL: string;
  PASSWORD_HASH: string;
  CONTACT_NUMBER?: string;
  ACCOUNT_TYPE: AccountType;
  AVATAR_URL?: string;
  CREATED_AT?: Date;
  UPDATED_AT?: Date;
}

export class Account extends BaseModel {
  constructor(data: AccountData) {
    super(data);
  }

  protected validate(): void {
    if (!this.getName()) {
      throw new Error('Account name is required');
    }
    if (!this.getEmail()) {
      throw new Error('Account email is required');
    }
    if (!this.isValidEmail(this.getEmail())) {
      throw new Error('Invalid email format');
    }
    if (!this.getPasswordHash()) {
      throw new Error('Password hash is required');
    }
    if (!this.getAccountType()) {
      throw new Error('Account type is required');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Getters
  getId(): number | undefined {
    return this.get<number>('ACCOUNT_ID');
  }

  getName(): string {
    return this.get<string>('NAME');
  }

  getEmail(): string {
    return this.get<string>('EMAIL');
  }

  getPasswordHash(): string {
    return this.get<string>('PASSWORD_HASH');
  }

  getContactNumber(): string | undefined {
    return this.get<string>('CONTACT_NUMBER');
  }

  getAccountType(): AccountType {
    return this.get<AccountType>('ACCOUNT_TYPE');
  }

  getAvatarUrl(): string | undefined {
    return this.get<string>('AVATAR_URL');
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

  setEmail(email: string): void {
    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }
    this.set('EMAIL', email);
  }

  setPasswordHash(hash: string): void {
    this.set('PASSWORD_HASH', hash);
  }

  setContactNumber(number: string): void {
    this.set('CONTACT_NUMBER', number);
  }

  setAvatarUrl(url: string): void {
    this.set('AVATAR_URL', url);
  }

  // Override toJSON to exclude password
  toJSON(): Record<string, any> {
    const { PASSWORD_HASH, ...safeData } = this._data;
    return safeData;
  }
}
