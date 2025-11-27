export type Role = 'STUDENT' | 'STAFF' | 'ADMIN';

export type ReportStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';

export type CrimeCategory = 'THEFT' | 'ASSAULT' | 'VANDALISM' | 'HARASSMENT' | 'OTHER';
export type FacilityType = 'ELECTRICAL' | 'PLUMBING' | 'FURNITURE' | 'INFRASTRUCTURE' | 'OTHER';
export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

// Base Account Interface
export interface Account {
  id: string;
  email: string;
  name: string;
  contactNumber: string;
  role: Role;
  avatarUrl?: string;
}

// Student Interface
export interface Student extends Account {
  role: 'STUDENT';
  studentId: string;
  program: string;
  semester: number;
  yearOfStudy: number;
}

// Staff Interface
export interface Staff extends Account {
  role: 'STAFF' | 'ADMIN';
  staffId: string;
  department: string;
  position: string;
}

// Base Report Interface
export interface Report {
  id: string;
  title: string;
  description: string;
  location: string;
  status: ReportStatus;
  submittedBy: string; // User ID
  submittedAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  attachmentPath?: string;
  type: 'CRIME' | 'FACILITY';
}

// Crime Report Interface
export interface CrimeReport extends Report {
  type: 'CRIME';
  crimeCategory: CrimeCategory;
  suspectDescription?: string;
  victimInvolved?: string;
  weaponInvolved?: string;
  injuryLevel?: string;
  evidenceDetails?: string;
}

// Facility Report Interface
export interface FacilityReport extends Report {
  type: 'FACILITY';
  facilityType: FacilityType;
  severityLevel: SeverityLevel;
  affectedEquipment?: string;
}

// Union type for use in lists
export type AnyReport = CrimeReport | FacilityReport;

// Report Assignment Interface
export interface ReportAssignment {
  id: string;
  reportId: string;
  assignedTo: string; // Staff ID
  assignedAt: string;
  actionTaken?: string;
  status: ReportStatus;
}
