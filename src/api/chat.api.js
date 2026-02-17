import axiosInstance from "./axiosInstance";

export const getChatUsers = async () => {
  const response = await axiosInstance.get("/chat/users");
  return response.data.users;
};

export const getMessageHistory = async (otherUserId) => {
  const response = await axiosInstance.get(`/chat/messages/${otherUserId}`);
  return response.data.messages;
};

export const markAsRead = async (senderId) => {
  const response = await axiosInstance.put(`/chat/mark-as-read/${senderId}`);
  return response.data;
};
