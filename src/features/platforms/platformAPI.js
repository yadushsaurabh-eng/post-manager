import { apiClient } from '../../services/api';

export const fetchPlatformsAPI = async () => {
  const response = await apiClient.get('/platforms');
  return response.data;
};

export const updatePlatformAPI = async (platform) => {
  const response = await apiClient.put(`/platforms/${platform.id}`, platform);
  return response.data;
};
