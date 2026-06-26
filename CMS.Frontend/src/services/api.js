import axios from 'axios';

export const BACKEND_URL = import.meta.env.VITE_IMAGE_BASE_URL || import.meta.env.VITE_API_URL;
export const API_BASE_URL = import.meta.env.VITE_API_URL || `${BACKEND_URL}/api`;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Tự động gắn Content-Type và token vào header
apiClient.interceptors.request.use((config) => {
  // Nếu body là FormData thì để axios tự set multipart/form-data với boundary
  // Nếu không thì mặc định dùng application/json
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }

  const customerInfo = JSON.parse(localStorage.getItem('customerInfo'));
  if (customerInfo?.token) {
    config.headers.Authorization = `Bearer ${customerInfo.token}`;
  }
  return config;
});

export default apiClient;
