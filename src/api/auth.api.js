import axiosInstance from "./axiosInstance";

export const signupApi = (data) => axiosInstance.post("/auth/signup", data);
export const loginApi = (data) => axiosInstance.post("/auth/login", data);
export const logoutApi = () => axiosInstance.post("/auth/logout");
export const getCurrentUserApi = () => axiosInstance.get("/auth/me");
export const forgotPasswordApi = (data) => axiosInstance.post("/auth/forgot-password", data);
export const resetPasswordApi = (data) => axiosInstance.post("/auth/reset-password", data);
