# CSCI Interfaces
## Cybercrime Awareness and Reporting Platform (CARP)

**Document Version:** 1.0  
**Date:** January 5, 2026  
**Project:** Cybercrime Platform - Interface Specification

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Interface Overview](#2-interface-overview)
3. [Internal CSC Interfaces](#3-internal-csc-interfaces)
4. [External System Interfaces](#4-external-system-interfaces)
5. [Database Interfaces](#5-database-interfaces)
6. [API Interface Specifications](#6-api-interface-specifications)
7. [Data Formats](#7-data-formats)
8. [Error Handling](#8-error-handling)

---

## 1. Introduction

### 1.1 Purpose

This document specifies all interfaces used in the Cybercrime Awareness and Reporting Platform (CARP), including:
- Internal CSC-to-CSC interfaces
- External system interfaces
- Database interfaces
- RESTful API specifications
- Data format standards
- Error handling protocols

### 1.2 Scope

The interface specifications cover:
- HTTP REST API endpoints
- Database connection protocols
- Email service integration
- File system interfaces
- Authentication and authorization protocols
- Data serialization formats

### 1.3 Reference Documents

- [CSCI_ARCHITECTURE.md](./CSCI_ARCHITECTURE.md) - System architecture
- [CSCI_DATA.md](./CSCI_DATA.md) - Data structures
- [CSCI_STATE_ORGANIZATION.md](./CSCI_STATE_ORGANIZATION.md) - State management
- [API_ROUTES.md](./API_ROUTES.md) - Detailed API documentation

---

## 2. Interface Overview

### 2.1 Interface Categories

```
┌─────────────────────────────────────────────────────────┐
│                  EXTERNAL INTERFACES                    │
│  - Client Browser (HTTP/HTTPS)                         │
│  - Email Service (SMTP)                                │
│  - File System (Local Storage)                         │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                  INTERNAL INTERFACES                    │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Controller ↔ Service Interface                  │  │
│  │  Service ↔ Repository Interface                  │  │
│  │  Repository ↔ Model Interface                    │  │
│  │  Middleware ↔ Controller Interface               │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                  DATABASE INTERFACE                     │
│  - Oracle Database 21c (OracleDB Driver)               │
│  - Connection Pool Management                          │
│  - SQL Statement Execution                             │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Communication Protocols

| Interface Type | Protocol | Port | Format | Security |
|---------------|----------|------|--------|----------|
| Frontend ↔ API | HTTP/HTTPS | 4000 | JSON | JWT Bearer Token |
| API ↔ Database | Oracle Net | 1521 | SQL | Username/Password |
| API ↔ Email | SMTP | 587 | MIME | TLS |
| API ↔ File System | File I/O | N/A | Binary | OS Permissions |

---

## 3. Internal CSC Interfaces

### 3.1 Controller-Service Interface

**Purpose:** Controllers invoke service methods to execute business logic.

**Interface Pattern:**
```typescript
interface IServiceRequest<T> {
  userId: number;
  userRole: Role;
  data: T;
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    timestamp: Date;
  };
}

interface IServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    processingTime: number;
    timestamp: Date;
  };
}
```

**Example Usage:**
```typescript
// ReportController → ReportService
class ReportController {
  async createReport(req: Request, res: Response) {
    const serviceRequest: IServiceRequest<ReportData> = {
      userId: req.user.accountId,
      userRole: req.user.role,
      data: req.body,
      metadata: {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        timestamp: new Date()
      }
    };
    
    const result = await this.reportService.createReport(serviceRequest);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  }
}
```

### 3.2 Service-Repository Interface

**Purpose:** Services call repository methods to access data.

**Interface Pattern:**
```typescript
interface IRepository<T> {
  // Create
  create(entity: T): Promise<T>;
  
  // Read
  findById(id: number): Promise<T | null>;
  findAll(options?: FindOptions): Promise<T[]>;
  findOne(criteria: Partial<T>): Promise<T | null>;
  
  // Update
  update(id: number, data: Partial<T>): Promise<T>;
  
  // Delete
  delete(id: number): Promise<boolean>;
  softDelete(id: number): Promise<boolean>;
  
  // Query
  count(criteria?: Partial<T>): Promise<number>;
  exists(criteria: Partial<T>): Promise<boolean>;
}

interface FindOptions {
  where?: Record<string, any>;
  orderBy?: Array<{ field: string; direction: 'ASC' | 'DESC' }>;
  limit?: number;
  offset?: number;
  include?: string[]; // Related entities to load
}
```

**Example Usage:**
```typescript
// ReportService → ReportRepository
class ReportService {
  async getReportsByStatus(status: ReportStatus, userId: number): Promise<Report[]> {
    const options: FindOptions = {
      where: { STATUS: status, SUBMITTED_BY: userId },
      orderBy: [{ field: 'SUBMITTED_AT', direction: 'DESC' }],
      limit: 50,
      include: ['submittedBy', 'assignments']
    };
    
    return await this.reportRepository.findAll(options);
  }
}
```

### 3.3 Repository-Model Interface

**Purpose:** Repositories create and manipulate model instances.

**Interface Pattern:**
```typescript
interface IModel {
  // Validation
  validate(): void;
  
  // Serialization
  toJSON(): Record<string, any>;
  toDatabase(): Record<string, any>;
  
  // Getters/Setters
  get<T>(key: string): T;
  set(key: string, value: any): void;
  
  // State
  isDirty(): boolean;
  isNew(): boolean;
  getChanges(): Record<string, any>;
}
```

**Example Usage:**
```typescript
// ReportRepository creates Report model
class ReportRepository {
  async create(data: ReportData): Promise<Report> {
    const report = new Report(data); // Model constructor validates
    
    const dbData = report.toDatabase(); // Convert to DB format
    const result = await this.db.execute(
      `INSERT INTO REPORT (TITLE, DESCRIPTION, ...) VALUES (:title, :description, ...)`,
      dbData
    );
    
    report.set('REPORT_ID', result.outBinds.reportId);
    return report;
  }
}
```

### 3.4 Middleware-Controller Interface

**Purpose:** Middleware processes requests before controllers.

**Interface Pattern:**
```typescript
interface IMiddleware {
  (req: Request, res: Response, next: NextFunction): void | Promise<void>;
}

interface AuthenticatedRequest extends Request {
  user?: {
    accountId: number;
    email: string;
    name: string;
    accountType: 'STUDENT' | 'STAFF';
    role?: Role;
  };
  token?: string;
}
```

**Example Middleware Chain:**
```typescript
// Auth Middleware → Permission Middleware → Controller
app.post('/api/reports',
  authMiddleware,           // Validates JWT, populates req.user
  permissionMiddleware(['STUDENT', 'STAFF']), // Checks role
  reportController.create   // Handles request
);
```

---

## 4. External System Interfaces

### 4.1 Frontend-Backend API Interface

**Protocol:** HTTP/HTTPS  
**Port:** 4000  
**Format:** JSON  
**Authentication:** JWT Bearer Token

**Request Format:**
```typescript
interface APIRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  headers: {
    'Content-Type': 'application/json';
    'Authorization': 'Bearer <jwt_token>';
  };
  body?: any; // JSON payload
}
```

**Response Format:**
```typescript
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}
```

**Example Request:**
```http
POST /api/reports HTTP/1.1
Host: localhost:4000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "title": "Phishing Email Attack",
  "description": "Received suspicious email...",
  "location": "Campus A, Building 1",
  "type": "CRIME",
  "crimeCategory": "PHISHING"
}
```

**Example Response:**
```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "success": true,
  "data": {
    "REPORT_ID": 123,
    "TITLE": "Phishing Email Attack",
    "STATUS": "PENDING",
    "SUBMITTED_AT": "2026-01-05T10:30:00Z"
  },
  "timestamp": "2026-01-05T10:30:00.123Z"
}
```

### 4.2 Email Service Interface

**Protocol:** SMTP  
**Port:** 587 (TLS)  
**Library:** nodemailer

**Interface Definition:**
```typescript
interface IEmailService {
  sendEmail(options: EmailOptions): Promise<EmailResult>;
  sendPasswordReset(email: string, resetToken: string): Promise<EmailResult>;
  sendWelcomeEmail(email: string, name: string): Promise<EmailResult>;
  sendReportConfirmation(email: string, reportId: number): Promise<EmailResult>;
}

