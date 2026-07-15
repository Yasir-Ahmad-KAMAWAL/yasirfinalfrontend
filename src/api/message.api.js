import axiosInstance from "./axiosInstance";

export const sendMessageApi = (data) =>
  axiosInstance.post("/messages/send", data);

export const getReceivedMessagesApi = () =>
  axiosInstance.get("/messages/received");

export const getSentMessagesApi = () =>
  axiosInstance.get("/messages/sent");

export const getUnreadCountApi = () =>
  axiosInstance.get("/messages/unread-count");

export const markAsReadApi = (messageId) =>
  axiosInstance.patch(`/messages/${messageId}/read`);

export const getCompanyUsersApi = () =>
  axiosInstance.get("/messages/users");

export const getUserTasksApi = () =>
  axiosInstance.get("/messages/my-tasks");