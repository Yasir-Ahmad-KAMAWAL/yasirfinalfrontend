import axiosInstance from "./axiosInstance";

export const toggleFavoriteApi = (taskId) =>
  axiosInstance.post(`/favorites/${taskId}`);

export const getFavoritesApi = () => axiosInstance.get("/favorites");

export const getFavoriteStatusApi = () => axiosInstance.get("/favorites/status");