# CSCI Data Files
## Cybercrime Awareness and Reporting Platform (CARP)

**Document Version:** 1.0  
**Date:** January 4, 2026  
**Project:** Cybercrime Platform - Data Files Specification

---

## Table of Contents

1. [Data Files Overview](#1-data-files-overview)
2. [Database Files](#2-database-files)
3. [Application Configuration Files](#3-application-configuration-files)
4. [Source Code Files](#4-source-code-files)
5. [Static Asset Files](#5-static-asset-files)
6. [Log Files](#6-log-files)
7. [Backup Files](#7-backup-files)
8. [Temporary Files](#8-temporary-files)
9. [File Management Procedures](#9-file-management-procedures)

---

## 1. Data Files Overview

### 1.1 File Categories

```
CARP Data Files
├── Database Files
│   ├── Schema definition files (.sql)
│   ├── Migration scripts (.sql)
│   ├── Seed data files (.sql)
│   └── Backup files (.dmp)
│
├── Configuration Files
│   ├── Environment variables (.env)
│   ├── Database configuration (.ts)
│   ├── Application config (.json, .ts, .js)
│   └── Build configuration files
│
├── Source Code Files
│   ├── TypeScript source (.ts)
│   ├── TypeScript definitions (.d.ts)
│   ├── JavaScript compiled (.js)
│   └── Source maps (.js.map)
│
├── Asset Files
│   ├── User uploads (images, documents)
│   ├── Static images (.jpg, .png, .svg)
│   ├── Email templates (.html)
│   └── Documentation (.md)
│
├── Log Files
│   ├── Application logs (.log)
│   ├── Error logs (.log)
│   ├── Access logs (.log)
│   └── Audit trails (.log)
│
└── Temporary Files
    ├── Session data
    ├── Cache files
    └── Temporary uploads
```

### 1.2 File Storage Locations

| File Type | Location | Purpose |
|-----------|----------|---------|
| Database Schema | `/backend/cybercrime-api-v2/database/*.sql` | DDL scripts |
| Configuration | `/.env.local`, `/backend/cybercrime-api-v2/.env` | App settings |
| Source Code | `/app/**/*.tsx`, `/backend/src/**/*.ts` | Application logic |
| Compiled Code | `/.next/`, `/backend/dist/` | Production builds |
| User Uploads | `/public/uploads/` | User-generated files |
| Static Assets | `/public/images/` | Public images |
| Email Templates | `/email-templates/*.html` | Email layouts |
| Logs | `/logs/` | Application logs |
| Backups | `/backups/` | Database backups |
| Documentation | `/docs/*.md` | Technical docs |

---

## 2. Database Files

### 2.1 Schema Definition Files

#### 2.1.1 schema.sql
**Location:** `/backend/cybercrime-api-v2/database/schema.sql`  
**Purpose:** Complete database schema definition for Oracle Database  
**Size:** ~25 KB  
**Format:** Oracle SQL (PL/SQL)

**Contents:**
```sql
-- Sequences (7 sequences)
- account_seq
- report_seq
- announcement_seq
- assignment_seq
- emergency_seq
- generate_seq
- resolution_seq

-- Tables (13 tables)
- ACCOUNT
- STUDENT
- STAFF
- REPORT
- CRIME
- REPORT_ASSIGNMENT
- EMERGENCY_INFO
- UITM_AUXILIARY_POLICE
- ANNOUNCEMENT
- GENERATED_REPORT
- RESOLUTION
- PASSWORD_RESET_TOKENS

-- Indexes (20+ indexes)
- Performance optimization indexes
- Unique constraints
- Foreign key indexes

-- Triggers (10+ triggers)
- Auto-increment ID triggers
- Timestamp update triggers
- Cascade creation triggers

-- Constraints
- Primary keys
- Foreign keys
- Check constraints
- Unique constraints
```

**Usage:**
```bash
# Run schema creation
sqlplus PDBADMIN/PDBADMIN@localhost:1521/CYBERCRIME @schema.sql
```

**Version Control:** Git tracked  
**Backup:** Daily automated backup  
**Execution Time:** ~2 minutes

---

#### 2.1.2 create_password_reset_table.sql
**Location:** `/backend/cybercrime-api-v2/database/create_password_reset_table.sql`  
**Purpose:** Password reset token table creation  
**Size:** ~2 KB  
**Format:** Oracle SQL

**Contents:**
```sql
-- PASSWORD_RESET_TOKENS table
- ID (Primary Key, Identity)
- EMAIL (Unique)
- TOKEN_HASH (Unique)
- EXPIRES_AT
- USED (Boolean flag)
- CREATED_AT

-- Indexes
- idx_prt_email
- idx_prt_token
- idx_prt_expires_at
- idx_prt_email_used
```

**Usage:**
```bash
sqlplus PDBADMIN/PDBADMIN@localhost:1521/CYBERCRIME @create_password_reset_table.sql
```

---

### 2.2 Database Backup Files

#### 2.2.1 Full Database Backup
**Location:** `/backups/full/cybercrime_backup_YYYYMMDD.dmp`  
**Purpose:** Complete database export  
**Format:** Oracle Data Pump (.dmp)  
**Frequency:** Daily at 2:00 AM  
**Retention:** 30 days rolling

**Backup Command:**
```bash
expdp PDBADMIN/PDBADMIN@CYBERCRIME \
  directory=BACKUP_DIR \
  dumpfile=cybercrime_backup_$(date +%Y%m%d).dmp \
  logfile=backup_$(date +%Y%m%d).log \
  full=y \
  compression=all
```

**Restore Command:**
```bash
impdp PDBADMIN/PDBADMIN@CYBERCRIME \
  directory=BACKUP_DIR \
  dumpfile=cybercrime_backup_YYYYMMDD.dmp \
  logfile=restore_YYYYMMDD.log \
  full=y
```

---

#### 2.2.2 Incremental Backup
**Location:** `/backups/incremental/cybercrime_incr_YYYYMMDD_HH.dmp`  
**Purpose:** Changed data only  
**Format:** Oracle Data Pump (.dmp)  
**Frequency:** Hourly  
**Retention:** 7 days

**Tables Backed Up:**
- ACCOUNT
- STUDENT
- STAFF
- REPORT
- CRIME
- REPORT_ASSIGNMENT

---

### 2.3 Seed Data Files

#### 2.3.1 seed_emergency_contacts.sql
**Location:** `/backend/cybercrime-api-v2/database/seed_emergency_contacts.sql`  
**Purpose:** Initial emergency contact data  
**Size:** ~10 KB  
**Format:** Oracle SQL INSERT statements

**Sample Content:**
```sql
INSERT INTO EMERGENCY_INFO (NAME, ADDRESS, PHONE, STATE, TYPE, HOTLINE)
VALUES ('Polis Diraja Malaysia - Johor', '...', '07-2222222', 'Johor', 'Police', '999');
```

---

#### 2.3.2 seed_admin_users.sql
**Location:** `/backend/cybercrime-api-v2/database/seed_admin_users.sql`  
**Purpose:** Initial admin accounts  
**Size:** ~2 KB  
**Format:** Oracle SQL INSERT statements

**Sample Content:**
```sql
INSERT INTO ACCOUNT (NAME, EMAIL, PASSWORD_HASH, ACCOUNT_TYPE)
VALUES ('System Admin', 'admin@cybercrime.uitm.edu.my', '$2b$10$...', 'STAFF');

INSERT INTO STAFF (ACCOUNT_ID, ROLE, DEPARTMENT)
VALUES (1, 'SUPERADMIN', 'IT Security');
```

---

## 3. Application Configuration Files

### 3.1 Environment Configuration

#### 3.1.1 .env.local (Frontend)
**Location:** `/.env.local`  
**Purpose:** Frontend environment variables  
**Format:** KEY=VALUE pairs  
**Security:** NOT version controlled (.gitignore)

**Contents:**
```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v2

# Application Settings
NEXT_PUBLIC_APP_NAME=Cybercrime Platform
NEXT_PUBLIC_APP_VERSION=2.0

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DEBUG=true
```

**File Size:** ~1 KB  
**Access:** Read at build time

---

#### 3.1.2 .env (Backend)
**Location:** `/backend/cybercrime-api-v2/.env`  
**Purpose:** Backend environment variables  
**Format:** KEY=VALUE pairs  
**Security:** NOT version controlled (.gitignore)

**Contents:**
```bash
# Server Configuration
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database Configuration
DB_USER=PDBADMIN
DB_PASSWORD=PDBADMIN
DB_CONNECT_STRING=localhost:1521/CYBERCRIME

# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@example.com
SMTP_PASS=your-password

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./public/uploads

# Logging
LOG_LEVEL=debug
LOG_FILE=./logs/app.log
```

**File Size:** ~2 KB  
**Access:** Read at runtime

---

#### 3.1.3 .env.example
**Location:** `/.env.example`, `/backend/cybercrime-api-v2/.env.example`  
**Purpose:** Template for environment variables  
**Format:** KEY=VALUE pairs  
**Security:** Version controlled (Git)

**Usage:**
```bash
cp .env.example .env.local
cp backend/cybercrime-api-v2/.env.example backend/cybercrime-api-v2/.env
```

---

### 3.2 Application Configuration Files

#### 3.2.1 package.json (Frontend)
**Location:** `/package.json`  
**Purpose:** Frontend dependencies and scripts  
**Format:** JSON  
**Size:** ~3 KB

**Key Sections:**
```json
{
  "name": "app-template",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "15.4.6",
    "react": "19.1.0",
    "@radix-ui/react-*": "latest",
    "zod": "^4.0.17"
  }
}
```

---

#### 3.2.2 package.json (Backend)
**Location:** `/backend/cybercrime-api-v2/package.json`  
**Purpose:** Backend dependencies and scripts  
**Format:** JSON  
**Size:** ~2 KB

**Key Sections:**
```json
{
  "name": "cybercrime-api-v2",
  "version": "2.0.0",
  "scripts": {
    "dev": "ts-node-dev src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "oracledb": "^6.0.0",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2"
  }
}
```

---

#### 3.2.3 tsconfig.json
**Location:** `/tsconfig.json`, `/backend/cybercrime-api-v2/tsconfig.json`  
**Purpose:** TypeScript compiler configuration  
**Format:** JSON with comments  
**Size:** ~1 KB

**Frontend tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

**Backend tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

#### 3.2.4 next.config.ts
**Location:** `/next.config.ts`  
**Purpose:** Next.js framework configuration  
**Format:** TypeScript  
**Size:** ~2 KB

**Contents:**
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:4000/api/:path*',
      },
    ];
  },
};

export default nextConfig;
```

---

#### 3.2.5 components.json
**Location:** `/components.json`  
**Purpose:** shadcn/ui component configuration  
**Format:** JSON  
**Size:** ~1 KB

**Contents:**
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "zinc",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  }
}
```

---

#### 3.2.6 middleware.ts
**Location:** `/middleware.ts`  
**Purpose:** Next.js middleware for route protection  
**Format:** TypeScript  
**Size:** ~2 KB

**Contents:**
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isProtectedPage = request.nextUrl.pathname.startsWith('/dashboard');

  // Redirect logic
  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};
```

---

## 4. Source Code Files

### 4.1 Backend Source Structure

```
backend/cybercrime-api-v2/src/
├── server.ts                      # Main entry point (200 lines)
├── models/                        # Domain models (13 files)
│   ├── base/
│   │   └── BaseModel.ts          # Abstract base class (120 lines)
│   ├── Account.ts                # Account entity (150 lines)
│   ├── Student.ts                # Student entity (70 lines)
│   ├── Staff.ts                  # Staff entity (90 lines)
│   ├── Report.ts                 # Report entity (140 lines)
│   ├── Crime.ts                  # Crime entity (80 lines)
│   ├── Announcement.ts           # Announcement entity (150 lines)
│   ├── EmergencyContact.ts       # Emergency entity (110 lines)
│   ├── Police.ts                 # Police entity (60 lines)
│   ├── ReportAssignment.ts       # Assignment entity (100 lines)
│   ├── Resolution.ts             # Resolution entity (80 lines)
│   └── GeneratedReport.ts        # Generated report entity (90 lines)
│
├── repositories/                  # Data access layer (14 files)
│   ├── AccountRepository.ts      # Account data access (300 lines)
│   ├── StudentRepository.ts      # Student data access (200 lines)
│   ├── StaffRepository.ts        # Staff data access (250 lines)
│   ├── ReportRepository.ts       # Report data access (400 lines)
│   ├── CrimeRepository.ts        # Crime data access (200 lines)
│   ├── AnnouncementRepository.ts # Announcement data access (250 lines)
│   ├── EmergencyContactRepository.ts # Emergency data access (200 lines)
│   ├── PoliceRepository.ts       # Police data access (150 lines)
│   ├── ReportAssignmentRepository.ts # Assignment data access (200 lines)
│   ├── ResolutionRepository.ts   # Resolution data access (180 lines)
│   ├── GeneratedReportRepository.ts # Gen. report data access (220 lines)
│   ├── TeamRepository.ts         # Team data access (150 lines)
│   └── PasswordResetTokenRepository.ts # Token data access (150 lines)
│
├── services/                      # Business logic layer (11 files)
│   ├── AuthService.ts            # Authentication logic (400 lines)
│   ├── StudentService.ts         # Student logic (250 lines)
│   ├── StaffService.ts           # Staff logic (280 lines)
│   ├── ReportService.ts          # Report logic (350 lines)
│   ├── CrimeService.ts           # Crime logic (250 lines)
│   ├── FacilityService.ts        # Facility logic (230 lines)
│   ├── AnnouncementService.ts    # Announcement logic (280 lines)
│   ├── EmergencyService.ts       # Emergency logic (220 lines)
│   ├── PoliceService.ts          # Police logic (180 lines)
│   ├── TeamService.ts            # Team logic (200 lines)
│   └── EmailService.ts           # Email logic (150 lines)
│
├── controllers/                   # HTTP handlers (16 files)
│   ├── AuthController.ts         # Auth endpoints (350 lines)
│   ├── AccountController.ts      # Account endpoints (200 lines)
│   ├── StudentController.ts      # Student endpoints (220 lines)
│   ├── StaffController.ts        # Staff endpoints (240 lines)
│   ├── ReportController.ts       # Report endpoints (400 lines)
│   ├── CrimeController.ts        # Crime endpoints (250 lines)
│   ├── FacilityController.ts     # Facility endpoints (230 lines)
│   ├── AnnouncementController.ts # Announcement endpoints (300 lines)
│   ├── EmergencyController.ts    # Emergency endpoints (250 lines)
│   ├── PoliceController.ts       # Police endpoints (200 lines)
│   ├── ReportAssignmentController.ts # Assignment endpoints (250 lines)
│   ├── ResolutionController.ts   # Resolution endpoints (220 lines)
│   ├── GeneratedReportController.ts # Gen. report endpoints (280 lines)
│   ├── TeamController.ts         # Team endpoints (200 lines)
│   ├── UploadController.ts       # File upload endpoints (180 lines)
│   └── AIController.ts           # AI endpoints (150 lines)
│
├── routes/                        # API routing (16 files)
│   ├── index.ts                  # Main router (100 lines)
│   ├── authRoutes.ts             # Auth routes (80 lines)
│   ├── accountRoutes.ts          # Account routes (50 lines)
│   ├── studentRoutes.ts          # Student routes (60 lines)
│   ├── staffRoutes.ts            # Staff routes (70 lines)
│   ├── reportRoutes.ts           # Report routes (100 lines)
│   ├── crimeRoutes.ts            # Crime routes (60 lines)
│   ├── facilityRoutes.ts         # Facility routes (55 lines)
│   ├── announcementRoutes.ts     # Announcement routes (80 lines)
│   ├── emergencyRoutes.ts        # Emergency routes (70 lines)
│   ├── policeRoutes.ts           # Police routes (55 lines)
│   ├── assignmentRoutes.ts       # Assignment routes (70 lines)
│   ├── resolutionRoutes.ts       # Resolution routes (60 lines)
│   ├── generatedReportRoutes.ts  # Gen. report routes (75 lines)
│   ├── teamRoutes.ts             # Team routes (60 lines)
│   └── uploadRoutes.ts           # Upload routes (50 lines)
│
├── middleware/                    # Request middleware (4 files)
│   ├── authMiddleware.ts         # JWT authentication (120 lines)
│   ├── roleMiddleware.ts         # Role authorization (80 lines)
│   ├── errorMiddleware.ts        # Error handling (150 lines)
│   └── validationMiddleware.ts   # Input validation (100 lines)
│
├── utils/                         # Utility functions (5 files)
│   ├── database.ts               # DB connection pool (150 lines)
│   ├── jwt.ts                    # JWT utilities (80 lines)
│   ├── password.ts               # Password hashing (60 lines)
│   ├── logger.ts                 # Logging utilities (100 lines)
│   └── fileUpload.ts             # File handling (120 lines)
│
└── types/                         # Type definitions (2 files)
    ├── enums.ts                  # Enumeration types (110 lines)
    └── express.types.d.ts        # Express extensions (30 lines)
```

**Total Backend Files:** ~70 TypeScript files  
**Total Lines of Code:** ~15,000 lines  
**Average File Size:** ~200 lines

---

### 4.2 Frontend Source Structure

```
app/
├── layout.tsx                     # Root layout (100 lines)
├── page.tsx                       # Home page (150 lines)
├── globals.css                    # Global styles (200 lines)
├── manifest.ts                    # PWA manifest (50 lines)
├── not-found.tsx                  # 404 page (50 lines)
├── robots.ts                      # Robots.txt generator (30 lines)
├── sitemap.ts                     # Sitemap generator (40 lines)
│
├── (landing-page)/                # Public pages
│   ├── layout.tsx                # Landing layout (80 lines)
│   ├── page.tsx                  # Landing page (200 lines)
│   ├── contact/page.tsx          # Contact page (150 lines)
│   ├── emergency-services/       # Emergency services
│   │   └── page.tsx              # (180 lines)
│   └── faq/page.tsx              # FAQ page (200 lines)
│
├── (protected-routes)/            # Authenticated pages
│   ├── layout.tsx                # Protected layout (100 lines)
│   ├── dashboard/                # Dashboard module
│   │   ├── page.tsx              # Dashboard home (250 lines)
│   │   ├── reports/              # Report management
│   │   │   ├── page.tsx          # Reports list (300 lines)
│   │   │   ├── [id]/page.tsx    # Report detail (350 lines)
│   │   │   └── new/page.tsx     # Create report (400 lines)
│   │   ├── announcements/        # Announcements
│   │   │   ├── page.tsx          # List (250 lines)
│   │   │   ├── [id]/page.tsx    # Detail (200 lines)
│   │   │   └── new/page.tsx     # Create (300 lines)
│   │   └── profile/page.tsx     # User profile (250 lines)
│   │
│   └── (app-guide)/              # Application guide
│       └── page.tsx              # Guide page (180 lines)
│
├── auth/                          # Authentication pages
│   ├── layout.tsx                # Auth layout (70 lines)
│   ├── login/page.tsx            # Login page (200 lines)
│   ├── sign-up/page.tsx          # Registration (300 lines)
│   ├── forgot-password/page.tsx  # Password reset request (150 lines)
│   ├── reset-password/page.tsx   # Password reset (180 lines)
│   ├── sign-up-success/page.tsx  # Success page (80 lines)
│   └── error/page.tsx            # Auth error (100 lines)
│
└── api/                           # API route handlers
    ├── accounts/route.ts          # Account endpoints (150 lines)
    ├── auth/                      # Auth endpoints
    │   ├── login/route.ts         # (100 lines)
    │   ├── register/route.ts      # (120 lines)
    │   └── logout/route.ts        # (60 lines)
    ├── reports/route.ts           # Report endpoints (200 lines)
    ├── announcements/route.ts     # Announcement endpoints (180 lines)
    └── emergency/route.ts         # Emergency endpoints (120 lines)

components/
├── ui/                            # Base UI components (30 files)
│   ├── button.tsx                # Button component (150 lines)
│   ├── card.tsx                  # Card component (100 lines)
│   ├── dialog.tsx                # Dialog component (180 lines)
│   ├── form.tsx                  # Form component (250 lines)
│   ├── input.tsx                 # Input component (120 lines)
│   ├── select.tsx                # Select component (200 lines)
│   ├── table.tsx                 # Table component (300 lines)
│   └── [25+ more components]     # ...
│
├── auth/                          # Auth components (5 files)
│   ├── login-form.tsx            # Login form (200 lines)
│   ├── register-form.tsx         # Registration form (350 lines)
│   ├── password-reset-form.tsx   # Reset form (180 lines)
│   ├── protected-route.tsx       # Route guard (80 lines)
│   └── auth-provider.tsx         # Auth context (150 lines)
│
├── report/                        # Report components (10 files)
│   ├── report-form.tsx           # Report form (400 lines)
│   ├── report-card.tsx           # Report card (150 lines)
│   ├── report-list.tsx           # Report list (250 lines)
│   ├── report-detail.tsx         # Report detail (300 lines)
│   ├── report-status-badge.tsx   # Status badge (80 lines)
│   ├── columns.tsx               # Table columns (200 lines)
│   └── [4+ more components]      # ...
│
├── announcement/                  # Announcement components (8 files)
│   ├── announcementCard.tsx      # Card component (150 lines)
│   ├── announcementBadge.tsx     # Badge component (60 lines)
│   ├── announcementList.tsx      # List component (200 lines)
│   ├── announcementForm.tsx      # Form component (350 lines)
│   └── [4+ more components]      # ...
│
├── dashboard/                     # Dashboard components (10 files)
│   ├── stats-card.tsx            # Statistics card (120 lines)
│   ├── recent-reports.tsx        # Recent reports widget (180 lines)
│   ├── activity-feed.tsx         # Activity feed (200 lines)
│   ├── chart-components.tsx      # Charts (250 lines)
│   └── [6+ more components]      # ...
│
└── [Additional component folders...]

lib/
├── api/                           # API client utilities (8 files)
│   ├── client.ts                 # Base API client (200 lines)
│   ├── auth.ts                   # Auth API calls (150 lines)
│   ├── reports.ts                # Report API calls (250 lines)
│   ├── announcements.ts          # Announcement API calls (180 lines)
│   └── [4+ more files]           # ...
│
├── utils/                         # Utility functions (10 files)
│   ├── validation.ts             # Input validation (200 lines)
│   ├── formatting.ts             # Data formatting (150 lines)
│   ├── date-utils.ts             # Date utilities (100 lines)
│   └── [7+ more files]           # ...
│
├── context/                       # React context (4 files)
│   ├── auth-context.tsx          # Auth state (180 lines)
│   ├── theme-context.tsx         # Theme state (120 lines)
│   └── [2+ more files]           # ...
│
├── config/                        # Configuration (3 files)
│   ├── constants.ts              # App constants (100 lines)
│   ├── routes.ts                 # Route definitions (80 lines)
│   └── api-config.ts             # API config (60 lines)
│
├── constant.ts                    # Global constants (150 lines)
├── types.ts                       # Type definitions (250 lines)
├── utils.ts                       # Utility functions (200 lines)
├── seo.ts                         # SEO utilities (120 lines)
└── process.ts                     # Process utilities (80 lines)
```

**Total Frontend Files:** ~150 TypeScript/TSX files  
**Total Lines of Code:** ~25,000 lines  
**Average File Size:** ~165 lines

---

## 5. Static Asset Files

### 5.1 User Upload Files

#### 5.1.1 Upload Directory Structure
```
public/uploads/
├── reports/                       # Report attachments
│   ├── evidence/                 # Crime evidence
│   │   ├── IMG_20260104_001.jpg
│   │   ├── DOC_20260104_001.pdf
│   │   └── ...
│   └── facility/                 # Facility photos
│       ├── IMG_20260104_002.jpg
│       └── ...
│
├── announcements/                 # Announcement images
│   ├── poster_cybersecurity.png
│   ├── event_banner.jpg
│   └── ...
│
├── profiles/                      # User avatars
│   ├── user_1001.jpg
│   ├── user_1002.png
│   └── ...
│
└── resolutions/                   # Resolution evidence
    ├── RES_001_evidence.pdf
    └── ...
```

**File Naming Convention:**
```
Format: {type}_{date}_{sequence}.{ext}
Example: IMG_20260104_001.jpg
         DOC_20260104_002.pdf
         user_1001.jpg
```

**Allowed File Types:**
- **Images:** .jpg, .jpeg, .png, .gif, .webp
- **Documents:** .pdf, .doc, .docx
- **Maximum Size:** 10 MB per file
- **Storage Limit:** 100 GB total

**Access Control:**
- **Public Read:** No (authentication required)
- **Upload Permission:** Authenticated users only
- **Delete Permission:** Owners or admins only

---

### 5.2 Static Images

#### 5.2.1 Image Assets
```
public/images/
├── logo/
│   ├── logo.svg                  # Main logo (Vector)
│   ├── logo.png                  # Main logo (PNG, 512x512)
│   ├── logo-dark.svg             # Dark mode logo
│   └── favicon.ico               # Browser favicon
│
├── illustrations/
│   ├── hero-banner.svg           # Landing page hero
│   ├── empty-state.svg           # No data illustration
│   ├── error-404.svg             # 404 page
│   └── success.svg               # Success state
│
├── icons/
│   ├── app-icon-192.png          # PWA icon (192x192)
│   ├── app-icon-512.png          # PWA icon (512x512)
│   └── apple-touch-icon.png      # iOS icon
│
└── backgrounds/
    ├── auth-bg.jpg               # Auth page background
    └── dashboard-bg.svg          # Dashboard background
```

**Image Optimization:**
- Format: WebP preferred, PNG/JPEG fallback
- Compression: Lossy compression at 80% quality
- Responsive: Multiple sizes for different devices
- Lazy Loading: Below-the-fold images

---

### 5.3 Email Templates

#### 5.3.1 HTML Email Templates
```
email-templates/
├── auth-confirmation.html         # Account verification email
├── magic-link.html                # Magic link login email
├── password-reset.html            # Password reset email
└── README.md                      # Template documentation
```

**Template Structure:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>{{title}}</title>
  <style>
    /* Inline CSS for email compatibility */
  </style>
</head>
<body>
  <div class="container">
    <h1>{{heading}}</h1>
    <p>{{message}}</p>
    <a href="{{actionUrl}}" class="button">{{actionText}}</a>
  </div>
</body>
</html>
```

**Template Variables:**
- `{{userName}}` - Recipient name
- `{{actionUrl}}` - Call-to-action link
- `{{actionText}}` - Button text
- `{{expiryTime}}` - Link expiration time

**File Size:** 5-10 KB per template  
**Compatibility:** Tested on major email clients

---

## 6. Log Files

### 6.1 Application Logs

#### 6.1.1 Log Directory Structure
```
logs/
├── app.log                        # General application log
├── error.log                      # Error-only log
├── access.log                     # HTTP access log
├── database.log                   # Database query log
├── audit.log                      # Security audit trail
└── archived/                      # Archived logs
    ├── app_20260103.log.gz
    ├── error_20260103.log.gz
    └── ...
```

---

#### 6.1.2 app.log
**Location:** `/logs/app.log`  
**Purpose:** General application events  
**Format:** JSON Lines  
**Rotation:** Daily, keep 30 days  
**Max Size:** 100 MB before rotation

**Log Entry Format:**
```json
{
  "timestamp": "2026-01-04T10:30:15.123Z",
  "level": "info",
  "message": "User logged in successfully",
  "userId": 1001,
  "email": "student@example.com",
  "ip": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "requestId": "req-abc123"
}
```

---

#### 6.1.3 error.log
**Location:** `/logs/error.log`  
**Purpose:** Error and exception tracking  
**Format:** JSON Lines with stack traces  
**Rotation:** Daily, keep 90 days  
**Max Size:** 50 MB before rotation

**Error Entry Format:**
```json
{
  "timestamp": "2026-01-04T10:35:22.456Z",
  "level": "error",
  "message": "Database connection failed",
  "error": {
    "name": "OracleError",
    "message": "ORA-12170: TNS:Connect timeout occurred",
    "code": "ORA-12170",
    "stack": "Error: ORA-12170\n    at Connection.connect..."
  },
  "context": {
    "userId": 1001,
    "endpoint": "/api/v2/reports",
    "method": "POST"
  },
  "requestId": "req-def456"
}
```

---

#### 6.1.4 access.log
**Location:** `/logs/access.log`  
**Purpose:** HTTP request/response logging  
**Format:** Combined Log Format (Apache-style)  
**Rotation:** Daily, keep 7 days  
**Max Size:** 200 MB before rotation

**Log Entry Format:**
```
192.168.1.100 - - [04/Jan/2026:10:30:15 +0000] "POST /api/v2/reports HTTP/1.1" 201 1234 "-" "Mozilla/5.0..." 0.145
```

**Fields:**
1. IP Address
2. Identity (always -)
3. User ID (or -)
4. Timestamp
5. HTTP Method and Path
6. Status Code
7. Response Size (bytes)
8. Referer
9. User Agent
10. Response Time (seconds)

---

#### 6.1.5 audit.log
**Location:** `/logs/audit.log`  
**Purpose:** Security and compliance auditing  
**Format:** JSON Lines  
**Rotation:** Monthly, keep 5 years  
**Max Size:** 100 MB before rotation

**Audit Entry Format:**
```json
{
  "timestamp": "2026-01-04T10:40:00.789Z",
  "eventType": "REPORT_STATUS_CHANGE",
  "actor": {
    "userId": 2001,
    "email": "staff@example.com",
    "role": "STAFF"
  },
  "target": {
    "reportId": 5001,
    "previousStatus": "PENDING",
    "newStatus": "IN_PROGRESS"
  },
  "action": "UPDATE",
  "result": "SUCCESS",
  "ip": "192.168.1.101",
  "sessionId": "sess-xyz789"
}
```

**Audited Events:**
- User login/logout
- Report creation/update/deletion
- Status changes
- Role assignments
- Data exports
- Configuration changes
- Failed authentication attempts

---

### 6.2 Log Management

#### 6.2.1 Log Rotation Policy
```bash
# Logrotate configuration
/logs/*.log {
    daily
    rotate 30
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        systemctl reload app-service
    endscript
}
```

#### 6.2.2 Log Retention
| Log Type | Retention Period | Archive Format | Purpose |
|----------|-----------------|----------------|---------|
| app.log | 30 days | .gz | General troubleshooting |
| error.log | 90 days | .gz | Error analysis |
| access.log | 7 days | .gz | Traffic analysis |
| database.log | 14 days | .gz | Query optimization |
| audit.log | 5 years | .gz + encrypted | Compliance |

#### 6.2.3 Log Analysis Tools
```bash
# Search for errors in last 24 hours
grep -i "error" /logs/app.log

# Count requests by status code
awk '{print $9}' /logs/access.log | sort | uniq -c

# Find slow queries
grep "duration" /logs/database.log | awk '$NF > 1000'

# Audit failed logins
jq 'select(.eventType=="LOGIN_FAILED")' /logs/audit.log
```

---

## 7. Backup Files

### 7.1 Backup Schedule

| Backup Type | Frequency | Time | Retention | Size (Avg) |
|-------------|-----------|------|-----------|------------|
| Full DB Backup | Daily | 2:00 AM | 30 days | 2 GB |
| Incremental DB | Hourly | :00 | 7 days | 200 MB |
| File System | Daily | 3:00 AM | 14 days | 5 GB |
| Configuration | On Change | - | 90 days | 10 MB |
| Logs Archive | Daily | 1:00 AM | 90 days | 500 MB |

### 7.2 Backup File Locations

```
/backups/
├── database/
│   ├── full/
│   │   ├── cybercrime_20260104.dmp
│   │   ├── cybercrime_20260103.dmp
│   │   └── ...
│   └── incremental/
│       ├── cybercrime_incr_20260104_10.dmp
│       ├── cybercrime_incr_20260104_09.dmp
│       └── ...
│
├── filesystem/
│   ├── uploads_20260104.tar.gz
│   ├── uploads_20260103.tar.gz
│   └── ...
│
├── config/
│   ├── config_20260104.tar.gz
│   └── ...
│
└── logs/
    ├── logs_20260103.tar.gz
    └── ...
```

### 7.3 Backup Verification

```bash
# Verify backup integrity
md5sum cybercrime_20260104.dmp > cybercrime_20260104.dmp.md5
md5sum -c cybercrime_20260104.dmp.md5

# Test backup restoration (staging environment)
impdp PDBADMIN/PDBADMIN@TEST_DB \
  directory=BACKUP_DIR \
  dumpfile=cybercrime_20260104.dmp \
  logfile=test_restore.log

# Verify file count
tar -tzf uploads_20260104.tar.gz | wc -l
```

---

## 8. Temporary Files

### 8.1 Temporary File Locations

```
/tmp/
├── cybercrime-uploads/            # Temporary upload staging
│   ├── upload_abc123_001.jpg
│   └── ...
│
├── sessions/                      # Session storage (if file-based)
│   ├── sess_xyz789
│   └── ...
│
├── cache/                         # Application cache
│   ├── query_cache/
│   └── api_response_cache/
│
└── build/                         # Build artifacts
    ├── next/
    └── typescript/
```

### 8.2 Temporary File Management

**Cleanup Policy:**
- **Upload Staging:** Deleted after 1 hour
- **Sessions:** Deleted on expiry (7 days)
- **Cache:** LRU eviction when > 1 GB
- **Build Artifacts:** Deleted on new build

**Cleanup Script:**
```bash
#!/bin/bash
# cleanup-temp.sh

# Remove old upload staging files
find /tmp/cybercrime-uploads -type f -mmin +60 -delete

# Remove expired sessions
find /tmp/sessions -type f -mtime +7 -delete

# Clear old cache
find /tmp/cache -type f -mtime +1 -delete

# Clear old build artifacts
rm -rf /tmp/build/*
```

**Cron Schedule:**
```cron
# Run cleanup every hour
0 * * * * /path/to/cleanup-temp.sh
```

---

## 9. File Management Procedures

### 9.1 File Upload Procedure

```typescript
// File upload workflow
async function uploadFile(file: File, userId: number): Promise<string> {
  // 1. Validate file
  validateFileType(file);
  validateFileSize(file);
  
  // 2. Generate unique filename
  const filename = generateFilename(file.name);
  
  // 3. Save to temporary location
  const tempPath = await saveToTemp(file, filename);
  
  // 4. Scan for viruses (if enabled)
  await scanFile(tempPath);
  
  // 5. Move to permanent storage
  const finalPath = await moveToStorage(tempPath, 'reports/evidence');
  
  // 6. Create database record
  await logFileUpload(userId, filename, finalPath);
  
  // 7. Return file path
  return finalPath;
}
```

### 9.2 File Deletion Procedure

```typescript
// File deletion workflow
async function deleteFile(filePath: string, userId: number): Promise<void> {
  // 1. Verify user permission
  await verifyPermission(userId, filePath);
  
  // 2. Check file references
  const refs = await checkReferences(filePath);
  if (refs.length > 0) {
    throw new Error('File is referenced by other records');
  }
  
  // 3. Move to recycle bin (soft delete)
  const recyclePath = await moveToRecycleBin(filePath);
  
  // 4. Log deletion
  await logFileDeletion(userId, filePath);
  
  // 5. Schedule permanent deletion (30 days)
  await schedulePermanentDeletion(recyclePath, 30);
}
```

### 9.3 Backup Procedure

```bash
#!/bin/bash
# backup-database.sh

# Configuration
BACKUP_DIR="/backups/database/full"
DATE=$(date +%Y%m%d)
FILENAME="cybercrime_${DATE}.dmp"
LOGFILE="backup_${DATE}.log"

# Create backup directory
mkdir -p $BACKUP_DIR

# Perform backup
expdp PDBADMIN/PDBADMIN@CYBERCRIME \
  directory=BACKUP_DIR \
  dumpfile=$FILENAME \
  logfile=$LOGFILE \
  full=y \
  compression=all \
  parallel=4

# Verify backup
if [ $? -eq 0 ]; then
  echo "Backup successful: $FILENAME"
  
  # Generate checksum
  md5sum "$BACKUP_DIR/$FILENAME" > "$BACKUP_DIR/$FILENAME.md5"
  
  # Copy to remote storage (optional)
  # rsync -avz "$BACKUP_DIR/$FILENAME" backup-server:/backups/
  
  # Remove old backups (keep 30 days)
  find $BACKUP_DIR -name "cybercrime_*.dmp" -mtime +30 -delete
else
  echo "Backup failed!" >&2
  exit 1
fi
```

### 9.4 Restore Procedure

```bash
#!/bin/bash
# restore-database.sh

# Configuration
BACKUP_DIR="/backups/database/full"
BACKUP_FILE=$1  # cybercrime_YYYYMMDD.dmp

if [ -z "$BACKUP_FILE" ]; then
  echo "Usage: $0 <backup_file>"
  exit 1
fi

# Verify backup file
if [ ! -f "$BACKUP_DIR/$BACKUP_FILE" ]; then
  echo "Backup file not found: $BACKUP_FILE"
  exit 1
fi

# Verify checksum
md5sum -c "$BACKUP_DIR/$BACKUP_FILE.md5"
if [ $? -ne 0 ]; then
  echo "Backup file corrupted!"
  exit 1
fi

# Confirm restore
read -p "This will restore database from $BACKUP_FILE. Continue? (yes/no): " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
  echo "Restore cancelled"
  exit 0
fi

# Perform restore
impdp PDBADMIN/PDBADMIN@CYBERCRIME \
  directory=BACKUP_DIR \
  dumpfile=$BACKUP_FILE \
  logfile=restore_$(date +%Y%m%d_%H%M%S).log \
  full=y \
  table_exists_action=replace

if [ $? -eq 0 ]; then
  echo "Restore successful"
else
  echo "Restore failed!" >&2
  exit 1
fi
```

---

## 10. File Security

### 10.1 File Access Control

```
File Permissions:
- Configuration files: 640 (rw-r-----)
- Source code: 644 (rw-r--r--)
- Executables: 750 (rwxr-x---)
- Uploads: 600 (rw-------)
- Logs: 640 (rw-r-----)
- Backups: 600 (rw-------)
```

### 10.2 File Encryption

```bash
# Encrypt sensitive files
openssl enc -aes-256-cbc -salt -in backup.dmp -out backup.dmp.enc

# Decrypt
openssl enc -d -aes-256-cbc -in backup.dmp.enc -out backup.dmp
```

### 10.3 File Integrity Monitoring

```bash
# Generate checksums for all critical files
find /app -type f \( -name "*.ts" -o -name "*.sql" \) -exec md5sum {} \; > checksums.txt

# Verify integrity
md5sum -c checksums.txt
```

---

## 11. Revision History

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | 2026-01-04 | AI Assistant | Initial CSCI Data Files document |

---

**End of CSCI Data Files Document**
