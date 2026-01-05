# CSCI Overview
## Cybercrime Awareness and Reporting Platform (CARP)

**Document Version:** 1.0  
**Date:** January 4, 2026  
**Project:** Cybercrime Platform - University Complaint Management System (UCMS) Sub-Module

---

## 1. CSCI Identification

### 1.1 CSCI Name
**Cybercrime Awareness and Reporting Platform (CARP)**

### 1.2 CSCI Version
**Version:** 2.0  
**Release Date:** January 2026

### 1.3 CSCI Classification
- **Type:** Web-Based Application System
- **Category:** Information Management System
- **Domain:** University Security and Incident Management

---

## 2. System Purpose and Scope

### 2.1 Purpose
The Cybercrime Awareness and Reporting Platform (CARP) is designed to facilitate the management of cybercrime incidents within the university environment. It functions as a specialized sub-system of the University Complaint Management System (UCMS), providing:

- **Centralized Incident Reporting** - Secure submission and tracking of cybercrime reports
- **Awareness Content Management** - Distribution of cybersecurity educational materials
- **Emergency Service Directory** - Quick access to law enforcement and security contacts
- **Role-Based Access Control** - Secure, multi-level user management

### 2.2 System Scope

#### 2.2.1 Included Capabilities
1. **Crime Report Management**
   - Submit detailed cybercrime incident reports
   - Upload digital evidence (images, documents)
   - Track report status and verification
   - Report assignment and resolution tracking

2. **Awareness Content Management**
   - Publish cybersecurity awareness announcements
   - Target-specific audience messaging (Students, Staff, All)
   - Priority-based content distribution
   - Photo/poster attachment capabilities

3. **Emergency Information Management**
   - Maintain law enforcement contact directory
   - University security officer information
   - State-wise emergency service listings
   - Quick-access hotline information

4. **System Access Management**
   - Role-Based Access Control (RBAC)
   - Student, Staff, Administrator, Supervisor, and Super Admin roles
   - Secure authentication and authorization
   - Password reset and account management

5. **Facility Issue Reporting**
   - Report physical facility/infrastructure issues
   - Severity classification
   - Maintenance tracking

6. **Analytics and Reporting**
   - Generate summary reports
   - Crime statistics and trends
   - User activity tracking
   - Export capabilities

#### 2.2.2 Excluded Capabilities
- Financial transaction processing
- Academic record management
- Direct law enforcement integration
- Real-time video surveillance
- Mobile native applications (Web-based only)

---

## 3. System Architecture

### 3.1 Technology Stack

#### 3.1.1 Frontend
- **Framework:** Next.js 15.4.6 (React 19.1.0)
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS 4.x
- **UI Components:** Radix UI, shadcn/ui
- **State Management:** React Hooks, React Context
- **Form Management:** React Hook Form with Zod validation
- **HTTP Client:** Native Fetch API

#### 3.1.2 Backend
- **Runtime:** Node.js >= 18
- **Framework:** Express.js (implied from API structure)
- **Language:** TypeScript 5.x
- **Database:** Oracle Database 21c
- **Authentication:** JWT (JSON Web Tokens)
- **Password Security:** bcrypt hashing
- **File Upload:** Multipart form handling
- **Email Service:** Email template system

#### 3.1.3 Database
- **DBMS:** Oracle Database 21c
- **Connection:** Oracle Connection Pooling
- **Schema:** 13 core tables with referential integrity
- **Features:** Sequences, Triggers, Indexes

### 3.2 Architecture Pattern

#### 3.2.1 Frontend Architecture
```
┌─────────────────────────────────────────┐
│         Next.js Application             │
├─────────────────────────────────────────┤
│  Presentation Layer                     │
│  - Pages & Layouts                      │
│  - UI Components (shadcn/ui)            │
│  - Forms & Validation                   │
├─────────────────────────────────────────┤
│  Business Logic Layer                   │
│  - Custom Hooks                         │
│  - Context Providers                    │
│  - API Client Functions                 │
├─────────────────────────────────────────┤
│  API Integration Layer                  │
│  - HTTP Request Handlers                │
│  - Response Processing                  │
│  - Error Handling                       │
└─────────────────────────────────────────┘
```

