import React, { useEffect, useState, useCallback } from 'react';
import { getComplaints, respondToComplaint } from '../../api/complaints.js';
import { getUsers } from '../../api/users.js';
import { getAgencies } from '../../api/agencies.js';
import { useAuthContext } from '../../hooks/useAuth.js';
import DashboardAnalytics from '../../components/analytics/DashboardAnalytics';

export default function AdminDashboard() {
  const { user } = useAuthContext();
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('analytics');

  const fetchData = useCallback(async () => {
    if (!user || !user.token) return;
    setLoading(true);
    setError('');
    try {
      const [complaintsData, usersData, agenciesData] = await Promise.all([
        getComplaints(user.token),
        getUsers(user.token),
        getAgencies(user.token)
      ]);
      setComplaints(complaintsData);
      setUsers(usersData);
      setAgencies(agenciesData);
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleRespond = async (id, status, response) => {
    if (!user || !user.token) return;
    setLoading(true);
    setError('');
    try {
      await respondToComplaint(id, response, user.token, status);
      await fetchData();
    } catch (err) {
      setError(err.message || 'Failed to update complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard-container max-w-7xl mx-auto mt-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300">Admin Dashboard</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'analytics'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('complaints')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'complaints'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Complaints
          </button>
        </div>
      </div>

      {error && <div className="text-red-600 mb-4 p-4 bg-red-100 dark:bg-red-900 rounded">{error}</div>}
      {loading && (
        <div className="text-gray-500 mb-4 p-4 bg-gray-100 dark:bg-gray-900 rounded flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </div>
      )}

      {activeTab === 'analytics' ? (
        <DashboardAnalytics
          complaints={complaints}
          users={users}
          agencies={agencies}
        />
      ) : (
        <ul className="space-y-6">
          {complaints && complaints.length > 0 ? (
            complaints.map((c) => (
              <li key={c.id} className="bg-white dark:bg-gray-900 shadow rounded p-6 border-l-4 border-blue-700 dark:border-blue-400">
                <div className="flex justify-between items-center mb-2">
                  <strong className="text-lg">{c.title}</strong>
                  <span
                    className={(() => {
                      if (c.status === 'resolved') return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded text-xs font-semibold';
                      if (c.status === 'in_progress') return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 px-2 py-1 rounded text-xs font-semibold';
                      if (c.status === 'assigned') return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded text-xs font-semibold';
                      return 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 px-2 py-1 rounded text-xs font-semibold';
                    })()}
                  >
                    {c.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
                <div className="mb-2 text-gray-700 dark:text-gray-200">{c.description}</div>
                <form
                  className="flex flex-col md:flex-row md:items-center gap-2 mt-2"
                  onSubmit={e => {
                    e.preventDefault();
                    const status = e.target.status.value;
                    const response = e.target.response.value;
                    handleRespond(c.id, status, response);
                  }}
                >
                  <select
                    name="status"
                    defaultValue={c.status}
                    className="px-2 py-1 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  >
                    <option value="pending">Pending</option>
                    <option value="assigned">Assigned</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  <input
                    name="response"
                    placeholder="Response"
                    defaultValue={c.response || ''}
                    className="px-2 py-1 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 flex-1"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition font-semibold"
                    disabled={loading}
                  >
                    Update
                  </button>
                </form>
              </li>
            ))
          ) : (
            <li className="flex flex-col items-center justify-center py-16">
              <svg className="w-16 h-16 text-blue-200 dark:text-blue-800 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 018 0v2m-4-4v4m0 0v2m0-2h-4m4 0h4" />
              </svg>
              <span className="text-gray-500 dark:text-gray-400 text-lg">No complaints found.</span>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
