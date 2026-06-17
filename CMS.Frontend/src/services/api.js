import axios from 'axios';

export const BACKEND_URL = 'http://localhost:5188';
export const API_BASE_URL = `${BACKEND_URL}/api`;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Tự động gắn JWT token vào header nếu có
apiClient.interceptors.request.use((config) => {
  const customerInfo = JSON.parse(localStorage.getItem('customerInfo'));
  if (customerInfo?.token) {
    config.headers.Authorization = `Bearer ${customerInfo.token}`;
  }
  return config;
});

export default apiClient;
