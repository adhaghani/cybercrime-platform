# CSCI Data Structures
## Cybercrime Awareness and Reporting Platform (CARP)

**Document Version:** 1.0  
**Date:** January 4, 2026  
**Project:** Cybercrime Platform - Data Specifications

---

## 1. Introduction

### 1.1 Purpose
This document defines all data structures used in the Cybercrime Awareness and Reporting Platform (CARP), including entity models, data types, enumerations, interfaces, and data validation rules.

### 1.2 Scope
- **Domain Models:** Entity class definitions
- **Database Schema:** Table structures and relationships
- **Data Types:** Type definitions and enumerations
- **Validation Rules:** Data integrity constraints
- **API Payloads:** Request/response structures

---

## 2. Entity Models

### 2.1 Base Model

#### 2.1.1 BaseModel (Abstract)
**Purpose:** Abstract base class providing common functionality for all domain entities.

```typescript
abstract class BaseModel {
  protected data: Record<string, any>;
  
  constructor(data: Record<string, any>, skipValidation: boolean = false);
  protected abstract validate(): void;
  protected get<T>(key: string): T;
  protected set(key: string, value: any): void;
  public toJSON(): Record<string, any>;
}
```

**Properties:**
- `data`: Internal storage for entity properties

**Methods:**
- `validate()`: Abstract method for entity-specific validation
- `get<T>()`: Type-safe property getter
- `set()`: Property setter with validation trigger
- `toJSON()`: Serialize entity to plain object

---

### 2.2 Account Models

#### 2.2.1 Account Entity
**Purpose:** Base entity for all user accounts in the system.

```typescript
interface AccountData {
  ACCOUNT_ID?: number;
  NAME: string;
  EMAIL: string;
  PASSWORD_HASH: string;
  CONTACT_NUMBER?: string;
  AVATAR_URL?: string;
  ACCOUNT_TYPE: 'STUDENT' | 'STAFF';
  CREATED_AT?: Date;
  UPDATED_AT?: Date;
}

class Account extends BaseModel {
  constructor(data: AccountData, skipValidation?: boolean);
  
  // Getters
  getId(): number | undefined;
  getName(): string;
  getEmail(): string;
  getPasswordHash(): string;
  getContactNumber(): string | undefined;
  getAvatarUrl(): string | undefined;
  getAccountType(): AccountType;
  getCreatedAt(): Date | undefined;
  getUpdatedAt(): Date | undefined;
  
  // Setters
  setName(name: string): void;
  setEmail(email: string): void;
  setPasswordHash(hash: string): void;
  setContactNumber(number: string): void;
  setAvatarUrl(url: string): void;
  
  // Validation
  protected validate(): void;
}
```

**Validation Rules:**
- `NAME`: Required, 2-100 characters
- `EMAIL`: Required, valid email format, unique
- `PASSWORD_HASH`: Required, bcrypt hash format
- `CONTACT_NUMBER`: Optional, 10-20 characters, numeric with optional + and -
- `ACCOUNT_TYPE`: Required, must be 'STUDENT' or 'STAFF'

**Database Mapping:**
- **Table:** `ACCOUNT`
- **Primary Key:** `ACCOUNT_ID`
- **Unique Constraints:** `EMAIL`
- **Indexes:** `idx_account_email`, `idx_account_type`

---

#### 2.2.2 Student Entity
**Purpose:** Extends Account for student-specific data.

```typescript
interface StudentData extends AccountData {
  STUDENT_ID?: string;
  PROGRAM: string;
  SEMESTER: number;
  YEAR_OF_STUDY: number;
}

class Student extends Account {
  constructor(data: StudentData, skipValidation?: boolean);
  
  // Getters
  getStudentId(): string | undefined;
  getProgram(): string;
  getSemester(): number;
  getYearOfStudy(): number;
  
  // Setters
  setStudentId(id: string): void;
  setProgram(program: string): void;
  setSemester(semester: number): void;
  setYearOfStudy(year: number): void;
  
  protected validate(): void;
}
```

**Validation Rules:**
- Inherits all Account validation rules
- `PROGRAM`: Required, 3-100 characters
- `SEMESTER`: Required, integer >= 1
- `YEAR_OF_STUDY`: Required, integer >= 1

**Database Mapping:**
- **Table:** `STUDENT`
- **Primary Key:** `ACCOUNT_ID` (FK to ACCOUNT)
- **Unique Constraints:** `STUDENT_ID`
- **Indexes:** `idx_student_account`

---

#### 2.2.3 Staff Entity
**Purpose:** Extends Account for staff-specific data.

```typescript
interface StaffData extends AccountData {
  STAFF_ID?: string;
  ROLE: 'STAFF' | 'SUPERVISOR' | 'ADMIN' | 'SUPERADMIN';
  DEPARTMENT?: string;
  POSITION?: string;
  SUPERVISOR_ID?: number;
}

class Staff extends Account {
  constructor(data: StaffData, skipValidation?: boolean);
  
  // Getters
  getStaffId(): string | undefined;
  getRole(): Role;
  getDepartment(): string | undefined;
  getPosition(): string | undefined;
  getSupervisorId(): number | undefined;
  
  // Setters
  setStaffId(id: string): void;
  setRole(role: Role): void;
  setDepartment(dept: string): void;
  setPosition(position: string): void;
  setSupervisorId(id: number): void;
  
  protected validate(): void;
}
```

