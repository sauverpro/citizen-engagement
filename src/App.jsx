import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import DashboardPage from './pages/citizen/Dashboard.jsx';
import ComplaintsPage from './pages/citizen/Complaints.jsx';
import SubmitComplaintPage from './pages/citizen/NewComplaint.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import Home from './pages/public/Home.jsx';
import { useState, useEffect } from 'react';
import * as api from './api/auth.js';
import { getComplaints, submitComplaint, respondToComplaint } from './api/complaints.js';
import useComplaintWebSocket from './hooks/useComplaintWebSocket.js';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { useAuthContext } from './hooks/useAuth.js';
import { ComplaintProvider } from './contexts/ComplaintContext.jsx';
import AgenciesPage from './pages/admin/Agencies.jsx';
import UsersPage from './pages/admin/Users.jsx';
import AgencyCasesPage from './pages/agency/Cases.jsx';
import ManageComplaintsPage from './pages/admin/ManageComplaints.jsx';

function DashboardPageRefined() {
  const { user } = useAuthContext();
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Citizen Engagement System</h1>
      {user ? (
        <>
          <p className="mb-4">Hello, <b>{user.email}</b>! You are logged in as <b>{user.role}</b>.</p>
          {user.role === 'citizen' && (
            <div className="space-y-2">
              <a href="/complaints" className="block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">View My Complaints</a>
              <a href="/submit" className="block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">Submit a New Complaint</a>
            </div>
          )}
          {user.role === 'admin' && (
            <div className="space-y-2">
              <a href="/admin" className="block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Admin Dashboard</a>
              <a href="/admin/agencies" className="block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition">Manage Agencies</a>
              <a href="/admin/users" className="block bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition">Manage Users</a>
              <a href="/admin/complaints" className="block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">Manage Complaints</a>
            </div>
          )}
          {user.role === 'agency' && (
            <div className="space-y-2">
              <a href="/agency/cases" className="block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">View Assigned Cases</a>
            </div>
          )}
        </>
      ) : (
        <>
          <p className="mb-4">Please <a href="/login" className="text-blue-600 underline">login</a> or <a href="/register" className="text-blue-600 underline">register</a> to get started.</p>
        </>
      )}
    </div>
  );
}

function AdminTabs({ complaints, onRespond }) {
  const [tab, setTab] = useState('complaints');
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex gap-2 mb-4">
        <button className={`px-4 py-2 rounded-t ${tab === 'complaints' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`} onClick={() => setTab('complaints')}>Complaints</button>
        <button className={`px-4 py-2 rounded-t ${tab === 'agencies' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`} onClick={() => setTab('agencies')}>Agencies</button>
        <button className={`px-4 py-2 rounded-t ${tab === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`} onClick={() => setTab('users')}>Users</button>
      </div>
      <div className="bg-white dark:bg-gray-900 shadow rounded-b p-4">
        {tab === 'complaints' && <AdminDashboard />}
        {tab === 'agencies' && <AgenciesPage />}
        {tab === 'users' && <UsersPage />}
      </div>
    </div>
  );
}

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, login } = useAuthContext();
  const [error, setError] = useState('');
  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate();

  // WebSocket: update complaint status in real time
  useComplaintWebSocket(user?.token, (data) => {
    setComplaints((prev) => prev.map(c => c.id === data.complaintId ? { ...c, status: data.status } : c));
  });

  const handleLogin = async (e, { email, password }) => {
    e.preventDefault();
    setError('');
    try {
      console.log('Starting login process...');
      const data = await api.login(email, password);
      console.log('Login successful:', data);

      if (!data.token) {
        throw new Error('No token received from server');
      }

      // Store the complete user data including the token
      const userData = {
        token: data.token,
        ...data.user
      };

      console.log('Setting user data:', userData);
      login(userData);

      // Redirect based on role
      if (userData.role === 'admin') {
        navigate('/admin');
      } else if (userData.role === 'agency') {
        navigate('/agency/cases');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login. Please check your credentials.');
    }
  };

  const handleRegister = async (e, { name, email, password }) => {
    e.preventDefault();
    setError('');
    try {
      await api.register(name, email, password);
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmitComplaint = async (e, data) => {
    e.preventDefault();
    setError('');
    const token = (user && user.token) ? user.token : localStorage.getItem('token');
    try {
      await submitComplaint(token, data);
      navigate('/complaints');
      fetchComplaints();
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchComplaints = async () => {
    const token = (user && user.token) ? user.token : localStorage.getItem('token');
    try {
      const data = await getComplaints(token);
      setComplaints(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRespond = async (id, status, response) => {
    setError('');
    const token = (user && user.token) ? user.token : localStorage.getItem('token');
    try {
      await respondToComplaint(token, id, status, response);
      fetchComplaints();
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch complaints when user navigates to /complaints
  useEffect(() => {
    if (user && user.role === 'citizen') {
      fetchComplaints();
    }
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    const handleToggleSidebar = () => setIsSidebarOpen(false);
    document.addEventListener('toggleSidebar', handleToggleSidebar);
    return () => document.removeEventListener('toggleSidebar', handleToggleSidebar);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {user && <Sidebar isOpen={isSidebarOpen} />}
      <div className={`relative flex-1 transition-all duration-300 z-10
        ${user ? 'md:ml-64' : 'ml-0'}`}>
        <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className={`${location.pathname === '/' ? 'p-0' : 'p-4'}`}>
          {error && <div className="text-red-600 mb-2">{error}</div>}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={
              user?.role === 'admin' ? <AdminDashboard /> : <DashboardPage />
            } />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onRegister={handleRegister} />} />
            <Route path="/complaints" element={<ComplaintsPage complaints={complaints} />} />
            <Route path="/submit" element={<SubmitComplaintPage onSubmit={handleSubmitComplaint} />} />
            <Route path="/admin/agencies" element={<AgenciesPage />} />
            <Route path="/admin/users" element={<UsersPage />} />
            <Route path="/admin/complaints" element={<ManageComplaintsPage />} />
            <Route path="/agency/cases" element={<AgencyCasesPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <AuthProvider>
      <ComplaintProvider>
        <App />
      </ComplaintProvider>
    </AuthProvider>
  );
}
