import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios interceptor to add JWT token to requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const { state } = JSON.parse(authStorage);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch (error) {
        console.error('Error parsing auth storage:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Axios interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth and redirect to login
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const promptsAPI = {
  // Get available AI models
  getModels: async () => {
    const response = await api.get('/prompts/models');
    return response.data;
  },

  // Create a new prompt and get aggregated responses
  createPrompt: async (data) => {
    const response = await api.post('/prompts', data);
    return response.data;
  },

  // Get all prompts
  getPrompts: async (params = {}) => {
    const response = await api.get('/prompts', { params });
    return response.data;
  },

  // Get a specific prompt by ID
  getPromptById: async (id) => {
    const response = await api.get(`/prompts/${id}`);
    return response.data;
  },
};

export const authAPI = {
  // Register a new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

export default api;
