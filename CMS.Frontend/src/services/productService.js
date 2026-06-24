import apiClient from './api';

export const getProducts = (limit = null) => {
  const url = limit ? `/products?limit=${limit}` : '/products';
  return apiClient.get(url).then(r => r.data);
};

export const getProductById = (id) => apiClient.get(`/products/${id}`).then(r => r.data);

export const getProductsByCategory = (categoryId) =>
  apiClient.get(`/products/category/${categoryId}`).then(r => r.data);

export const searchProducts = (keyword) =>
  apiClient.get(`/products?search=${encodeURIComponent(keyword)}`).then(r => r.data);

export const getHotProducts = (limit = 3) =>
  apiClient.get(`/products/hot?limit=${limit}`).then(r => r.data);

export const getCategories = () =>
  apiClient.get('/categoryproducts').then(r => r.data);
