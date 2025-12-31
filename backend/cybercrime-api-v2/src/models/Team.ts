import { Staff, StaffData } from './Staff';

/**
 * Team is a DTO (Data Transfer Object) representing a hierarchical team structure
 * based on the SUPERVISOR_ID relationship in the STAFF table.
 * A team consists of a supervisor and their direct reports.
 */
export interface TeamData {
  supervisor: StaffData;
  members: StaffData[];
  teamSize: number;
}

export class Team {
  private supervisor: Staff;
  private members: Staff[];
  private teamSize: number;

  constructor(data: TeamData) {
    this.supervisor = new Staff(data.supervisor, true);
    this.members = data.members.map(m => new Staff(m, true));
    this.teamSize = data.teamSize;
  }

  getSupervisor(): Staff {
    return this.supervisor;
  }

  getMembers(): Staff[] {
    return this.members;
  }

  getTeamSize(): number {
    return this.teamSize;
  }

  // Convenience getters for supervisor info
  getSupervisorId(): number | undefined {
    return this.supervisor.getId();
  }

  getSupervisorName(): string {
    return this.supervisor.getName();
  }

  toJSON(): any {
    return {
      supervisor: this.supervisor.toJSON(),
      members: this.members.map(m => m.toJSON()),
      teamSize: this.teamSize
    };
  }
}
