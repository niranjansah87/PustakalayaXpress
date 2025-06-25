const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login/`,
    REGISTER: `${API_BASE_URL}/api/auth/register/`,
    REFRESH: `${API_BASE_URL}/api/auth/refresh/`,
  },
  BOOKS: {
    LIST_BY_USER: (userId: number) => `${API_BASE_URL}/api/books/user/${userId}/`,
    CREATE: `${API_BASE_URL}/api/books/`,
    DETAIL: `${API_BASE_URL}/api/books/`,
    UPDATE: (id: number) => `${API_BASE_URL}/api/books/${id}/update/`,
    DELETE: (id: number) => `${API_BASE_URL}/api/books/${id}/delete/`,
  },
};

export default API_BASE_URL;