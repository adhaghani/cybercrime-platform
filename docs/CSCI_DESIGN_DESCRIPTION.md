# CSCI Design Description
## Cybercrime Awareness and Reporting Platform (CARP)

**Document Version:** 1.0  
**Date:** January 4, 2026  
**Project:** Cybercrime Platform - Design Architecture

---

## 1. Design Overview

### 1.1 Architectural Pattern
The system implements a **Three-Tier Architecture** with **Object-Oriented Programming (OOP)** principles:

```
┌─────────────────────────────────────────────┐
│         PRESENTATION TIER                   │
│  (Next.js 15 + React 19 + TypeScript)      │
│  - User Interface Components                │
│  - Client-Side State Management             │
│  - Form Validation & Error Handling         │
└──────────────────┬──────────────────────────┘
                   │ HTTPS/REST API
┌──────────────────▼──────────────────────────┐
│         APPLICATION TIER                    │
│  (Node.js + Express + TypeScript)           │
│  ┌────────────────────────────────────┐    │
│  │  Controllers (HTTP Handlers)       │    │
│  └─────────────┬──────────────────────┘    │
│  ┌─────────────▼──────────────────────┐    │
│  │  Services (Business Logic)         │    │
│  └─────────────┬──────────────────────┘    │
│  ┌─────────────▼──────────────────────┐    │
│  │  Repositories (Data Access)        │    │
│  └────────────────────────────────────┘    │
└──────────────────┬──────────────────────────┘
                   │ OracleDB Protocol
┌──────────────────▼──────────────────────────┐
│         DATA TIER                           │
│  (Oracle Database 21c)                      │
│  - Relational Data Storage                  │
│  - Triggers & Constraints                   │
│  - Sequences & Indexes                      │
└─────────────────────────────────────────────┘
```

### 1.2 Design Principles

#### 1.2.1 SOLID Principles
- **Single Responsibility:** Each class has one clear purpose
- **Open/Closed:** Extensible through inheritance (Report → Crime)
- **Liskov Substitution:** Subclasses can replace base classes
- **Interface Segregation:** Specific interfaces for different needs
- **Dependency Inversion:** Depend on abstractions, not concrete implementations

#### 1.2.2 Design Patterns
- **Repository Pattern:** Abstraction layer for data access
- **Service Layer Pattern:** Business logic encapsulation
- **MVC Pattern:** Model-View-Controller separation
- **Middleware Pattern:** Request/response pipeline processing
- **Factory Pattern:** Object creation for models
- **Strategy Pattern:** Different authentication strategies

---

## 2. Component Design

### 2.1 Frontend Components (Presentation Tier)

#### 2.1.1 Page Components
```typescript
app/
├── (landing-page)/
│   ├── page.tsx                    // Home page
│   ├── contact/page.tsx            // Contact information
│   ├── emergency-services/         // Emergency directory
│   └── faq/page.tsx                // Frequently asked questions
├── (protected-routes)/
│   ├── dashboard/                  // User dashboard
│   │   ├── page.tsx
│   │   ├── reports/                // Report management
│   │   ├── announcements/          // View announcements
│   │   └── profile/                // User profile
│   └── (app-guide)/                // Application guides
└── auth/
    ├── login/page.tsx              // Login page
    ├── sign-up/page.tsx            // Registration
    ├── forgot-password/            // Password recovery
    └── reset-password/             // Password reset
```

#### 2.1.2 Reusable UI Components
```typescript
components/
├── ui/                             // Base UI components (shadcn/ui)
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── form.tsx
│   ├── input.tsx
│   ├── select.tsx
│   ├── table.tsx
│   └── toast.tsx
├── auth/                           // Authentication components
│   ├── login-form.tsx
│   ├── register-form.tsx
│   └── protected-route.tsx
├── report/                         // Report-related components
│   ├── report-form.tsx
│   ├── report-card.tsx
│   ├── report-list.tsx
│   └── report-status-badge.tsx
├── announcement/                   // Announcement components
│   ├── announcement-card.tsx
│   ├── announcement-list.tsx
│   └── announcementBadge.tsx
└── dashboard/                      // Dashboard components
    ├── stats-card.tsx
    ├── recent-reports.tsx
    └── activity-feed.tsx
```

#### 2.1.3 Component Communication
- **Props:** Parent-to-child data passing
- **Context API:** Global state (auth, theme)
- **React Hooks:** Local state management
- **Server Actions:** Next.js server-side operations