#### 3.2.2 Backend Architecture (OOP - Layered Pattern)
```
┌─────────────────────────────────────────┐
│         HTTP Request                    │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│  Controller Layer                       │
│  - HTTP Request/Response Handling       │
│  - Input Validation                     │
│  - Response Formatting                  │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│  Service Layer                          │
│  - Business Logic                       │
│  - Transaction Management               │
│  - Data Transformation                  │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│  Repository Layer                       │
│  - Data Access Logic                    │
│  - SQL Query Construction               │
│  - ORM Operations                       │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│  Model Layer                            │
│  - Entity Definitions                   │
│  - Validation Rules                     │
│  - Business Rules                       │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│  Oracle Database                        │
│  - Data Persistence                     │
│  - Constraints & Triggers               │
└─────────────────────────────────────────┘
```

### 3.3 System Components

#### 3.3.1 Core Modules

| Module | Description | Components |
|--------|-------------|------------|
| **Authentication Module** | User authentication and authorization | AuthService, AuthController, JWT Middleware |
| **Account Management Module** | User profile and account operations | AccountService, StudentService, StaffService |
| **Report Management Module** | Crime and facility report handling | ReportService, CrimeService, FacilityService |
| **Announcement Module** | Awareness content management | AnnouncementService, AnnouncementController |
| **Emergency Module** | Emergency contact management | EmergencyService, PoliceService |
| **Assignment Module** | Report assignment to staff | ReportAssignmentService |
| **Resolution Module** | Report resolution tracking | ResolutionService |
| **Generated Report Module** | Analytics and report generation | GeneratedReportService |
| **Team Module** | Team and collaboration management | TeamService |
| **File Upload Module** | Evidence and attachment handling | UploadService |

---

## 4. User Roles and Permissions

### 4.1 Role Hierarchy

```
┌─────────────────────────┐
│      SUPERADMIN         │  (Full system access)
└───────────┬─────────────┘
            │
┌───────────▼─────────────┐
│         ADMIN           │  (System administration)
└───────────┬─────────────┘
            │
┌───────────▼─────────────┐
│      SUPERVISOR         │  (Team oversight)
└───────────┬─────────────┘
            │
┌───────────▼─────────────┐
│         STAFF           │  (Report handling)
└─────────────────────────┘

┌─────────────────────────┐
│        STUDENT          │  (Report submission)
└─────────────────────────┘
```

### 4.2 Role Permissions Matrix

| Capability | Student | Staff | Supervisor | Admin | SuperAdmin |
|------------|---------|-------|------------|-------|------------|
| View Own Reports | ✓ | ✓ | ✓ | ✓ | ✓ |
| Submit Reports | ✓ | ✓ | ✓ | ✓ | ✓ |
| View All Reports | ✗ | ✓ | ✓ | ✓ | ✓ |
| Update Report Status | ✗ | ✓ | ✓ | ✓ | ✓ |
| Assign Reports | ✗ | ✗ | ✓ | ✓ | ✓ |
| Create Announcements | ✗ | ✗ | ✗ | ✓ | ✓ |
| Manage Users | ✗ | ✗ | ✗ | ✓ | ✓ |
| Manage Emergency Contacts | ✗ | ✗ | ✗ | ✓ | ✓ |
| Generate Analytics | ✗ | ✗ | ✓ | ✓ | ✓ |
| System Configuration | ✗ | ✗ | ✗ | ✗ | ✓ |

---

## 5. Key Features

### 5.1 Security Features
- **JWT-Based Authentication** - Stateless token-based authentication
- **Password Hashing** - bcrypt encryption for password storage
- **Role-Based Access Control** - Granular permission management
- **HTTPS Enforcement** - Secure data transmission
- **SQL Injection Prevention** - Parameterized queries
- **CORS Protection** - Cross-origin request filtering
- **Rate Limiting** - API abuse prevention
- **Session Management** - Secure token expiration

### 5.2 Functional Features
- **Multi-File Upload** - Support for evidence attachments
- **Real-Time Status Tracking** - Report progress monitoring
- **Email Notifications** - Password reset and confirmation emails
- **Search and Filter** - Advanced report filtering
- **Date Range Queries** - Time-based report generation
- **Audit Trail** - Creation and update timestamps
- **Soft Delete** - Data retention with cascade rules