interface EmailOptions {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    path: string;
  }>;
}

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}
```

**Configuration:**
```typescript
interface SMTPConfig {
  host: string;        // smtp.gmail.com
  port: number;        // 587
  secure: boolean;     // false for TLS
  auth: {
    user: string;      // SMTP username
    pass: string;      // SMTP password
  };
}
```

**Example Usage:**
```typescript
// Send password reset email
const emailService = new EmailService(smtpConfig);

await emailService.sendPasswordReset(
  'student@uitm.edu.my',
  'reset-token-abc123'
);
```

**Email Templates:**
- Location: `/email-templates/`
- Format: HTML
- Variables: Replaced with actual data using template engine
- Templates:
  - `password-reset.html`
  - `auth-confirmation.html`
  - `magic-link.html`

### 4.3 File System Interface

**Purpose:** Store and retrieve uploaded files (evidence, attachments, photos).

**Interface Definition:**
```typescript
interface IFileService {
  uploadFile(file: UploadedFile, folder: string): Promise<FileResult>;
  uploadMultiple(files: UploadedFile[], folder: string): Promise<FileResult[]>;
  deleteFile(path: string): Promise<boolean>;
  getFileUrl(path: string): string;
  validateFile(file: UploadedFile): ValidationResult;
}

interface UploadedFile {
  name: string;
  size: number;
  mimetype: string;
  data: Buffer;
}