---

### 2.2 Backend Components (Application Tier)

#### 2.2.1 Layer Architecture

```
┌─────────────────────────────────────────────────────┐
│                    ROUTES LAYER                     │
│  Define HTTP endpoints and route to controllers    │
└───────────────────────┬─────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────┐
│                 CONTROLLERS LAYER                   │
│  Handle HTTP requests/responses, input validation  │
└───────────────────────┬─────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────┐
│                  SERVICES LAYER                     │
│  Business logic, orchestration, validation         │
└───────────────────────┬─────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────┐
│                REPOSITORIES LAYER                   │
│  Data access, CRUD operations, SQL queries         │
└───────────────────────┬─────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────┐
│                   MODELS LAYER                      │
│  Domain entities with validation and business rules│
└─────────────────────────────────────────────────────┘
```

#### 2.2.2 Module Structure (Example: Report Module)

```typescript
src/
├── models/
│   ├── base/
│   │   └── BaseModel.ts           // Abstract base class
│   ├── Report.ts                  // Report entity
│   ├── Crime.ts                   // Crime (extends Report)
│
├── repositories/
│   ├── ReportRepository.ts        // Report data access
│   ├── CrimeRepository.ts         // Crime data access
│
├── services/
│   ├── ReportService.ts           // Report business logic
│   ├── CrimeService.ts            // Crime business logic
│
├── controllers/
│   ├── ReportController.ts        // Report HTTP handlers
│   ├── CrimeController.ts         // Crime HTTP handlers
├── routes/
│   ├── reportRoutes.ts            // Report endpoints
│   ├── crimeRoutes.ts             // Crime endpoints
│
└── middleware/
    ├── authMiddleware.ts          // JWT authentication
    ├── roleMiddleware.ts          // Role-based access
    └── errorMiddleware.ts         // Error handling
```

---

## 3. Detailed Component Specifications

### 3.1 Model Layer

#### 3.1.1 BaseModel (Abstract Class)
```typescript
export abstract class BaseModel {
  protected data: Record<string, any>;
  
  constructor(data: Record<string, any>, skipValidation = false);
  protected abstract validate(): void;
  protected get<T>(key: string): T;
  protected set(key: string, value: any): void;
  public toJSON(): Record<string, any>;
}
```

**Purpose:** Provides common functionality for all domain models
**Responsibilities:**
- Data encapsulation
- Validation enforcement
- Type-safe getters/setters
- JSON serialization

#### 3.1.2 Report Model
```typescript
export class Report extends BaseModel {
  // Properties
  - REPORT_ID: number
  - SUBMITTED_BY: number
  - TITLE: string
  - DESCRIPTION: string
  - LOCATION: string
  - STATUS: ReportStatus
  - TYPE: ReportType
  - ATTACHMENT_PATH: string[]
  
  // Methods
  + getId(): number
  + getTitle(): string
  + getStatus(): ReportStatus
  + setStatus(status: ReportStatus): void
  + addAttachment(path: string): void
}
```

#### 3.1.3 Crime Model (Inheritance)
```typescript
export class Crime extends Report {
  // Additional Properties
  - CRIME_CATEGORY: CrimeCategory
  - SUSPECT_DESCRIPTION: string
  - VICTIM_INVOLVED: string
  - INJURY_LEVEL: SeverityLevel
  - WEAPON_INVOLVED: string
  - EVIDENCE_DETAILS: string
  
  // Methods
  + getCrimeCategory(): CrimeCategory
  + setSuspectDescription(desc: string): void
}
```

#### 3.1.4 Account Model (Base)
```typescript
export class Account extends BaseModel {
  - ACCOUNT_ID: number
  - NAME: string
  - EMAIL: string
  - PASSWORD_HASH: string
  - ACCOUNT_TYPE: 'STUDENT' | 'STAFF'
  
  + validateEmail(): boolean
  + validatePassword(): boolean
}
```

#### 3.1.5 Student Model (Inheritance)
```typescript
export class Student extends Account {
  - STUDENT_ID: string
  - PROGRAM: string
  - SEMESTER: number
  - YEAR_OF_STUDY: number
}
```

#### 3.1.6 Staff Model (Inheritance)
```typescript
export class Staff extends Account {
  - STAFF_ID: string
  - ROLE: 'STAFF' | 'SUPERVISOR' | 'ADMIN' | 'SUPERADMIN'
  - DEPARTMENT: string
  - POSITION: string
  - SUPERVISOR_ID: number
}
```

