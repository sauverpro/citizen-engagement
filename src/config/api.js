// API base URL - using environment-specific URL
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://citizen-engagement-backend.onrender.com/api'
  : '/api';

// Helper function to build API URLs
export const buildApiUrl = (endpoint) => {
  // Remove leading slash from endpoint if it exists
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  // Return the full URL
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

// Common headers for API requests
export const getAuthHeaders = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`
}); 