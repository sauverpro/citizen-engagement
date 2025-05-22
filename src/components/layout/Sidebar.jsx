import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuth.js';
import { FaTachometerAlt, FaUser, FaBuilding, FaClipboardList, FaUsers, FaSignInAlt, FaUserPlus, FaHome } from 'react-icons/fa';

const navConfig = (user) => {
  if (!user) {
    return [
      { section: 'GENERAL', items: [
        { to: '/', label: 'Home', icon: <FaHome /> },
        { to: '/login', label: 'Login', icon: <FaSignInAlt /> },
        { to: '/register', label: 'Register', icon: <FaUserPlus /> },
      ]}
    ];
  }
  if (user.role === 'citizen') {
    return [
      { section: 'GENERAL', items: [
        { to: '/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
        { to: '/complaints', label: 'My Complaints', icon: <FaClipboardList /> },
        { to: '/submit', label: 'Submit Complaint', icon: <FaClipboardList /> },
      ]}
    ];
  }
  if (user.role === 'admin') {
    return [
      { section: 'GENERAL', items: [
        { to: '/dashboard', label: 'Analytics Dashboard', icon: <FaTachometerAlt /> },
        { to: '/admin/agencies', label: 'Manage Agencies', icon: <FaBuilding /> },
        { to: '/admin/complaints', label: 'Manage Complaints', icon: <FaClipboardList /> },
        { to: '/admin/users', label: 'Manage Users', icon: <FaUsers /> },
      ]}
    ];
  }
  if (user.role === 'agency') {
    return [
      { section: 'GENERAL', items: [
        { to: '/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
        { to: '/agency/cases', label: 'Assigned Cases', icon: <FaClipboardList /> },
      ]}
    ];
  }
  return [];
};

export default function Sidebar({ isOpen }) {
  const location = useLocation();
  const { user } = useAuthContext();
  const token = (user && user.token) ? user.token : localStorage.getItem('token');
  if (!token) return null;
  const navSections = navConfig(user);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" 
          onClick={() => document.dispatchEvent(new CustomEvent('toggleSidebar'))}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-screen bg-gray-900 text-white shadow-lg transition-all duration-300 z-30
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:w-64 
        ${isOpen ? 'w-64' : 'w-0'}`}>
        <div className="flex items-center gap-2 px-6 py-6 mb-4">
          <span className="text-2xl font-extrabold tracking-wide">🏛️</span>
          <span className="text-xl font-bold tracking-wide">CitizenSys</span>
        </div>
        <nav className="flex-1 overflow-y-auto">
          {navSections.map(section => (
            <div key={section.section} className="mb-6">
              <div className="px-6 text-xs text-gray-400 uppercase mb-2 tracking-widest">{section.section}</div>
              <ul className="space-y-1">
                {section.items.map(item => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={`flex items-center gap-3 px-6 py-2 rounded-l-full transition font-medium
                        ${location.pathname === item.to
                          ? 'bg-blue-700 text-white shadow'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}