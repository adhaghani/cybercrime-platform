# OOP Migration Plan for Cybercrime Platform

**Document Version:** 1.0  
**Created:** December 30, 2025  
**Estimated Timeline:** 6-8 weeks  
**Impact Level:** High - Requires phased approach

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Current Architecture Analysis](#current-architecture-analysis)
3. [Target Architecture](#target-architecture)
4. [Migration Strategy](#migration-strategy)
5. [Phase-by-Phase Implementation](#phase-by-phase-implementation)
6. [Code Examples](#code-examples)
7. [Testing Strategy](#testing-strategy)
8. [Rollback Plan](#rollback-plan)
9. [Success Metrics](#success-metrics)

---

## Executive Summary

### Goals
- Convert procedural backend to OOP architecture using TypeScript
- Implement Repository, Service, and Controller patterns
- Improve code maintainability, testability, and scalability
- Maintain 100% backward compatibility during migration

### Key Benefits
✅ **Better Separation of Concerns** - Clear layers for data access, business logic, and routing  
✅ **Improved Testability** - Mock dependencies easily with dependency injection  
✅ **Code Reusability** - Shared logic in base classes and services  
✅ **Type Safety** - Full TypeScript support with IntelliSense  
✅ **Easier Maintenance** - Changes isolated to specific layers  

### Risks & Mitigations
| Risk | Mitigation |
|------|------------|
| Production downtime | Parallel implementation with feature flags |
| Learning curve | Comprehensive documentation + code examples |
| Performance regression | Benchmark before/after, optimize hot paths |
| Database connection issues | Implement connection pooling early |

---

## Current Architecture Analysis

### Backend Structure (Node.js/Express)
```
backend/cybercrime-api/
├── server.js              # Express app setup
├── routes/               # 15 route files
│   ├── auth.js          # 308 lines - complex auth logic
│   ├── reports.js       # 888 lines - needs splitting
│   ├── staff.js         # 227 lines
│   └── ...
├── database/
│   └── connection.js    # Raw oracledb connection
├── middleware/
│   └── auth.js          # JWT authentication
└── helper/
    ├── toPlainRows.js
    └── dataSeeder.js
```

### Problems Identified
1. ❌ **Route Handlers Too Fat** - Business logic mixed with HTTP handling
2. ❌ **Direct Database Access** - SQL queries scattered across routes
3. ❌ **No Data Validation Layer** - Validation logic duplicated
4. ❌ **Difficult to Test** - Tightly coupled components
5. ❌ **No Business Logic Reuse** - Similar code in multiple routes
6. ❌ **JavaScript Only** - Missing TypeScript benefits

### Frontend Structure (Next.js/React)
```
app/
├── (protected-routes)/dashboard/
├── api/                  # Next.js API routes
└── auth/

lib/
├── types.ts             # Type definitions (good!)
├── api/                 # API client functions
│   ├── ai-service.ts    # ✅ Already uses class pattern!
│   ├── auth.ts
│   └── client.ts
└── utils/
```

### What's Already Good
✅ **lib/api/ai-service.ts** - Already uses OOP pattern!  
✅ **lib/types.ts** - Comprehensive type definitions  
✅ **React Components** - Functional approach is correct  

---

## Target Architecture

### New Backend Structure
```
backend/cybercrime-api-v2/              # TypeScript version
├── src/
│   ├── config/
│   │   ├── database.config.ts          # DB configuration
│   │   ├── app.config.ts               # App settings
│   │   └── env.config.ts               # Environment validation
│   │
│   ├── models/                          # Domain Models (Entities)
│   │   ├── base/
│   │   │   └── BaseModel.ts            # Abstract base class
│   │   ├── Account.ts                  # Account entity
│   │   ├── Student.ts                  # Extends Account
│   │   ├── Staff.ts                    # Extends Account
│   │   ├── Report.ts                   # Report entity
│   │   ├── Crime.ts                    # Crime report specifics
│   │   ├── Facility.ts                 # Facility report specifics
│   │   └── Announcement.ts             # Announcement entity
│   │
│   ├── repositories/                    # Data Access Layer
│   │   ├── base/
│   │   │   ├── BaseRepository.ts       # Abstract CRUD operations
│   │   │   └── IRepository.ts          # Repository interface
│   │   ├── AccountRepository.ts        # Account data access
│   │   ├── StudentRepository.ts
│   │   ├── StaffRepository.ts
│   │   ├── ReportRepository.ts
│   │   ├── CrimeRepository.ts
│   │   ├── FacilityRepository.ts
│   │   └── AnnouncementRepository.ts
│   │
│   ├── services/                        # Business Logic Layer
│   │   ├── base/
│   │   │   └── BaseService.ts
│   │   ├── AuthService.ts              # Authentication & authorization
│   │   ├── UserService.ts              # User management
│   │   ├── ReportService.ts            # Report processing
│   │   ├── AssignmentService.ts        # Report assignments
│   │   ├── ResolutionService.ts        # Report resolutions
│   │   ├── AnnouncementService.ts      # Announcement management
│   │   ├── DashboardService.ts         # Dashboard aggregations
│   │   ├── NotificationService.ts      # Email/notifications
│   │   └── AIService.ts                # AI integration
│   │
│   ├── controllers/                     # HTTP Request Handlers
│   │   ├── base/
│   │   │   └── BaseController.ts       # Common HTTP responses
│   │   ├── AuthController.ts
│   │   ├── UserController.ts
│   │   ├── ReportController.ts
│   │   ├── StaffController.ts
│   │   ├── StudentController.ts
│   │   └── AnnouncementController.ts
│   │
│   ├── middleware/
│   │   ├── AuthMiddleware.ts           # JWT validation
│   │   ├── ValidationMiddleware.ts     # Input validation
│   │   ├── ErrorHandler.ts             # Global error handling
│   │   └── RateLimiter.ts              # Rate limiting
│   │
│   ├── validators/                      # Input Validation
│   │   ├── base/
│   │   │   └── BaseValidator.ts
│   │   ├── AuthValidator.ts
│   │   ├── UserValidator.ts
│   │   └── ReportValidator.ts
│   │
│   ├── dto/                             # Data Transfer Objects
│   │   ├── auth/
│   │   │   ├── RegisterDTO.ts
│   │   │   ├── LoginDTO.ts
│   │   │   └── TokenResponseDTO.ts
│   │   ├── user/
│   │   │   ├── CreateUserDTO.ts
│   │   │   └── UpdateUserDTO.ts
│   │   └── report/
│   │       ├── CreateReportDTO.ts
│   │       └── UpdateReportDTO.ts
│   │
│   ├── types/                           # Shared Types & Interfaces
│   │   ├── database.types.ts
│   │   ├── api.types.ts
│   │   └── enums.ts
│   │
│   ├── utils/                           # Utility Classes
│   │   ├── DatabaseConnection.ts       # Connection pool manager
│   │   ├── PasswordHasher.ts           # Password utilities
│   │   ├── JwtManager.ts               # JWT operations
│   │   ├── QueryBuilder.ts             # SQL query builder
│   │   └── Logger.ts                   # Logging utility
│   │
│   ├── routes/                          # Express Route Definitions
│   │   ├── index.ts                    # Route aggregator
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   └── report.routes.ts
│   │
│   ├── database/
│   │   ├── migrations/                 # Database migrations
│   │   └── seeds/                      # Seed data
│   │
│   ├── tests/                          # Unit & Integration Tests
│   │   ├── unit/
│   │   │   ├── models/
│   │   │   ├── repositories/
│   │   │   └── services/
│   │   └── integration/
│   │       └── controllers/
│   │
│   ├── app.ts                          # Express app setup
│   └── server.ts                       # Server entry point
│
├── package.json
├── tsconfig.json
└── .env.example
```

### Architectural Layers

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT REQUEST                        │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  MIDDLEWARE LAYER (Auth, Validation, Error Handling)    │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  CONTROLLER LAYER (HTTP Request/Response Handling)      │
│  - Parse request                                         │
│  - Call service methods                                  │
│  - Format response                                       │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  SERVICE LAYER (Business Logic)                         │
│  - Validate business rules                              │
│  - Coordinate multiple repositories                      │
│  - Handle transactions                                   │
│  - Apply complex logic                                   │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  REPOSITORY LAYER (Data Access)                         │
│  - CRUD operations                                       │
│  - Query building                                        │
│  - Database interactions                                 │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  MODEL LAYER (Domain Entities)                          │
│  - Data structure                                        │
│  - Validation rules                                      │
│  - Business constraints                                  │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│              ORACLE DATABASE                             │
└─────────────────────────────────────────────────────────┘
```

---

## Migration Strategy

### Approach: Parallel Implementation

**Why Not Big Bang Rewrite?**
- Too risky for production system
- Loses git history and context
- No rollback option

**Parallel Strategy:**
1. Create new TypeScript backend alongside existing
2. Gradually migrate endpoints one by one
3. Use feature flags to switch between old/new
4. Keep old backend until 100% migrated
5. Remove old code after 2-week stability period

### Feature Flag Pattern
```typescript
// In old backend routes
if (process.env.USE_NEW_BACKEND === 'true') {
  // Proxy to new TypeScript backend
  return proxy(req, res, 'http://localhost:4000');
} else {
  // Use existing implementation
  // ... current code
}
```

### Migration Order (By Priority)

#### Phase 1: Foundation (Week 1-2)
1. ✅ Setup TypeScript project
2. ✅ Database connection pool
3. ✅ Base classes (Model, Repository, Service, Controller)
4. ✅ Utility classes (Logger, JWT, Password)
5. ✅ Middleware (Auth, Error handling)

#### Phase 2: Authentication Module (Week 2-3)
6. ✅ Account/User models
7. ✅ Account repository
8. ✅ Auth service
9. ✅ Auth controller
10. ✅ Auth routes
11. ✅ Integration tests

#### Phase 3: Core Modules (Week 3-5)
12. ✅ Report system (highest complexity)
13. ✅ User management (Staff/Student)
14. ✅ Dashboard services
15. ✅ Announcement system

#### Phase 4: Supporting Modules (Week 5-6)
16. ✅ Crime reports
17. ✅ Facility reports
18. ✅ Emergency services
19. ✅ Teams management

#### Phase 5: Testing & Optimization (Week 6-7)
20. ✅ End-to-end testing
21. ✅ Performance optimization
22. ✅ Documentation
23. ✅ Code review

#### Phase 6: Deployment & Cleanup (Week 7-8)
24. ✅ Production deployment
25. ✅ Monitor for 2 weeks
26. ✅ Remove old backend
27. ✅ Update documentation

---

## Phase-by-Phase Implementation

### Phase 1: Foundation Setup

#### Step 1.1: Initialize TypeScript Project
```bash
cd backend
mkdir cybercrime-api-v2
cd cybercrime-api-v2
npm init -y
```

#### Step 1.2: Install Dependencies
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "oracledb": "^6.3.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "express-validator": "^7.0.1",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.0",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/cors": "^2.8.17",
    "typescript": "^5.3.3",
    "ts-node": "^10.9.2",
    "nodemon": "^3.0.2",
    "@types/jest": "^29.5.11",
    "jest": "^29.7.0",
    "ts-jest": "^29.1.1",
    "supertest": "^6.3.3",
    "@types/supertest": "^6.0.2"
  }
}
```

#### Step 1.3: Configure TypeScript
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
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "baseUrl": ".",
    "paths": {
      "@models/*": ["src/models/*"],
      "@repositories/*": ["src/repositories/*"],
      "@services/*": ["src/services/*"],
      "@controllers/*": ["src/controllers/*"],
      "@middleware/*": ["src/middleware/*"],
      "@utils/*": ["src/utils/*"],
      "@config/*": ["src/config/*"],
      "@types/*": ["src/types/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

#### Step 1.4: Create Base Classes

**File: `src/models/base/BaseModel.ts`**
```typescript
export abstract class BaseModel {
  protected _data: Record<string, any>;

  constructor(data: Record<string, any>) {
    this._data = { ...data };
    this.validate();
  }

  /**
   * Override in child classes to define validation rules
   */
  protected abstract validate(): void;

  /**
   * Get property value
   */
  protected get<T>(key: string): T {
    return this._data[key] as T;
  }

  /**
   * Set property value
   */
  protected set(key: string, value: any): void {
    this._data[key] = value;
  }

  /**
   * Convert to plain object (for API responses)
   */
  toJSON(): Record<string, any> {
    return { ...this._data };
  }

  /**
   * Convert to database format (can be overridden)
   */
  toDatabase(): Record<string, any> {
    return this.toJSON();
  }
}
```

**File: `src/repositories/base/IRepository.ts`**
```typescript
export interface IRepository<T> {
  findById(id: string | number): Promise<T | null>;
  findAll(filters?: Record<string, any>): Promise<T[]>;
  create(entity: T): Promise<T>;
  update(id: string | number, entity: Partial<T>): Promise<T>;
  delete(id: string | number): Promise<boolean>;
  exists(id: string | number): Promise<boolean>;
}
```

**File: `src/repositories/base/BaseRepository.ts`**
```typescript
import { Connection } from 'oracledb';
import { DatabaseConnection } from '@utils/DatabaseConnection';
import { IRepository } from './IRepository';

export abstract class BaseRepository<T> implements IRepository<T> {
  protected tableName: string;
  protected primaryKey: string;

  constructor(tableName: string, primaryKey: string = 'ID') {
    this.tableName = tableName;
    this.primaryKey = primaryKey;
  }

  /**
   * Get database connection
   */
  protected async getConnection(): Promise<Connection> {
    return DatabaseConnection.getInstance().getConnection();
  }

  /**
   * Execute SQL with automatic connection management
   */
  protected async execute<R = any>(
    sql: string,
    binds: Record<string, any> = {},
    options: Record<string, any> = {}
  ): Promise<R> {
    const conn = await this.getConnection();
    try {
      const result = await conn.execute(sql, binds, {
        outFormat: 4, // OBJECT format
        ...options
      });
      return result as R;
    } finally {
      await conn.close();
    }
  }

  /**
   * Abstract method to convert DB row to model
   */
  protected abstract toModel(row: any): T;

  /**
   * Find by ID
   */
  async findById(id: string | number): Promise<T | null> {
    const sql = `SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = :id`;
    const result: any = await this.execute(sql, { id });
    
    if (result.rows.length === 0) return null;
    return this.toModel(result.rows[0]);
  }

  /**
   * Find all with optional filters
   */
  async findAll(filters?: Record<string, any>): Promise<T[]> {
    let sql = `SELECT * FROM ${this.tableName}`;
    const binds: Record<string, any> = {};

    if (filters && Object.keys(filters).length > 0) {
      const whereClauses = Object.keys(filters).map((key, index) => {
        binds[`filter${index}`] = filters[key];
        return `${key} = :filter${index}`;
      });
      sql += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    const result: any = await this.execute(sql, binds);
    return result.rows.map((row: any) => this.toModel(row));
  }

  /**
   * Check if record exists
   */
  async exists(id: string | number): Promise<boolean> {
    const sql = `SELECT 1 FROM ${this.tableName} WHERE ${this.primaryKey} = :id`;
    const result: any = await this.execute(sql, { id });
    return result.rows.length > 0;
  }

  /**
   * Create - must be implemented by child classes
   */
  abstract create(entity: T): Promise<T>;

  /**
   * Update - must be implemented by child classes
   */
  abstract update(id: string | number, entity: Partial<T>): Promise<T>;

  /**
   * Delete
   */
  async delete(id: string | number): Promise<boolean> {
    const sql = `DELETE FROM ${this.tableName} WHERE ${this.primaryKey} = :id`;
    const result: any = await this.execute(sql, { id }, { autoCommit: true });
    return result.rowsAffected > 0;
  }
}
```

**File: `src/utils/DatabaseConnection.ts`**
```typescript
import oracledb, { Connection, Pool, PoolAttributes } from 'oracledb';

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private pool: Pool | null = null;

  private constructor() {
    // Configure oracledb
    oracledb.fetchAsString = [oracledb.CLOB];
    oracledb.autoCommit = false;
  }

  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  async initialize(config: PoolAttributes): Promise<void> {
    if (this.pool) {
      console.log('Database pool already initialized');
      return;
    }

    try {
      this.pool = await oracledb.createPool({
        user: config.user,
        password: config.password,
        connectString: config.connectString,
        poolMin: config.poolMin || 2,
        poolMax: config.poolMax || 10,
        poolIncrement: config.poolIncrement || 1,
        poolTimeout: config.poolTimeout || 60,
        queueTimeout: config.queueTimeout || 60000
      });
      console.log('Database pool initialized successfully');
    } catch (err) {
      console.error('Failed to initialize database pool:', err);
      throw err;
    }
  }

  async getConnection(): Promise<Connection> {
    if (!this.pool) {
      throw new Error('Database pool not initialized. Call initialize() first.');
    }
    return this.pool.getConnection();
  }

  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.close(10);
      this.pool = null;
      console.log('Database pool closed');
    }
  }
}
```

### Phase 2: Authentication Module

#### Step 2.1: Create Account Model

**File: `src/models/Account.ts`**
```typescript
import { BaseModel } from './base/BaseModel';
import { AccountType } from '@types/enums';

export interface AccountData {
  ACCOUNT_ID?: number;
  NAME: string;
  EMAIL: string;
  PASSWORD_HASH: string;
  CONTACT_NUMBER?: string;
  ACCOUNT_TYPE: AccountType;
  AVATAR_URL?: string;
  CREATED_AT?: Date;
  UPDATED_AT?: Date;
}

export class Account extends BaseModel {
  constructor(data: AccountData) {
    super(data);
  }

  protected validate(): void {
    if (!this.getName()) {
      throw new Error('Account name is required');
    }
    if (!this.getEmail()) {
      throw new Error('Account email is required');
    }
    if (!this.isValidEmail(this.getEmail())) {
      throw new Error('Invalid email format');
    }
    if (!this.getPasswordHash()) {
      throw new Error('Password hash is required');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Getters
  getId(): number | undefined {
    return this.get<number>('ACCOUNT_ID');
  }

  getName(): string {
    return this.get<string>('NAME');
  }

  getEmail(): string {
    return this.get<string>('EMAIL');
  }

  getPasswordHash(): string {
    return this.get<string>('PASSWORD_HASH');
  }

  getContactNumber(): string | undefined {
    return this.get<string>('CONTACT_NUMBER');
  }

  getAccountType(): AccountType {
    return this.get<AccountType>('ACCOUNT_TYPE');
  }

  getAvatarUrl(): string | undefined {
    return this.get<string>('AVATAR_URL');
  }

  // Setters
  setName(name: string): void {
    this.set('NAME', name);
  }

  setEmail(email: string): void {
    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }
    this.set('EMAIL', email);
  }

  setPasswordHash(hash: string): void {
    this.set('PASSWORD_HASH', hash);
  }

  setContactNumber(number: string): void {
    this.set('CONTACT_NUMBER', number);
  }

  setAvatarUrl(url: string): void {
    this.set('AVATAR_URL', url);
  }

  // Override toJSON to exclude password
  toJSON(): Record<string, any> {
    const { PASSWORD_HASH, ...safeData } = this._data;
    return safeData;
  }
}
```

#### Step 2.2: Create Account Repository

**File: `src/repositories/AccountRepository.ts`**
```typescript
import oracledb from 'oracledb';
import { BaseRepository } from './base/BaseRepository';
import { Account, AccountData } from '@models/Account';

export class AccountRepository extends BaseRepository<Account> {
  constructor() {
    super('ACCOUNT', 'ACCOUNT_ID');
  }

  protected toModel(row: any): Account {
    return new Account(row);
  }

  /**
   * Find account by email
   */
  async findByEmail(email: string): Promise<Account | null> {
    const sql = `SELECT * FROM ${this.tableName} WHERE EMAIL = :email`;
    const result: any = await this.execute(sql, { email });
    
    if (result.rows.length === 0) return null;
    return this.toModel(result.rows[0]);
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    const sql = `SELECT 1 FROM ${this.tableName} WHERE EMAIL = :email`;
    const result: any = await this.execute(sql, { email });
    return result.rows.length > 0;
  }

  /**
   * Create new account
   */
  async create(account: Account): Promise<Account> {
    const sql = `
      INSERT INTO ${this.tableName} (
        ACCOUNT_ID, NAME, EMAIL, PASSWORD_HASH, CONTACT_NUMBER, 
        ACCOUNT_TYPE, AVATAR_URL, CREATED_AT, UPDATED_AT
      ) VALUES (
        account_seq.NEXTVAL, :name, :email, :password, :contact,
        :type, :avatar, SYSTIMESTAMP, SYSTIMESTAMP
      ) RETURNING ACCOUNT_ID INTO :id
    `;

    const binds = {
      name: account.getName(),
      email: account.getEmail(),
      password: account.getPasswordHash(),
      contact: account.getContactNumber() || null,
      type: account.getAccountType(),
      avatar: account.getAvatarUrl() || null,
      id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
    };

    const result: any = await this.execute(sql, binds, { autoCommit: true });
    
    // Fetch and return the created account
    return this.findById(result.outBinds.id[0]) as Promise<Account>;
  }

  /**
   * Update account
   */
  async update(id: string | number, updates: Partial<AccountData>): Promise<Account> {
    const setClauses: string[] = [];
    const binds: Record<string, any> = { id };

    if (updates.NAME) {
      setClauses.push('NAME = :name');
      binds.name = updates.NAME;
    }
    if (updates.EMAIL) {
      setClauses.push('EMAIL = :email');
      binds.email = updates.EMAIL;
    }
    if (updates.CONTACT_NUMBER) {
      setClauses.push('CONTACT_NUMBER = :contact');
      binds.contact = updates.CONTACT_NUMBER;
    }
    if (updates.AVATAR_URL) {
      setClauses.push('AVATAR_URL = :avatar');
      binds.avatar = updates.AVATAR_URL;
    }

    setClauses.push('UPDATED_AT = SYSTIMESTAMP');

    const sql = `
      UPDATE ${this.tableName}
      SET ${setClauses.join(', ')}
      WHERE ${this.primaryKey} = :id
    `;

    await this.execute(sql, binds, { autoCommit: true });
    
    return this.findById(id) as Promise<Account>;
  }

  /**
   * Get accounts by type
   */
  async findByType(accountType: string): Promise<Account[]> {
    const sql = `SELECT * FROM ${this.tableName} WHERE ACCOUNT_TYPE = :type`;
    const result: any = await this.execute(sql, { type: accountType });
    return result.rows.map((row: any) => this.toModel(row));
  }
}
```

#### Step 2.3: Create Auth Service

**File: `src/services/AuthService.ts`**
```typescript
import bcrypt from 'bcryptjs';
import { Account, AccountData } from '@models/Account';
import { AccountRepository } from '@repositories/AccountRepository';
import { JwtManager } from '@utils/JwtManager';

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  contact_number?: string;
  account_type: 'STUDENT' | 'STAFF';
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  token?: string;
  account?: Account;
  message?: string;
}

export class AuthService {
  private accountRepo: AccountRepository;
  private jwtManager: JwtManager;

  constructor(
    accountRepo: AccountRepository = new AccountRepository(),
    jwtManager: JwtManager = new JwtManager()
  ) {
    this.accountRepo = accountRepo;
    this.jwtManager = jwtManager;
  }

  /**
   * Register new account
   */
  async register(data: RegisterDTO): Promise<AuthResult> {
    try {
      // Check if email already exists
      const existingAccount = await this.accountRepo.findByEmail(data.email);
      if (existingAccount) {
        return {
          success: false,
          message: 'Email already registered'
        };
      }

      // Hash password
      const passwordHash = await bcrypt.hash(data.password, 10);

      // Create account
      const accountData: AccountData = {
        NAME: data.name,
        EMAIL: data.email,
        PASSWORD_HASH: passwordHash,
        CONTACT_NUMBER: data.contact_number,
        ACCOUNT_TYPE: data.account_type
      };

      const account = new Account(accountData);
      const createdAccount = await this.accountRepo.create(account);

      // Generate JWT token
      const token = this.jwtManager.generateToken({
        accountId: createdAccount.getId()!,
        email: createdAccount.getEmail(),
        accountType: createdAccount.getAccountType()
      });

      return {
        success: true,
        token,
        account: createdAccount,
        message: 'Registration successful'
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Registration failed'
      };
    }
  }

  /**
   * Login
   */
  async login(data: LoginDTO): Promise<AuthResult> {
    try {
      // Find account by email
      const account = await this.accountRepo.findByEmail(data.email);
      if (!account) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(
        data.password,
        account.getPasswordHash()
      );

      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }

      // Generate JWT token
      const token = this.jwtManager.generateToken({
        accountId: account.getId()!,
        email: account.getEmail(),
        accountType: account.getAccountType()
      });

      return {
        success: true,
        token,
        account,
        message: 'Login successful'
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed'
      };
    }
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): any {
    return this.jwtManager.verifyToken(token);
  }

  /**
   * Get account by ID
   */
  async getAccountById(id: number): Promise<Account | null> {
    return this.accountRepo.findById(id);
  }
}
```

#### Step 2.4: Create Auth Controller

**File: `src/controllers/AuthController.ts`**
```typescript
import { Request, Response } from 'express';
import { AuthService, RegisterDTO, LoginDTO } from '@services/AuthService';

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService = new AuthService()) {
    this.authService = authService;
  }

  /**
   * POST /api/auth/register
   */
  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const registerData: RegisterDTO = req.body;

      // Validate required fields
      if (!registerData.name || !registerData.email || !registerData.password) {
        res.status(400).json({
          error: 'Name, email, and password are required'
        });
        return;
      }

      const result = await this.authService.register(registerData);

      if (!result.success) {
        res.status(400).json({ error: result.message });
        return;
      }

      res.status(201).json({
        message: result.message,
        token: result.token,
        account: result.account?.toJSON()
      });
    } catch (error) {
      console.error('Register controller error:', error);
      res.status(500).json({
        error: 'Registration failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * POST /api/auth/login
   */
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const loginData: LoginDTO = req.body;

      // Validate required fields
      if (!loginData.email || !loginData.password) {
        res.status(400).json({
          error: 'Email and password are required'
        });
        return;
      }

      const result = await this.authService.login(loginData);

      if (!result.success) {
        res.status(401).json({ error: result.message });
        return;
      }

      res.status(200).json({
        message: result.message,
        token: result.token,
        account: result.account?.toJSON()
      });
    } catch (error) {
      console.error('Login controller error:', error);
      res.status(500).json({
        error: 'Login failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * GET /api/auth/me
   */
  getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
      // Account ID should be set by auth middleware
      const accountId = (req as any).user?.accountId;

      if (!accountId) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const account = await this.authService.getAccountById(accountId);

      if (!account) {
        res.status(404).json({ error: 'Account not found' });
        return;
      }

      res.status(200).json(account.toJSON());
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({
        error: 'Failed to get current user',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}
```

#### Step 2.5: Create Routes

**File: `src/routes/auth.routes.ts`**
```typescript
import { Router } from 'express';
import { AuthController } from '@controllers/AuthController';
import { AuthMiddleware } from '@middleware/AuthMiddleware';

const router = Router();
const authController = new AuthController();
const authMiddleware = new AuthMiddleware();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/me', authMiddleware.authenticate, authController.getCurrentUser);

export default router;
```

---

## Code Examples

### Complete Report Service Example

**File: `src/services/ReportService.ts`**
```typescript
import { Report, ReportData } from '@models/Report';
import { ReportRepository } from '@repositories/ReportRepository';
import { AssignmentService } from './AssignmentService';
import { NotificationService } from './NotificationService';

export interface CreateReportDTO {
  title: string;
  description: string;
  type: 'CRIME' | 'FACILITY';
  location: string;
  submittedBy: number;
  attachments?: string[];
  // Crime specific
  crimeCategory?: string;
  suspectInformation?: string;
  // Facility specific
  facilityType?: string;
  assetTag?: string;
}

export class ReportService {
  private reportRepo: ReportRepository;
  private assignmentService: AssignmentService;
  private notificationService: NotificationService;

  constructor(
    reportRepo: ReportRepository = new ReportRepository(),
    assignmentService: AssignmentService = new AssignmentService(),
    notificationService: NotificationService = new NotificationService()
  ) {
    this.reportRepo = reportRepo;
    this.assignmentService = assignmentService;
    this.notificationService = notificationService;
  }

  /**
   * Create new report with automatic assignment
   */
  async createReport(data: CreateReportDTO): Promise<Report> {
    // Validate report data
    this.validateReportData(data);

    // Create report
    const reportData: ReportData = {
      TITLE: data.title,
      DESCRIPTION: data.description,
      TYPE: data.type,
      LOCATION: data.location,
      STATUS: 'PENDING',
      SUBMITTED_BY: data.submittedBy,
      ATTACHMENT_PATH: data.attachments ? JSON.stringify(data.attachments) : null
    };

    const report = new Report(reportData);
    const createdReport = await this.reportRepo.create(report);

    // Auto-assign based on report type and location
    try {
      await this.assignmentService.autoAssignReport(
        createdReport.getId()!,
        data.location,
        data.type
      );

      // Send notification
      await this.notificationService.notifyReportSubmitted(createdReport);
    } catch (error) {
      console.error('Error in post-creation tasks:', error);
      // Report is already created, just log the error
    }

    return createdReport;
  }

  /**
   * Update report status
   */
  async updateStatus(
    reportId: number,
    newStatus: string,
    updatedBy: number,
    notes?: string
  ): Promise<Report> {
    const report = await this.reportRepo.findById(reportId);
    if (!report) {
      throw new Error('Report not found');
    }

    // Validate status transition
    this.validateStatusTransition(report.getStatus(), newStatus);

    // Update report
    report.setStatus(newStatus);
    const updatedReport = await this.reportRepo.update(reportId, {
      STATUS: newStatus
    });

    // Log status change
    await this.reportRepo.logStatusChange(reportId, newStatus, updatedBy, notes);

    // Send notification
    await this.notificationService.notifyStatusChange(updatedReport, newStatus);

    return updatedReport;
  }

  /**
   * Get reports with filters
   */
  async getReports(filters: {
    type?: string;
    status?: string;
    submittedBy?: number;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }): Promise<{ reports: Report[]; total: number }> {
    const reports = await this.reportRepo.findWithFilters(filters);
    const total = await this.reportRepo.countWithFilters(filters);

    return { reports, total };
  }

  /**
   * Get report statistics
   */
  async getStatistics(filters?: {
    startDate?: Date;
    endDate?: Date;
  }): Promise<any> {
    return this.reportRepo.getStatistics(filters);
  }

  // Private helper methods

  private validateReportData(data: CreateReportDTO): void {
    if (!data.title || data.title.length < 5) {
      throw new Error('Report title must be at least 5 characters');
    }
    if (!data.description || data.description.length < 20) {
      throw new Error('Report description must be at least 20 characters');
    }
    if (!['CRIME', 'FACILITY'].includes(data.type)) {
      throw new Error('Invalid report type');
    }
  }

  private validateStatusTransition(
    currentStatus: string,
    newStatus: string
  ): void {
    const validTransitions: Record<string, string[]> = {
      'PENDING': ['IN_PROGRESS', 'REJECTED'],
      'IN_PROGRESS': ['RESOLVED', 'PENDING'],
      'RESOLVED': [],
      'REJECTED': []
    };

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      throw new Error(
        `Invalid status transition from ${currentStatus} to ${newStatus}`
      );
    }
  }
}
```

### Testing Example

**File: `tests/unit/services/AuthService.test.ts`**
```typescript
import { AuthService } from '@services/AuthService';
import { AccountRepository } from '@repositories/AccountRepository';
import { JwtManager } from '@utils/JwtManager';
import { Account } from '@models/Account';

// Mock dependencies
jest.mock('@repositories/AccountRepository');
jest.mock('@utils/JwtManager');

describe('AuthService', () => {
  let authService: AuthService;
  let mockAccountRepo: jest.Mocked<AccountRepository>;
  let mockJwtManager: jest.Mocked<JwtManager>;

  beforeEach(() => {
    mockAccountRepo = new AccountRepository() as jest.Mocked<AccountRepository>;
    mockJwtManager = new JwtManager() as jest.Mocked<JwtManager>;
    authService = new AuthService(mockAccountRepo, mockJwtManager);
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      // Arrange
      const registerData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        account_type: 'STUDENT' as const
      };

      mockAccountRepo.findByEmail.mockResolvedValue(null);
      mockAccountRepo.create.mockResolvedValue(
        new Account({
          ACCOUNT_ID: 1,
          NAME: registerData.name,
          EMAIL: registerData.email,
          PASSWORD_HASH: 'hashed',
          ACCOUNT_TYPE: 'STUDENT'
        })
      );
      mockJwtManager.generateToken.mockReturnValue('fake-token');

      // Act
      const result = await authService.register(registerData);

      // Assert
      expect(result.success).toBe(true);
      expect(result.token).toBe('fake-token');
      expect(result.account).toBeDefined();
      expect(mockAccountRepo.create).toHaveBeenCalled();
    });

    it('should fail if email already exists', async () => {
      // Arrange
      const registerData = {
        name: 'John Doe',
        email: 'existing@example.com',
        password: 'password123',
        account_type: 'STUDENT' as const
      };

      mockAccountRepo.findByEmail.mockResolvedValue(
        new Account({
          ACCOUNT_ID: 1,
          NAME: 'Existing User',
          EMAIL: 'existing@example.com',
          PASSWORD_HASH: 'hashed',
          ACCOUNT_TYPE: 'STUDENT'
        })
      );

      // Act
      const result = await authService.register(registerData);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe('Email already registered');
      expect(mockAccountRepo.create).not.toHaveBeenCalled();
    });
  });
});
```

---

## Testing Strategy

### Test Pyramid

```
        /\
       /  \
      / E2E \      10% - End-to-end tests
     /______\
    /        \
   /Integration\   20% - Integration tests
  /____________\
 /              \
/  Unit Tests    \ 70% - Unit tests
/__________________\
```

### Testing Layers

1. **Unit Tests (70%)**
   - Test individual classes in isolation
   - Mock all dependencies
   - Fast execution
   - Run on every commit

2. **Integration Tests (20%)**
   - Test component interactions
   - Use test database
   - Slower execution
   - Run before merge

3. **E2E Tests (10%)**
   - Test full user workflows
   - Real database (test environment)
   - Slowest execution
   - Run before deployment

### Test Coverage Goals
- **Overall:** 80% minimum
- **Services:** 90% minimum (critical business logic)
- **Repositories:** 85% minimum
- **Controllers:** 75% minimum
- **Models:** 95% minimum

---

## Rollback Plan

### Immediate Rollback (< 5 minutes)
```bash
# Switch feature flag back to old backend
export USE_NEW_BACKEND=false
pm2 restart api
```

### Partial Rollback (Specific Endpoints)
```typescript
// In routes/index.ts
const endpointsToRollback = ['/api/reports', '/api/staff'];

app.use((req, res, next) => {
  if (endpointsToRollback.some(path => req.path.startsWith(path))) {
    return proxyToOldBackend(req, res);
  }
  next();
});
```

### Database Rollback
- Keep old database schema intact
- New features use new tables only
- No destructive migrations until stability confirmed

---

## Success Metrics

### Performance Metrics
- ✅ Response time: < 200ms (95th percentile)
- ✅ Database queries: Reduce by 20% (N+1 elimination)
- ✅ Memory usage: Stable under load
- ✅ Error rate: < 0.1%

### Code Quality Metrics
- ✅ Test coverage: > 80%
- ✅ Type safety: 100% (no `any` types in production)
- ✅ Code duplication: < 5%
- ✅ Cyclomatic complexity: < 10 per function

### Development Metrics
- ✅ Time to implement new feature: Reduce by 30%
- ✅ Bug fix time: Reduce by 40%
- ✅ Code review time: Reduce by 25%
- ✅ Onboarding time for new developers: Reduce by 50%

---

## Next Steps

1. **Review this plan** with your team
2. **Set up development environment** (TypeScript, testing tools)
3. **Create a pilot module** (recommend Auth module first)
4. **Benchmark current performance** (baseline metrics)
5. **Begin Phase 1** implementation
6. **Schedule weekly reviews** to track progress

---

## Additional Resources

### Recommended Reading
- Clean Architecture by Robert C. Martin
- Design Patterns: Elements of Reusable Object-Oriented Software
- TypeScript Deep Dive (online book)
- Node.js Design Patterns

### Tools & Libraries
- **Testing:** Jest, Supertest
- **Validation:** Zod, class-validator
- **Documentation:** TypeDoc, Swagger
- **Code Quality:** ESLint, Prettier, SonarQube
- **CI/CD:** GitHub Actions, Jenkins

---

## Questions & Support

For questions about this migration plan, contact:
- Technical Lead: [Your Name]
- Architecture Review: [Team Lead]
- Database Support: [DBA Team]

**Document End**
