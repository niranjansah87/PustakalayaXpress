import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

interface User {
  id: number;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load tokens from localStorage on mount
    const storedToken = localStorage.getItem('access_token');
    const storedRefreshToken = localStorage.getItem('refresh_token');
    
    if (storedToken && storedRefreshToken) {
      setToken(storedToken);
      setRefreshToken(storedRefreshToken);
      // Optionally, fetch user data if an endpoint exists
      // For now, assume user data is not stored; set a placeholder or fetch if available
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });

      const { access, refresh } = response.data;
      
      setToken(access);
      setRefreshToken(refresh);
      // Backend does not return user data in the provided LoginView; set minimal user data
      setUser({ id: 0, email, name: '' }); // Adjust based on actual response if user data is included
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
    } catch (error) {
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post(API_ENDPOINTS.AUTH.REGISTER, {
        name,
        email,
        password,
      });

      const { access, refresh } = response.data;
      
      setToken(access);
      setRefreshToken(refresh);
      setUser({ id: 0, email, name }); // Adjust based on actual response if user data is included
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    // No need to call logout endpoint since it only returns a message
  };

  const refreshAuthToken = async () => {
    try {
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post(API_ENDPOINTS.AUTH.REFRESH, {
        refresh: refreshToken,
      });

      const { access } = response.data;
      setToken(access);
      localStorage.setItem('access_token', access);
      
      return access;
    } catch (error) {
      logout();
      throw error;
    }
  };

  // Set up axios interceptor
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (token && config.url?.includes('/api/')) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await refreshAuthToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [token, refreshToken]);

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;