import axiosInstance from "./axiosInstance";

export const signupApi = (data) => axiosInstance.post("/auth/signup", data);
export const loginApi = (data) => axiosInstance.post("/auth/login", data);
export const logoutApi = () => axiosInstance.post("/auth/logout");
export const getCurrentUserApi = () => axiosInstance.get("/auth/me");