---

### 3.2 Repository Layer

#### 3.2.1 Repository Interface Pattern
```typescript
interface IRepository<T> {
  findById(id: number): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(data: T): Promise<T>;
  update(id: number, data: Partial<T>): Promise<T>;
  delete(id: number): Promise<boolean>;
}
```

#### 3.2.2 ReportRepository
```typescript
export class ReportRepository {
  // CRUD Operations
  + async create(report: Report): Promise<Report>
  + async findById(id: number): Promise<Report | null>
  + async findAll(): Promise<Report[]>
  + async findBySubmitter(userId: number): Promise<Report[]>
  + async update(id: number, data: Partial<Report>): Promise<Report>
  + async updateStatus(id: number, status: ReportStatus): Promise<void>
  + async delete(id: number): Promise<boolean>
  
  // Query Methods
  + async findByStatus(status: ReportStatus): Promise<Report[]>
  + async findByDateRange(start: Date, end: Date): Promise<Report[]>
  + async search(query: string): Promise<Report[]>
}
```

#### 3.2.3 CrimeRepository
```typescript
export class CrimeRepository extends ReportRepository {
  + async findByCategory(category: CrimeCategory): Promise<Crime[]>
  + async findBySeverity(level: SeverityLevel): Promise<Crime[]>
  + async getCrimeStatistics(): Promise<CrimeStats>
}
```

#### 3.2.4 AccountRepository
```typescript
export class AccountRepository {
  + async create(account: Account): Promise<Account>
  + async findById(id: number): Promise<Account | null>
  + async findByEmail(email: string): Promise<Account | null>
  + async update(id: number, data: Partial<Account>): Promise<Account>
  + async updatePassword(id: number, hash: string): Promise<void>
  + async verifyCredentials(email: string, password: string): Promise<Account | null>
}
```

---

### 3.3 Service Layer

#### 3.3.1 Service Responsibilities
- Business logic implementation
- Transaction management
- Data validation
- External service integration
- Business rule enforcement

#### 3.3.2 ReportService
```typescript
export class ReportService {
  constructor(
    private reportRepository: ReportRepository,
    private assignmentRepository: ReportAssignmentRepository
  );
  
  // Business Operations
  + async createReport(userId: number, data: ReportData): Promise<Report>
  + async getReportById(id: number, requesterId: number): Promise<Report>
  + async getUserReports(userId: number): Promise<Report[]>
  + async updateReportStatus(
      reportId: number, 
      status: ReportStatus, 
      updatedBy: number
    ): Promise<Report>
  + async assignReport(reportId: number, staffId: number): Promise<void>
  + async deleteReport(id: number, requesterId: number): Promise<boolean>
  
  // Business Logic
  - async validateReportAccess(reportId: number, userId: number): boolean
  - async notifyStatusChange(report: Report): Promise<void>
  - async validateReportData(data: ReportData): void
}
```

#### 3.3.3 AuthService
```typescript
export class AuthService {
  constructor(
    private accountRepository: AccountRepository,
    private studentRepository: StudentRepository,
    private staffRepository: StaffRepository
  );
  
  + async register(userData: RegisterData): Promise<Account>
  + async login(email: string, password: string): Promise<LoginResponse>
  + async verifyToken(token: string): Promise<Account>
  + async refreshToken(refreshToken: string): Promise<string>
  + async requestPasswordReset(email: string): Promise<void>
  + async resetPassword(token: string, newPassword: string): Promise<void>
  
  // Helper Methods
  - async generateJWT(account: Account): Promise<string>
  - async hashPassword(password: string): Promise<string>
  - async comparePassword(plain: string, hash: string): Promise<boolean>
}
```

#### 3.3.4 AnnouncementService
```typescript
export class AnnouncementService {
  + async createAnnouncement(data: AnnouncementData): Promise<Announcement>
  + async getActiveAnnouncements(audience: string): Promise<Announcement[]>
  + async getAnnouncementById(id: number): Promise<Announcement>
  + async updateAnnouncement(id: number, data: Partial<Announcement>): Promise<Announcement>
  + async archiveAnnouncement(id: number): Promise<void>
  + async getAnnouncementsByDateRange(start: Date, end: Date): Promise<Announcement[]>
}
```

