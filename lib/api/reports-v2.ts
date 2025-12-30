/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Reports API v2 - Integration with new OOP backend
 */

import { apiClient } from './client';

export interface CreateReportDTO {
  REPORT_TYPE: 'CRIME' | 'FACILITY';
  TITLE: string;
  DESCRIPTION: string;
  LOCATION: string;
  INCIDENT_DATE?: Date;
  ANONYMOUS: boolean;
  SUBMITTER_ID: number;
}

export interface UpdateReportDTO {
  TITLE?: string;
  DESCRIPTION?: string;
  LOCATION?: string;
  STATUS?: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'REJECTED';
}

export interface ReportFilters {
  status?: string;
  type?: string;
  submitterId?: number;
  startDate?: string;
  endDate?: string;
}

export const reportsApiV2 = {
  // Get all reports
  getAll: async (filters?: ReportFilters) => {
    const queryParams = new URLSearchParams(filters as any).toString();
    const endpoint = queryParams ? `/reports?${queryParams}` : '/reports';
    return apiClient.get(endpoint);
  },

  // Get report by ID
  getById: async (id: number) => {
    return apiClient.get(`/reports/${id}`);
  },

  // Create new report
  create: async (data: CreateReportDTO) => {
    return apiClient.post('/reports', data);
  },

  // Update report
  update: async (id: number, data: UpdateReportDTO) => {
    return apiClient.put(`/reports/${id}`, data);
  },

  // Delete report
  delete: async (id: number) => {
    return apiClient.delete(`/reports/${id}`);
  },

  // Get pending reports
  getPending: async () => {
    return apiClient.get('/reports/pending');
  },

  // Get active reports
  getActive: async () => {
    return apiClient.get('/reports/active');
  },

  // Get recent reports
  getRecent: async () => {
    return apiClient.get('/reports/recent');
  },

  // Search reports
  search: async (query: string, filters?: ReportFilters) => {
    const params = new URLSearchParams({ query, ...(filters as any) });
    return apiClient.get(`/reports/search?${params.toString()}`);
  },

  // Get statistics
  getStatistics: async () => {
    return apiClient.get('/reports/statistics');
  },

  // Get reports by status
  getByStatus: async (status: string) => {
    return apiClient.get(`/reports/status/${status}`);
  },

  // Get reports by type
  getByType: async (type: string) => {
    return apiClient.get(`/reports/type/${type}`);
  },

  // Get reports by submitter
  getBySubmitter: async (submitterId: number) => {
    return apiClient.get(`/reports/submitter/${submitterId}`);
  },
};
