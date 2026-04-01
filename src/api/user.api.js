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
/**
 * Upload profile picture
 */
export const uploadProfilePicture = async (formData) => {
  const response = await axiosInstance.post("/user/profile-picture", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 * Get all users (admin only)
 */
export const getAllUsers = async (params = {}) => {
  const response = await axiosInstance.get("/user", { params });
  return response.data;
};

/**
 * Toggle user status (admin only)
 */
export const toggleUserStatus = async (userId) => {
  const response = await axiosInstance.patch(`/user/${userId}/toggle-status`);
  return response.data;
};

/**
 * Create user by admin (admin only)
 */
export const createUserByAdmin = async (userData) => {
  const response = await axiosInstance.post("/user", userData);
  return response.data;
};

/**
 * Delete user (admin only)
 */
export const deleteUser = async (userId) => {
  const response = await axiosInstance.delete(`/user/${userId}`);
  return response.data;
};