#### 3.3.5 EmergencyService
```typescript
export class EmergencyService {
  + async createContact(data: EmergencyContactData): Promise<EmergencyContact>
  + async getAllContacts(): Promise<EmergencyContact[]>
  + async getContactsByState(state: MalaysianState): Promise<EmergencyContact[]>
  + async getContactsByType(type: EmergencyServiceType): Promise<EmergencyContact[]>
  + async updateContact(id: number, data: Partial<EmergencyContact>): Promise<EmergencyContact>
  + async deleteContact(id: number): Promise<boolean>
}
```

---

### 3.4 Controller Layer

#### 3.4.1 Controller Responsibilities
- HTTP request handling
- Input validation
- Response formatting
- Error handling
- Status code management

#### 3.4.2 ReportController
```typescript
export class ReportController {
  constructor(private reportService: ReportService);
  
  // HTTP Handlers
  + async createReport(req: Request, res: Response): Promise<void>
  + async getReportById(req: Request, res: Response): Promise<void>
  + async getUserReports(req: Request, res: Response): Promise<void>
  + async getAllReports(req: Request, res: Response): Promise<void>
  + async updateReport(req: Request, res: Response): Promise<void>
  + async updateReportStatus(req: Request, res: Response): Promise<void>
  + async deleteReport(req: Request, res: Response): Promise<void>
  
  // Response Format
  - formatResponse(data: any, message: string): ResponseObject
  - handleError(error: Error, res: Response): void
}
```

#### 3.4.3 AuthController
```typescript
export class AuthController {
  constructor(private authService: AuthService);
  
  + async register(req: Request, res: Response): Promise<void>
  + async login(req: Request, res: Response): Promise<void>
  + async logout(req: Request, res: Response): Promise<void>
  + async refreshToken(req: Request, res: Response): Promise<void>
  + async getProfile(req: Request, res: Response): Promise<void>
  + async updateProfile(req: Request, res: Response): Promise<void>
  + async requestPasswordReset(req: Request, res: Response): Promise<void>
  + async resetPassword(req: Request, res: Response): Promise<void>
}
```

---

### 3.5 Middleware Components

#### 3.5.1 Authentication Middleware
```typescript
export const authenticate = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  // Extract JWT from Authorization header
  // Verify token signature
  // Decode payload
  // Attach user to req.user
  // Call next() or return 401
}
```

#### 3.5.2 Role-Based Authorization Middleware
```typescript
export const authorize = (...allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Check if req.user exists
    // Verify user role in allowedRoles
    // Call next() or return 403
  }
}

// Usage: authorize('ADMIN', 'SUPERADMIN')
```

#### 3.5.3 Error Handling Middleware
```typescript
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log error
  // Determine error type
  // Format error response
  // Return appropriate status code
}
```

#### 3.5.4 Validation Middleware
```typescript
export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Validate req.body against schema
    // If valid, call next()
    // If invalid, return 400 with errors
  }
}
```

#### 3.5.5 Rate Limiting Middleware
```typescript
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later'
});
```

---

### 3.6 Utility Components

#### 3.6.1 Database Utilities
```typescript
// Database Connection Pool
export class DatabasePool {
  private static instance: oracledb.Pool;
  
  + static async initialize(config: PoolConfig): Promise<void>
  + static async getConnection(): Promise<oracledb.Connection>
  + static async close(): Promise<void>
}
```

#### 3.6.2 JWT Utilities
```typescript
export class JWTUtil {
  + static generateToken(payload: TokenPayload): string
  + static verifyToken(token: string): TokenPayload
  + static decodeToken(token: string): any
}
```

#### 3.6.3 Password Utilities
```typescript
export class PasswordUtil {
  + static async hash(password: string): Promise<string>
  + static async compare(plain: string, hash: string): Promise<boolean>
  + static validateStrength(password: string): boolean
}
```

#### 3.6.4 Logger Utility
```typescript
export class Logger {
  + static info(message: string, meta?: any): void
  + static error(message: string, error?: Error): void
  + static warn(message: string, meta?: any): void
  + static debug(message: string, meta?: any): void
}
```

#### 3.6.5 File Upload Utilities
```typescript
export class FileUploadUtil {
  + static async uploadFile(file: Express.Multer.File): Promise<string>
  + static validateFile(file: Express.Multer.File): boolean
  + static async deleteFile(path: string): Promise<void>
  + static generateFileName(originalName: string): string
}
```

---

## 4. Data Flow Diagrams

