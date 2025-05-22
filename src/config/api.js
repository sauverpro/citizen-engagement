// API base URL - using relative path for proxy support
export const API_BASE_URL = '/api';

// Helper function to build API URLs
export const buildApiUrl = (endpoint) => {
  // Remove leading slash from endpoint if it exists
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  // Return the full URL with the /api prefix
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

// Common headers for API requests
export const getAuthHeaders = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`
}); 