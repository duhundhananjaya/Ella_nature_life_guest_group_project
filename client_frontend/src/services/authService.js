// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/client/auth';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Register new user
  register: (data) => api.post('/register', data),
  
  // Login user
  login: (data) => api.post('/login', data),
  
  // Verify email
  verifyEmail: (token) => api.get(`/verify-email/${token}`),
  
  // Resend verification email
  resendVerification: (email) => api.post('/resend-verification', { email }),
  
  // Forgot password
  forgotPassword: (email) => api.post('/forgot-password', { email }),
  
  // Reset password
  resetPassword: (token, data) => api.put(`/reset-password/${token}`, data),
  
  // Get current user profile
  getProfile: () => api.get('/me'),
  
  // Update profile
  updateProfile: (data) => api.put('/update-profile', data),
  
  // Change password
  changePassword: (data) => api.put('/change-password', data),
  
  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default authService;