interface FileResult {
  success: boolean;
  path?: string;        // Relative path: /uploads/reports/file.jpg
  filename?: string;    // Generated filename
  url?: string;         // Public URL
  size?: number;
  error?: string;
}

interface ValidationResult {
  valid: boolean;
  error?: string;
}
```

**File Storage Structure:**
```
/public/uploads/
├── reports/           # Report evidence files
│   ├── 2026/
│   │   ├── 01/
│   │   │   ├── report_123_file1.jpg
│   │   │   └── report_124_file2.pdf
├── announcements/     # Announcement photos
│   ├── 2026/
│   │   ├── 01/
│   │   │   └── announcement_45.png
└── resolutions/       # Resolution evidence
    ├── 2026/
    │   ├── 01/
    │   │   └── resolution_67.docx
```

**File Constraints:**
- Maximum file size: 10MB per file
- Allowed types: 
  - Images: jpg, jpeg, png, gif
  - Documents: pdf, doc, docx, txt
  - Archives: zip
- Filename format: `{type}_{id}_{timestamp}_{original_name}`
- Storage: Local file system (configurable for cloud)

---

## 5. Database Interfaces

### 5.1 Oracle Database Connection Interface

**Driver:** oracledb (node-oracledb)  
**Protocol:** Oracle Net Services  
**Port:** 1521

**Connection Configuration:**
```typescript
interface DatabaseConfig {
  user: string;              // PDBADMIN
  password: string;          // PDBADMIN
  connectString: string;     // localhost:1521/CYBERCRIME
  poolMin: number;           // 2
  poolMax: number;           // 20
  poolIncrement: number;     // 1
  poolTimeout: number;       // 60 seconds
  queueTimeout: number;      // 60000 ms
  enableStatistics: boolean; // true
}
```

**Connection Pool Interface:**
```typescript
interface IConnectionPool {
  getConnection(): Promise<IConnection>;
  close(): Promise<void>;
  getStatistics(): PoolStatistics;
}

interface IConnection {
  execute(sql: string, binds?: any[], options?: ExecuteOptions): Promise<Result>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  close(): Promise<void>;
}