**Validation Rules:**
- Inherits all Account validation rules
- `ROLE`: Required, must be valid Role enum value
- `DEPARTMENT`: Optional, 3-100 characters
- `POSITION`: Optional, 3-100 characters
- `SUPERVISOR_ID`: Optional, must reference existing STAFF.ACCOUNT_ID

**Database Mapping:**
- **Table:** `STAFF`
- **Primary Key:** `ACCOUNT_ID` (FK to ACCOUNT)
- **Foreign Keys:** `SUPERVISOR_ID` → `STAFF(ACCOUNT_ID)`
- **Unique Constraints:** `STAFF_ID`
- **Indexes:** `idx_staff_account`, `idx_staff_supervisor`

---

### 2.3 Report Models

#### 2.3.1 Report Entity
**Purpose:** Base entity for all report types (crime and facility).

```typescript
interface ReportData {
  REPORT_ID?: number;
  SUBMITTED_BY: number;
  TITLE: string;
  DESCRIPTION: string;
  LOCATION: string;
  STATUS: ReportStatus;
  TYPE: ReportType;
  ATTACHMENT_PATH?: string | string[];
  SUBMITTED_AT?: Date;
  UPDATED_AT?: Date;
  SUBMITTED_BY_NAME?: string;
  SUBMITTED_BY_EMAIL?: string;
}

class Report extends BaseModel {
  constructor(data: ReportData);
  
  // Getters
  getId(): number | undefined;
  getReportId(): number | undefined;
  getSubmittedBy(): number;
  getSubmitterId(): number;
  getTitle(): string;
  getDescription(): string;
  getLocation(): string;
  getStatus(): ReportStatus;
  getType(): ReportType;
  getReportType(): ReportType;
  getAttachmentPath(): string[];
  getSubmittedAt(): Date | undefined;
  getIncidentDate(): Date | undefined;
  getUpdatedAt(): Date | undefined;
  getAnonymous(): boolean;
  getSubmittedByName(): string | undefined;
  
  // Setters
  setTitle(title: string): void;
  setDescription(description: string): void;
  setLocation(location: string): void;
  setStatus(status: ReportStatus): void;
  setAttachmentPath(paths: string[]): void;
  addAttachment(path: string): void;
  
  protected validate(): void;
}
```

**Validation Rules:**
- `SUBMITTED_BY`: Required, must reference existing ACCOUNT_ID
- `TITLE`: Required, 5-200 characters
- `DESCRIPTION`: Required, 10-5000 characters
- `LOCATION`: Required, 3-200 characters
- `STATUS`: Optional, defaults to 'PENDING'
- `TYPE`: Required, must be 'CRIME' or 'FACILITY'
- `ATTACHMENT_PATH`: Optional, JSON array of file paths

**Database Mapping:**
- **Table:** `REPORT`
- **Primary Key:** `REPORT_ID`
- **Foreign Keys:** `SUBMITTED_BY` → `ACCOUNT(ACCOUNT_ID)`
- **Indexes:** `idx_report_submitted_by`, `idx_report_status`, `idx_report_type`, `idx_report_submitted_at`

---

#### 2.3.2 Crime Entity
**Purpose:** Extends Report for cybercrime-specific data.

```typescript
interface CrimeData extends ReportData {
  CRIME_CATEGORY: CrimeCategory;
  SUSPECT_DESCRIPTION?: string;
  VICTIM_INVOLVED?: string;
  INJURY_LEVEL?: SeverityLevel;
  WEAPON_INVOLVED?: string;
  EVIDENCE_DETAILS?: string;
}

class Crime extends Report {
  constructor(data: CrimeData);
  
  // Getters
  getCrimeCategory(): CrimeCategory;
  getSuspectDescription(): string | undefined;
  getVictimInvolved(): string | undefined;
  getInjuryLevel(): SeverityLevel | undefined;
  getWeaponInvolved(): string | undefined;
  getEvidenceDetails(): string | undefined;
  
  // Setters
  setCrimeCategory(category: CrimeCategory): void;
  setSuspectDescription(description: string): void;
  setVictimInvolved(victim: string): void;
  setInjuryLevel(level: SeverityLevel): void;
  setWeaponInvolved(weapon: string): void;
  setEvidenceDetails(details: string): void;
  
  protected validate(): void;
}
```

**Validation Rules:**
- Inherits all Report validation rules
- `CRIME_CATEGORY`: Required, must be valid CrimeCategory enum
- `SUSPECT_DESCRIPTION`: Optional, max 500 characters
- `VICTIM_INVOLVED`: Optional, max 100 characters
- `INJURY_LEVEL`: Optional, must be valid SeverityLevel enum
- `WEAPON_INVOLVED`: Optional, max 100 characters
- `EVIDENCE_DETAILS`: Optional, max 5000 characters

**Database Mapping:**
- **Table:** `CRIME`
- **Primary Key:** `REPORT_ID` (FK to REPORT)
- **Relationship:** 1:1 with REPORT where TYPE='CRIME'

---

#### 2.3.3 Facility Entity
**Purpose:** Extends Report for facility issue data.

