const API_URL = 'http://localhost:5000/api/analytics';

// Helper function to get token
const getToken = (token) => {
  return token || localStorage.getItem('token');
};

export async function getOverallStats(token) {
  const authToken = getToken(token);
  if (!authToken) throw new Error('No authentication token provided');
  
  const res = await fetch(`${API_URL}/overall`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Failed to fetch overall stats' }));
    throw new Error(error.message || 'Failed to fetch overall stats');
  }
  return res.json();
}

export async function getStatusDistribution(token) {
  const authToken = getToken(token);
  if (!authToken) throw new Error('No authentication token provided');
  
  const res = await fetch(`${API_URL}/status`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Failed to fetch status distribution' }));
    throw new Error(error.message || 'Failed to fetch status distribution');
  }
  return res.json();
}

export async function getCategoryDistribution(token) {
  const authToken = getToken(token);
  if (!authToken) throw new Error('No authentication token provided');
  
  const res = await fetch(`${API_URL}/category`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Failed to fetch category distribution' }));
    throw new Error(error.message || 'Failed to fetch category distribution');
  }
  return res.json();
}

export async function getTrendAnalysis(token) {
  const authToken = getToken(token);
  if (!authToken) throw new Error('No authentication token provided');
  
  const res = await fetch(`${API_URL}/trend`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Failed to fetch trend analysis' }));
    throw new Error(error.message || 'Failed to fetch trend analysis');
  }
  return res.json();
}

export async function getAgencyPerformance(token) {
  const authToken = getToken(token);
  if (!authToken) throw new Error('No authentication token provided');
  
  const res = await fetch(`${API_URL}/agency-performance`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Failed to fetch agency performance' }));
    throw new Error(error.message || 'Failed to fetch agency performance');
  }
  return res.json();
} 