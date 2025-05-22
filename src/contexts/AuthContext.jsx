import React, { useState, useEffect } from 'react';
import { verifyToken } from '../api/auth.js';
import { AuthContext } from './AuthContextContext.js';
import { useNavigate } from 'react-router-dom';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) return setLoading(false);
      try {
        const userData = await verifyToken(token);
        setUser({ ...userData, token });
      } catch {
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = (userData) => {
    if (!userData || !userData.token) {
      console.error('Invalid login data:', userData);
      return;
    }
    
    localStorage.setItem('token', userData.token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    // reload the page
    navigate('/');
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
