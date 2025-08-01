import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Configuração base do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
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

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API de autenticação
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }),
  
  getMe: () => api.get('/auth/me'),
  
  updateProfile: (data: { name?: string; email?: string }) =>
    api.put('/auth/me', data),
  
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put('/auth/change-password', { currentPassword, newPassword }),
  
  logout: () => api.post('/auth/logout'),
};

// API de leads
export const leadsApi = {
  generateLeads: (filters: any) =>
    api.post('/leads/generate', filters),
  
  downloadCsv: (filename: string) =>
    api.get(`/leads/download/${filename}`, { responseType: 'blob' }),
  
  getSearchHistory: () => api.get('/leads/history'),
  
  getLeadStats: () => api.get('/leads/stats'),
  
  searchLeads: (params: any) => api.get('/leads/search', { params }),
};

// API de usuários
export const usersApi = {
  getCredits: () => api.get('/users/credits'),
  
  updateCredits: (amount: number, operation: 'add' | 'subtract') =>
    api.put('/users/credits', { amount, operation }),
};

// API de pagamentos
export const paymentsApi = {
  createPaymentIntent: (amount: number, packageName: string) =>
    api.post('/payments/create-intent', { amount, package: packageName }),
  
  confirmPayment: (paymentIntentId: string, amount: number) =>
    api.post('/payments/confirm', { paymentIntentId, amount }),
  
  getPaymentHistory: () => api.get('/payments/history'),
  
  getPackages: () => api.get('/payments/packages'),
};

export default api; 