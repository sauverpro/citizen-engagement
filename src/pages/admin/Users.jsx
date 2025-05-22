import React, { useEffect, useState } from 'react';
import { getUsers, updateUser, deleteUser, createUser } from '../../api/users';
import { getAgencies } from '../../api/agencies';
import { useAuthContext } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import Table from '../../components/common/Table';
import UserForm from '../../components/UserModal/UserForm.jsx';
import UserDetails from '../../components/UserModal/UserDetails.jsx';
import DeleteConfirm from '../../components/UserModal/DeleteConfirm.jsx';
import { FaEdit, FaEye, FaTrash, FaUserPlus, FaBuilding } from 'react-icons/fa';

const Users = () => {
  const { user } = useAuthContext();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAssignAgencyModalOpen, setIsAssignAgencyModalOpen] = useState(false);
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'citizen',
    agencyId: '',
    password: ''
  });

  useEffect(() => {
    fetchUsers();
    fetchAgencies();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const data = await getUsers(token);
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgencies = async () => {
    try {
      const token = getAuthToken();
      const data = await getAgencies(token);
      setAgencies(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

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
    const filtered = users.filter(user => 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleSort = (key, direction) => {
    const sorted = [...filteredUsers].sort((a, b) => {
      if (direction === 'asc') {
        return a[key] > b[key] ? 1 : -1;
      }
      return a[key] < b[key] ? 1 : -1;
    });
    setFilteredUsers(sorted);
  };

  const handleFilter = (key, value) => {
    const filtered = users.filter(user => {
      if (key === 'role' && value) {
        return user.role === value;
      }
      if (key === 'agency' && value) {
        return user.agencyId === value;
      }
      return true;
    });
    setFilteredUsers(filtered);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      agencyId: user.agencyId || '',
      password: ''
    });
    setIsEditModalOpen(true);
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const token = getAuthToken();
      await createUser(formData, token);
      toast.success('User created successfully');
      setIsCreateModalOpen(false);
      setFormData({
        name: '',
        email: '',
        role: 'citizen',
        agencyId: '',
        password: ''
      });
      fetchUsers();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const token = getAuthToken();
      await updateUser(selectedUser.id, formData, token);
      toast.success('User updated successfully');
      setIsEditModalOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const token = getAuthToken();
      await deleteUser(token, selectedUser.id);
      toast.success('User deleted successfully');
      setIsDeleteModalOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAssignAgency = (user) => {
    setSelectedUser(user);
    setFormData({
      ...formData,
      agencyId: user.agencyId || ''
    });
    setIsAssignAgencyModalOpen(true);
  };

  const handleAssignAgencySubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getAuthToken();
      await updateUser(selectedUser.id, { agencyId: formData.agencyId }, token);
      toast.success('Agency assigned successfully');
      setIsAssignAgencyModalOpen(false);
      setSelectedUser(null);
      fetchUsers();
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
      key: 'email',
      label: 'Email',
      sortable: true,
      filterable: true
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      filterable: true,
      render: (user) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          user.role === 'admin' ? 'bg-blue-100 text-blue-800' :
          user.role === 'agency' ? 'bg-purple-100 text-purple-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </span>
      ),
      filterComponent: (onFilterChange) => (
        <select
          onChange={(e) => onFilterChange(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          <option value="">All roles</option>
          <option value="admin">Admin</option>
          <option value="agency">Agency</option>
          <option value="citizen">Citizen</option>
        </select>
      )
    },
    {
      key: 'agency',
      label: 'Agency',
      sortable: true,
      filterable: true,
      render: (user) => {
        const agency = agencies.find(a => a.id === user.agencyId);
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
    }
  ];

  const renderActions = (user) => (
    <div className="flex justify-end gap-2">
      <button
        onClick={() => handleView(user)}
        className="text-gray-600 hover:text-blue-600"
        title="View details"
      >
        <FaEye />
      </button>
      <button
        onClick={() => handleEdit(user)}
        className="text-gray-600 hover:text-green-600"
        title="Edit user"
      >
        <FaEdit />
      </button>
      {user.role === 'agency' && (
        <button
          onClick={() => handleAssignAgency(user)}
          className="text-gray-600 hover:text-purple-600"
          title="Assign to agency"
        >
          <FaBuilding />
        </button>
      )}
      <button
        onClick={() => handleDelete(user)}
        className="text-gray-600 hover:text-red-600"
        title="Delete user"
      >
        <FaTrash />
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Users</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaUserPlus />
          Add User
        </button>
      </div>

      <Table
        columns={columns}
        data={filteredUsers}
        onSort={handleSort}
        onFilter={handleFilter}
        onSearch={handleSearch}
        actions={renderActions}
        loading={loading}
        emptyMessage="No users found"
      />

      <UserForm
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateUser}
        form={formData}
        setForm={setFormData}
        agencies={agencies}
      />

      <UserForm
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={handleUpdateUser}
        form={formData}
        setForm={setFormData}
        agencies={agencies}
      />

      {/* New Agency Assignment Modal */}
      <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full ${isAssignAgencyModalOpen ? '' : 'hidden'}`}>
        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div className="mt-3">
            <h3 className="text-lg font-medium text-gray-900">Assign Agency</h3>
            <form onSubmit={handleAssignAgencySubmit} className="mt-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Agency</label>
                <select
                  value={formData.agencyId}
                  onChange={(e) => setFormData({ ...formData, agencyId: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select an agency</option>
                  {agencies.map(agency => (
                    <option key={agency.id} value={agency.id}>{agency.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAssignAgencyModalOpen(false);
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Assign
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <UserDetails
        open={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />

      <DeleteConfirm
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleDeleteUser}
        user={selectedUser}
      />
    </div>
  );
};

export default Users;