interface ExecuteOptions {
  outFormat?: number;        // OBJECT or ARRAY
  autoCommit?: boolean;      // default false
  fetchInfo?: object;        // column type mappings
  resultSet?: boolean;       // return result set
}

interface Result {
  rows?: any[];
  rowsAffected?: number;
  outBinds?: any;
  resultSet?: ResultSet;
  metaData?: Array<{
    name: string;
  }>;
}
```

**Example Usage:**
```typescript
// Get connection from pool
const connection = await pool.getConnection();

try {
  // Execute query
  const result = await connection.execute(
    `SELECT * FROM REPORT WHERE REPORT_ID = :id`,
    [reportId],
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );
  
  await connection.commit();
  return result.rows;
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  await connection.close();
}
```

### 5.2 SQL Interface Patterns

**Query Interface:**
```typescript
interface IQuery {
  select(table: string, columns?: string[]): IQuery;
  where(condition: string, binds?: any[]): IQuery;
  join(table: string, condition: string): IQuery;
  orderBy(column: string, direction: 'ASC' | 'DESC'): IQuery;
  limit(count: number): IQuery;
  offset(count: number): IQuery;
  build(): { sql: string; binds: any[] };
  execute(): Promise<any[]>;
}
```

**Example Queries:**

**1. Select with Join:**
```sql
SELECT 
  r.REPORT_ID,
  r.TITLE,
  r.STATUS,
  r.SUBMITTED_AT,
  a.NAME as SUBMITTED_BY_NAME,
  a.EMAIL as SUBMITTED_BY_EMAIL
FROM REPORT r
JOIN ACCOUNT a ON r.SUBMITTED_BY = a.ACCOUNT_ID
WHERE r.STATUS = :status
ORDER BY r.SUBMITTED_AT DESC
```

**2. Insert with Returning:**
```sql
INSERT INTO REPORT (
  SUBMITTED_BY, TITLE, DESCRIPTION, LOCATION, TYPE, STATUS
) VALUES (
  :submittedBy, :title, :description, :location, :type, :status
) RETURNING REPORT_ID INTO :reportId
```

**3. Update:**
```sql
UPDATE REPORT
SET STATUS = :status,
    UPDATED_AT = SYSTIMESTAMP
WHERE REPORT_ID = :reportId
```

**4. Delete (Soft Delete):**
```sql
UPDATE REPORT
SET DELETED_AT = SYSTIMESTAMP,
    UPDATED_AT = SYSTIMESTAMP
