/**
 * Crime Reports API v2 - Integration with new OOP backend
 */

import { apiClient } from './client';

export interface CreateCrimeDTO {
  // Report fields
  TITLE: string;
  DESCRIPTION: string;
  LOCATION?: string;
  ANONYMOUS: boolean;
  SUBMITTER_ID: number;
  
  // Crime-specific fields
  CRIME_CATEGORY: 'CYBERBULLYING' | 'HACKING' | 'PHISHING' | 'IDENTITY_THEFT' | 'FRAUD' | 'HARASSMENT' | 'DATA_BREACH' | 'MALWARE' | 'RANSOMWARE' | 'OTHER';
  SEVERITY_LEVEL: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  SUSPECT_DESCRIPTION?: string;
  WITNESS_COUNT?: number;
  EVIDENCE_DESCRIPTION?: string;
  WEAPON_INVOLVED?: boolean;
  WEAPON_DESCRIPTION?: string;
  VICTIM_NAME?: string;
  VICTIM_CONTACT?: string;
  INJURIES_SUSTAINED?: boolean;
  INJURY_DESCRIPTION?: string;
}

export interface UpdateCrimeDTO {
  TITLE?: string;
  DESCRIPTION?: string;
  STATUS?: string;
  SUSPECT_DESCRIPTION?: string;
  EVIDENCE_DESCRIPTION?: string;
}

export const crimesApiV2 = {
  // Get all crimes
  getAll: async () => {
    return apiClient.get('/crimes');
  },

  // Get crime by ID
  getById: async (id: number) => {
    return apiClient.get(`/crimes/${id}`);
  },

  // Create crime report
  create: async (data: CreateCrimeDTO) => {
    return apiClient.post('/crimes', data);
  },

  // Update crime report
  update: async (id: number, data: UpdateCrimeDTO) => {
    return apiClient.put(`/crimes/${id}`, data);
  },

  // Delete crime report
  delete: async (id: number) => {
    return apiClient.delete(`/crimes/${id}`);
  },

  // Get crimes with weapons
  getWithWeapons: async () => {
    return apiClient.get('/crimes/with-weapons');
  },

  // Get crimes with victims
  getWithVictims: async () => {
    return apiClient.get('/crimes/with-victims');
  },

  // Get high severity crimes
  getHighSeverity: async () => {
    return apiClient.get('/crimes/high-severity');
  },

  // Get active crimes
  getActive: async () => {
    return apiClient.get('/crimes/active');
  },

  // Get crime statistics by category
  getStatsByCategory: async () => {
    return apiClient.get('/crimes/statistics/category');
  },

  // Get crime statistics by severity
  getStatsBySeverity: async () => {
    return apiClient.get('/crimes/statistics/severity');
  },

  // Get crimes by category
  getByCategory: async (category: string) => {
    return apiClient.get(`/crimes/category/${category}`);
  },

  // Get crimes by severity
  getBySeverity: async (severity: string) => {
    return apiClient.get(`/crimes/severity/${severity}`);
  },
};
