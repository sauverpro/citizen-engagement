import React, { useEffect, useState, useCallback } from 'react';
import { getComplaints, respondToComplaint, assignAgencyToComplaint } from '../../api/complaints.js';
import { getAgencies } from '../../api/agencies.js';
import { useAuthContext } from '../../hooks/useAuth.js';
import { FaEdit, FaBuilding, FaReply } from 'react-icons/fa';
import Table from '../../components/common/Table';

function RespondModal({ open, onClose, onSubmit, loading, complaint }) {
  const [status, setStatus] = useState(complaint?.status || 'pending');
  const [response, setResponse] = useState(complaint?.response || '');
  useEffect(() => {
    if (open && complaint) {
      setStatus(complaint.status);
      setResponse(complaint.response || '');
    }
  }, [open, complaint]);
  if (!open || !complaint) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 rounded shadow-lg p-6 w-full max-w-md relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl" onClick={onClose}>&times;</button>
        <h3 className="text-lg font-bold mb-4">Respond to Complaint</h3>
        <div className="mb-2"><b>Title:</b> {complaint.title}</div>
        <div className="mb-2"><b>Description:</b> {complaint.description}</div>
        <select
          className="w-full border rounded p-2 mb-2 dark:bg-gray-800"
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="assigned">Assigned</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
        <textarea
          className="w-full border rounded p-2 mb-4 dark:bg-gray-800"
          rows={3}
          placeholder="Response..."
          value={response}
          onChange={e => setResponse(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          onClick={() => onSubmit(status, response)}
          disabled={loading}
        >{loading ? 'Saving...' : 'Save Response'}</button>
      </div>
    </div>
  );
}

function AssignAgencyModal({ open, onClose, onSubmit, loading, agencies, complaint }) {
  const [agencyId, setAgencyId] = useState(complaint?.agencyId || '');
  useEffect(() => {
    if (open && complaint) setAgencyId(complaint.agencyId || '');
  }, [open, complaint]);
  if (!open || !complaint) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 rounded shadow-lg p-6 w-full max-w-md relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl" onClick={onClose}>&times;</button>
        <h3 className="text-lg font-bold mb-4">Assign Agency</h3>
        <div className="mb-2"><b>Title:</b> {complaint.title}</div>
        <select
          className="w-full border rounded p-2 mb-4 dark:bg-gray-800"
          value={agencyId}
          onChange={e => setAgencyId(e.target.value)}
        >
          <option value="">Select agency...</option>
          {agencies.map(a => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
          onClick={() => onSubmit(agencyId)}
          disabled={loading || !agencyId}
        >{loading ? 'Assigning...' : 'Assign Agency'}</button>
      </div>
    </div>
  );
}

export default function ManageComplaintsPage() {
  const { user } = useAuthContext();
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [respondModal, setRespondModal] = useState({ open: false, complaint: null });
  const [assignModal, setAssignModal] = useState({ open: false, complaint: null });

  const fetchComplaints = useCallback(async () => {
    const token = (user && user.token) ? user.token : localStorage.getItem('token');
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const data = await getComplaints(token);
      setComplaints(data);
      setFilteredComplaints(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchComplaints();
    const fetchAgenciesList = async () => {
      const token = (user && user.token) ? user.token : localStorage.getItem('token');
      if (!token) return;
      try {
        const data = await getAgencies(token);
        setAgencies(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch agencies');
      }
    };
    fetchAgenciesList();
  }, [fetchComplaints, user]);

  const handleRespond = async (id, status, response) => {
    const token = (user && user.token) ? user.token : localStorage.getItem('token');
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      await respondToComplaint(token, id, status, response);
      await fetchComplaints();
      setRespondModal({ open: false, complaint: null });
    } catch (err) {
      setError(err.message || 'Failed to update complaint');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignAgency = async (complaintId, agencyId) => {
    const token = (user && user.token) ? user.token : localStorage.getItem('token');
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      await assignAgencyToComplaint(token, complaintId, agencyId);
      await fetchComplaints();
      setAssignModal({ open: false, complaint: null });
    } catch (err) {
      setError(err.message || 'Failed to assign agency');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    const filtered = complaints.filter(complaint => 
      complaint.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredComplaints(filtered);
  };

  const handleSort = (key, direction) => {
    const sorted = [...filteredComplaints].sort((a, b) => {
      if (direction === 'asc') {
        return a[key] > b[key] ? 1 : -1;
      }
      return a[key] < b[key] ? 1 : -1;
    });
    setFilteredComplaints(sorted);
  };

  const handleFilter = (key, value) => {
    const filtered = complaints.filter(complaint => {
      if (key === 'status' && value) {
        return complaint.status === value;
      }
      if (key === 'agency' && value) {
        return complaint.agencyId === value;
      }
      return true;
    });
    setFilteredComplaints(filtered);
  };

  const columns = [
    {
      key: 'id',
      label: 'ID',
      sortable: true
    },
    {
      key: 'title',
      label: 'Title',
      sortable: true,
      filterable: true,
      render: (complaint) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-gray-100">{complaint.title}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{complaint.description}</div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      filterable: true,
      render: (complaint) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
          complaint.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
          complaint.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {complaint.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </span>
      ),
      filterComponent: (onFilterChange) => (
        <select
          onChange={(e) => onFilterChange(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="assigned">Assigned</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      )
    },
    {
      key: 'agency',
      label: 'Assigned Agency',
      sortable: true,
      filterable: true,
      render: (complaint) => {
        const agency = agencies.find(a => a.id === complaint.agencyId);
        return agency ? agency.name : '-';
      },
      filterComponent: (onFilterChange) => (
        <select
          onChange={(e) => onFilterChange(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          <option value="">All agencies</option>
          {agencies.map(agency => (
            <option key={agency.id} value={agency.id}>{agency.name}</option>
          ))}
        </select>
      )
    },
    {
      key: 'createdAt',
      label: 'Submitted',
      sortable: true,
      render: (complaint) => (
        <div>
          <div>{new Date(complaint.createdAt).toLocaleDateString()}</div>
          <div className="text-xs text-gray-500">{new Date(complaint.createdAt).toLocaleTimeString()}</div>
        </div>
      )
    }
  ];

  const renderActions = (complaint) => (
    <div className="flex justify-end gap-2">
      <button
        onClick={() => setRespondModal({ open: true, complaint })}
        className="text-gray-600 hover:text-blue-600"
        title="Respond to complaint"
      >
        <FaReply />
      </button>
      <button
        onClick={() => setAssignModal({ open: true, complaint })}
        className="text-gray-600 hover:text-purple-600"
        title="Assign agency"
      >
        <FaBuilding />
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Manage Complaints</h2>
      </div>

      {error && <div className="text-red-600 mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">{error}</div>}

      <Table
        columns={columns}
        data={filteredComplaints}
        onSort={handleSort}
        onFilter={handleFilter}
        onSearch={handleSearch}
        actions={renderActions}
        loading={loading}
        emptyMessage="No complaints found"
      />

      <RespondModal
        open={respondModal.open}
        onClose={() => setRespondModal({ open: false, complaint: null })}
        onSubmit={(status, response) => handleRespond(respondModal.complaint.id, status, response)}
        loading={loading}
        complaint={respondModal.complaint}
      />

      <AssignAgencyModal
        open={assignModal.open}
        onClose={() => setAssignModal({ open: false, complaint: null })}
        onSubmit={agencyId => handleAssignAgency(assignModal.complaint.id, agencyId)}
        loading={loading}
        agencies={agencies}
        complaint={assignModal.complaint}
      />
    </div>
  );
}
