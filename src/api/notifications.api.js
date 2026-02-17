import axiosInstance from "./axiosInstance";

/**
 * Get all notifications for current user
 */
export const getMyNotifications = async () => {
  const response = await axiosInstance.get("/notifications");
  return response.data.notifications;
};

/**
 * Mark a notification as read
 */
export const markAsRead = async (id) => {
  const response = await axiosInstance.put(`/notifications/${id}/read`);
  return response.data;
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async () => {
  const response = await axiosInstance.put("/notifications/read-all");
  return response.data;
};

/**
 * Delete a notification
 */
export const deleteNotification = async (id) => {
  const response = await axiosInstance.delete(`/notifications/${id}`);
  return response.data;
};
