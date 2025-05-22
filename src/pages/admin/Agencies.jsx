import React, { useEffect, useState } from 'react';
import { getAgencies, createAgency, updateAgency, deleteAgency } from '../../api/agencies';
import { useAuthContext } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import Table from '../../components/common/Table';
import { FaEdit, FaTrash, FaBuilding } from 'react-icons/fa';

function AgencyFormModal({ open, onClose, onSubmit, loading, agency = null }) {
  const [form, setForm] = useState({
    name: '',
    categories: '',
    contactEmail: ''
  });

  useEffect(() => {
    if (open && agency) {
      setForm({
        name: agency.name,
        categories: Array.isArray(agency.categories) ? agency.categories.join(', ') : agency.categories,
        contactEmail: agency.contactEmail
      });
    } else {
      setForm({
        name: '',
        categories: '',
        contactEmail: ''
      });
    }
  }, [open, agency]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      ...form,
      categories: form.categories.split(',').map(cat => cat.trim()).filter(cat => cat)
    };
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white dark:bg-gray-800 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100" id="modal-title">
                {agency ? 'Edit Agency' : 'Create New Agency'}
              </h3>

              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Agency Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="categories" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Categories (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="categories"
                    id="categories"
                    value={form.categories}
                    onChange={(e) => setForm(prev => ({ ...prev, categories: e.target.value }))}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    id="contactEmail"
                    value={form.contactEmail}
                    onChange={(e) => setForm(prev => ({ ...prev, contactEmail: e.target.value }))}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : agency ? 'Update Agency' : 'Create Agency'}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ open, onClose, onConfirm, loading, agency }) {
  if (!open || !agency) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <FaTrash className="h-6 w-6 text-red-600" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100" id="modal-title">
                Delete Agency
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete the agency "{agency.name}"? This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AgenciesPage() {
  const { user } = useAuthContext();
  const [agencies, setAgencies] = useState([]);
  const [filteredAgencies, setFilteredAgencies] = useState([]);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchAgencies = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const data = await getAgencies(token);
      setAgencies(data);
      setFilteredAgencies(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgencies();
  }, []);

  const getAuthToken = () => {
    const contextToken = user?.token;
    const localToken = localStorage.getItem('token');
    const token = contextToken || localToken;
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    return token;
  };

  const handleSearch = (searchTerm) => {
    const filtered = agencies.filter(agency => 
      agency.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.categories?.join(',').toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.contactEmail?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAgencies(filtered);
  };

  const handleSort = (key, direction) => {
    const sorted = [...filteredAgencies].sort((a, b) => {
      if (direction === 'asc') {
        return a[key] > b[key] ? 1 : -1;
      }
      return a[key] < b[key] ? 1 : -1;
    });
    setFilteredAgencies(sorted);
  };

  const handleFilter = (key, value) => {
    const filtered = agencies.filter(agency => {
      if (key === 'categories' && value) {
        return agency.categories.includes(value);
      }
      return true;
    });
    setFilteredAgencies(filtered);
  };

  const handleCreate = async (formData) => {
    try {
      const token = getAuthToken();
      await createAgency(token, formData);
      toast.success('Agency created successfully');
      setIsCreateModalOpen(false);
      fetchAgencies();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEdit = async (formData) => {
    try {
      const token = getAuthToken();
      await updateAgency(token, selectedAgency.id, formData);
      toast.success('Agency updated successfully');
      setIsEditModalOpen(false);
      setSelectedAgency(null);
      fetchAgencies();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async () => {
    try {
      const token = getAuthToken();
      await deleteAgency(token, selectedAgency.id);
      toast.success('Agency deleted successfully');
      setIsDeleteModalOpen(false);
      setSelectedAgency(null);
      fetchAgencies();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      filterable: true
    },
    {
      key: 'categories',
      label: 'Categories',
      sortable: true,
      filterable: true,
      render: (agency) => (
        <div className="flex flex-wrap gap-1">
          {agency.categories.map((category, index) => (
            <span
              key={index}
              className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              {category}
            </span>
          ))}
        </div>
      )
    },
    {
      key: 'contactEmail',
      label: 'Contact Email',
      sortable: true,
      filterable: true
    },
    {
      key: 'createdAt',
      label: 'Created At',
      sortable: true,
      render: (agency) => (
        <div>
          <div>{new Date(agency.createdAt).toLocaleDateString()}</div>
          <div className="text-xs text-gray-500">{new Date(agency.createdAt).toLocaleTimeString()}</div>
        </div>
      )
    }
  ];

  const renderActions = (agency) => (
    <div className="flex justify-end gap-2">
      <button
        onClick={() => {
          setSelectedAgency(agency);
          setIsEditModalOpen(true);
        }}
        className="text-gray-600 hover:text-green-600"
        title="Edit agency"
      >
        <FaEdit />
      </button>
      <button
        onClick={() => {
          setSelectedAgency(agency);
          setIsDeleteModalOpen(true);
        }}
        className="text-gray-600 hover:text-red-600"
        title="Delete agency"
      >
        <FaTrash />
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Agencies</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaBuilding />
          Add Agency
        </button>
      </div>

      <Table
        columns={columns}
        data={filteredAgencies}
        onSort={handleSort}
        onFilter={handleFilter}
        onSearch={handleSearch}
        actions={renderActions}
        loading={loading}
        emptyMessage="No agencies found"
      />

      <AgencyFormModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreate}
        loading={loading}
      />

      <AgencyFormModal
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedAgency(null);
        }}
        onSubmit={handleEdit}
        loading={loading}
        agency={selectedAgency}
      />

      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedAgency(null);
        }}
        onConfirm={handleDelete}
        loading={loading}
        agency={selectedAgency}
      />
    </div>
  );
}
