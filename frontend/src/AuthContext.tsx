import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    const response = await axios.post('/api/auth/login/', {
      email,
      password,
    });
    
    const { access, user: userData } = response.data;
    setToken(access);
    setUser(userData);
    localStorage.setItem('token', access);
    axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
  };

  const register = async (name, email, password) => {
    const response = await axios.post('/api/auth/register/', {
      name,
      email,
      password,
    });
    
    const { access, user: userData } = response.data;
    setToken(access);
    setUser(userData);
    localStorage.setItem('token', access);
    axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};