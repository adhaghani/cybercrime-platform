# CSCI State Organization
## Cybercrime Awareness and Reporting Platform (CARP)

**Document Version:** 1.0  
**Date:** January 4, 2026  
**Project:** Cybercrime Platform - State Management Specification

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [System States and Modes](#2-system-states-and-modes)
3. [User Session States](#3-user-session-states)
4. [Entity State Machines](#4-entity-state-machines)
5. [State Transitions](#5-state-transitions)
6. [Memory Allocation](#6-memory-allocation)
7. [Processing Time Allocation](#7-processing-time-allocation)

---

## 1. Introduction

### 1.1 Purpose

This document defines all state management aspects of the Cybercrime Awareness and Reporting Platform (CARP), including:
- System operational states
- User session states
- Entity lifecycle states
- State transition rules
- Memory and processing allocations

### 1.2 Scope

The state organization covers:
- Application modes (Development, Production, Maintenance)
- Authentication and authorization states
- Report lifecycle management
- Announcement publication states
- Assignment and resolution tracking
- Database connection states

---

## 2. System States and Modes

### 2.1 Application Operational Modes

#### 2.1.1 Development Mode

**Activation:** `NODE_ENV=development`

**Characteristics:**
- Verbose logging to console
- Hot module reloading enabled
- Detailed error stack traces
- CORS permissive settings
- Source maps enabled
- Debug endpoints accessible
- Database connection pooling minimal (min: 1, max: 5)

**State Properties:**
```typescript
interface DevelopmentState {
  mode: 'development';
  logging: {
    level: 'debug';
    destination: 'console';
    includeStackTrace: true;
  };
  cors: {
    allowedOrigins: ['*'];
  };
  hotReload: true;
  sourceMap: true;
}
```

#### 2.1.2 Production Mode

**Activation:** `NODE_ENV=production`

**Characteristics:**
- Minimal logging (errors only)
- Optimized builds
- Generic error messages
- Strict CORS configuration
- Source maps disabled
- Debug endpoints disabled
- Database connection pooling optimal (min: 2, max: 20)

**State Properties:**
```typescript
interface ProductionState {
  mode: 'production';
  logging: {
    level: 'error';
    destination: 'file';
    includeStackTrace: false;
  };
  cors: {
    allowedOrigins: ['https://cybercrime.uitm.edu.my'];
  };
  hotReload: false;
  sourceMap: false;
}
```

#### 2.1.3 Maintenance Mode

**Activation:** Manual admin trigger or scheduled maintenance

**Characteristics:**
- Read-only access for non-admins
- Write operations blocked
- Maintenance banner displayed
- Admin access unrestricted
- Scheduled downtime notifications

**State Properties:**
```typescript
interface MaintenanceState {
  mode: 'maintenance';
  readOnly: true;
  adminAccessOnly: false;
  maintenanceWindow: {
    start: Date;
    end: Date;
    reason: string;
  };
  allowedOperations: ['read', 'admin-write'];
}
```

### 2.2 Database Connection States

```
┌──────────────┐
│ DISCONNECTED │ (Initial state)
└──────┬───────┘
       │ connect()
┌──────▼───────┐
│  CONNECTING  │
└──────┬───────┘
       │ success / error
       ├─────────────────┐
┌──────▼───────┐    ┌────▼─────┐
│  CONNECTED   │    │  ERROR   │
└──────┬───────┘    └────┬─────┘
       │                 │ retry
       │ close()         └─────┐
┌──────▼───────┐              │
│ DISCONNECTED │◄─────────────┘
└──────────────┘
```

**Connection Pool States:**
- `IDLE`: Connection available for use
- `IN_USE`: Connection actively executing query
- `CLOSING`: Connection being closed
- `CLOSED`: Connection terminated

---

## 3. User Session States

### 3.1 Authentication States

```
┌─────────────────┐
│ UNAUTHENTICATED │ (Initial state)
└────────┬────────┘
         │ login() or register()
         │
┌────────▼────────┐
│ AUTHENTICATING  │
└────────┬────────┘
         │ validate credentials
         │
    ┌────┴────┐
    │         │
┌───▼──┐  ┌──▼────┐
│SUCCESS│  │FAILURE│
└───┬──┘  └───────┘
    │
┌───▼─────────┐
│AUTHENTICATED│
└───┬─────────┘
    │ logout() or token expires
┌───▼─────────────┐
│ UNAUTHENTICATED │
└─────────────────┘
```

**State Properties:**
```typescript
interface AuthenticationState {
  status: 'unauthenticated' | 'authenticating' | 'authenticated' | 'token_expired';
  user?: {
    accountId: number;
    email: string;
    name: string;
    accountType: 'STUDENT' | 'STAFF';
    role?: Role;
  };
  token?: {
    accessToken: string;
    expiresAt: Date;
    issuedAt: Date;
  };
  session?: {
    id: string;
    startedAt: Date;
    lastActivity: Date;
  };
}
```

### 3.2 Authorization States

**Role-Based States:**

```
┌─────────────────┐
│  AUTHENTICATED  │
└────────┬────────┘
         │ determine role
         │
    ┌────┴────┬────────┬───────────┬──────────┬────────────┐
    │         │        │           │          │            │
┌───▼────┐ ┌─▼────┐ ┌─▼───────┐ ┌─▼─────┐ ┌──▼─────────┐
│STUDENT │ │STAFF │ │SUPERVISOR│ │ADMIN  │ │ SUPERADMIN │
└────────┘ └──────┘ └──────────┘ └───────┘ └────────────┘
```

**Permission Matrix State:**

```typescript
interface PermissionState {
  role: 'STUDENT' | 'STAFF' | 'SUPERVISOR' | 'ADMIN' | 'SUPERADMIN';
  permissions: {
    reports: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
      readAll: boolean;
    };
    announcements: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
    };
    users: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
      manage: boolean;
    };
    assignments: {
      create: boolean;
      read: boolean;
      update: boolean;
    };
    resolutions: {
      create: boolean;
      read: boolean;
      update: boolean;
    };
    emergency: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
    };
    analytics: {
      view: boolean;
      generate: boolean;
    };
  };
}
```

### 3.3 Account States

```
┌─────────────────────┐
│   REGISTRATION      │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│ PENDING_VERIFICATION│
└──────────┬──────────┘
           │ verify_email()
┌──────────▼──────────┐
│      ACTIVE         │◄────┐
└──────────┬──────────┘     │
           │                │ reactivate()
           │ suspend()      │
┌──────────▼──────────┐     │
│    SUSPENDED        │─────┘
└──────────┬──────────┘
           │ deactivate()
┌──────────▼──────────┐
│   DEACTIVATED       │ (Terminal state)
└─────────────────────┘
```

**Account State Properties:**
```typescript
interface AccountState {
  status: 'PENDING_VERIFICATION' | 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';
  statusChangedAt: Date;
  statusChangedBy?: number; // ACCOUNT_ID
  suspensionReason?: string;
  suspendedUntil?: Date;
  deactivationReason?: string;
  canLogin: boolean;
  canSubmitReports: boolean;
}
```

---

## 4. Entity State Machines

### 4.1 Report State Machine

```
┌─────────────┐
│  [CREATE]   │
└──────┬──────┘
       │
┌──────▼──────┐
│   PENDING   │ (Initial state)
└──────┬──────┘
       │ assign()
       ├──────────────────┐
       │                  │ dismiss()
┌──────▼──────┐      ┌────▼─────┐
│  IN_REVIEW  │      │ DISMISSED│ (Terminal)
└──────┬──────┘      └──────────┘
       │ investigate()
┌──────▼────────────┐
│UNDER_INVESTIGATION│
└──────┬────────────┘
       │ resolve()
┌──────▼──────┐
│  RESOLVED   │ (Terminal)
└─────────────┘
```

**Report State Properties:**
```typescript
interface ReportState {
  status: 'PENDING' | 'IN_REVIEW' | 'UNDER_INVESTIGATION' | 'RESOLVED' | 'DISMISSED';
  statusHistory: Array<{
    status: ReportStatus;
    changedAt: Date;
    changedBy: number; // ACCOUNT_ID
    reason?: string;
  }>;
  currentAssignment?: {
    assignmentId: number;
    assignedTo: number; // STAFF ACCOUNT_ID
    assignedAt: Date;
  };
  resolution?: {
    resolutionId: number;
    resolvedBy: number; // STAFF ACCOUNT_ID
    resolvedAt: Date;
    resolutionType: string;
  };
  isTerminal: boolean; // true if RESOLVED or DISMISSED
  daysInCurrentStatus: number;
}
```

**State Transition Rules:**

| From State | To State | Trigger | Required Role | Validations |
|------------|----------|---------|---------------|-------------|
| PENDING | IN_REVIEW | assign() | SUPERVISOR, ADMIN, SUPERADMIN | Must have valid staff ID |
| PENDING | DISMISSED | dismiss() | ADMIN, SUPERADMIN | Must provide reason |
| IN_REVIEW | UNDER_INVESTIGATION | investigate() | ASSIGNED_STAFF, SUPERVISOR, ADMIN | Must have assignment |
| IN_REVIEW | DISMISSED | dismiss() | ADMIN, SUPERADMIN | Must provide reason |
| UNDER_INVESTIGATION | RESOLVED | resolve() | ASSIGNED_STAFF, ADMIN | Must provide resolution |
| UNDER_INVESTIGATION | DISMISSED | dismiss() | ADMIN, SUPERADMIN | Must provide reason |

**Immutable States:**
- RESOLVED (cannot transition to any other state)
- DISMISSED (cannot transition to any other state)

### 4.2 Crime Report State Machine

Inherits all Report states plus additional crime-specific validations:

**Additional State Properties:**
```typescript
interface CrimeState extends ReportState {
  crimeCategory: CrimeCategory;
  severityLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  evidenceCount: number;
  witnessCount: number;
  isEscalated: boolean;
  escalatedTo?: string; // Law enforcement agency
  escalatedAt?: Date;
}
```

**State-Specific Business Rules:**
- HIGH/CRITICAL severity automatically moves to IN_REVIEW
- Evidence attachments can only be added in PENDING or IN_REVIEW
- Escalation to law enforcement locks certain fields

### 4.3 Announcement State Machine

```
┌─────────────┐
│  [CREATE]   │
└──────┬──────┘
       │
┌──────▼──────┐
│    DRAFT    │
└──────┬──────┘
       │ schedule()
┌──────▼──────┐
│  SCHEDULED  │
└──────┬──────┘
       │ publish() or auto-publish at start_date
┌──────▼──────┐
│  PUBLISHED  │
└──────┬──────┘
       │ end_date reached or expire()
┌──────▼──────┐
│   EXPIRED   │
└──────┬──────┘
       │ archive()
┌──────▼──────┐
│  ARCHIVED   │ (Terminal)
└─────────────┘
```

**Announcement State Properties:**
```typescript
interface AnnouncementState {
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'EXPIRED' | 'ARCHIVED';
  startDate: Date;
  endDate: Date;
  publishedAt?: Date;
  expiredAt?: Date;
  archivedAt?: Date;
  isActive: boolean; // true only if PUBLISHED and within date range
  viewCount: number;
  audience: 'STUDENT' | 'STAFF' | 'ALL';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}
```

**State Transition Rules:**

| From State | To State | Trigger | Conditions |
|------------|----------|---------|------------|
| DRAFT | SCHEDULED | schedule() | start_date is in future |
| DRAFT | PUBLISHED | publish() | start_date is now or past |
| SCHEDULED | PUBLISHED | auto-trigger | start_date reached |
| PUBLISHED | EXPIRED | auto-trigger | end_date reached |
| PUBLISHED | EXPIRED | expire() | Manual expiration |
| EXPIRED | ARCHIVED | archive() | Manual archival |

### 4.4 Assignment State Machine

```
┌─────────────┐
│ [ASSIGN]    │
└──────┬──────┘
       │
┌──────▼──────┐
│   ASSIGNED  │
└──────┬──────┘
       │ acknowledge()
┌──────▼──────┐
│IN_PROGRESS  │
└──────┬──────┘
       │ complete()
┌──────▼──────┐
│  COMPLETED  │ (Terminal)
└─────────────┘
```

**Assignment State Properties:**
```typescript
interface AssignmentState {
  status: 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED';
  assignedTo: number; // STAFF ACCOUNT_ID
  assignedBy: number; // SUPERVISOR/ADMIN ACCOUNT_ID
  assignedAt: Date;
  acknowledgedAt?: Date;
  completedAt?: Date;
  actionTaken?: string;
  additionalFeedback?: string;
  timeSpent?: number; // in hours
}
```

### 4.5 Resolution State Machine

```
┌─────────────┐
│ [CREATE]    │
└──────┬──────┘
       │
┌──────▼──────┐
│    DRAFT    │
└──────┬──────┘
       │ submit()
┌──────▼──────┐
│  SUBMITTED  │
└──────┬──────┘
       │ approve() or reject()
       ├──────────────────┐
       │                  │
┌──────▼──────┐      ┌────▼─────┐
│  APPROVED   │      │ REJECTED │
└─────────────┘      └──────────┘
(Both terminal)
```

**Resolution State Properties:**
```typescript
interface ResolutionState {
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  resolutionType: 'RESOLVED' | 'REFERRED' | 'INVALID' | 'DUPLICATE' | 'DISMISSED';
  resolvedBy: number; // STAFF ACCOUNT_ID
  resolvedAt: Date;
  approvedBy?: number; // SUPERVISOR/ADMIN ACCOUNT_ID
  approvedAt?: Date;
  rejectionReason?: string;
  evidenceAttached: boolean;
  requiresFollowUp: boolean;
}
```

---

## 5. State Transitions

### 5.1 State Transition Logging

All state transitions are logged with:
- Timestamp
- Triggering user (ACCOUNT_ID)
- Previous state
- New state
- Transition reason/notes
- IP address (for audit)

**Transition Log Structure:**
```typescript
interface StateTransitionLog {
  logId: number;
  entityType: 'REPORT' | 'ANNOUNCEMENT' | 'ACCOUNT' | 'ASSIGNMENT' | 'RESOLUTION';
  entityId: number;
  fromState: string;
  toState: string;
  triggeredBy: number; // ACCOUNT_ID
  triggeredAt: Date;
  reason?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
}
```

### 5.2 State Validation

**Pre-Transition Checks:**
1. User has required role/permissions
2. Current state allows transition
3. Required fields are populated
4. Business rules are satisfied
5. Database constraints will be met

**Post-Transition Actions:**
1. Update entity status field
2. Create state transition log
3. Trigger notifications (if configured)
4. Update related entities
5. Emit state change event

### 5.3 State Rollback

**Rollback Scenarios:**
- Transaction failure during state change
- Validation error after state change
- External service failure (email, etc.)

**Rollback Procedure:**
1. Revert entity to previous state
2. Delete transition log entry
3. Undo related entity updates
4. Log rollback event
5. Notify administrators

---

## 6. Memory Allocation

### 6.1 Per-Request Memory Budget

| Operation | Memory Allocation | Notes |
|-----------|-------------------|-------|
| User Login | 5-10 MB | Includes JWT generation, password comparison |
| Report Creation | 10-20 MB | Includes file processing, validation |
| Report Listing (100 items) | 20-50 MB | Includes eager loading of relations |
| File Upload (10MB file) | 15-30 MB | Buffering and processing |
| Database Query | 2-5 MB | Result set serialization |
| Email Sending | 3-8 MB | Template rendering, attachment |
| Report Generation | 50-100 MB | Data aggregation, chart generation |

### 6.2 Connection Pool Memory

**Database Connection Pool:**
- Per connection: ~2 MB
- Minimum pool (2 connections): ~4 MB
- Maximum pool (20 connections): ~40 MB
- Total reserved: 50 MB (includes overhead)

**Session Storage:**
- Per session: ~1 KB
- Expected concurrent users: 500
- Total reserved: 500 KB

### 6.3 Caching Memory

**Application Cache:**
- Emergency contacts: 5 MB
- Active announcements: 10 MB
- User permissions: 2 MB
- Configuration: 1 MB
- Total reserved: 20 MB

**Total Memory Footprint:**
- Base application: 100 MB
- Database connections: 50 MB
- Caching: 20 MB
- Session storage: 1 MB
- Buffer for requests: 200 MB
- **Total: ~371 MB minimum**

---

## 7. Processing Time Allocation

### 7.1 Performance Targets

| Operation | Target | Maximum | Notes |
|-----------|--------|---------|-------|
| User Login | 300ms | 500ms | Includes DB query, password hash comparison |
| Token Validation | 50ms | 100ms | JWT decode and verify |
| Report Creation | 500ms | 1000ms | Includes validation, DB insert, file processing |
| Report Retrieval (single) | 100ms | 200ms | Includes relations (submitted_by, assignments) |
| Report Listing (paginated) | 200ms | 300ms | 20 items per page with filters |
| Report Status Update | 150ms | 250ms | Includes state validation, transition log |
| File Upload (10MB) | 2000ms | 3000ms | Network + processing + storage |
| Database Query (simple) | 50ms | 200ms | Single table, indexed columns |
| Database Query (complex) | 200ms | 500ms | Joins, aggregations |
| Email Sending | 500ms | 2000ms | SMTP connection, template rendering |
| Report Generation | 1000ms | 2000ms | Data aggregation, calculations |
| Search Operation | 300ms | 500ms | Full-text or filtered search |

### 7.2 State Transition Performance

| Transition | Target | Maximum | Critical Path |
|------------|--------|---------|---------------|
| PENDING → IN_REVIEW | 200ms | 300ms | Validate assignment, update status, create log |
| IN_REVIEW → UNDER_INVESTIGATION | 150ms | 250ms | Update status, create log |
| UNDER_INVESTIGATION → RESOLVED | 300ms | 500ms | Create resolution record, update report, log |
| Account Login | 300ms | 500ms | Verify credentials, generate JWT, create session |
| Account Logout | 100ms | 200ms | Invalidate token, clear session |
| Announcement Publish | 200ms | 300ms | Update status, set timestamps, cache clear |

### 7.3 Timeout Configuration

**HTTP Request Timeouts:**
- Client → Frontend: 30 seconds
- Frontend → Backend API: 10 seconds
- Backend → Database: 60 seconds
- Email sending: 30 seconds
- File upload: 60 seconds

**Database Timeouts:**
- Connection timeout: 60 seconds
- Query timeout: 30 seconds
- Transaction timeout: 120 seconds

**Session Timeouts:**
- Idle timeout: 30 minutes
- Absolute timeout: 8 hours
- Token expiration: 7 days

### 7.4 Rate Limiting

**Per User Rate Limits:**
- Login attempts: 5 per 15 minutes
- Report creation: 10 per hour
- Report updates: 30 per hour
- File uploads: 10 per hour
- API requests (general): 100 per minute

**Global Rate Limits:**
- Total API requests: 10,000 per minute
- Database connections: 20 concurrent max
- File uploads: 50 concurrent max

---

## 8. State Recovery

### 8.1 Crash Recovery

**On Application Restart:**
1. Reconnect to database
2. Restore connection pool
3. Load cached configuration
4. Validate system state
5. Resume background tasks

**State Restoration:**
- IN_PROGRESS assignments → remain IN_PROGRESS
- PENDING reports → remain PENDING
- SCHEDULED announcements → check if should be PUBLISHED
- Active sessions → expired (user must re-login)

### 8.2 Database State Consistency

**Consistency Checks:**
- Reports without crime/facility records
- Assignments without reports
- Resolutions without reports
- Orphaned file attachments
- Expired tokens not cleaned

**Automated Cleanup Tasks:**
- Run daily at 2:00 AM
- Clean expired password reset tokens
- Archive old announcements
- Remove orphaned file uploads
- Update computed statistics

---

## 9. Monitoring and Metrics

### 9.1 State Metrics

**Tracked Metrics:**
- Reports by status (PENDING, IN_REVIEW, etc.)
- Average time in each state
- State transition frequency
- Failed state transitions
- Rollback count
- User session duration
- Concurrent active users
- Database connection pool utilization

### 9.2 Performance Metrics

**Tracked Metrics:**
- API response times (p50, p95, p99)
- Database query times
- State transition times
- Memory usage
- CPU usage
- Error rates
- Timeout occurrences

---

**Document End**
