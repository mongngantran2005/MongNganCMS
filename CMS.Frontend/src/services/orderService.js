import apiClient from './api';

const getCustomerId = () => {
  const info = JSON.parse(localStorage.getItem('customerInfo'));
  return info ? info.id : 0;
};

export const createOrder = (data) => apiClient.post('/orders', data).then(r => r.data);

export const getMyOrders = () => apiClient.get(`/orders/customer/${getCustomerId()}`).then(r => r.data);

export const getOrderById = (id) => apiClient.get(`/orders/${id}`).then(r => r.data);
