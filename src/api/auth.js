// src/api.js
import { buildApiUrl, getAuthHeaders } from '../config/api.js';

export async function login(email, password) {
  console.log('Attempting login with:', { email });
  try {
    const res = await fetch(buildApiUrl('/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    console.log('Login response status:', res.status);
    const data = await res.json();
    console.log('Login response data:', data);
    
    if (!res.ok) {
      throw new Error(data.message || data.error || 'Login failed');
    }
    
    return data;
  } catch (err) {
    console.error('Login error:', err);
    throw err;
  }
}

export async function register(name, email, password, role = 'user', agencyId = null) {
  const res = await fetch(buildApiUrl('/auth/register'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role, agencyId })
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Registration failed');
  }
  return res.json();
}

// Add verifyToken for AuthContext
export async function verifyToken(token) {
  const res = await fetch(buildApiUrl('/auth/verify'), {
    headers: getAuthHeaders(token)
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Token verification failed');
  }
  return res.json();
}

export async function logout(token) {
  const res = await fetch(buildApiUrl('/auth/logout'), {
    method: 'POST',
    headers: getAuthHeaders(token)
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Logout failed');
  }
  return res.json();
}
