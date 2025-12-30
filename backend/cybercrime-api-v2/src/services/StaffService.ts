import { Staff } from '../models/Staff';
import { StaffRepository } from '../repositories/StaffRepository';
import { Logger } from '../utils/Logger';
import { Role } from '../types/enums';

const logger = new Logger('StaffService');

export interface CreateStaffDTO {
  account_id: number;
  staff_id: string;
  role: Role;
  department: string;
  position: string;
  supervisor_id?: number;
}

export interface UpdateStaffDTO {
  role?: Role;
  department?: string;
  position?: string;
  supervisor_id?: number;
}

export interface StaffSearchFilters {
  role?: Role;
  department?: string;
  query?: string;
}

export class StaffService {
  private staffRepo: StaffRepository;

  constructor(staffRepo: StaffRepository = new StaffRepository()) {
    this.staffRepo = staffRepo;
  }

  /**
   * Get all staff with optional filters
   */
  async getAll(filters?: StaffSearchFilters): Promise<Staff[]> {
    try {
      return await this.staffRepo.findAll(filters);
    } catch (error) {
      logger.error('Error getting all staff:', error);
      throw error;
    }
  }

  /**
   * Get staff by ID
   */
  async getById(accountId: number): Promise<Staff | null> {
    try {
      return await this.staffRepo.findById(accountId);
    } catch (error) {
      logger.error(`Error getting staff by ID ${accountId}:`, error);
      throw error;
    }
  }

  /**
   * Search staff by query (searches name, email)
   */
  async search(query: string, filters?: Omit<StaffSearchFilters, 'query'>): Promise<Staff[]> {
    try {
      const staff = await this.staffRepo.search(query);
      
      // Apply additional filters if provided
      if (!filters) {
        return staff;
      }

      return staff.filter(s => {
        if (filters.role && s.getRole() !== filters.role) {
          return false;
        }
        if (filters.department && s.getDepartment() !== filters.department) {
          return false;
        }
        return true;
      });
    } catch (error) {
      logger.error('Error searching staff:', error);
      throw error;
    }
  }

  /**
   * Create new staff record
   */
  async create(data: CreateStaffDTO): Promise<Staff> {
    try {
      // Validate required fields
      if (!data.account_id || !data.role || !data.department || !data.position) {
        throw new Error('Account ID, role, department, and position are required');
      }

      // Validate role
      if (!Object.values(Role).includes(data.role)) {
        throw new Error('Invalid role');
      }

      // If supervisor is provided, verify they exist
      if (data.supervisor_id) {
        const supervisor = await this.staffRepo.findById(data.supervisor_id);
        if (!supervisor) {
          throw new Error('Supervisor not found');
        }
      }

      // Fetch the account to get full data
      const account = await this.staffRepo.findById(data.account_id);
      if (account) {
        // Update existing staff record
        return await this.staffRepo.update(data.account_id, {
          STAFF_ID: data.staff_id,
          ROLE: data.role,
          DEPARTMENT: data.department,
          POSITION: data.position,
          SUPERVISOR_ID: data.supervisor_id
        });
      }

      throw new Error('Account not found');
    } catch (error) {
      logger.error('Error creating staff:', error);
      throw error;
    }
  }

  /**
   * Update staff information
   */
  async update(accountId: number, updates: UpdateStaffDTO): Promise<Staff> {
    try {
      // Check if staff exists
      const existing = await this.staffRepo.findById(accountId);
      if (!existing) {
        throw new Error('Staff not found');
      }

      // Validate role if updating
      if (updates.role && !Object.values(Role).includes(updates.role)) {
        throw new Error(`Invalid role: ${updates.role}. Valid roles: ${Object.values(Role).join(', ')}`);
      }

      // If updating supervisor, verify they exist
      if (updates.supervisor_id) {
        const supervisor = await this.staffRepo.findById(updates.supervisor_id);
        if (!supervisor) {
          throw new Error('Supervisor not found');
        }

        // Prevent circular supervision
        if (updates.supervisor_id === accountId) {
          throw new Error('Cannot set self as supervisor');
        }
      }

      const updated = await this.staffRepo.update(accountId, updates);
      logger.info(`Staff updated: ${accountId}`);
      return updated;
    } catch (error) {
      logger.error('Error updating staff:', error);
      throw error;
    }
  }

  /**
   * Delete staff record
   */
  async delete(accountId: number): Promise<boolean> {
    try {
      const existing = await this.staffRepo.findById(accountId);
      if (!existing) {
        throw new Error('Staff not found');
      }

      const deleted = await this.staffRepo.delete(accountId);
      if (deleted) {
        logger.info(`Staff deleted: ${accountId}`);
      }
      return deleted;
    } catch (error) {
      logger.error('Error deleting staff:', error);
      throw error;
    }
  }

  /**
   * Get staff by role
   */
  async getByRole(role: Role): Promise<Staff[]> {
    try {
      if (!Object.values(Role).includes(role)) {
        throw new Error('Invalid role');
      }
      return await this.staffRepo.findAll({ role });
    } catch (error) {
      logger.error(`Error getting staff by role ${role}:`, error);
      throw error;
    }
  }

  /**
   * Get staff by department
   */
  async getByDepartment(department: string): Promise<Staff[]> {
    try {
      return await this.staffRepo.findAll({ department });
    } catch (error) {
      logger.error(`Error getting staff by department ${department}:`, error);
      throw error;
    }
  }

  /**
   * Get staff supervised by a specific supervisor
   */
  async getSubordinates(supervisorId: number): Promise<Staff[]> {
    try {
      const allStaff = await this.staffRepo.findAll();
      return allStaff.filter(staff => staff.getSupervisorId() === supervisorId);
    } catch (error) {
      logger.error(`Error getting subordinates for supervisor ${supervisorId}:`, error);
      throw error;
    }
  }

  /**
   * Get statistics about staff
   */
  async getStatistics(): Promise<{
    total: number;
    byRole: Record<Role, number>;
    byDepartment: Record<string, number>;
  }> {
    try {
      const allStaff = await this.staffRepo.findAll();

      const stats = {
        total: allStaff.length,
        byRole: {} as Record<Role, number>,
        byDepartment: {} as Record<string, number>
      };

      // Initialize role counts
      Object.values(Role).forEach(role => {
        stats.byRole[role] = 0;
      });

      allStaff.forEach(staff => {
        const role = staff.getRole();
        const department = staff.getDepartment();

        // Count by role
        stats.byRole[role] = (stats.byRole[role] || 0) + 1;

        // Count by department
        stats.byDepartment[department] = (stats.byDepartment[department] || 0) + 1;
      });

      return stats;
    } catch (error) {
      logger.error('Error getting staff statistics:', error);
      throw error;
    }
  }

  /**
   * Get all available departments
   */
  async getDepartments(): Promise<string[]> {
    try {
      const allStaff = await this.staffRepo.findAll();
      const departments = new Set<string>();
      
      allStaff.forEach(staff => {
        const dept = staff.getDepartment();
        if (dept) {
          departments.add(dept);
        }
      });

      return Array.from(departments).sort();
    } catch (error) {
      logger.error('Error getting departments:', error);
      throw error;
    }
  }
}
