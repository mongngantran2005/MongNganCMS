import apiClient from './api';

export const createOrder = (data) => apiClient.post('/orders', data).then(r => r.data);

export const getMyOrders = () => apiClient.get('/orders/my').then(r => r.data);

export const getOrderById = (id) => apiClient.get(`/orders/${id}`).then(r => r.data);
