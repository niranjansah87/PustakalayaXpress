import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { API_ENDPOINTS } from '../config/api';

interface User {
  id: number;
  email: string;
  name: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

interface JwtPayload {
  user_id: number;
  email: string;
  name: string;
  exp: number;
  iat: number;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load tokens and user data from localStorage on mount
    const storedToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    const storedUserId = localStorage.getItem('userId');

    if (storedToken && storedRefreshToken && storedUserId) {
      try {
        const decoded: JwtPayload = jwtDecode(storedToken);
        setToken(storedToken);
        setRefreshToken(storedRefreshToken);
        setUser({
          id: decoded.user_id,
          email: decoded.email,
          name: decoded.name,
        });
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
      }
    }

    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });

    const { access, refresh } = response.data;
    const decoded: JwtPayload = jwtDecode(access);

    setToken(access);
    setRefreshToken(refresh);
    setUser({
      id: decoded.user_id,
      email: decoded.email,
      name: decoded.name,
    });

    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    localStorage.setItem('userId', String(decoded.user_id));
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await axios.post(API_ENDPOINTS.AUTH.REGISTER, {
      name,
      email,
      password,
    });

    const { access, refresh } = response.data;
    const decoded: JwtPayload = jwtDecode(access);

    setToken(access);
    setRefreshToken(refresh);
    setUser({
      id: decoded.user_id,
      email: decoded.email,
      name: decoded.name,
    });

    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    localStorage.setItem('userId', String(decoded.user_id));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
  };

  const refreshAuthToken = useCallback(async () => {
    if (!refreshToken) {
      console.error('No refresh token available');
      logout();
      throw new Error('No refresh token available');
    }

    console.log('Attempting token refresh with:', refreshToken);
    const response = await axios.post(API_ENDPOINTS.AUTH.REFRESH, {
      refresh: refreshToken,
    });

    console.log('Refresh response:', response.data);
    const { access } = response.data;
    const decoded: JwtPayload = jwtDecode(access);

    setToken(access);
    setUser({
      id: decoded.user_id,
      email: decoded.email,
      name: decoded.name,
    });
    localStorage.setItem('accessToken', access);
    localStorage.setItem('userId', String(decoded.user_id));

    return access;
  }, [refreshToken]);

  // Set up axios interceptor
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (token && config.url?.includes('/api/')) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          console.log('Received 401, attempting to refresh token');
          try {
            const newToken = await refreshAuthToken();
            console.log('New token obtained:', newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
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
  }, [token, refreshAuthToken]);

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