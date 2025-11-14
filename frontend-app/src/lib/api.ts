import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API untuk data User (yang sudah ada)
export const userApi = {
  getUsers: () => apiClient.get('/api/users'),
  getUser: (id: string) => apiClient.get(`/api/users/${id}`),
  createUser: (userData: { name: string; email: string; age: number }) => 
    apiClient.post('/api/users', userData),
  updateUser: (id: string, userData: { name?: string; email?: string; age?: number }) => 
    apiClient.put(`/api/users/${id}`, userData),
  deleteUser: (id: string) => apiClient.delete(`/api/users/${id}`),
};

// API baru untuk Autentikasi
export const authApi = {
  register: (userData: any) => apiClient.post('/api/auth/register', userData),
  login: (credentials: any) => apiClient.post('/api/auth/login', credentials),
};