WHERE REPORT_ID = :reportId
```

### 5.3 Transaction Interface

**Transaction Pattern:**
```typescript
interface ITransaction {
  begin(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  execute(sql: string, binds?: any[]): Promise<Result>;
}
```

**Example Transaction:**
```typescript
async function createReportWithCrime(reportData: ReportData, crimeData: CrimeData) {
  const connection = await pool.getConnection();
  
  try {
    // Start transaction
    await connection.execute('BEGIN NULL; END;'); // Explicit begin
    
    // Insert report
    const reportResult = await connection.execute(
      `INSERT INTO REPORT (...) VALUES (...) RETURNING REPORT_ID INTO :reportId`,
      reportData,
      { autoCommit: false }
    );
    
    const reportId = reportResult.outBinds.reportId;
    
    // Insert crime with same report ID
    crimeData.REPORT_ID = reportId;
    await connection.execute(
      `INSERT INTO CRIME (...) VALUES (...)`,
      crimeData,
      { autoCommit: false }
    );
    
    // Commit transaction
    await connection.commit();
    
    return reportId;
  } catch (error) {
    // Rollback on error
    await connection.rollback();
    throw error;
  } finally {
    await connection.close();
  }
}
```

---

## 6. API Interface Specifications

### 6.1 Authentication Endpoints

#### 6.1.1 POST /api/auth/login

**Description:** Authenticate user and receive JWT token.

**Request:**
```typescript
interface LoginRequest {
  email: string;
  password: string;
}
```

**Response:**
```typescript
interface LoginResponse {
  success: boolean;
  data?: {
    token: string;
    expiresIn: string;
    user: {
      accountId: number;
      email: string;
      name: string;
      accountType: 'STUDENT' | 'STAFF';
      role?: Role;
    };
  };
  error?: string;
}
```

**Example:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "student@uitm.edu.my",
  "password": "SecurePass123"
}

---

200 OK
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "7d",
    "user": {
      "accountId": 42,
      "email": "student@uitm.edu.my",
      "name": "Ahmad bin Ali",
      "accountType": "STUDENT"
    }
  }
}
```

#### 6.1.2 POST /api/auth/register

**Description:** Register new user account.

**Request:**
```typescript
interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  contactNumber?: string;
  accountType: 'STUDENT' | 'STAFF';
  // Student-specific
  studentId?: string;
  program?: string;
  semester?: number;
  yearOfStudy?: number;
  // Staff-specific
  staffId?: string;
  role?: Role;
  department?: string;
  position?: string;
}
```

**Response:**
```typescript
interface RegisterResponse {
  success: boolean;
  data?: {
    accountId: number;
    message: string;
  };
  error?: string;
}
```

#### 6.1.3 POST /api/auth/forgot-password

**Description:** Request password reset token.

**Request:**
```typescript
interface ForgotPasswordRequest {
  email: string;
}
```

**Response:**
```typescript
interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}
```

#### 6.1.4 POST /api/auth/reset-password

**Description:** Reset password with token.

**Request:**
```typescript
interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}
```

**Response:**
```typescript
interface ResetPasswordResponse {
  success: boolean;
  message: string;
}
```

### 6.2 Report Management Endpoints

#### 6.2.1 POST /api/reports

**Description:** Create new report.

**Authentication:** Required (JWT)

**Request:**
```typescript
interface CreateReportRequest {
  title: string;
  description: string;
  location: string;
  type: 'CRIME';
  attachments?: File[]; // Multipart form data
}
```

**Response:**
```typescript
interface CreateReportResponse {
  success: boolean;
  data?: {
    REPORT_ID: number;
    TITLE: string;
    STATUS: string;
    SUBMITTED_AT: string;
  };
  error?: string;
}
```

#### 6.2.2 GET /api/reports

**Description:** List all reports (filtered by user permissions).

**Authentication:** Required

**Query Parameters:**
```typescript
interface ReportListQuery {
  status?: ReportStatus;
  type?: 'CRIME';
  submittedBy?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  startDate?: string; // ISO date
  endDate?: string;   // ISO date
}
```

**Response:**
```typescript
interface ReportListResponse {
  success: boolean;
  data?: {
    reports: Report[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  error?: string;
}
```

#### 6.2.3 GET /api/reports/:id

**Description:** Get single report details.

**Authentication:** Required

**Response:**
```typescript
interface ReportDetailsResponse {
  success: boolean;
  data?: {
    report: Report;
    submittedBy: Account;
    assignments?: Assignment[];
    resolution?: Resolution;
    crime?: Crime;
  };
  error?: string;
}
```

#### 6.2.4 PUT /api/reports/:id

**Description:** Update report.

**Authentication:** Required (Owner or Staff)

**Request:**
```typescript
interface UpdateReportRequest {
  title?: string;
  description?: string;
  location?: string;
}
```

**Response:**
```typescript
interface UpdateReportResponse {
  success: boolean;
  data?: Report;
  error?: string;
}
```

#### 6.2.5 PUT /api/reports/:id/status

**Description:** Update report status.

**Authentication:** Required (Staff only)

**Request:**
```typescript
interface UpdateStatusRequest {
  status: ReportStatus;
  reason?: string;
}
```

**Response:**
```typescript
interface UpdateStatusResponse {
  success: boolean;
  data?: {
    REPORT_ID: number;
    STATUS: string;
    UPDATED_AT: string;
  };
  error?: string;
}
```

### 6.3 Crime Management Endpoints

#### 6.3.1 POST /api/crimes

**Description:** Create crime report.

**Authentication:** Required

**Request:**
```typescript
interface CreateCrimeRequest extends CreateReportRequest {
  crimeCategory: CrimeCategory;
  suspectDescription?: string;
  victimInvolved?: string;
  injuryLevel?: SeverityLevel;
  weaponInvolved?: string;
  evidenceDetails?: string;
}
```

**Response:**
```typescript
interface CreateCrimeResponse {
  success: boolean;
  data?: {
    REPORT_ID: number;
    CRIME_CATEGORY: string;
    STATUS: string;
  };
  error?: string;
}
```

#### 6.3.2 GET /api/crimes

**Description:** List crime reports.

**Authentication:** Required

**Query Parameters:**
```typescript
interface CrimeListQuery extends ReportListQuery {
  category?: CrimeCategory;
  injuryLevel?: SeverityLevel;
}
```

#### 6.3.3 GET /api/crimes/statistics

**Description:** Get crime statistics.

**Authentication:** Required (Staff)

**Query Parameters:**
```typescript
interface CrimeStatsQuery {
  startDate?: string;
  endDate?: string;
  groupBy?: 'category' | 'status' | 'month';
}
```

**Response:**
```typescript
interface CrimeStatsResponse {
  success: boolean;
  data?: {
    totalCrimes: number;
    byCategory: Record<CrimeCategory, number>;
    byStatus: Record<ReportStatus, number>;
    trends?: Array<{
      period: string;
      count: number;
    }>;
  };
}
```

### 6.4 Announcement Endpoints

#### 6.4.1 POST /api/announcements

**Description:** Create announcement.

**Authentication:** Required (Admin only)

**Request:**
```typescript
interface CreateAnnouncementRequest {
  title: string;
  message: string;
  audience: AnnouncementAudience;
  type: AnnouncementType;
  priority: AnnouncementPriority;
  startDate: string;
  endDate: string;
  photo?: File; // Multipart form data
}
```

#### 6.4.2 GET /api/announcements

**Description:** List announcements.

**Authentication:** Required

**Query Parameters:**
```typescript
interface AnnouncementListQuery {
  audience?: AnnouncementAudience;
  type?: AnnouncementType;
  priority?: AnnouncementPriority;
  status?: AnnouncementStatus;
  activeOnly?: boolean; // Filter by current date
}
```

#### 6.4.3 GET /api/announcements/active

**Description:** Get currently active announcements for user.

**Authentication:** Required

**Response:**
```typescript
interface ActiveAnnouncementsResponse {
  success: boolean;
  data?: {
    urgent: Announcement[];
    high: Announcement[];
    normal: Announcement[];
  };
}
```

### 6.5 Emergency Services Endpoints

#### 6.5.1 GET /api/emergency

**Description:** List emergency contacts.

**Authentication:** Optional (Public)

**Query Parameters:**
```typescript
interface EmergencyListQuery {
  state?: MalaysianState;
  type?: EmergencyServiceType;
}
```

**Response:**
```typescript
interface EmergencyListResponse {
  success: boolean;
  data?: EmergencyContact[];
}
```

#### 6.5.2 GET /api/police

**Description:** List UiTM Auxiliary Police contacts.

**Authentication:** Optional (Public)

**Query Parameters:**
```typescript
interface PoliceListQuery {
  campus?: UiTMCampus;
  state?: MalaysianState;
}
```

### 6.6 Assignment Endpoints

#### 6.6.1 POST /api/assignments

**Description:** Assign report to staff.

**Authentication:** Required (Supervisor/Admin)

**Request:**
```typescript
interface CreateAssignmentRequest {
  reportId: number;
  accountId: number; // Staff to assign to
}
```

#### 6.6.2 GET /api/assignments/staff/:staffId

**Description:** Get assignments for specific staff.

**Authentication:** Required

**Response:**
```typescript
interface StaffAssignmentsResponse {
  success: boolean;
  data?: {
    pending: Assignment[];
    inProgress: Assignment[];
    completed: Assignment[];
  };
}
```

#### 6.6.3 PUT /api/assignments/:id

**Description:** Update assignment.

**Authentication:** Required (Assigned staff)

**Request:**
```typescript
interface UpdateAssignmentRequest {
  actionTaken?: string;
  additionalFeedback?: string;
  status?: AssignmentStatus;
}
```

### 6.7 Resolution Endpoints

#### 6.7.1 POST /api/resolutions

**Description:** Create resolution for report.

**Authentication:** Required (Staff)

**Request:**
```typescript
interface CreateResolutionRequest {
  reportId: number;
  resolutionType: ResolutionType;
  resolutionSummary: string;
  evidencePath?: string;
}
```

#### 6.7.2 GET /api/resolutions/report/:reportId

**Description:** Get resolution for specific report.

**Authentication:** Required

**Response:**
```typescript
interface ResolutionResponse {
  success: boolean;
  data?: Resolution;
}
```

### 6.8 Dashboard/Analytics Endpoints

#### 6.8.1 GET /api/dashboard/statistics

**Description:** Get dashboard statistics.

**Authentication:** Required (Staff)

**Response:**
```typescript
interface DashboardStatsResponse {
  success: boolean;
  data?: {
    reports: {
      total: number;
      pending: number;
      inReview: number;
      underInvestigation: number;
      resolved: number;
    };
    crimes: {
      total: number;
      byCategory: Record<CrimeCategory, number>;
    };
    assignments: {
      active: number;
      completed: number;
    };
    recentActivity: Array<{
      type: string;
      description: string;
      timestamp: string;
    }>;
  };
}
```

#### 6.8.2 GET /api/dashboard/trends

**Description:** Get trend analysis.

**Authentication:** Required (Supervisor/Admin)

**Query Parameters:**
```typescript
interface TrendsQuery {
  period: 'week' | 'month' | 'quarter' | 'year';
  metric: 'reports' | 'crimes' | 'resolutions';
}
```

---

## 7. Data Formats

### 7.1 Date/Time Format

**Standard:** ISO 8601  
**Format:** `YYYY-MM-DDTHH:mm:ss.sssZ`  
**Timezone:** UTC

**Examples:**
```
2026-01-05T10:30:00.000Z
2026-01-05T14:45:30.123Z
```

### 7.2 JSON Data Format

**Content-Type:** `application/json`  
**Encoding:** UTF-8

**Standard Structure:**
```json
{
  "success": true,
  "data": { /* response data */ },
  "timestamp": "2026-01-05T10:30:00.000Z"
}
```

### 7.3 Multipart Form Data

**Content-Type:** `multipart/form-data`

**Usage:** File uploads with metadata

**Example:**
```
POST /api/reports
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="title"

Phishing Attack
------WebKitFormBoundary
Content-Disposition: form-data; name="description"

Received suspicious email...
------WebKitFormBoundary
Content-Disposition: form-data; name="attachment"; filename="evidence.jpg"
Content-Type: image/jpeg

[binary data]
------WebKitFormBoundary--
```

### 7.4 Enumeration Values

**Report Status:**
```typescript
type ReportStatus = 'PENDING' | 'IN_REVIEW' | 'UNDER_INVESTIGATION' | 'RESOLVED' | 'DISMISSED';
```

**Crime Category:**
```typescript
type CrimeCategory = 
  | 'PHISHING'
  | 'IDENTITY_THEFT'
  | 'ONLINE_FRAUD'
  | 'CYBERBULLYING'
  | 'DATA_BREACH'
  | 'MALWARE_ATTACK'
  | 'SOCIAL_ENGINEERING'
  | 'UNAUTHORIZED_ACCESS'
  | 'OTHER';
```

**User Roles:**
```typescript
type Role = 'STUDENT' | 'STAFF' | 'SUPERVISOR' | 'ADMIN' | 'SUPERADMIN';
```

**Announcement Audience:**
```typescript
type AnnouncementAudience = 'STUDENT' | 'STAFF' | 'ALL';
```

---

## 8. Error Handling

### 8.1 Error Response Format

**Standard Error Response:**
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}
```

**Example:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "title": "Title must be at least 5 characters",
      "email": "Invalid email format"
    }
  },
  "timestamp": "2026-01-05T10:30:00.000Z"
}
```