```typescript
interface FacilityData extends ReportData {
  FACILITY_TYPE: FacilityType;
  SEVERITY_LEVEL: SeverityLevel;
  AFFECTED_EQUIPMENT?: string;
}

class Facility extends Report {
  constructor(data: FacilityData);
  
  // Getters
  getFacilityType(): FacilityType;
  getSeverityLevel(): SeverityLevel;
  getAffectedEquipment(): string | undefined;
  
  // Setters
  setFacilityType(type: FacilityType): void;
  setSeverityLevel(level: SeverityLevel): void;
  setAffectedEquipment(equipment: string): void;
  
  protected validate(): void;
}
```

**Validation Rules:**
- Inherits all Report validation rules
- `FACILITY_TYPE`: Required, must be valid FacilityType enum
- `SEVERITY_LEVEL`: Required, must be valid SeverityLevel enum
- `AFFECTED_EQUIPMENT`: Optional, max 500 characters

**Database Mapping:**
- **Table:** `FACILITY`
- **Primary Key:** `REPORT_ID` (FK to REPORT)
- **Relationship:** 1:1 with REPORT where TYPE='FACILITY'

---

### 2.4 Announcement Entity

```typescript
interface AnnouncementData {
  ANNOUNCEMENT_ID?: number;
  CREATED_BY: number;
  TITLE: string;
  MESSAGE: string;
  AUDIENCE: AnnouncementAudience;
  TYPE: AnnouncementType;
  PRIORITY: AnnouncementPriority;
  STATUS: AnnouncementStatus;
  PHOTO_PATH?: string;
  START_DATE: Date;
  END_DATE: Date;
  CREATED_AT?: Date;
  UPDATED_AT?: Date;
  CREATED_BY_NAME?: string;
  CREATED_BY_EMAIL?: string;
}

class Announcement extends BaseModel {
  constructor(data: AnnouncementData);
  
  // Getters
  getId(): number | undefined;
  getCreatedBy(): number;
  getTitle(): string;
  getMessage(): string;
  getAudience(): AnnouncementAudience;
  getType(): AnnouncementType;
  getPriority(): AnnouncementPriority;
  getStatus(): AnnouncementStatus;
  getPhotoPath(): string | undefined;
  getStartDate(): Date;
  getEndDate(): Date;
  getCreatedAt(): Date | undefined;
  getUpdatedAt(): Date | undefined;
  getCreatedByName(): string | undefined;
  
  // Setters
  setTitle(title: string): void;
  setMessage(message: string): void;
  setAudience(audience: AnnouncementAudience): void;
  setType(type: AnnouncementType): void;
  setPriority(priority: AnnouncementPriority): void;
  setStatus(status: AnnouncementStatus): void;
  setPhotoPath(path: string): void;
  setStartDate(date: Date): void;
  setEndDate(date: Date): void;
  
  protected validate(): void;
}
```

**Validation Rules:**
- `CREATED_BY`: Required, must reference existing ACCOUNT_ID
- `TITLE`: Required, 5-200 characters
- `MESSAGE`: Required, 10-5000 characters
- `AUDIENCE`: Required, must be valid AnnouncementAudience enum
- `TYPE`: Required, must be valid AnnouncementType enum
- `PRIORITY`: Required, must be valid AnnouncementPriority enum
- `STATUS`: Optional, defaults to 'PUBLISHED'
- `START_DATE`: Required, must be valid date
- `END_DATE`: Required, must be >= START_DATE
- `PHOTO_PATH`: Optional, valid file path

**Database Mapping:**
- **Table:** `ANNOUNCEMENT`
- **Primary Key:** `ANNOUNCEMENT_ID`
- **Foreign Keys:** `CREATED_BY` → `ACCOUNT(ACCOUNT_ID)`
- **Indexes:** `idx_announcement_audience`, `idx_announcement_status`, `idx_announcement_dates`
- **Constraints:** `ck_announcement_dates` (END_DATE >= START_DATE)

---

### 2.5 Emergency Contact Models

#### 2.5.1 EmergencyContact Entity

```typescript
interface EmergencyContactData {
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

class EmergencyContact extends BaseModel {
  constructor(data: EmergencyContactData, skipValidation?: boolean);
  
  // Getters
  getId(): number | undefined;
  getName(): string;
  getAddress(): string;
  getPhone(): string;
  getEmail(): string | undefined;
  getState(): MalaysianState;
  getType(): EmergencyServiceType;
  getHotline(): string | undefined;
  getCreatedAt(): Date | undefined;
  getUpdatedAt(): Date | undefined;
  
  // Setters
  setName(name: string): void;
  setAddress(address: string): void;
  setPhone(phone: string): void;
  setEmail(email: string): void;
  setState(state: MalaysianState): void;
  setType(type: EmergencyServiceType): void;
  setHotline(hotline: string): void;
  
  protected validate(): void;
}
```

**Validation Rules:**
- `NAME`: Required, 3-200 characters
- `ADDRESS`: Required, 10-500 characters
- `PHONE`: Required, 10-20 characters
- `EMAIL`: Optional, valid email format
- `STATE`: Required, must be valid MalaysianState
- `TYPE`: Required, must be valid EmergencyServiceType
- `HOTLINE`: Optional, 10-20 characters

**Database Mapping:**
- **Table:** `EMERGENCY_INFO`
- **Primary Key:** `EMERGENCY_ID`
- **Indexes:** `idx_emergency_state`, `idx_emergency_type`

---

