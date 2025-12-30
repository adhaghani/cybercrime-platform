/* eslint-disable @typescript-eslint/no-explicit-any */
import { Account, AccountData } from '../models/Account';
import { AccountRepository } from '../repositories/AccountRepository';
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

      logger.info(`New account registered: ${createdAccount.getEmail()}`);

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