### 4.1 Report Submission Flow

```
[Student] → [Frontend Form] → [Validation]
                                    ↓
                            [API POST /api/reports]
                                    ↓
                            [Auth Middleware] → Verify JWT
                                    ↓
                            [ReportController.createReport()]
                                    ↓
                            [ReportService.createReport()]
                                    ↓
        ┌───────────────────────────┴───────────────────────────┐
        ↓                                                       ↓
[Validate Business Rules]                            [File Upload Service]
        ↓                                                       ↓
[ReportRepository.create()]                         [Save Files to /uploads]
        ↓                                                       ↓
[Execute SQL INSERT]                                [Return File Paths]
        ↓                                                       ↓
[Trigger: Create CRIME]                            │
        ↓                                                       │
        └───────────────────────────┬───────────────────────────┘
                                    ↓
                            [Return Created Report]
                                    ↓
                            [Format JSON Response]
                                    ↓
                            [Frontend Updates UI]
```

### 4.2 User Authentication Flow

```
[User] → [Login Form] → [Submit Credentials]
                              ↓
                    [API POST /api/auth/login]
                              ↓
                    [AuthController.login()]
                              ↓
                    [AuthService.login()]
                              ↓
        ┌────────────────────┴────────────────────┐
        ↓                                         ↓
[AccountRepository.findByEmail()]    [PasswordUtil.compare()]
        ↓                                         ↓
[Fetch User from DB]                    [Verify Password Hash]
        ↓                                         ↓
        └────────────────────┬────────────────────┘
                             ↓
                    [JWTUtil.generateToken()]
                             ↓
                    [Return { token, user }]
                             ↓
                    [Frontend Stores Token]
                             ↓
                    [Set Authorization Header]
                             ↓
                    [Redirect to Dashboard]
```

### 4.3 Announcement Retrieval Flow

```
[User] → [View Announcements Page]
              ↓
    [API GET /api/announcements?audience=STUDENTS]
              ↓
    [Auth Middleware] → Verify Token
              ↓
    [AnnouncementController.getAnnouncements()]
              ↓
    [AnnouncementService.getActiveAnnouncements()]
              ↓
    [AnnouncementRepository.findByAudience()]
              ↓
    [SQL Query with Filters]
        - audience = 'STUDENTS' OR 'ALL'
        - status = 'PUBLISHED'
        - START_DATE <= NOW
        - END_DATE >= NOW OR NULL
              ↓
    [Map Results to Announcement Objects]
              ↓
    [Return Array of Announcements]
              ↓
    [Format JSON Response]
              ↓
    [Frontend Renders Announcement Cards]
```

---

## 5. Database Design Integration

### 5.1 ORM Mapping Strategy

The system uses a **Manual ORM Approach** where:
- Models represent database tables
- Repositories handle SQL queries
- Type-safe interfaces ensure data integrity

### 5.2 Query Optimization Strategies

1. **Parameterized Queries:** Prevent SQL injection
2. **Prepared Statements:** Improve performance
3. **Connection Pooling:** Reuse database connections
4. **Indexing:** Speed up searches (defined in schema.sql)
5. **Pagination:** Limit result set sizes
6. **Selective Fetching:** Only query needed columns

### 5.3 Transaction Management

```typescript
async createReportWithAttachments(data: ReportData, files: File[]) {
  const connection = await pool.getConnection();
  try {
    await connection.execute('BEGIN');
    
    // Insert report
    const report = await this.createReport(connection, data);
    
    // Upload files
    const paths = await this.uploadFiles(files);
    
    // Update report with file paths
    await this.updateAttachments(connection, report.id, paths);
    
    await connection.execute('COMMIT');
    return report;
  } catch (error) {
    await connection.execute('ROLLBACK');
    throw error;
  } finally {
    await connection.close();
  }
}
```

---

## 6. Security Design

### 6.1 Authentication Security

```typescript
// JWT Token Structure
{
  "sub": "1001",              // User ID
  "email": "user@example.com",
  "accountType": "STUDENT",
  "role": "STUDENT",
  "iat": 1704412800,          // Issued at
  "exp": 1705017600           // Expires (7 days)
}
```

### 6.2 Authorization Layers

