import { buildApiUrl, getAuthHeaders } from '../config/api.js';

export async function getComplaints(token) {
  const res = await fetch(buildApiUrl('/complaints'), {
    headers: getAuthHeaders(token)
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Failed to fetch complaints' }));
    throw new Error(error.message || 'Failed to fetch complaints');
  }
  return res.json();
}

export async function getComplaint(token, id) {
  const res = await fetch(buildApiUrl(`/complaints/${id}`), {
    headers: getAuthHeaders(token)
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Failed to fetch complaint' }));
    throw new Error(error.message || 'Failed to fetch complaint');
  }
  return res.json();
}

export async function submitComplaint(token, data) {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'attachments' && value) {
      Array.from(value).forEach(file => formData.append('attachments', file));
    } else {
      formData.append(key, value);
    }
  });
  const res = await fetch(buildApiUrl('/complaints'), {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Complaint submission failed' }));
    throw new Error(error.message || 'Complaint submission failed');
  }
  return res.json();
}

export async function respondToComplaint(token, id, status, response) {
  const res = await fetch(buildApiUrl(`/complaints/${id}/respond`), {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ status, response })
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Failed to update complaint' }));
    throw new Error(error.message || 'Failed to update complaint');
  }
  return res.json();
}

export async function assignAgencyToComplaint(token, id, agencyId) {
  const res = await fetch(buildApiUrl(`/complaints/${id}/assign-agency`), {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ agencyId })
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Failed to assign agency' }));
    throw new Error(error.message || 'Failed to assign agency');
  }
  return res.json();
}