#### 2.5.2 Police Entity (Extends EmergencyContact)

```typescript
interface PoliceData extends EmergencyContactData {
  CAMPUS: UiTMCampus;
  OPERATING_HOURS?: string;
}

class Police extends EmergencyContact {
  constructor(data: PoliceData, skipValidation?: boolean);
  
  // Getters
  getCampus(): UiTMCampus;
  getOperatingHours(): string | undefined;
  
  // Setters
  setCampus(campus: UiTMCampus): void;
  setOperatingHours(hours: string): void;
  
  protected validate(): void;
}
```

**Validation Rules:**
- Inherits all EmergencyContact validation rules
- `CAMPUS`: Required, must be valid UiTMCampus
- `OPERATING_HOURS`: Optional, max 100 characters

**Database Mapping:**
- **Table:** `UITM_AUXILIARY_POLICE`
- **Primary Key:** `EMERGENCY_ID` (FK to EMERGENCY_INFO)
- **Relationship:** 1:1 with EMERGENCY_INFO

---

### 2.6 Assignment and Resolution Models

#### 2.6.1 ReportAssignment Entity

```typescript
interface ReportAssignmentData {
  ASSIGNMENT_ID?: number;
  ACCOUNT_ID: number;
  REPORT_ID: number;
  ASSIGNED_AT?: Date;
  ACTION_TAKEN?: string;
  ADDITIONAL_FEEDBACK?: string;
  UPDATED_AT?: Date;
}

class ReportAssignment extends BaseModel {
  constructor(data: ReportAssignmentData);
  
  // Getters
  getId(): number | undefined;
  getAccountId(): number;
  getReportId(): number;
  getAssignedAt(): Date | undefined;
  getActionTaken(): string | undefined;
  getAdditionalFeedback(): string | undefined;
  getUpdatedAt(): Date | undefined;
  
  // Setters
  setActionTaken(action: string): void;
  setAdditionalFeedback(feedback: string): void;
  
  protected validate(): void;
}
```

**Validation Rules:**
- `ACCOUNT_ID`: Required, must reference existing STAFF account
- `REPORT_ID`: Required, must reference existing REPORT_ID
- `ACTION_TAKEN`: Optional, max 500 characters
- `ADDITIONAL_FEEDBACK`: Optional, max 5000 characters

**Database Mapping:**
- **Table:** `REPORT_ASSIGNMENT`
- **Primary Key:** `ASSIGNMENT_ID`
- **Foreign Keys:** 
  - `ACCOUNT_ID` → `ACCOUNT(ACCOUNT_ID)`
  - `REPORT_ID` → `REPORT(REPORT_ID)`
- **Indexes:** `idx_assignment_account`, `idx_assignment_report`, `idx_assignment_updated`

---

#### 2.6.2 Resolution Entity

```typescript
interface ResolutionData {
  RESOLUTION_ID?: number;
  REPORT_ID: number;
  RESOLVED_BY: number;
  RESOLUTION_TYPE: ResolutionType;
  RESOLUTION_SUMMARY: string;
  EVIDENCE_PATH?: string;
  RESOLVED_AT?: Date;
}

class Resolution extends BaseModel {
  constructor(data: ResolutionData);
  
  // Getters
  getId(): number | undefined;
  getReportId(): number;
  getResolvedBy(): number;
  getResolutionType(): ResolutionType;
  getResolutionSummary(): string;
  getEvidencePath(): string | undefined;
  getResolvedAt(): Date | undefined;
  
  // Setters
  setResolutionType(type: ResolutionType): void;
  setResolutionSummary(summary: string): void;
  setEvidencePath(path: string): void;
  
  protected validate(): void;
}
```

**Validation Rules:**
- `REPORT_ID`: Required, must reference existing REPORT_ID
- `RESOLVED_BY`: Required, must reference existing STAFF account
- `RESOLUTION_TYPE`: Required, must be valid ResolutionType enum
- `RESOLUTION_SUMMARY`: Required, 10-5000 characters
- `EVIDENCE_PATH`: Optional, valid file path

**Database Mapping:**
- **Table:** `RESOLUTION`
- **Primary Key:** `RESOLUTION_ID`
- **Foreign Keys:**
  - `REPORT_ID` → `REPORT(REPORT_ID)`
  - `RESOLVED_BY` → `ACCOUNT(ACCOUNT_ID)`

---

### 2.7 Generated Report Entity

```typescript
interface GeneratedReportData {
  GENERATE_ID?: number;
  GENERATED_BY: number;
  TITLE: string;
  SUMMARY?: string;
  DATE_RANGE_START: Date;
  DATE_RANGE_END: Date;
  REPORT_CATEGORY: 'CRIME' | 'FACILITY' | 'USER' | 'ALL REPORTS';
  REPORT_DATA_TYPE: 'JSON' | 'SUMMARY' | 'DETAILED';
  REPORT_DATA?: string;
  REQUESTED_AT?: Date;
}

class GeneratedReport extends BaseModel {
  constructor(data: GeneratedReportData);
  
  // Getters
  getId(): number | undefined;
  getGeneratedBy(): number;
  getTitle(): string;
  getSummary(): string | undefined;
  getDateRangeStart(): Date;
  getDateRangeEnd(): Date;
  getReportCategory(): string;
  getReportDataType(): string;
  getReportData(): string | undefined;
  getRequestedAt(): Date | undefined;
  
  // Setters
  setTitle(title: string): void;
  setSummary(summary: string): void;
  setReportData(data: string): void;
  
  protected validate(): void;
}
```

