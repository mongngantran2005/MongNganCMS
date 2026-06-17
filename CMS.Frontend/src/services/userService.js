import apiClient from './api';

export const login = (data) => apiClient.post('/auth/login', data).then(r => r.data);

export const register = (data) => apiClient.post('/auth/register', data).then(r => r.data);

export const getProfile = () => apiClient.get('/customers/profile').then(r => r.data);

export const updateProfile = (data) =>
  apiClient.put('/customers/profile', data).then(r => r.data);

export const changePassword = (data) =>
  apiClient.post('/customers/change-password', data).then(r => r.data);
