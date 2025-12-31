import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export default api;