```
┌─────────────────────────────────────────────────┐
│ Layer 1: JWT Authentication                    │
│ - Verify token signature                       │
│ - Check token expiration                       │
└──────────────────┬──────────────────────────────┘
                   ↓
┌──────────────────▼──────────────────────────────┐
│ Layer 2: Role-Based Authorization              │
│ - Check user role against required roles       │
│ - Grant/deny access based on permissions       │
└──────────────────┬──────────────────────────────┘
                   ↓
┌──────────────────▼──────────────────────────────┐
│ Layer 3: Resource-Level Authorization          │
│ - Verify ownership of resources                │
│ - Check hierarchical permissions               │
└─────────────────────────────────────────────────┘
```

### 6.3 Data Protection

- **Passwords:** bcrypt hashing (10 rounds)
- **Tokens:** HS256 JWT signing
- **API Keys:** Environment variables only
- **File Uploads:** Type validation, size limits
- **SQL Queries:** Parameterized to prevent injection
- **XSS Prevention:** Input sanitization
- **CSRF Protection:** Token-based validation

---

## 7. Error Handling Design

### 7.1 Error Hierarchy

```
Error (Base)
├── ValidationError (400)
│   ├── InvalidInputError
│   └── SchemaValidationError
├── AuthenticationError (401)
│   ├── InvalidCredentialsError
│   ├── TokenExpiredError
│   └── InvalidTokenError
├── AuthorizationError (403)
│   ├── InsufficientPermissionsError
│   └── ResourceAccessDeniedError
├── NotFoundError (404)
│   ├── ResourceNotFoundError
│   └── RouteNotFoundError
├── ConflictError (409)
│   ├── DuplicateEntryError
│   └── ConcurrencyError
└── InternalServerError (500)
    ├── DatabaseError
    ├── FileSystemError
    └── UnexpectedError
```

### 7.2 Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2026-01-04T10:30:00Z",
    "path": "/api/auth/register"
  }
}
```

---

## 8. API Design Specifications

### 8.1 RESTful Conventions

| HTTP Method | Operation | Example |
|-------------|-----------|---------|
| GET | Retrieve resources | `GET /api/reports` |
| POST | Create new resource | `POST /api/reports` |
| PUT | Full update | `PUT /api/reports/123` |
| PATCH | Partial update | `PATCH /api/reports/123` |
| DELETE | Remove resource | `DELETE /api/reports/123` |

### 8.2 Response Format Standards

#### Success Response
```json
{
  "success": true,
  "data": {
    "id": 123,
    "title": "Report Title",
    ...
  },
  "message": "Report created successfully",
  "timestamp": "2026-01-04T10:30:00Z"
}
```

#### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": []
  },
  "timestamp": "2026-01-04T10:30:00Z"
}
```

### 8.3 Pagination Design

```
GET /api/reports?page=1&limit=20&sortBy=createdAt&order=desc

Response:
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 100,
    "itemsPerPage": 20,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

---

## 9. Performance Design

### 9.1 Caching Strategy

```
┌─────────────┐
│   Client    │  → Browser cache (static assets)
└──────┬──────┘
       ↓
┌──────▼──────┐
│   CDN       │  → Edge caching (images, CSS, JS)
└──────┬──────┘
       ↓
┌──────▼──────┐
│ Application │  → In-memory cache (frequently accessed data)
└──────┬──────┘
       ↓
┌──────▼──────┐
│  Database   │  → Query result caching
└─────────────┘
```

### 9.2 Database Optimization

- **Connection Pooling:** Min 2, Max 20 connections
- **Prepared Statements:** Reuse query plans
- **Batch Operations:** Group multiple inserts/updates
- **Lazy Loading:** Fetch related data on demand
- **Indexes:** Created on frequently queried columns

### 9.3 File Handling Optimization

- **Streaming:** Process large files in chunks
- **Compression:** Reduce storage size
- **CDN Distribution:** Serve static files from edge locations
- **Lazy Loading:** Load images on demand
- **Format Optimization:** Convert to web-optimized formats

---

## 10. Scalability Considerations

### 10.1 Horizontal Scaling

```
        [Load Balancer]
               ↓
    ┌──────────┼──────────┐
    ↓          ↓          ↓
[App Server 1] [App Server 2] [App Server 3]
    ↓          ↓          ↓
    └──────────┼──────────┘
               ↓
        [Database Cluster]
