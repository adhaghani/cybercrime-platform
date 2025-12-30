import { BaseModel } from './base/BaseModel';

export interface ReportAssignmentData {
  ASSIGNMENT_ID?: number;
  ACCOUNT_ID: number;
  REPORT_ID: number;
  ASSIGNED_AT?: Date;
  ACTION_TAKEN?: string;
  ADDITIONAL_FEEDBACK?: string;
  UPDATED_AT?: Date;
  STAFF_NAME?: string;
  STAFF_EMAIL?: string;
  REPORT_TITLE?: string;
}

export class ReportAssignment extends BaseModel {
  constructor(data: ReportAssignmentData) {
    super(data);
  }

  protected validate(): void {
    if (!this.getAccountId()) {
      throw new Error('Account ID is required');
    }
    if (!this.getReportId()) {
      throw new Error('Report ID is required');
    }
  }

  getId(): number | undefined {
    return this.get<number>('ASSIGNMENT_ID');
  }

  getAccountId(): number {
    return this.get<number>('ACCOUNT_ID');
  }

  getReportId(): number {
    return this.get<number>('REPORT_ID');
  }

  getAssignedAt(): Date | undefined {
    return this.get<Date>('ASSIGNED_AT');
  }

  getActionTaken(): string | undefined {
    return this.get<string>('ACTION_TAKEN');
  }

  getAdditionalFeedback(): string | undefined {
    return this.get<string>('ADDITIONAL_FEEDBACK');
  }

  getUpdatedAt(): Date | undefined {
    return this.get<Date>('UPDATED_AT');
  }

  getStaffName(): string | undefined {
    return this.get<string>('STAFF_NAME');
  }

  setActionTaken(action: string): void {
    this.set('ACTION_TAKEN', action);
  }

  setAdditionalFeedback(feedback: string): void {
    this.set('ADDITIONAL_FEEDBACK', feedback);
  }
}
