export type Role = 'STUDENT' | 'STAFF' | 'ADMIN' | 'SUPERADMIN';

export type ReportStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';

export type CrimeCategory = 'THEFT' | 'ASSAULT' | 'VANDALISM' | 'HARASSMENT' | 'OTHER';
export type FacilityType = 'ELECTRICAL' | 'PLUMBING' | 'FURNITURE' | 'INFRASTRUCTURE' | 'OTHER';
export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type EmergencyServiceType = 'Police' | 'Fire' | 'Medical' | 'Civil Defence';
export type UiTMCampus = 'Shah Alam' | 'Puncak Alam' | 'Segamat' | 'Perlis' | 'Pulau Pinang' | 'Perak' | 'Pahang' | 'Terengganu' | 'Kelantan' | 'Kedah' | 'Johor' | 'Melaka' | 'Negeri Sembilan' | 'Sabah' | 'Sarawak';
export type MalaysianState = 'Johor' | 'Kedah' | 'Kelantan' | 'Kuala Lumpur' | 'Labuan' | 'Melaka' | 'Negeri Sembilan' | 'Pahang' | 'Penang' | 'Perak' | 'Perlis' | 'Putrajaya' | 'Sabah' | 'Sarawak' | 'Selangor' | 'Terengganu';

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
  role: 'STAFF' | 'ADMIN' | 'SUPERADMIN';
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

// Base Emergency Contact Interface
export interface EmergencyContact {
  id: string;
  name: string;
  address: string;
  phone: string;
  email?: string;
  type?: EmergencyServiceType;
  hotline?: string;
  state: MalaysianState;
  createdAt?: string;
  updatedAt?: string;
}

// UiTM Auxiliary Police Interface
export interface UiTMAuxiliaryPolice extends EmergencyContact {
  campus: UiTMCampus;
  operatingHours: string;
}

// National Emergency Service Interface
export type NationalEmergencyService = EmergencyContact

// Union type for all emergency contacts
export type AnyEmergencyContact = UiTMAuxiliaryPolice | NationalEmergencyService;

export type AnnouncementAudience = 'ALL' | 'STUDENTS' | 'STAFF' | 'ADMIN';
export type AnnouncementType = 'GENERAL' | 'EMERGENCY' | 'EVENT';
export type AnnouncementStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type AnnouncementPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Announcement {
  id: string;
  title: string;
  message: string;
  audience: AnnouncementAudience;
  type: AnnouncementType;
  status: AnnouncementStatus;
  priority: AnnouncementPriority;
  isPinned?: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
  createdBy: string; // User ID
  createdByName?: string;
  updatedAt?: string;
}

export type GeneratedReportCategory = 'CRIME' | 'FACILITY' | 'USER';
export type GeneratedReportDataType = 'SUMMARY' | 'DETAILED';

export interface GeneratedReport {
  id: string;
  generatedBy: string; // Staff ID
  title: string;
  summary: string;
  dateRangeStart: string;
  dateRangeEnd: string;
  category: GeneratedReportCategory;
  dataType: GeneratedReportDataType;
  data: any;
  requestedAt: string;
}