**Validation Rules:**
- `GENERATED_BY`: Required, must reference existing ACCOUNT_ID
- `TITLE`: Required, 5-200 characters
- `DATE_RANGE_START`: Required, valid date
- `DATE_RANGE_END`: Required, must be >= DATE_RANGE_START
- `REPORT_CATEGORY`: Required, must be valid category
- `REPORT_DATA_TYPE`: Required, must be 'JSON', 'SUMMARY', or 'DETAILED'
- `REPORT_DATA`: Optional, JSON or text data

**Database Mapping:**
- **Table:** `GENERATED_REPORT`
- **Primary Key:** `GENERATE_ID`
- **Foreign Keys:** `GENERATED_BY` → `ACCOUNT(ACCOUNT_ID)`
- **Constraints:** `ck_generated_report_dates` (DATE_RANGE_END >= DATE_RANGE_START)

---

### 2.8 Team Entity

```typescript
interface TeamData {
  TEAM_ID?: number;
  NAME: string;
  DESCRIPTION?: string;
  CREATED_BY: number;
  CREATED_AT?: Date;
  UPDATED_AT?: Date;
}

class Team extends BaseModel {
  constructor(data: TeamData);
  
  // Getters
  getId(): number | undefined;
  getName(): string;
  getDescription(): string | undefined;
  getCreatedBy(): number;
  getCreatedAt(): Date | undefined;
  getUpdatedAt(): Date | undefined;
  
  // Setters
  setName(name: string): void;
  setDescription(description: string): void;
  
  protected validate(): void;
}
```

**Validation Rules:**
- `NAME`: Required, 3-100 characters, unique
- `DESCRIPTION`: Optional, max 500 characters
- `CREATED_BY`: Required, must reference existing STAFF account

---

## 3. Enumerations

### 3.1 Account and Role Enums

```typescript
enum AccountType {
  STUDENT = 'STUDENT',
  STAFF = 'STAFF'
}

enum Role {
  STUDENT = 'STUDENT',
  STAFF = 'STAFF',
  SUPERVISOR = 'SUPERVISOR',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN'
}
```

**Role Hierarchy:**
```
SUPERADMIN > ADMIN > SUPERVISOR > STAFF > STUDENT
```

---

### 3.2 Report Enums

```typescript
enum ReportStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
  CLOSED = 'CLOSED'
}

enum ReportType {
  CRIME = 'CRIME',
  FACILITY = 'FACILITY'
}

enum CrimeCategory {
  THEFT = 'THEFT',
  ASSAULT = 'ASSAULT',
  VANDALISM = 'VANDALISM',
  HARASSMENT = 'HARASSMENT',
  OTHER = 'OTHER'
}

enum FacilityType {
  ELECTRICAL = 'ELECTRICAL',
  PLUMBING = 'PLUMBING',
  HVAC = 'HVAC',
  STRUCTURAL = 'STRUCTURAL',
  FURNITURE = 'FURNITURE',
  INFRASTRUCTURE = 'INFRASTRUCTURE',
  OTHER = 'OTHER'
}

enum SeverityLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}
```

**Status Flow:**
```
PENDING → UNDER_REVIEW → IN_PROGRESS → RESOLVED
                                    ↓
                                REJECTED
                                    ↓
                                 CLOSED
```

---

### 3.3 Announcement Enums

```typescript
enum AnnouncementAudience {
  ALL = 'ALL',
  STUDENTS = 'STUDENTS',
  STAFF = 'STAFF',
  ADMIN = 'ADMIN'
}

enum AnnouncementType {
  GENERAL = 'GENERAL',
  EMERGENCY = 'EMERGENCY',
  EVENT = 'EVENT'
}

enum AnnouncementPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

enum AnnouncementStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVE = 'ARCHIVE'
}
```

---

### 3.4 Emergency Service Enums

```typescript
enum EmergencyServiceType {
  POLICE = 'Police',
  FIRE = 'Fire',
  MEDICAL = 'Medical',
  CIVIL_DEFENCE = 'Civil Defence'
}
```

---

### 3.5 Resolution Enum

```typescript
enum ResolutionType {
  RESOLVED = 'RESOLVED',
  ESCALATED = 'ESCALATED',
  DISMISSED = 'DISMISSED',
  TRANSFERRED = 'TRANSFERRED'
}
```

---

### 3.6 Type Aliases

```typescript
type MalaysianState = 
  | 'Johor' | 'Kedah' | 'Kelantan' | 'Kuala Lumpur' 
  | 'Labuan' | 'Melaka' | 'Negeri Sembilan' | 'Pahang' 
  | 'Penang' | 'Perak' | 'Perlis' | 'Putrajaya' 
  | 'Sabah' | 'Sarawak' | 'Selangor' | 'Terengganu';

type UiTMCampus = 
  | 'Shah Alam' | 'Puncak Alam' | 'Segamat' | 'Perlis' 
  | 'Pulau Pinang' | 'Perak' | 'Pahang' | 'Terengganu' 
  | 'Kelantan' | 'Kedah' | 'Johor' | 'Melaka' 
  | 'Negeri Sembilan' | 'Sabah' | 'Sarawak';
```

