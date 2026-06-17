import apiClient from './api';

export const getPosts = () => apiClient.get('/posts').then(r => r.data);

export const getPostById = (id) => apiClient.get(`/posts/${id}`).then(r => r.data);
