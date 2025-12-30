// Enums for type safety and runtime value access
export enum AccountType {
  STUDENT = 'STUDENT',
  STAFF = 'STAFF'
}

export enum Role {
  STUDENT = 'STUDENT',
  STAFF = 'STAFF',
  SUPERVISOR = 'SUPERVISOR',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN'
}

export enum ReportStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
  CLOSED = 'CLOSED'
}

export enum ReportType {
  CRIME = 'CRIME',
  FACILITY = 'FACILITY'
}

export enum EmergencyServiceType {
  POLICE = 'Police',
  FIRE = 'Fire',
  MEDICAL = 'Medical',
  CIVIL_DEFENCE = 'Civil Defence'
}

export enum CrimeCategory {
  THEFT = 'THEFT',
  ASSAULT = 'ASSAULT',
  VANDALISM = 'VANDALISM',
  HARASSMENT = 'HARASSMENT',
  OTHER = 'OTHER'
}

export enum FacilityType {
  ELECTRICAL = 'ELECTRICAL',
  PLUMBING = 'PLUMBING',
  HVAC = 'HVAC',
  STRUCTURAL = 'STRUCTURAL',
  FURNITURE = 'FURNITURE',
  INFRASTRUCTURE = 'INFRASTRUCTURE',
  OTHER = 'OTHER'
}

export enum SeverityLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum AnnouncementAudience {
  ALL = 'ALL',
  STUDENTS = 'STUDENTS',
  STAFF = 'STAFF',
  ADMIN = 'ADMIN'
}

export enum AnnouncementType {
  GENERAL = 'GENERAL',
  EMERGENCY = 'EMERGENCY',
  EVENT = 'EVENT'
}

export enum AnnouncementPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export enum AnnouncementStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVE = 'ARCHIVE'
}

export enum ResolutionType {
  RESOLVED = 'RESOLVED',
  ESCALATED = 'ESCALATED',
  DISMISSED = 'DISMISSED',
  TRANSFERRED = 'TRANSFERRED'
}

// Type aliases for string unions (states and campuses)
export type MalaysianState = 'Johor' | 'Kedah' | 'Kelantan' | 'Kuala Lumpur' | 'Labuan' | 'Melaka' | 'Negeri Sembilan' | 'Pahang' | 'Penang' | 'Perak' | 'Perlis' | 'Putrajaya' | 'Sabah' | 'Sarawak' | 'Selangor' | 'Terengganu';
export type UiTMCampus = 'Shah Alam' | 'Puncak Alam' | 'Segamat' | 'Perlis' | 'Pulau Pinang' | 'Perak' | 'Pahang' | 'Terengganu' | 'Kelantan' | 'Kedah' | 'Johor' | 'Melaka' | 'Negeri Sembilan' | 'Sabah' | 'Sarawak';

// Database-related interfaces
export interface DatabaseResult {
  rows: any[];
  rowsAffected?: number;
  outBinds?: any;
}

export interface QueryOptions {
  autoCommit?: boolean;
  outFormat?: number;
}