---

## 4. API Data Structures

### 4.1 Authentication Payloads

#### 4.1.1 Register Request
```typescript
interface RegisterRequest {
  name: string;              // 2-100 characters
  email: string;             // Valid email format
  password: string;          // Min 8 characters
  contactNumber?: string;    // Optional phone number
  accountType: 'STUDENT' | 'STAFF';
  
  // Student-specific fields
  studentId?: string;
  program?: string;
  semester?: number;
  yearOfStudy?: number;
  
  // Staff-specific fields
  staffId?: string;
  role?: 'STAFF' | 'SUPERVISOR' | 'ADMIN';
  department?: string;
  position?: string;
}
```

#### 4.1.2 Login Request
```typescript
interface LoginRequest {
  email: string;
  password: string;
}
```

#### 4.1.3 Login Response
```typescript
interface LoginResponse {
  success: boolean;
  token: string;             // JWT token
  refreshToken?: string;     // Optional refresh token
  user: {
    id: number;
    name: string;
    email: string;
    accountType: AccountType;
    role?: Role;
    avatarUrl?: string;
  };
}
```

#### 4.1.4 Token Payload
```typescript
interface TokenPayload {
  sub: string;               // User ID
  email: string;
  accountType: AccountType;
  role: Role;
  iat: number;               // Issued at timestamp
  exp: number;               // Expiration timestamp
}
```

---

### 4.2 Report Payloads

#### 4.2.1 Create Report Request
```typescript
interface CreateReportRequest {
  title: string;             // 5-200 characters
  description: string;       // 10-5000 characters
  location: string;          // 3-200 characters
  type: 'CRIME' | 'FACILITY';
  
  // Crime-specific fields
  crimeCategory?: CrimeCategory;
  suspectDescription?: string;
  victimInvolved?: string;
  injuryLevel?: SeverityLevel;
  weaponInvolved?: string;
  evidenceDetails?: string;
  
  // Facility-specific fields
  facilityType?: FacilityType;
  severityLevel?: SeverityLevel;
  affectedEquipment?: string;
  
  // File attachments (handled separately via multipart/form-data)
  attachments?: File[];
}
```

#### 4.2.2 Update Report Request
```typescript
interface UpdateReportRequest {
  title?: string;
  description?: string;
  location?: string;
  status?: ReportStatus;
  
  // Type-specific updates
  crimeCategory?: CrimeCategory;
  suspectDescription?: string;
  facilityType?: FacilityType;
  severityLevel?: SeverityLevel;
  affectedEquipment?: string;
}
```

#### 4.2.3 Report Response
```typescript
interface ReportResponse {
  reportId: number;
  submittedBy: number;
  submittedByName: string;
  submittedByEmail: string;
  title: string;
  description: string;
  location: string;
  status: ReportStatus;
  type: ReportType;
  attachmentPaths: string[];
  submittedAt: Date;
  updatedAt: Date;
  
  // Crime-specific fields (if type === 'CRIME')
  crimeCategory?: CrimeCategory;
  suspectDescription?: string;
  victimInvolved?: string;
  injuryLevel?: SeverityLevel;
  weaponInvolved?: string;
  evidenceDetails?: string;
  
  // Facility-specific fields (if type === 'FACILITY')
  facilityType?: FacilityType;
  severityLevel?: SeverityLevel;
  affectedEquipment?: string;
  
  // Assignment info (if assigned)
  assignedTo?: {
    accountId: number;
    name: string;
    role: Role;
  }[];
}
```

---

### 4.3 Announcement Payloads

#### 4.3.1 Create Announcement Request
```typescript
interface CreateAnnouncementRequest {
  title: string;                      // 5-200 characters
  message: string;                    // 10-5000 characters
  audience: AnnouncementAudience;
  type: AnnouncementType;
  priority: AnnouncementPriority;
  status?: AnnouncementStatus;        // Defaults to 'PUBLISHED'
  startDate: Date | string;           // ISO 8601 format
  endDate: Date | string;             // ISO 8601 format
  photo?: File;                       // Optional photo upload
}
```

#### 4.3.2 Announcement Response
```typescript
interface AnnouncementResponse {
  announcementId: number;
  createdBy: number;
  createdByName: string;
  title: string;
  message: string;
  audience: AnnouncementAudience;
  type: AnnouncementType;
  priority: AnnouncementPriority;
  status: AnnouncementStatus;
  photoPath?: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

---

### 4.4 Emergency Contact Payloads

#### 4.4.1 Create Emergency Contact Request
```typescript
interface CreateEmergencyContactRequest {
  name: string;                  // 3-200 characters
  address: string;               // 10-500 characters
  phone: string;                 // 10-20 characters
  email?: string;
  state: MalaysianState;
  type: EmergencyServiceType;
  hotline?: string;
  
  // Police-specific fields
  campus?: UiTMCampus;
  operatingHours?: string;
}
```

#### 4.4.2 Emergency Contact Response
```typescript
interface EmergencyContactResponse {
  emergencyId: number;
  name: string;
  address: string;
  phone: string;
  email?: string;
  state: MalaysianState;
  type: EmergencyServiceType;
  hotline?: string;
  campus?: UiTMCampus;          // Only for police
  operatingHours?: string;      // Only for police
  createdAt: Date;
  updatedAt: Date;
}
```

---

### 4.5 Generic API Response Wrapper

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any[];
  };
  timestamp: Date;
  path?: string;
}

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  timestamp: Date;
}
```

