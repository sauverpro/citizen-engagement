import { buildApiUrl, getAuthHeaders } from '../config/api.js';

export async function getUsers(token) {
  const res = await fetch(buildApiUrl('/users'), {
    headers: getAuthHeaders(token)
  });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function updateUser(id, userData, token) {
  const res = await fetch(buildApiUrl(`/users/${id}`), {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(userData)
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to update user');
  }
  return res.json();
}

export async function deleteUser(id, token) {
  const res = await fetch(buildApiUrl(`/users/${id}`), {
    method: 'DELETE',
    headers: getAuthHeaders(token)
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to delete user');
  }
  return res.json();
}

export async function createUser(userData, token) {
  const res = await fetch(buildApiUrl('/users'), {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(userData)
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to create user');
  }
  return res.json();
}