```

### 10.2 Vertical Scaling

- **CPU:** Multi-core processing for concurrent requests
- **Memory:** Increased RAM for larger connection pools
- **Storage:** SSD for faster database operations
- **Network:** Higher bandwidth for file uploads

### 10.3 Microservices Preparation

Current monolithic architecture can be split into:
- **Auth Service:** Authentication and authorization
- **Report Service:** Report management
- **Announcement Service:** Content management
- **File Service:** Upload and storage
- **Notification Service:** Email and alerts

---

## 11. Testing Strategy

### 11.1 Unit Testing
- Test individual methods in isolation
- Mock dependencies
- Cover edge cases and error paths

### 11.2 Integration Testing
- Test component interactions
- Database integration tests
- API endpoint tests

### 11.3 End-to-End Testing
- Playwright for UI testing
- Full user workflows
- Cross-browser compatibility

### 11.4 Performance Testing
- Load testing with multiple concurrent users
- Stress testing to find breaking points
- Benchmark database queries

---

## 12. Deployment Design

### 12.1 Build Process

```bash
# Frontend Build
npm run build                    # Next.js production build
npm run seo:test                # Generate sitemap

# Backend Build
cd backend/cybercrime-api-v2
npm run build                   # TypeScript compilation
```

### 12.2 Environment Configuration

```
Development:  .env.local
Staging:      .env.staging
Production:   .env.production
```

### 12.3 Deployment Pipeline

```
[Git Push] → [CI/CD Pipeline]
                  ↓
         [Run Tests]
                  ↓
         [Build Application]
                  ↓
         [Docker Image]
                  ↓
         [Deploy to Server]
                  ↓
         [Health Check]
                  ↓
         [Notify Team]
```

---

## 13. Maintenance Design

### 13.1 Logging Strategy

```typescript
// Log Levels
- DEBUG: Detailed information for debugging
- INFO: General information about system operation
- WARN: Warning messages for potential issues
- ERROR: Error messages with stack traces
```

### 13.2 Monitoring Points

- API response times
- Database query performance
- Error rates
- User activity patterns
- System resource usage (CPU, memory, disk)

### 13.3 Backup Strategy

- **Database:** Daily full backups, hourly incrementals
- **Files:** Daily backup of uploads directory
- **Configuration:** Version-controlled in Git
- **Retention:** 30 days rolling backups

---

## 14. Documentation Standards

### 14.1 Code Documentation

```typescript
/**
 * Creates a new crime report in the system.
 * 
 * @param {number} userId - The ID of the user submitting the report
 * @param {CrimeData} data - The crime report data
 * @returns {Promise<Crime>} The created crime report
 * @throws {ValidationError} If the input data is invalid
 * @throws {AuthorizationError} If the user lacks permissions
 * 
 * @example
 * const crime = await crimeService.createCrime(1001, {
 *   title: "Phishing Attempt",
 *   category: "CYBER_FRAUD",
 *   description: "Received suspicious email"
 * });
 */
async createCrime(userId: number, data: CrimeData): Promise<Crime> {
  // Implementation
}
```

### 14.2 API Documentation

- OpenAPI/Swagger specifications
- Request/response examples
- Authentication requirements
- Error code references

---

## 15. Version Control

### 15.1 Git Workflow

```
main (production-ready)
  ↑
develop (integration branch)
  ↑
feature/* (new features)
bugfix/* (bug fixes)
hotfix/* (production fixes)
```

### 15.2 Commit Message Format

```
type(scope): subject

body (optional)

footer (optional)

Types: feat, fix, docs, style, refactor, test, chore
```

---

## 16. Future Enhancements

### 16.1 Planned Features
- Real-time notifications (WebSocket)
- Mobile application (React Native)
- Advanced analytics dashboard
- AI-powered report categorization
- Multi-language support
- Dark mode theme

### 16.2 Technical Improvements
- Migrate to microservices architecture
- Implement GraphQL API
- Add Redis caching layer
- Containerize with Docker
- Kubernetes orchestration
- CI/CD automation

---

## 17. Design Decisions Log

| Decision | Rationale | Date |
|----------|-----------|------|
| TypeScript over JavaScript | Type safety, better IDE support | 2025-12 |
| Oracle Database | University infrastructure | 2025-12 |
| Next.js 15 | React Server Components, performance | 2025-12 |
| JWT Authentication | Stateless, scalable | 2025-12 |
| OOP Architecture | Maintainability, testability | 2026-01 |
| Repository Pattern | Data abstraction, testability | 2026-01 |

---

## 18. Revision History

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | 2026-01-04 | AI Assistant | Initial CSCI Design Description |

---

**End of CSCI Design Description Document**
