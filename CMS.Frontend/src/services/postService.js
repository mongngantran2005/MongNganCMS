import apiClient from './api';

export const getPosts = (limit = null) => {
  const url = limit ? `/posts?limit=${limit}` : '/posts';
  return apiClient.get(url).then(r => r.data);
};

export const getLatestPosts = (limit = 4) =>
  apiClient.get(`/posts/latest?limit=${limit}`).then(r => r.data);

export const getPostById = (id) => apiClient.get(`/posts/${id}`).then(r => r.data);