---

## 5. Database Constraints

### 5.1 Primary Keys
All entities have auto-incrementing primary keys:
- `ACCOUNT_ID` (via `account_seq`)
- `REPORT_ID` (via `report_seq`)
- `ANNOUNCEMENT_ID` (via `announcement_seq`)
- `ASSIGNMENT_ID` (via `assignment_seq`)
- `EMERGENCY_ID` (via `emergency_seq`)
- `GENERATE_ID` (via `generate_seq`)
- `RESOLUTION_ID` (via `resolution_seq`)

### 5.2 Foreign Key Constraints

| Child Table | Child Column | Parent Table | Parent Column | On Delete |
|-------------|--------------|--------------|---------------|-----------|
| STUDENT | ACCOUNT_ID | ACCOUNT | ACCOUNT_ID | CASCADE |
| STAFF | ACCOUNT_ID | ACCOUNT | ACCOUNT_ID | CASCADE |
| STAFF | SUPERVISOR_ID | STAFF | ACCOUNT_ID | SET NULL |
| REPORT | SUBMITTED_BY | ACCOUNT | ACCOUNT_ID | CASCADE |
| CRIME | REPORT_ID | REPORT | REPORT_ID | CASCADE |
| FACILITY | REPORT_ID | REPORT | REPORT_ID | CASCADE |
| REPORT_ASSIGNMENT | ACCOUNT_ID | ACCOUNT | ACCOUNT_ID | CASCADE |
| REPORT_ASSIGNMENT | REPORT_ID | REPORT | REPORT_ID | CASCADE |
| ANNOUNCEMENT | CREATED_BY | ACCOUNT | ACCOUNT_ID | CASCADE |
| UITM_AUXILIARY_POLICE | EMERGENCY_ID | EMERGENCY_INFO | EMERGENCY_ID | CASCADE |
| GENERATED_REPORT | GENERATED_BY | ACCOUNT | ACCOUNT_ID | CASCADE |
| RESOLUTION | REPORT_ID | REPORT | REPORT_ID | CASCADE |
| RESOLUTION | RESOLVED_BY | ACCOUNT | ACCOUNT_ID | CASCADE |

### 5.3 Unique Constraints

| Table | Column(s) | Constraint Name |
|-------|-----------|----------------|
| ACCOUNT | EMAIL | uq_account_email |
| STUDENT | STUDENT_ID | (unique index) |
| STAFF | STAFF_ID | (unique index) |
| PASSWORD_RESET_TOKENS | EMAIL | idx_prt_email |
| PASSWORD_RESET_TOKENS | TOKEN_HASH | idx_prt_token |

### 5.4 Check Constraints

| Table | Constraint | Rule |
|-------|------------|------|
| ACCOUNT | ACCOUNT_TYPE | IN ('STUDENT', 'STAFF') |
| STAFF | ROLE | IN ('STAFF', 'SUPERVISOR', 'ADMIN', 'SUPERADMIN') |
| REPORT | STATUS | IN ('PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED') |
| REPORT | TYPE | IN ('CRIME', 'FACILITY') |
| CRIME | CRIME_CATEGORY | IN ('THEFT', 'ASSAULT', 'VANDALISM', 'HARASSMENT', 'OTHER') |
| FACILITY | FACILITY_TYPE | IN ('ELECTRICAL', 'PLUMBING', 'FURNITURE', 'INFRASTRUCTURE', 'OTHER') |
| FACILITY | SEVERITY_LEVEL | IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') |
| EMERGENCY_INFO | TYPE | IN ('Police', 'Fire', 'Medical', 'Civil Defence') |
| ANNOUNCEMENT | AUDIENCE | IN ('ALL', 'STUDENTS', 'STAFF', 'ADMIN') |
| ANNOUNCEMENT | TYPE | IN ('GENERAL', 'EMERGENCY', 'EVENT') |
| ANNOUNCEMENT | PRIORITY | IN ('LOW', 'MEDIUM', 'HIGH') |
| ANNOUNCEMENT | STATUS | IN ('DRAFT', 'PUBLISHED', 'ARCHIVED') |
| ANNOUNCEMENT | Dates | END_DATE >= START_DATE |
| GENERATED_REPORT | REPORT_CATEGORY | IN ('CRIME', 'FACILITY', 'USER', 'ALL REPORTS') |
| GENERATED_REPORT | REPORT_DATA_TYPE | IN ('JSON', 'SUMMARY', 'DETAILED') |
| GENERATED_REPORT | Dates | DATE_RANGE_END >= DATE_RANGE_START |
| RESOLUTION | RESOLUTION_TYPE | IN ('RESOLVED', 'ESCALATED', 'DISMISSED', 'TRANSFERRED') |
| PASSWORD_RESET_TOKENS | USED | IN (0, 1) |

---

## 6. Data Validation Rules

### 6.1 String Validation

| Field Type | Min Length | Max Length | Pattern/Format |
|------------|-----------|------------|----------------|
| Name | 2 | 100 | Letters, spaces, hyphens |
| Email | 5 | 100 | Valid email format (RFC 5322) |
| Password | 8 | 128 | Min 1 uppercase, 1 lowercase, 1 number |
| Phone | 10 | 20 | Digits, +, -, spaces allowed |
| Title | 5 | 200 | Any printable characters |
| Description | 10 | 5000 | Any printable characters |
| Location | 3 | 200 | Any printable characters |
| URL | 10 | 500 | Valid URL format (http/https) |

