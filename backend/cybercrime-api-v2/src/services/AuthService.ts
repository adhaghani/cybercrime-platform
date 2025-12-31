/* eslint-disable @typescript-eslint/no-explicit-any */
import { Account, AccountData } from '../models/Account';
import { Student } from '../models/Student';
import { Staff } from '../models/Staff';
import { AccountRepository } from '../repositories/AccountRepository';
import { StudentRepository } from '../repositories/StudentRepository';
import { StaffRepository } from '../repositories/StaffRepository';
import { PasswordHasher } from '../utils/PasswordHasher';
import { JwtManager } from '../utils/JwtManager';
import { Logger } from '../utils/Logger';
import { AccountType } from '../types/enums';

const logger = new Logger('AuthService');

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  contact_number?: string;
  account_type: 'STUDENT' | 'STAFF';
  // Student-specific fields
  studentID?: string;
  program?: string;
  semester?: number;
  year_of_study?: number;
  // Staff-specific fields
  staffID?: string;
  role?: string;
  department?: string;
  position?: string;
  supervisorID?: string;
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
  private studentRepo: StudentRepository;
  private staffRepo: StaffRepository;
  private jwtManager: JwtManager;

  constructor(
    accountRepo: AccountRepository = new AccountRepository(),
    studentRepo: StudentRepository = new StudentRepository(),
    staffRepo: StaffRepository = new StaffRepository(),
    jwtManager: JwtManager = new JwtManager()
  ) {
    this.accountRepo = accountRepo;
    this.studentRepo = studentRepo;
    this.staffRepo = staffRepo;
    this.jwtManager = jwtManager;
  }

  /**
   * Register new account
   */
  async register(data: RegisterDTO): Promise<AuthResult> {
    try {
      // Validate password strength
      const passwordValidation = PasswordHasher.validateStrength(data.password);
      if (!passwordValidation.valid) {
        return {
          success: false,
          message: passwordValidation.errors.join(', ')
        };
      }

      // Check if email already exists
      const existingAccount = await this.accountRepo.findByEmail(data.email);
      if (existingAccount) {
        return {
          success: false,
          message: 'Email already registered'
        };
      }

      // Hash password
      const passwordHash = await PasswordHasher.hash(data.password);

      // Create account
      const accountData: AccountData = {
        NAME: data.name,
        EMAIL: data.email,
        PASSWORD_HASH: passwordHash,
        CONTACT_NUMBER: data.contact_number,
        ACCOUNT_TYPE: data.account_type as AccountType
      };

      const account = new Account(accountData);
      const createdAccount = await this.accountRepo.create(account);

      // Create student or staff profile based on account type
      let profileAccount: Account | Student | Staff = createdAccount;
      
      if (data.account_type === 'STUDENT') {
        // Validate student-specific fields
        if (!data.studentID || !data.program || !data.semester || !data.year_of_study) {
          throw new Error('Student ID, program, semester, and year of study are required for student accounts');
        }

        const studentData = {
          ...accountData,
          ACCOUNT_ID: createdAccount.getId(),
          STUDENT_ID: data.studentID,
          PROGRAM: data.program,
          SEMESTER: data.semester,
          YEAR_OF_STUDY: data.year_of_study
        };
        
        const student = new Student(studentData);
        profileAccount = await this.studentRepo.create(student);
        logger.info(`New student registered: ${profileAccount.getEmail()} (${data.studentID})`);
      } else if (data.account_type === 'STAFF') {
        // Validate staff-specific fields
        if (!data.staffID || !data.role || !data.department || !data.position) {
          throw new Error('Staff ID, role, department, and position are required for staff accounts');
        }

        const staffData = {
          ...accountData,
          ACCOUNT_ID: createdAccount.getId(),
          STAFF_ID: data.staffID,
          ROLE: data.role as any,
          DEPARTMENT: data.department,
          POSITION: data.position,
          SUPERVISOR_ID: data.supervisorID ? parseInt(data.supervisorID) : undefined
        };
        
        const staff = new Staff(staffData);
        profileAccount = await this.staffRepo.create(staff);
        logger.info(`New staff registered: ${profileAccount.getEmail()} (${data.role})`);
      }

      // Generate JWT token with role for staff
      const tokenPayload: any = {
        accountId: profileAccount.getId()!,
        email: profileAccount.getEmail(),
        accountType: profileAccount.getAccountType()
      };

      // Add role for staff users
      if (data.account_type === 'STAFF' && data.role) {
        tokenPayload.role = data.role;
      }

      const token = this.jwtManager.generateToken(tokenPayload);

      return {
        success: true,
        token,
        account: profileAccount,
        message: 'Registration successful'
      };
    } catch (error) {
      logger.error('Registration error:', error);
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
      const isPasswordValid = await PasswordHasher.compare(
        data.password,
        account.getPasswordHash()
      );

      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }

      logger.info(`User logged in: ${account.getEmail()}`);

      // Generate JWT token with role for staff users
      const tokenPayload: any = {
        accountId: account.getId()!,
        email: account.getEmail(),
        accountType: account.getAccountType()
      };

      // Add role for staff users (accessed from internal data)
      if (account.getAccountType() === 'STAFF' && (account as any)._data.ROLE) {
        tokenPayload.role = (account as any)._data.ROLE;
      }

      const token = this.jwtManager.generateToken(tokenPayload);

      return {
        success: true,
        token,
        account,
        message: 'Login successful'
      };
    } catch (error) {
      logger.error('Login error:', error);
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

  /**
   * Update account
   */
  async updateAccount(id: number, updates: Partial<AccountData>): Promise<Account> {
    // If password is being updated, hash it
    if (updates.PASSWORD_HASH) {
      updates.PASSWORD_HASH = await PasswordHasher.hash(updates.PASSWORD_HASH);
    }

    return this.accountRepo.update(id, updates);
  }
}
