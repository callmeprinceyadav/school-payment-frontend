import axios from 'axios';

// API Base URL - temporarily hardcoded for deployment
const API_BASE_URL = 'https://school-payment-backend-five.vercel.app/api';

// Debug: Log the API URL
console.log('🔧 API_BASE_URL:', API_BASE_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
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

// Transaction API functions
export const transactionAPI = {
  // Get all transactions with pagination and filters
  getTransactions: async (params = {}) => {
    const response = await api.get('/transactions', { params });
    return response.data;
  },

  // Get all transactions (alias for getTransactions for consistency)
  getAllTransactions: async (params = {}) => {
    const response = await api.get('/transactions', { params });
    return response.data;
  },

  // Get transactions by school
  getTransactionsBySchool: async (schoolId, params = {}) => {
    const response = await api.get(`/transactions/school/${schoolId}`, { params });
    return response.data;
  },

  // Get transaction status by custom order ID
  getTransactionStatus: async (customOrderId) => {
    const response = await api.get(`/transaction-status/${customOrderId}`);
    return response.data;
  },
};

// Auth API functions
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
};

// Payment API functions
export const paymentAPI = {
  createPayment: async (paymentData) => {
    const response = await api.post('/create-payment', paymentData);
    return response.data;
  },
};

export default api;