### 8.2 HTTP Status Codes

| Status Code | Meaning | Usage |
|-------------|---------|-------|
| 200 OK | Success | Successful GET, PUT requests |
| 201 Created | Resource created | Successful POST requests |
| 204 No Content | Success, no data | Successful DELETE requests |
| 400 Bad Request | Invalid input | Validation errors |
| 401 Unauthorized | Not authenticated | Missing or invalid token |
| 403 Forbidden | Not authorized | Insufficient permissions |
| 404 Not Found | Resource not found | Invalid ID or route |
| 409 Conflict | Duplicate resource | Email already exists |
| 422 Unprocessable Entity | Business rule violation | Invalid state transition |
| 429 Too Many Requests | Rate limit exceeded | Too many API calls |
| 500 Internal Server Error | Server error | Unexpected errors |
| 503 Service Unavailable | Maintenance mode | System maintenance |

### 8.3 Error Codes

**Authentication Errors:**
- `AUTH_INVALID_CREDENTIALS` - Wrong email/password
- `AUTH_TOKEN_EXPIRED` - JWT token expired
- `AUTH_TOKEN_INVALID` - Invalid JWT token
- `AUTH_REQUIRED` - Authentication required

**Authorization Errors:**
- `PERMISSION_DENIED` - Insufficient permissions
- `ROLE_REQUIRED` - Specific role required

