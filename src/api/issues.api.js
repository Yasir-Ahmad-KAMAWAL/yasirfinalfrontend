import axiosInstance from "./axiosInstance";

export const getAllIssuesApi = () => axiosInstance.get("/issues/all");