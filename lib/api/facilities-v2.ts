/**
 * Facility Reports API v2 - Integration with new OOP backend
 */

import { apiClient } from './client';

export interface CreateFacilityDTO {
  // Report fields
  TITLE: string;
  DESCRIPTION: string;
  INCIDENT_DATE: Date;
  LOCATION?: string;
  ANONYMOUS: boolean;
  SUBMITTER_ID: number;
  
  // Facility-specific fields
  FACILITY_TYPE: 'ELECTRICAL' | 'PLUMBING' | 'HVAC' | 'STRUCTURAL' | 'EQUIPMENT' | 'FURNITURE' | 'SAFETY' | 'CLEANING' | 'LANDSCAPING' | 'OTHER';
  URGENCY: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  BUILDING_NAME?: string;
  ROOM_NUMBER?: string;
  EQUIPMENT_ID?: string;
  MAINTENANCE_REQUIRED: boolean;
  ESTIMATED_COST?: number;
  AFFECTED_AREA_SIZE?: number;
}

export interface UpdateFacilityDTO {
  TITLE?: string;
  DESCRIPTION?: string;
  STATUS?: string;
  MAINTENANCE_REQUIRED?: boolean;
  ESTIMATED_COST?: number;
}

export const facilitiesApiV2 = {
  // Get all facilities
  getAll: async () => {
    return apiClient.get('/facilities');
  },

  // Get facility by ID
  getById: async (id: number) => {
    return apiClient.get(`/facilities/${id}`);
  },

  // Create facility report
  create: async (data: CreateFacilityDTO) => {
    return apiClient.post('/facilities', data);
  },

  // Update facility report
  update: async (id: number, data: UpdateFacilityDTO) => {
    return apiClient.put(`/facilities/${id}`, data);
  },

  // Delete facility report
  delete: async (id: number) => {
    return apiClient.delete(`/facilities/${id}`);
  },

  // Get facilities requiring maintenance
  getMaintenanceRequired: async () => {
    return apiClient.get('/facilities/maintenance-required');
  },

  // Get urgent facilities
  getUrgent: async () => {
    return apiClient.get('/facilities/urgent');
  },

  // Get active facilities
  getActive: async () => {
    return apiClient.get('/facilities/active');
  },

  // Get maintenance backlog
  getMaintenanceBacklog: async () => {
    return apiClient.get('/facilities/maintenance-backlog');
  },

  // Get facility statistics by type
  getStatsByType: async () => {
    return apiClient.get('/facilities/statistics/type');
  },

  // Get facility statistics by urgency
  getStatsByUrgency: async () => {
    return apiClient.get('/facilities/statistics/urgency');
  },

  // Get cost summary
  getCostSummary: async () => {
    return apiClient.get('/facilities/cost-summary');
  },

  // Get total estimated cost
  getTotalCost: async () => {
    return apiClient.get('/facilities/total-cost');
  },

  // Get facilities by type
  getByType: async (type: string) => {
    return apiClient.get(`/facilities/type/${type}`);
  },

  // Get facilities by urgency
  getByUrgency: async (urgency: string) => {
    return apiClient.get(`/facilities/urgency/${urgency}`);
  },

  // Get facilities by building
  getByBuilding: async (building: string) => {
    return apiClient.get(`/facilities/building/${building}`);
  },
};
