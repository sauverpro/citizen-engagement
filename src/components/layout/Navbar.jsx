import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuth.js';
import { FaMoon, FaSun, FaBell, FaCog, FaUserCircle, FaSearch, FaBars } from 'react-icons/fa';

function ProfileDropdown({ user, onLogout }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="relative">
      <button
        className="flex items-center focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={() => setOpen((o) => !o)}
        aria-label="User menu"
      >
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || user?.email || 'U')}&background=0D8ABC&color=fff`}
          alt="avatar"
          className="w-10 h-10 rounded-full border-2 border-blue-200 shadow-sm object-cover"
        />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-2xl py-3 z-50 border border-blue-100 dark:border-gray-800 animate-fade-in">
          <div className="px-4 py-2 text-gray-700 dark:text-gray-200 font-semibold border-b border-gray-100 dark:border-gray-800 mb-2">
            Welcome {user?.name ? user.name.split(' ')[0] : user?.email || 'User'}!
          </div>
          <ul className="space-y-1 px-2">
            <li><a href="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"><span className="text-lg"><i className="fa-regular fa-user-circle" /></span> Profile</a></li>
          </ul>
          <button
            className="flex items-center gap-2 w-full px-3 py-2 mt-2 text-red-600 hover:bg-red-50 dark:hover:bg-gray-800 rounded-lg font-semibold transition"
            onClick={onLogout}
          >
            <span className="text-lg"><i className="fa-solid fa-right-from-bracket" /></span> Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default function Navbar({ onToggleSidebar }) {
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });
  const { user, logout } = useAuthContext();
  const location = useLocation();

  // Don't show navbar on home page if user is not logged in
  if (!user && location.pathname === '/') {
    return null;
  }

  React.useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <header className="bg-gray-900 dark:bg-gray-900 text-white px-4 py-3 flex justify-between items-center shadow-md">
      {/* Left: Logo/Title and Sidebar Toggle */}
      <div className="flex items-center gap-3 min-w-[180px]">
        {user && (
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            aria-label="Toggle sidebar"
          >
            <FaBars className="text-xl" />
          </button>
        )}
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 font-extrabold text-2xl tracking-wide hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded">
          <span role="img" aria-label="logo">🏛️</span>
          <span className="hidden sm:inline">CitizenSys</span>
        </Link>
      </div>
      {/* Center: Welcome or page title (optional) */}
      <div className="flex-1 flex justify-center">
        <span className="text-lg font-semibold tracking-wide hidden md:block">
          {user ? `Welcome${user.name ? ', ' + user.name : ''}!` : 'Empowering Citizens'}
        </span>
      </div>
      {/* Right: Icons, user info, search */}
      <div className="flex items-center gap-3 min-w-[220px] justify-end">
        {/* Dark mode toggle */}
        <button
          className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={() => setDark((prev) => !prev)}
          aria-label="Toggle dark mode"
        >
          {dark ? <FaMoon /> : <FaSun />}
        </button>
         
        {/* User info or login/register */}
        {user ? (
          <ProfileDropdown user={user} onLogout={logout} />
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400">
              Login
            </Link>
            <Link to="/register" className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded font-semibold focus:outline-none focus:ring-2 focus:ring-green-400">
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
