/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { AccountRepository } from '../repositories/AccountRepository';
import { Logger } from '../utils/Logger';

const logger = new Logger('AccountController');

export class AccountController {
  private accountRepo: AccountRepository;

  constructor() {
    this.accountRepo = new AccountRepository();
  }

  /**
   * GET /api/v2/accounts
   * Get all accounts with student/staff details
   */
  getAllAccounts = async (req: Request, res: Response): Promise<void> => {
    try {
      const accounts = await this.accountRepo.findAllWithDetails();
      res.status(200).json({ success: true, data: accounts });
    } catch (error: any) {
      logger.error('Get all accounts error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/accounts/count
   * Get count of accounts by type
   */
  getAccountsCount = async (req: Request, res: Response): Promise<void> => {
    try {
      const counts = await this.accountRepo.getAccountCounts();
      res.status(200).json({ success: true, data: counts });
    } catch (error: any) {
      logger.error('Get accounts count error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  };

  /**
   * GET /api/v2/accounts/:id
   * Get account by ID with student/staff details
   */
  getAccountById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const account = await this.accountRepo.findByIdWithDetails(Number(id));
      
      if (!account) {
        res.status(404).json({ success: false, error: 'Account not found' });
        return;
      }
      
      res.status(200).json({ success: true, data: account });
    } catch (error: any) {
      logger.error('Get account by ID error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  };

  /**
   * PUT /api/v2/accounts/:id
   * Update account
   */
  updateAccount = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const NewUpdate = {
        NAME: updates.name,
        EMAIL: updates.email,
        CONTACT_NUMBER: updates.contact_number,
        AVATAR_URL: updates.avatar_url,
        ACCOUNT_TYPE: updates.account_type,
        STUDENT_ID: updates.student_id,
        PROGRAM: updates.program,
        SEMESTER: updates.semester,
        YEAR_OF_STUDY: updates.year_of_study,
        STAFF_ID: updates.staff_id,
        DEPARTMENT: updates.department,
        POSITION: updates.position,
      }
      const updatedAccount = await this.accountRepo.update(Number(id), NewUpdate);
      res.status(200).json({ 
        success: true, 
        message: 'Account updated successfully',
        data: updatedAccount.toJSON()
      });
    } catch (error: any) {
      logger.error('Update account error:', error);
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * DELETE /api/v2/accounts/:id
   * Delete account
   */
  deleteAccount = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.accountRepo.delete(Number(id));
      res.status(200).json({ 
        success: true, 
        message: 'Account deleted successfully'
      });
    } catch (error: any) {
      logger.error('Delete account error:', error);
      res.status(400).json({ success: false, error: error.message });
    }
  };
}
