import axiosInstance from "./axiosInstance";

/**
 * Get user profile
 */
export const getProfile = async () => {
  const response = await axiosInstance.get("/user/profile");
  return response.data;
};

/**
 * Update user profile
 */
export const updateProfile = async (data) => {
  const response = await axiosInstance.put("/user/profile", data);
  return response.data;
};

/**
 * Change password
 */
export const changePassword = async (data) => {
  const response = await axiosInstance.put("/user/change-password", data);
  return response.data;
};

/**
 * Toggle 2FA on/off
 */
export const toggle2FA = async () => {
  const response = await axiosInstance.put("/user/toggle-2fa");
  return response.data;
};