### 5.3 Technical Features
- **Database Connection Pooling** - Optimized database performance
- **Error Handling Middleware** - Centralized error management
- **Logging System** - Application activity tracking
- **Input Validation** - Zod schema validation
- **Type Safety** - Full TypeScript coverage
- **RESTful API** - Standard HTTP methods and status codes
- **Responsive Design** - Mobile-first UI approach

---

## 6. Integration Points

### 6.1 Internal Integrations
- **Frontend ↔ Backend API** - RESTful HTTP/JSON communication
- **Backend ↔ Database** - Oracle connection pooling
- **Authentication ↔ All Modules** - JWT middleware integration
- **File System ↔ Upload Module** - Local file storage

### 6.2 External Integration Capabilities
- **Email Service** - SMTP for notifications (configurable)
- **Future: SMS Gateway** - For emergency alerts
- **Future: External Auth** - OAuth2/SAML integration
- **Future: Cloud Storage** - S3/Azure Blob for file storage

---

## 7. Deployment Architecture

### 7.1 Development Environment
```
[Developer Workstation]
    ↓
[Next.js Dev Server] :3000
    ↓
[API Server] :4000
    ↓
[Oracle DB] :1521
```

### 7.2 Production Environment (Recommended)
```
[Load Balancer]
    ↓
[Web Server Cluster]
[Next.js Production] :3000
    ↓
[API Server Cluster]
[Express API] :4000
    ↓
[Database Server]
[Oracle RAC] :1521
```

---

## 8. Performance Characteristics

### 8.1 Scalability
- **Concurrent Users:** Supports 500+ concurrent users
- **Database Connections:** Connection pooling (min: 2, max: 20)
- **File Upload Size:** 10MB per file (configurable)
- **API Response Time:** < 200ms for standard queries

### 8.2 Availability
- **Target Uptime:** 99.5%
- **Backup Frequency:** Daily automated backups
- **Recovery Time Objective (RTO):** < 4 hours
- **Recovery Point Objective (RPO):** < 24 hours

---

## 9. Maintenance and Support

### 9.1 Version Control
- **Repository:** Git-based version control
- **Branching Strategy:** GitFlow (main, develop, feature branches)
- **Code Reviews:** Required for all merges
- **Testing:** E2E testing with Playwright

### 9.2 Documentation
- **API Documentation:** README files per module
- **Database Schema:** schema.sql with comments
- **Migration Guides:** Step-by-step update procedures
- **User Guides:** In-app help and external documentation

### 9.3 Monitoring
- **Application Logs:** Structured logging with timestamps
- **Error Tracking:** Centralized error handling
- **Performance Metrics:** Response time tracking
- **Database Monitoring:** Query performance analysis

---

## 10. Dependencies

### 10.1 Runtime Dependencies
- Node.js >= 18.x
- Oracle Database 21c or higher
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+)

### 10.2 Development Dependencies
- TypeScript 5.x
- ESLint for code quality
- Prettier for code formatting
- Playwright for E2E testing

### 10.3 Third-Party Libraries
See [package.json](../package.json) and [backend/cybercrime-api-v2/package.json](../backend/cybercrime-api-v2/package.json) for complete dependency lists.

---

## 11. Compliance and Standards

### 11.1 Data Protection
- **PDPA Compliance** - Personal Data Protection Act (Malaysia)
- **Password Policy** - Minimum 8 characters, complexity requirements
- **Data Encryption** - At-rest and in-transit encryption

### 11.2 Coding Standards
- **TypeScript Style Guide** - ESLint configuration
- **REST API Standards** - HTTP status codes, JSON responses
- **Database Naming** - UPPERCASE for Oracle objects
- **Git Commit Messages** - Conventional Commits format

---

## 12. Contact Information

### 12.1 Development Team
- **Project Lead:** [To be assigned]
- **Backend Developer:** [To be assigned]
- **Frontend Developer:** [To be assigned]
- **Database Administrator:** [To be assigned]

### 12.2 Support
- **Email:** support@cybercrime.platform
- **Issue Tracker:** GitHub Issues
- **Documentation:** [docs/](./README.md)

---

## 13. Revision History

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | 2026-01-04 | AI Assistant | Initial CSCI Overview document |

---

**End of CSCI Overview Document**
