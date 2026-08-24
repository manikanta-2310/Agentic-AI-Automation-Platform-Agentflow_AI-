import axios from 'axios';

// Default to live Render backend URL in production, or localhost in dev if explicit
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://agentflow-backend-p03g.onrender.com/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: Attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('agentflow_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Clear token if invalid or unauthorized
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
        localStorage.removeItem('agentflow_token');
        localStorage.removeItem('agentflow_user');
      }
    }
    return Promise.reject(error);
  }
);

// API Service Functions
export const api = {
  // Health
  getHealth: () => apiClient.get('/health').then((r) => r.data),

  // Auth
  register: (data) => apiClient.post('/auth/register', data).then((r) => r.data),
  login: (data) => apiClient.post('/auth/login', data).then((r) => r.data),
  getMe: () => apiClient.get('/auth/me').then((r) => r.data),

  // Workflows
  getDashboardMetrics: () => apiClient.get('/workflows/dashboard').then((r) => r.data),
  getWorkflows: (params) => apiClient.get('/workflows', { params }).then((r) => r.data),
  getWorkflow: (id) => apiClient.get(`/workflows/${id}`).then((r) => r.data),
  createWorkflow: (data) => apiClient.post('/workflows', data).then((r) => r.data),
  generateWorkflow: (prompt) => apiClient.post('/workflows/generate', { prompt }).then((r) => r.data),
  updateWorkflow: (id, data) => apiClient.put(`/workflows/${id}`, data).then((r) => r.data),
  duplicateWorkflow: (id) => apiClient.post(`/workflows/${id}/duplicate`).then((r) => r.data),
  executeWorkflow: (id, inputPayload = {}) => apiClient.post(`/workflows/${id}/execute`, { inputPayload }).then((r) => r.data),
  deleteWorkflow: (id) => apiClient.delete(`/workflows/${id}`).then((r) => r.data),

  // Executions
  getExecutions: (params) => apiClient.get('/executions', { params }).then((r) => r.data),
  getExecution: (id) => apiClient.get(`/executions/${id}`).then((r) => r.data),
  getExecutionTimeline: (id) => apiClient.get(`/executions/${id}/timeline`).then((r) => r.data),
  pauseExecution: (id) => apiClient.post(`/executions/${id}/pause`).then((r) => r.data),
  resumeExecution: (id) => apiClient.post(`/executions/${id}/resume`).then((r) => r.data),
  cancelExecution: (id) => apiClient.post(`/executions/${id}/cancel`).then((r) => r.data),

  // Integrations
  getIntegrations: () => apiClient.get('/integrations').then((r) => r.data),
  getIntegrationStatus: () => apiClient.get('/integrations/status').then((r) => r.data),
  getOAuthStartUrl: (provider) => apiClient.get(`/integrations/oauth/${provider}/start`).then((r) => r.data),
  saveIntegration: (data) => apiClient.post('/integrations', data).then((r) => r.data),
  testIntegration: (provider) => apiClient.post(`/integrations/${provider}/test`).then((r) => r.data),

  // Notifications
  getNotifications: (params) => apiClient.get('/notifications', { params }).then((r) => r.data),
  markNotificationRead: (id) => apiClient.put(`/notifications/${id}/read`).then((r) => r.data),
  markAllNotificationsRead: () => apiClient.put('/notifications/read-all').then((r) => r.data)
};
