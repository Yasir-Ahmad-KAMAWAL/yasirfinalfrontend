import axiosInstance from "./axiosInstance";

export const getProjectTasksApi = (projectId) => axiosInstance.get(`/projects/${projectId}/tasks`);
export const createTaskApi = (projectId, data) => axiosInstance.post(`/projects/${projectId}/tasks`, data);
export const updateTaskApi = (projectId, taskId, data) =>
  axiosInstance.patch(`/projects/${projectId}/tasks/${taskId}`, data);
export const deleteTaskApi = (projectId, taskId) =>
  axiosInstance.delete(`/projects/${projectId}/tasks/${taskId}`);

// Sub-task / Sub-issue APIs
export const getSubTasksApi = (projectId, taskId) =>
  axiosInstance.get(`/projects/${projectId}/tasks/${taskId}/subtasks`);
export const createSubTaskApi = (projectId, taskId, data) =>
  axiosInstance.post(`/projects/${projectId}/tasks/${taskId}/subtasks`, data);