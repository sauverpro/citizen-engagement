import React, { useEffect, useState, useCallback } from 'react';
import { getComplaints, respondToComplaint } from '../../api/complaints.js';
import { useAuthContext } from '../../hooks/useAuth.js';
import { FaCheckCircle, FaClock, FaExclamationCircle, FaChartBar, FaFilter, FaSort, FaSearch, FaHistory, FaInbox } from 'react-icons/fa';

function ComplaintDetailsModal({ open, onClose, complaint, setResponseModal }) {
  if (!open || !complaint) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
        <button 
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xl" 
          onClick={onClose}
        >
          &times;
        </button>
        
        <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Complaint Details #{complaint.id}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Title</h4>
              <p className="text-lg font-medium text-gray-900 dark:text-white">{complaint.title}</p>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</h4>
              <p className="text-lg font-medium text-gray-900 dark:text-white">{complaint.category}</p>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h4>
              <span className={`inline-block px-3 py-1 text-sm rounded-full mt-1 ${
                complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                complaint.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {complaint.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>
          </div>

          <div>
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Submitted By</h4>
              <p className="text-lg font-medium text-gray-900 dark:text-white">{complaint.userEmail}</p>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Submitted On</h4>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {new Date(complaint.createdAt).toLocaleDateString()} at {new Date(complaint.createdAt).toLocaleTimeString()}
              </p>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</h4>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {new Date(complaint.updatedAt).toLocaleDateString()} at {new Date(complaint.updatedAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Description</h4>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <p className="text-gray-900 dark:text-gray-200 whitespace-pre-wrap">
              {complaint.description}
            </p>
          </div>
        </div>

        {complaint.response && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Agency Response</h4>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <p className="text-gray-900 dark:text-gray-200 whitespace-pre-wrap">
                {complaint.response}
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end space-x-4">
          <button
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
            onClick={onClose}
          >
            Close
          </button>
          {complaint.status !== 'resolved' && (
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => {
                onClose();
                setResponseModal({ open: true, complaint });
              }}
            >
              Respond
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ResponseModal({ open, onClose, complaint, onSubmit, loading }) {
  const [response, setResponse] = useState('');
  const [status, setStatus] = useState('in_progress');
  
  useEffect(() => { 
    setResponse('');
    setStatus('in_progress');
  }, [open]);

  if (!open || !complaint) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
        <button 
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xl" 
          onClick={onClose}
        >
          &times;
        </button>

        <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Respond to Complaint #{complaint.id}
        </h3>

        <div className="mb-6">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Complaint Details</h4>
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">{complaint.title}</p>
            <p className="text-gray-600 dark:text-gray-300">{complaint.description}</p>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Update Status
          </label>
          <select
            className="w-full border rounded-lg p-2 dark:bg-gray-800 dark:border-gray-700"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
          <p className="mt-1 text-sm text-gray-500">
            {status === 'resolved' ? 
              'Mark as resolved once the issue has been fully addressed.' :
              'Keep in progress if further action is needed.'}
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Response
          </label>
        <textarea
            className="w-full border rounded-lg p-3 dark:bg-gray-800 dark:border-gray-700"
            rows={6}
            placeholder="Enter your detailed response..."
          value={response}
          onChange={e => setResponse(e.target.value)}
        />
          <p className="mt-1 text-sm text-gray-500">
            Provide a clear and detailed response addressing the complaint.
          </p>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
            onClick={onClose}
          >
            Cancel
          </button>
        <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => onSubmit(response, status)}
            disabled={loading || !response.trim()}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : 'Submit Response'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AgencyCasesPage() {
  const { user } = useAuthContext();
  const [cases, setCases] = useState([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [responseModal, setResponseModal] = useState({ open: false, complaint: null });
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [timeRange, setTimeRange] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    averageResolutionTime: 0,
    responseRate: 0,
    lastWeekResolved: 0
  });

  const fetchCases = useCallback(async () => {
    console.log('Fetching cases...', { user });
    
    // Ensure user is logged in and is an agency
    if (!user?.token || user.role !== 'agency') {
      console.log('User validation failed:', { token: user?.token, role: user?.role });
      setError('Unauthorized access');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      console.log('Making API call with token:', user.token);
      const data = await getComplaints(user.token);
      console.log('API response:', data);
      
      setCases(data);

      // Calculate statistics
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      setStats({
        total: data.length,
        pending: data.filter(c => c.status === 'pending').length,
        inProgress: data.filter(c => c.status === 'in_progress').length,
        resolved: data.filter(c => c.status === 'resolved').length,
        averageResolutionTime: calculateAverageResolutionTime(data),
        responseRate: calculateResponseRate(data),
        lastWeekResolved: data.filter(c => 
          c.status === 'resolved' && 
          new Date(c.updatedAt) > oneWeekAgo
        ).length
      });

      // If no complaints are found, set a more specific error message
      if (data.length === 0) {
        setError('No complaints are currently assigned to your agency. This could be because no complaints have been assigned yet.');
      }
    } catch (err) {
      console.error('Error fetching cases:', err);
      setError(err.message || 'Failed to fetch cases');
      setCases([]);
      setStats({
        total: 0,
        pending: 0,
        inProgress: 0,
        resolved: 0,
        averageResolutionTime: 0,
        responseRate: 0,
        lastWeekResolved: 0
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  const calculateAverageResolutionTime = (complaints) => {
    const resolvedComplaints = complaints.filter(c => c.status === 'resolved');
    if (resolvedComplaints.length === 0) return 0;

    const totalTime = resolvedComplaints.reduce((acc, c) => {
      const created = new Date(c.createdAt);
      const resolved = new Date(c.resolvedAt || c.updatedAt);
      return acc + (resolved - created);
    }, 0);

    return Math.round((totalTime / resolvedComplaints.length / (1000 * 60 * 60 * 24)) * 10) / 10;
  };

  const calculateResponseRate = (complaints) => {
    const resolvedComplaints = complaints.filter(c => c.status === 'resolved');
    if (resolvedComplaints.length === 0) return 0;

    const totalResolved = resolvedComplaints.length;
    const totalCases = complaints.length;
    return Math.round((totalResolved / totalCases) * 100);
  };

  useEffect(() => {
    console.log('Component mounted, user:', user);
    fetchCases();
  }, [fetchCases]);

  const handleResponse = async (responseText, newStatus) => {
    // Ensure user is logged in and is an agency
    if (!user?.token || user.role !== 'agency') {
      setError('Unauthorized access');
      return;
    }

    // Ensure the complaint belongs to this agency
    if (responseModal.complaint.agencyId !== user.agencyId) {
      setError('You are not authorized to respond to this complaint');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await respondToComplaint(user.token, responseModal.complaint.id, newStatus, responseText);
      setResponseModal({ open: false, complaint: null });
      await fetchCases();
    } catch (err) {
      setError(err.message || 'Failed to submit response');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getFilteredAndSortedCases = () => {
    let filtered = [...cases];

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(c => c.status === filterStatus);
    }

    // Apply time range filter
    if (timeRange !== 'all') {
      const now = new Date();
      const timeRangeMap = {
        'today': 1,
        'week': 7,
        'month': 30
      };
      const days = timeRangeMap[timeRange];
      filtered = filtered.filter(c => {
        const createdDate = new Date(c.createdAt);
        const diffTime = Math.ceil((now - createdDate) / (1000 * 60 * 60 * 24));
        return diffTime <= days;
      });
    }

    // Apply search filter
    if (search) {
      filtered = filtered.filter(c =>
        c.title?.toLowerCase().includes(search.toLowerCase()) ||
        c.category?.toLowerCase().includes(search.toLowerCase()) ||
        c.status?.toLowerCase().includes(search.toLowerCase()) ||
        c.description?.toLowerCase().includes(search.toLowerCase()) ||
        c.userEmail?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'createdAt' || sortField === 'updatedAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  };

  const filteredCases = getFilteredAndSortedCases();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agency Case Management</h1>
          <p className="mt-2 text-gray-600">
            Managing complaints for {user?.agencyName || 'your agency'}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaExclamationCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      ) : cases.length === 0 ? (
        <div className="text-center py-12">
          <FaInbox className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No cases found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No complaints are currently assigned to your agency.
          </p>
        </div>
      ) : (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 uppercase">Total Cases</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Response Rate: {Math.round(stats.responseRate)}%
                  </p>
                </div>
                <FaChartBar className="text-3xl text-blue-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 uppercase">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Require Attention
                  </p>
                </div>
                <FaClock className="text-3xl text-yellow-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 uppercase">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Being Handled
                  </p>
                </div>
                <FaExclamationCircle className="text-3xl text-indigo-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 uppercase">Resolved</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Last Week: +{stats.lastWeekResolved}
                  </p>
                </div>
                <FaCheckCircle className="text-3xl text-green-500" />
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search cases..."
                    className="pl-10 pr-4 py-2 border rounded-lg w-64"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <FaFilter className="text-gray-400" />
                  <select
                    className="px-4 py-2 border rounded-lg"
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">Sort by:</span>
                <button
                  className={`px-4 py-2 rounded-lg ${
                    sortField === 'createdAt' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
                  }`}
                  onClick={() => handleSort('createdAt')}
                >
                  Date {sortField === 'createdAt' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
                <button
                  className={`px-4 py-2 rounded-lg ${
                    sortField === 'status' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
                  }`}
                  onClick={() => handleSort('status')}
                >
                  Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
              </div>
            </div>
          </div>

          {/* Case Management Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {filteredCases.length === 0 ? (
              <div className="text-center py-12">
                <div className="flex justify-center">
                  <FaInbox className="text-4xl text-gray-400 mb-4" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Complaints Found</h3>
                <p className="text-gray-500">
                  {search || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filters'
                    : 'No complaints are currently assigned to your agency'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Citizen</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCases.map((complaint) => (
                      <tr key={complaint.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{complaint.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="font-medium">{complaint.title}</div>
                          {complaint.priority === 'high' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                              High Priority
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                            complaint.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {complaint.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {complaint.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600">
                                {complaint.user?.email?.[0]?.toUpperCase() || 'U'}
                              </span>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{complaint.user?.email || 'Unknown User'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>{new Date(complaint.createdAt).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-400">
                            {new Date(complaint.createdAt).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>{new Date(complaint.updatedAt).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-400">
                            {new Date(complaint.updatedAt).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => setSelected(complaint)}
                          >
                            View
                          </button>
                          {complaint.status !== 'resolved' && (
                            <button
                              className="text-green-600 hover:text-green-900"
                              onClick={() => setResponseModal({ open: true, complaint })}
                            >
                              Respond
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      <ComplaintDetailsModal
        open={!!selected}
        onClose={() => setSelected(null)}
        complaint={selected}
        setResponseModal={setResponseModal}
      />

      <ResponseModal
        open={responseModal.open}
        onClose={() => setResponseModal({ open: false, complaint: null })}
        complaint={responseModal.complaint}
        onSubmit={handleResponse}
        loading={loading}
      />
    </div>
  );
}

