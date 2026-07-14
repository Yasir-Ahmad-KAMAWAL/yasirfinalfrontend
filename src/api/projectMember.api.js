import axiosInstance from "./axiosInstance";

export const getProjectMembersApi = (projectId) => axiosInstance.get(`/projects/${projectId}/members`);
export const addProjectMemberApi = (projectId, userId) =>
  axiosInstance.post(`/projects/${projectId}/members`, { userId });
export const removeProjectMemberApi = (projectId, userId) =>
  axiosInstance.delete(`/projects/${projectId}/members/${userId}`);
