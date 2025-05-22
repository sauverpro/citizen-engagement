import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';
// Import your pages
import Home from './pages/citizen/Dashboard.jsx';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import Dashboard from './pages/citizen/Dashboard.jsx';
import NewComplaint from './pages/citizen/NewComplaint.jsx';
// Placeholders for agency/admin pages
// import Cases from './pages/agency/Cases.jsx';
// import Agencies from './pages/admin/Agencies.jsx';

function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Citizen Routes */}
          <Route element={<ProtectedRoute allowedRoles={['citizen']} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/complaints/new" element={<NewComplaint />} />
          </Route>

          {/* Agency Routes */}
          {/* <Route element={<ProtectedRoute allowedRoles={['agency']} />}>
            <Route path="/agency/cases" element={<Cases />} />
          </Route> */}

          {/* Admin Routes */}
          {/* <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/agencies" element={<Agencies />} />
          </Route> */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppRouter;
