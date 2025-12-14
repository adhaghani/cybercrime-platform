/* eslint-disable @typescript-eslint/no-explicit-any */

// ============================================================================
// ENUMS & TYPES (Based on Database Schema)
// ============================================================================

export type AccountType = 'STUDENT' | 'STAFF';
export type Role = 'STUDENT' | 'STAFF' | 'ADMIN' | 'SUPERADMIN';

export type ReportStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
export type ReportType = 'CRIME' | 'FACILITY';

export type CrimeCategory = 'THEFT' | 'ASSAULT' | 'VANDALISM' | 'HARASSMENT' | 'OTHER';
export type FacilityType = 'ELECTRICAL' | 'PLUMBING' | 'FURNITURE' | 'INFRASTRUCTURE' | 'OTHER';
export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type EmergencyServiceType = 'Police' | 'Fire' | 'Medical' | 'Civil Defence';
export type UiTMCampus = 'Shah Alam' | 'Puncak Alam' | 'Segamat' | 'Perlis' | 'Pulau Pinang' | 'Perak' | 'Pahang' | 'Terengganu' | 'Kelantan' | 'Kedah' | 'Johor' | 'Melaka' | 'Negeri Sembilan' | 'Sabah' | 'Sarawak';
export type MalaysianState = 'Johor' | 'Kedah' | 'Kelantan' | 'Kuala Lumpur' | 'Labuan' | 'Melaka' | 'Negeri Sembilan' | 'Pahang' | 'Penang' | 'Perak' | 'Perlis' | 'Putrajaya' | 'Sabah' | 'Sarawak' | 'Selangor' | 'Terengganu';

export type AnnouncementAudience = 'ALL' | 'STUDENTS' | 'STAFF' | 'ADMIN';
export type AnnouncementType = 'GENERAL' | 'EMERGENCY' | 'EVENT';
export type AnnouncementPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type AnnouncementStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export type GeneratedReportCategory = 'CRIME' | 'FACILITY' | 'USER';
export type GeneratedReportDataType = 'SUMMARY' | 'DETAILED';

export type ResolutionType = 'RESOLVED' | 'ESCALATED' | 'DISMISSED' | 'TRANSFERRED';

// ============================================================================
// DATABASE MODELS (Matching type.txt schema)
// ============================================================================

// 1. Account Table
export interface Account {
  accountId: string;
  name: string;
  email: string;
  passwordHash: string;
  contactNumber: string;
  accountType: AccountType;
  createdAt: string;
  updatedAt: string;
}

// 2. Student Table
export interface Student extends Account {
  program: string;
  semester: number;
  yearOfStudy: number;
}

// 3. Staff Table
export interface Staff extends Account {
  role: Role;
  department: string;
  position: string;
  supervisorId?: string; // FK → staff.account_id (self-referencing)
}

// 4. Report Table
export interface Report {
  reportId: string;
  submittedBy: string; // FK → student.account_id
  title: string;
  description: string;
  location: string;
  status: ReportStatus;
  type: ReportType;
  attachmentPath?: string;
  submittedAt: string;
  updatedAt: string;
}

// 5. Report Assignment Table
export interface ReportAssignment {
  assignmentId: string;
  accountId: string; // FK → staff.account_id
  reportId: string; // FK → report.report_id
  assignedAt: string;
  actionTaken?: string;
  additionalFeedback?: string;
}

// 6. Emergency Info Table
export interface EmergencyInfo {
  emergencyId: string;
  name: string;
  address: string;
  phone: string;
  email?: string;
  state: MalaysianState;
  type?: EmergencyServiceType;
  hotline?: string;
  createdAt: string;
  updatedAt: string;
}

// 7. Generated Report Table
export interface GeneratedReport {
  generateId: string;
  generatedBy: string; // FK → staff.account_id
  title: string;
  summary: string;
  dateRangeStart: string;
  dateRangeEnd: string;
  reportCategory: GeneratedReportCategory;
  reportDataType: GeneratedReportDataType;
  reportData: any;
  requestedAt: string;
}

// 8. Announcement Table
export interface Announcement {
  announcementId: string;
  createdBy: string; // FK → staff.account_id
  title: string;
  message: string;
  audience: AnnouncementAudience;
  type: AnnouncementType;
  priority: AnnouncementPriority;
  status: AnnouncementStatus;
  photoPath?: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

// 9. Crime Table
export interface Crime extends Report{
  crimeCategory: CrimeCategory;
  suspectDescription?: string;
  victimInvolved?: string;
  injuryLevel?: string;
  weaponInvolved?: string;
  evidenceDetails?: string;
}

// 10. Facility Table
export interface Facility extends Report{
  facilityType: FacilityType;
  severityLevel: SeverityLevel;
  affectedEquipment?: string;
}

// 11. UiTM Auxiliary Police Table
export interface UiTMAuxiliaryPolice extends EmergencyInfo {
  campus: UiTMCampus;
  operatingHours: string;
}

// 12. Resolution Table
export interface Resolution {
  resolutionId: string;
  reportId: string; // FK → report.report_id
  resolvedBy: string; // FK → staff.account_id
  resolutionType: ResolutionType;
  resolutionSummary: string;
  evidencePath?: string;
  resolvedAt: string;
}

// ============================================================================
// EXTENDED TYPES FOR UI (Joined data from multiple tables)
// ============================================================================

export type AnyAccount = Student | Staff;

// Union type for reports
export type AnyReport = Crime | Facility;

// Report Assignment with staff details
export interface ReportAssignmentExtended extends ReportAssignment {
  staffName?: string;
  reportTitle?: string;
  reportType?: ReportType;
  reportStatus?: ReportStatus;
}
