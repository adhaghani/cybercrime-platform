# CSCI Architecture
## Cybercrime Awareness and Reporting Platform (CARP)

**Document Version:** 1.0  
**Date:** January 4, 2026  
**Project:** Cybercrime Platform - Architecture Specification

---

## Table of Contents

1. [Introduction](#1-introduction)
   - 1.1 [Identification](#11-identification)
   - 1.2 [System Overview](#12-system-overview)
   - 1.3 [Document Overview](#13-document-overview)
2. [Referenced Documents](#2-referenced-documents)
3. [CSCI Architecture](#3-csci-architecture)
   - 3.1 [CSCI Overview](#31-csci-overview)
   - 3.2 [State Organization](#32-state-organization)
   - 3.3 [Dynamic Organization](#33-dynamic-organization)
   - 3.4 [CSC Interfaces](#34-csc-interfaces)
   - 3.5 [External CSCI Interfaces](#35-external-csci-interfaces)
4. [CSC Design](#4-csc-design)
   - 4.1 [CSC Security](#41-csc-security)
   - 4.2 [CSC Authentication](#42-csc-authentication)
   - 4.3 [CSC Account Management](#43-csc-account-management)
   - 4.4 [CSC Report Management](#44-csc-report-management)
   - 4.5 [CSC Crime Management](#45-csc-crime-management)
   - 4.6 [CSC Announcement](#46-csc-announcement)
   - 4.7 [CSC Emergency Services](#47-csc-emergency-services)
   - 4.8 [CSC Report Assignment](#48-csc-report-assignment)
   - 4.9 [CSC Resolution](#49-csc-resolution)
   - 4.10 [CSC Generated Reports](#410-csc-generated-reports)

---

## 1. Introduction

### 1.1 Identification

**CSCI Name:** Cybercrime Awareness and Reporting Platform (CARP)  
**Version:** 2.0  
**Release Date:** January 2026  
**Project:** University Complaint Management System (UCMS) - Cybercrime Module

### 1.2 System Overview

The Cybercrime Awareness and Reporting Platform (CARP) is a comprehensive web-based system designed to manage cybercrime incidents within university environments. The system provides a secure, role-based platform for reporting, tracking, and resolving cybersecurity incidents while promoting awareness through targeted announcements.

**Key Capabilities:**
- Cybercrime incident reporting and tracking
- Digital evidence management
- Role-based access control (Student, Staff, Supervisor, Admin, SuperAdmin)
- Announcement and awareness content distribution
- Emergency service directory
- Report assignment and resolution workflow
- Analytics and report generation

### 1.3 Document Overview

This document describes the architectural design of the CARP system, including:
- Computer Software Component (CSC) structure and organization
- Interface specifications between CSCs
- State and dynamic behavior models
- Security and authentication mechanisms
- Data flow and component interactions

---

## 2. Referenced Documents

### 2.1 Government Documents
- IEEE Std 1016-2009: IEEE Standard for Information Technology—Systems Design—Software Design Descriptions

### 2.2 Non-Government Documents
- [CSCI_OVERVIEW.md](./CSCI_OVERVIEW.md) - System overview and capabilities
- [CSCI_DATA.md](./CSCI_DATA.md) - Data structures and entity models
- [CSCI_DATA_FILES.md](./CSCI_DATA_FILES.md) - File specifications and management
- [CSCI_DESIGN_DESCRIPTION.md](./CSCI_DESIGN_DESCRIPTION.md) - Detailed component design

---

## 3. CSCI Architecture

### 3.1 CSCI Overview

#### 3.1.1 CSCI Component Structure

The CARP system is organized using a layered architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                  PRESENTATION LAYER                     │
│              (Next.js 15 + React 19 + TypeScript)       │
├─────────────────────────────────────────────────────────┤
│                  APPLICATION LAYER                      │
│             (Node.js + Express + TypeScript)            │
│  ┌───────────────────────────────────────────────────┐  │
│  │              COMPUTER SOFTWARE COMPONENTS          │  │
│  │  ┌──────────────────────────────────────────────┐ │  │
│  │  │  CSC Security (JWT, bcrypt, RBAC)           │ │  │
│  │  └──────────────────────────────────────────────┘ │  │
│  │  ┌──────────────────────────────────────────────┐ │  │
│  │  │  CSC Authentication (Login, Register)       │ │  │
│  │  └──────────────────────────────────────────────┘ │  │
│  │  ┌──────────────────────────────────────────────┐ │  │
│  │  │  CSC Account Management (Users, Profiles)   │ │  │
│  │  └──────────────────────────────────────────────┘ │  │
│  │  ┌──────────────────────────────────────────────┐ │  │
│  │  │  CSC Report Management (CRUD, Status)       │ │  │
│  │  └──────────────────────────────────────────────┘ │  │
│  │  ┌──────────────────────────────────────────────┐ │  │
│  │  │  CSC Crime Management (Cybercrime Reports)  │ │  │
│  │  └──────────────────────────────────────────────┘ │  │
│  │  ┌──────────────────────────────────────────────┐ │  │
│  │  │  CSC Announcement (Awareness Content)       │ │  │
│  │  └──────────────────────────────────────────────┘ │  │
│  │  ┌──────────────────────────────────────────────┐ │  │
│  │  │  CSC Emergency Services (Contacts, Police)  │ │  │
│  │  └──────────────────────────────────────────────┘ │  │
│  │  ┌──────────────────────────────────────────────┐ │  │
│  │  │  CSC Report Assignment (Task Assignment)    │ │  │
│  │  └──────────────────────────────────────────────┘ │  │
│  │  ┌──────────────────────────────────────────────┐ │  │
│  │  │  CSC Resolution (Case Resolution)           │ │  │
│  │  └──────────────────────────────────────────────┘ │  │
│  │  ┌──────────────────────────────────────────────┐ │  │
│  │  │  CSC Generated Reports (Analytics)          │ │  │
│  │  └──────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────┤
│                     DATA LAYER                          │
│                  (Oracle Database 21c)                  │
└─────────────────────────────────────────────────────────┘
```

#### 3.1.2 Security

**Authentication Mechanisms:**
- JWT (JSON Web Token) based authentication
- bcrypt password hashing with salt rounds
- Token expiration and refresh mechanisms
- Secure cookie storage for tokens

**Authorization:**
- Role-Based Access Control (RBAC)
- Five user roles: Student, Staff, Supervisor, Admin, SuperAdmin
- Granular permission checking per endpoint
- Middleware-based route protection

**Data Protection:**
- HTTPS/TLS encryption in transit
- Database encryption at rest
- SQL injection prevention via parameterized queries
- XSS protection through input sanitization
- CORS configuration for API access

#### 3.1.3 Code Maintenance

**Development Standards:**
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Git version control with branching strategy
- Pull request reviews

**Documentation:**
- Inline code comments
- JSDoc/TSDoc documentation
- API endpoint documentation
- README files per module
- Architecture decision records (ADRs)

#### 3.1.4 User Maintenance

**Account Management:**
- Self-service profile updates
- Password reset functionality
- Email verification system
- Account deactivation/reactivation

**Support Features:**
- Help documentation
- FAQ section
- Contact support form
- Error reporting mechanisms

#### 3.1.5 Inventory

**User Management:**
- Student registration and profiles
- Staff account creation
- Role assignment and updates
- Account status tracking

#### 3.1.6 Register Visit

**Audit Logging:**
- User login/logout tracking
- Report creation and updates
- Assignment changes
- Resolution actions
- System access logs

#### 3.1.7 Crime Queue

**Report Processing:**
- New crime reports queue
- Priority-based sorting
- Auto-assignment rules
- SLA tracking
- Status transitions

#### 3.1.8 Announcement

**Content Management:**
- Create targeted announcements
- Schedule publication dates
- Priority-based display
- Audience segmentation (Students, Staff, All)
- Photo/poster attachments

#### 3.1.9 Emergency Services

**Contact Directory:**
- Law enforcement contacts
- UiTM Auxiliary Police information
- State-based emergency services
- Hotline numbers
- Operating hours

#### 3.1.10 Report Assignment

**Task Distribution:**
- Manual assignment by supervisors/admins
- Workload balancing
- Assignment history
- Action taken tracking
- Feedback mechanism

#### 3.1.11 Dynamic Organization

The system follows a request-response flow with clear component interactions:

```
User Request (Browser)
    ↓
Middleware (Auth, Validation)
    ↓
Controller (HTTP Handler)
    ↓
Service (Business Logic)
    ↓
Repository (Data Access)
    ↓
Model (Entity Validation)
    ↓
Database (Oracle)
    ↓
Response (JSON)
```

#### 3.1.12 CSC Interfaces

**Internal Interfaces:**
- REST API endpoints (JSON over HTTPS)
- Service-to-service function calls
- Repository pattern for data access
- Event emitters for async operations

**External Interfaces:**
- SMTP for email notifications
- File system for uploads storage
- Oracle database connection
- Future: SMS gateway, cloud storage

#### 3.1.13 External CSCI Interfaces

**Database Interface:**
- Protocol: Oracle Net (SQL*Net)
- Connection pooling (min: 2, max: 20)
- Prepared statements
- Transaction management

**Email Service Interface:**
- Protocol: SMTP
- Templates: HTML email templates
- Use cases: Password reset, confirmations

**File Storage Interface:**
- Local file system (/public/uploads)
- Supported formats: images (jpg, png), documents (pdf, docx)
- Size limit: 10MB per file

### 3.2 State Organization

The system maintains several state categories:

#### 3.2.1 User Session State
- Authentication token
- User role and permissions
- Active session data
- Last activity timestamp

#### 3.2.2 Report State
- PENDING: Newly submitted
- IN_REVIEW: Assigned to staff
- UNDER_INVESTIGATION: Active investigation
- RESOLVED: Case closed
- DISMISSED: Invalid/duplicate

#### 3.2.3 Announcement State
- DRAFT: Being created
- SCHEDULED: Awaiting publication
- PUBLISHED: Active and visible
- EXPIRED: Past end date
- ARCHIVED: No longer active

#### 3.2.4 Account State
- ACTIVE: Normal operation
- SUSPENDED: Temporarily disabled
- DEACTIVATED: Permanently disabled
- PENDING_VERIFICATION: Awaiting email confirmation

### 3.3 Dynamic Organization

#### 3.3.1 Request Processing Flow

```
┌─────────────┐
│ HTTP Request│
└──────┬──────┘
       │
┌──────▼──────────────┐
│ Middleware Pipeline │
│  - CORS             │
│  - Body Parser      │
│  - Auth Check       │
│  - Rate Limit       │
└──────┬──────────────┘
       │
┌──────▼──────────────┐
│ Route Handler       │
│ (Controller)        │
└──────┬──────────────┘
       │
┌──────▼──────────────┐
│ Business Logic      │
│ (Service Layer)     │
└──────┬──────────────┘
       │
┌──────▼──────────────┐
│ Data Access         │
│ (Repository)        │
└──────┬──────────────┘
       │
┌──────▼──────────────┐
│ Database Query      │
│ (Oracle)            │
└──────┬──────────────┘
       │
┌──────▼──────────────┐
│ Response            │
│ (JSON)              │
└─────────────────────┘
```

#### 3.3.2 Concurrent Operations

The system supports:
- Multiple simultaneous user sessions
- Parallel report processing
- Asynchronous email sending
- Background file uploads
- Database connection pooling

### 3.4 CSC Interfaces

All CSCs communicate via standardized interfaces:

#### 3.4.1 Service Interface Pattern
```typescript
interface IService<T> {
  create(data: Partial<T>): Promise<T>;
  findById(id: number): Promise<T | null>;
  findAll(filters?: object): Promise<T[]>;
  update(id: number, data: Partial<T>): Promise<T>;
  delete(id: number): Promise<boolean>;
}
```

#### 3.4.2 API Response Format
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}
```

### 3.5 External CSCI Interfaces

#### 3.5.1 Database Connection Interface
- **Protocol:** Oracle Net Services
- **Port:** 1521
- **Format:** SQL statements via oracledb driver
- **Authentication:** Username/password
- **Connection String:** `localhost:1521/CYBERCRIME`

#### 3.5.2 Email Service Interface
- **Protocol:** SMTP
- **Port:** 587 (TLS)
- **Format:** HTML emails with templates
- **Authentication:** SMTP credentials
- **Rate Limit:** Configured per provider

#### 3.5.3 Frontend Interface
- **Protocol:** HTTPS/HTTP
- **Port:** 4000 (API), 3000 (Frontend)
- **Format:** JSON payloads
- **Authentication:** JWT Bearer tokens
- **CORS:** Configured allowed origins

---

## 4. CSC Design

### 4.1 CSC Security

**Purpose:** Provide security mechanisms including authentication, authorization, encryption, and protection against common vulnerabilities.

**Components:**
- JWT token generation and validation
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Input validation and sanitization
- CORS configuration
- Rate limiting

**Key Functions:**
- `generateToken(payload: object): string`
- `verifyToken(token: string): object | null`
- `hashPassword(password: string): Promise<string>`
- `comparePassword(plain: string, hash: string): Promise<boolean>`
- `checkPermission(role: Role, resource: string, action: string): boolean`

### 4.2 CSC Authentication

**Purpose:** Handle user authentication including login, registration, password reset, and session management.

**Components:**
- Login controller and service
- Registration controller and service
- Password reset functionality
- Token refresh mechanism
- Email verification

**API Endpoints:**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - New user registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `POST /api/auth/verify-email` - Verify email address

### 4.3 CSC Account Management

**Purpose:** Manage user accounts including students and staff profiles.

**Components:**
- Account repository
- Student repository
- Staff repository
- Account service
- Profile update handlers

**API Endpoints:**
- `GET /api/accounts/:id` - Get account details
- `PUT /api/accounts/:id` - Update account
- `DELETE /api/accounts/:id` - Delete account
- `GET /api/students` - List students
- `GET /api/staff` - List staff
- `PUT /api/accounts/:id/password` - Change password

### 4.4 CSC Report Management

**Purpose:** Core report handling including creation, retrieval, updates, and status management.

**Components:**
- Report repository
- Report service
- Report controller
- Status transition logic
- Search and filter functionality

**API Endpoints:**
- `POST /api/reports` - Create new report
- `GET /api/reports` - List all reports (with filters)
- `GET /api/reports/:id` - Get report details
- `PUT /api/reports/:id` - Update report
- `PUT /api/reports/:id/status` - Update report status
- `DELETE /api/reports/:id` - Delete report
- `GET /api/reports/search` - Search reports

### 4.5 CSC Crime Management

**Purpose:** Handle cybercrime-specific reports with specialized fields and categorization.

**Components:**
- Crime repository (extends Report)
- Crime service
- Crime controller
- Crime category validation
- Evidence attachment handling

**API Endpoints:**
- `POST /api/crimes` - Create crime report
- `GET /api/crimes` - List crime reports
- `GET /api/crimes/:id` - Get crime details
- `PUT /api/crimes/:id` - Update crime report
- `GET /api/crimes/category/:category` - Get by category
- `GET /api/crimes/statistics` - Crime statistics

**Crime Categories:**
- Phishing
- Identity Theft
- Online Fraud
- Cyberbullying
- Data Breach
- Malware Attack
- Social Engineering
- Unauthorized Access
- Other

### 4.6 CSC Announcement

**Purpose:** Manage awareness content and notifications for users.

**Components:**
- Announcement repository
- Announcement service
- Announcement controller
- Audience targeting logic
- Scheduling mechanism

**API Endpoints:**
- `POST /api/announcements` - Create announcement
- `GET /api/announcements` - List announcements
- `GET /api/announcements/:id` - Get announcement details
- `PUT /api/announcements/:id` - Update announcement
- `DELETE /api/announcements/:id` - Delete announcement
- `GET /api/announcements/active` - Get active announcements
- `GET /api/announcements/audience/:type` - Filter by audience

**Announcement Types:**
- Alert - Urgent security notifications
- Information - General information
- Event - Upcoming events
- Training - Training opportunities
- Update - System updates

### 4.7 CSC Emergency Services

**Purpose:** Manage emergency contact directory and UiTM Auxiliary Police information.

**Components:**
- Emergency contact repository
- Police repository
- Emergency service
- State-based filtering
- Contact type categorization

**API Endpoints:**
- `GET /api/emergency` - List all emergency contacts
- `GET /api/emergency/:id` - Get contact details
- `POST /api/emergency` - Create contact (admin only)
- `PUT /api/emergency/:id` - Update contact (admin only)
- `DELETE /api/emergency/:id` - Delete contact (admin only)
- `GET /api/emergency/state/:state` - Get by state
- `GET /api/police` - List UiTM police contacts
- `GET /api/police/campus/:campus` - Get by campus

**Service Types:**
- Police
- Fire Department
- Medical Emergency
- Cybercrime Unit
- University Security

### 4.8 CSC Report Assignment

**Purpose:** Assign reports to staff members for investigation and tracking.

**Components:**
- Assignment repository
- Assignment service
- Assignment controller
- Workload tracking
- Assignment history

**API Endpoints:**
- `POST /api/assignments` - Assign report to staff
- `GET /api/assignments` - List assignments
- `GET /api/assignments/:id` - Get assignment details
- `PUT /api/assignments/:id` - Update assignment
- `GET /api/assignments/staff/:staffId` - Get staff assignments
- `GET /api/assignments/report/:reportId` - Get report assignments

**Assignment Workflow:**
1. Supervisor/Admin assigns report to staff
2. Staff receives notification
3. Staff updates action taken
4. Staff provides feedback
5. Assignment marked complete

### 4.9 CSC Resolution

**Purpose:** Track and document report resolutions and case closures.

**Components:**
- Resolution repository
- Resolution service
- Resolution controller
- Resolution type validation
- Evidence tracking

**API Endpoints:**
- `POST /api/resolutions` - Create resolution
- `GET /api/resolutions` - List resolutions
- `GET /api/resolutions/:id` - Get resolution details
- `PUT /api/resolutions/:id` - Update resolution
- `GET /api/resolutions/report/:reportId` - Get by report
- `GET /api/resolutions/staff/:staffId` - Get by resolver

**Resolution Types:**
- Resolved - Case successfully closed
- Referred - Escalated to authorities
- Invalid - Report was invalid
- Duplicate - Duplicate report
- Dismissed - Case dismissed

### 4.10 CSC Generated Reports

**Purpose:** Generate analytics and summary reports for management.

**Components:**
- Generated report repository
- Report generation service
- Analytics controller
- Data aggregation logic
- Export functionality

**API Endpoints:**
- `POST /api/generated-reports` - Create report
- `GET /api/generated-reports` - List generated reports
- `GET /api/generated-reports/:id` - Get report details
- `GET /api/dashboard/statistics` - Dashboard statistics
- `GET /api/dashboard/trends` - Trend analysis
- `GET /api/dashboard/summary` - Summary data

**Report Types:**
- Daily summary
- Weekly trends
- Monthly statistics
- Category breakdown
- Resolution rates
- Response time analysis

---

## 5. System States and Modes

### 5.1 Operational Modes

**Development Mode:**
- Debug logging enabled
- Hot module reloading
- Detailed error messages
- CORS permissive

**Production Mode:**
- Optimized builds
- Error logging to files
- Generic error messages
- Strict CORS

**Maintenance Mode:**
- Read-only access
- Scheduled downtime
- Admin access only
- Maintenance banner

### 5.2 User States

```
[Unauthenticated]
    ↓ Login
[Authenticated]
    ↓ Role Check
┌─────────┬──────────┬───────────┬────────┬─────────────┐
│ Student │  Staff   │ Supervisor│  Admin │ SuperAdmin  │
└─────────┴──────────┴───────────┴────────┴─────────────┘
```

### 5.3 Report Lifecycle States

```
[New Report]
    ↓
[PENDING] ──────────────┐
    ↓                   │
[IN_REVIEW]             │
    ↓                   │ [DISMISSED]
[UNDER_INVESTIGATION]   │
    ↓                   │
[RESOLVED] ←────────────┘
```

---

## 6. Memory and Processing Time Allocation

### 6.1 Performance Targets

| Operation | Target Response Time | Memory Allocation |
|-----------|---------------------|-------------------|
| User Login | < 500ms | < 10MB |
| Report Creation | < 1s | < 20MB |
| Report Listing | < 300ms | < 50MB |
| File Upload (10MB) | < 3s | < 30MB |
| Database Query | < 200ms | < 5MB |
| Report Generation | < 2s | < 100MB |

### 6.2 Resource Limits

**Database Connections:**
- Minimum pool size: 2
- Maximum pool size: 20
- Connection timeout: 60 seconds

**File Uploads:**
- Maximum file size: 10MB
- Maximum files per request: 5
- Total upload size: 50MB

**API Rate Limits:**
- Authenticated users: 100 requests/minute
- Public endpoints: 20 requests/minute
- File uploads: 10 uploads/hour

---

## 7. Deployment Architecture

### 7.1 Development Environment

```
[Developer Machine]
    ↓
[Next.js Dev Server] :3000
    ↓
[Express API Server] :4000
    ↓
[Oracle Database] :1521
```

### 7.2 Production Environment

```
[Load Balancer/Reverse Proxy]
    ↓
[Next.js Application Cluster]
    ↓
[Express API Cluster]
    ↓
[Oracle Database (RAC)]
```

---

## 8. Notes

### 8.1 Future Enhancements

- Real-time notifications via WebSockets
- Mobile native applications
- Integration with external law enforcement systems
- Advanced analytics and machine learning
- Multi-language support
- Cloud storage for file attachments
- SMS notifications for critical alerts

### 8.2 Known Limitations

- File storage is local (not distributed)
- Email sending is synchronous
- No real-time collaboration features
- Limited to UiTM campuses in Malaysia
- Single database instance (no sharding)

### 8.3 Dependencies

**External Libraries:**
- oracledb: Oracle database driver
- bcrypt: Password hashing
- jsonwebtoken: JWT authentication
- express: Web framework
- next: React framework
- zod: Schema validation
- react-hook-form: Form management

---

**Document End**
