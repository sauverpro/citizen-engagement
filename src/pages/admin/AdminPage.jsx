import React, { useEffect, useState, useCallback } from 'react';
import AdminDashboard from './AdminDashboard.jsx';
import { getComplaints, respondToComplaint } from '../../api/complaints.js';
import { useAuthContext } from '../../hooks/useAuth.js';

export default function AdminPage() {
  const { user } = useAuthContext();
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchComplaints = useCallback(async () => {
    if (!user || !user.token) return;
    setLoading(true);
    setError('');
    try {
      const data = await getComplaints(user.token);
      setComplaints(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchComplaints(); }, [fetchComplaints]);

  const handleRespond = async (id, status, response) => {
    if (!user || !user.token) return;
    setLoading(true);
    setError('');
    try {
      await respondToComplaint(id, response, user.token, status);
      await fetchComplaints();
    } catch (err) {
      setError(err.message || 'Failed to update complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Admin/Agency Dashboard</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading && <div className="text-gray-500 mb-2">Loading...</div>}
      <AdminDashboard complaints={complaints} onRespond={handleRespond} />
    </div>
  );
}
