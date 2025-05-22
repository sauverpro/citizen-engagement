import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

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
    <nav className="bg-blue-700 dark:bg-gray-900 text-white px-4 py-3 flex justify-between items-center shadow-md">
      <div className="font-bold text-xl tracking-wide">
        <Link to="/">Citizen Engagement</Link>
      </div>
      <div className="space-x-6 text-base flex items-center">
        <Link to="/complaints" className="hover:underline">My Complaints</Link>
        <Link to="/submit" className="hover:underline">Submit</Link>
        <Link to="/admin" className="hover:underline">Admin</Link>
        <Link to="/login" className="hover:underline">Login</Link>
        <button
          onClick={() => setDark(d => !d)}
          className="ml-4 px-2 py-1 rounded bg-gray-200 dark:bg-gray-800 text-blue-700 dark:text-blue-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          aria-label="Toggle dark mode"
        >
          {dark ? '🌙' : '☀️'}
        </button>
      </div>
    </nav>
  );
}
