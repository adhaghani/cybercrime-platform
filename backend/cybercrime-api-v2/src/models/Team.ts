import { BaseModel } from './base/BaseModel';

export interface TeamData {
  TEAM_ID?: number;
  TEAM_NAME: string;
  DESCRIPTION?: string;
  TEAM_LEAD_ID?: number;
  CREATED_AT?: Date;
  UPDATED_AT?: Date;
  TEAM_LEAD_NAME?: string;
  TEAM_LEAD_EMAIL?: string;
  MEMBER_COUNT?: number;
}

export class Team extends BaseModel {
  constructor(data: TeamData) {
    super(data);
  }

  protected validate(): void {
    if (!this.getTeamName()) {
      throw new Error('Team name is required');
    }
  }

  getId(): number | undefined {
    return this.get<number>('TEAM_ID');
  }

  getTeamId(): number | undefined {
    return this.get<number>('TEAM_ID');
  }

  getTeamName(): string {
    return this.get<string>('TEAM_NAME');
  }

  getDescription(): string | undefined {
    return this.get<string>('DESCRIPTION');
  }

  getTeamLeadId(): number | undefined {
    return this.get<number>('TEAM_LEAD_ID');
  }

  getCreatedAt(): Date | undefined {
    return this.get<Date>('CREATED_AT');
  }

  getUpdatedAt(): Date | undefined {
    return this.get<Date>('UPDATED_AT');
  }

  getTeamLeadName(): string | undefined {
    return this.get<string>('TEAM_LEAD_NAME');
  }

  getTeamLeadEmail(): string | undefined {
    return this.get<string>('TEAM_LEAD_EMAIL');
  }

  getMemberCount(): number | undefined {
    return this.get<number>('MEMBER_COUNT');
  }

  setTeamName(name: string): void {
    this.set('TEAM_NAME', name);
  }

  setDescription(description: string): void {
    this.set('DESCRIPTION', description);
  }

  setTeamLeadId(id: number): void {
    this.set('TEAM_LEAD_ID', id);
  }
}
