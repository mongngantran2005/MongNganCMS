import apiClient from './api';

export const getProducts = () => apiClient.get('/products').then(r => r.data);

export const getProductById = (id) => apiClient.get(`/products/${id}`).then(r => r.data);

export const getProductsByCategory = (categoryId) =>
  apiClient.get(`/products/category/${categoryId}`).then(r => r.data);

export const searchProducts = (keyword) =>
  apiClient.get(`/products?search=${encodeURIComponent(keyword)}`).then(r => r.data);

export const getCategories = () =>
  apiClient.get('/categoryproducts').then(r => r.data);
