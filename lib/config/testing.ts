/**
 * Global configuration for testing mode
 * Set to true to use mock data for authentication and API testing
 * Set to false to use real API endpoints
 */
export const IS_TESTING = true;

/**
 * Auth testing configuration
 * When IS_TESTING is true, mock authentication will be used
 */
export const TESTING_CONFIG = {
  mockAuth: IS_TESTING,
  mockUser: {
    id: 'test-user-1',
    email: 'test@example.com',
    role: 'SUPERADMIN',
    name: 'Test User',
  },
};