**Validation Errors:**
- `VALIDATION_ERROR` - Input validation failed
- `INVALID_FORMAT` - Invalid data format
- `REQUIRED_FIELD` - Required field missing
- `INVALID_ENUM` - Invalid enum value

**Resource Errors:**
- `NOT_FOUND` - Resource not found
- `ALREADY_EXISTS` - Duplicate resource
- `CONFLICT` - Resource conflict

**Business Logic Errors:**
- `INVALID_STATE_TRANSITION` - Cannot change state
- `OPERATION_NOT_ALLOWED` - Operation not permitted
- `QUOTA_EXCEEDED` - Limit exceeded

**System Errors:**
- `DATABASE_ERROR` - Database operation failed
- `EMAIL_ERROR` - Email sending failed
- `FILE_UPLOAD_ERROR` - File upload failed
- `INTERNAL_ERROR` - Unexpected server error

### 8.4 Error Handling Pattern

**Try-Catch Pattern:**
```typescript
try {
  // Operation
  const result = await service.createReport(data);
  res.status(201).json({ success: true, data: result });
} catch (error) {
  if (error instanceof ValidationError) {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: error.message,
        details: error.details
      }
    });
  } else if (error instanceof NotFoundError) {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: error.message
      }
    });
  } else {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred'
      }
    });
  }
}
```

---

## 9. Security Considerations

### 9.1 Authentication Security

**JWT Token:**
- Algorithm: HS256
- Secret: Environment variable (not in code)
- Expiration: 7 days
- Refresh: Not implemented (re-login required)

**Password Security:**
- Algorithm: bcrypt
- Salt rounds: 10
- Minimum length: 8 characters
- Must include: uppercase, lowercase, number

### 9.2 API Security

**CORS Configuration:**
- Allowed origins: Configured in environment
- Credentials: true
- Methods: GET, POST, PUT, DELETE
- Headers: Content-Type, Authorization

**Rate Limiting:**
- Per user: 100 requests/minute
- Per IP: 1000 requests/hour
- Login attempts: 5 per 15 minutes

**Input Validation:**
- Schema validation using Zod
- SQL injection prevention via parameterized queries
- XSS prevention via sanitization
- File type validation
- File size limits

### 9.3 Data Protection

**Sensitive Data:**
- Passwords: Never returned in API responses
- Tokens: Stored securely in httpOnly cookies
- Personal data: Masked in logs
- Database: Connection string in environment

**HTTPS/TLS:**
- Required in production
- TLS 1.2 or higher
- Certificate validation

---

**Document End**
