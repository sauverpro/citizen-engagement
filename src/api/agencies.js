import { buildApiUrl, getAuthHeaders } from '../config/api.js';

export async function getAgencies(token) {
  const res = await fetch(buildApiUrl('/agencies'), {
    headers: getAuthHeaders(token)
  });
  if (!res.ok) throw new Error('Failed to fetch agencies');

  console.log(token);
  
  return res.json();
}

export async function getAgency(token, id) {
  const res = await fetch(`${buildApiUrl('/agencies')}/${id}`, {
    headers: getAuthHeaders(token)
  });
  if (!res.ok) throw new Error('Failed to fetch agency');
  return res.json();
}

export async function createAgency(token,agencyData) {
  console.log(".........data",agencyData,"token......",token);
  const res = await fetch(buildApiUrl('/agencies'), {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(agencyData)
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to create agency');
  }
  return res.json();
}

export async function updateAgency(id, agencyData, token) {
  const res = await fetch(buildApiUrl(`/agencies/${id}`), {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(agencyData)
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to update agency');
  }
  return res.json();
}

export async function deleteAgency(id, token) {
  const res = await fetch(buildApiUrl(`/agencies/${id}`), {
    method: 'DELETE',
    headers: getAuthHeaders(token)
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to delete agency');
  }
  return res.json();
}