### 6.2 Numeric Validation

| Field | Min | Max | Type |
|-------|-----|-----|------|
| ACCOUNT_ID | 1000 | 2147483647 | Integer |
| REPORT_ID | 1000 | 2147483647 | Integer |
| SEMESTER | 1 | 14 | Integer |
| YEAR_OF_STUDY | 1 | 7 | Integer |

### 6.3 Date Validation

- All dates must be valid ISO 8601 format
- `START_DATE` must be <= `END_DATE`
- `DATE_RANGE_START` must be <= `DATE_RANGE_END`
- Future dates allowed for `END_DATE` in announcements
- Past dates required for `SUBMITTED_AT` in reports

### 6.4 File Upload Validation

| Property | Constraint |
|----------|------------|
| Max File Size | 10 MB per file |
| Allowed Types | image/*, application/pdf, .doc, .docx |
| Max Files | 5 per report |
| File Name Length | Max 255 characters |
| Storage Path | /public/uploads/{year}/{month}/ |

---

## 7. Data Integrity Rules

### 7.1 Entity Integrity
- All tables have primary keys
- Primary keys are auto-generated via sequences
- No NULL values allowed in primary keys

### 7.2 Referential Integrity
- All foreign keys reference valid parent records
- Cascade deletes for dependent records (reports, assignments)
- Prevent orphaned records through constraints

### 7.3 Domain Integrity
- Enum values enforced via CHECK constraints
- Data types validated at database and application level
- Range constraints for numeric fields

### 7.4 Business Rules
1. Students can only view/edit their own reports
2. Staff can view all reports, edit assigned reports
3. Supervisors can assign reports to staff
4. Admins can create announcements
5. Only staff with ADMIN role can manage emergency contacts
6. Report status transitions must follow valid flow
7. Announcements must have END_DATE >= START_DATE
8. Cannot delete reports with existing resolutions

---

## 8. Data Access Patterns

### 8.1 Common Queries

#### Get User Reports
```sql
SELECT r.*, c.CRIME_CATEGORY, f.FACILITY_TYPE
FROM REPORT r
LEFT JOIN CRIME c ON r.REPORT_ID = c.REPORT_ID
LEFT JOIN FACILITY f ON r.REPORT_ID = f.REPORT_ID
WHERE r.SUBMITTED_BY = :userId
ORDER BY r.SUBMITTED_AT DESC;
```

#### Get Active Announcements for Audience
```sql
SELECT a.*, acc.NAME as CREATED_BY_NAME
FROM ANNOUNCEMENT a
JOIN ACCOUNT acc ON a.CREATED_BY = acc.ACCOUNT_ID
WHERE a.STATUS = 'PUBLISHED'
  AND (a.AUDIENCE = :audience OR a.AUDIENCE = 'ALL')
  AND SYSDATE BETWEEN a.START_DATE AND a.END_DATE
ORDER BY a.PRIORITY DESC, a.START_DATE DESC;
```

#### Get Reports by Status
```sql
SELECT r.*, acc.NAME as SUBMITTED_BY_NAME,
       COUNT(ra.ASSIGNMENT_ID) as ASSIGNMENT_COUNT
FROM REPORT r
JOIN ACCOUNT acc ON r.SUBMITTED_BY = acc.ACCOUNT_ID
LEFT JOIN REPORT_ASSIGNMENT ra ON r.REPORT_ID = ra.REPORT_ID
WHERE r.STATUS = :status
GROUP BY r.REPORT_ID, acc.NAME
ORDER BY r.SUBMITTED_AT DESC;
```

#### Get Emergency Contacts by State
```sql
SELECT * FROM EMERGENCY_INFO
WHERE STATE = :state
ORDER BY TYPE, NAME;
```

---

## 9. Data Migration and Seeding

### 9.1 Initial Data Requirements

**Admin Account:**
```sql
INSERT INTO ACCOUNT (NAME, EMAIL, PASSWORD_HASH, ACCOUNT_TYPE)
VALUES ('System Admin', 'admin@cybercrime.platform', :hashedPassword, 'STAFF');

INSERT INTO STAFF (ACCOUNT_ID, STAFF_ID, ROLE, DEPARTMENT, POSITION)
VALUES (:accountId, 'STAFF001', 'SUPERADMIN', 'IT', 'System Administrator');
```

**Emergency Contacts:** Seed with national emergency numbers (999, 991, etc.)

---

## 10. Data Security

### 10.1 Sensitive Data
- `PASSWORD_HASH`: Never returned in API responses
- `TOKEN_HASH`: Stored securely, never exposed
- Personal data (email, phone): Access controlled by role

### 10.2 Data Encryption
- Passwords: bcrypt (10 rounds)
- JWT tokens: HS256 signing
- Database connections: SSL/TLS (production)

### 10.3 Data Masking
Email addresses in logs: `u***@example.com`
Phone numbers in logs: `+60***1234`

---

## 11. Revision History

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | 2026-01-04 | AI Assistant | Initial CSCI Data document |

---

**End of CSCI Data Structures Document**
