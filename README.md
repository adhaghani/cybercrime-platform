# UiTM Cybercrime & Facility Reporting Platform

A comprehensive, enterprise-grade platform for managing campus security and facility maintenance at Universiti Teknologi MARA (UiTM). This system streamlines incident reporting, staff assignment workflows, emergency services access, and administrative oversight through role-based dashboards and real-time analytics.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Use Cases](#use-cases)
- [Purpose & Benefits](#purpose--benefits)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

The UiTM Cybercrime Platform is a full-stack web application designed to centralize and optimize the management of campus security incidents and facility maintenance requests across UiTM campuses. It provides distinct interfaces for students, staff, and administrators, ensuring appropriate access control while maintaining transparency and accountability.

### Problem Statement

Traditional campus incident reporting often suffers from:
- **Fragmented Communication**: Reports scattered across emails, phone calls, and paper forms
- **Lack of Accountability**: No clear assignment or tracking of incident resolution
- **Limited Visibility**: Students unable to track their submitted reports
- **Delayed Response**: No prioritization or real-time assignment workflows
- **Inefficient Data Analysis**: No centralized database for trend analysis and decision-making

### Solution

This platform addresses these challenges by providing:
- Structured digital reporting with standardized fields
- Automated assignment and tracking workflows
- Role-based access control (Students, Staff, Admins)
- Real-time dashboard analytics and statistics
- Emergency services directory integration
- Announcement system for campus-wide communication

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- **UiTM Email Validation**: Supports both student (`@student.uitm.edu.my`) and staff (`@uitm.edu.my`) email domains
- **JWT-Based Sessions**: Secure, stateless authentication with HttpOnly cookies
- **Role-Based Access Control (RBAC)**: Three-tier permission system
  - **Students**: Submit and track their own reports
  - **Staff**: Manage assigned reports, view all incidents, access team management
  - **Admins/Superadmins**: Full system access including user management and system statistics
- **Password Security**: Bcrypt hashing with complexity requirements

### 📊 Reporting System

#### Crime Reports
- Document security incidents (theft, vandalism, harassment, etc.)
- Upload photographic evidence
- Specify location with campus/building details
- Track incident severity and urgency
- View real-time status updates

#### Facility Reports
- Report infrastructure issues (broken equipment, maintenance needs)
- Categorize by facility type and urgency
- Upload supporting images
- Track resolution progress

### 👥 User Dashboards

#### Student Dashboard
- View personal report history
- Track report status (Pending → In Progress → Resolved/Rejected)
- Access campus emergency contacts
- View campus-wide announcements
- Submit new reports with file attachments

#### Staff Dashboard
- View all assigned reports
- Manage report workflows (accept, progress, resolve, reject)
- Access team collaboration tools
- View system-wide statistics
- Create and manage campus announcements
- Generate resolution reports

#### Admin Dashboard
- User management (create, update, deactivate accounts)
- System-wide analytics and statistics
- Report assignment and reassignment
- Team management and staff allocation
- Emergency services directory management
- Full audit trail and activity logs

### 📈 Statistics & Analytics
- Crime hotspot identification
- Facility issue trends
- Response time metrics
- Status distribution charts (Pending, In Progress, Resolved)
- Report volume tracking by type, location, and time period
- Staff performance and assignment distribution

### 🚨 Emergency Services Directory
- National emergency contacts (Police, Fire, Ambulance)
- UiTM campus-specific auxiliary police
- Quick-access hotlines and email contacts
- State-wise emergency service listings

### 📢 Announcement System
- Campus-wide notifications
- Priority-based announcements (High, Medium, Low)
- Targeted announcements by user role
- Announcement archiving and management

### 📁 File Upload System
- Multi-file image uploads (PNG, JPG, JPEG, WEBP)
- File size validation (max 5MB per file)
- Secure storage with unique identifiers
- Preview and management interface

---

## 💼 Use Cases

### For Students
1. **Incident Reporting**: Student witnesses theft in library, submits crime report with details and photos
2. **Facility Complaints**: Student reports broken air conditioning in classroom, tracks repair progress
3. **Status Tracking**: Student checks dashboard to see if reported vandalism has been assigned to security staff
4. **Emergency Access**: Student quickly finds campus auxiliary police number during late-night emergency

### For Staff (Security/Maintenance)
1. **Assignment Management**: Security officer receives notification of new theft report, accepts assignment
2. **Investigation Workflow**: Staff updates report status to "In Progress" while conducting investigation
3. **Resolution Documentation**: Maintenance staff marks facility issue as "Resolved" after repair completion
4. **Team Coordination**: Staff views reports assigned to their team, collaborates on complex incidents
5. **Announcement Broadcasting**: Staff posts safety advisory announcement after security incident

### For Administrators
1. **Resource Allocation**: Admin analyzes crime hotspots, reallocates security patrols accordingly
2. **User Management**: Admin creates accounts for new campus security officers
3. **Performance Monitoring**: Admin reviews average report resolution times across teams
4. **Trend Analysis**: Admin generates monthly report on facility maintenance trends for budgeting
5. **Policy Development**: Admin uses platform data to develop new campus safety policies

### For Campus Management
1. **Strategic Planning**: Management reviews annual crime statistics for security budget allocation
2. **Compliance Reporting**: Export incident data for university governance requirements
3. **Risk Assessment**: Identify recurring facility issues for infrastructure upgrade planning
4. **Community Engagement**: Transparent reporting system builds trust with student community

---

## 🎯 Purpose & Benefits

### Primary Objectives
1. **Centralization**: Single source of truth for all campus incidents and facility issues
2. **Accountability**: Clear assignment and tracking of report ownership
3. **Transparency**: Students can track their reports from submission to resolution
4. **Efficiency**: Automated workflows reduce response times
5. **Data-Driven Decisions**: Analytics enable evidence-based policy and resource allocation

### Benefits by Stakeholder

#### Students
- ✅ Convenient 24/7 online reporting
- ✅ Real-time status updates
- ✅ Faster issue resolution
- ✅ Increased safety awareness through announcements
- ✅ Empowerment to contribute to campus safety

#### Staff
- ✅ Organized workflow management
- ✅ Clear prioritization of incidents
- ✅ Team collaboration tools
- ✅ Performance tracking and accountability
- ✅ Reduced manual paperwork

#### Administrators
- ✅ Comprehensive system oversight
- ✅ Data-driven resource allocation
- ✅ Compliance and audit trails
- ✅ Trend identification and prevention
- ✅ Improved campus safety outcomes

#### Institution
- ✅ Enhanced campus security
- ✅ Better facility maintenance
- ✅ Improved student satisfaction
- ✅ Risk mitigation and liability reduction
- ✅ Positive institutional reputation

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Client (Browser)                       │
│  Next.js 15 App Router + React 19 + TypeScript + Tailwind  │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS/REST API
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Next.js API Routes Layer                    │
│           (Proxy to Backend + Server-Side Logic)            │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Express.js Backend API                     │
│          (Authentication, Business Logic, Routing)           │
└────────────────────────┬────────────────────────────────────┘
                         │ Oracle DB Protocol
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                     Oracle Database                          │
│     (Accounts, Reports, Crimes, Facilities, Assignments)    │
└─────────────────────────────────────────────────────────────┘
```

### Frontend Architecture
- **Framework**: Next.js 15 with App Router (React Server Components + Client Components)
- **State Management**: React Context API (Auth Provider)
- **Form Handling**: React Hook Form + Zod validation
- **UI Components**: shadcn/ui (Radix UI primitives + Tailwind CSS)
- **Routing**: File-based routing with route groups
- **Data Fetching**: Native fetch API with SWR patterns

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Database Driver**: node-oracledb (Oracle's official driver)
- **Authentication**: JWT tokens stored in HttpOnly cookies
- **Middleware**: CORS, JSON parsing, custom auth middleware
- **File Storage**: Local filesystem with organized uploads directory

### Database Schema (Oracle)
Key tables:
- `ACCOUNT` - User accounts with roles
- `STUDENT` - Student-specific information
- `STAFF` - Staff-specific information
- `CRIME` - Crime incident reports
- `FACILITY` - Facility maintenance reports
- `REPORT_ASSIGNMENT` - Staff-to-report assignments
- `RESOLUTION` - Report resolution documentation
- `ANNOUNCEMENT` - Campus announcements
- `EMERGENCY_CONTACT` - Emergency services directory
- `TEAM` - Staff team organization
- `POLICE` - Police involvement tracking

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15.4.6](https://nextjs.org/) (React 19)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives)
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Notifications**: Sonner (toast notifications)
- **Image Cropping**: react-easy-crop
- **Carousel**: Embla Carousel

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 4.18
- **Database**: Oracle Database (via oracledb 6.10)
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **Environment**: dotenv for configuration
- **CORS**: cors middleware

### Development Tools
- **Package Manager**: npm
- **Linter**: ESLint 9 with Next.js config
- **E2E Testing**: Playwright
- **Git Hooks**: Husky + lint-staged
- **Code Formatting**: Prettier (via lint-staged)

### DevOps & Deployment
- **Hosting**: Vercel (recommended) or custom server
- **Database**: Oracle Database 21c or higher
- **Environment**: Development, Staging, Production

---

## 📦 Prerequisites

Before setting up the project, ensure you have:

### Required Software
- **Node.js**: Version 20.x or higher ([Download](https://nodejs.org/))
- **npm**: Version 10.x or higher (comes with Node.js)
- **Oracle Database**: Version 21c or higher
  - Oracle Express Edition (XE) for development
  - Oracle Instant Client installed on your machine
- **Git**: For version control

### System Requirements
- **OS**: macOS, Linux, or Windows 10/11
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: At least 2GB free space

### Oracle Database Setup
1. Install Oracle Database XE or Enterprise Edition
2. Create a pluggable database (PDB) or use default
3. Note your connection details:
   - Username (e.g., `PDBADMIN`)
   - Password
   - Connection string (e.g., `localhost:1521/FREEPDB1`)

### Knowledge Prerequisites
- Basic understanding of React/Next.js
- Familiarity with REST APIs
- Oracle SQL basics
- Command line/terminal usage

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-organization/cybercrime-platform.git
cd cybercrime-platform
```

### 2. Frontend Setup

#### Install Dependencies
```bash
npm install
```

#### Environment Configuration
Create `.env.local` in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001

# Environment
NODE_ENV=development

# Site URL (for SEO)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional: Analytics, etc.
```

#### Verify Setup
```bash
npm run check:env
```

### 3. Backend Setup

#### Navigate to Backend Directory
```bash
cd backend/cybercrime-api
```

#### Install Backend Dependencies
```bash
npm install
```

#### Backend Environment Configuration
Create `.env` file in `backend/cybercrime-api/`:

```bash
# Database Configuration
DB_USER=PDBADMIN
DB_PASSWORD=your_password
DB_CONNECT_STRING=localhost:1521/FREEPDB1

# JWT Secret (generate a secure random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server Configuration
PORT=3001
FRONTEND_URL=http://localhost:3000

# Session Configuration
COOKIE_SECRET=your_cookie_secret_change_in_production
```

#### Set Oracle Environment Variables
Add to your shell profile (`.zshrc`, `.bashrc`, etc.):

```bash
# Oracle Instant Client (adjust path to your installation)
export DYLD_LIBRARY_PATH=/path/to/instantclient_19_8:$DYLD_LIBRARY_PATH  # macOS
# OR
export LD_LIBRARY_PATH=/path/to/instantclient_19_8:$LD_LIBRARY_PATH      # Linux
```

Reload your shell:
```bash
source ~/.zshrc  # or source ~/.bashrc
```

### 4. Database Schema Setup

#### Create Database Tables
Run the SQL scripts in order (located in `backend/cybercrime-api/database/`):

```bash
# Connect to Oracle SQL*Plus or SQL Developer
sqlplus PDBADMIN/your_password@localhost:1521/FREEPDB1

# Run schema creation scripts
@database/schema.sql
@database/seed.sql  # Optional: sample data
```

Or use the built-in seeder (if available):
```bash
cd backend/cybercrime-api
npm run seed
```

### 5. Start the Application

#### Option A: Start Both Servers Manually

**Terminal 1 - Backend:**
```bash
cd backend/cybercrime-api
npm start
# Backend running on http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
# From project root
npm run dev
# Frontend running on http://localhost:3000
```

#### Option B: Using Make (if Makefile exists)
```bash
make dev
```

### 6. Verify Installation

1. Open browser to [http://localhost:3000](http://localhost:3000)
2. You should see the landing page
3. Check backend health: [http://localhost:3001/api/test](http://localhost:3001/api/test)
4. Try logging in with seeded credentials (check seed data)

### 7. Create First Admin Account

If no admin exists, use SQL to manually create one:

```sql
-- Connect to Oracle
INSERT INTO ACCOUNT (ACCOUNT_ID, NAME, EMAIL, PASSWORD_HASH, ACCOUNT_TYPE, CREATED_AT, UPDATED_AT)
VALUES (account_seq.NEXTVAL, 'Admin User', 'admin@uitm.edu.my', 
        '$2a$10$HashedPasswordHere', 'STAFF', SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO STAFF (STAFF_ID, ACCOUNT_ID, ROLE, DEPARTMENT, POSITION)
VALUES (staff_seq.NEXTVAL, account_seq.CURRVAL, 'superadmin', 'IT Security', 'System Administrator');

COMMIT;
```

Then use bcrypt to hash your password (use Node.js REPL):
```javascript
const bcrypt = require('bcryptjs');
console.log(bcrypt.hashSync('YourPassword123!', 10));
```

---

## 📖 Usage Guide

### For Students

#### 1. Sign Up
1. Navigate to `/auth/sign-up`
2. Use your UiTM student email (`@student.uitm.edu.my`)
3. Set a strong password (min 8 characters, uppercase, lowercase, number, special char)
4. Fill in student details (ID, program, semester, year)
5. Verify email (if email verification is enabled)

#### 2. Submit a Report
1. Login at `/auth/login`
2. Click "Submit Report" from dashboard
3. Choose report type (Crime or Facility)
4. Fill in required fields:
   - Title (brief description)
   - Description (detailed account)
   - Location (building/area)
   - Severity/Urgency
   - Upload photos (optional)
5. Submit and receive confirmation

#### 3. Track Reports
1. View "My Reports" section on dashboard
2. Click report for detailed status
3. See assigned staff and progress updates
4. Receive status notifications (Pending → In Progress → Resolved)

### For Staff

#### 1. Access Reports
1. Login with staff credentials (`@uitm.edu.my`)
2. View assigned reports on dashboard
3. Filter by status, type, date, location
4. Access full report details including evidence photos

#### 2. Manage Reports
1. Accept assigned report
2. Update status to "In Progress"
3. Add investigation notes
4. Upload resolution photos
5. Mark as "Resolved" or "Rejected" with explanation

#### 3. Create Announcements
1. Navigate to `/dashboard/announcement`
2. Click "Create Announcement"
3. Set title, content, priority (High/Medium/Low)
4. Target specific user roles or all users
5. Publish announcement

#### 4. Team Collaboration
1. View team members at `/dashboard/team`
2. See reports assigned to team
3. Coordinate on complex incidents
4. Transfer report ownership if needed

### For Administrators

#### 1. User Management
1. Navigate to `/dashboard/user-management`
2. View all accounts (students and staff)
3. Create new accounts manually
4. Update user roles and permissions
5. Deactivate problematic accounts

#### 2. Report Assignment
1. View unassigned reports
2. Click "Assign" on report
3. Select appropriate staff member or team
4. Add assignment notes
5. Monitor assignment completion

#### 3. View Statistics
1. Access `/dashboard/statistic`
2. View charts and metrics:
   - Total reports by type
   - Status distribution
   - Crime hotspots
   - Resolution time averages
   - Staff performance
3. Export data for reporting

#### 4. System Configuration
1. Manage emergency contacts directory
2. Update facility categories
3. Configure crime types
4. Set system-wide settings

---

## 🔌 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Authentication Endpoints

#### Register New Account
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@student.uitm.edu.my",
  "password": "SecurePass123!",
  "account_type": "STUDENT",
  "contact_number": "0123456789",
  "studentID": "2021234567",
  "program": "CS110",
  "semester": 1,
  "year_of_study": 1
}

Response: 201 Created
{
  "message": "Registration successful",
  "account_id": 123
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@student.uitm.edu.my",
  "password": "SecurePass123!"
}

Response: 200 OK
Set-Cookie: token=jwt_token; HttpOnly
{
  "message": "Login successful",
  "user": { "ACCOUNT_ID": 123, "NAME": "John Doe", "ROLE": "STUDENT" }
}
```

#### Logout
```http
POST /auth/logout
Cookie: token=jwt_token

Response: 200 OK
{ "message": "Logout successful" }
```

### Report Endpoints

#### Get All Reports (Staff Only)
```http
GET /reports
Cookie: token=jwt_token

Response: 200 OK
[
  {
    "REPORT_ID": 1,
    "TITLE": "Laptop theft",
    "TYPE": "CRIME",
    "STATUS": "PENDING",
    "SUBMITTED_AT": "2024-01-15T10:30:00Z"
  }
]
```

#### Create Crime Report
```http
POST /crimes
Content-Type: application/json
Cookie: token=jwt_token

{
  "TITLE": "Vandalism in parking lot",
  "DESCRIPTION": "Car window smashed",
  "LOCATION": "Parking B, Level 2",
  "SEVERITY": "MEDIUM",
  "CATEGORY": "VANDALISM"
}

Response: 201 Created
{ "crime_id": 456 }
```

#### Update Report Status (Staff Only)
```http
PUT /reports/:id/status
Content-Type: application/json
Cookie: token=jwt_token

{
  "status": "IN_PROGRESS",
  "notes": "Investigation started"
}

Response: 200 OK
{ "message": "Status updated" }
```

### Dashboard Endpoints

#### Get Dashboard Statistics
```http
GET /dashboard/stats
Cookie: token=jwt_token

Response: 200 OK
{
  "totalCrime": 45,
  "totalFacility": 32,
  "allPending": 12,
  "allInProgress": 8,
  "allResolved": 57,
  "totalReports": 77
}
```

### Emergency Contacts

#### Get Public Emergency Contacts
```http
GET /emergency/public

Response: 200 OK
[
  {
    "EMERGENCY_ID": 1,
    "NAME": "UiTM Shah Alam Auxiliary Police",
    "TYPE": "UiTM Campus Security",
    "PHONE": "03-55444911",
    "STATE": "SELANGOR"
  }
]
```

For complete API documentation, see [API_ROUTES.md](docs/API_ROUTES.md).

---

## 📁 Project Structure

```
cybercrime-platform/
├── app/                          # Next.js App Router
│   ├── (landing-page)/           # Public pages group
│   │   ├── page.tsx              # Landing page
│   │   ├── contact/              # Contact page
│   │   ├── emergency-services/   # Emergency directory
│   │   ├── faq/                  # FAQ page
│   │   └── report/               # Public latest reports
│   ├── (protected-routes)/       # Authenticated pages group
│   │   ├── dashboard/            # User dashboards
│   │   │   ├── page.tsx          # Main dashboard (role-based)
│   │   │   ├── crime/            # Crime management
│   │   │   ├── facility/         # Facility management
│   │   │   ├── announcement/     # Announcements
│   │   │   ├── statistic/        # Analytics
│   │   │   ├── user-management/  # Admin: user CRUD
│   │   │   └── team/             # Team management
│   │   └── (app-guide)/          # User guides
│   ├── auth/                     # Auth pages (login, signup, etc.)
│   ├── api/                      # Next.js API routes (proxy layer)
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
│
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── auth/                     # Auth-related components
│   ├── dashboard/                # Dashboard components
│   ├── report/                   # Report components
│   └── landing/                  # Landing page components
│
├── backend/                      # Express.js backend
│   └── cybercrime-api/
│       ├── server.js             # Entry point
│       ├── database/             # DB connection & schemas
│       ├── routes/               # Express routes
│       ├── middleware/           # Auth & validation middleware
│       └── helper/               # Utility functions
│
├── lib/                          # Shared utilities
│   ├── api/                      # API client functions
│   ├── context/                  # React contexts
│   ├── utils/                    # Helper functions
│   ├── types.ts                  # TypeScript types
│   └── constant.ts               # App constants
│
├── hooks/                        # Custom React hooks
├── public/                       # Static assets & uploads
├── docs/                         # Documentation
├── tests/                        # E2E tests (Playwright)
├── components.json               # shadcn/ui config
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript config
└── package.json                  # Dependencies
```

---

## 🔒 Security

### Implemented Security Measures

1. **Authentication**
   - JWT tokens with expiry (24 hours)
   - HttpOnly cookies (prevents XSS token theft)
   - Bcrypt password hashing (10 rounds)
   - Password complexity requirements

2. **Authorization**
   - Role-based middleware on backend routes
   - Client-side route guards
   - API endpoint protection

3. **Input Validation**
   - Zod schema validation on frontend
   - Server-side validation on backend
   - SQL injection prevention (parameterized queries)

4. **Data Protection**
   - CORS configured for specific frontend origin
   - Secure headers (helmet.js recommended)
   - Environment variables for secrets

5. **File Upload Security**
   - File type validation (images only)
   - File size limits (5MB max)
   - Unique filename generation

### Best Practices for Production

- [ ] Enable HTTPS (TLS/SSL certificates)
- [ ] Use strong JWT secret (256-bit random string)
- [ ] Implement rate limiting (express-rate-limit)
- [ ] Add security headers (helmet.js)
- [ ] Enable CSRF protection
- [ ] Set up database backups
- [ ] Configure logging and monitoring
- [ ] Use environment-specific configs
- [ ] Implement email verification
- [ ] Add two-factor authentication (2FA)
- [ ] Regular security audits (`npm audit`)

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Getting Started
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit changes (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Standards
- Follow existing code style (ESLint configuration)
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for API changes
- Ensure all tests pass

### Reporting Issues
- Use GitHub Issues
- Include detailed description
- Provide steps to reproduce
- Include screenshots if applicable
- Mention your environment (OS, Node version, etc.)

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

**Built with ❤️ for UiTM Community**

*Last Updated: December 2024 | Version 1.0.0*
