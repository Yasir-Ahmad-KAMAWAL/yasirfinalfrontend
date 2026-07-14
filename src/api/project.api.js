import axiosInstance from "./axiosInstance";

export const getMyProjectsApi = () => axiosInstance.get("/projects/my");
export const getProjectByIdApi = (projectId) => axiosInstance.get(`/projects/${projectId}`);
export const createProjectApi = (data) => axiosInstance.post("/projects", data);
export const updateProjectApi = (projectId, data) => axiosInstance.patch(`/projects/${projectId}`, data);
export const deleteProjectApi = (projectId) => axiosInstance.delete(`/projects/${projectId}`);
export const setProjectLeadApi = (projectId, userId) =>
  axiosInstance.patch(`/projects/${projectId}/lead`, { userId });