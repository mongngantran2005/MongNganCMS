import axios from 'axios';

// Base URL for the ASP.NET Core Backend WebAPI
const API_BASE_URL = 'http://localhost:5188/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Post endpoints
export const getPosts = async () => {
  const response = await apiClient.get('/posts');
  return response.data;
};

// Product endpoints
export const getProducts = async () => {
  const response = await apiClient.get('/products');
  return response.data;
};

export default apiClient;
