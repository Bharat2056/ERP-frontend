import React, { createContext, useState, useEffect } from 'react';

// 1. Create the Context
export const AuthContext = createContext();

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // When the app loads, check if they have a saved passport in their browser
  useEffect(() => {
    const savedUserInfo = localStorage.getItem('nexus_erp_user');
    if (savedUserInfo) {
      setUser(JSON.parse(savedUserInfo));
    }
    setLoading(false);
  }, []);

  // The Login Function
  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data);
        // Save the passport to the browser so they stay logged in!
        localStorage.setItem('nexus_erp_user', JSON.stringify(data));
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Server connection failed.' };
    }
  };

  // The Logout Function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('nexus_erp_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};