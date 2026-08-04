import { apiClient } from '../../services/api';

export const fetchPostsAPI = async () => {
  const response = await apiClient.get('/posts');
  return response.data;
};

export const createPostAPI = async (postData) => {
  const response = await apiClient.post('/posts', postData);
  return response.data;
};

export const updatePostAPI = async (postData) => {
  const response = await apiClient.put(`/posts/${postData.id}`, postData);
  return response.data;
};

export const deletePostAPI = async (id) => {
  await apiClient.delete(`/posts/${id}`);
  return id;
};

export const changePostStatusAPI = async ({ id, status }) => {
  const response = await apiClient.patch(`/posts/${id}`, { status });
  return response.data;
};
