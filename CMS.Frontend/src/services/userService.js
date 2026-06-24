import apiClient from './api';

export const login = (data) => apiClient.post('/customers/login', data).then(r => r.data);

export const register = (data) => apiClient.post('/customers/register', data).then(r => r.data);

const getCustomerId = () => {
  const info = JSON.parse(localStorage.getItem('customerInfo'));
  return info ? info.id : 0;
};

export const getProfile = () => apiClient.get(`/customers/${getCustomerId()}`).then(r => r.data);

export const updateProfile = (data) =>
  apiClient.put(`/customers/${getCustomerId()}`, data).then(r => r.data);

export const changePassword = (data) =>
  apiClient.post(`/customers/${getCustomerId()}/change-password`, data).then(r => r.data);

// --- Address Book APIs ---
export const getAddresses = () =>
  apiClient.get(`/customers/${getCustomerId()}/addresses`).then(r => r.data);

export const addAddress = (data) =>
  apiClient.post(`/customers/${getCustomerId()}/addresses`, data).then(r => r.data);

export const updateAddress = (id, data) =>
  apiClient.put(`/customers/${getCustomerId()}/addresses/${id}`, data).then(r => r.data);

export const deleteAddress = (id) =>
  apiClient.delete(`/customers/${getCustomerId()}/addresses/${id}`).then(r => r.data);

export const setDefaultAddress = (id) =>
  apiClient.put(`/customers/${getCustomerId()}/addresses/${id}/set-default`).then(r => r.data);
