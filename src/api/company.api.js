import axiosInstance from "./axiosInstance";

export const getMyCompanyApi = () => axiosInstance.get("/companies/me");
export const getCompanyUsersApi = () => axiosInstance.get("/companies/users");
