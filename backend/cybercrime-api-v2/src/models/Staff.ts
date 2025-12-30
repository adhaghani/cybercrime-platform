import { Account, AccountData } from './Account';
import { Role } from '../types/enums';

export interface StaffData extends AccountData {
  STAFF_ID?: string;
  ROLE: Role;
  DEPARTMENT: string;
  POSITION: string;
  SUPERVISOR_ID?: number;
  SUPERVISOR_NAME?: string;
}

export class Staff extends Account {
  constructor(data: StaffData) {
    super(data);
  }

  protected validate(): void {
    super.validate();
    
    if (!this.getRole()) {
      throw new Error('Staff role is required');
    }
    if (!this.getDepartment()) {
      throw new Error('Staff department is required');
    }
    if (!this.getPosition()) {
      throw new Error('Staff position is required');
    }
  }

  // Staff-specific getters
  getStaffId(): string | undefined {
    return this.get<string>('STAFF_ID');
  }

  getRole(): Role {
    return this.get<Role>('ROLE');
  }

  getDepartment(): string {
    return this.get<string>('DEPARTMENT');
  }

  getPosition(): string {
    return this.get<string>('POSITION');
  }

  getSupervisorId(): number | undefined {
    return this.get<number>('SUPERVISOR_ID');
  }

  getSupervisorName(): string | undefined {
    return this.get<string>('SUPERVISOR_NAME');
  }

  // Staff-specific setters
  setStaffId(id: string): void {
    this.set('STAFF_ID', id);
  }

  setRole(role: Role): void {
    this.set('ROLE', role);
  }

  setDepartment(department: string): void {
    this.set('DEPARTMENT', department);
  }

  setPosition(position: string): void {
    this.set('POSITION', position);
  }

  setSupervisorId(id: number): void {
    this.set('SUPERVISOR_ID', id);
  }
}
